"use server";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { connectToDatabase } from "@/lib/db/connect";
import { Beacon } from "@/lib/db/models/Beacon";
import { User } from "@/lib/db/models/User";

// Math formula to calculate real distance between two lat/lng points
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return (R * c).toFixed(1); // Returns string like "3.2"
}

async function getSessionUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("noxu_session")?.value;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload.userId as string;
  } catch (error) {
    return null;
  }
}

export async function createBeaconAction(data: {
  title: string;
  description: string;
  vibe: "coffee" | "dining" | "culture" | "nightlife";
  venueName: string;
  lat: number;
  lng: number;
}) {
  try {
    await connectToDatabase();
    const userId = await getSessionUserId();
    
    if (!userId) return { success: false, error: "Unauthorized" };

    const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000);

    const newBeacon = await Beacon.create({
      hostId: userId,
      title: data.title,
      description: data.description,
      vibe: data.vibe,
      venueName: data.venueName,
      location: {
        type: "Point",
        coordinates: [data.lng, data.lat], // MongoDB requires [lng, lat]
      },
      expiresAt,
    });

    return { success: true, beaconId: newBeacon._id.toString() };
  } catch (error) {
    console.error("Error creating beacon:", error);
    return { success: false, error: "Failed to broadcast beacon." };
  }
}

/**
 * Fetches active beacons, hides the user's own posts, and calculates distance
 */
export async function getActiveBeaconsAction(userLat?: number, userLng?: number) {
  try {
    await connectToDatabase();
    const userId = await getSessionUserId();
    
    if (!User) console.log("Registering User model manually...");

    // 1. Database Query: Only Active status, and DO NOT show my own posts
    const query: any = { status: "active" };
    if (userId) {
      query.hostId = { $ne: userId }; // $ne = Not Equal
    }

    // 2. Apply 50km Max Distance Filter if GPS is provided
    if (userLat && userLng) {
      query.location = {
        $near: {
          $geometry: { type: "Point", coordinates: [userLng, userLat] },
          $maxDistance: 50000 // 50,000 meters = 50km
        }
      };
    }

    const beacons = await Beacon.find(query)
      .populate({ path: "hostId", model: User, select: "name avatar age" })
      // If no GPS is provided, sort by newest. If GPS is provided, $near auto-sorts by closest!
      .sort(userLat ? {} : { createdAt: -1 }) 
      .lean();

    // 3. Format data and calculate distance string
    const formattedBeacons = beacons.map((b: any) => {
      let distanceString = "Nearby";

      // If we have user GPS, calculate the exact distance to the Beacon's coordinates
      if (userLat && userLng && b.location?.coordinates) {
        const beaconLng = b.location.coordinates[0];
        const beaconLat = b.location.coordinates[1];
        distanceString = `${calculateDistanceKm(userLat, userLng, beaconLat, beaconLng)} km`;
      }

      return {
        id: b._id.toString(),
        user: {
          name: b.hostId?.name || "Anonymous",
          avatar: b.hostId?.avatar || "https://api.dicebear.com/7.x/notionists/svg?seed=fallback",
          age: b.hostId?.age || 20,
        },
        title: b.title,
        description: b.description,
        time: "Active Now",
        location: "Hidden",
        distance: distanceString,
        spotsLeft: 1,
        mapPos: { 
          top: `${Math.floor(Math.random() * 60 + 20)}%`, 
          left: `${Math.floor(Math.random() * 60 + 20)}%` 
        } 
      };
    });

    return { success: true, beacons: formattedBeacons };
    
  } catch (error) {
    console.error("❌ CRITICAL Error fetching beacons:", error);
    return { success: false, beacons: [] };
  }
}
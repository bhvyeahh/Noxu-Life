export const MOCK_BEACONS = [
  { 
    id: "b1", 
    user: { name: "Sarah", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" }, 
    title: "Working & Matcha", 
    description: "Got a table at Blue Bottle. Bring your laptop.", 
    time: "Today, 2:00 PM", 
    location: "Blue Bottle, Williamsburg", // Hidden until accepted
    distance: "0.8 km", 
    spotsLeft: 1,
    mapPos: { top: "35%", left: "40%" } // For map UI mock
  },
  { 
    id: "b2", 
    user: { name: "Marcus", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80" }, 
    title: "Extra ticket for The Batman", 
    description: "Friend bailed. IMAX ticket. Movie at 8.", 
    time: "Tonight, 8:00 PM", 
    location: "AMC Lincoln Square", // Hidden until accepted
    distance: "2.1 km", 
    spotsLeft: 1,
    mapPos: { top: "60%", left: "70%" }
  },
];

export const MOCK_REQUESTS = [
  { id: "r1", user: { name: "David", age: 26, avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80" }, beaconTitle: "Extra ticket for The Batman", message: "Huge DC fan here! Would love to grab that ticket.", status: "pending", timeAgo: "10m ago" },
  { id: "r2", user: { name: "Aisha", age: 24, avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80" }, beaconTitle: "Working & Matcha", message: "I'm actually working on a coding project nearby, need matcha.", status: "hold", timeAgo: "1h ago" }
];

export const MOCK_CHATS = [
  { 
    id: "c1", 
    user: { name: "Elena", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80" }, 
    beaconTitle: "Late night ramen", 
    location: "Ichiran, Times Square", // Exact location revealed here!
    expiresIn: "14h 22m left",
    messages: [
      { id: "m1", senderId: "them", text: "Hey! Saw you accepted. You close by?", timestamp: "8:02 PM" },
      { id: "m2", senderId: "me", text: "Yeah just walking over now, be there in 5.", timestamp: "8:05 PM" },
      { id: "m3", senderId: "them", text: "Perfect, I'm waiting outside the front door.", timestamp: "8:06 PM" },
    ]
  }
];
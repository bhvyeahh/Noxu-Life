"use client";

import React from "react";
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import { MapPin } from "lucide-react";

interface VenueAutocompleteProps {
  onSelect: (venue: { name: string; lat: number; lng: number }) => void;
}

export function VenueAutocomplete({ onSelect }: VenueAutocompleteProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
        Google Maps API Key is missing. Check .env.local
      </div>
    );
  }

  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C7C7C] z-10" />
      
      <GooglePlacesAutocomplete
        apiKey={apiKey}
        selectProps={{
          placeholder: "Search Google Places...",
          onChange: async (val: any) => {
            if (!val) return;
            try {
              const results = await geocodeByAddress(val.label);
              const { lat, lng } = await getLatLng(results[0]);
              onSelect({ name: val.value.structured_formatting.main_text, lat, lng });
            } catch (error) {
              console.error("Error geocoding:", error);
            }
          },
          styles: {
            control: (provided) => ({
              ...provided,
              backgroundColor: "rgba(255,255,255,0.05)",
              borderColor: "rgba(255,255,255,0.1)",
              borderRadius: "0.75rem",
              paddingLeft: "2rem",
              height: "3rem",
              boxShadow: "none",
              color: "white",
            }),
            input: (provided) => ({ ...provided, color: "white" }),
            placeholder: (provided) => ({ ...provided, color: "#7C7C7C", fontSize: "0.875rem" }),
            singleValue: (provided) => ({ ...provided, color: "white" }),
            menu: (provided) => ({ ...provided, backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1rem", overflow: "hidden", marginTop: "0.5rem" }),
            option: (provided, state) => ({ ...provided, backgroundColor: state.isFocused ? "#CF5C36" : "transparent", color: "white", cursor: "pointer" }),
          },
        }}
      />
    </div>
  );
}
// components/travel/MapClient.tsx
// The actual Leaflet map — runs in the browser only (see TravelMap.tsx).
//
// Two pin types:
//   • Visited  — solid terracotta circle with cream ring
//   • Wishlist — dashed cream outline circle
//
// CartoDB Dark Matter tiles are used so the map matches the dark palette
// and require no API key.
"use client";

import { useEffect, useState }                              from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L                                                   from "leaflet";
import "leaflet/dist/leaflet.css";
import { travelData }                                      from "@/lib/data";

// ── Custom pin icons (DivIcon = raw HTML string rendered as a DOM node) ──────
// We create them inside the component to ensure L is only called client-side.
function createIcons() {
  // Visited: filled terracotta circle
  const visited = L.divIcon({
    html: `
      <div style="
        width:14px;height:14px;border-radius:50%;
        background:#c4703f;
        border:2px solid #e8dcc8;
        box-shadow:0 0 8px rgba(196,112,63,0.6);
      "></div>`,
    className: "",    // clear Leaflet's default white box
    iconAnchor: [7, 7],
    popupAnchor: [0, -12],
  });

  // Wishlist: transparent centre, dashed cream border
  const wishlist = L.divIcon({
    html: `
      <div style="
        width:14px;height:14px;border-radius:50%;
        background:rgba(232,220,200,0.08);
        border:2px dashed #e8dcc8;
        box-shadow:0 0 6px rgba(232,220,200,0.2);
      "></div>`,
    className: "",
    iconAnchor: [7, 7],
    popupAnchor: [0, -12],
  });

  return { visited, wishlist };
}

export default function MapClient() {
  // Icons are created once, after mount, so we're sure the DOM exists
  const [icons, setIcons] = useState<ReturnType<typeof createIcons> | null>(null);

  useEffect(() => {
    setIcons(createIcons());
  }, []);

  // Don't render anything until the icons are ready
  if (!icons) return null;

  return (
    <MapContainer
      // Centre view on a point that shows most of the world nicely
      center={[20, 10]}
      zoom={2}
      minZoom={2}
      // All interaction disabled — map is purely visual
      zoomControl={false}
      scrollWheelZoom={false}
      dragging={false}
      doubleClickZoom={false}
      touchZoom={false}
      keyboard={false}
      style={{ height: "500px", width: "100%", borderRadius: "16px", cursor: "default" }}
    >
      {/* CartoDB Dark Matter — dark basemap, no API key required */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        subdomains="abcd"
        maxZoom={19}
      />

      {/* ── Visited pins ─────────────────────────────── */}
      {travelData.visited.map((place) => (
        <Marker
          key={`visited-${place.name}`}
          position={place.coords}
          icon={icons.visited}
        >
          <Popup>
            <strong>{place.name}</strong>
            <br />
            <span style={{ color: "#c4703f", fontSize: "11px" }}>✓ Visited</span>
          </Popup>
        </Marker>
      ))}

      {/* ── Wishlist pins ─────────────────────────────── */}
      {travelData.wishlist.map((place) => (
        <Marker
          key={`wishlist-${place.name}`}
          position={place.coords}
          icon={icons.wishlist}
        >
          <Popup>
            <strong>{place.name}</strong>
            <br />
            <span style={{ color: "#e8dcc8", fontSize: "11px" }}>✦ Want to visit</span>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

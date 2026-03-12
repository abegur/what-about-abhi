// components/travel/TravelMap.tsx
// Server-safe wrapper for the Leaflet map.
//
// Leaflet reads from `window` on import, which crashes Next.js server-side
// rendering. `dynamic(..., { ssr: false })` tells Next.js to only load
// MapClient in the browser — never on the server.
import dynamic from "next/dynamic";

// Lazy-load the actual map component; show a placeholder while it loads
const MapClient = dynamic(() => import("./MapClient"), {
  ssr: false, // ← critical: skip server render
  loading: () => (
    <div className="h-[500px] bg-surface rounded-2xl border border-warm/5 flex items-center justify-center">
      <p className="text-warm/30 text-sm tracking-wide">Loading map…</p>
    </div>
  ),
});

export default function TravelMap() {
  return <MapClient />;
}

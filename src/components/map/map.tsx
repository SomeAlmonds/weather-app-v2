import type { LatLngTuple } from "leaflet";
import { useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

function  SetMapView({ latLng }: { latLng: LatLngTuple }) {
  // Restests the map center and view with animation
  const map = useMap();
  map.setView(latLng, map.getZoom(), {
    animate: true,
  });
  return null;
}

export default function Map() {
  const [mapCenter] = useState<LatLngTuple>([0, 0]);

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: 500, width: 500 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={mapCenter} />
      <SetMapView latLng={mapCenter} />
    </MapContainer>
  );
}

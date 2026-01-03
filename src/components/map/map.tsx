import type { LatLngTuple } from "leaflet";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import { selectLatLng } from "../../api/geocodingApi";

function SetMapView({ latLng }: { latLng: LatLngTuple }) {
  // Restests the map center and view with animation
  const map = useMap();
  map.setView(latLng, map.getZoom(), {
    animate: true,
  });
  return null;
}

export default function Map() {
  const mapCenter = useSelector(selectLatLng);

  return (
    <MapContainer
      center={mapCenter}
      zoom={10}
      scrollWheelZoom={true}
      style={{ height: 500, width: 500, margin: 20 }}
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

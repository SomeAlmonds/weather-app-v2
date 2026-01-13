import type { LatLngTuple } from "leaflet";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import { selectCurrentLocation } from "../../api/forecastApi";

function SetMapView({ latLng }: { latLng: LatLngTuple }) {
  // Restests the map center and view with animation
  const map = useMap();
  map.setView(latLng, map.getZoom(), {
    animate: true,
  });
  return null;
}

export default function Map({ isPending }: { isPending: boolean }) {
  const {latitude, longitude} = useSelector(selectCurrentLocation) ;

  return (
    <div className={`map-div ${isPending ? "pending" : ""}`}>
      <MapContainer center={[latitude, longitude]} zoom={10} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <SetMapView latLng={[latitude, longitude]} />
      </MapContainer>
    </div>
  );
}

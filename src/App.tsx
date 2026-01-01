import Map from "./components/map/map";
import "../node_modules/leaflet/dist/leaflet.css";
import { useDispatch } from "react-redux";
import type { AppDispatchType } from "./store";
import Header from "./components/map/header";
import { setLatLng } from "./api/geocodingApi";
import type { LatLngTuple } from "leaflet";
import { useEffect, useState } from "react";

function App() {
  const dispatch = useDispatch<AppDispatchType>();
  const [userLocation, setUserLocation] = useState<LatLngTuple>();

  // get user location
  try {
    navigator.geolocation.getCurrentPosition((position) =>
      setUserLocation([position.coords.latitude, position.coords.longitude])
    );
  } catch (err) {
    console.warn(err);
  }

  useEffect(() => {
    if (userLocation) dispatch(setLatLng(userLocation));
  }, [userLocation]);

  return (
    <>
      <Header />
      <Map />
    </>
  );
}

export default App;

import "../node_modules/leaflet/dist/leaflet.css";
import Header from "./components/map/header";
import Forecast from "./components/map/forecast";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchForecast,
  fetchPlaceName,
  selectCurrentLocation,
} from "./api/forecastApi";
import { selectLatLng, setLatLng } from "./api/geocodingApi";
import type { AppDispatchType } from "./store";

function App() {
  const dispatch = useDispatch<AppDispatchType>();
  const latlng = useSelector(selectLatLng);
  const currentLocation = useSelector(selectCurrentLocation);

  useEffect(() => {
    // set latLng to user coords or default coords
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        dispatch(
          setLatLng([
            Number(pos.coords.latitude.toFixed(2)),
            Number(pos.coords.longitude.toFixed(2)),
          ])
        );
      },
      (err) => {
        console.warn(err);
        setLatLng([15.46, 32.55]);
      }
    );
  }, []);

  useEffect(() => {
    // set current location to user location or default location
    if (latlng) {
      dispatch(fetchPlaceName(latlng));
    }
  }, [latlng]);
  useEffect(() => {
    // fetch current location forecast
    if (currentLocation.name != "initialState") {
      dispatch(
        fetchForecast([currentLocation.latitude, currentLocation.longitude])
      );
    }
  }, [currentLocation]);
  return (
    <>
      <Header />
      <Forecast />
    </>
  );
}

export default App;

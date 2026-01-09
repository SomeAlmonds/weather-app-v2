import "../node_modules/leaflet/dist/leaflet.css";
import Header from "./components/map/header";
import Forecast from "./components/map/forecast";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchForecast, fetchPlaceName } from "./api/forecastApi";
import {  selectLatLng, setLatLng } from "./api/geocodingApi";
import type { AppDispatchType } from "./store";

function App() {
  const dispatch = useDispatch<AppDispatchType>();
  const latlng = useSelector(selectLatLng);

  useEffect(() => {
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
    if (latlng) {
      dispatch(fetchForecast(latlng));
      dispatch(fetchPlaceName(latlng));
    }
  }, [latlng]);
  return (
    <>
      <Header />
      <Forecast />
      {/* <Map /> */}
    </>
  );
}

export default App;

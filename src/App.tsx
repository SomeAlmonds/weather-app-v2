import "../node_modules/leaflet/dist/leaflet.css";
import Map from "./components/map/map";
import Header from "./components/map/header";
import Current from "./components/map/current";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchForecast } from "./api/forecastApi";
import { selectLatLng, setLatLng } from "./api/geocodingApi";
import type { AppDispatchType } from "./store";

function App() {
  const dispatch = useDispatch<AppDispatchType>();
  dispatch(fetchForecast(useSelector(selectLatLng)));

  // get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        dispatch(
          setLatLng([position.coords.latitude, position.coords.longitude])
        );        
      },
      (err) => console.warn(err)
    );
  }, []);
  

  return (
    <>
      <Header />
      <Current />
      <Map />
    </>
  );
}

export default App;

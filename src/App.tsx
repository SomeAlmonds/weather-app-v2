import "./App.css";
import Map from "./components/map/map";
import "../node_modules/leaflet/dist/leaflet.css";
import SearchSuggestion from "./components/map/search";
import { useDispatch, useSelector } from "react-redux";
import { fetchForecast, selectCurrent, selectDaily } from "./api/forecastApi";
import type { AppDispatchType } from "./store";

function App() {
  const dispatch = useDispatch<AppDispatchType>();
  dispatch(fetchForecast({ latitude: 42.2, longitude: 32.24 }));

  const current = useSelector(selectDaily);
  console.log(current?.max_temperature);
  

  return (
    <>
      {/* {current.is_day} */}
      <SearchSuggestion />
      <Map />
    </>
  );
}

export default App;

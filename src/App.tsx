import "./App.css";
import Map from "./components/map/map";
import "../node_modules/leaflet/dist/leaflet.css";
import SearchSuggestion from "./components/map/search";

function App() {
  return (
    <>
      <SearchSuggestion />
      <Map />
    </>
  );
}

export default App;

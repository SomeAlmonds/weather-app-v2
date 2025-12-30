import { useEffect, useState } from "react";
import { fetchPlaces, selectAllPlaces } from "../../api/geocodingApi";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatchType } from "../../store";

export default function SearchSuggestion() {
  const [search, setSearch] = useState("");
  const places = useSelector(selectAllPlaces);

  const dispatch = useDispatch<AppDispatchType>();
  useEffect(() => {
    if (search) {
      dispatch(fetchPlaces(search));
    }
  }, [search]);

  return (
    <>
      <input
        type="text"
        name="search"
        value={search}
        autoComplete="off"
        onChange={(e) => setSearch(e.target.value)}
      />
      <div>
        {places.map((place) => {
          return <h4 key={place.id}>{place.name}</h4>;
        })}
      </div>
    </>
  );
}

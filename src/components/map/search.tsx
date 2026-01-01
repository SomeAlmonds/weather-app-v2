import { useEffect, useRef, useState } from "react";
import {
  fetchPlaces,
  selectAllPlaces,
  setLatLng,
} from "../../api/geocodingApi";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatchType } from "../../store";

export default function SearchSuggestion() {
  const dispatch = useDispatch<AppDispatchType>();

  const [search, setSearch] = useState("");
  const places = useSelector(selectAllPlaces);

  // to keep track of the element in fucos in the locations list without re-rendering
  // it starts with null in order to set it to 0 in the first arrowDown press instead of 1
  const focusedPlace: { current: null | number } = useRef(null);

  useEffect(() => {
    // when search input changs fetch new suggestions
    if (search) {
      dispatch(fetchPlaces(search));
    }
    focusedPlace.current = null;
  }, [search]);

  useEffect(() => {
    // chang height to a set number so I can add a smooth transition when it changes
    document
      .getElementsByClassName("search-suggestions")[0]
      .setAttribute("style", `height: ${30 * places.length}px`);
  }, [places]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key == "Enter") {
      // set latitude and longitude to use in forecast and map api
      dispatch(
        setLatLng([
          places[focusedPlace.current || 0].latitude,
          places[focusedPlace.current || 0].longitude,
        ])
      );

      // reset

      focusedPlace.current = null;
      setSearch("");
      document
        .getElementsByClassName("search-suggestions")[0]
        .setAttribute("style", "0");
    } else if (e.key == "ArrowDown") {
      // set focus on next element in locations list

      if (focusedPlace.current != null) {
        focusedPlace.current = Math.min(
          places.length,
          focusedPlace.current + 1
        );
      } else {
        focusedPlace.current = 0;
      }
      document.getElementById(`place-${focusedPlace.current}`)!.focus();
    } else if (e.key == "ArrowUp") {
      // set focus on previous element in locations list

      if (focusedPlace.current == 0) {
        // if in first element set focus to search input

        document.getElementById("search-input")!.focus();
        focusedPlace.current = null;
      } else if (focusedPlace.current) {
        focusedPlace.current -= 1;
        document.getElementById(`place-${focusedPlace.current}`)!.focus();
      }
    }
  };

  return (
    <div>
      <input
        className="search-input"
        id="search-input"
        type="text"
        name="search"
        placeholder="Search..."
        value={search}
        autoComplete="off"
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e)}
      />
      <ul className="search-suggestions">
        {places.map((place, i) => {
          return (
            <li
              className="suggestion-li"
              key={i}
              id={`place-${i}`}
              tabIndex={-1}
              onKeyDown={(e) => handleKeyDown(e)}
            >
              <p>{place.name}</p>
              <p>{place.country}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

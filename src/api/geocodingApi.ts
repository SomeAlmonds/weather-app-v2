import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  type EntityState,
} from "@reduxjs/toolkit";
import axios from "axios";
import type { RootStateType } from "../store";
import { type LatLngTuple } from "leaflet";

// Get locations search suggestion with name, county, latitude and longitude
// The API doesn't have options to fetch partial data about the locations so it returns some useless data in this case

// the type of endpoint response data is placeObj[]

// According to open meteo docs "Empty fields are not returned. E.g. admin4 will be missing if no fourth administrative level is available."
// therefore some properties in the interface are optional to avoid possible errors
// source:  https://open-meteo.com/en/docs/geocoding-api?name=new#json_return_object
interface placeObj {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code?: string;
  country_code?: string;
  admin1_id?: number;
  admin2_id?: string;
  admin3_id?: number;
  admin4_id?: number;
  timezone: string;
  population?: number;
  postcodes?: string[];
  country_id: number;
  country: string;
  admin1: string;
  admin2?: string;
  admin3?: string;
  admin4?: string;
}

const axios_instance = axios.create({
  baseURL: "https://geocoding-api.open-meteo.com/v1/",
});

export const fetchPlaces = createAsyncThunk(
  "places/fetchPlaces",
  async (name: string) => {
    const res = await axios_instance.get("/search", {
      params: {
        name,
        count: 10,
        language: "en",
        format: "json",
      },
    });
    return res.data.results as placeObj[];
  }
);

// a feature code describes the type of the location. (view: https://www.geonames.org/export/codes.html for the full list)
// this is a list of codes to filter out any un-wanted results such as airports parks unpopulated places etc
const feature_codes = ["PPL", "CST", "LK", "SEA"];
interface initialStateInterface extends EntityState<placeObj, number> {
  latLng: LatLngTuple;
}

const placesAdapter = createEntityAdapter<placeObj>();
const initialState: initialStateInterface = placesAdapter.getInitialState({
  latLng: [15.46, 32.55] as LatLngTuple,
});

const placesSlice = createSlice({
  name: "Places",
  initialState,
  reducers: {
    setLatLng: {
      reducer: (state, action: { type: string; payload: LatLngTuple }) => {
        state.latLng = action.payload;
      },
      prepare: (latLng: LatLngTuple) => {
        return { payload: latLng };
      },
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPlaces.fulfilled, (state, { payload }) => {
      try {
        // filter result for relevant locations
        const filteredList = payload.filter((obj) =>
          feature_codes.find((code) => obj.feature_code?.includes(code))
        );

        placesAdapter.setAll(state, filteredList);
      } catch (error) {
        placesAdapter.removeAll(state);
      }
    });
  },
});

export const { selectAll: selectAllPlaces } = placesAdapter.getSelectors(
  (state: RootStateType) => state.places
);
export const selectLatLng = (state: RootStateType) => state.places.latLng;

export const { setLatLng } = placesSlice.actions;

export default placesSlice.reducer;

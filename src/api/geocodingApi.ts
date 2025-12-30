import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import type { RootStateType } from "../store";

// Get locations search suggestion with name, county, latitude and longitude
// The API doesn't have options to fetch partial data about the locations so it returns some useless data in this case

// the type of endpoint response data is placeObj[]
interface placeObj {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code: string;
  country_code: string;
  admin1_id: number;
  admin2_id: string;
  admin3_id: number;
  admin4_id: number;
  timezone: string;
  population: number;
  postcodes: string[];
  country_id: number;
  country: string;
  admin1: string;
  admin2: string;
  admin3: string;
  admin4: string;
}

// https://geocoding-api.open-meteo.com/v1/search?name=Berlin&count=10&language=en&format=json
const axios_instance = axios.create({
  baseURL: "https://geocoding-api.open-meteo.com/v1/",
});

export const fetchPlaces = createAsyncThunk(
  "places/fetchPlaces",
  async (name: string) => {
    const res = await axios_instance.get("/search", {
      params: {
        name,
        count: 5,
        language: "en",
        format: "json",
      },
    });
    return res.data.results as placeObj[];
  }
);


        ///////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////
        
        /////START THE GITHUB REPO NOW   ////////////////////////

        ///////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////


const placesAdapter = createEntityAdapter<placeObj>();
const initialState = placesAdapter.getInitialState();

const placesSlice = createSlice({
  name: "Places",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPlaces.fulfilled, (state, { payload }) => {
      try {
        placesAdapter.setAll(state, payload);
      } catch (error) {
        placesAdapter.removeAll(state)
      }
    });
  },
});

export const { selectAll: selectAllPlaces } = placesAdapter.getSelectors(
  (state: RootStateType) => state.places
);
export default placesSlice.reducer;

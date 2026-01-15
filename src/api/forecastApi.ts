import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  type EntityState,
  type SerializedError,
} from "@reduxjs/toolkit";
import { fetchWeatherApi } from "openmeteo";
import type { RootStateType } from "../store";
import type { LatLngTuple } from "leaflet";
import type { placeObj } from "./geocodingApi";

const params = {
  daily: [
    "temperature_2m_max",
    "temperature_2m_min",
    "sunrise",
    "sunset",
    "uv_index_max",
  ],
  hourly: [
    "temperature_2m",
    "relative_humidity_2m",
    "apparent_temperature",
    "wind_speed_10m",
    "wind_direction_10m",
    "weather_code",
  ],
  current: "is_day",
  timezone: "auto",
};
const url = "https://api.open-meteo.com/v1/forecast";

export const fetchForecast = createAsyncThunk(
  "fetchForecast/forecast",
  async (latLng: LatLngTuple) => {
    const resList = await fetchWeatherApi(url, {
      ...params,
      latitude: latLng[0] || 15.46,
      longitude: latLng[1] || 32.55,
    });
    const res = resList[0];
    return res;
  }
);

// fetch location details from latitude and longitude

export const fetchPlaceName = createAsyncThunk(
  // the url is relative to this domain to leverage the rewrites config in "vercel.json"
  // so that the http request gets proxied through vercel's servers and avoiding mixed content errors
  "Places/fetchPlaceName",
  async (latlng: LatLngTuple) => {
    const res = await fetch(
      `/findNearbyPlaceNameJSON?lat=${latlng[0]}&lng=${latlng[1]}&username=a1mohanad`
    ).then((res) => res.json());

    return res.geonames[0];
  }
);

interface WeatherDataInterface {
  id: number;
  utcOffsetSeconds: number;
  current: {
    time: Date;
    is_day: number;
  };
  hourly: {
    time: Date[];
    temperature: Float32Array<ArrayBufferLike> | null;
    relative_humidity: Float32Array<ArrayBufferLike> | null;
    apparent_temperature: Float32Array<ArrayBufferLike> | null;
    wind_speed: Float32Array<ArrayBufferLike> | null;
    wind_direction: Float32Array<ArrayBufferLike> | null;
    weather_codes: Float32Array<ArrayBufferLike> | null;
  };
  daily: {
    time: Date[];
    max_temperature: Float32Array<ArrayBufferLike> | null;
    min_temperature: Float32Array<ArrayBufferLike> | null;
    sunrise: Date[];
    sunset: Date[];
    max_uv_index: Float32Array<ArrayBufferLike> | null;
  };
}

interface initialStateInterface
  extends EntityState<WeatherDataInterface, number> {
  currentLocation: placeObj;
  status: "FULFILLED" | "PENDING" | "REJECTED";
  error: SerializedError | null;
}

const forecastAdapter = createEntityAdapter<WeatherDataInterface>();
const initialState: initialStateInterface = forecastAdapter.getInitialState({
  currentLocation: {
    id: 0,
    name: "initialState",
    latitude: 0,
    longitude: 0,
    country: "",
  },
  status: "PENDING",
  error: null,
});

const forecastSlice = createSlice({
  name: "forecast",
  initialState,
  reducers: {
    setCurrentLocation: {
      reducer: (state, action: { type: string; payload: placeObj }) => {
        state.currentLocation = action.payload;
      },
      prepare: (location: placeObj) => {
        return { payload: location };
      },
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchForecast.fulfilled, (state, { payload }) => {
      // handling data according to api docs instructions

      const daily = payload.daily()!;
      const hourly = payload.hourly()!;
      const current = payload.current()!;
      const utcOffsetSeconds = payload.utcOffsetSeconds();

      const sunrise = daily.variables(2)!;
      const sunset = daily.variables(3)!;

      const weatherData: WeatherDataInterface = {
        id: 0,
        utcOffsetSeconds,
        current: {
          time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
          is_day: current.variables(0)!.value(),
        },
        hourly: {
          time: Array.from(
            {
              length:
                (Number(hourly.timeEnd()) - Number(hourly.time())) /
                hourly.interval(),
            },
            (_, i) =>
              new Date(
                (Number(hourly.time()) +
                  i * hourly.interval() +
                  utcOffsetSeconds) *
                  1000
              )
          ),
          temperature: hourly.variables(0)!.valuesArray(),
          relative_humidity: hourly.variables(1)!.valuesArray(),
          apparent_temperature: hourly.variables(2)!.valuesArray(),
          wind_speed: hourly.variables(3)!.valuesArray(),
          wind_direction: hourly.variables(4)!.valuesArray(),
          weather_codes: hourly.variables(5)!.valuesArray(),
        },
        daily: {
          time: Array.from(
            {
              length:
                ((Number(daily.timeEnd) - Number(daily.time())) /
                  daily.interval()) *
                1000,
            },
            (_, i) =>
              new Date(
                (Number(daily.time()) +
                  i * daily.interval() +
                  utcOffsetSeconds) *
                  1000
              )
          ),
          max_temperature: daily.variables(0)!.valuesArray(),
          min_temperature: daily.variables(1)!.valuesArray(),
          sunrise: [...Array(sunrise.valuesInt64Length())].map(
            (_, i) =>
              new Date(
                (Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000
              )
          ),
          sunset: [...Array(sunset.valuesInt64Length())].map(
            (_, i) =>
              new Date(
                (Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000
              )
          ),
          max_uv_index: daily.variables(4)!.valuesArray(),
        },
      };
      // end of handling data

      state.error = null;

      forecastAdapter.removeAll(state);
      forecastAdapter.addOne(state, weatherData);
      state.status = "FULFILLED";
      // console.log(state);
    });
    builder.addCase(fetchForecast.pending, (state) => {
      state.status = "PENDING";
      state.error = null;
    });
    builder.addCase(fetchForecast.rejected, (state, action) => {
      state.status = "REJECTED";
      state.error = action.error;
    });
    builder.addCase(fetchPlaceName.fulfilled, (state, action) => {
      const { adminName1, lat, lng, countryName } = action.payload;
      state.currentLocation = {
        id: 0,
        name: adminName1,
        latitude: lat,
        longitude: lng,
        country: countryName,
      };
    });
  },
});

export const selectStatus = (state: RootStateType) => state.forecast.status;

export const selectError = (state: RootStateType) => state.forecast.error;

export const selectCurrent = (state: RootStateType) =>
  state.forecast.entities[0].current;
export const selectDaily = (state: RootStateType) =>
  state.forecast.entities[0].daily;
export const selectHourly = (state: RootStateType) =>
  state.forecast.entities[0].hourly;
export const selecUtcOffsetMinutes = (state: RootStateType) =>
  state.forecast.entities[0].utcOffsetSeconds / 60;

export const selectCurrentLocation = (state: RootStateType) =>
  state.forecast.currentLocation;
export const { setCurrentLocation } = forecastSlice.actions;

export default forecastSlice.reducer;

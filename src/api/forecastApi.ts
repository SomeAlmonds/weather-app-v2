import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  type EntityState,
} from "@reduxjs/toolkit";
import { fetchWeatherApi } from "openmeteo";
import type { RootStateType } from "../store";
import type { LatLngTuple } from "leaflet";

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

interface WeatherDataInterface {
  id: number;
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
    weather_conditions: string[] | null;
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
  status: "FULFILLED" | "PENDING";
}

const weatherCodes: { [key: number]: string } = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rim fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  77: "Snow grains",
  80: "Slight rain shower",
  81: "Moderate rain shower",
  82: "Heavy rain shower",
  85: "Slight snow shower",
  86: "Heavy snow shower",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};
weatherCodes[9];

const forecastAdapter = createEntityAdapter<WeatherDataInterface>();
const initialState: initialStateInterface = forecastAdapter.getInitialState({
  status: "PENDING",
});

const forecastSlice = createSlice({
  name: "forecast",
  initialState,
  reducers: {},
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
          // get weather conditions array by using weather code float32array values as index in weathercodes obj
          weather_conditions: Array.from(
            { length: hourly.variables(5)!.valuesArray()!.length },
            (_, i) => {
              return weatherCodes[hourly.variables(5)!.valuesArray()![i]];
            }
          ),
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

      state.status = "FULFILLED";

      forecastAdapter.removeAll(state);
      forecastAdapter.addOne(state, weatherData);
      // console.log(state);
    });
  },
});

export const selectCurrent = (state: RootStateType) =>
  state.forecast.entities[0].current;
export const selectDaily = (state: RootStateType) =>
  state.forecast.entities[0].daily;
export const selectHourly = (state: RootStateType) =>
  state.forecast.entities[0].hourly;
export const selectStatus = (state: RootStateType) =>
  state.forecast.status;

export const { selectAll: selectForecast } = forecastAdapter.getSelectors(
  (state: RootStateType) => state.forecast
);

export default forecastSlice.reducer;

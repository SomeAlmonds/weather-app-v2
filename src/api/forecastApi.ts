import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { fetchWeatherApi } from "openmeteo";
import type { RootStateType } from "../store";

const params = {
  latitude: 52.52,
  longitude: 13.41,
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
  ],
  current: "is_day",
};
const url = "https://api.open-meteo.com/v1/forecast";
// const responses = await fetchWeatherApi(url, params);

export const fetchForecast = createAsyncThunk(
  "fetchForecast/forecast",
  async (latLng: { latitude: number; longitude: number }) => {
    const resList = await fetchWeatherApi(url, { ...params, ...latLng });
    const res = resList[0];
    return res;
  }
);

// Process first location.
// const response = responses[0];

// Attributes for timezone and location
// const latitude = response.latitude();
// const longitude = response.longitude();
// const utcOffsetSeconds = response.utcOffsetSeconds();

// console.log(
//   `\nCoordinates: ${latitude}°N ${longitude}°E`,
//   `\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`
// );

// const current = response.current()!;
// const hourly = response.hourly()!;
// const daily = response.daily()!;

// Define Int64 variables so they can be processed accordingly
// const sunrise = daily.variables(2)!;
// const sunset = daily.variables(3)!;
// Note: The order of weather variables in the URL query and the indices below need to match!

// const weatherData = {
//   current: {
//     time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
//     is_day: current.variables(0)!.value(),
//   },
//   hourly: {
//     time: Array.from(
//       {
//         length:
//           (Number(hourly.timeEnd()) - Number(hourly.time())) /
//           hourly.interval(),
//       },
//       (_, i) =>
//         new Date(
//           (Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) *
//             1000
//         )
//     ),
//     temperature: hourly.variables(0)!.valuesArray(),
//     relative_humidity: hourly.variables(1)!.valuesArray(),
//     apparent_temperature: hourly.variables(2)!.valuesArray(),
//     wind_speed: hourly.variables(3)!.valuesArray(),
//     wind_direction: hourly.variables(4)!.valuesArray(),
//   },
//   daily: {
//     time: Array.from(
//       {
//         length:
//           (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval(),
//       },
//       (_, i) =>
//         new Date(
//           (Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) *
//             1000
//         )
//     ),
//     max_temperature: daily.variables(0)!.valuesArray(),
//     min_temperature: daily.variables(1)!.valuesArray(),
//     // Map Int64 values to according structure
//     sunrise: [...Array(sunrise.valuesInt64Length())].map(
//       (_, i) =>
//         new Date((Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000)
//     ),
//     // Map Int64 values to according structure
//     sunset: [...Array(sunset.valuesInt64Length())].map(
//       (_, i) =>
//         new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000)
//     ),
//     max_uv_index: daily.variables(4)!.valuesArray(),
//   },
// };
// The 'weatherData' object now contains a simple structure, with arrays of datetimes and weather information

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

const forecastAdapter = createEntityAdapter<WeatherDataInterface>();
const initialState = forecastAdapter.getInitialState();

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

      const weatherData = {
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

      forecastAdapter.removeAll(state);
      forecastAdapter.addOne(state, weatherData);
      // console.log(state);
    });
  },
});

// export const selectForecast = (state: RootStateType) => state.forecast;
// export const selectCurrent = (state: RootStateType) => state.forecast.current;
// export const selectDaily = (state: RootStateType) => state.forecast.daily;
// export const selectHourly = (state: RootStateType) => state.forecast.hourly;

export const { selectAll: selectForecast} = forecastAdapter.getSelectors((state: RootStateType) => state.forecast)

export default forecastSlice.reducer;

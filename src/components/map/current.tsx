import { useSelector } from "react-redux";
import {
  selectDaily,
  selectHourly,
  selectCurrentLocation,
  selecUtcOffsetMinutes,
  selectCurrent,
} from "../../api/forecastApi";
import { useMemo } from "react";
import WeatherIcons from "./icons";

const weatherConditions: { [key: number]: string } = {
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

export default function Current() {
  const hourly = useSelector(selectHourly);
  const daily = useSelector(selectDaily);
  const current = useSelector(selectCurrent);
  const currentLocation = useSelector(selectCurrentLocation);
  const timeOffset = useSelector(selecUtcOffsetMinutes);

  const UtcHour = new Date().getUTCHours();
  const utcMinute = new Date().getUTCMinutes();

  console.log(hourly);

  const hourOffset = Math.floor(timeOffset / 60) || 0;
  const minuteOffset = timeOffset % 60 || 0;

  const nowIndex = hourly.time.findIndex((i) => i.getUTCHours() == UtcHour);
  const nowHour = hourly.time[nowIndex].getHours();
  const nowMinute = utcMinute + minuteOffset;

  let hourlyArray = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => {
        const isDay =
          hourly.time[nowIndex + i].getHours() < daily.sunset[0].getHours() &&
          hourly.time[nowIndex + i].getHours() > daily.sunrise[0].getHours()
            ? 1
            : 0;

        return (
          <div className="day-hourly-element" key={i}>
            <p>{hourly.time[nowIndex + i].getHours()}:00</p>
            <WeatherIcons
              weather_code={hourly.weather_codes![nowIndex + i]}
              isDay={isDay}
            />
            <p>{Math.floor(hourly.temperature![nowIndex + i])}°</p>
            <div>
              <p>{hourly.relative_humidity![nowIndex + i]}%</p>
              <WeatherIcons weather_code={100} isDay={1} />
            </div>
          </div>
        );
      }),
    [hourly]
  );

  return (
    <>
      <div className="current">
        <div>
          <h1>{Math.floor(hourly.temperature![nowIndex])}°</h1>
          <WeatherIcons
            weather_code={hourly.weather_codes![nowIndex]}
            isDay={current.is_day}
          />
        </div>
        <div className="current-info">
          <p className="condition">
            {weatherConditions[hourly.weather_codes![nowIndex]]}
          </p>
          <p className="current-location">
            {`${currentLocation?.name} | ${currentLocation?.country}`}
          </p>
          <p>{` As of ${nowHour}:${
            nowMinute < 10 ? "0" + nowMinute : nowMinute
          } GMT+${hourOffset}:${
            minuteOffset < 10 ? "0" + minuteOffset : minuteOffset
          }`}</p>
          <p className="min-max">{`Min: ${Math.floor(
            daily.min_temperature![0]
          )}° Max: ${Math.floor(daily.max_temperature![0])}°`}</p>
        </div>
      </div>
      <div className="day-hourly">{hourlyArray}</div>
    </>
  );
}

import { useSelector } from "react-redux";
import {
  selectDaily,
  selectHourly,
  selectCurrentLocation,
  selecUtcOffsetMinutes,
} from "../../api/forecastApi";
import { useMemo } from "react";

export default function Current() {
  const hourly = useSelector(selectHourly);
  const daily = useSelector(selectDaily);
  const currentLocation = useSelector(selectCurrentLocation);
  const timeOffset = useSelector(selecUtcOffsetMinutes);
  // console.log(hourly);
  const UtcHour = new Date().getUTCHours();
  const utcMinute = new Date().getUTCMinutes();

  console.log(daily);

  const hourOffset = Math.floor(timeOffset / 60);
  const minuteOffset = timeOffset % 60;

  const nowIndex = hourly.time.findIndex((i) => i.getUTCHours() == UtcHour);
  const nowHour = hourly.time[nowIndex].getHours();
  const nowMinute = utcMinute + minuteOffset;

  const hourlyArray = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => {
        return (
          <div className="day-hourly-element" key={i}>
            <p>{hourly.time[nowIndex + i].getHours()}:00</p>
            <p>{Math.floor(hourly.temperature![nowIndex + i])}</p>
            <p>{hourly.relative_humidity![nowIndex + i]}%</p>
          </div>
        );
      }),
    [hourly]
  );

  return (
    <>
      <div className="current-blank">
        <h1>{Math.floor(hourly.temperature![nowIndex])}</h1>
        <div className="current-extra-blank">
          <p className="current-location">{`${currentLocation?.name} | ${
            currentLocation?.country
          } As of ${nowHour}:${
            nowMinute < 10 ? "0" + nowMinute : nowMinute
          } GMT+${hourOffset}:${
            minuteOffset < 10 ? "0" + minuteOffset : minuteOffset
          }`}</p>
          <p className="condition-blank">
            {hourly.weather_conditions![nowIndex]}
          </p>
          <p className="min-max-blank">{`Min: ${Math.floor(
            daily.min_temperature![0]
          )} Max: ${Math.floor(daily.max_temperature![0])}`}</p>
        </div>
      </div>
      <div className="day-houlry">{hourlyArray}</div>
    </>
  );
}

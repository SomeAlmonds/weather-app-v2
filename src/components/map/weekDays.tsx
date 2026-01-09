import { useSelector } from "react-redux";
import { selectDaily, selectHourly } from "../../api/forecastApi";
import { useMemo } from "react";

export default function WeekDays() {
  const daily = useSelector(selectDaily);
  const hourly = useSelector(selectHourly);
  console.log(hourly);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let morningHourIndex = 7;
  let eveningHourIndex = 17;
  let dayArray = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        // morning and evening weather for 7 days including today

        let conditions = [
          // get weather conditions for each day
          hourly.weather_conditions![morningHourIndex + 24 * i],
          hourly.weather_conditions![eveningHourIndex + 24 * i],
        ];

        return (
          <div className="week-day" key={i}>
            <p>{days[hourly.time[morningHourIndex + 24 * i].getDay()]}</p>
            <div>{conditions}</div>
            <p>
              {`
            ${Math.floor(daily.max_temperature![i])}° | ${Math.floor(
                daily.min_temperature![i]
              )}°
          `}
            </p>
          </div>
        );
      }),
    [hourly, daily]
  );
  return <div className="week-weather">{dayArray}</div>;
}

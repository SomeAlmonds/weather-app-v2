import { useSelector } from "react-redux";
import { selectDaily, selectHourly } from "../../api/forecastApi";

export default function () {
  const hourly = useSelector(selectHourly);
  const daily = useSelector(selectDaily);

  const UtcHour = new Date().getUTCHours();

  const nowIndex = hourly.time.findIndex((i) => i.getUTCHours() == UtcHour);

  return (
    <div className="extra-current">
      <div>
        <div>
          <p>Max UV Index: </p>
          <p>{`${Math.round(daily.max_uv_index![0])} of 11`}</p>
        </div>
        {/* icon div */}
      </div>
      <div>
        <div>
          <p>{`Sunrise: ${daily.sunrise[0].getHours()}`}</p>
          <p>{`Sunset: ${daily.sunset[0].getHours()}`}</p>
        </div>
        {/* icon div */}
      </div>
      <div>
        <div>
          <p>Wind</p>
          <p>{`${Math.round(hourly.wind_speed![nowIndex])} Km/h`}</p>
        </div>
        {/* icon div */}
      </div>
      <div>
        <div>
          <p>Humidity</p>
          <p>{`${hourly.relative_humidity![nowIndex]}%`}</p>
        </div>
        {/* icon div */}
      </div>
    </div>
  );
}

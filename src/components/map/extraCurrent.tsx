import { useSelector } from "react-redux";
import { selectDaily, selectHourly } from "../../api/forecastApi";
import WeatherIcons from "./icons";

export default function () {
  const hourly = useSelector(selectHourly);
  const daily = useSelector(selectDaily);

  const UtcHour = new Date().getUTCHours();

  const nowIndex = hourly.time.findIndex((i) => i.getUTCHours() == UtcHour);

  return (
    <div className="extra-current">
      <div>
        <div>
          <p>UV Index: </p>
          <p>{`${Math.round(daily.max_uv_index![0])} of 11`}</p>
        </div>
        <WeatherIcons weather_code={0} isDay={1} />
      </div>
      <div>
        <div>
          <p>Sun time:</p>
          <p>{`${daily.sunrise[0].getHours()}AM - ${daily.sunset[0].getHours()}PM`}</p>
        </div>
        <WeatherIcons weather_code={102} isDay={1} />
      </div>
      <div>
        <div>
          <p>Wind:</p>
          <p>{`${Math.round(hourly.wind_speed![nowIndex])} Km/h`}</p>
        </div>
        <WeatherIcons weather_code={101} isDay={1} />
      </div>
      <div>
        <div>
          <p>Humidity:</p>
          <p>{`${hourly.relative_humidity![nowIndex]}%`}</p>
        </div>
        <WeatherIcons weather_code={100} isDay={1} />
      </div>
    </div>
  );
}

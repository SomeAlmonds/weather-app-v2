import Map from "./map";

export default function Placeholder() {
  let dayArray = Array.from({ length: 7 }, (_, i) => {
    return (
      <div className="week-day" key={i}>
        <p>sat</p>
        <div className="week-day-conditions">
          <p>fo</p>
          <p>fo</p>
        </div>
        <p>20° | 20°</p>
      </div>
    );
  });

  let hourlyArray = Array.from({ length: 24 }, (_, i) => {
    return (
      <div className="day-hourly-element" key={i}>
        <p>00:00</p>
        <div>FOO</div>
        <p>00°</p>
        <div>
          <p>00%</p>
          <div>FOO</div>
        </div>
      </div>
    );
  });

  return (
    <div className="body">
      <div>
        <div className="current pending">
          <div>
            <h1>20°</h1>
            <p>foo</p>
          </div>
          <div className="current-info">
            <p className="condition">clear</p>
            <p className="current-location">name | name </p>
            <p>As of 00:00 GMT+00:00</p>
            <p className="min-max">Min: 00° Max: 00°</p>
          </div>
        </div>
        <div className="day-hourly pending">{hourlyArray}</div>
        <div className="extra-current pending">
          <div>
            <div>
              <p>UV Index: </p>
              <p>11 of 11</p>
            </div>
            <p>FOO</p>
          </div>
          <div>
            <div>
              <p>Sun time:</p>
              <p>00AM - 00PM</p>
            </div>
            <p>FOO</p>
          </div>
          <div>
            <div>
              <p>Wind:</p>
              <p>00 Km/h</p>
            </div>
            <p>FOO</p>
          </div>
          <div>
            <div>
              <p>Humidity:</p>
              <p>00%</p>
            </div>
            <p>FOO</p>
          </div>
        </div>
      </div>
      <div>
        <div className="week-weather pending">{dayArray}</div>
        <Map isPending={true}/>
      </div>
    </div>
  );
}

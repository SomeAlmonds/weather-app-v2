export default function Placeholder() {

  return (
    <>
      <div className="current-blank">
        <h1>00</h1>
        <div className="current-extra-blank">
          <p className="location-blank"></p>
          <p className="condition-blank"></p>
          <p className="min-max-blank"></p>
        </div>
      </div>
      <div className="day-houlry"></div>
      {/* ////////////////// */}

      <div className="extra-condition-blank">
        <div className="ext-cond wind">
          <div className="icon"></div>
          <p>0 Km/h</p>
        </div>
        <div className="ext-cond sun">
          <div className="icon"></div>
          <div className="sun-rise-set">
            <div className="sunrise">
              <p>sunrise</p>
              <p>6 AM</p>
            </div>
            <div className="sunset">
              <p>sunset</p>
              <p>6 PM</p>
            </div>
          </div>
        </div>
        <div className="ext-cond uv">
          <div className="icon"></div>
          <p>Low</p>
        </div>
        <div className="ext-cond humidity">
          <div className="icon"></div>
          <p>0%</p>
        </div>
      </div>
      {/* ////////////// */}

      <div>
        <div className="week-days"></div>
        <div className="map-blank"></div>
      </div>
    </>
  );
}

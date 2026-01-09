import { useSelector } from "react-redux";
import { selectError, selectStatus } from "../../api/forecastApi";
import Current from "./current";
import Placeholder from "./placeholder";
import WeekDays from "./weekDays";
import ExtraCurrent from "./extraCurrent";
import Map from "./map";

export default function Forecast() {
  const status = useSelector(selectStatus);
  const error = useSelector(selectError);

  if (status == "FULFILLED") {
    // render data
    return (
      <div className="body">
        {/* <div> */}
          <Current />
          <ExtraCurrent />
        {/* </div> */}
        {/* <div> */}
          <WeekDays />
          <Map />
        {/* </div> */}
      </div>
    );
  } else if (status == "PENDING") {
    // render placeholder
    return <Placeholder />;
  } else if (status == "REJECTED") {
    // render error message
    return (
      <>
        <h2>Error: {error!.code}</h2>
        <h3>{error!.message}</h3>
      </>
    );
  }
}

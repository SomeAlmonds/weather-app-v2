import { useSelector } from "react-redux";
import { selectHourly, selectStatus } from "../../api/forecastApi";
import { useEffect } from "react";

export default function Current() {
  const status = useSelector(selectStatus);

  // useEffect(() => {
  if (status == "FULFILLED") {
    const hourly = useSelector(selectHourly);

    console.log(hourly);
  }
  // }, [status]);

  return <></>;
}

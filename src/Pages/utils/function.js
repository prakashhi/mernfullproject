import moment from "moment";

export const ExitTimeval = (value) => {
  if (
    moment(value.Date).toISOString() == moment(value.Exit_time).toISOString()
  ) {
    return "-";
  } else {
    return moment(value.Exit_time).format("hh:mm:ss a");
  }
};

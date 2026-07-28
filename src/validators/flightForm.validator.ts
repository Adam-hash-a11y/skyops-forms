import validator from "validator";

export const isValidFlightNumber = (value: string): string => {
  if (/^SKYOPS-\d{3,}$/.test(value)) {
    return "";
  } else {
    return "Flight number must start with SKYOPS-XXX";
  }
};

export const isValidAirline = (value: string) => {
  if (value.length < 5) {
    return "Airline must be at least 5 characters";
  } else {
    return "";
  }
};

export const isValidOrigin = (value: string): string => {
  if (/^[A-Z]{3}$/.test(value)) {
    return "";
  }
  return "Origin must be 3 uppercase letters";
};

export const isValidDestination = (value: string): string => {
  if (/^[A-Z]{3}$/.test(value)) {
    return "";
  }
  return "Destination must be 3 uppercase letters";
};

export const isSameOriginDestination = (
  origin: string,
  destination: string,
): boolean => {
  return (
    origin.length === 3 &&
    origin === origin.toUpperCase() &&
    destination.length === 3 &&
    destination === destination.toUpperCase() &&
    origin === destination
  );
};

export const isValidStatus = (value: string): string => {
  if (value === "") {
    return "Status is required";
  }
  return "";
};

export const isValidDepartureTime = (value: string): string => {
  if (validator.isISO8601(value)) {
    return "";
  }
  return "departure time must be a valid date";
};

export const isValidArrivalTime = (value: string): string => {
  if (validator.isISO8601(value)) {
    return "";
  }
  return "arrival time must be a valid date";
};
export const isDepartureBeforeArrival = (
  departureTime: string,
  arrivalTime: string,
): boolean => {
  const dep = new Date(departureTime).getTime();
  const arr = new Date(arrivalTime).getTime();
  return !Number.isNaN(dep) && !Number.isNaN(arr) && dep < arr;
};

export const isValidTotalSeats = (value: number): string => {
  if (value > 0) {
    return "";
  }
  return "Total seats must be a positive number";
};

export const isValidBookedSeats = (value: number): string => {
  if (value >= 0) {
    return "";
  }
  return "Booked seats must be a valid number";
};

export const isBookedWithinTotal = (
  bookedSeats: number,
  totalSeats: number,
): boolean => {
  return bookedSeats <= totalSeats;
};

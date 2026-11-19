import validator from "validator";
import i18n from "../i18n/i18n";

export const isValidFlightNumber = (value: string): string =>
  /^SKYOPS-\d{3,}$/.test(value) ? "" : i18n.t("validation.flight.flightNumber");

export const isValidAirline = (value: string): string =>
  value.length < 5 ? i18n.t("validation.flight.airline") : "";

export const isValidOrigin = (value: string): string =>
  /^[A-Z]{3}$/.test(value) ? "" : i18n.t("validation.flight.origin");

export const isValidDestination = (value: string): string =>
  /^[A-Z]{3}$/.test(value) ? "" : i18n.t("validation.flight.destination");

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

export const isValidStatus = (value: string): string =>
  value === "" ? i18n.t("validation.flight.status") : "";

export const isValidDepartureTime = (value: string): string =>
  validator.isISO8601(value) ? "" : i18n.t("validation.flight.departureTime");

export const isValidArrivalTime = (value: string): string =>
  validator.isISO8601(value) ? "" : i18n.t("validation.flight.arrivalTime");

export const isDepartureBeforeArrival = (
  departureTime: string,
  arrivalTime: string,
): boolean => {
  const dep = new Date(departureTime).getTime();
  const arr = new Date(arrivalTime).getTime();
  return !Number.isNaN(dep) && !Number.isNaN(arr) && dep < arr;
};

export const isValidSeatCount = (value: number): string =>
  Number.isInteger(value) && value >= 0
    ? ""
    : i18n.t("validation.flight.seatCount");

export const hasAtLeastOneSeat = (
  firstSeats: number,
  businessSeats: number,
  economySeats: number,
): boolean => firstSeats + businessSeats + economySeats > 0;

import { RESET, SET_FIELD, SET_TOUCHED, type Action } from "./action";
import type { Status } from "./types";
import {
  isValidFlightNumber,
  isValidOrigin,
  isValidDestination,
  isValidDepartureTime,
  isValidSeatCount,
  hasAtLeastOneSeat,
  isSameOriginDestination,
  isDepartureBeforeArrival,
  isValidArrivalTime,
  isValidStatus,
  isValidAirline,
} from "../../../validators/flightForm.validator";
import { flights, type Flight } from "../../../data/flightData";

export interface State {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status: Status;
  firstSeats: string;
  businessSeats: string;
  economySeats: string;
  touched: {
    flightNumber: boolean;
    airline: boolean;
    origin: boolean;
    destination: boolean;
    departureTime: boolean;
    arrivalTime: boolean;
    status: boolean;
    firstSeats: boolean;
    businessSeats: boolean;
    economySeats: boolean;
  };
  errors: {
    flightNumber: string;
    airline: string;
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    status: string;
    firstSeats: string;
    businessSeats: string;
    economySeats: string;
  };
  disabled: boolean;
  allFLights: Flight[];
}

export const initialState: State = {
  flightNumber: "",
  airline: "",
  origin: "",
  destination: "",
  departureTime: "",
  arrivalTime: "",
  status: "Scheduled",
  firstSeats: "0",
  businessSeats: "0",
  economySeats: "0",
  touched: {
    flightNumber: false,
    airline: false,
    origin: false,
    destination: false,
    departureTime: false,
    arrivalTime: false,
    status: false,
    firstSeats: false,
    businessSeats: false,
    economySeats: false,
  },
  errors: {
    flightNumber: "",
    airline: "",
    origin: "",
    destination: "",
    departureTime: "",
    arrivalTime: "",
    status: "",
    firstSeats: "",
    businessSeats: "",
    economySeats: "",
  },
  disabled: true,
  allFLights: [...flights],
};

export const flightReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case SET_FIELD: {
      const newState = {
        ...state,
        [action.field]: action.value,
      };
      const newErrors = { ...newState.errors };
      newErrors.flightNumber = isValidFlightNumber(newState.flightNumber);
      newErrors.airline = isValidAirline(newState.airline);
      newErrors.origin = isValidOrigin(newState.origin);
      newErrors.destination = isValidDestination(newState.destination);
      newErrors.departureTime = isValidDepartureTime(newState.departureTime);
      newErrors.arrivalTime = isValidArrivalTime(newState.arrivalTime);
      newErrors.firstSeats = isValidSeatCount(Number(newState.firstSeats));
      newErrors.businessSeats = isValidSeatCount(
        Number(newState.businessSeats),
      );
      newErrors.economySeats = isValidSeatCount(Number(newState.economySeats));
      newErrors.status = isValidStatus(newState.status);

      if (isSameOriginDestination(newState.origin, newState.destination)) {
        newErrors.origin = "Origin and destination can't be the same";
        newErrors.destination = "Origin and destination can't be the same";
      }

      if (
        !isDepartureBeforeArrival(newState.departureTime, newState.arrivalTime)
      ) {
        newErrors.departureTime = "departure time must be before arrival time";
        newErrors.arrivalTime = "departure time must be before arrival time";
      }

      if (
        !hasAtLeastOneSeat(
          Number(newState.firstSeats),
          Number(newState.businessSeats),
          Number(newState.economySeats),
        )
      ) {
        newErrors.firstSeats = "A flight needs at least one seat";
        newErrors.businessSeats = "A flight needs at least one seat";
        newErrors.economySeats = "A flight needs at least one seat";
      }
      return {
        ...newState,
        disabled:
          newErrors.flightNumber != "" ||
          newErrors.airline != "" ||
          newErrors.arrivalTime != "" ||
          newErrors.firstSeats != "" ||
          newErrors.businessSeats != "" ||
          newErrors.economySeats != "" ||
          newErrors.departureTime != "" ||
          newErrors.origin != "" ||
          newErrors.destination != "" ||
          newErrors.status != "",
        errors: newErrors,
      };
    }

    case SET_TOUCHED: {
      const newTouched = { ...state.touched, [action.field]: true };
      const newErrors = { ...state.errors };

      switch (action.field) {
        case "flightNumber":
          newErrors.flightNumber = isValidFlightNumber(state.flightNumber);
          break;
        case "airline":
          newErrors.airline = isValidAirline(state.airline);
          break;
        case "origin":
          newErrors.origin = isValidOrigin(state.origin);
          break;
        case "destination":
          newErrors.destination = isValidDestination(state.destination);
          break;
        case "departureTime":
          newErrors.departureTime = isValidDepartureTime(state.departureTime);
          break;
        case "arrivalTime":
          newErrors.arrivalTime = isValidArrivalTime(state.arrivalTime);
          break;
        case "status":
          newErrors.status = isValidStatus(state.status);
          break;
        case "firstSeats":
          newErrors.firstSeats = isValidSeatCount(Number(state.firstSeats));
          break;
        case "businessSeats":
          newErrors.businessSeats = isValidSeatCount(
            Number(state.businessSeats),
          );
          break;
        case "economySeats":
          newErrors.economySeats = isValidSeatCount(Number(state.economySeats));
          break;
      }

      return { ...state, touched: newTouched, errors: newErrors };
    }
    case RESET:
      return initialState;
    default: {
      return state;
    }
  }
};

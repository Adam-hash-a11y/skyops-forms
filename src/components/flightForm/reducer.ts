import { RESET, SET_FIELD, SET_TOUCHED, SUBMIT, type Action } from "./action";
import type { Status } from "./types";
import { flights } from "../../data/flightData";
import {
  isValidFlightNumber,
  isValidOrigin,
  isValidDestination,
  isValidDepartureTime,
  isValidTotalSeats,
  isValidBookedSeats,
  isSameOriginDestination,
  isDepartureBeforeArrival,
  isBookedWithinTotal,
  isValidArrivalTime,
  isValidStatus,
  isValidAirline,
} from "../../validators/flightForm.validator";

export interface State {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status: Status;
  bookedSeats: string;
  totalSeats: string;
  touched: {
    flightNumber: boolean;
    airline: boolean;
    origin: boolean;
    destination: boolean;
    departureTime: boolean;
    arrivalTime: boolean;
    status: boolean;
    bookedSeats: boolean;
    totalSeats: boolean;
  };
  errors: {
    flightNumber: string;
    airline: string;
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    status: string;
    totalSeats: string;
    bookedSeats: string;
  };
  disabled: boolean;
}

export const initialState: State = {
  flightNumber: "",
  airline: "",
  origin: "",
  destination: "",
  departureTime: "",
  arrivalTime: "",
  status: "",
  bookedSeats: "0",
  totalSeats: "0",
  touched: {
    flightNumber: false,
    airline: false,
    origin: false,
    destination: false,
    departureTime: false,
    arrivalTime: false,
    status: false,
    bookedSeats: false,
    totalSeats: false,
  },
  errors: {
    flightNumber: "",
    airline: "",
    origin: "",
    destination: "",
    departureTime: "",
    arrivalTime: "",
    status: "",
    totalSeats: "",
    bookedSeats: "",
  },
  disabled: true,
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
      newErrors.totalSeats = isValidTotalSeats(Number(newState.totalSeats));
      newErrors.bookedSeats = isValidBookedSeats(Number(newState.bookedSeats));
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
        !isBookedWithinTotal(
          Number(newState.bookedSeats),
          Number(newState.totalSeats),
        )
      ) {
        newErrors.bookedSeats = "Booked seats can't exceed total seats";
        newErrors.totalSeats = "Booked seats can't exceed total seats";
      }
      return {
        ...newState,
        disabled:
          newErrors.flightNumber != "" ||
          newErrors.airline != "" ||
          newErrors.arrivalTime != "" ||
          newErrors.bookedSeats != "" ||
          newErrors.totalSeats != "" ||
          newErrors.departureTime != "" ||
          newErrors.origin != "" ||
          newErrors.destination != "" ||
          newErrors.status != "",
        errors: newErrors,
      };
    }
    case SUBMIT: {
      console.log("SUBMIT fired, current state:", state);
      flights.push({
        flightNumber: state.flightNumber,
        airline: state.airline,
        origin: state.origin,
        destination: state.destination,
        departureTime: state.departureTime,
        arrivalTime: state.arrivalTime,
        status: state.status,
        bookedSeats: Number(state.bookedSeats),
        totalSeats: Number(state.totalSeats),
      });
      console.log("flights array now:", flights);
      return initialState;
    }
    case RESET:
      return initialState;
    case SET_TOUCHED: {
      const newTouched = { ...state.touched, [action.field]: true };
      return { ...state, touched: newTouched };
    }
    default:
      return state;
  }
};

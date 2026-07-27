import { RESET, SET_FIELD, SUBMIT, type Action } from "./action";
import type { Status } from "./types";
import { flights } from "../../data/flightData";
import {
  isValidFlightNumber,
  isValidaAirLine,
  isValidOrigin,
  isValidDestination,
  isValidDepartureTime,
  isValidTotalSeats,
  isValidBookedSeats,
  isSameOriginDestination,
  isDepartureBeforeArrival,
  isBookedWithinTotal,
} from "../../validators/flightForm.validator";

interface State {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status: Status;
  bookedSeats: number;
  totalSeats: number;
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
  bookedSeats: 0,
  totalSeats: 0,
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
      newErrors.airline = isValidaAirLine(newState.airline);
      newErrors.origin = isValidOrigin(newState.origin);
      newErrors.destination = isValidDestination(newState.destination);
      newErrors.departureTime = isValidDepartureTime(newState.departureTime);
      newErrors.arrivalTime = isValidDepartureTime(newState.arrivalTime);
      newErrors.totalSeats = isValidTotalSeats(Number(newState.totalSeats));
      newErrors.bookedSeats = isValidBookedSeats(Number(newState.bookedSeats));

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
          newErrors.bookedSeats.toString() != "" ||
          newErrors.totalSeats.toString() != "" ||
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
        bookedSeats: state.bookedSeats,
        totalSeats: state.totalSeats,
      });
      console.log("flights array now:", flights);
      return initialState;
    }
    case RESET:
      return initialState;

    default:
      return state;
  }
};

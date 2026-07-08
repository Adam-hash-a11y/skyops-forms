import validator from "validator";
import { RESET, SET_ERROR, SET_FIELD, SUBMIT } from "./action";
import type { Status } from "./types";
import { flights } from "../../data/flightData";

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
  status: "scheduled",
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

export const flightReducer = (state: State, action: any) => {
  switch (action.type) {
    case SET_FIELD:
      return {
        ...state,
        [action.field]: action.value,
        disabled:
          (action.field === "flightNumber" ? action.value : state.flightNumber)
            .length === 0 ||
          (action.field === "airline" ? action.value : state.airline).length ===
            0 ||
          (action.field === "origin" ? action.value : state.origin).length ===
            0 ||
          (action.field === "destination" ? action.value : state.destination)
            .length === 0 ||
          (action.field === "departureTime"
            ? action.value
            : state.departureTime
          ).length === 0 ||
          (action.field === "arrivalTime" ? action.value : state.arrivalTime)
            .length === 0 ||
          (action.field === "status" ? action.value : state.status).length ===
            0 ||
          (action.field === "bookedSeats"
            ? action.value
            : state.bookedSeats) === 0 ||
          (action.field === "totalSeats" ? action.value : state.totalSeats) ===
            0,
      };
    case SET_ERROR: {
      const newErrors = { ...state.errors };

      if (/^SKYOPS-\d{3,}$/.test(state.flightNumber)) {
        newErrors.flightNumber = "";
      } else {
        newErrors.flightNumber = "Flight number must start with SKYOPS-";
      }

      if (state.airline.length < 5) {
        newErrors.airline = "Airline must be of length 5";
      } else {
        newErrors.airline = "";
      }

      if (
        state.origin.length === 3 &&
        state.origin === state.origin.toUpperCase()
      ) {
        newErrors.origin = "";
      } else {
        newErrors.origin = "Origin must be of length 3 and upper case";
      }

      if (
        state.destination.length === 3 &&
        state.destination === state.destination.toUpperCase()
      ) {
        newErrors.destination = "";
      } else {
        newErrors.destination =
          "Destination must be of length 3 and upper case";
      }

      if (
        state.destination.length === 3 &&
        state.destination === state.destination.toUpperCase() &&
        state.origin.length === 3 &&
        state.origin === state.origin.toUpperCase() &&
        state.destination === state.origin
      ) {
        newErrors.destination = "Origin and destination can't be the same";
        newErrors.origin = "Origin and destination can't be the same";
      }

      if (validator.isISO8601(state.departureTime)) {
        newErrors.departureTime = "";
      } else {
        newErrors.departureTime = "departure time must be a valid date";
      }

      if (validator.isISO8601(state.arrivalTime)) {
        newErrors.arrivalTime = "";
      } else {
        newErrors.arrivalTime = "arrival time must be a valid date";
      }

      const dep = new Date(state.departureTime).getTime();
      const arr = new Date(state.arrivalTime).getTime();

      if (!Number.isNaN(dep) && !Number.isNaN(arr) && dep >= arr) {
        newErrors.departureTime = "departure time must be before arrival time";
        newErrors.arrivalTime = "departure time must be before arrival time";
      }

      if (Number(state.totalSeats) > 0) {
        newErrors.totalSeats = "";
      } else {
        newErrors.totalSeats = "Total seats must be a positive number";
      }

      if (Number(state.bookedSeats) >= 0) {
        newErrors.bookedSeats = "";
      } else {
        newErrors.bookedSeats = "Booked seats must be a valid number";
      }

      if (Number(state.bookedSeats) > Number(state.totalSeats)) {
        newErrors.bookedSeats = "Booked seats can't exceed total seats";
        newErrors.totalSeats = "Booked seats can't exceed total seats";
      }
      return {
        ...state,
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
      return state;
    }
    case RESET:
      return initialState;

    default:
      return state;
  }
};

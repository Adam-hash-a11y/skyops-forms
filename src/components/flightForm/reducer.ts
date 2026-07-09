//in here we will create the interface which is represtation of how our state will look like

import validator from "validator";
import { SET_ERROR, SET_FIELD } from "./action";

interface State {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
  totalSeats: number;
  bookedSeats: number;
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
}

export const intialState: State = {
  flightNumber: "",
  airline: "",
  origin: "",
  destination: "",
  departureTime: "",
  arrivalTime: "",
  status: "",
  totalSeats: 0,
  bookedSeats: 0,
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
};

export const flightReducer = (state: State, action: any) => {
  switch (action.type) {
    case SET_FIELD:
      return { ...state, [action.payload.name]: action.payload.value };
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
        state.origin.length == 3 &&
        state.origin == state.origin.toUpperCase()
      ) {
        newErrors.origin = "";
      } else {
        newErrors.origin = "Origin must be of length 3 and upper case";
      }
      if (
        state.destination.length == 3 &&
        state.destination == state.destination.toUpperCase()
      ) {
        newErrors.destination = "";
      } else {
        newErrors.destination =
          "Destination must be of length 3 and upper case";
      }
      if (
        state.destination.length == 3 &&
        state.destination == state.destination.toUpperCase() &&
        state.origin.length == 3 &&
        state.origin == state.origin.toUpperCase() &&
        state.destination === state.origin
      ) {
        newErrors.destination = "Origin and desination can't be the same";
        newErrors.origin = "Origin and desination can't be the same";
      }

      if (validator.isISO8601(state.departureTime)) {
        newErrors.departureTime = "";
      } else {
        state.departureTime = "departure time must be a valid date";
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

      if (validator.isInt(state.totalSeats.toString(), { min: 1 })) {
        newErrors.totalSeats = "";
      } else {
        newErrors.totalSeats = "Total seats must be a positive number";
      }

      if (validator.isInt(state.bookedSeats.toString(), { min: 0 })) {
        newErrors.bookedSeats = "";
      } else {
        newErrors.bookedSeats = "Booked seats must be a valid number";
      }

      if (
        validator.isInt(state.totalSeats.toString(), { min: 1 }) &&
        validator.isInt(state.bookedSeats.toString(), { min: 0 }) &&
        Number.parseInt(state.bookedSeats.toString()) >
          Number.parseInt(state.totalSeats.toString())
      ) {
        newErrors.bookedSeats = "Booked seats can't exceed total seats";
        newErrors.totalSeats = "Booked seats can't exceed total seats";
      }

      return { ...state, errors: newErrors };
    } // hedhi heya e state mte3i li heya declaration const [state,dipatch]
    //   return hedhi { ...state, errors: newErrors } heya  state eli hneconst [state,dipatch]        ^^^
    default:
      return state;
  }
};

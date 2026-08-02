import { RESET, SET_FIELD, SET_TOUCHED, SUBMIT, type Action } from "./action";
import type { Status } from "./types";
import { flights, type Flight } from "../../data/flightData";
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
  allFLights: Flight[];
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
  allFLights: [...flights],
};

export const flightReducer = (state: State, action: Action): State => {
  switch (action.type) {
    // case SET_FIELD: {
    //   const newState = {
    //     ...state,
    //     [action.field]: action.value,
    //   };
    //   const newErrors = { ...newState.errors };
    //   newErrors.flightNumber = isValidFlightNumber(newState.flightNumber);
    //   newErrors.airline = isValidAirline(newState.airline);
    //   newErrors.origin = isValidOrigin(newState.origin);
    //   newErrors.destination = isValidDestination(newState.destination);
    //   newErrors.departureTime = isValidDepartureTime(newState.departureTime);
    //   newErrors.arrivalTime = isValidArrivalTime(newState.arrivalTime);
    //   newErrors.totalSeats = isValidTotalSeats(Number(newState.totalSeats));
    //   newErrors.bookedSeats = isValidBookedSeats(Number(newState.bookedSeats));
    //   newErrors.status = isValidStatus(newState.status);

    //   if (isSameOriginDestination(newState.origin, newState.destination)) {
    //     newErrors.origin = "Origin and destination can't be the same";
    //     newErrors.destination = "Origin and destination can't be the same";
    //   }

    //   if (
    //     !isDepartureBeforeArrival(newState.departureTime, newState.arrivalTime)
    //   ) {
    //     newErrors.departureTime = "departure time must be before arrival time";
    //     newErrors.arrivalTime = "departure time must be before arrival time";
    //   }

    //   if (
    //     !isBookedWithinTotal(
    //       Number(newState.bookedSeats),
    //       Number(newState.totalSeats),
    //     )
    //   ) {
    //     newErrors.bookedSeats = "Booked seats can't exceed total seats";
    //     newErrors.totalSeats = "Booked seats can't exceed total seats";
    //   }
    //   return {
    //     ...newState,
    //     disabled:
    //       newErrors.flightNumber != "" ||
    //       newErrors.airline != "" ||
    //       newErrors.arrivalTime != "" ||
    //       newErrors.bookedSeats != "" ||
    //       newErrors.totalSeats != "" ||
    //       newErrors.departureTime != "" ||
    //       newErrors.origin != "" ||
    //       newErrors.destination != "" ||
    //       newErrors.status != "",
    //     errors: newErrors,
    //   };
    // }
    case SUBMIT: {
      console.log("SUBMIT fired, current state:", state);
      // flights.push({
      //   flightNumber: state.flightNumber,
      //   airline: state.airline,
      //   origin: state.origin,
      //   destination: state.destination,
      //   departureTime: state.departureTime,
      //   arrivalTime: state.arrivalTime,
      //   status: state.status,
      //   bookedSeats: Number(state.bookedSeats),
      //   totalSeats: Number(state.totalSeats),
      // });

      //TDLR ; check this later !
      console.log("flights array now:", flights);
      const newFligths = [
        ...state.allFLights,
        {
          flightNumber: state.flightNumber,
          airline: state.airline,
          origin: state.origin,
          destination: state.destination,
          departureTime: state.departureTime,
          arrivalTime: state.arrivalTime,
          status: state.status,
          bookedSeats: Number(state.bookedSeats),
          totalSeats: Number(state.totalSeats),
        },
      ];
      return {
        ...state,
        allFLights: newFligths,
      };
    }
    // case RESET:
    //   return initialState;
    // case SET_TOUCHED: {
    //   const newTouched = { ...state.touched, [action.field]: true };
    //   const newErrors = { ...state.errors };

    //   switch (action.field) {
    //     case "flightNumber":
    //       newErrors.flightNumber = isValidFlightNumber(state.flightNumber);
    //       break;
    //     case "airline":
    //       newErrors.airline = isValidAirline(state.airline);
    //       break;
    //     case "origin":
    //       newErrors.origin = isValidOrigin(state.origin);
    //       break;
    //     case "destination":
    //       newErrors.destination = isValidDestination(state.destination);
    //       break;
    //     case "departureTime":
    //       newErrors.departureTime = isValidDepartureTime(state.departureTime);
    //       break;
    //     case "arrivalTime":
    //       newErrors.arrivalTime = isValidArrivalTime(state.arrivalTime);
    //       break;
    //     case "status":
    //       newErrors.status = isValidStatus(state.status);
    //       break;
    //     case "totalSeats":
    //       newErrors.totalSeats = isValidTotalSeats(Number(state.totalSeats));
    //       break;
    //     case "bookedSeats":
    //       newErrors.bookedSeats = isValidBookedSeats(Number(state.bookedSeats));
    //       break;
    //   }

    //   return { ...state, touched: newTouched, errors: newErrors };
    // }
    default: {
      console.log("test redcuer");
      return state;
    }
  }
};

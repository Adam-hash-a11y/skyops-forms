import { FlightFormActionType, type Action } from "./action";
import { FlightStatus } from "../../../types/flightTypes";
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
import i18n from "../../../i18n/i18n";

export interface State {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status: FlightStatus;
  firstSeats: string;
  businessSeats: string;
  economySeats: string;
  isEdit: boolean;
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
}

export const initialState: State = {
  flightNumber: "",
  airline: "",
  origin: "",
  destination: "",
  departureTime: "",
  arrivalTime: "",
  status: FlightStatus.SCHEDULED,
  firstSeats: "0",
  businessSeats: "0",
  economySeats: "0",
  isEdit: false,
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
};

export const flightReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case FlightFormActionType.SET_FIELD: {
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
      newErrors.status = isValidStatus(newState.status);

      if (!newState.isEdit) {
        newErrors.firstSeats = isValidSeatCount(Number(newState.firstSeats));
        newErrors.businessSeats = isValidSeatCount(
          Number(newState.businessSeats),
        );
        newErrors.economySeats = isValidSeatCount(
          Number(newState.economySeats),
        );

        if (
          !hasAtLeastOneSeat(
            Number(newState.firstSeats),
            Number(newState.businessSeats),
            Number(newState.economySeats),
          )
        ) {
          const message = i18n.t("validation.flight.noSeats");
          newErrors.firstSeats = message;
          newErrors.businessSeats = message;
          newErrors.economySeats = message;
        }
      }

      if (isSameOriginDestination(newState.origin, newState.destination)) {
        const message = i18n.t("validation.flight.sameOriginDestination");
        newErrors.origin = message;
        newErrors.destination = message;
      }

      if (
        !isDepartureBeforeArrival(newState.departureTime, newState.arrivalTime)
      ) {
        const message = i18n.t("validation.flight.departureAfterArrival");
        newErrors.departureTime = message;
        newErrors.arrivalTime = message;
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

    case FlightFormActionType.SET_TOUCHED: {
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
    case FlightFormActionType.RESET:
      return initialState;
    default: {
      return state;
    }
  }
};

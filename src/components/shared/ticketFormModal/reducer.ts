import { RESET, SET_FIELD, type Action } from "./action";
import { classPrices } from "../../../data/classPrices";

export interface State {
  flightNumber: string;
  passportNumber: string;
  ticketClass: string;
  seatNumber: string;
  price: string;
  disabled: boolean;
}

export const initialState: State = {
  flightNumber: "",
  passportNumber: "",
  ticketClass: "",
  seatNumber: "",
  price: "",
  disabled: true,
};

export const ticketReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case SET_FIELD: {
      const newState = {
        ...state,
        [action.field]: action.value,
      };

      if (action.field === "flightNumber") {
        newState.ticketClass = "";
        newState.seatNumber = "";
        newState.price = "";
      }

      if (action.field === "ticketClass") {
        newState.seatNumber = "";
        newState.price = action.value ? String(classPrices[action.value]) : "";
      }

      return {
        ...newState,
        disabled:
          newState.flightNumber === "" ||
          newState.passportNumber === "" ||
          newState.ticketClass === "" ||
          newState.seatNumber === "",
      };
    }
    case RESET:
      return initialState;
    default:
      return state;
  }
};

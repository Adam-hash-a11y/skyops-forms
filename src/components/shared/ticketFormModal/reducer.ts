import { TicketFormActionType, type Action } from "./action";

export interface State {
  flightNumber: string;
  passportNumber: string;
  ticketClass: string;
  seatNumber: string;
  disabled: boolean;
}

export const initialState: State = {
  flightNumber: "",
  passportNumber: "",
  ticketClass: "",
  seatNumber: "",
  disabled: true,
};

export const ticketReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case TicketFormActionType.SET_FIELD: {
      const newState = {
        ...state,
        [action.field]: action.value,
      };

      if (action.field === "flightNumber") {
        newState.ticketClass = "";
        newState.seatNumber = "";
      }

      if (action.field === "ticketClass") {
        newState.seatNumber = "";
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
    case TicketFormActionType.RESET:
      return initialState;
    default:
      return state;
  }
};

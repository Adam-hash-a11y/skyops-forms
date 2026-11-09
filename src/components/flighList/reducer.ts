import type { Status } from "../shared/flightFormModal/types";
import { FlightFilterActionType, type Action } from "./action";

interface State {
  origin: string;
  destination: string;
  sortBy: string;
  status: Status;
}

export const initialState: State = {
  origin: "",
  destination: "",
  sortBy: "",
  status: "",
};

export const flightFilterReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case FlightFilterActionType.SET_FILTER: {
      const newState = {
        ...state,
        [action.payload.name]: action.payload.value,
      };
      return newState;
    }
    case FlightFilterActionType.RESET_FILTERS: {
      return initialState;
    }
    default:
      return state;
  }
};

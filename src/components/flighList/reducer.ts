import type { Status } from "../shared/flightFormModal/types";
import { RESET_FILTERS, SET_FILTER } from "./action";

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

export const flightFilterReducer = (state: State, action: any): State => {
  switch (action.type) {
    case SET_FILTER: {
      const newState = {
        ...state,
        [action.payload.name]: action.payload.value,
      };
      return newState;
    }
    case RESET_FILTERS: {
      return initialState;
    }
    default:
      return state;
  }
};

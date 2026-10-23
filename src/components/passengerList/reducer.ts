import {
  RESET_PASSENGER_FILTERS,
  SET_PASSENGER_FILTER,
  type Action,
} from "./action";
interface State {
  firstName: string;
  lastName: string;
  nationality: string;
  sortBy: string;
}

export const initialState: State = {
  firstName: "",
  lastName: "",
  nationality: "",
  sortBy: "",
};

export const passengerFilterReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case SET_PASSENGER_FILTER: {
      const newState = {
        ...state,
        [action.payload.name]: action.payload.value,
      };
      return newState;
    }
    case RESET_PASSENGER_FILTERS: {
      return initialState;
    }
    default:
      return state;
  }
};

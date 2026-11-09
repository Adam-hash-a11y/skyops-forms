import { TicketFilterActionType, type Action } from "./action";
interface State {
  filterBy: string;
  filterValue: string;
}

export const initialState: State = {
  filterBy: "",
  filterValue: "",
};

export const ticketFilterReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case TicketFilterActionType.SET_TICKET_FILTER: {
      if (action.payload.name === "filterBy") {
        return { ...state, filterBy: action.payload.value, filterValue: "" };
      }
      const newState = {
        ...state,
        [action.payload.name]: action.payload.value,
      };
      return newState;
    }
    case TicketFilterActionType.RESET_TICKET_FILTERS: {
      return initialState;
    }
    default:
      return state;
  }
};

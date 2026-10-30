export const SET_TICKET_FILTER = "set_ticket_filter";
export const RESET_TICKET_FILTERS = "reset_ticket_filters";

export type Action =
  | {
      type: typeof SET_TICKET_FILTER;
      payload: { name: string; value: string };
    }
  | { type: typeof RESET_TICKET_FILTERS };

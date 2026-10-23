export const SET_PASSENGER_FILTER = "set_passenger_filter";
export const RESET_PASSENGER_FILTERS = "reset_passenger_filters";

export type Action =
  | {
      type: typeof SET_PASSENGER_FILTER;
      payload: { name: string; value: string };
    }
  | { type: typeof RESET_PASSENGER_FILTERS };

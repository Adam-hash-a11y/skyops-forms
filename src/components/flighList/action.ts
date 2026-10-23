export const SET_FILTER = "set_filter";
export const RESET_FILTERS = "reset_filters";

export type Action =
  | {
      type: typeof SET_FILTER;
      payload: { name: string; value: string };
    }
  | { type: typeof RESET_FILTERS };

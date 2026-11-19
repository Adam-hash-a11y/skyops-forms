export enum FlightFilterActionType {
  SET_FILTER = "set_filter",
  RESET_FILTERS = "reset_filters",
}

export type Action =
  | {
      type: FlightFilterActionType.SET_FILTER;
      payload: { name: string; value: string };
    }
  | { type: FlightFilterActionType.RESET_FILTERS };

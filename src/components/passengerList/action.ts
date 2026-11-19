export enum PassengerFilterActionType {
  SET_PASSENGER_FILTER = "set_passenger_filter",
  RESET_PASSENGER_FILTERS = "reset_passenger_filters",
}

export type Action =
  | {
      type: PassengerFilterActionType.SET_PASSENGER_FILTER;
      payload: { name: string; value: string };
    }
  | { type: PassengerFilterActionType.RESET_PASSENGER_FILTERS };

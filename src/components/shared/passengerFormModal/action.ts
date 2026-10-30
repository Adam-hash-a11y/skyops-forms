export const SET_FIELD = "set_field";
export const SUMBIT_PASSENGER = "sumbit_passenger";
export const RESET_PASSENGER = "reset_passenger";
export const SET_PASSENGER_TOUCHED = "set_passenger_touched";

export type Action =
  | { type: typeof SET_FIELD; field: string; value: string }
  | { type: typeof SUMBIT_PASSENGER }
  | { type: typeof RESET_PASSENGER }
  | { type: typeof SET_PASSENGER_TOUCHED; field: string };

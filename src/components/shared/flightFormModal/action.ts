export enum FlightFormActionType {
  SET_FIELD = "set_field",
  RESET = "reset",
  SET_TOUCHED = "set_touched",
}

export type Action =
  | { type: FlightFormActionType.SET_FIELD; field: string; value: string }
  | { type: FlightFormActionType.RESET }
  | { type: FlightFormActionType.SET_TOUCHED; field: string };

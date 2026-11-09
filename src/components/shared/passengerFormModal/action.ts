export enum PassengerFormActionType {
  SET_FIELD = "set_field",
  RESET_PASSENGER = "reset_passenger",
  SET_PASSENGER_TOUCHED = "set_passenger_touched",
}

export type Action =
  | { type: PassengerFormActionType.SET_FIELD; field: string; value: string }
  | { type: PassengerFormActionType.RESET_PASSENGER }
  | { type: PassengerFormActionType.SET_PASSENGER_TOUCHED; field: string };

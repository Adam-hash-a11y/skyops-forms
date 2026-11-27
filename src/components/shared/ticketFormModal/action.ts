export enum TicketFormActionType {
  SET_FIELD = "set_field",
  RESET = "reset",
}

export type Action =
  | { type: TicketFormActionType.SET_FIELD; field: string; value: string }
  | { type: TicketFormActionType.RESET };

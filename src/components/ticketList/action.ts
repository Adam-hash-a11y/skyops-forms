export enum TicketFilterActionType {
  SET_TICKET_FILTER = "set_ticket_filter",
  RESET_TICKET_FILTERS = "reset_ticket_filters",
}

export type Action =
  | {
      type: TicketFilterActionType.SET_TICKET_FILTER;
      payload: { name: string; value: string };
    }
  | { type: TicketFilterActionType.RESET_TICKET_FILTERS };

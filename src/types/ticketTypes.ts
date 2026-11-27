export enum TicketStatus {
  CONFIRMED = "Confirmed",
  CANCELLED = "Cancelled",
}

export enum TicketClass {
  ECONOMY = "Economy",
  BUSINESS = "Business",
  FIRST = "First",
}

export enum TicketFilterBy {
  FLIGHT = "flight",
  PASSENGER = "passenger",
}

export interface Ticket {
  id: string;
  flightNumber: string;
  passportNumber: string;
  passengerName: string;
  origin: string;
  destination: string;
  seatNumber: string;
  ticketClass: TicketClass;
  price: number;
  status: TicketStatus;
  createdAt: string;
}

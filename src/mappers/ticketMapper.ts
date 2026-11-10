import type { TicketClass, TicketStatus } from "../types/ticketTypes";

interface TicketApi {
  _id: string;
  flight: {
    flightNumber: string;
    route: { origin: string; destination: string };
  } | null;
  passenger: {
    passportNumber: string;
    firstName: string;
    lastName: string;
  } | null;
  seatNumber: string;
  class: string;
  price: number;
  status: string;
  createdAt: string;
}

export const mapTicketFromApi = (ticket: TicketApi) => ({
  id: ticket._id,
  flightNumber: ticket.flight ? ticket.flight.flightNumber : "",
  origin: ticket.flight ? ticket.flight.route.origin : "-",
  destination: ticket.flight ? ticket.flight.route.destination : "-",
  passportNumber: ticket.passenger ? ticket.passenger.passportNumber : "",
  passengerName: ticket.passenger
    ? ticket.passenger.firstName + " " + ticket.passenger.lastName
    : "",
  seatNumber: ticket.seatNumber,
  ticketClass: (ticket.class.charAt(0).toUpperCase() +
    ticket.class.slice(1)) as TicketClass,
  price: ticket.price,
  status: (ticket.status.charAt(0).toUpperCase() +
    ticket.status.slice(1)) as TicketStatus,
  createdAt: ticket.createdAt,
});

export const mapTicketToApi = (
  flight: string,
  passenger: string,
  seatNumber: string,
  ticketClass: string,
) => ({
  flight,
  passenger,
  seatNumber,
  class: ticketClass.toLowerCase(),
});

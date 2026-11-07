import { api } from "./axios";
import { mapTicketFromApi, mapTicketToApi } from "../mappers/ticketMapper";

export const getTickets = async () => {
  const response = await api.get("/tickets");
  return response.data.tickets.map(mapTicketFromApi);
};

export const createTicket = async (
  flight: string,
  passenger: string,
  seatNumber: string,
  ticketClass: string,
) => {
  await api.post(
    "/tickets",
    mapTicketToApi(flight, passenger, seatNumber, ticketClass),
  );
};

export const cancelTicket = async (id: string) => {
  await api.patch(`/tickets/${id}`, { status: "cancelled" });
};

export const getTicketsByFlight = async (flightId: string) => {
  const response = await api.get("/tickets?flightId=" + flightId);
  return response.data.tickets.map(mapTicketFromApi);
};

export const getTicketsByPassenger = async (passengerId: string) => {
  const response = await api.get("/tickets?passengerId=" + passengerId);
  return response.data.tickets.map(mapTicketFromApi);
};

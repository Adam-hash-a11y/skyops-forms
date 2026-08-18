import { api } from "./axios";
import {
  mapFlightFromApi,
  mapFlightToApi,
  mapFlightUpdateToApi,
} from "../mappers/flightMapper";

export const getFlights = async () => {
  const response = await api.get("/flights");
  return response.data.flights.map(mapFlightFromApi);
};

export const deleteFlight = async (flightNumber: string) => {
  await api.delete(`/flights/${flightNumber}`);
};

export const createFlight = async (
  flightNumber: string,
  airline: string,
  origin: string,
  destination: string,
  departureTime: string,
  arrivalTime: string,
  status: string,
  totalSeats: string,
  bookedSeats: string,
) => {
  await api.post(
    `/flights`,
    mapFlightToApi(
      flightNumber,
      airline,
      origin,
      destination,
      departureTime,
      arrivalTime,
      status,
      totalSeats,
      bookedSeats,
    ),
  );
};

export const updateFlight = async (
  flightNumber: string,
  airline: string,
  origin: string,
  destination: string,
  departureTime: string,
  arrivalTime: string,
  status: string,
  totalSeats: string,
  bookedSeats: string,
) => {
  await api.patch(
    `/flights/${flightNumber}`,
    mapFlightUpdateToApi(
      airline,
      origin,
      destination,
      departureTime,
      arrivalTime,
      status,
      totalSeats,
      bookedSeats,
    ),
  );
};

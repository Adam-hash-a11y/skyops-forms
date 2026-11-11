import { api } from "./axios";
import {
  mapFlightFromApi,
  mapFlightToApi,
  mapFlightUpdateToApi,
} from "../mappers/flightMapper";
import type { FlightStatus } from "../types/flightTypes";

export const getFlights = async () => {
  const response = await api.get("/flights");
  return response.data.flights.map(mapFlightFromApi);
};

export const deleteFlight = async (flightNumber: string) => {
  await api.delete(`/flights/${flightNumber}`);
};

export const getFreeSeats = async (flightNumber: string) => {
  const response = await api.get(`/flights/${flightNumber}/seats`);
  return response.data;
};

export const getFlight = async (flightNumber: string) => {
  const response = await api.get(`/flights/${flightNumber}`);
  return mapFlightFromApi(response.data);
};

export const createFlight = async (
  flightNumber: string,
  airline: string,
  origin: string,
  destination: string,
  departureTime: string,
  arrivalTime: string,
  status: FlightStatus,
  firstSeats: string,
  businessSeats: string,
  economySeats: string,
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
      firstSeats,
      businessSeats,
      economySeats,
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
  status: FlightStatus,
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
    ),
  );
};

export const searchFlights = async (
  status: string,
  origin: string,
  destination: string,
  sortBy: string,
) => {
  const params: Record<string, string> = {};
  if (status !== "") params.status = status.toLowerCase();
  if (origin !== "") params.origin = origin.trim().toUpperCase();
  if (destination !== "") params.destination = destination.trim().toUpperCase();
  if (sortBy !== "") params.sortBy = sortBy;

  const response = await api.get("/flights", { params });
  return response.data.flights.map(mapFlightFromApi);
};

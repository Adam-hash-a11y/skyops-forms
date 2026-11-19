import { api } from "./axios";
import {
  mapPassengerFromApi,
  mapPassengerToApi,
  mapPassengerUpdateToApi,
} from "../mappers/passengerMapper";

export const getPassengers = async () => {
  const response = await api.get("/passengers");
  return response.data.passengers.map(mapPassengerFromApi);
};

export const deletePassenger = async (passportNumber: string) => {
  await api.delete(`/passengers/${passportNumber}`);
};

export const createPassenger = async (
  firstName: string,
  lastName: string,
  passportNumber: string,
  nationality: string,
  dateOfBirth: string,
  email: string,
  phoneNumber: string,
) => {
  await api.post(
    `/passengers`,
    mapPassengerToApi(
      firstName,
      lastName,
      passportNumber,
      nationality,
      dateOfBirth,
      email,
      phoneNumber,
    ),
  );
};

export const updatePassenger = async (
  passportNumber: string,
  firstName: string,
  lastName: string,
  nationality: string,
  dateOfBirth: string,
  email: string,
  phoneNumber: string,
) => {
  await api.patch(
    `/passengers/${passportNumber}`,
    mapPassengerUpdateToApi(
      firstName,
      lastName,
      nationality,
      dateOfBirth,
      email,
      phoneNumber,
    ),
  );
};

export const getPassenger = async (passportNumber: string) => {
  const response = await api.get(`/passengers/${passportNumber}`);
  return mapPassengerFromApi(response.data);
};

export const searchPassengers = async (
  nationality: string,
  firstName: string,
  lastName: string,
  sortBy: string,
) => {
  const params: Record<string, string> = {};
  if (nationality !== "") params.nationality = nationality;
  if (firstName.trim() !== "") params.firstName = firstName.trim();
  if (lastName.trim() !== "") params.lastName = lastName.trim();
  if (sortBy !== "") params.sortBy = sortBy;

  const response = await api.get("/passengers", { params });
  return response.data.passengers.map(mapPassengerFromApi);
};

interface PassengerApi {
  _id: string;
  firstName: string;
  lastName: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
}

export const mapPassengerFromApi = (passenger: PassengerApi) => ({
  id: passenger._id,
  firstName: passenger.firstName,
  lastName: passenger.lastName,
  passportNumber: passenger.passportNumber,
  nationality: passenger.nationality,
  dateOfBirth: passenger.dateOfBirth.slice(0, 10),
  email: passenger.email,
  phoneNumber: passenger.phoneNumber,
});

export const mapPassengerToApi = (
  firstName: string,
  lastName: string,
  passportNumber: string,
  nationality: string,
  dateOfBirth: string,
  email: string,
  phoneNumber: string,
) => ({
  firstName,
  lastName,
  passportNumber,
  nationality,
  dateOfBirth,
  email,
  phoneNumber,
});

export const mapPassengerUpdateToApi = (
  firstName: string,
  lastName: string,
  nationality: string,
  dateOfBirth: string,
  email: string,
  phoneNumber: string,
) => ({
  firstName,
  lastName,
  nationality,
  dateOfBirth,
  email,
  phoneNumber,
});

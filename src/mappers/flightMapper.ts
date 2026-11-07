interface FlightApi {
  _id: string;
  flightNumber: string;
  airline: string;
  route: { origin: string; destination: string };
  schedule: { departureTime: string; arrivalTime: string };
  status: string;
  totalSeats: number;
  bookedSeats: number;
}

export const mapFlightFromApi = (flight: FlightApi) => ({
  id: flight._id,
  flightNumber: flight.flightNumber,
  airline: flight.airline,
  origin: flight.route.origin,
  destination: flight.route.destination,
  departureTime: flight.schedule.departureTime,
  arrivalTime: flight.schedule.arrivalTime,
  status: flight.status.charAt(0).toUpperCase() + flight.status.slice(1),
  totalSeats: flight.totalSeats,
  bookedSeats: flight.bookedSeats,
});

export const mapFlightToApi = (
  flightNumber: string,
  airline: string,
  origin: string,
  destination: string,
  departureTime: string,
  arrivalTime: string,
  status: string,
  firstSeats: string,
  businessSeats: string,
  economySeats: string,
) => ({
  flightNumber,
  airline,
  route: {
    origin,
    destination,
  },
  schedule: {
    departureTime,
    arrivalTime,
  },
  status: status.toLowerCase(),
  firstSeats: Number(firstSeats),
  businessSeats: Number(businessSeats),
  economySeats: Number(economySeats),
});

export const mapFlightUpdateToApi = (
  airline: string,
  origin: string,
  destination: string,
  departureTime: string,
  arrivalTime: string,
  status: string,
) => ({
  airline,
  route: {
    origin,
    destination,
  },
  schedule: {
    departureTime,
    arrivalTime,
  },
  status: status.toLowerCase(),
});

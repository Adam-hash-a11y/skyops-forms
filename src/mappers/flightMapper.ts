export const mapFlightFromApi = (flight: any) => ({
  flightNumber: flight.flightNumber,
  airline: flight.airline,
  origin: flight.route.origin,
  destination: flight.route.destination,
  departureTime: flight.schedule.departureTime,
  arrivalTime: flight.schedule.arrivalTime,
  status: flight.status,
  totalSeats: flight.seats.total,
  bookedSeats: flight.seats.booked,
});

export const mapFlightToApi = (
  flightNumber: string,
  airline: string,
  origin: string,
  destination: string,
  departureTime: string,
  arrivalTime: string,
  status: string,
  totalSeats: string,
  bookedSeats: string,
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
  seats: {
    total: Number(totalSeats),
    booked: Number(bookedSeats),
  },
});

export const mapFlightUpdateToApi = (
  airline: string,
  origin: string,
  destination: string,
  departureTime: string,
  arrivalTime: string,
  status: string,
  totalSeats: string,
  bookedSeats: string,
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
  seats: {
    total: Number(totalSeats),
    booked: Number(bookedSeats),
  },
});

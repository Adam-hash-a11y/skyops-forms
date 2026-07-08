export interface Flight {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
  bookedSeats: number;
  totalSeats: number;
}

export const flights: Flight[] = [];

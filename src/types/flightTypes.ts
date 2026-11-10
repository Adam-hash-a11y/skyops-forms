export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status: FlightStatus;
  totalSeats: number;
  bookedSeats: number;
}

export enum FlightStatus {
  SCHEDULED = "Scheduled",
  DELAYED = "Delayed",
  CANCELLED = "Cancelled",
  LANDED = "Landed",
}

export interface Ticket {
  id: string;
  flightNumber: string;
  passportNumber: string;
  passengerName: string;
  origin: string;
  destination: string;
  seatNumber: string;
  ticketClass: string;
  price: number;
  status: string;
  createdAt: string;
}

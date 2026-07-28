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

export const flights: Flight[] = [
  {
    flightNumber: "SKYOPS-999",
    airline: "cdlhvjnxfc",
    origin: "ABC",
    destination: "BCD",
    departureTime: "2026-07-27T20:30",
    arrivalTime: "2026-07-29T20:30",
    status: "Scheduled",
    bookedSeats: 0,
    totalSeats: 10,
  },
  {
    flightNumber: "SKYOPS-102",
    airline: "vkfhvkdn",
    origin: "ABC",
    destination: "BCD",
    departureTime: "2026-07-27T20:30",
    arrivalTime: "2026-07-28T20:30",
    status: "Scheduled",
    bookedSeats: 0,
    totalSeats: 10,
  },

  {
    flightNumber: "SKYOPS-103",
    airline: "cdslkxchvjc",
    origin: "ABC",
    destination: "BCD",
    departureTime: "2026-07-27T20:31",
    arrivalTime: "2026-07-28T20:31",
    status: "Scheduled",
    bookedSeats: 0,
    totalSeats: 9,
  },
];

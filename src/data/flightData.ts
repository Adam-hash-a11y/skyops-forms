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
    flightNumber: "SKYOPS-101",
    airline: "Tunisair",
    origin: "TUN",
    destination: "FRA",
    departureTime: "2026-11-03T08:15",
    arrivalTime: "2026-11-03T11:05",
    status: "Scheduled",
    bookedSeats: 120,
    totalSeats: 180,
  },
  {
    flightNumber: "SKYOPS-102",
    airline: "Lufthansa",
    origin: "FRA",
    destination: "TUN",
    departureTime: "2026-11-03T14:30",
    arrivalTime: "2026-11-03T17:20",
    status: "Delayed",
    bookedSeats: 175,
    totalSeats: 180,
  },
  {
    flightNumber: "SKYOPS-103",
    airline: "Eurowings",
    origin: "DUS",
    destination: "MAD",
    departureTime: "2026-11-04T06:45",
    arrivalTime: "2026-11-04T09:50",
    status: "Scheduled",
    bookedSeats: 150,
    totalSeats: 150,
  },
  {
    flightNumber: "SKYOPS-104",
    airline: "Transavia",
    origin: "CDG",
    destination: "MUC",
    departureTime: "2026-10-18T10:00",
    arrivalTime: "2026-10-18T11:35",
    status: "Landed",
    bookedSeats: 98,
    totalSeats: 140,
  },
  {
    flightNumber: "SKYOPS-105",
    airline: "Nouvelair",
    origin: "TUN",
    destination: "CDG",
    departureTime: "2026-11-05T19:20",
    arrivalTime: "2026-11-05T22:10",
    status: "Cancelled",
    bookedSeats: 45,
    totalSeats: 160,
  },
  {
    flightNumber: "SKYOPS-106",
    airline: "Iberia",
    origin: "MAD",
    destination: "FRA",
    departureTime: "2026-11-06T12:00",
    arrivalTime: "2026-11-06T14:35",
    status: "Scheduled",
    bookedSeats: 20,
    totalSeats: 200,
  },
  {
    flightNumber: "SKYOPS-107",
    airline: "Pegasus",
    origin: "CDG",
    destination: "TUN",
    departureTime: "2026-11-07T21:40",
    arrivalTime: "2026-11-07T23:55",
    status: "Delayed",
    bookedSeats: 60,
    totalSeats: 210,
  },
];

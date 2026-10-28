export interface Flight {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
  firstSeats: number;
  businessSeats: number;
  economySeats: number;
  takenSeats: string[];
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
    firstSeats: 12,
    businessSeats: 28,
    economySeats: 140,
    takenSeats: ["B3", "C12", "C21"],
  },
  {
    flightNumber: "SKYOPS-102",
    airline: "Lufthansa",
    origin: "FRA",
    destination: "TUN",
    departureTime: "2026-11-03T14:30",
    arrivalTime: "2026-11-03T17:20",
    status: "Delayed",
    firstSeats: 12,
    businessSeats: 28,
    economySeats: 140,
    takenSeats: ["C7", "C9"],
  },
  {
    flightNumber: "SKYOPS-103",
    airline: "Eurowings",
    origin: "DUS",
    destination: "MAD",
    departureTime: "2026-11-04T06:45",
    arrivalTime: "2026-11-04T09:50",
    status: "Scheduled",
    firstSeats: 10,
    businessSeats: 30,
    economySeats: 110,
    takenSeats: [],
  },
  {
    flightNumber: "SKYOPS-104",
    airline: "Transavia",
    origin: "CDG",
    destination: "MUC",
    departureTime: "2026-10-18T10:00",
    arrivalTime: "2026-10-18T11:35",
    status: "Landed",
    firstSeats: 10,
    businessSeats: 30,
    economySeats: 100,
    takenSeats: ["A1", "C14"],
  },
  {
    flightNumber: "SKYOPS-105",
    airline: "Nouvelair",
    origin: "TUN",
    destination: "CDG",
    departureTime: "2026-11-05T19:20",
    arrivalTime: "2026-11-05T22:10",
    status: "Cancelled",
    firstSeats: 10,
    businessSeats: 30,
    economySeats: 120,
    takenSeats: ["C22"],
  },
  {
    flightNumber: "SKYOPS-106",
    airline: "Iberia",
    origin: "MAD",
    destination: "FRA",
    departureTime: "2026-11-06T12:00",
    arrivalTime: "2026-11-06T14:35",
    status: "Scheduled",
    firstSeats: 20,
    businessSeats: 40,
    economySeats: 140,
    takenSeats: ["B11"],
  },
  {
    flightNumber: "SKYOPS-107",
    airline: "Pegasus",
    origin: "CDG",
    destination: "TUN",
    departureTime: "2026-11-07T21:40",
    arrivalTime: "2026-11-07T23:55",
    status: "Delayed",
    firstSeats: 20,
    businessSeats: 40,
    economySeats: 150,
    takenSeats: [],
  },
];

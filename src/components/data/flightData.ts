export interface FlightData {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
  totalSeats: number;
  bookedSeats: number;
}

export const flightArray: FlightData[] = [
  {
    flightNumber: "SKYOPS-1515",
    airline: "Turkish-Ailine",
    origin: "TUN",
    destination: "DEU",
    departureTime: "2026-07-16T14:05",
    arrivalTime: "2026-07-18T14:06",
    status: "Scheduled",
    totalSeats: 20,
    bookedSeats: 3,
  },
  {
    flightNumber: "SKYOPS-1516",
    airline: "BBBBB",
    origin: "TUN",
    destination: "DEU",
    departureTime: "2026-07-16T14:05",
    arrivalTime: "2026-07-18T14:06",
    status: "Scheduled",
    totalSeats: 20,
    bookedSeats: 19,
  },
];

console.log("flightData.ts module loaded, array identity:", flightArray);

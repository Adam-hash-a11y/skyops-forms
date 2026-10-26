export interface Ticket {
  id: string;
  flightNumber: string;
  passportNumber: string;
  seatNumber: string;
  ticketClass: string;
  price: number;
  status: string;
  createdAt: string;
}

export const tickets: Ticket[] = [
  {
    id: "T-001",
    flightNumber: "SKYOPS-101",
    passportNumber: "PA284719",
    seatNumber: "A12",
    ticketClass: "Economy",
    price: 189,
    status: "Confirmed",
    createdAt: "2026-10-02T09:14",
  },
  {
    id: "T-002",
    flightNumber: "SKYOPS-101",
    passportNumber: "TN901823",
    seatNumber: "B03",
    ticketClass: "Business",
    price: 420,
    status: "Confirmed",
    createdAt: "2026-10-03T11:40",
  },
  {
    id: "T-003",
    flightNumber: "SKYOPS-101",
    passportNumber: "ES558214",
    seatNumber: "C21",
    ticketClass: "Economy",
    price: 175,
    status: "Cancelled",
    createdAt: "2026-10-04T16:02",
  },
  {
    id: "T-004",
    flightNumber: "SKYOPS-102",
    passportNumber: "FR730461",
    seatNumber: "D07",
    ticketClass: "Economy",
    price: 210,
    status: "Confirmed",
    createdAt: "2026-10-05T08:30",
  },
  {
    id: "T-005",
    flightNumber: "SKYOPS-104",
    passportNumber: "IT615937",
    seatNumber: "F14",
    ticketClass: "Economy",
    price: 132,
    status: "Confirmed",
    createdAt: "2026-10-06T13:21",
  },
  {
    id: "T-006",
    flightNumber: "SKYOPS-104",
    passportNumber: "PA284719",
    seatNumber: "A01",
    ticketClass: "First",
    price: 690,
    status: "Confirmed",
    createdAt: "2026-10-07T10:05",
  },
  {
    id: "T-007",
    flightNumber: "SKYOPS-105",
    passportNumber: "TR482056",
    seatNumber: "E22",
    ticketClass: "Economy",
    price: 148,
    status: "Cancelled",
    createdAt: "2026-10-08T19:48",
  },
  {
    id: "T-008",
    flightNumber: "SKYOPS-106",
    passportNumber: "PL397142",
    seatNumber: "B11",
    ticketClass: "Business",
    price: 385,
    status: "Confirmed",
    createdAt: "2026-10-09T07:55",
  },
  {
    id: "T-009",
    flightNumber: "SKYOPS-999",
    passportNumber: "FR730461",
    seatNumber: "C05",
    ticketClass: "Economy",
    price: 199,
    status: "Confirmed",
    createdAt: "2026-10-01T12:00",
  },
  {
    id: "T-010",
    flightNumber: "SKYOPS-102",
    passportNumber: "XX000000",
    seatNumber: "A09",
    ticketClass: "Economy",
    price: 205,
    status: "Confirmed",
    createdAt: "2026-10-06T15:12",
  },
];

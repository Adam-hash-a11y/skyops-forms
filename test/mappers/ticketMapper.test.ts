import { describe, expect, it } from "vitest";
import {
  mapTicketFromApi,
  mapTicketToApi,
} from "../../src/mappers/ticketMapper";

const apiTicket = {
  _id: "t123",
  flight: {
    flightNumber: "SKYOPS-105",
    route: { origin: "TUN", destination: "FRA" },
  },
  passenger: {
    passportNumber: "X123456",
    firstName: "Adam",
    lastName: "Ben Ali",
  },
  seatNumber: "A2",
  class: "economy",
  price: 120,
  status: "confirmed",
  createdAt: "2026-06-01T08:00:00.000Z",
};

describe("ticketMapper", () => {
  describe("mapTicketFromApi", () => {
    it("should flatten the flight and the passenger and build the full name", () => {
      //ARRANGE
      const ticket = apiTicket;

      //ACT
      const result = mapTicketFromApi(ticket);

      //ASSERT
      expect(result).toEqual({
        id: "t123",
        flightNumber: "SKYOPS-105",
        origin: "TUN",
        destination: "FRA",
        passportNumber: "X123456",
        passengerName: "Adam Ben Ali",
        seatNumber: "A2",
        ticketClass: "Economy",
        price: 120,
        status: "Confirmed",
        createdAt: "2026-06-01T08:00:00.000Z",
      });
    });

    it("should capitalize the class and the status", () => {
      //ARRANGE
      const ticket = { ...apiTicket, class: "business", status: "cancelled" };

      //ACT
      const result = mapTicketFromApi(ticket);

      //ASSERT
      expect(result.ticketClass).toBe("Business");
      expect(result.status).toBe("Cancelled");
    });

    it("should use empty flight number and dashes when the flight is deleted", () => {
      //ARRANGE
      const ticket = { ...apiTicket, flight: null };

      //ACT
      const result = mapTicketFromApi(ticket);

      //ASSERT
      expect(result.flightNumber).toBe("");
      expect(result.origin).toBe("-");
      expect(result.destination).toBe("-");
      expect(result.passengerName).toBe("Adam Ben Ali");
    });

    it("should use an empty passport number and name when the passenger is deleted", () => {
      //ARRANGE
      const ticket = { ...apiTicket, passenger: null };

      //ACT
      const result = mapTicketFromApi(ticket);

      //ASSERT
      expect(result.passportNumber).toBe("");
      expect(result.passengerName).toBe("");
      expect(result.flightNumber).toBe("SKYOPS-105");
    });

    it("should not crash when both the flight and the passenger are deleted", () => {
      //ARRANGE
      const ticket = { ...apiTicket, flight: null, passenger: null };

      //ACT
      const result = mapTicketFromApi(ticket);

      //ASSERT
      expect(result.flightNumber).toBe("");
      expect(result.passportNumber).toBe("");
      expect(result.seatNumber).toBe("A2");
    });
  });

  describe("mapTicketToApi", () => {
    it("should lowercase the class and pass the other fields through", () => {
      //ARRANGE
      const flightId = "f123";
      const passengerId = "p123";

      //ACT
      const result = mapTicketToApi(flightId, passengerId, "A2", "Business");

      //ASSERT
      expect(result).toEqual({
        flight: "f123",
        passenger: "p123",
        seatNumber: "A2",
        class: "business",
      });
    });
  });
});

import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

vi.mock("../../src/service/axios");

import { api } from "../../src/service/axios";
import {
  cancelTicket,
  createTicket,
  getTickets,
  getTicketsByFlight,
  getTicketsByPassenger,
} from "../../src/service/ticketService";
import { TicketClass, TicketStatus } from "../../src/types/ticketTypes";

const apiTicket = {
  _id: "t1",
  flight: {
    flightNumber: "SKYOPS-105",
    route: { origin: "TUN", destination: "FRA" },
  },
  passenger: {
    passportNumber: "DE7731902",
    firstName: "Lena",
    lastName: "Banks",
  },
  seatNumber: "A2",
  class: "economy",
  price: 150,
  status: "confirmed",
  createdAt: "2026-05-01T09:30:00.000Z",
};

const mappedTicket = {
  id: "t1",
  flightNumber: "SKYOPS-105",
  origin: "TUN",
  destination: "FRA",
  passportNumber: "DE7731902",
  passengerName: "Lena Banks",
  seatNumber: "A2",
  ticketClass: TicketClass.ECONOMY,
  price: 150,
  status: TicketStatus.CONFIRMED,
  createdAt: "2026-05-01T09:30:00.000Z",
};

const apiTicketWithDeletedFlightAndPassenger = {
  ...apiTicket,
  _id: "t2",
  flight: null,
  passenger: null,
};

const mappedTicketWithDeletedFlightAndPassenger = {
  ...mappedTicket,
  id: "t2",
  flightNumber: "",
  origin: "-",
  destination: "-",
  passportNumber: "",
  passengerName: "",
};

describe("ticketService", () => {
  describe("reading tickets", () => {
    it("should call GET /tickets and return the tickets mapped, including one with a deleted flight and passenger", async () => {
      //ARRANGE
      vi.mocked(api.get).mockResolvedValue({
        data: { tickets: [apiTicket, apiTicketWithDeletedFlightAndPassenger] },
      });

      //ACT
      const result = await getTickets();

      //ASSERT
      expect(api.get).toHaveBeenCalledTimes(1);
      expect(api.get).toHaveBeenCalledWith("/tickets");
      expect(result).toEqual([
        mappedTicket,
        mappedTicketWithDeletedFlightAndPassenger,
      ]);
    });

    it("should call GET /tickets?flightId=f1 and return the tickets mapped", async () => {
      //ARRANGE
      vi.mocked(api.get).mockResolvedValue({ data: { tickets: [apiTicket] } });

      //ACT
      const result = await getTicketsByFlight("f1");

      //ASSERT
      expect(api.get).toHaveBeenCalledTimes(1);
      expect(api.get).toHaveBeenCalledWith("/tickets?flightId=f1");
      expect(result).toEqual([mappedTicket]);
    });

    it("should call GET /tickets?passengerId=p1 and return the tickets mapped", async () => {
      //ARRANGE
      vi.mocked(api.get).mockResolvedValue({ data: { tickets: [apiTicket] } });

      //ACT
      const result = await getTicketsByPassenger("p1");

      //ASSERT
      expect(api.get).toHaveBeenCalledTimes(1);
      expect(api.get).toHaveBeenCalledWith("/tickets?passengerId=p1");
      expect(result).toEqual([mappedTicket]);
    });
  });

  describe("writing tickets", () => {
    it("should call POST /tickets with the class in lowercase", async () => {
      //ARRANGE
      vi.mocked(api.post).mockResolvedValue({ data: {} });

      //ACT
      await createTicket("f1", "p1", "A2", "Economy");

      //ASSERT
      expect(api.post).toHaveBeenCalledTimes(1);
      expect(api.post).toHaveBeenCalledWith("/tickets", {
        flight: "f1",
        passenger: "p1",
        seatNumber: "A2",
        class: "economy",
      });
    });

    it("should call PATCH /tickets/t1 with the status cancelled", async () => {
      //ARRANGE
      vi.mocked(api.patch).mockResolvedValue({ data: {} });

      //ACT
      await cancelTicket("t1");

      //ASSERT
      expect(api.patch).toHaveBeenCalledTimes(1);
      expect(api.patch).toHaveBeenCalledWith("/tickets/t1", {
        status: "cancelled",
      });
    });
  });

  describe("failures", () => {
    it("should pass the error on to the caller when the API call is rejected", async () => {
      //ARRANGE
      vi.mocked(api.get).mockRejectedValue(new Error("Server not reachable"));

      //ACT
      const promise = getTickets();

      //ASSERT
      await expect(promise).rejects.toThrow("Server not reachable");
    });
  });
});

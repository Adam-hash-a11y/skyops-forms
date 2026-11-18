import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

vi.mock("../../src/service/axios");

import { api } from "../../src/service/axios";
import {
  createFlight,
  deleteFlight,
  getFlight,
  getFlights,
  getFreeSeats,
  searchFlights,
  updateFlight,
} from "../../src/service/flightService";
import { FlightStatus } from "../../src/types/flightTypes";

const apiFlight = {
  _id: "f1",
  flightNumber: "SKYOPS-105",
  airline: "SkyOps Air",
  route: { origin: "TUN", destination: "FRA" },
  schedule: {
    departureTime: "2026-06-01T08:00:00.000Z",
    arrivalTime: "2026-06-01T10:00:00.000Z",
  },
  status: "scheduled",
  totalSeats: 100,
  bookedSeats: 10,
};

const mappedFlight = {
  id: "f1",
  flightNumber: "SKYOPS-105",
  airline: "SkyOps Air",
  origin: "TUN",
  destination: "FRA",
  departureTime: "2026-06-01T08:00:00.000Z",
  arrivalTime: "2026-06-01T10:00:00.000Z",
  status: FlightStatus.SCHEDULED,
  totalSeats: 100,
  bookedSeats: 10,
};

describe("flightService", () => {
  describe("reading flights", () => {
    it("should call GET /flights and return the flights mapped for the app", async () => {
      //ARRANGE
      vi.mocked(api.get).mockResolvedValue({ data: { flights: [apiFlight] } });

      //ACT
      const result = await getFlights();

      //ASSERT
      expect(api.get).toHaveBeenCalledTimes(1);
      expect(api.get).toHaveBeenCalledWith("/flights");
      expect(result).toEqual([mappedFlight]);
    });

    it("should call GET /flights/SKYOPS-105 and return one mapped flight", async () => {
      //ARRANGE
      vi.mocked(api.get).mockResolvedValue({ data: apiFlight });

      //ACT
      const result = await getFlight("SKYOPS-105");

      //ASSERT
      expect(api.get).toHaveBeenCalledTimes(1);
      expect(api.get).toHaveBeenCalledWith("/flights/SKYOPS-105");
      expect(result).toEqual(mappedFlight);
    });

    it("should call GET /flights/SKYOPS-105/seats and return the data unchanged", async () => {
      //ARRANGE
      const freeSeats = {
        seats: [{ seat: "A1", class: "first" }],
        counts: { first: 1, business: 0, economy: 0 },
        prices: { first: 900, business: 500, economy: 150 },
      };
      vi.mocked(api.get).mockResolvedValue({ data: freeSeats });

      //ACT
      const result = await getFreeSeats("SKYOPS-105");

      //ASSERT
      expect(api.get).toHaveBeenCalledTimes(1);
      expect(api.get).toHaveBeenCalledWith("/flights/SKYOPS-105/seats");
      expect(result).toEqual(freeSeats);
    });
  });

  describe("writing flights", () => {
    it("should call DELETE /flights/SKYOPS-105", async () => {
      //ARRANGE
      vi.mocked(api.delete).mockResolvedValue({ data: {} });

      //ACT
      await deleteFlight("SKYOPS-105");

      //ASSERT
      expect(api.delete).toHaveBeenCalledTimes(1);
      expect(api.delete).toHaveBeenCalledWith("/flights/SKYOPS-105");
    });

    it("should call POST /flights with a lowercase status and the seats as numbers", async () => {
      //ARRANGE
      vi.mocked(api.post).mockResolvedValue({ data: {} });

      //ACT
      await createFlight(
        "SKYOPS-105",
        "SkyOps Air",
        "TUN",
        "FRA",
        "2026-06-01T08:00",
        "2026-06-01T10:00",
        FlightStatus.SCHEDULED,
        "10",
        "20",
        "100",
      );

      //ASSERT
      expect(api.post).toHaveBeenCalledTimes(1);
      expect(api.post).toHaveBeenCalledWith("/flights", {
        flightNumber: "SKYOPS-105",
        airline: "SkyOps Air",
        route: { origin: "TUN", destination: "FRA" },
        schedule: {
          departureTime: "2026-06-01T08:00",
          arrivalTime: "2026-06-01T10:00",
        },
        status: "scheduled",
        firstSeats: 10,
        businessSeats: 20,
        economySeats: 100,
      });
    });

    it("should call PATCH /flights/SKYOPS-105 with a body that has no flight number and no seats", async () => {
      //ARRANGE
      vi.mocked(api.patch).mockResolvedValue({ data: {} });

      //ACT
      await updateFlight(
        "SKYOPS-105",
        "SkyOps Air",
        "TUN",
        "FRA",
        "2026-06-01T08:00",
        "2026-06-01T10:00",
        FlightStatus.DELAYED,
      );

      //ASSERT
      expect(api.patch).toHaveBeenCalledTimes(1);
      expect(api.patch).toHaveBeenCalledWith("/flights/SKYOPS-105", {
        airline: "SkyOps Air",
        route: { origin: "TUN", destination: "FRA" },
        schedule: {
          departureTime: "2026-06-01T08:00",
          arrivalTime: "2026-06-01T10:00",
        },
        status: "delayed",
      });
    });
  });

  describe("searching flights", () => {
    it("should send status in lowercase, origin and destination trimmed and uppercase, and sortBy as it is", async () => {
      //ARRANGE
      vi.mocked(api.get).mockResolvedValue({ data: { flights: [apiFlight] } });

      //ACT
      const result = await searchFlights(
        "Delayed",
        " tun ",
        "fra ",
        "departureTime",
      );

      //ASSERT
      expect(api.get).toHaveBeenCalledTimes(1);
      expect(api.get).toHaveBeenCalledWith("/flights", {
        params: {
          status: "delayed",
          origin: "TUN",
          destination: "FRA",
          sortBy: "departureTime",
        },
      });
      expect(result).toEqual([mappedFlight]);
    });

    it("should not send any param when all filters are empty", async () => {
      //ARRANGE
      vi.mocked(api.get).mockResolvedValue({ data: { flights: [] } });

      //ACT
      const result = await searchFlights("", "", "", "");

      //ASSERT
      expect(api.get).toHaveBeenCalledTimes(1);
      expect(api.get).toHaveBeenCalledWith("/flights", { params: {} });
      expect(result).toEqual([]);
    });
  });

  describe("failures", () => {
    it("should pass the error on to the caller when the API call is rejected", async () => {
      //ARRANGE
      vi.mocked(api.get).mockRejectedValue(new Error("Server not reachable"));

      //ACT
      const promise = getFlights();

      //ASSERT
      await expect(promise).rejects.toThrow("Server not reachable");
    });
  });
});

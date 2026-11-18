import { describe, expect, it } from "vitest";
import {
  mapFlightFromApi,
  mapFlightToApi,
  mapFlightUpdateToApi,
} from "../../src/mappers/flightMapper";

const apiFlight = {
  _id: "abc123",
  flightNumber: "SKYOPS-105",
  airline: "SkyOps Air",
  route: { origin: "TUN", destination: "FRA" },
  schedule: {
    departureTime: "2026-06-01T08:00:00.000Z",
    arrivalTime: "2026-06-01T10:00:00.000Z",
  },
  status: "scheduled",
  totalSeats: 150,
  bookedSeats: 12,
};

describe("flightMapper", () => {
  describe("mapFlightFromApi", () => {
    it("should flatten the API flight into the flight used by the UI", () => {
      //ARRANGE
      const flight = apiFlight;

      //ACT
      const result = mapFlightFromApi(flight);

      //ASSERT
      expect(result).toEqual({
        id: "abc123",
        flightNumber: "SKYOPS-105",
        airline: "SkyOps Air",
        origin: "TUN",
        destination: "FRA",
        departureTime: "2026-06-01T08:00:00.000Z",
        arrivalTime: "2026-06-01T10:00:00.000Z",
        status: "Scheduled",
        totalSeats: 150,
        bookedSeats: 12,
      });
    });

    it("should capitalize each of the 4 statuses", () => {
      //ARRANGE
      const scheduled = { ...apiFlight, status: "scheduled" };
      const delayed = { ...apiFlight, status: "delayed" };
      const cancelled = { ...apiFlight, status: "cancelled" };
      const landed = { ...apiFlight, status: "landed" };

      //ACT
      const resultScheduled = mapFlightFromApi(scheduled);
      const resultDelayed = mapFlightFromApi(delayed);
      const resultCancelled = mapFlightFromApi(cancelled);
      const resultLanded = mapFlightFromApi(landed);

      //ASSERT
      expect(resultScheduled.status).toBe("Scheduled");
      expect(resultDelayed.status).toBe("Delayed");
      expect(resultCancelled.status).toBe("Cancelled");
      expect(resultLanded.status).toBe("Landed");
    });
  });

  describe("mapFlightToApi", () => {
    it("should build the API object with route, schedule and a lowercase status", () => {
      //ARRANGE
      const flightNumber = "SKYOPS-105";
      const airline = "SkyOps Air";

      //ACT
      const result = mapFlightToApi(
        flightNumber,
        airline,
        "TUN",
        "FRA",
        "2026-06-01T08:00",
        "2026-06-01T10:00",
        "Delayed",
        "10",
        "20",
        "120",
      );

      //ASSERT
      expect(result).toEqual({
        flightNumber: "SKYOPS-105",
        airline: "SkyOps Air",
        route: { origin: "TUN", destination: "FRA" },
        schedule: {
          departureTime: "2026-06-01T08:00",
          arrivalTime: "2026-06-01T10:00",
        },
        status: "delayed",
        firstSeats: 10,
        businessSeats: 20,
        economySeats: 120,
      });
    });

    it("should turn the 3 seat texts into numbers", () => {
      //ARRANGE
      const firstSeats = "10";
      const businessSeats = "20";
      const economySeats = "120";

      //ACT
      const result = mapFlightToApi(
        "SKYOPS-105",
        "SkyOps Air",
        "TUN",
        "FRA",
        "2026-06-01T08:00",
        "2026-06-01T10:00",
        "Scheduled",
        firstSeats,
        businessSeats,
        economySeats,
      );

      //ASSERT
      expect(result.firstSeats).toBe(10);
      expect(result.businessSeats).toBe(20);
      expect(result.economySeats).toBe(120);
    });
  });

  describe("mapFlightUpdateToApi", () => {
    it("should build the update object without flight number and seats", () => {
      //ARRANGE
      const airline = "SkyOps Air";

      //ACT
      const result = mapFlightUpdateToApi(
        airline,
        "TUN",
        "FRA",
        "2026-06-01T08:00",
        "2026-06-01T10:00",
        "Cancelled",
      );

      //ASSERT
      expect(result).toEqual({
        airline: "SkyOps Air",
        route: { origin: "TUN", destination: "FRA" },
        schedule: {
          departureTime: "2026-06-01T08:00",
          arrivalTime: "2026-06-01T10:00",
        },
        status: "cancelled",
      });
    });
  });
});

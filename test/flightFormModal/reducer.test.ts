import { describe, expect, it } from "vitest";
import {
  flightReducer,
  initialState,
} from "../../src/components/shared/flightFormModal/reducer";
import { FlightFormActionType } from "../../src/components/shared/flightFormModal/action";
import { FlightStatus } from "../../src/types/flightTypes";

const validState = {
  ...initialState,
  flightNumber: "SKYOPS-105",
  airline: "SkyOps Air",
  origin: "TUN",
  destination: "FRA",
  departureTime: "2026-06-01T08:00",
  arrivalTime: "2026-06-01T10:00",
  status: FlightStatus.SCHEDULED,
  firstSeats: "10",
  businessSeats: "20",
  economySeats: "120",
};

describe("flightReducer", () => {
  describe("initial state", () => {
    it("should start with a disabled button, Scheduled status, zero seats, no errors and nothing touched", () => {
      //ARRANGE
      const state = initialState;

      //ACT
      const touchedValues = Object.values(state.touched);
      const errorValues = Object.values(state.errors);

      //ASSERT
      expect(state.disabled).toBe(true);
      expect(state.isEdit).toBe(false);
      expect(state.status).toBe("Scheduled");
      expect(state.firstSeats).toBe("0");
      expect(state.businessSeats).toBe("0");
      expect(state.economySeats).toBe("0");
      expect(touchedValues.every((touched) => touched === false)).toBe(true);
      expect(errorValues.every((error) => error === "")).toBe(true);
    });
  });

  describe("SET_FIELD", () => {
    it("should store the typed value in the state", () => {
      //ARRANGE
      const action = {
        type: FlightFormActionType.SET_FIELD as const,
        field: "flightNumber",
        value: "SKYOPS-105",
      };

      //ACT
      const result = flightReducer(initialState, action);

      //ASSERT
      expect(result.flightNumber).toBe("SKYOPS-105");
    });

    it("should not mark the field as touched while the user is typing", () => {
      //ARRANGE
      const action = {
        type: FlightFormActionType.SET_FIELD as const,
        field: "flightNumber",
        value: "SKY",
      };

      //ACT
      const result = flightReducer(initialState, action);

      //ASSERT
      expect(result.touched.flightNumber).toBe(false);
    });

    it("should enable the button and show no errors when the whole form is valid", () => {
      //ARRANGE
      const action = {
        type: FlightFormActionType.SET_FIELD as const,
        field: "airline",
        value: "SkyOps Air",
      };

      //ACT
      const result = flightReducer(validState, action);

      //ASSERT
      expect(result.disabled).toBe(false);
      expect(result.errors).toEqual(initialState.errors);
    });

    it("should set the flight number error and disable the button when the flight number is wrong", () => {
      //ARRANGE
      const action = {
        type: FlightFormActionType.SET_FIELD as const,
        field: "flightNumber",
        value: "SKY-1",
      };

      //ACT
      const result = flightReducer(validState, action);

      //ASSERT
      expect(result.errors.flightNumber).toBe(
        "Flight number must start with SKYOPS-XXX",
      );
      expect(result.disabled).toBe(true);
    });

    it("should set the error on origin and destination when they are the same", () => {
      //ARRANGE
      const action = {
        type: FlightFormActionType.SET_FIELD as const,
        field: "destination",
        value: "TUN",
      };

      //ACT
      const result = flightReducer(validState, action);

      //ASSERT
      expect(result.errors.origin).toBe(
        "Origin and destination can't be the same",
      );
      expect(result.errors.destination).toBe(
        "Origin and destination can't be the same",
      );
      expect(result.disabled).toBe(true);
    });

    it("should set the error on both times when departure is after arrival", () => {
      //ARRANGE
      const action = {
        type: FlightFormActionType.SET_FIELD as const,
        field: "departureTime",
        value: "2026-06-01T12:00",
      };

      //ACT
      const result = flightReducer(validState, action);

      //ASSERT
      expect(result.errors.departureTime).toBe(
        "Departure time must be before arrival time",
      );
      expect(result.errors.arrivalTime).toBe(
        "Departure time must be before arrival time",
      );
      expect(result.disabled).toBe(true);
    });

    it("should set the error on the 3 seat fields when all seats are zero", () => {
      //ARRANGE
      const state = { ...validState, businessSeats: "0", economySeats: "0" };
      const action = {
        type: FlightFormActionType.SET_FIELD as const,
        field: "firstSeats",
        value: "0",
      };

      //ACT
      const result = flightReducer(state, action);

      //ASSERT
      expect(result.errors.firstSeats).toBe("A flight needs at least one seat");
      expect(result.errors.businessSeats).toBe(
        "A flight needs at least one seat",
      );
      expect(result.errors.economySeats).toBe(
        "A flight needs at least one seat",
      );
      expect(result.disabled).toBe(true);
    });

    it("should not ask for seats in edit mode", () => {
      //ARRANGE
      const state = {
        ...validState,
        isEdit: true,
        firstSeats: "0",
        businessSeats: "0",
        economySeats: "0",
      };
      const action = {
        type: FlightFormActionType.SET_FIELD as const,
        field: "airline",
        value: "SkyOps Air",
      };

      //ACT
      const result = flightReducer(state, action);

      //ASSERT
      expect(result.errors.firstSeats).toBe("");
      expect(result.errors.businessSeats).toBe("");
      expect(result.errors.economySeats).toBe("");
      expect(result.disabled).toBe(false);
    });
  });

  describe("SET_TOUCHED", () => {
    it("should mark only that field as touched and show its error", () => {
      //ARRANGE
      const action = {
        type: FlightFormActionType.SET_TOUCHED as const,
        field: "airline",
      };

      //ACT
      const result = flightReducer(initialState, action);

      //ASSERT
      expect(result.touched.airline).toBe(true);
      expect(result.touched.origin).toBe(false);
      expect(result.errors.airline).toBe(
        "Airline must be at least 5 characters",
      );
    });
  });

  describe("RESET", () => {
    it("should give back the initial state after the user filled the form", () => {
      //ARRANGE
      const action = { type: FlightFormActionType.RESET as const };

      //ACT
      const result = flightReducer(validState, action);

      //ASSERT
      expect(result).toEqual(initialState);
    });
  });
});

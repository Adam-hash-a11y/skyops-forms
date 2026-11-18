import { describe, expect, it } from "vitest";
import {
  initialState,
  ticketReducer,
} from "../../src/components/shared/ticketFormModal/reducer";
import { TicketFormActionType } from "../../src/components/shared/ticketFormModal/action";
import { TicketClass } from "../../src/types/ticketTypes";

const validState = {
  ...initialState,
  flightNumber: "SKYOPS-105",
  passportNumber: "TN123456",
  ticketClass: TicketClass.BUSINESS,
  seatNumber: "A2",
  disabled: false,
};

describe("ticketReducer", () => {
  describe("initial state", () => {
    it("should start with empty fields and a disabled button", () => {
      //ARRANGE
      const state = initialState;

      //ACT
      //ASSERT
      expect(state.flightNumber).toBe("");
      expect(state.passportNumber).toBe("");
      expect(state.ticketClass).toBe("");
      expect(state.seatNumber).toBe("");
      expect(state.disabled).toBe(true);
    });
  });

  describe("SET_FIELD", () => {
    it("should store the passenger and keep the button disabled while other fields are empty", () => {
      //ARRANGE
      const action = {
        type: TicketFormActionType.SET_FIELD,
        field: "passportNumber",
        value: "TN123456",
      } as const;

      //ACT
      const result = ticketReducer(initialState, action);

      //ASSERT
      expect(result.passportNumber).toBe("TN123456");
      expect(result.disabled).toBe(true);
    });

    it("should enable the button once flight, passenger, class and seat are all set", () => {
      //ARRANGE
      const setFlight = {
        type: TicketFormActionType.SET_FIELD,
        field: "flightNumber",
        value: "SKYOPS-105",
      } as const;
      const setPassenger = {
        type: TicketFormActionType.SET_FIELD,
        field: "passportNumber",
        value: "TN123456",
      } as const;
      const setClass = {
        type: TicketFormActionType.SET_FIELD,
        field: "ticketClass",
        value: TicketClass.BUSINESS,
      } as const;
      const setSeat = {
        type: TicketFormActionType.SET_FIELD,
        field: "seatNumber",
        value: "A2",
      } as const;

      //ACT
      let result = ticketReducer(initialState, setFlight);
      result = ticketReducer(result, setPassenger);
      result = ticketReducer(result, setClass);
      result = ticketReducer(result, setSeat);

      //ASSERT
      expect(result.flightNumber).toBe("SKYOPS-105");
      expect(result.passportNumber).toBe("TN123456");
      expect(result.ticketClass).toBe(TicketClass.BUSINESS);
      expect(result.seatNumber).toBe("A2");
      expect(result.disabled).toBe(false);
    });

    it("should clear class and seat and disable the button when the flight changes", () => {
      //ARRANGE
      const action = {
        type: TicketFormActionType.SET_FIELD,
        field: "flightNumber",
        value: "SKYOPS-200",
      } as const;

      //ACT
      const result = ticketReducer(validState, action);

      //ASSERT
      expect(result.flightNumber).toBe("SKYOPS-200");
      expect(result.ticketClass).toBe("");
      expect(result.seatNumber).toBe("");
      expect(result.passportNumber).toBe("TN123456");
      expect(result.disabled).toBe(true);
    });

    it("should clear only the seat and disable the button when the class changes", () => {
      //ARRANGE
      const action = {
        type: TicketFormActionType.SET_FIELD,
        field: "ticketClass",
        value: TicketClass.FIRST,
      } as const;

      //ACT
      const result = ticketReducer(validState, action);

      //ASSERT
      expect(result.ticketClass).toBe(TicketClass.FIRST);
      expect(result.seatNumber).toBe("");
      expect(result.flightNumber).toBe("SKYOPS-105");
      expect(result.passportNumber).toBe("TN123456");
      expect(result.disabled).toBe(true);
    });

    it("should keep flight, class and seat and keep the button enabled when the passenger changes", () => {
      //ARRANGE
      const action = {
        type: TicketFormActionType.SET_FIELD,
        field: "passportNumber",
        value: "FR987654",
      } as const;

      //ACT
      const result = ticketReducer(validState, action);

      //ASSERT
      expect(result.passportNumber).toBe("FR987654");
      expect(result.flightNumber).toBe("SKYOPS-105");
      expect(result.ticketClass).toBe(TicketClass.BUSINESS);
      expect(result.seatNumber).toBe("A2");
      expect(result.disabled).toBe(false);
    });

    it("should disable the button again when the seat is cleared", () => {
      //ARRANGE
      const action = {
        type: TicketFormActionType.SET_FIELD,
        field: "seatNumber",
        value: "",
      } as const;

      //ACT
      const result = ticketReducer(validState, action);

      //ASSERT
      expect(result.seatNumber).toBe("");
      expect(result.disabled).toBe(true);
    });
  });

  describe("RESET", () => {
    it("should return the initial state even from a full form", () => {
      //ARRANGE
      const action = { type: TicketFormActionType.RESET } as const;

      //ACT
      const result = ticketReducer(validState, action);

      //ASSERT
      expect(result).toEqual(initialState);
    });
  });
});

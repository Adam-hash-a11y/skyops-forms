import { describe, expect, it } from "vitest";
import {
  flightFilterReducer,
  initialState,
} from "../../src/components/flighList/reducer";
import { FlightFilterActionType } from "../../src/components/flighList/action";
import { FlightStatus } from "../../src/types/flightTypes";

const filledState = {
  origin: "TUN",
  destination: "FRA",
  sortBy: "departureTime",
  status: FlightStatus.DELAYED,
};

describe("flightFilterReducer", () => {
  describe("set filter", () => {
    it("should store the origin and keep the other filters", () => {
      //ARRANGE
      const state = { ...filledState, origin: "" };
      const action = {
        type: FlightFilterActionType.SET_FILTER,
        payload: { name: "origin", value: "TUN" },
      } as const;

      //ACT
      const result = flightFilterReducer(state, action);

      //ASSERT
      expect(result).toEqual(filledState);
    });
  });

  describe("reset", () => {
    it("should return the initial state after several filters were set", () => {
      //ARRANGE
      const action = {
        type: FlightFilterActionType.RESET_FILTERS,
      } as const;

      //ACT
      const result = flightFilterReducer(filledState, action);

      //ASSERT
      expect(result).toEqual(initialState);
    });
  });
});

// test/passengerList/reducer.test.ts
import { describe, expect, it } from "vitest";
import {
  initialState,
  passengerFilterReducer,
} from "../../src/components/passengerList/reducer";
import { PassengerFilterActionType } from "../../src/components/passengerList/action";

const filledState = {
  firstName: "Lena",
  lastName: "Banks",
  nationality: "DE",
  sortBy: "lastName",
};

describe("passengerFilterReducer", () => {
  describe("set filter", () => {
    it("should store the nationality and keep the other filters", () => {
      //ARRANGE
      const state = { ...filledState, nationality: "" };
      const action = {
        type: PassengerFilterActionType.SET_PASSENGER_FILTER,
        payload: { name: "nationality", value: "DE" },
      } as const;

      //ACT
      const result = passengerFilterReducer(state, action);

      //ASSERT
      expect(result).toEqual(filledState);
    });
  });

  describe("reset", () => {
    it("should return the initial state after several filters were set", () => {
      //ARRANGE
      const action = {
        type: PassengerFilterActionType.RESET_PASSENGER_FILTERS,
      } as const;

      //ACT
      const result = passengerFilterReducer(filledState, action);

      //ASSERT
      expect(result).toEqual(initialState);
    });
  });
});

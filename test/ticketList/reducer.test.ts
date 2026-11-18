import { describe, expect, it } from "vitest";
import {
  initialState,
  ticketFilterReducer,
} from "../../src/components/ticketList/reducer";
import { TicketFilterActionType } from "../../src/components/ticketList/action";
import { TicketFilterBy } from "../../src/types/ticketTypes";

const filledState = {
  filterBy: TicketFilterBy.FLIGHT,
  filterValue: "f1",
};

describe("ticketFilterReducer", () => {
  describe("set filter", () => {
    it("should store the chosen Filter by value", () => {
      //ARRANGE
      const action = {
        type: TicketFilterActionType.SET_TICKET_FILTER,
        payload: { name: "filterBy", value: "flight" },
      } as const;

      //ACT
      const result = ticketFilterReducer(initialState, action);

      //ASSERT
      expect(result).toEqual({
        filterBy: TicketFilterBy.FLIGHT,
        filterValue: "",
      });
    });

    it("should clear the selected value when Filter by changes", () => {
      //ARRANGE
      const action = {
        type: TicketFilterActionType.SET_TICKET_FILTER,
        payload: { name: "filterBy", value: "passenger" },
      } as const;

      //ACT
      const result = ticketFilterReducer(filledState, action);

      //ASSERT
      expect(result).toEqual({
        filterBy: TicketFilterBy.PASSENGER,
        filterValue: "",
      });
    });
  });

  describe("reset", () => {
    it("should return the initial state", () => {
      //ARRANGE
      const action = {
        type: TicketFilterActionType.RESET_TICKET_FILTERS,
      } as const;

      //ACT
      const result = ticketFilterReducer(filledState, action);

      //ASSERT
      expect(result).toEqual(initialState);
    });
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import { StatusBadge } from "../../src/components/shared/statusBadge/StatusBadge";
import { FlightStatus } from "../../src/types/flightTypes";
import { TicketStatus } from "../../src/types/ticketTypes";

describe("StatusBadge", () => {
  describe("rendering", () => {
    it("should show Scheduled for a scheduled flight", () => {
      //ARRANGE
      render(<StatusBadge status={FlightStatus.SCHEDULED} />);

      //ACT
      const text = screen.getByTestId("status-badge-text");

      //ASSERT
      expect(text).toHaveTextContent("Scheduled");
    });

    it("should show Delayed for a delayed flight", () => {
      //ARRANGE
      render(<StatusBadge status={FlightStatus.DELAYED} />);

      //ACT
      const text = screen.getByTestId("status-badge-text");

      //ASSERT
      expect(text).toHaveTextContent("Delayed");
    });

    it("should show Cancelled for a cancelled flight", () => {
      //ARRANGE
      render(<StatusBadge status={FlightStatus.CANCELLED} />);

      //ACT
      const text = screen.getByTestId("status-badge-text");

      //ASSERT
      expect(text).toHaveTextContent("Cancelled");
    });

    it("should show Landed for a landed flight", () => {
      //ARRANGE
      render(<StatusBadge status={FlightStatus.LANDED} />);

      //ACT
      const text = screen.getByTestId("status-badge-text");

      //ASSERT
      expect(text).toHaveTextContent("Landed");
    });

    it("should show Confirmed for a confirmed ticket", () => {
      //ARRANGE
      render(<StatusBadge status={TicketStatus.CONFIRMED} />);

      //ACT
      const text = screen.getByTestId("status-badge-text");

      //ASSERT
      expect(text).toHaveTextContent("Confirmed");
    });
  });
});

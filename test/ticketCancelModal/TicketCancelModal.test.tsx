import { render, screen } from "@testing-library/react";
import { describe, expect, vi, it } from "vitest";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { TicketCancelModal } from "../../src/components/shared/ticketCancelModal/TicketCancelModal";

describe("TicketCancelModal", () => {
  describe("rendering", () => {
    it("should show the title, the seat, the flight and the warning", () => {
      //ARRANGE
      render(
        <TicketCancelModal
          seatNumber="A2"
          flightNumber="SKYOPS-105"
          handleClose={vi.fn()}
          handleCancel={vi.fn()}
        />,
      );

      //ACT
      const modal = screen.getByTestId("ticket-cancel-modal");

      //ASSERT
      expect(modal).toHaveTextContent("Cancel ticket");
      expect(modal).toHaveTextContent("Cancel seat A2 on SKYOPS-105?");
      expect(modal).toHaveTextContent(
        "The seat stays blocked after cancelling. No seat is released.",
      );
    });
  });

  describe("user interactions", () => {
    it("should call handleClose once when the user clicks Keep ticket", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleClose = vi.fn();
      const handleCancel = vi.fn();
      render(
        <TicketCancelModal
          seatNumber="A2"
          flightNumber="SKYOPS-105"
          handleClose={handleClose}
          handleCancel={handleCancel}
        />,
      );

      //ACT
      await user.click(screen.getAllByTestId("button")[0]);

      //ASSERT
      expect(handleClose).toHaveBeenCalledTimes(1);
      expect(handleCancel).not.toHaveBeenCalled();
    });

    it("should call handleClose once when the user clicks the close icon", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleClose = vi.fn();
      const handleCancel = vi.fn();
      render(
        <TicketCancelModal
          seatNumber="A2"
          flightNumber="SKYOPS-105"
          handleClose={handleClose}
          handleCancel={handleCancel}
        />,
      );

      //ACT
      await user.click(screen.getByTestId("icon-button"));

      //ASSERT
      expect(handleClose).toHaveBeenCalledTimes(1);
      expect(handleCancel).not.toHaveBeenCalled();
    });

    it("should call handleCancel once when the user clicks the red Cancel ticket button", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleClose = vi.fn();
      const handleCancel = vi.fn();
      render(
        <TicketCancelModal
          seatNumber="A2"
          flightNumber="SKYOPS-105"
          handleClose={handleClose}
          handleCancel={handleCancel}
        />,
      );

      //ACT
      await user.click(screen.getAllByTestId("button")[1]);

      //ASSERT
      expect(handleCancel).toHaveBeenCalledTimes(1);
      expect(handleClose).not.toHaveBeenCalled();
    });
  });
});

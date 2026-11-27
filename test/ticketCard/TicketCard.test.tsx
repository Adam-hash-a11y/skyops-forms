import { render, screen } from "@testing-library/react";
import { describe, expect, vi, it } from "vitest";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { TicketCard } from "../../src/components/shared/ticketCard/TicketCard";
import { TicketClass, TicketStatus } from "../../src/types/ticketTypes";

describe("TicketCard", () => {
  describe("rendering", () => {
    it("should show the passenger, the flight, the seat, the class, the price and the booking date", () => {
      //ARRANGE
      render(
        <TicketCard
          passengerName="Lena Fischer"
          flightNumber="SKYOPS-105"
          origin="TUN"
          destination="FRA"
          status={TicketStatus.CONFIRMED}
          seatNumber="A2"
          ticketClass={TicketClass.BUSINESS}
          price={150}
          createdAt="2026-03-05T14:30:00Z"
          cancelDisabled={false}
          isDeletedPassenger={false}
          isDeletedFlight={false}
          handleCancel={vi.fn()}
        />,
      );

      //ACT
      const card = screen.getByTestId("ticket-card");

      //ASSERT
      expect(card).toHaveTextContent("Lena Fischer");
      expect(card).toHaveTextContent("SKYOPS-105");
      expect(card).toHaveTextContent("TUN → FRA");
      expect(card).toHaveTextContent("A2");
      expect(card).toHaveTextContent("Business");
      expect(card).toHaveTextContent("€150.00");
      expect(card).toHaveTextContent("Booked 05 Mar 2026, 14:30 UTC");
    });

    it("should show the status of the ticket in the badge", () => {
      //ARRANGE
      render(
        <TicketCard
          passengerName="Lena Fischer"
          flightNumber="SKYOPS-105"
          origin="TUN"
          destination="FRA"
          status={TicketStatus.CONFIRMED}
          seatNumber="A2"
          ticketClass={TicketClass.ECONOMY}
          price={80}
          createdAt="2026-03-05T14:30:00Z"
          cancelDisabled={false}
          isDeletedPassenger={false}
          isDeletedFlight={false}
          handleCancel={vi.fn()}
        />,
      );

      //ACT
      const badge = screen.getByTestId("status-badge-text");

      //ASSERT
      expect(badge).toHaveTextContent("Confirmed");
    });

    it("should label the button Cancel ticket", () => {
      //ARRANGE
      render(
        <TicketCard
          passengerName="Lena Fischer"
          flightNumber="SKYOPS-105"
          origin="TUN"
          destination="FRA"
          status={TicketStatus.CONFIRMED}
          seatNumber="A2"
          ticketClass={TicketClass.ECONOMY}
          price={80}
          createdAt="2026-03-05T14:30:00Z"
          cancelDisabled={false}
          isDeletedPassenger={false}
          isDeletedFlight={false}
          handleCancel={vi.fn()}
        />,
      );

      //ACT
      const button = screen.getByTestId("button");

      //ASSERT
      expect(button).toHaveTextContent("Cancel ticket");
    });
  });

  describe("user interactions", () => {
    it("should call handleCancel once when the user clicks Cancel ticket", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleCancel = vi.fn();
      render(
        <TicketCard
          passengerName="Lena Fischer"
          flightNumber="SKYOPS-105"
          origin="TUN"
          destination="FRA"
          status={TicketStatus.CONFIRMED}
          seatNumber="A2"
          ticketClass={TicketClass.ECONOMY}
          price={80}
          createdAt="2026-03-05T14:30:00Z"
          cancelDisabled={false}
          isDeletedPassenger={false}
          isDeletedFlight={false}
          handleCancel={handleCancel}
        />,
      );

      //ACT
      await user.click(screen.getByTestId("button"));

      //ASSERT
      expect(handleCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe("disabled", () => {
    it("should not let the user cancel when cancelDisabled is true", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleCancel = vi.fn();
      render(
        <TicketCard
          passengerName="Lena Fischer"
          flightNumber="SKYOPS-105"
          origin="TUN"
          destination="FRA"
          status={TicketStatus.CANCELLED}
          seatNumber="A2"
          ticketClass={TicketClass.ECONOMY}
          price={80}
          createdAt="2026-03-05T14:30:00Z"
          cancelDisabled={true}
          isDeletedPassenger={false}
          isDeletedFlight={false}
          handleCancel={handleCancel}
        />,
      );
      const button = screen.getByTestId("button");

      //ACT
      await user.click(button);

      //ASSERT
      expect(button).toBeDisabled();
      expect(handleCancel).not.toHaveBeenCalled();
    });
  });
});

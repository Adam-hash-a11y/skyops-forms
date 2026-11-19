import { render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom/vitest";
import { toast } from "react-toastify";
import { FlightDetailsPage } from "../../src/components/flightDetailsPage/FlightDetailsPage";
import { getFlight } from "../../src/service/flightService";
import {
  cancelTicket,
  getTicketsByFlight,
} from "../../src/service/ticketService";
import { FlightStatus } from "../../src/types/flightTypes";
import { TicketClass, TicketStatus } from "../../src/types/ticketTypes";

vi.mock("../../src/service/flightService");
vi.mock("../../src/service/ticketService");
vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const flight = {
  id: "f1",
  flightNumber: "SKYOPS-105",
  airline: "SkyOps Air",
  origin: "TUN",
  destination: "FRA",
  departureTime: "2026-06-01T08:00:00Z",
  arrivalTime: "2026-06-01T10:00:00Z",
  status: FlightStatus.SCHEDULED,
  totalSeats: 150,
  bookedSeats: 10,
};

const tickets = [
  {
    id: "t1",
    flightNumber: "SKYOPS-105",
    passportNumber: "DE7731902",
    passengerName: "Lena Banks",
    origin: "TUN",
    destination: "FRA",
    seatNumber: "A2",
    ticketClass: TicketClass.BUSINESS,
    price: 300,
    status: TicketStatus.CONFIRMED,
    createdAt: "2026-03-05T14:30:00Z",
  },
  {
    id: "t2",
    flightNumber: "SKYOPS-105",
    passportNumber: "FR4410298",
    passengerName: "Jonas Fischer",
    origin: "TUN",
    destination: "FRA",
    seatNumber: "E5",
    ticketClass: TicketClass.ECONOMY,
    price: 120,
    status: TicketStatus.CANCELLED,
    createdAt: "2026-03-06T09:00:00Z",
  },
  {
    id: "t3",
    flightNumber: "SKYOPS-105",
    passportNumber: "",
    passengerName: "",
    origin: "TUN",
    destination: "FRA",
    seatNumber: "E9",
    ticketClass: TicketClass.ECONOMY,
    price: 120,
    status: TicketStatus.CONFIRMED,
    createdAt: "2026-03-08T11:00:00Z",
  },
];

const flightPage = (
  <MemoryRouter initialEntries={["/flights/SKYOPS-105"]}>
    <Routes>
      <Route path="/flights/:flightNumber" element={<FlightDetailsPage />} />
    </Routes>
  </MemoryRouter>
);

describe("FlightDetailsPage", () => {
  beforeEach(() => {
    vi.mocked(getFlight).mockResolvedValue(flight);
    vi.mocked(getTicketsByFlight).mockResolvedValue(tickets);
    vi.mocked(cancelTicket).mockResolvedValue(undefined);
  });

  describe("loading and details", () => {
    it("should show Loading first and then the flight, its route and the 3 tickets", async () => {
      //ARRANGE
      render(flightPage);

      //ASSERT
      expect(screen.getByTestId("flight-details-loading")).toHaveTextContent(
        "Loading...",
      );

      //ACT
      const cards = await screen.findAllByTestId("ticket-card");

      //ASSERT
      expect(cards).toHaveLength(3);
      expect(
        screen.queryByTestId("flight-details-loading"),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId("flight-details-title")).toHaveTextContent(
        "SKYOPS-105",
      );
      expect(screen.getByTestId("flight-details-subtitle")).toHaveTextContent(
        "SkyOps Air · TUN → FRA",
      );
      expect(
        screen.getByTestId("flight-details-tickets-heading"),
      ).toHaveTextContent("Tickets on this flight (3)");
      expect(getFlight).toHaveBeenCalledWith("SKYOPS-105");
      expect(getTicketsByFlight).toHaveBeenCalledWith("f1");
    });

    it("should link back to the list of all flights", async () => {
      //ARRANGE
      render(flightPage);

      //ACT
      const link = await screen.findByTestId("flight-details-back-link");

      //ASSERT
      expect(link).toHaveTextContent("← All flights");
      expect(link).toHaveAttribute("href", "/flights");
    });

    it("should show the passenger, the flight, the seat, the class, the price and the status on a ticket card", async () => {
      //ARRANGE
      render(flightPage);

      //ACT
      const cards = await screen.findAllByTestId("ticket-card");

      //ASSERT
      expect(cards[0]).toHaveTextContent("Lena Banks");
      expect(cards[0]).toHaveTextContent("SKYOPS-105");
      expect(cards[0]).toHaveTextContent("TUN → FRA");
      expect(cards[0]).toHaveTextContent("A2");
      expect(cards[0]).toHaveTextContent("Business");
      expect(cards[0]).toHaveTextContent("€300.00");
      expect(cards[0]).toHaveTextContent("Confirmed");
    });

    it("should show Deleted passenger on a ticket whose passenger no longer exists", async () => {
      //ARRANGE
      render(flightPage);

      //ACT
      const cards = await screen.findAllByTestId("ticket-card");

      //ASSERT
      expect(cards[2]).toHaveTextContent("Deleted passenger");
    });

    it("should show the empty state and a count of 0 when the flight has no tickets", async () => {
      //ARRANGE
      vi.mocked(getTicketsByFlight).mockResolvedValue([]);
      render(flightPage);

      //ACT
      const empty = await screen.findByTestId("flight-details-empty");

      //ASSERT
      expect(empty).toHaveTextContent("No tickets yet");
      expect(empty).toHaveTextContent("Book the first ticket for this flight.");
      expect(
        screen.getByTestId("flight-details-tickets-heading"),
      ).toHaveTextContent("Tickets on this flight (0)");
      expect(screen.queryAllByTestId("ticket-card")).toHaveLength(0);
    });
  });

  describe("failures", () => {
    it("should show the 404 page and an error toast when the flight does not exist", async () => {
      //ARRANGE
      vi.mocked(getFlight).mockRejectedValue(new Error("Flight not found"));
      render(flightPage);

      //ASSERT
      expect(screen.getByTestId("flight-details-loading")).toBeInTheDocument();
      expect(screen.queryByTestId("not-found-title")).not.toBeInTheDocument();

      //ACT
      const title = await screen.findByTestId("not-found-title");

      //ASSERT
      expect(title).toHaveTextContent("404 - Page Not Found");
      expect(toast.error).toHaveBeenCalledWith("Flight not found");
      expect(
        screen.queryByTestId("flight-details-loading"),
      ).not.toBeInTheDocument();
      expect(getTicketsByFlight).not.toHaveBeenCalled();
    });

    it("should keep the flight and show the backend message when the tickets cannot be loaded", async () => {
      //ARRANGE
      vi.mocked(getTicketsByFlight).mockRejectedValue(
        new Error("Server not reachable"),
      );
      render(flightPage);

      //ACT
      const empty = await screen.findByTestId("flight-details-empty");

      //ASSERT
      expect(empty).toHaveTextContent("No tickets yet");
      expect(screen.getByTestId("flight-details-title")).toHaveTextContent(
        "SKYOPS-105",
      );
      expect(toast.error).toHaveBeenCalledWith("Server not reachable");
      expect(screen.queryByTestId("not-found-title")).not.toBeInTheDocument();
    });
  });

  describe("cancelling a ticket", () => {
    it("should enable Cancel ticket on a confirmed ticket and disable it on a cancelled ticket", async () => {
      //ARRANGE
      render(flightPage);

      //ACT
      const cards = await screen.findAllByTestId("ticket-card");

      //ASSERT
      expect(within(cards[0]).getByTestId("button")).toBeEnabled();
      expect(within(cards[1]).getByTestId("button")).toBeDisabled();
    });

    it("should ask to cancel the seat of the chosen ticket on this flight and show the warning", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(flightPage);
      const cards = await screen.findAllByTestId("ticket-card");

      //ACT
      await user.click(within(cards[0]).getByTestId("button"));

      //ASSERT
      const modal = screen.getByTestId("ticket-cancel-modal");
      expect(modal).toHaveTextContent("Cancel seat A2 on SKYOPS-105?");
      expect(modal).toHaveTextContent(
        "The seat stays blocked after cancelling. No seat is released.",
      );
    });

    it("should cancel the ticket, close the modal, show a success toast and show the ticket as cancelled", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(flightPage);
      const cards = await screen.findAllByTestId("ticket-card");
      vi.mocked(getTicketsByFlight).mockResolvedValue([
        { ...tickets[0], status: TicketStatus.CANCELLED },
        tickets[1],
        tickets[2],
      ]);
      await user.click(within(cards[0]).getByTestId("button"));
      const modal = screen.getByTestId("ticket-cancel-modal");

      //ACT
      await user.click(within(modal).getAllByTestId("button")[1]);

      //ASSERT
      await waitFor(() => {
        expect(
          screen.queryByTestId("ticket-cancel-modal"),
        ).not.toBeInTheDocument();
      });
      const cardsAfter = screen.getAllByTestId("ticket-card");
      expect(cancelTicket).toHaveBeenCalledTimes(1);
      expect(cancelTicket).toHaveBeenCalledWith("t1");
      expect(toast.success).toHaveBeenCalledWith("Ticket cancelled");
      expect(getTicketsByFlight).toHaveBeenCalledTimes(2);
      expect(cardsAfter[0]).toHaveTextContent("Cancelled");
      expect(within(cardsAfter[0]).getByTestId("button")).toBeDisabled();
    });

    it("should keep the modal open and show the backend message when cancelling fails", async () => {
      //ARRANGE
      const user = userEvent.setup();
      vi.mocked(cancelTicket).mockRejectedValue(new Error("Ticket not found"));
      render(flightPage);
      const cards = await screen.findAllByTestId("ticket-card");
      await user.click(within(cards[0]).getByTestId("button"));
      const modal = screen.getByTestId("ticket-cancel-modal");

      //ACT
      await user.click(within(modal).getAllByTestId("button")[1]);

      //ASSERT
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Ticket not found");
      });
      expect(screen.getByTestId("ticket-cancel-modal")).toBeInTheDocument();
      expect(toast.success).not.toHaveBeenCalled();
      expect(getTicketsByFlight).toHaveBeenCalledTimes(1);
    });

    it("should close the modal without cancelling when the user clicks Keep ticket", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(flightPage);
      const cards = await screen.findAllByTestId("ticket-card");
      await user.click(within(cards[0]).getByTestId("button"));
      const modal = screen.getByTestId("ticket-cancel-modal");

      //ACT
      await user.click(within(modal).getAllByTestId("button")[0]);

      //ASSERT
      expect(
        screen.queryByTestId("ticket-cancel-modal"),
      ).not.toBeInTheDocument();
      expect(cancelTicket).not.toHaveBeenCalled();
      expect(toast.success).not.toHaveBeenCalled();
    });
  });
});

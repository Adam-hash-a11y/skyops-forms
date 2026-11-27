import { render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom/vitest";
import { toast } from "react-toastify";
import { PassengerDetailsPage } from "../../src/components/passengerDetailsPage/PassengerDetailsPage";
import { getPassenger } from "../../src/service/passengerService";
import {
  cancelTicket,
  getTicketsByPassenger,
} from "../../src/service/ticketService";
import { TicketClass, TicketStatus } from "../../src/types/ticketTypes";

vi.mock("../../src/service/passengerService");
vi.mock("../../src/service/ticketService");
vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const passenger = {
  id: "p1",
  firstName: "Lena",
  lastName: "Banks",
  passportNumber: "DE7731902",
  nationality: "DE",
  dateOfBirth: "1992-11-02",
  email: "name@example.com",
  phoneNumber: "+4915194300275",
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
    flightNumber: "SKYOPS-200",
    passportNumber: "DE7731902",
    passengerName: "Lena Banks",
    origin: "FRA",
    destination: "TUN",
    seatNumber: "E5",
    ticketClass: TicketClass.ECONOMY,
    price: 120,
    status: TicketStatus.CANCELLED,
    createdAt: "2026-03-06T09:00:00Z",
  },
  {
    id: "t3",
    flightNumber: "",
    passportNumber: "DE7731902",
    passengerName: "Lena Banks",
    origin: "-",
    destination: "-",
    seatNumber: "E7",
    ticketClass: TicketClass.ECONOMY,
    price: 120,
    status: TicketStatus.CONFIRMED,
    createdAt: "2026-03-07T10:00:00Z",
  },
];

const passengerPage = (
  <MemoryRouter initialEntries={["/passengers/DE7731902"]}>
    <Routes>
      <Route
        path="/passengers/:passportNumber"
        element={<PassengerDetailsPage />}
      />
    </Routes>
  </MemoryRouter>
);

describe("PassengerDetailsPage", () => {
  beforeEach(() => {
    vi.mocked(getPassenger).mockResolvedValue(passenger);
    vi.mocked(getTicketsByPassenger).mockResolvedValue(tickets);
    vi.mocked(cancelTicket).mockResolvedValue(undefined);
  });

  describe("loading and details", () => {
    it("should show Loading first and then the passenger, the passport with nationality and the 3 tickets", async () => {
      //ARRANGE
      render(passengerPage);

      //ASSERT
      expect(screen.getByTestId("passenger-details-loading")).toHaveTextContent(
        "Loading...",
      );

      //ACT
      const cards = await screen.findAllByTestId("ticket-card");

      //ASSERT
      expect(cards).toHaveLength(3);
      expect(
        screen.queryByTestId("passenger-details-loading"),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId("passenger-details-title")).toHaveTextContent(
        "Lena Banks",
      );
      expect(
        screen.getByTestId("passenger-details-subtitle"),
      ).toHaveTextContent("DE7731902 · DE");
      expect(
        screen.getByTestId("passenger-details-tickets-heading"),
      ).toHaveTextContent("Tickets of this passenger (3)");
      expect(getPassenger).toHaveBeenCalledWith("DE7731902");
      expect(getTicketsByPassenger).toHaveBeenCalledWith("p1");
    });

    it("should link back to the list of all passengers", async () => {
      //ARRANGE
      render(passengerPage);

      //ACT
      const link = await screen.findByTestId("passenger-details-back-link");

      //ASSERT
      expect(link).toHaveTextContent("← All passengers");
      expect(link).toHaveAttribute("href", "/passengers");
    });

    it("should show the passenger, the flight, the seat, the class, the price and the status on a ticket card", async () => {
      //ARRANGE
      render(passengerPage);

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

    it("should show Deleted flight on a ticket whose flight no longer exists", async () => {
      //ARRANGE
      render(passengerPage);

      //ACT
      const cards = await screen.findAllByTestId("ticket-card");

      //ASSERT
      expect(cards[2]).toHaveTextContent("Deleted flight");
      expect(cards[2]).toHaveTextContent("Lena Banks");
    });

    it("should show the empty state and a count of 0 when the passenger has no tickets", async () => {
      //ARRANGE
      vi.mocked(getTicketsByPassenger).mockResolvedValue([]);
      render(passengerPage);

      //ACT
      const empty = await screen.findByTestId("passenger-details-empty");

      //ASSERT
      expect(empty).toHaveTextContent("No tickets yet");
      expect(empty).toHaveTextContent("This passenger has no tickets.");
      expect(
        screen.getByTestId("passenger-details-tickets-heading"),
      ).toHaveTextContent("Tickets of this passenger (0)");
      expect(screen.queryAllByTestId("ticket-card")).toHaveLength(0);
    });
  });

  describe("failures", () => {
    it("should show the 404 page and an error toast when the passenger does not exist", async () => {
      //ARRANGE
      vi.mocked(getPassenger).mockRejectedValue(
        new Error("Passenger not found"),
      );
      render(passengerPage);

      //ASSERT
      expect(
        screen.getByTestId("passenger-details-loading"),
      ).toBeInTheDocument();
      expect(screen.queryByTestId("not-found-title")).not.toBeInTheDocument();

      //ACT
      const title = await screen.findByTestId("not-found-title");

      //ASSERT
      expect(title).toHaveTextContent("404 - Page Not Found");
      expect(toast.error).toHaveBeenCalledWith("Passenger not found");
      expect(
        screen.queryByTestId("passenger-details-loading"),
      ).not.toBeInTheDocument();
      expect(getTicketsByPassenger).not.toHaveBeenCalled();
    });

    it("should keep the passenger and show the backend message when the tickets cannot be loaded", async () => {
      //ARRANGE
      vi.mocked(getTicketsByPassenger).mockRejectedValue(
        new Error("Server not reachable"),
      );
      render(passengerPage);

      //ACT
      const empty = await screen.findByTestId("passenger-details-empty");

      //ASSERT
      expect(empty).toHaveTextContent("No tickets yet");
      expect(screen.getByTestId("passenger-details-title")).toHaveTextContent(
        "Lena Banks",
      );
      expect(toast.error).toHaveBeenCalledWith("Server not reachable");
      expect(screen.queryByTestId("not-found-title")).not.toBeInTheDocument();
    });
  });

  describe("cancelling a ticket", () => {
    it("should enable Cancel ticket on a confirmed ticket and disable it on a cancelled ticket", async () => {
      //ARRANGE
      render(passengerPage);

      //ACT
      const cards = await screen.findAllByTestId("ticket-card");

      //ASSERT
      expect(within(cards[0]).getByTestId("button")).toBeEnabled();
      expect(within(cards[1]).getByTestId("button")).toBeDisabled();
    });

    it("should ask to cancel the seat of the chosen ticket and show the warning", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(passengerPage);
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

    it("should say deleted flight in the question when the flight of the ticket no longer exists", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(passengerPage);
      const cards = await screen.findAllByTestId("ticket-card");

      //ACT
      await user.click(within(cards[2]).getByTestId("button"));

      //ASSERT
      expect(screen.getByTestId("ticket-cancel-modal")).toHaveTextContent(
        "Cancel seat E7 on deleted flight?",
      );
    });

    it("should cancel the ticket, close the modal, show a success toast and show the ticket as cancelled", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(passengerPage);
      const cards = await screen.findAllByTestId("ticket-card");
      vi.mocked(getTicketsByPassenger).mockResolvedValue([
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
      expect(getTicketsByPassenger).toHaveBeenCalledTimes(2);
      expect(cardsAfter[0]).toHaveTextContent("Cancelled");
      expect(within(cardsAfter[0]).getByTestId("button")).toBeDisabled();
    });

    it("should keep the modal open and show the backend message when cancelling fails", async () => {
      //ARRANGE
      const user = userEvent.setup();
      vi.mocked(cancelTicket).mockRejectedValue(new Error("Ticket not found"));
      render(passengerPage);
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
      expect(getTicketsByPassenger).toHaveBeenCalledTimes(1);
    });

    it("should close the modal without cancelling when the user clicks Keep ticket", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(passengerPage);
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

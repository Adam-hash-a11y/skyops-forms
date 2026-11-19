import { render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { toast } from "react-toastify";
import { TicketList } from "../../src/components/ticketList/TicketList";
import {
  cancelTicket,
  createTicket,
  getTickets,
  getTicketsByFlight,
  getTicketsByPassenger,
} from "../../src/service/ticketService";
import { getFlights, getFreeSeats } from "../../src/service/flightService";
import { getPassengers } from "../../src/service/passengerService";
import { FlightStatus } from "../../src/types/flightTypes";
import { TicketClass, TicketStatus } from "../../src/types/ticketTypes";

vi.mock("../../src/service/ticketService");
vi.mock("../../src/service/flightService");
vi.mock("../../src/service/passengerService");
vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

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
    passportNumber: "FR4410298",
    passengerName: "Jonas Fischer",
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
  {
    id: "t4",
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

const newTicket = {
  id: "t5",
  flightNumber: "SKYOPS-105",
  passportNumber: "DE7731902",
  passengerName: "Lena Banks",
  origin: "TUN",
  destination: "FRA",
  seatNumber: "E1",
  ticketClass: TicketClass.ECONOMY,
  price: 120,
  status: TicketStatus.CONFIRMED,
  createdAt: "2026-03-09T12:00:00Z",
};

const flights = [
  {
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
  },
  {
    id: "f2",
    flightNumber: "SKYOPS-200",
    airline: "Skyways",
    origin: "FRA",
    destination: "TUN",
    departureTime: "2026-06-02T09:30:00Z",
    arrivalTime: "2026-06-02T12:30:00Z",
    status: FlightStatus.DELAYED,
    totalSeats: 100,
    bookedSeats: 5,
  },
];

const passengers = [
  {
    id: "p1",
    firstName: "Lena",
    lastName: "Banks",
    passportNumber: "DE7731902",
    nationality: "DE",
    dateOfBirth: "1992-11-02",
    email: "name@example.com",
    phoneNumber: "+4915194300275",
  },
  {
    id: "p2",
    firstName: "Jonas",
    lastName: "Fischer",
    passportNumber: "FR4410298",
    nationality: "FR",
    dateOfBirth: "1988-05-14",
    email: "jonas@example.com",
    phoneNumber: "+33612345678",
  },
];

const freeSeats = {
  seats: [
    { seat: "B1", class: "business" },
    { seat: "E1", class: "economy" },
    { seat: "E2", class: "economy" },
    { seat: "E3", class: "economy" },
  ],
  counts: { first: 0, business: 1, economy: 3 },
  prices: { first: 500, business: 300, economy: 120 },
};

const flightLabel = "SKYOPS-105 · TUN → FRA · 01 Jun 2026, 08:00 UTC";
const passengerLabel = "Banks, Lena · DE7731902";

describe("TicketList", () => {
  beforeEach(() => {
    vi.mocked(getTickets).mockResolvedValue(tickets);
    vi.mocked(getTicketsByFlight).mockResolvedValue([]);
    vi.mocked(getTicketsByPassenger).mockResolvedValue([]);
    vi.mocked(createTicket).mockResolvedValue(undefined);
    vi.mocked(cancelTicket).mockResolvedValue(undefined);
    vi.mocked(getFlights).mockResolvedValue(flights);
    vi.mocked(getPassengers).mockResolvedValue(passengers);
    vi.mocked(getFreeSeats).mockResolvedValue(freeSeats);
  });

  describe("loading and list", () => {
    it("should show Loading first and then the 4 ticket cards with the ticket count", async () => {
      //ARRANGE
      render(<TicketList />);

      //ASSERT
      expect(screen.getByTestId("tickets-loading")).toHaveTextContent(
        "Loading...",
      );

      //ACT
      const cards = await screen.findAllByTestId("ticket-card");

      //ASSERT
      expect(cards).toHaveLength(4);
      expect(screen.queryByTestId("tickets-loading")).not.toBeInTheDocument();
      expect(screen.getByTestId("tickets-subtitle")).toHaveTextContent(
        "4 tickets",
      );
    });

    it("should show No tickets found when the backend returns no tickets", async () => {
      //ARRANGE
      vi.mocked(getTickets).mockResolvedValue([]);
      render(<TicketList />);

      //ACT
      const empty = await screen.findByTestId("tickets-empty");

      //ASSERT
      expect(empty).toHaveTextContent("No tickets found");
      expect(screen.queryByTestId("tickets-loading")).not.toBeInTheDocument();
      expect(screen.queryAllByTestId("ticket-card")).toHaveLength(0);
    });

    it("should show an error toast with the backend message and stop loading when the tickets cannot be loaded", async () => {
      //ARRANGE
      vi.mocked(getTickets).mockRejectedValue(
        new Error("Server not reachable"),
      );
      render(<TicketList />);

      //ACT
      await screen.findByTestId("tickets-empty");

      //ASSERT
      expect(toast.error).toHaveBeenCalledWith("Server not reachable");
      expect(screen.queryByTestId("tickets-loading")).not.toBeInTheDocument();
    });

    it("should show the passenger, the flight, the seat, the class, the price, the status and the booking date on a card", async () => {
      //ARRANGE
      render(<TicketList />);

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
      expect(cards[0]).toHaveTextContent("Booked 05 Mar 2026, 14:30 UTC");
    });

    it("should show Deleted flight and Deleted passenger on cards whose flight or passenger no longer exists", async () => {
      //ARRANGE
      render(<TicketList />);

      //ACT
      const cards = await screen.findAllByTestId("ticket-card");

      //ASSERT
      expect(cards[2]).toHaveTextContent("Deleted flight");
      expect(cards[2]).toHaveTextContent("Lena Banks");
      expect(cards[3]).toHaveTextContent("Deleted passenger");
      expect(cards[3]).toHaveTextContent("SKYOPS-105");
    });
  });

  describe("cancelling a ticket", () => {
    it("should enable Cancel ticket on a confirmed ticket and disable it on a cancelled ticket", async () => {
      //ARRANGE
      render(<TicketList />);

      //ACT
      const cards = await screen.findAllByTestId("ticket-card");

      //ASSERT
      expect(within(cards[0]).getByTestId("button")).toBeEnabled();
      expect(within(cards[1]).getByTestId("button")).toBeDisabled();
    });

    it("should ask to cancel the seat of the chosen ticket and show the warning", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<TicketList />);
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
      render(<TicketList />);
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
      render(<TicketList />);
      const cards = await screen.findAllByTestId("ticket-card");
      vi.mocked(getTickets).mockResolvedValue([
        { ...tickets[0], status: TicketStatus.CANCELLED },
        tickets[1],
        tickets[2],
        tickets[3],
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
      expect(getTickets).toHaveBeenCalledTimes(2);
      expect(cardsAfter[0]).toHaveTextContent("Cancelled");
      expect(within(cardsAfter[0]).getByTestId("button")).toBeDisabled();
    });

    it("should keep the modal open and show the backend message when cancelling fails", async () => {
      //ARRANGE
      const user = userEvent.setup();
      vi.mocked(cancelTicket).mockRejectedValue(new Error("Ticket not found"));
      render(<TicketList />);
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
      expect(getTickets).toHaveBeenCalledTimes(1);
    });

    it("should close the modal without cancelling when the user clicks Keep ticket", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<TicketList />);
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

  describe("booking a ticket", () => {
    it("should open the ticket form with nothing chosen when the user clicks Book ticket", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<TicketList />);
      await screen.findAllByTestId("ticket-card");

      //ACT
      await user.click(screen.getAllByTestId("button")[0]);

      //ASSERT
      const modal = screen.getByTestId("ticket-form-modal");
      await within(modal).findByText(flightLabel);
      await within(modal).findByText(passengerLabel);
      const selects = within(modal).getAllByTestId("form-input-select");
      expect(selects[0]).toHaveValue("");
      expect(selects[1]).toHaveValue("");
      expect(within(modal).getAllByTestId("button")[1]).toBeDisabled();
    });

    it("should book the ticket, close the form, show a success toast and reload the tickets", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<TicketList />);
      await screen.findAllByTestId("ticket-card");
      vi.mocked(getTickets).mockResolvedValue([...tickets, newTicket]);
      await user.click(screen.getAllByTestId("button")[0]);
      const modal = screen.getByTestId("ticket-form-modal");
      await within(modal).findByText(flightLabel);
      await within(modal).findByText(passengerLabel);
      const selects = within(modal).getAllByTestId("form-input-select");
      await user.selectOptions(selects[0], "SKYOPS-105");
      await user.selectOptions(selects[1], "DE7731902");
      await within(modal).findByText("Economy (3 free)");
      await user.selectOptions(selects[2], "Economy");
      await user.selectOptions(selects[3], "E1");

      //ACT
      await user.click(within(modal).getAllByTestId("button")[1]);

      //ASSERT
      await waitFor(() => {
        expect(
          screen.queryByTestId("ticket-form-modal"),
        ).not.toBeInTheDocument();
      });
      expect(createTicket).toHaveBeenCalledTimes(1);
      expect(createTicket).toHaveBeenCalledWith("f1", "p1", "E1", "Economy");
      expect(toast.success).toHaveBeenCalledWith("Ticket booked");
      expect(screen.getAllByTestId("ticket-card")).toHaveLength(5);
      expect(screen.getByTestId("tickets-subtitle")).toHaveTextContent(
        "5 tickets",
      );
    });

    it("should keep the form open with the chosen values and show the backend message when booking fails", async () => {
      //ARRANGE
      const user = userEvent.setup();
      vi.mocked(createTicket).mockRejectedValue(
        new Error("Seat already booked"),
      );
      render(<TicketList />);
      await screen.findAllByTestId("ticket-card");
      await user.click(screen.getAllByTestId("button")[0]);
      const modal = screen.getByTestId("ticket-form-modal");
      await within(modal).findByText(flightLabel);
      await within(modal).findByText(passengerLabel);
      const selects = within(modal).getAllByTestId("form-input-select");
      await user.selectOptions(selects[0], "SKYOPS-105");
      await user.selectOptions(selects[1], "DE7731902");
      await within(modal).findByText("Economy (3 free)");
      await user.selectOptions(selects[2], "Economy");
      await user.selectOptions(selects[3], "E1");

      //ACT
      await user.click(within(modal).getAllByTestId("button")[1]);

      //ASSERT
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Seat already booked");
      });
      expect(screen.getByTestId("ticket-form-modal")).toBeInTheDocument();
      expect(selects[0]).toHaveValue("SKYOPS-105");
      expect(selects[3]).toHaveValue("E1");
      expect(toast.success).not.toHaveBeenCalled();
      expect(getTickets).toHaveBeenCalledTimes(1);
    });
  });

  describe("filters", () => {
    it("should show the second select with the flights only after the user chooses Flight in Filter by", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<TicketList />);
      await screen.findAllByTestId("ticket-card");

      //ASSERT
      expect(screen.getAllByTestId("form-input-select")).toHaveLength(1);

      //ACT
      await user.selectOptions(
        screen.getAllByTestId("form-input-select")[0],
        "flight",
      );

      //ASSERT
      const selects = screen.getAllByTestId("form-input-select");
      expect(selects).toHaveLength(2);
      expect(screen.getAllByTestId("form-input-label")[1]).toHaveTextContent(
        "Flight",
      );
      expect(
        await within(selects[1]).findByText("SKYOPS-105"),
      ).toBeInTheDocument();
      expect(within(selects[1]).getByText("SKYOPS-200")).toBeInTheDocument();
    });

    it("should search the tickets of the chosen flight and show only the result", async () => {
      //ARRANGE
      const user = userEvent.setup();
      vi.mocked(getTicketsByFlight).mockResolvedValue([tickets[0]]);
      render(<TicketList />);
      await screen.findAllByTestId("ticket-card");
      await user.selectOptions(
        screen.getAllByTestId("form-input-select")[0],
        "flight",
      );
      const flightSelect = screen.getAllByTestId("form-input-select")[1];
      await within(flightSelect).findByText("SKYOPS-105");
      await user.selectOptions(flightSelect, "f1");

      //ACT
      await user.click(screen.getAllByTestId("button")[1]);

      //ASSERT
      await waitFor(() => {
        expect(screen.getAllByTestId("ticket-card")).toHaveLength(1);
      });
      expect(getTicketsByFlight).toHaveBeenCalledTimes(1);
      expect(getTicketsByFlight).toHaveBeenCalledWith("f1");
      expect(getTicketsByPassenger).not.toHaveBeenCalled();
      expect(screen.getByTestId("ticket-card")).toHaveTextContent("A2");
    });

    it("should search the tickets of the chosen passenger and show only the result", async () => {
      //ARRANGE
      const user = userEvent.setup();
      vi.mocked(getTicketsByPassenger).mockResolvedValue([tickets[1]]);
      render(<TicketList />);
      await screen.findAllByTestId("ticket-card");
      await user.selectOptions(
        screen.getAllByTestId("form-input-select")[0],
        "passenger",
      );
      const passengerSelect = screen.getAllByTestId("form-input-select")[1];
      await within(passengerSelect).findByText("Fischer, Jonas");
      await user.selectOptions(passengerSelect, "p2");

      //ACT
      await user.click(screen.getAllByTestId("button")[1]);

      //ASSERT
      await waitFor(() => {
        expect(screen.getAllByTestId("ticket-card")).toHaveLength(1);
      });
      expect(getTicketsByPassenger).toHaveBeenCalledTimes(1);
      expect(getTicketsByPassenger).toHaveBeenCalledWith("p2");
      expect(getTicketsByFlight).not.toHaveBeenCalled();
      expect(screen.getByTestId("ticket-card")).toHaveTextContent("E5");
    });

    it("should show a select-first toast and keep the list when the user searches with nothing chosen", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<TicketList />);
      await screen.findAllByTestId("ticket-card");

      //ACT
      await user.click(screen.getAllByTestId("button")[1]);

      //ASSERT
      expect(toast.error).toHaveBeenCalledWith(
        "Select a flight or passenger first",
      );
      expect(getTicketsByFlight).not.toHaveBeenCalled();
      expect(getTicketsByPassenger).not.toHaveBeenCalled();
      expect(screen.getAllByTestId("ticket-card")).toHaveLength(4);
    });

    it("should show a select-first toast when Flight is chosen but no flight is selected", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<TicketList />);
      await screen.findAllByTestId("ticket-card");
      await user.selectOptions(
        screen.getAllByTestId("form-input-select")[0],
        "flight",
      );

      //ACT
      await user.click(screen.getAllByTestId("button")[1]);

      //ASSERT
      expect(toast.error).toHaveBeenCalledWith(
        "Select a flight or passenger first",
      );
      expect(getTicketsByFlight).not.toHaveBeenCalled();
      expect(screen.getAllByTestId("ticket-card")).toHaveLength(4);
    });

    it("should clear the filters and bring back all tickets when the user clicks Reset filters", async () => {
      //ARRANGE
      const user = userEvent.setup();
      vi.mocked(getTicketsByFlight).mockResolvedValue([tickets[0]]);
      render(<TicketList />);
      await screen.findAllByTestId("ticket-card");
      await user.selectOptions(
        screen.getAllByTestId("form-input-select")[0],
        "flight",
      );
      const flightSelect = screen.getAllByTestId("form-input-select")[1];
      await within(flightSelect).findByText("SKYOPS-105");
      await user.selectOptions(flightSelect, "f1");
      await user.click(screen.getAllByTestId("button")[1]);
      await waitFor(() => {
        expect(screen.getAllByTestId("ticket-card")).toHaveLength(1);
      });

      //ACT
      await user.click(screen.getAllByTestId("button")[2]);

      //ASSERT
      await waitFor(() => {
        expect(screen.getAllByTestId("ticket-card")).toHaveLength(4);
      });
      expect(screen.getAllByTestId("form-input-select")).toHaveLength(1);
      expect(screen.getAllByTestId("form-input-select")[0]).toHaveValue("");
      expect(getTickets).toHaveBeenCalledTimes(2);
    });
  });
});

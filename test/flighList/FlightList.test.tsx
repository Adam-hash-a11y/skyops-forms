import { render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";
import { toast } from "react-toastify";
import { FlightsList } from "../../src/components/flighList/FlightList";
import {
  createFlight,
  deleteFlight,
  getFlights,
  getFreeSeats,
  searchFlights,
  updateFlight,
} from "../../src/service/flightService";
import {
  createTicket,
  getTicketsByFlight,
} from "../../src/service/ticketService";
import { getPassengers } from "../../src/service/passengerService";
import { FlightStatus } from "../../src/types/flightTypes";

vi.mock("../../src/service/flightService");
vi.mock("../../src/service/ticketService");
vi.mock("../../src/service/passengerService");
vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

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
    status: FlightStatus.SCHEDULED,
    totalSeats: 100,
    bookedSeats: 100,
  },
  {
    id: "f3",
    flightNumber: "SKYOPS-300",
    airline: "Cloud Jet",
    origin: "TUN",
    destination: "MUC",
    departureTime: "2026-06-03T10:00:00Z",
    arrivalTime: "2026-06-03T12:00:00Z",
    status: FlightStatus.CANCELLED,
    totalSeats: 100,
    bookedSeats: 0,
  },
];

const newFlight = {
  id: "f4",
  flightNumber: "SKYOPS-500",
  airline: "SkyOps Air",
  origin: "TUN",
  destination: "MUC",
  departureTime: "2026-06-01T08:00:00Z",
  arrivalTime: "2026-06-01T10:00:00Z",
  status: FlightStatus.SCHEDULED,
  totalSeats: 150,
  bookedSeats: 0,
};

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
const threeTickets = [{ id: "t1" }, { id: "t2" }, { id: "t3" }];

describe("FlightsList", () => {
  beforeEach(() => {
    vi.mocked(getFlights).mockResolvedValue(flights);
    vi.mocked(searchFlights).mockResolvedValue([]);
    vi.mocked(createFlight).mockResolvedValue(undefined);
    vi.mocked(updateFlight).mockResolvedValue(undefined);
    vi.mocked(deleteFlight).mockResolvedValue(undefined);
    vi.mocked(getTicketsByFlight).mockResolvedValue([]);
    vi.mocked(createTicket).mockResolvedValue(undefined);
    vi.mocked(getPassengers).mockResolvedValue(passengers);
    vi.mocked(getFreeSeats).mockResolvedValue(freeSeats);
  });

  describe("loading and list", () => {
    it("should show Loading first and then the 3 flight cards with the flight count", async () => {
      //ARRANGE
      render(
        <MemoryRouter>
          <FlightsList />
        </MemoryRouter>,
      );

      //ASSERT
      expect(screen.getByTestId("flights-loading")).toHaveTextContent(
        "Loading...",
      );

      //ACT
      const cards = await screen.findAllByTestId("flight-card");

      //ASSERT
      expect(cards).toHaveLength(3);
      expect(screen.queryByTestId("flights-loading")).not.toBeInTheDocument();
      expect(screen.getByTestId("flights-subtitle")).toHaveTextContent(
        "3 flights · all times in UTC, 24-hour",
      );
    });

    it("should show No flights found when the backend returns no flights", async () => {
      //ARRANGE
      vi.mocked(getFlights).mockResolvedValue([]);
      render(
        <MemoryRouter>
          <FlightsList />
        </MemoryRouter>,
      );

      //ACT
      const empty = await screen.findByTestId("flights-empty");

      //ASSERT
      expect(empty).toHaveTextContent("No flights found");
      expect(screen.queryByTestId("flights-loading")).not.toBeInTheDocument();
      expect(screen.queryAllByTestId("flight-card")).toHaveLength(0);
    });

    it("should show an error toast with the backend message and stop loading when the flights cannot be loaded", async () => {
      //ARRANGE
      vi.mocked(getFlights).mockRejectedValue(
        new Error("Server not reachable"),
      );
      render(
        <MemoryRouter>
          <FlightsList />
        </MemoryRouter>,
      );

      //ACT
      await screen.findByTestId("flights-empty");

      //ASSERT
      expect(toast.error).toHaveBeenCalledWith("Server not reachable");
      expect(screen.queryByTestId("flights-loading")).not.toBeInTheDocument();
    });
  });

  describe("booking a ticket", () => {
    it("should enable Book on a flight with free seats and disable it on a full flight and on a cancelled flight", async () => {
      //ARRANGE
      render(
        <MemoryRouter>
          <FlightsList />
        </MemoryRouter>,
      );

      //ACT
      const cards = await screen.findAllByTestId("flight-card");

      //ASSERT
      expect(within(cards[0]).getByTestId("button")).toBeEnabled();
      expect(within(cards[1]).getByTestId("button")).toBeDisabled();
      expect(within(cards[2]).getByTestId("button")).toBeDisabled();
    });

    it("should open the ticket form with the flight already chosen when the user clicks Book", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <FlightsList />
        </MemoryRouter>,
      );
      const cards = await screen.findAllByTestId("flight-card");

      //ACT
      await user.click(within(cards[0]).getByTestId("button"));

      //ASSERT
      const modal = screen.getByTestId("ticket-form-modal");
      await within(modal).findByText(flightLabel);
      await within(modal).findByText(passengerLabel);
      await within(modal).findByText("Economy (3 free)");
      const selects = within(modal).getAllByTestId("form-input-select");
      expect(selects[0]).toHaveValue("SKYOPS-105");
      expect(getFreeSeats).toHaveBeenCalledWith("SKYOPS-105");
    });

    it("should book the ticket, close the form, show a success toast and reload the flights", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const bookedFlights = [
        { ...flights[0], bookedSeats: 11 },
        flights[1],
        flights[2],
      ];
      render(
        <MemoryRouter>
          <FlightsList />
        </MemoryRouter>,
      );
      const cards = await screen.findAllByTestId("flight-card");
      vi.mocked(getFlights).mockResolvedValue(bookedFlights);
      await user.click(within(cards[0]).getByTestId("button"));
      const modal = screen.getByTestId("ticket-form-modal");
      await within(modal).findByText(passengerLabel);
      await within(modal).findByText("Economy (3 free)");
      const selects = within(modal).getAllByTestId("form-input-select");
      await user.selectOptions(selects[1], "DE7731902");
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
      expect(toast.error).not.toHaveBeenCalled();
      expect(screen.getAllByTestId("flight-card")[0]).toHaveTextContent(
        "11 / 150",
      );
    });
  });

  describe("creating a flight", () => {
    it("should open the New flight form when the user clicks New flight", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <FlightsList />
        </MemoryRouter>,
      );
      await screen.findAllByTestId("flight-card");

      //ACT
      await user.click(screen.getAllByTestId("button")[0]);

      //ASSERT
      expect(screen.getByTestId("flight-form-modal-title")).toHaveTextContent(
        "New flight",
      );
    });

    it("should create the flight, close the form, show a success toast and reload the flights", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <FlightsList />
        </MemoryRouter>,
      );
      await screen.findAllByTestId("flight-card");
      vi.mocked(getFlights).mockResolvedValue([...flights, newFlight]);
      await user.click(screen.getAllByTestId("button")[0]);
      const modal = screen.getByTestId("flight-form-modal");
      const inputs = within(modal).getAllByTestId("form-input-input");
      await user.type(inputs[0], "SKYOPS-500");
      await user.type(inputs[1], "SkyOps Air");
      await user.type(inputs[2], "TUN");
      await user.type(inputs[3], "MUC");
      await user.type(inputs[4], "2026-06-01T08:00");
      await user.type(inputs[5], "2026-06-01T10:00");
      await user.clear(inputs[6]);
      await user.type(inputs[6], "10");
      await user.clear(inputs[7]);
      await user.type(inputs[7], "20");
      await user.clear(inputs[8]);
      await user.type(inputs[8], "120");

      //ACT
      await user.click(within(modal).getAllByTestId("button")[1]);

      //ASSERT
      await waitFor(() => {
        expect(
          screen.queryByTestId("flight-form-modal"),
        ).not.toBeInTheDocument();
      });
      expect(createFlight).toHaveBeenCalledTimes(1);
      expect(createFlight).toHaveBeenCalledWith(
        "SKYOPS-500",
        "SkyOps Air",
        "TUN",
        "MUC",
        "2026-06-01T08:00",
        "2026-06-01T10:00",
        "Scheduled",
        "10",
        "20",
        "120",
      );
      expect(toast.success).toHaveBeenCalledWith("Flight created");
      expect(screen.getAllByTestId("flight-card")).toHaveLength(4);
      expect(screen.getByTestId("flights-subtitle")).toHaveTextContent(
        "4 flights",
      );
    });

    it("should keep the form open with the typed values and show the backend message when creating fails", async () => {
      //ARRANGE
      const user = userEvent.setup();
      vi.mocked(createFlight).mockRejectedValue(
        new Error("Flight number already exists"),
      );
      render(
        <MemoryRouter>
          <FlightsList />
        </MemoryRouter>,
      );
      await screen.findAllByTestId("flight-card");
      await user.click(screen.getAllByTestId("button")[0]);
      const modal = screen.getByTestId("flight-form-modal");
      const inputs = within(modal).getAllByTestId("form-input-input");
      await user.type(inputs[0], "SKYOPS-500");
      await user.type(inputs[1], "SkyOps Air");
      await user.type(inputs[2], "TUN");
      await user.type(inputs[3], "MUC");
      await user.type(inputs[4], "2026-06-01T08:00");
      await user.type(inputs[5], "2026-06-01T10:00");
      await user.clear(inputs[6]);
      await user.type(inputs[6], "10");
      await user.clear(inputs[7]);
      await user.type(inputs[7], "20");
      await user.clear(inputs[8]);
      await user.type(inputs[8], "120");

      //ACT
      await user.click(within(modal).getAllByTestId("button")[1]);

      //ASSERT
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Flight number already exists",
        );
      });
      expect(screen.getByTestId("flight-form-modal")).toBeInTheDocument();
      expect(inputs[0]).toHaveValue("SKYOPS-500");
      expect(inputs[1]).toHaveValue("SkyOps Air");
      expect(toast.success).not.toHaveBeenCalled();
      expect(getFlights).toHaveBeenCalledTimes(1);
    });
  });

  describe("editing a flight", () => {
    it("should open the Edit flight form with the flight values and a locked flight number", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <FlightsList />
        </MemoryRouter>,
      );
      const cards = await screen.findAllByTestId("flight-card");

      //ACT
      await user.click(within(cards[0]).getAllByTestId("icon-button")[0]);

      //ASSERT
      const modal = screen.getByTestId("flight-form-modal");
      const inputs = within(modal).getAllByTestId("form-input-input");
      expect(screen.getByTestId("flight-form-modal-title")).toHaveTextContent(
        "Edit flight",
      );
      expect(inputs).toHaveLength(6);
      expect(inputs[0]).toHaveValue("SKYOPS-105");
      expect(inputs[0]).toBeDisabled();
      expect(inputs[1]).toHaveValue("SkyOps Air");
      expect(inputs[2]).toHaveValue("TUN");
      expect(inputs[3]).toHaveValue("FRA");
      expect(inputs[4]).toHaveValue("2026-06-01T08:00");
      expect(inputs[5]).toHaveValue("2026-06-01T10:00");
      expect(within(modal).getByTestId("form-input-select")).toHaveValue(
        "Scheduled",
      );
    });

    it("should update the flight without seats, close the form and show the new airline in the list", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const renamedFlights = [
        { ...flights[0], airline: "Jet Air Plus" },
        flights[1],
        flights[2],
      ];
      render(
        <MemoryRouter>
          <FlightsList />
        </MemoryRouter>,
      );
      const cards = await screen.findAllByTestId("flight-card");
      vi.mocked(getFlights).mockResolvedValue(renamedFlights);
      await user.click(within(cards[0]).getAllByTestId("icon-button")[0]);
      const modal = screen.getByTestId("flight-form-modal");
      const inputs = within(modal).getAllByTestId("form-input-input");

      //ACT
      await user.clear(inputs[1]);
      await user.type(inputs[1], "Jet Air Plus");
      await user.click(within(modal).getAllByTestId("button")[1]);

      //ASSERT
      await waitFor(() => {
        expect(
          screen.queryByTestId("flight-form-modal"),
        ).not.toBeInTheDocument();
      });
      expect(updateFlight).toHaveBeenCalledTimes(1);
      expect(updateFlight).toHaveBeenCalledWith(
        "SKYOPS-105",
        "Jet Air Plus",
        "TUN",
        "FRA",
        "2026-06-01T08:00",
        "2026-06-01T10:00",
        "Scheduled",
      );
      expect(createFlight).not.toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Flight updated");
      expect(screen.getAllByTestId("flight-card")[0]).toHaveTextContent(
        "Jet Air Plus",
      );
    });
  });

  describe("deleting a flight", () => {
    it("should open the delete modal for the flight and warn about its 3 tickets", async () => {
      //ARRANGE
      const user = userEvent.setup();
      vi.mocked(getTicketsByFlight).mockResolvedValue(threeTickets);
      render(
        <MemoryRouter>
          <FlightsList />
        </MemoryRouter>,
      );
      const cards = await screen.findAllByTestId("flight-card");

      //ACT
      await user.click(within(cards[0]).getAllByTestId("icon-button")[1]);

      //ASSERT
      const modal = screen.getByTestId("delete-modal");
      expect(modal).toHaveTextContent("Delete flight");
      expect(modal).toHaveTextContent(
        "Delete SKYOPS-105 ? This cannot be undone.",
      );
      await waitFor(() => {
        expect(modal).toHaveTextContent(
          "3 tickets reference this flight. The API does not remove them; they will show as deleted.",
        );
      });
      expect(getTicketsByFlight).toHaveBeenCalledWith("f1");
    });

    it("should not show a warning when the flight has no tickets", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <FlightsList />
        </MemoryRouter>,
      );
      const cards = await screen.findAllByTestId("flight-card");

      //ACT
      await user.click(within(cards[0]).getAllByTestId("icon-button")[1]);

      //ASSERT
      await waitFor(() => {
        expect(getTicketsByFlight).toHaveBeenCalledWith("f1");
      });
      expect(screen.getByTestId("delete-modal")).not.toHaveTextContent(
        "tickets reference",
      );
    });

    it("should delete the flight, remove its card, close the modal and show a success toast", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <FlightsList />
        </MemoryRouter>,
      );
      const cards = await screen.findAllByTestId("flight-card");
      await user.click(within(cards[0]).getAllByTestId("icon-button")[1]);
      const modal = screen.getByTestId("delete-modal");

      //ACT
      await user.click(within(modal).getAllByTestId("button")[1]);

      //ASSERT
      await waitFor(() => {
        expect(screen.queryByTestId("delete-modal")).not.toBeInTheDocument();
      });
      const remainingCards = screen.getAllByTestId("flight-card");
      expect(deleteFlight).toHaveBeenCalledTimes(1);
      expect(deleteFlight).toHaveBeenCalledWith("SKYOPS-105");
      expect(toast.success).toHaveBeenCalledWith("Flight deleted");
      expect(remainingCards).toHaveLength(2);
      expect(remainingCards[0]).toHaveTextContent("SKYOPS-200");
      expect(remainingCards[1]).toHaveTextContent("SKYOPS-300");
      expect(screen.getByTestId("flights-subtitle")).toHaveTextContent(
        "2 flights",
      );
    });

    it("should keep the card and the modal and show the backend message when deleting fails", async () => {
      //ARRANGE
      const user = userEvent.setup();
      vi.mocked(deleteFlight).mockRejectedValue(new Error("Flight not found"));
      render(
        <MemoryRouter>
          <FlightsList />
        </MemoryRouter>,
      );
      const cards = await screen.findAllByTestId("flight-card");
      await user.click(within(cards[0]).getAllByTestId("icon-button")[1]);
      const modal = screen.getByTestId("delete-modal");

      //ACT
      await user.click(within(modal).getAllByTestId("button")[1]);

      //ASSERT
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Flight not found");
      });
      expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
      expect(screen.getAllByTestId("flight-card")).toHaveLength(3);
      expect(toast.success).not.toHaveBeenCalled();
    });

    it("should close the delete modal without deleting when the user clicks Cancel", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <FlightsList />
        </MemoryRouter>,
      );
      const cards = await screen.findAllByTestId("flight-card");
      await user.click(within(cards[0]).getAllByTestId("icon-button")[1]);
      const modal = screen.getByTestId("delete-modal");

      //ACT
      await user.click(within(modal).getAllByTestId("button")[0]);

      //ASSERT
      expect(screen.queryByTestId("delete-modal")).not.toBeInTheDocument();
      expect(deleteFlight).not.toHaveBeenCalled();
      expect(screen.getAllByTestId("flight-card")).toHaveLength(3);
    });
  });

  describe("filters", () => {
    it("should disable Search while the origin has 1 or 2 letters and enable it for 0 or 3 letters", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <FlightsList />
        </MemoryRouter>,
      );
      await screen.findAllByTestId("flight-card");
      const origin = screen.getAllByTestId("form-input-input")[0];
      const searchButton = screen.getAllByTestId("button")[1];

      //ASSERT
      expect(searchButton).toBeEnabled();

      //ACT
      await user.type(origin, "TU");

      //ASSERT
      expect(searchButton).toBeDisabled();

      //ACT
      await user.type(origin, "N");

      //ASSERT
      expect(searchButton).toBeEnabled();

      //ACT
      await user.clear(origin);

      //ASSERT
      expect(searchButton).toBeEnabled();
    });

    it("should search with the typed origin and show only the result", async () => {
      //ARRANGE
      const user = userEvent.setup();
      vi.mocked(searchFlights).mockResolvedValue([flights[0]]);
      render(
        <MemoryRouter>
          <FlightsList />
        </MemoryRouter>,
      );
      await screen.findAllByTestId("flight-card");
      const origin = screen.getAllByTestId("form-input-input")[0];
      await user.type(origin, "TUN");

      //ACT
      await user.click(screen.getAllByTestId("button")[1]);

      //ASSERT
      await waitFor(() => {
        expect(screen.getAllByTestId("flight-card")).toHaveLength(1);
      });
      expect(searchFlights).toHaveBeenCalledTimes(1);
      expect(searchFlights).toHaveBeenCalledWith("", "TUN", "", "");
      expect(screen.getByTestId("flight-card")).toHaveTextContent("SKYOPS-105");
    });

    it("should clear the filters and bring back all flights when the user clicks Reset filters", async () => {
      //ARRANGE
      const user = userEvent.setup();
      vi.mocked(searchFlights).mockResolvedValue([flights[0]]);
      render(
        <MemoryRouter>
          <FlightsList />
        </MemoryRouter>,
      );
      await screen.findAllByTestId("flight-card");
      const origin = screen.getAllByTestId("form-input-input")[0];
      await user.type(origin, "TUN");
      await user.click(screen.getAllByTestId("button")[1]);
      await waitFor(() => {
        expect(screen.getAllByTestId("flight-card")).toHaveLength(1);
      });

      //ACT
      await user.click(screen.getAllByTestId("button")[2]);

      //ASSERT
      await waitFor(() => {
        expect(screen.getAllByTestId("flight-card")).toHaveLength(3);
      });
      expect(origin).toHaveValue("");
      expect(getFlights).toHaveBeenCalledTimes(2);
    });
  });
});

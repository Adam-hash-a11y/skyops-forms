import { render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";
import { toast } from "react-toastify";
import { PassengerList } from "../../src/components/passengerList/PassengerList";
import {
  createPassenger,
  deletePassenger,
  getPassengers,
  searchPassengers,
  updatePassenger,
} from "../../src/service/passengerService";
import {
  createTicket,
  getTicketsByPassenger,
} from "../../src/service/ticketService";
import { getFlights, getFreeSeats } from "../../src/service/flightService";
import { FlightStatus } from "../../src/types/flightTypes";

vi.mock("../../src/service/passengerService");
vi.mock("../../src/service/ticketService");
vi.mock("../../src/service/flightService");
vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

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
  {
    id: "p3",
    firstName: "Sara",
    lastName: "Ben Ali",
    passportNumber: "TN1234567",
    nationality: "TN",
    dateOfBirth: "1990-03-21",
    email: "sara@example.com",
    phoneNumber: "+21612345678",
  },
];

const newPassenger = {
  id: "p4",
  firstName: "Mara",
  lastName: "Klein",
  passportNumber: "DE5550123",
  nationality: "DE",
  dateOfBirth: "1992-11-02",
  email: "name@example.com",
  phoneNumber: "+4915194300275",
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

describe("PassengerList", () => {
  beforeEach(() => {
    vi.mocked(getPassengers).mockResolvedValue(passengers);
    vi.mocked(searchPassengers).mockResolvedValue([]);
    vi.mocked(createPassenger).mockResolvedValue(undefined);
    vi.mocked(updatePassenger).mockResolvedValue(undefined);
    vi.mocked(deletePassenger).mockResolvedValue(undefined);
    vi.mocked(getTicketsByPassenger).mockResolvedValue([]);
    vi.mocked(createTicket).mockResolvedValue(undefined);
    vi.mocked(getFlights).mockResolvedValue(flights);
    vi.mocked(getFreeSeats).mockResolvedValue(freeSeats);
  });

  describe("loading and list", () => {
    it("should show Loading first and then the 3 passenger cards with the passenger count", async () => {
      //ARRANGE
      render(
        <MemoryRouter>
          <PassengerList />
        </MemoryRouter>,
      );

      //ASSERT
      expect(screen.getByTestId("passengers-loading")).toHaveTextContent(
        "Loading...",
      );

      //ACT
      const cards = await screen.findAllByTestId("passenger-card");

      //ASSERT
      expect(cards).toHaveLength(3);
      expect(
        screen.queryByTestId("passengers-loading"),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId("passengers-subtitle")).toHaveTextContent(
        "3 passengers · registered",
      );
    });

    it("should show No passengers found when the backend returns no passengers", async () => {
      //ARRANGE
      vi.mocked(getPassengers).mockResolvedValue([]);
      render(
        <MemoryRouter>
          <PassengerList />
        </MemoryRouter>,
      );

      //ACT
      const empty = await screen.findByTestId("passengers-empty");

      //ASSERT
      expect(empty).toHaveTextContent("No passengers found");
      expect(
        screen.queryByTestId("passengers-loading"),
      ).not.toBeInTheDocument();
      expect(screen.queryAllByTestId("passenger-card")).toHaveLength(0);
    });

    it("should show an error toast with the backend message and stop loading when the passengers cannot be loaded", async () => {
      //ARRANGE
      vi.mocked(getPassengers).mockRejectedValue(
        new Error("Server not reachable"),
      );
      render(
        <MemoryRouter>
          <PassengerList />
        </MemoryRouter>,
      );

      //ACT
      await screen.findByTestId("passengers-empty");

      //ASSERT
      expect(toast.error).toHaveBeenCalledWith("Server not reachable");
      expect(
        screen.queryByTestId("passengers-loading"),
      ).not.toBeInTheDocument();
    });
  });

  describe("booking a ticket", () => {
    it("should enable Book on every passenger card", async () => {
      //ARRANGE
      render(
        <MemoryRouter>
          <PassengerList />
        </MemoryRouter>,
      );

      //ACT
      const cards = await screen.findAllByTestId("passenger-card");

      //ASSERT
      expect(within(cards[0]).getByTestId("button")).toBeEnabled();
      expect(within(cards[1]).getByTestId("button")).toBeEnabled();
      expect(within(cards[2]).getByTestId("button")).toBeEnabled();
    });

    it("should open the ticket form with the passenger already chosen when the user clicks Book", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <PassengerList />
        </MemoryRouter>,
      );
      const cards = await screen.findAllByTestId("passenger-card");

      //ACT
      await user.click(within(cards[0]).getByTestId("button"));

      //ASSERT
      const modal = screen.getByTestId("ticket-form-modal");
      await within(modal).findByText(flightLabel);
      await within(modal).findByText(passengerLabel);
      const selects = within(modal).getAllByTestId("form-input-select");
      expect(selects[1]).toHaveValue("DE7731902");
    });

    it("should book the ticket, close the form, show a success toast and reload the passengers", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <PassengerList />
        </MemoryRouter>,
      );
      const cards = await screen.findAllByTestId("passenger-card");
      vi.mocked(getPassengers).mockResolvedValue([...passengers, newPassenger]);
      await user.click(within(cards[0]).getByTestId("button"));
      const modal = screen.getByTestId("ticket-form-modal");
      await within(modal).findByText(flightLabel);
      await within(modal).findByText(passengerLabel);
      const selects = within(modal).getAllByTestId("form-input-select");
      await user.selectOptions(selects[0], "SKYOPS-105");
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
      expect(toast.error).not.toHaveBeenCalled();
      expect(screen.getAllByTestId("passenger-card")).toHaveLength(4);
    });
  });

  describe("creating a passenger", () => {
    it("should open the New passenger form when the user clicks New passenger", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <PassengerList />
        </MemoryRouter>,
      );
      await screen.findAllByTestId("passenger-card");

      //ACT
      await user.click(screen.getAllByTestId("button")[0]);

      //ASSERT
      expect(
        screen.getByTestId("passenger-form-modal-title"),
      ).toHaveTextContent("New passenger");
    });

    it("should create the passenger, close the form, show a success toast and reload the passengers", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <PassengerList />
        </MemoryRouter>,
      );
      await screen.findAllByTestId("passenger-card");
      vi.mocked(getPassengers).mockResolvedValue([...passengers, newPassenger]);
      await user.click(screen.getAllByTestId("button")[0]);
      const modal = screen.getByTestId("passenger-form-modal");
      const inputs = within(modal).getAllByTestId("form-input-input");
      const select = within(modal).getByTestId("form-input-select");
      await user.type(inputs[0], "Mara");
      await user.type(inputs[1], "Klein");
      await user.type(inputs[2], "DE5550123");
      await user.selectOptions(select, "DE");
      await user.type(inputs[3], "1992-11-02");
      await user.type(inputs[4], "name@example.com");
      await user.type(inputs[5], "+4915194300275");

      //ACT
      await user.click(within(modal).getAllByTestId("button")[1]);

      //ASSERT
      await waitFor(() => {
        expect(
          screen.queryByTestId("passenger-form-modal"),
        ).not.toBeInTheDocument();
      });
      expect(createPassenger).toHaveBeenCalledTimes(1);
      expect(createPassenger).toHaveBeenCalledWith(
        "Mara",
        "Klein",
        "DE5550123",
        "DE",
        "1992-11-02",
        "name@example.com",
        "+4915194300275",
      );
      expect(toast.success).toHaveBeenCalledWith("Passenger created");
      expect(screen.getAllByTestId("passenger-card")).toHaveLength(4);
      expect(screen.getByTestId("passengers-subtitle")).toHaveTextContent(
        "4 passengers",
      );
    });

    it("should keep the form open with the typed values and show the backend message when creating fails", async () => {
      //ARRANGE
      const user = userEvent.setup();
      vi.mocked(createPassenger).mockRejectedValue(
        new Error("Passport number already exists"),
      );
      render(
        <MemoryRouter>
          <PassengerList />
        </MemoryRouter>,
      );
      await screen.findAllByTestId("passenger-card");
      await user.click(screen.getAllByTestId("button")[0]);
      const modal = screen.getByTestId("passenger-form-modal");
      const inputs = within(modal).getAllByTestId("form-input-input");
      const select = within(modal).getByTestId("form-input-select");
      await user.type(inputs[0], "Mara");
      await user.type(inputs[1], "Klein");
      await user.type(inputs[2], "DE5550123");
      await user.selectOptions(select, "DE");
      await user.type(inputs[3], "1992-11-02");
      await user.type(inputs[4], "name@example.com");
      await user.type(inputs[5], "+4915194300275");

      //ACT
      await user.click(within(modal).getAllByTestId("button")[1]);

      //ASSERT
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Passport number already exists",
        );
      });
      expect(screen.getByTestId("passenger-form-modal")).toBeInTheDocument();
      expect(inputs[0]).toHaveValue("Mara");
      expect(inputs[2]).toHaveValue("DE5550123");
      expect(toast.success).not.toHaveBeenCalled();
      expect(getPassengers).toHaveBeenCalledTimes(1);
    });
  });

  describe("editing a passenger", () => {
    it("should open the Edit passenger form with the passenger values and a locked passport number", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <PassengerList />
        </MemoryRouter>,
      );
      const cards = await screen.findAllByTestId("passenger-card");

      //ACT
      await user.click(within(cards[0]).getAllByTestId("icon-button")[0]);

      //ASSERT
      const modal = screen.getByTestId("passenger-form-modal");
      const inputs = within(modal).getAllByTestId("form-input-input");
      expect(
        screen.getByTestId("passenger-form-modal-title"),
      ).toHaveTextContent("Edit passenger");
      expect(inputs).toHaveLength(6);
      expect(inputs[0]).toHaveValue("Lena");
      expect(inputs[1]).toHaveValue("Banks");
      expect(inputs[2]).toHaveValue("DE7731902");
      expect(inputs[2]).toBeDisabled();
      expect(inputs[3]).toHaveValue("1992-11-02");
      expect(inputs[4]).toHaveValue("name@example.com");
      expect(inputs[5]).toHaveValue("+4915194300275");
      expect(within(modal).getByTestId("form-input-select")).toHaveValue("DE");
    });

    it("should update the passenger, close the form and show the new name in the list", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const renamedPassengers = [
        { ...passengers[0], firstName: "Lenka" },
        passengers[1],
        passengers[2],
      ];
      render(
        <MemoryRouter>
          <PassengerList />
        </MemoryRouter>,
      );
      const cards = await screen.findAllByTestId("passenger-card");
      vi.mocked(getPassengers).mockResolvedValue(renamedPassengers);
      await user.click(within(cards[0]).getAllByTestId("icon-button")[0]);
      const modal = screen.getByTestId("passenger-form-modal");
      const inputs = within(modal).getAllByTestId("form-input-input");

      //ACT
      await user.clear(inputs[0]);
      await user.type(inputs[0], "Lenka");
      await user.click(within(modal).getAllByTestId("button")[1]);

      //ASSERT
      await waitFor(() => {
        expect(
          screen.queryByTestId("passenger-form-modal"),
        ).not.toBeInTheDocument();
      });
      expect(updatePassenger).toHaveBeenCalledTimes(1);
      expect(updatePassenger).toHaveBeenCalledWith(
        "DE7731902",
        "Lenka",
        "Banks",
        "DE",
        "1992-11-02",
        "name@example.com",
        "+4915194300275",
      );
      expect(createPassenger).not.toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Passenger updated");
      expect(screen.getAllByTestId("passenger-card")[0]).toHaveTextContent(
        "Lenka Banks",
      );
    });
  });

  describe("deleting a passenger", () => {
    it("should open the delete modal for the passenger and warn about the 3 tickets", async () => {
      //ARRANGE
      const user = userEvent.setup();
      vi.mocked(getTicketsByPassenger).mockResolvedValue(threeTickets);
      render(
        <MemoryRouter>
          <PassengerList />
        </MemoryRouter>,
      );
      const cards = await screen.findAllByTestId("passenger-card");

      //ACT
      await user.click(within(cards[0]).getAllByTestId("icon-button")[1]);

      //ASSERT
      const modal = screen.getByTestId("delete-modal");
      expect(modal).toHaveTextContent("Delete passenger");
      expect(modal).toHaveTextContent(
        "Delete Lena Banks (DE7731902) ? This cannot be undone.",
      );
      await waitFor(() => {
        expect(modal).toHaveTextContent(
          "3 tickets reference this passenger. The API does not remove them; they will show as deleted.",
        );
      });
      expect(getTicketsByPassenger).toHaveBeenCalledWith("p1");
    });

    it("should not show a warning when the passenger has no tickets", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <PassengerList />
        </MemoryRouter>,
      );
      const cards = await screen.findAllByTestId("passenger-card");

      //ACT
      await user.click(within(cards[0]).getAllByTestId("icon-button")[1]);

      //ASSERT
      await waitFor(() => {
        expect(getTicketsByPassenger).toHaveBeenCalledWith("p1");
      });
      expect(screen.getByTestId("delete-modal")).not.toHaveTextContent(
        "tickets reference",
      );
    });

    it("should delete the passenger, remove the card, close the modal and show a success toast", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <PassengerList />
        </MemoryRouter>,
      );
      const cards = await screen.findAllByTestId("passenger-card");
      await user.click(within(cards[0]).getAllByTestId("icon-button")[1]);
      const modal = screen.getByTestId("delete-modal");

      //ACT
      await user.click(within(modal).getAllByTestId("button")[1]);

      //ASSERT
      await waitFor(() => {
        expect(screen.queryByTestId("delete-modal")).not.toBeInTheDocument();
      });
      const remainingCards = screen.getAllByTestId("passenger-card");
      expect(deletePassenger).toHaveBeenCalledTimes(1);
      expect(deletePassenger).toHaveBeenCalledWith("DE7731902");
      expect(toast.success).toHaveBeenCalledWith("Passenger deleted");
      expect(remainingCards).toHaveLength(2);
      expect(remainingCards[0]).toHaveTextContent("Jonas Fischer");
      expect(remainingCards[1]).toHaveTextContent("Sara Ben Ali");
      expect(screen.getByTestId("passengers-subtitle")).toHaveTextContent(
        "2 passengers",
      );
    });

    it("should keep the card and the modal and show the backend message when deleting fails", async () => {
      //ARRANGE
      const user = userEvent.setup();
      vi.mocked(deletePassenger).mockRejectedValue(
        new Error("Passenger not found"),
      );
      render(
        <MemoryRouter>
          <PassengerList />
        </MemoryRouter>,
      );
      const cards = await screen.findAllByTestId("passenger-card");
      await user.click(within(cards[0]).getAllByTestId("icon-button")[1]);
      const modal = screen.getByTestId("delete-modal");

      //ACT
      await user.click(within(modal).getAllByTestId("button")[1]);

      //ASSERT
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Passenger not found");
      });
      expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
      expect(screen.getAllByTestId("passenger-card")).toHaveLength(3);
      expect(toast.success).not.toHaveBeenCalled();
    });

    it("should close the delete modal without deleting when the user clicks Cancel", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <PassengerList />
        </MemoryRouter>,
      );
      const cards = await screen.findAllByTestId("passenger-card");
      await user.click(within(cards[0]).getAllByTestId("icon-button")[1]);
      const modal = screen.getByTestId("delete-modal");

      //ACT
      await user.click(within(modal).getAllByTestId("button")[0]);

      //ASSERT
      expect(screen.queryByTestId("delete-modal")).not.toBeInTheDocument();
      expect(deletePassenger).not.toHaveBeenCalled();
      expect(screen.getAllByTestId("passenger-card")).toHaveLength(3);
    });
  });

  describe("filters", () => {
    it("should search with the typed first name and show only the result", async () => {
      //ARRANGE
      const user = userEvent.setup();
      vi.mocked(searchPassengers).mockResolvedValue([passengers[0]]);
      render(
        <MemoryRouter>
          <PassengerList />
        </MemoryRouter>,
      );
      await screen.findAllByTestId("passenger-card");
      const firstName = screen.getAllByTestId("form-input-input")[0];
      await user.type(firstName, "Lena");

      //ACT
      await user.click(screen.getAllByTestId("button")[1]);

      //ASSERT
      await waitFor(() => {
        expect(screen.getAllByTestId("passenger-card")).toHaveLength(1);
      });
      expect(searchPassengers).toHaveBeenCalledTimes(1);
      expect(searchPassengers).toHaveBeenCalledWith("", "Lena", "", "");
      expect(screen.getByTestId("passenger-card")).toHaveTextContent(
        "Lena Banks",
      );
    });

    it("should search with the chosen nationality", async () => {
      //ARRANGE
      const user = userEvent.setup();
      vi.mocked(searchPassengers).mockResolvedValue([passengers[1]]);
      render(
        <MemoryRouter>
          <PassengerList />
        </MemoryRouter>,
      );
      await screen.findAllByTestId("passenger-card");
      const nationality = screen.getAllByTestId("form-input-select")[0];
      await user.selectOptions(nationality, "FR");

      //ACT
      await user.click(screen.getAllByTestId("button")[1]);

      //ASSERT
      await waitFor(() => {
        expect(screen.getAllByTestId("passenger-card")).toHaveLength(1);
      });
      expect(searchPassengers).toHaveBeenCalledTimes(1);
      expect(searchPassengers).toHaveBeenCalledWith("FR", "", "", "");
    });

    it("should clear the filters and bring back all passengers when the user clicks Reset filters", async () => {
      //ARRANGE
      const user = userEvent.setup();
      vi.mocked(searchPassengers).mockResolvedValue([passengers[0]]);
      render(
        <MemoryRouter>
          <PassengerList />
        </MemoryRouter>,
      );
      await screen.findAllByTestId("passenger-card");
      const firstName = screen.getAllByTestId("form-input-input")[0];
      await user.type(firstName, "Lena");
      await user.click(screen.getAllByTestId("button")[1]);
      await waitFor(() => {
        expect(screen.getAllByTestId("passenger-card")).toHaveLength(1);
      });

      //ACT
      await user.click(screen.getAllByTestId("button")[2]);

      //ASSERT
      await waitFor(() => {
        expect(screen.getAllByTestId("passenger-card")).toHaveLength(3);
      });
      expect(firstName).toHaveValue("");
      expect(getPassengers).toHaveBeenCalledTimes(2);
    });
  });
});

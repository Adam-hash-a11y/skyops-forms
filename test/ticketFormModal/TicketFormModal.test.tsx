import { render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { toast } from "react-toastify";
import { TicketFormModal } from "../../src/components/shared/ticketFormModal/TicketFormModal";
import { getFlights, getFreeSeats } from "../../src/service/flightService";
import { getPassengers } from "../../src/service/passengerService";
import { FlightStatus } from "../../src/types/flightTypes";

vi.mock("../../src/service/flightService");
vi.mock("../../src/service/passengerService");
vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const flights = [
  {
    id: "f1",
    flightNumber: "SKYOPS-105",
    airline: "Skyways",
    origin: "TUN",
    destination: "FRA",
    departureTime: "2026-06-01T08:00:00Z",
    arrivalTime: "2026-06-01T11:00:00Z",
    status: FlightStatus.SCHEDULED,
    totalSeats: 10,
    bookedSeats: 2,
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
    totalSeats: 10,
    bookedSeats: 0,
  },
  {
    id: "f3",
    flightNumber: "SKYOPS-300",
    airline: "Skyways",
    origin: "TUN",
    destination: "ROM",
    departureTime: "2026-06-03T10:00:00Z",
    arrivalTime: "2026-06-03T12:00:00Z",
    status: FlightStatus.CANCELLED,
    totalSeats: 10,
    bookedSeats: 0,
  },
  {
    id: "f4",
    flightNumber: "SKYOPS-400",
    airline: "Skyways",
    origin: "TUN",
    destination: "PAR",
    departureTime: "2026-06-04T11:00:00Z",
    arrivalTime: "2026-06-04T14:00:00Z",
    status: FlightStatus.LANDED,
    totalSeats: 10,
    bookedSeats: 10,
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
const secondFlightLabel = "SKYOPS-200 · FRA → TUN · 02 Jun 2026, 09:30 UTC";
const passengerLabel = "Banks, Lena · DE7731902";

describe("TicketFormModal", () => {
  beforeEach(() => {
    vi.mocked(getFlights).mockResolvedValue(flights);
    vi.mocked(getPassengers).mockResolvedValue(passengers);
    vi.mocked(getFreeSeats).mockResolvedValue(freeSeats);
  });

  describe("rendering", () => {
    it("should open with Book ticket disabled, class and seat locked and no price", async () => {
      //ARRANGE
      render(<TicketFormModal handleSave={vi.fn()} handleClose={vi.fn()} />);
      await screen.findByText(flightLabel);

      //ACT
      const selects = screen.getAllByTestId("form-input-select");
      const bookButton = screen.getAllByTestId("button")[1];
      const price = screen.getByTestId("ticket-form-modal-price");

      //ASSERT
      expect(bookButton).toHaveTextContent("Book ticket");
      expect(bookButton).toBeDisabled();
      expect(selects[2]).toBeDisabled();
      expect(selects[3]).toBeDisabled();
      expect(price).toHaveTextContent("-");
    });

    it("should list only Scheduled and Delayed flights in the flight select", async () => {
      //ARRANGE
      render(<TicketFormModal handleSave={vi.fn()} handleClose={vi.fn()} />);
      await screen.findByText(flightLabel);

      //ACT
      const flightSelect = screen.getAllByTestId("form-input-select")[0];
      const options = within(flightSelect).getAllByRole("option");

      //ASSERT
      expect(options).toHaveLength(3);
      expect(options[0]).toHaveTextContent("Select a flight...");
      expect(options[1]).toHaveTextContent(flightLabel);
      expect(options[2]).toHaveTextContent(secondFlightLabel);
      expect(screen.queryByText(/SKYOPS-300/)).not.toBeInTheDocument();
      expect(screen.queryByText(/SKYOPS-400/)).not.toBeInTheDocument();
    });

    it("should show each passenger as last name, first name and passport number", async () => {
      //ARRANGE
      render(<TicketFormModal handleSave={vi.fn()} handleClose={vi.fn()} />);

      //ACT
      const label = await screen.findByText(passengerLabel);
      const passengerSelect = screen.getAllByTestId("form-input-select")[1];

      //ASSERT
      expect(label).toBeInTheDocument();
      expect(within(passengerSelect).getAllByRole("option")).toHaveLength(3);
    });
  });

  describe("cascade", () => {
    it("should unlock the class select only when a flight and a passenger are chosen", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<TicketFormModal handleSave={vi.fn()} handleClose={vi.fn()} />);
      const selects = screen.getAllByTestId("form-input-select");
      await screen.findByText(flightLabel);
      await screen.findByText(passengerLabel);

      //ACT
      await user.selectOptions(selects[0], "SKYOPS-105");

      //ASSERT
      expect(selects[2]).toBeDisabled();

      //ACT
      await user.selectOptions(selects[1], "DE7731902");

      //ASSERT
      expect(selects[2]).toBeEnabled();
    });

    it("should load the free seats of the chosen flight and show only classes that have free seats", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<TicketFormModal handleSave={vi.fn()} handleClose={vi.fn()} />);
      const selects = screen.getAllByTestId("form-input-select");
      await screen.findByText(flightLabel);
      await screen.findByText(passengerLabel);

      //ACT
      await user.selectOptions(selects[0], "SKYOPS-105");
      await user.selectOptions(selects[1], "DE7731902");

      //ASSERT
      expect(await screen.findByText("Economy (3 free)")).toBeInTheDocument();
      expect(screen.getByText("Business (1 free)")).toBeInTheDocument();
      expect(screen.queryByText(/First \(/)).not.toBeInTheDocument();
      expect(getFreeSeats).toHaveBeenCalledTimes(1);
      expect(getFreeSeats).toHaveBeenCalledWith("SKYOPS-105");
    });

    it("should lock the seat select until a class is chosen and then list only seats of that class", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<TicketFormModal handleSave={vi.fn()} handleClose={vi.fn()} />);
      const selects = screen.getAllByTestId("form-input-select");
      await screen.findByText(flightLabel);
      await screen.findByText(passengerLabel);
      await user.selectOptions(selects[0], "SKYOPS-105");
      await user.selectOptions(selects[1], "DE7731902");
      await screen.findByText("Economy (3 free)");

      //ASSERT
      expect(selects[3]).toBeDisabled();

      //ACT
      await user.selectOptions(selects[2], "Economy");

      //ASSERT
      expect(selects[3]).toBeEnabled();
      expect(within(selects[3]).getAllByRole("option")).toHaveLength(4);
      expect(screen.getByText("E1")).toBeInTheDocument();
      expect(screen.getByText("E3")).toBeInTheDocument();
      expect(screen.queryByText("B1")).not.toBeInTheDocument();
    });

    it("should show the price of the chosen class", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<TicketFormModal handleSave={vi.fn()} handleClose={vi.fn()} />);
      const selects = screen.getAllByTestId("form-input-select");
      const price = screen.getByTestId("ticket-form-modal-price");
      await screen.findByText(flightLabel);
      await screen.findByText(passengerLabel);
      await user.selectOptions(selects[0], "SKYOPS-105");
      await user.selectOptions(selects[1], "DE7731902");
      await screen.findByText("Economy (3 free)");

      //ACT
      await user.selectOptions(selects[2], "Economy");

      //ASSERT
      expect(price).toHaveTextContent("120 EUR");

      //ACT
      await user.selectOptions(selects[2], "Business");

      //ASSERT
      expect(price).toHaveTextContent("300 EUR");
    });

    it("should clear class, seat and price when the user changes the flight", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<TicketFormModal handleSave={vi.fn()} handleClose={vi.fn()} />);
      const selects = screen.getAllByTestId("form-input-select");
      const price = screen.getByTestId("ticket-form-modal-price");
      await screen.findByText(flightLabel);
      await screen.findByText(passengerLabel);
      await user.selectOptions(selects[0], "SKYOPS-105");
      await user.selectOptions(selects[1], "DE7731902");
      await screen.findByText("Economy (3 free)");
      await user.selectOptions(selects[2], "Economy");
      await user.selectOptions(selects[3], "E1");

      //ASSERT
      expect(price).toHaveTextContent("120 EUR");

      //ACT
      await user.selectOptions(selects[0], "SKYOPS-200");

      //ASSERT
      expect(selects[2]).toHaveValue("");
      expect(selects[3]).toBeDisabled();
      expect(price).toHaveTextContent("-");
      expect(screen.getAllByTestId("button")[1]).toBeDisabled();
    });

    it("should clear the seat and disable Book ticket when the user changes the class", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<TicketFormModal handleSave={vi.fn()} handleClose={vi.fn()} />);
      const selects = screen.getAllByTestId("form-input-select");
      const bookButton = screen.getAllByTestId("button")[1];
      await screen.findByText(flightLabel);
      await screen.findByText(passengerLabel);
      await user.selectOptions(selects[0], "SKYOPS-105");
      await user.selectOptions(selects[1], "DE7731902");
      await screen.findByText("Economy (3 free)");
      await user.selectOptions(selects[2], "Economy");
      await user.selectOptions(selects[3], "E1");

      //ASSERT
      expect(bookButton).toBeEnabled();

      //ACT
      await user.selectOptions(selects[2], "Business");

      //ASSERT
      expect(selects[3]).toHaveValue("");
      expect(screen.getByText("B1")).toBeInTheDocument();
      expect(bookButton).toBeDisabled();
    });
  });

  describe("prefill", () => {
    it("should preselect the flight and load its seats when a flight number is given", async () => {
      //ARRANGE
      render(
        <TicketFormModal
          handleSave={vi.fn()}
          handleClose={vi.fn()}
          flightNumber="SKYOPS-105"
        />,
      );

      //ACT
      await screen.findByText(flightLabel);
      const flightSelect = screen.getAllByTestId("form-input-select")[0];

      //ASSERT
      expect(flightSelect).toHaveValue("SKYOPS-105");
      expect(getFreeSeats).toHaveBeenCalledWith("SKYOPS-105");
    });

    it("should preselect the passenger when a passport number is given", async () => {
      //ARRANGE
      render(
        <TicketFormModal
          handleSave={vi.fn()}
          handleClose={vi.fn()}
          passportNumber="DE7731902"
        />,
      );

      //ACT
      await screen.findByText(passengerLabel);
      const passengerSelect = screen.getAllByTestId("form-input-select")[1];

      //ASSERT
      expect(passengerSelect).toHaveValue("DE7731902");
    });
  });

  describe("submit", () => {
    it("should call handleSave once with flight id, passenger id, seat and class", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleSave = vi.fn();
      render(<TicketFormModal handleSave={handleSave} handleClose={vi.fn()} />);
      const selects = screen.getAllByTestId("form-input-select");
      const bookButton = screen.getAllByTestId("button")[1];
      await screen.findByText(flightLabel);
      await screen.findByText(passengerLabel);
      await user.selectOptions(selects[0], "SKYOPS-105");
      await user.selectOptions(selects[1], "DE7731902");
      await screen.findByText("Economy (3 free)");
      await user.selectOptions(selects[2], "Economy");
      await user.selectOptions(selects[3], "E1");

      //ACT
      await user.click(bookButton);

      //ASSERT
      expect(handleSave).toHaveBeenCalledTimes(1);
      expect(handleSave).toHaveBeenCalledWith("f1", "p1", "E1", "Economy");
      expect(toast.error).not.toHaveBeenCalled();
    });

    it("should show a not found toast and not call handleSave when the passenger is not in the list", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleSave = vi.fn();
      render(
        <TicketFormModal
          handleSave={handleSave}
          handleClose={vi.fn()}
          flightNumber="SKYOPS-105"
          passportNumber="XX000000"
        />,
      );
      const selects = screen.getAllByTestId("form-input-select");
      const bookButton = screen.getAllByTestId("button")[1];
      await screen.findByText("Economy (3 free)");
      await user.selectOptions(selects[2], "Economy");
      await user.selectOptions(selects[3], "E1");

      //ACT
      await user.click(bookButton);

      //ASSERT
      expect(toast.error).toHaveBeenCalledWith("Flight or passenger not found");
      expect(handleSave).not.toHaveBeenCalled();
    });
  });

  describe("failures", () => {
    it("should show an error toast with the backend message when the flights cannot be loaded", async () => {
      //ARRANGE
      vi.mocked(getFlights).mockRejectedValue(
        new Error("Server not reachable"),
      );

      //ACT
      render(<TicketFormModal handleSave={vi.fn()} handleClose={vi.fn()} />);

      //ASSERT
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Server not reachable");
      });
      expect(toast.error).toHaveBeenCalledTimes(1);
    });

    it("should show an error toast with the backend message when the free seats cannot be loaded", async () => {
      //ARRANGE
      vi.mocked(getFreeSeats).mockRejectedValue(new Error("Flight not found"));

      //ACT
      render(
        <TicketFormModal
          handleSave={vi.fn()}
          handleClose={vi.fn()}
          flightNumber="SKYOPS-105"
        />,
      );

      //ASSERT
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Flight not found");
      });
      expect(toast.error).toHaveBeenCalledTimes(1);
    });
  });
});

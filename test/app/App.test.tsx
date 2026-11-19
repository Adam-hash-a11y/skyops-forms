import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import i18n from "i18next";
import "@testing-library/jest-dom/vitest";
import { toast } from "react-toastify";
import { App } from "../../src/app/App";
import { loginToApi } from "../../src/service/axios";
import { getFlight, getFlights } from "../../src/service/flightService";
import {
  getPassenger,
  getPassengers,
} from "../../src/service/passengerService";
import {
  getTickets,
  getTicketsByFlight,
  getTicketsByPassenger,
} from "../../src/service/ticketService";
import { FlightStatus } from "../../src/types/flightTypes";
import { TicketClass, TicketStatus } from "../../src/types/ticketTypes";

vi.mock("../../src/service/axios");
vi.mock("../../src/service/flightService");
vi.mock("../../src/service/passengerService");
vi.mock("../../src/service/ticketService");
vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock(
  "../../src/components/shared/styledToastContainer/StyledToastContainer",
  () => ({ StyledToastContainer: () => null }),
);

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
];

const renderAppAt = (path: string) => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
};

describe("App", () => {
  beforeEach(() => {
    vi.mocked(loginToApi).mockResolvedValue(undefined);
    vi.mocked(getFlights).mockResolvedValue(flights);
    vi.mocked(getFlight).mockResolvedValue(flights[0]);
    vi.mocked(getPassengers).mockResolvedValue(passengers);
    vi.mocked(getTickets).mockResolvedValue(tickets);
    vi.mocked(getTicketsByFlight).mockResolvedValue(tickets);
    vi.mocked(getPassenger).mockResolvedValue(passengers[0]);
    vi.mocked(getTicketsByPassenger).mockResolvedValue(tickets);
  });

  afterEach(async () => {
    cleanup();
    await i18n.changeLanguage("en");
  });

  describe("login", () => {
    it("should show Connecting and no header while the login is not finished", () => {
      //ARRANGE
      vi.mocked(loginToApi).mockReturnValue(new Promise<void>(() => {}));

      //ACT
      renderAppAt("/flights");

      //ASSERT
      expect(screen.getByTestId("app-connecting")).toHaveTextContent(
        "Connecting...",
      );
      expect(
        screen.queryByTestId("header-link-flights"),
      ).not.toBeInTheDocument();
      expect(getFlights).not.toHaveBeenCalled();
    });

    it("should show the app with the header and the flights once the login works", async () => {
      //ARRANGE
      renderAppAt("/flights");

      //ACT
      const cards = await screen.findAllByTestId("flight-card");

      //ASSERT
      expect(loginToApi).toHaveBeenCalledTimes(1);
      expect(cards).toHaveLength(2);
      expect(screen.queryByTestId("app-connecting")).not.toBeInTheDocument();
      expect(screen.getByTestId("header-link-flights")).toHaveClass("active");
    });

    it("should show the backend message and stay on Connecting when the login fails", async () => {
      //ARRANGE
      vi.mocked(loginToApi).mockRejectedValue(
        new Error("Server not reachable"),
      );

      //ACT
      renderAppAt("/flights");

      //ASSERT
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Server not reachable");
      });
      expect(screen.getByTestId("app-connecting")).toBeInTheDocument();
      expect(
        screen.queryByTestId("header-link-flights"),
      ).not.toBeInTheDocument();
      expect(getFlights).not.toHaveBeenCalled();
    });
  });

  describe("routes", () => {
    it("should show the flights page on the root address", async () => {
      //ARRANGE
      renderAppAt("/");

      //ACT
      const cards = await screen.findAllByTestId("flight-card");

      //ASSERT
      expect(cards).toHaveLength(2);
    });

    it("should show the passengers page on /passengers and highlight Passengers", async () => {
      //ARRANGE
      renderAppAt("/passengers");

      //ACT
      const cards = await screen.findAllByTestId("passenger-card");

      //ASSERT
      expect(cards).toHaveLength(2);
      expect(screen.getByTestId("header-link-passengers")).toHaveClass(
        "active",
      );
      expect(screen.getByTestId("header-link-flights")).not.toHaveClass(
        "active",
      );
    });

    it("should show the tickets page on /tickets and highlight Tickets", async () => {
      //ARRANGE
      renderAppAt("/tickets");

      //ACT
      const cards = await screen.findAllByTestId("ticket-card");

      //ASSERT
      expect(cards).toHaveLength(1);
      expect(screen.getByTestId("header-link-tickets")).toHaveClass("active");
    });

    it("should show the 404 page inside the layout on an unknown address", async () => {
      //ARRANGE
      renderAppAt("/nowhere");

      //ACT
      const title = await screen.findByTestId("not-found-title");

      //ASSERT
      expect(title).toHaveTextContent("404 - Page Not Found");
      expect(screen.getByTestId("header-link-flights")).toBeInTheDocument();
    });
  });

  describe("navigation", () => {
    it("should switch from flights to passengers and then to tickets when the user clicks the header links", async () => {
      //ARRANGE
      const user = userEvent.setup();
      renderAppAt("/flights");
      await screen.findAllByTestId("flight-card");

      //ACT
      await user.click(screen.getByTestId("header-link-passengers"));

      //ASSERT
      expect(await screen.findAllByTestId("passenger-card")).toHaveLength(2);
      expect(screen.queryAllByTestId("flight-card")).toHaveLength(0);

      //ACT
      await user.click(screen.getByTestId("header-link-tickets"));

      //ASSERT
      expect(await screen.findAllByTestId("ticket-card")).toHaveLength(1);
      expect(screen.queryAllByTestId("passenger-card")).toHaveLength(0);
    });

    it("should open the flight details page when the user clicks View details on a flight", async () => {
      //ARRANGE
      const user = userEvent.setup();
      renderAppAt("/flights");
      const links = await screen.findAllByTestId("flight-card-details-link");

      //ACT
      await user.click(links[0]);

      //ASSERT
      expect(
        await screen.findByTestId("flight-details-title"),
      ).toHaveTextContent("SKYOPS-105");
      expect(getFlight).toHaveBeenCalledWith("SKYOPS-105");
    });

    it("should open the passenger details page with the tickets of that passenger when the user clicks View tickets", async () => {
      //ARRANGE
      const user = userEvent.setup();
      renderAppAt("/passengers");
      const links = await screen.findAllByTestId("passenger-card-tickets-link");

      //ACT
      await user.click(links[0]);

      //ASSERT
      expect(
        await screen.findByTestId("passenger-details-title"),
      ).toHaveTextContent("Lena Banks");
      expect(await screen.findAllByTestId("ticket-card")).toHaveLength(1);
      expect(getPassenger).toHaveBeenCalledWith("DE7731902");
      expect(getTicketsByPassenger).toHaveBeenCalledWith("p1");
    });

    it("should go back to the flights list when the user clicks the back link on the flight details page", async () => {
      //ARRANGE
      const user = userEvent.setup();
      renderAppAt("/flights/SKYOPS-105");
      const backLink = await screen.findByTestId("flight-details-back-link");

      //ACT
      await user.click(backLink);

      //ASSERT
      expect(await screen.findAllByTestId("flight-card")).toHaveLength(2);
    });
  });

  describe("language", () => {
    it("should switch the header texts to French when the user chooses FR", async () => {
      //ARRANGE
      const user = userEvent.setup();
      renderAppAt("/flights");
      await screen.findAllByTestId("flight-card");
      await user.click(screen.getByTestId("header-language-button"));

      //ACT
      await user.click(screen.getAllByTestId("header-language-option")[1]);

      //ASSERT
      await waitFor(() => {
        expect(screen.getByTestId("header-link-flights")).toHaveTextContent(
          "Vols",
        );
      });
      expect(screen.getByTestId("header-link-passengers")).toHaveTextContent(
        "Passagers",
      );
      expect(screen.getByTestId("flights-subtitle")).toHaveTextContent(
        "2 vols",
      );
    });

    it("should switch the header texts and the page subtitle to German when the user chooses DE", async () => {
      //ARRANGE
      const user = userEvent.setup();
      renderAppAt("/flights");
      await screen.findAllByTestId("flight-card");
      await user.click(screen.getByTestId("header-language-button"));

      //ACT
      await user.click(screen.getAllByTestId("header-language-option")[2]);

      //ASSERT
      await waitFor(() => {
        expect(screen.getByTestId("header-link-flights")).toHaveTextContent(
          "Flüge",
        );
      });
      expect(screen.getByTestId("header-link-passengers")).toHaveTextContent(
        "Passagiere",
      );
      expect(screen.getByTestId("flights-subtitle")).toHaveTextContent(
        "2 Flüge",
      );
    });
  });
});

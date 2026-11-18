import { render, screen } from "@testing-library/react";
import { describe, expect, vi, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";
import { FligthCard } from "../../src/components/flightCard/FlightCard";
import { FlightStatus } from "../../src/types/flightTypes";

const flightProps = {
  flightNumber: "SKYOPS-105",
  airline: "SkyAir",
  status: FlightStatus.SCHEDULED,
  origin: "TUN",
  destination: "FRA",
  departureTime: "2026-03-05T08:15:00Z",
  departureDate: "2026-03-05T08:15:00Z",
  arrivalTime: "2026-03-05T11:45:00Z",
  arrivalDate: "2026-03-05T11:45:00Z",
  bookedSeats: 12,
  totalSeats: 100,
  bookDisabled: false,
};

describe("FlightCard", () => {
  describe("rendering", () => {
    it("should show the airline, the flight number, the status, the route, the times and the dates", () => {
      //ARRANGE
      render(
        <MemoryRouter>
          <FligthCard {...flightProps} />
        </MemoryRouter>,
      );

      //ACT
      const card = screen.getByTestId("flight-card");

      //ASSERT
      expect(card).toHaveTextContent("SkyAir");
      expect(card).toHaveTextContent("SKYOPS-105");
      expect(card).toHaveTextContent("Scheduled");
      expect(card).toHaveTextContent("TUN");
      expect(card).toHaveTextContent("Tunis");
      expect(card).toHaveTextContent("FRA");
      expect(card).toHaveTextContent("Frankfurt");
      expect(card).toHaveTextContent("08:15 UTC");
      expect(card).toHaveTextContent("11:45 UTC");
      expect(card).toHaveTextContent("05 Mar 2026");
    });

    it("should show how many seats are booked out of the total", () => {
      //ARRANGE
      render(
        <MemoryRouter>
          <FligthCard {...flightProps} />
        </MemoryRouter>,
      );

      //ACT
      const card = screen.getByTestId("flight-card");

      //ASSERT
      expect(card).toHaveTextContent("Seats booked");
      expect(card).toHaveTextContent("12 / 100");
    });

    it("should link View details to the details page of the flight", () => {
      //ARRANGE
      render(
        <MemoryRouter>
          <FligthCard {...flightProps} />
        </MemoryRouter>,
      );

      //ACT
      const link = screen.getByTestId("flight-card-details-link");

      //ASSERT
      expect(link).toHaveTextContent("View details");
      expect(link).toHaveAttribute("href", "/flights/SKYOPS-105");
    });
  });

  describe("user interactions", () => {
    it("should call handleBook once when the user clicks Book", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleBook = vi.fn();
      render(
        <MemoryRouter>
          <FligthCard {...flightProps} handleBook={handleBook} />
        </MemoryRouter>,
      );

      //ACT
      await user.click(screen.getByTestId("button"));

      //ASSERT
      expect(handleBook).toHaveBeenCalledTimes(1);
    });

    it("should call only handleEdit when the user clicks the edit icon", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleEdit = vi.fn();
      const handleDelete = vi.fn();
      render(
        <MemoryRouter>
          <FligthCard
            {...flightProps}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </MemoryRouter>,
      );

      //ACT
      await user.click(screen.getAllByTestId("icon-button")[0]);

      //ASSERT
      expect(handleEdit).toHaveBeenCalledTimes(1);
      expect(handleDelete).not.toHaveBeenCalled();
    });

    it("should call only handleDelete when the user clicks the delete icon", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleEdit = vi.fn();
      const handleDelete = vi.fn();
      render(
        <MemoryRouter>
          <FligthCard
            {...flightProps}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </MemoryRouter>,
      );

      //ACT
      await user.click(screen.getAllByTestId("icon-button")[1]);

      //ASSERT
      expect(handleDelete).toHaveBeenCalledTimes(1);
      expect(handleEdit).not.toHaveBeenCalled();
    });
  });

  describe("disabled", () => {
    it("should not let the user book when bookDisabled is true", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleBook = vi.fn();
      render(
        <MemoryRouter>
          <FligthCard
            {...flightProps}
            bookDisabled={true}
            handleBook={handleBook}
          />
        </MemoryRouter>,
      );
      const button = screen.getByTestId("button");

      //ACT
      await user.click(button);

      //ASSERT
      expect(button).toBeDisabled();
      expect(handleBook).not.toHaveBeenCalled();
    });
  });
});

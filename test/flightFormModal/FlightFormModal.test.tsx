// test/flightFormModal/FlightFormModal.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { FlightFormModal } from "../../src/components/shared/flightFormModal/FlightFormModal";
import { FlightStatus } from "../../src/types/flightTypes";

const flight = {
  id: "f1",
  flightNumber: "SKYOPS-105",
  airline: "SkyOps Air",
  origin: "TUN",
  destination: "FRA",
  departureTime: "2026-06-01T08:00:00Z",
  arrivalTime: "2026-06-01T10:00:00Z",
  status: FlightStatus.DELAYED,
  totalSeats: 150,
  bookedSeats: 10,
};

describe("FlightFormModal", () => {
  describe("rendering", () => {
    it("should open a new flight form with Create flight disabled and the 3 seat fields shown", () => {
      //ARRANGE
      render(<FlightFormModal handleSave={vi.fn()} handleClose={vi.fn()} />);

      //ACT
      const title = screen.getByTestId("flight-form-modal-title");
      const createButton = screen.getAllByTestId("button")[1];
      const inputs = screen.getAllByTestId("form-input-input");

      //ASSERT
      expect(title).toHaveTextContent("New flight");
      expect(createButton).toHaveTextContent("Create flight");
      expect(createButton).toBeDisabled();
      expect(inputs).toHaveLength(9);
    });

    it("should open the edit form with all fields prefilled, Save changes enabled and no seat fields", () => {
      //ARRANGE
      render(
        <FlightFormModal
          handleSave={vi.fn()}
          handleClose={vi.fn()}
          flight={flight}
        />,
      );

      //ACT
      const title = screen.getByTestId("flight-form-modal-title");
      const saveButton = screen.getAllByTestId("button")[1];
      const inputs = screen.getAllByTestId("form-input-input");
      const statusSelect = screen.getByTestId("form-input-select");

      //ASSERT
      expect(title).toHaveTextContent("Edit flight");
      expect(saveButton).toHaveTextContent("Save changes");
      expect(saveButton).toBeEnabled();
      expect(inputs).toHaveLength(6);
      expect(inputs[0]).toHaveValue("SKYOPS-105");
      expect(inputs[1]).toHaveValue("SkyOps Air");
      expect(inputs[2]).toHaveValue("TUN");
      expect(inputs[3]).toHaveValue("FRA");
      expect(inputs[4]).toHaveValue("2026-06-01T08:00");
      expect(inputs[5]).toHaveValue("2026-06-01T10:00");
      expect(statusSelect).toHaveValue("Delayed");
    });

    it("should lock the flight number in edit mode and keep the airline editable", () => {
      //ARRANGE
      render(
        <FlightFormModal
          handleSave={vi.fn()}
          handleClose={vi.fn()}
          flight={flight}
        />,
      );

      //ACT
      const inputs = screen.getAllByTestId("form-input-input");

      //ASSERT
      expect(inputs[0]).toBeDisabled();
      expect(inputs[1]).toBeEnabled();
    });

    it("should offer the 4 flight statuses in the status select", () => {
      //ARRANGE
      render(<FlightFormModal handleSave={vi.fn()} handleClose={vi.fn()} />);

      //ACT
      const statusSelect = screen.getByTestId("form-input-select");

      //ASSERT
      expect(statusSelect).toHaveValue("Scheduled");
      expect(statusSelect).toHaveTextContent("Scheduled");
      expect(statusSelect).toHaveTextContent("Delayed");
      expect(statusSelect).toHaveTextContent("Cancelled");
      expect(statusSelect).toHaveTextContent("Landed");
    });
  });

  describe("validation", () => {
    it("should show the airline error only after the user leaves the field", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<FlightFormModal handleSave={vi.fn()} handleClose={vi.fn()} />);
      const airline = screen.getAllByTestId("form-input-input")[1];

      //ACT
      await user.type(airline, "Sky");

      //ASSERT
      expect(screen.queryByTestId("form-input-error")).not.toBeInTheDocument();

      //ACT
      await user.tab();

      //ASSERT
      expect(screen.getByTestId("form-input-error")).toHaveTextContent(
        "Airline must be at least 5 characters",
      );
    });

    it("should show the origin error after blur when the code is not 3 uppercase letters", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<FlightFormModal handleSave={vi.fn()} handleClose={vi.fn()} />);
      const origin = screen.getAllByTestId("form-input-input")[2];

      //ACT
      await user.type(origin, "tun");
      await user.tab();

      //ASSERT
      expect(screen.getByTestId("form-input-error")).toHaveTextContent(
        "Origin must be 3 uppercase letters",
      );
    });

    it("should show the same-airport error on origin when the destination is the same", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<FlightFormModal handleSave={vi.fn()} handleClose={vi.fn()} />);
      const inputs = screen.getAllByTestId("form-input-input");
      await user.type(inputs[2], "TUN");
      await user.tab();

      //ACT
      await user.type(inputs[3], "TUN");

      //ASSERT
      expect(screen.getByTestId("form-input-error")).toHaveTextContent(
        "Origin and destination can't be the same",
      );
    });

    it("should show the time order error on departure when departure is after arrival", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<FlightFormModal handleSave={vi.fn()} handleClose={vi.fn()} />);
      const inputs = screen.getAllByTestId("form-input-input");
      await user.type(inputs[4], "2026-06-01T12:00");
      await user.tab();

      //ACT
      await user.type(inputs[5], "2026-06-01T10:00");

      //ASSERT
      expect(screen.getByTestId("form-input-error")).toHaveTextContent(
        "Departure time must be before arrival time",
      );
    });

    it("should show the no-seat error on a touched seat field when all seats are zero", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<FlightFormModal handleSave={vi.fn()} handleClose={vi.fn()} />);
      const inputs = screen.getAllByTestId("form-input-input");
      await user.click(inputs[6]);
      await user.tab();

      //ACT
      await user.clear(inputs[7]);

      //ASSERT
      expect(screen.getByTestId("form-input-error")).toHaveTextContent(
        "A flight needs at least one seat",
      );
    });
  });

  describe("submit", () => {
    it("should enable Create flight when the form is valid and disable it again when a field breaks", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<FlightFormModal handleSave={vi.fn()} handleClose={vi.fn()} />);
      const inputs = screen.getAllByTestId("form-input-input");
      const createButton = screen.getAllByTestId("button")[1];

      //ACT
      await user.type(inputs[0], "SKYOPS-105");
      await user.type(inputs[1], "SkyOps Air");
      await user.type(inputs[2], "TUN");
      await user.type(inputs[3], "FRA");
      await user.type(inputs[4], "2026-06-01T08:00");
      await user.type(inputs[5], "2026-06-01T10:00");
      await user.clear(inputs[6]);
      await user.type(inputs[6], "10");

      //ASSERT
      expect(createButton).toBeEnabled();

      //ACT
      await user.clear(inputs[1]);

      //ASSERT
      expect(createButton).toBeDisabled();
    });

    it("should call handleSave once with the 10 values in the right order", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleSave = vi.fn();
      render(<FlightFormModal handleSave={handleSave} handleClose={vi.fn()} />);
      const inputs = screen.getAllByTestId("form-input-input");
      const createButton = screen.getAllByTestId("button")[1];
      await user.type(inputs[0], "SKYOPS-105");
      await user.type(inputs[1], "SkyOps Air");
      await user.type(inputs[2], "TUN");
      await user.type(inputs[3], "FRA");
      await user.type(inputs[4], "2026-06-01T08:00");
      await user.type(inputs[5], "2026-06-01T10:00");
      await user.clear(inputs[6]);
      await user.type(inputs[6], "10");
      await user.clear(inputs[7]);
      await user.type(inputs[7], "20");
      await user.clear(inputs[8]);
      await user.type(inputs[8], "120");

      //ACT
      await user.click(createButton);

      //ASSERT
      expect(handleSave).toHaveBeenCalledTimes(1);
      expect(handleSave).toHaveBeenCalledWith(
        "SKYOPS-105",
        "SkyOps Air",
        "TUN",
        "FRA",
        "2026-06-01T08:00",
        "2026-06-01T10:00",
        "Scheduled",
        "10",
        "20",
        "120",
      );
    });

    it("should send the prefilled values when the user saves an edited flight", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleSave = vi.fn();
      render(
        <FlightFormModal
          handleSave={handleSave}
          handleClose={vi.fn()}
          flight={flight}
        />,
      );
      const saveButton = screen.getAllByTestId("button")[1];

      //ACT
      await user.click(saveButton);

      //ASSERT
      expect(handleSave).toHaveBeenCalledTimes(1);
      expect(handleSave).toHaveBeenCalledWith(
        "SKYOPS-105",
        "SkyOps Air",
        "TUN",
        "FRA",
        "2026-06-01T08:00",
        "2026-06-01T10:00",
        "Delayed",
        "0",
        "0",
        "0",
      );
    });

    it("should not call handleSave when Create flight is disabled", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleSave = vi.fn();
      render(<FlightFormModal handleSave={handleSave} handleClose={vi.fn()} />);
      const createButton = screen.getAllByTestId("button")[1];

      //ACT
      await user.click(createButton);

      //ASSERT
      expect(handleSave).not.toHaveBeenCalled();
    });
  });

  describe("closing", () => {
    it("should call handleClose once when the user clicks Cancel", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleClose = vi.fn();
      render(
        <FlightFormModal handleSave={vi.fn()} handleClose={handleClose} />,
      );
      const cancelButton = screen.getAllByTestId("button")[0];

      //ACT
      await user.click(cancelButton);

      //ASSERT
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("should call handleClose once when the user clicks the X icon", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleClose = vi.fn();
      render(
        <FlightFormModal handleSave={vi.fn()} handleClose={handleClose} />,
      );
      const closeIcon = screen.getByTestId("icon-button");

      //ACT
      await user.click(closeIcon);

      //ASSERT
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
});

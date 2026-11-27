import { render, screen } from "@testing-library/react";
import { describe, expect, vi, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";
import { PassengerCard } from "../../src/components/passengerCard/PassengerCard";

const passengerProps = {
  firstName: "Lena",
  lastName: "Fischer",
  passportNumber: "C1234567",
  nationality: "German",
  dateOfBirth: "1990-05-14",
  email: "lena.fischer@example.com",
  phoneNumber: "+4915112345678",
};

describe("PassengerCard", () => {
  describe("rendering", () => {
    it("should show the name, the initials, the passport, the nationality, the birth date, the email and the phone", () => {
      //ARRANGE
      render(
        <MemoryRouter>
          <PassengerCard {...passengerProps} />
        </MemoryRouter>,
      );

      //ACT
      const card = screen.getByTestId("passenger-card");

      //ASSERT
      expect(card).toHaveTextContent("LF");
      expect(card).toHaveTextContent("Lena Fischer");
      expect(card).toHaveTextContent("C1234567");
      expect(card).toHaveTextContent("German");
      expect(card).toHaveTextContent("14 May 1990");
      expect(card).toHaveTextContent("lena.fischer@example.com");
      expect(card).toHaveTextContent("+4915112345678");
    });

    it("should link View tickets to the details page of the passenger", () => {
      //ARRANGE
      render(
        <MemoryRouter>
          <PassengerCard {...passengerProps} />
        </MemoryRouter>,
      );

      //ACT
      const link = screen.getByTestId("passenger-card-tickets-link");

      //ASSERT
      expect(link).toHaveTextContent("View tickets");
      expect(link).toHaveAttribute("href", "/passengers/C1234567");
    });
  });

  describe("user interactions", () => {
    it("should call handleBook once when the user clicks Book", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleBook = vi.fn();
      render(
        <MemoryRouter>
          <PassengerCard {...passengerProps} handleBook={handleBook} />
        </MemoryRouter>,
      );
      const button = screen.getByTestId("button");

      //ACT
      await user.click(button);

      //ASSERT
      expect(button).toBeEnabled();
      expect(handleBook).toHaveBeenCalledTimes(1);
    });

    it("should call only handleEdit when the user clicks the edit icon", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleEdit = vi.fn();
      const handleDelete = vi.fn();
      render(
        <MemoryRouter>
          <PassengerCard
            {...passengerProps}
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
          <PassengerCard
            {...passengerProps}
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
});

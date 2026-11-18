import { render, screen, within } from "@testing-library/react";
import { describe, expect, vi, it } from "vitest";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { PassengerFilters } from "../../src/components/passengerFilters/PassengerFilters";

const handleInputChange = vi.fn();
const handleSelectChange = vi.fn();
const handleReset = vi.fn();
const handleSearch = vi.fn();

const filterProps = {
  firstName: "",
  lastName: "",
  nationality: "",
  sortBy: "",
  handleInputChange,
  handleSelectChange,
  handleReset,
  handleSearch,
};

describe("PassengerFilters", () => {
  describe("rendering", () => {
    it("should offer All and the 9 nationalities in the nationality select", () => {
      //ARRANGE
      render(<PassengerFilters {...filterProps} />);

      //ACT
      const nationalitySelect = screen.getAllByTestId("form-input-select")[0];

      //ASSERT
      expect(within(nationalitySelect).getAllByRole("option")).toHaveLength(10);
      expect(nationalitySelect).toHaveTextContent("All");
      expect(nationalitySelect).toHaveTextContent("Tunisian");
      expect(nationalitySelect).toHaveTextContent("Moroccan");
    });

    it("should show the first name, the last name and the nationality it is given", () => {
      //ARRANGE
      render(
        <PassengerFilters
          {...filterProps}
          firstName="Lena"
          lastName="Fischer"
          nationality="DE"
        />,
      );

      //ACT
      const inputs = screen.getAllByTestId("form-input-input");
      const nationalitySelect = screen.getAllByTestId("form-input-select")[0];

      //ASSERT
      expect(inputs[0]).toHaveValue("Lena");
      expect(inputs[1]).toHaveValue("Fischer");
      expect(nationalitySelect).toHaveValue("DE");
    });
  });

  describe("user interactions", () => {
    it("should call handleInputChange once per character when the user types a first name", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<PassengerFilters {...filterProps} />);
      const firstNameInput = screen.getAllByTestId("form-input-input")[0];

      //ACT
      await user.type(firstNameInput, "Lena");

      //ASSERT
      expect(handleInputChange).toHaveBeenCalledTimes(4);
    });

    it("should call handleSelectChange once when the user chooses a nationality", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<PassengerFilters {...filterProps} />);
      const nationalitySelect = screen.getAllByTestId("form-input-select")[0];

      //ACT
      await user.selectOptions(nationalitySelect, "FR");

      //ASSERT
      expect(handleSelectChange).toHaveBeenCalledTimes(1);
    });

    it("should call handleSearch when the user clicks Search and handleReset when the user clicks Reset filters", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<PassengerFilters {...filterProps} />);
      const buttons = screen.getAllByTestId("button");

      //ACT
      await user.click(buttons[0]);

      //ASSERT
      expect(handleSearch).toHaveBeenCalledTimes(1);
      expect(handleReset).not.toHaveBeenCalled();

      //ACT
      await user.click(buttons[1]);

      //ASSERT
      expect(handleReset).toHaveBeenCalledTimes(1);
      expect(handleSearch).toHaveBeenCalledTimes(1);
    });
  });
});

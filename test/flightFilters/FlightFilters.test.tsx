import { render, screen, within } from "@testing-library/react";
import { describe, expect, vi, it } from "vitest";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { FlightFilters } from "../../src/components/flightFilters/FlightFilters";
import { FlightStatus } from "../../src/types/flightTypes";

const handleInputChange = vi.fn();
const handleSelectChange = vi.fn();
const handleReset = vi.fn();
const handleSearch = vi.fn();

const filterProps = {
  status: "" as const,
  origin: "",
  destination: "",
  sortBy: "",
  searchDisabled: false,
  handleInputChange,
  handleSelectChange,
  handleReset,
  handleSearch,
};

describe("FlightFilters", () => {
  describe("rendering", () => {
    it("should offer All statuses and the 4 flight statuses in the status select", () => {
      //ARRANGE
      render(<FlightFilters {...filterProps} />);

      //ACT
      const statusSelect = screen.getAllByTestId("form-input-select")[0];

      //ASSERT
      expect(within(statusSelect).getAllByRole("option")).toHaveLength(5);
      expect(statusSelect).toHaveTextContent("All statuses");
      expect(statusSelect).toHaveTextContent("Scheduled");
      expect(statusSelect).toHaveTextContent("Delayed");
      expect(statusSelect).toHaveTextContent("Cancelled");
      expect(statusSelect).toHaveTextContent("Landed");
    });

    it("should show the status, the origin and the destination it is given", () => {
      //ARRANGE
      render(
        <FlightFilters
          {...filterProps}
          status={FlightStatus.DELAYED}
          origin="TUN"
          destination="FRA"
        />,
      );

      //ACT
      const statusSelect = screen.getAllByTestId("form-input-select")[0];
      const inputs = screen.getAllByTestId("form-input-input");

      //ASSERT
      expect(statusSelect).toHaveValue("Delayed");
      expect(inputs[0]).toHaveValue("TUN");
      expect(inputs[1]).toHaveValue("FRA");
    });
  });

  describe("user interactions", () => {
    it("should call handleInputChange once per character when the user types an origin", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<FlightFilters {...filterProps} />);
      const originInput = screen.getAllByTestId("form-input-input")[0];

      //ACT
      await user.type(originInput, "TUN");

      //ASSERT
      expect(handleInputChange).toHaveBeenCalledTimes(3);
    });

    it("should call handleSelectChange once when the user chooses a status", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<FlightFilters {...filterProps} />);
      const statusSelect = screen.getAllByTestId("form-input-select")[0];

      //ACT
      await user.selectOptions(statusSelect, "Delayed");

      //ASSERT
      expect(handleSelectChange).toHaveBeenCalledTimes(1);
    });

    it("should call handleSearch when the user clicks Search and handleReset when the user clicks Reset filters", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<FlightFilters {...filterProps} />);
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

  describe("disabled", () => {
    it("should not let the user search when searchDisabled is true", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<FlightFilters {...filterProps} searchDisabled={true} />);
      const searchButton = screen.getAllByTestId("button")[0];

      //ACT
      await user.click(searchButton);

      //ASSERT
      expect(searchButton).toBeDisabled();
      expect(handleSearch).not.toHaveBeenCalled();
    });
  });
});

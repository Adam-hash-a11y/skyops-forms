import { render, screen } from "@testing-library/react";
import { describe, expect, vi, it } from "vitest";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { TicketFilters } from "../../src/components/ticketFilters/TicketFilters";

const handleSelectChange = vi.fn();
const handleReset = vi.fn();
const handleSearch = vi.fn();

const filterProps = {
  filterBy: "",
  filterValue: "",
  filterValueOptions: [
    { value: "", label: "Select..." },
    { value: "SKYOPS-105", label: "SKYOPS-105" },
    { value: "SKYOPS-106", label: "SKYOPS-106" },
  ],
  handleSelectChange,
  handleReset,
  handleSearch,
};

describe("TicketFilters", () => {
  describe("rendering", () => {
    it("should show only the Filter by select when no filter is chosen", () => {
      //ARRANGE
      render(<TicketFilters {...filterProps} />);

      //ACT
      const selects = screen.getAllByTestId("form-input-select");

      //ASSERT
      expect(selects).toHaveLength(1);
      expect(screen.getByTestId("form-input-label")).toHaveTextContent(
        "Filter by",
      );
    });

    it("should show a Flight select with the given options when filtering by flight", () => {
      //ARRANGE
      render(<TicketFilters {...filterProps} filterBy="flight" />);

      //ACT
      const selects = screen.getAllByTestId("form-input-select");
      const labels = screen.getAllByTestId("form-input-label");

      //ASSERT
      expect(selects).toHaveLength(2);
      expect(labels[1]).toHaveTextContent("Flight");
      expect(selects[1]).toHaveTextContent("SKYOPS-105");
      expect(selects[1]).toHaveTextContent("SKYOPS-106");
    });

    it("should label the second select Passenger when filtering by passenger", () => {
      //ARRANGE
      render(<TicketFilters {...filterProps} filterBy="passenger" />);

      //ACT
      const labels = screen.getAllByTestId("form-input-label");

      //ASSERT
      expect(labels[1]).toHaveTextContent("Passenger");
    });
  });

  describe("user interactions", () => {
    it("should call handleSelectChange once when the user chooses Flight in Filter by", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<TicketFilters {...filterProps} />);
      const filterBySelect = screen.getAllByTestId("form-input-select")[0];

      //ACT
      await user.selectOptions(filterBySelect, "flight");

      //ASSERT
      expect(handleSelectChange).toHaveBeenCalledTimes(1);
    });

    it("should call handleSelectChange once when the user chooses a flight in the second select", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<TicketFilters {...filterProps} filterBy="flight" />);
      const valueSelect = screen.getAllByTestId("form-input-select")[1];

      //ACT
      await user.selectOptions(valueSelect, "SKYOPS-105");

      //ASSERT
      expect(handleSelectChange).toHaveBeenCalledTimes(1);
    });

    it("should call handleSearch when the user clicks Search and handleReset when the user clicks Reset filters", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<TicketFilters {...filterProps} />);
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

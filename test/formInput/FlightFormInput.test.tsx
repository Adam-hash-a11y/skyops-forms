import { render, screen } from "@testing-library/react";
import { describe, expect, vi, it } from "vitest";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { FormInput } from "../../src/components/shared/formInput/FlightFormInput";
import { FormType } from "../../src/components/shared/flightFormModal/types";
import { FlightStatus } from "../../src/types/flightTypes";

const statusOptions = [
  { value: FlightStatus.SCHEDULED, label: "Scheduled" },
  { value: FlightStatus.DELAYED, label: "Delayed" },
  { value: FlightStatus.CANCELLED, label: "Cancelled" },
  { value: FlightStatus.LANDED, label: "Landed" },
];

describe("FormInput", () => {
  describe("rendering", () => {
    it("should render the wrapper, the label, the input and the hint together", () => {
      //ARRANGE
      render(
        <FormInput
          name="flightNumber"
          type={FormType.TEXT}
          label="Flight number"
          id="FlightNumberInput"
          hint="Must start with SKYOPS-"
        />,
      );

      //ACT
      const field = screen.getByTestId("form-input");
      const label = screen.getByTestId("form-input-label");
      const input = screen.getByTestId("form-input-input");
      const hint = screen.getByTestId("form-input-hint");

      //ASSERT
      expect(field).toContainElement(label);
      expect(field).toContainElement(input);
      expect(label).toHaveTextContent("Flight number");
      expect(hint).toHaveTextContent("Must start with SKYOPS-");
    });

    it("should give the text input its placeholder, id and name", () => {
      //ARRANGE
      render(
        <FormInput
          name="flightNumber"
          type={FormType.TEXT}
          label="Flight number"
          id="FlightNumberInput"
          placeholder="SKYOPS-10042"
        />,
      );

      //ACT
      const input = screen.getByTestId("form-input-input");

      //ASSERT
      expect(input).toHaveAttribute("type", "text");
      expect(input).toHaveAttribute("placeholder", "SKYOPS-10042");
      expect(input).toHaveAttribute("id", "FlightNumberInput");
      expect(input).toHaveAttribute("name", "flightNumber");
    });

    it("should render a select with the 4 status options and the selected value, and no input", () => {
      //ARRANGE
      render(
        <FormInput
          name="status"
          type={FormType.SELECT}
          label="Status"
          id="StatusInput"
          value={FlightStatus.DELAYED}
          options={statusOptions}
          handleSelectChange={vi.fn()}
        />,
      );

      //ACT
      const select = screen.getByTestId("form-input-select");
      const input = screen.queryByTestId("form-input-input");

      //ASSERT
      expect(select).toHaveValue(FlightStatus.DELAYED);
      expect(screen.getAllByRole("option")).toHaveLength(4);
      expect(input).not.toBeInTheDocument();
    });

    it("should render the number and the datetime-local types, and no select", () => {
      //ARRANGE
      render(
        <>
          <FormInput
            name="economySeats"
            type={FormType.NUMBER}
            label="Economy seats"
            id="EconomySeatsInput"
          />
          <FormInput
            name="departureTime"
            type={FormType.DATE_TIME_LOCAL}
            label="Departure (UTC)"
            id="DepartureTimeInput"
          />
        </>,
      );

      //ACT
      const inputs = screen.getAllByTestId("form-input-input");
      const select = screen.queryByTestId("form-input-select");

      //ASSERT
      expect(inputs[0]).toHaveAttribute("type", "number");
      expect(inputs[1]).toHaveAttribute("type", "datetime-local");
      expect(select).not.toBeInTheDocument();
    });
  });

  describe("user interactions", () => {
    it("should call handleInputChange once per character and show the typed text", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleInputChange = vi.fn();
      render(
        <FormInput
          name="flightNumber"
          type={FormType.TEXT}
          label="Flight number"
          id="FlightNumberInput"
          handleInputChange={handleInputChange}
        />,
      );
      const input = screen.getByTestId("form-input-input");

      //ACT
      await user.type(input, "SKYOPS-10042");

      //ASSERT
      expect(handleInputChange).toHaveBeenCalledTimes(12);
      expect(input).toHaveValue("SKYOPS-10042");
    });

    it("should ignore letters typed in a number input", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleInputChange = vi.fn();
      render(
        <FormInput
          name="economySeats"
          type={FormType.NUMBER}
          label="Economy seats"
          id="EconomySeatsInput"
          handleInputChange={handleInputChange}
        />,
      );
      const input = screen.getByTestId("form-input-input");

      //ACT
      await user.type(input, "1a5b0");

      //ASSERT
      expect(input).toHaveValue(150);
      expect(handleInputChange).toHaveBeenCalledTimes(3);
    });

    it("should keep the last status when the user selects two statuses in a row", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleSelectChange = vi.fn();
      render(
        <FormInput
          name="status"
          type={FormType.SELECT}
          label="Status"
          id="StatusInput"
          options={statusOptions}
          handleSelectChange={handleSelectChange}
        />,
      );
      const select = screen.getByTestId("form-input-select");

      //ACT
      await user.selectOptions(select, "Delayed");
      await user.selectOptions(select, "Landed");

      //ASSERT
      expect(select).toHaveValue(FlightStatus.LANDED);
      expect(handleSelectChange).toHaveBeenCalledTimes(2);
    });

    it("should call handleInputBlur once and keep the value when the user leaves the input", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleInputBlur = vi.fn();
      render(
        <FormInput
          name="origin"
          type={FormType.TEXT}
          label="Origin"
          id="FlightOriginInput"
          handleInputBlur={handleInputBlur}
        />,
      );
      const input = screen.getByTestId("form-input-input");

      //ACT
      await user.type(input, "TUN");
      await user.tab();

      //ASSERT
      expect(handleInputBlur).toHaveBeenCalledTimes(1);
      expect(input).toHaveValue("TUN");
      expect(input).not.toHaveFocus();
    });

    it("should call handleSelectBlur once when the user leaves the select", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleSelectBlur = vi.fn();
      render(
        <FormInput
          name="status"
          type={FormType.SELECT}
          label="Status"
          id="StatusInput"
          options={statusOptions}
          handleSelectBlur={handleSelectBlur}
        />,
      );
      const select = screen.getByTestId("form-input-select");

      //ACT
      await user.click(select);
      await user.tab();

      //ASSERT
      expect(handleSelectBlur).toHaveBeenCalledTimes(1);
    });

    it("should focus the input when the user clicks the label", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(
        <FormInput
          name="flightNumber"
          type={FormType.TEXT}
          label="Flight number"
          id="FlightNumberInput"
        />,
      );
      const label = screen.getByTestId("form-input-label");
      const input = screen.getByTestId("form-input-input");

      //ACT
      await user.click(label);

      //ASSERT
      expect(input).toHaveFocus();
    });
  });

  describe("disabled", () => {
    it("should ignore typing and keep its value when the input is disabled", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleInputChange = vi.fn();
      render(
        <FormInput
          name="flightNumber"
          type={FormType.TEXT}
          label="Flight number"
          id="FlightNumberInput"
          value="SKYOPS-10042"
          handleInputChange={handleInputChange}
          disabled
        />,
      );
      const input = screen.getByTestId("form-input-input");

      //ACT
      await user.type(input, "999");

      //ASSERT
      expect(input).toBeDisabled();
      expect(input).toHaveValue("SKYOPS-10042");
      expect(handleInputChange).not.toHaveBeenCalled();
    });

    it("should ignore selection when the select is disabled", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleSelectChange = vi.fn();
      render(
        <FormInput
          name="status"
          type={FormType.SELECT}
          label="Status"
          id="StatusInput"
          options={statusOptions}
          handleSelectChange={handleSelectChange}
          disabled
        />,
      );
      const select = screen.getByTestId("form-input-select");

      //ACT
      await user.selectOptions(select, "Delayed");

      //ASSERT
      expect(select).toBeDisabled();
      expect(handleSelectChange).not.toHaveBeenCalled();
    });
  });

  describe("error and hint", () => {
    it("should show the error and hide the hint when the field is touched and has an error", () => {
      //ARRANGE
      render(
        <FormInput
          name="flightNumber"
          type={FormType.TEXT}
          label="Flight number"
          id="FlightNumberInput"
          hint="Must start with SKYOPS-"
          error="Flight number must start with SKYOPS-XXX"
          touched
        />,
      );

      //ACT
      const error = screen.getByTestId("form-input-error");
      const hint = screen.queryByTestId("form-input-hint");

      //ASSERT
      expect(error).toHaveTextContent(
        "Flight number must start with SKYOPS-XXX",
      );
      expect(hint).not.toBeInTheDocument();
    });

    it("should show the hint and no error when the field is not touched", () => {
      //ARRANGE
      render(
        <FormInput
          name="flightNumber"
          type={FormType.TEXT}
          label="Flight number"
          id="FlightNumberInput"
          hint="Must start with SKYOPS-"
          error="Flight number must start with SKYOPS-XXX"
        />,
      );

      //ACT
      const hint = screen.getByTestId("form-input-hint");
      const error = screen.queryByTestId("form-input-error");

      //ASSERT
      expect(hint).toBeInTheDocument();
      expect(error).not.toBeInTheDocument();
    });

    it("should show the hint and no error when the field is touched and valid", () => {
      //ARRANGE
      render(
        <FormInput
          name="flightNumber"
          type={FormType.TEXT}
          label="Flight number"
          id="FlightNumberInput"
          hint="Must start with SKYOPS-"
          touched
        />,
      );

      //ACT
      const hint = screen.getByTestId("form-input-hint");
      const error = screen.queryByTestId("form-input-error");

      //ASSERT
      expect(hint).toBeInTheDocument();
      expect(error).not.toBeInTheDocument();
    });
  });
});

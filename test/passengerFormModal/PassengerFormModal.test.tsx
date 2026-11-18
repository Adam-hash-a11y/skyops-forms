import { render, screen } from "@testing-library/react";
import { describe, expect, vi, it } from "vitest";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { PassengerFormModal } from "../../src/components/shared/passengerFormModal/PassengerFormModal";

const passenger = {
  id: "1",
  firstName: "Lena",
  lastName: "Banks",
  passportNumber: "DE7731902",
  nationality: "DE",
  dateOfBirth: "1992-11-02",
  email: "name@example.com",
  phoneNumber: "+4915194300275",
};

describe("PassengerFormModal", () => {
  describe("rendering", () => {
    it("should show the new passenger title and a disabled Create button at once", () => {
      //ARRANGE
      render(<PassengerFormModal handleSave={vi.fn()} handleClose={vi.fn()} />);

      //ACT
      const title = screen.getByTestId("passenger-form-modal-title");
      const createButton = screen.getAllByTestId("button")[1];

      //ASSERT
      expect(title).toHaveTextContent("New passenger");
      expect(createButton).toHaveTextContent("Create passenger");
      expect(createButton).toBeDisabled();
    });

    it("should show the edit title, Save changes and all fields prefilled for an existing passenger", () => {
      //ARRANGE
      render(
        <PassengerFormModal
          handleSave={vi.fn()}
          handleClose={vi.fn()}
          passenger={passenger}
        />,
      );

      //ACT
      const title = screen.getByTestId("passenger-form-modal-title");
      const saveButton = screen.getAllByTestId("button")[1];
      const inputs = screen.getAllByTestId("form-input-input");
      const select = screen.getByTestId("form-input-select");

      //ASSERT
      expect(title).toHaveTextContent("Edit passenger");
      expect(saveButton).toHaveTextContent("Save changes");
      expect(saveButton).toBeEnabled();
      expect(inputs[0]).toHaveValue("Lena");
      expect(inputs[1]).toHaveValue("Banks");
      expect(inputs[2]).toHaveValue("DE7731902");
      expect(inputs[3]).toHaveValue("1992-11-02");
      expect(inputs[4]).toHaveValue("name@example.com");
      expect(inputs[5]).toHaveValue("+4915194300275");
      expect(select).toHaveValue("DE");
    });

    it("should lock only the passport number when editing", () => {
      //ARRANGE
      render(
        <PassengerFormModal
          handleSave={vi.fn()}
          handleClose={vi.fn()}
          passenger={passenger}
        />,
      );

      //ACT
      const inputs = screen.getAllByTestId("form-input-input");

      //ASSERT
      expect(inputs[2]).toBeDisabled();
      expect(inputs[0]).toBeEnabled();
    });

    it("should list the placeholder and all 9 nationalities in the select", () => {
      //ARRANGE
      render(<PassengerFormModal handleSave={vi.fn()} handleClose={vi.fn()} />);

      //ACT
      const options = screen.getAllByRole("option");

      //ASSERT
      expect(options).toHaveLength(10);
      expect(options[0]).toHaveTextContent("Select a nationality");
    });
  });

  describe("validation", () => {
    it("should show the first name error only after the user leaves the field", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<PassengerFormModal handleSave={vi.fn()} handleClose={vi.fn()} />);
      const inputs = screen.getAllByTestId("form-input-input");

      //ACT
      await user.type(inputs[0], "Le");

      //ASSERT
      expect(screen.queryByTestId("form-input-error")).not.toBeInTheDocument();

      //ACT
      await user.tab();

      //ASSERT
      expect(screen.getByTestId("form-input-error")).toHaveTextContent(
        "First name must be at least 3 characters",
      );
    });

    it("should show the age error after blur when the passenger is under 18", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<PassengerFormModal handleSave={vi.fn()} handleClose={vi.fn()} />);
      const inputs = screen.getAllByTestId("form-input-input");
      const tenYearsAgo = new Date();
      tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);

      //ACT
      await user.type(inputs[3], tenYearsAgo.toISOString().slice(0, 10));
      await user.tab();

      //ASSERT
      expect(screen.getByTestId("form-input-error")).toHaveTextContent(
        "You must be at least 18 years old",
      );
    });

    it("should show the email error after blur when the email is not valid", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<PassengerFormModal handleSave={vi.fn()} handleClose={vi.fn()} />);
      const inputs = screen.getAllByTestId("form-input-input");

      //ACT
      await user.type(inputs[4], "lena.example.com");
      await user.tab();

      //ASSERT
      expect(screen.getByTestId("form-input-error")).toHaveTextContent(
        "Email must be valid",
      );
    });

    it("should show the nationality error when the user leaves the select without choosing", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<PassengerFormModal handleSave={vi.fn()} handleClose={vi.fn()} />);
      const select = screen.getByTestId("form-input-select");

      //ACT
      await user.click(select);
      await user.tab();

      //ASSERT
      expect(screen.getByTestId("form-input-error")).toHaveTextContent(
        "Nationality is required",
      );
    });
  });

  describe("submit", () => {
    it("should enable Create when the form is valid and disable it again when a field breaks", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(<PassengerFormModal handleSave={vi.fn()} handleClose={vi.fn()} />);
      const inputs = screen.getAllByTestId("form-input-input");
      const select = screen.getByTestId("form-input-select");
      const createButton = screen.getAllByTestId("button")[1];

      //ACT
      await user.type(inputs[0], "Lena");
      await user.type(inputs[1], "Banks");
      await user.type(inputs[2], "DE7731902");
      await user.selectOptions(select, "DE");
      await user.type(inputs[3], "1992-11-02");
      await user.type(inputs[4], "name@example.com");
      await user.type(inputs[5], "+4915194300275");

      //ASSERT
      expect(createButton).toBeEnabled();

      //ACT
      await user.clear(inputs[0]);

      //ASSERT
      expect(createButton).toBeDisabled();
    });

    it("should call handleSave once with the 7 values in the right order", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleSave = vi.fn();
      render(
        <PassengerFormModal handleSave={handleSave} handleClose={vi.fn()} />,
      );
      const inputs = screen.getAllByTestId("form-input-input");
      const select = screen.getByTestId("form-input-select");
      const createButton = screen.getAllByTestId("button")[1];
      await user.type(inputs[0], "Lena");
      await user.type(inputs[1], "Banks");
      await user.type(inputs[2], "DE7731902");
      await user.selectOptions(select, "DE");
      await user.type(inputs[3], "1992-11-02");
      await user.type(inputs[4], "name@example.com");
      await user.type(inputs[5], "+4915194300275");

      //ACT
      await user.click(createButton);

      //ASSERT
      expect(handleSave).toHaveBeenCalledTimes(1);
      expect(handleSave).toHaveBeenCalledWith(
        "Lena",
        "Banks",
        "DE7731902",
        "DE",
        "1992-11-02",
        "name@example.com",
        "+4915194300275",
      );
    });

    it("should call handleSave with the prefilled values when saving an existing passenger", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleSave = vi.fn();
      render(
        <PassengerFormModal
          handleSave={handleSave}
          handleClose={vi.fn()}
          passenger={passenger}
        />,
      );
      const saveButton = screen.getAllByTestId("button")[1];

      //ACT
      await user.click(saveButton);

      //ASSERT
      expect(handleSave).toHaveBeenCalledTimes(1);
      expect(handleSave).toHaveBeenCalledWith(
        "Lena",
        "Banks",
        "DE7731902",
        "DE",
        "1992-11-02",
        "name@example.com",
        "+4915194300275",
      );
    });

    it("should not call handleSave when the user clicks the disabled Create button", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleSave = vi.fn();
      render(
        <PassengerFormModal handleSave={handleSave} handleClose={vi.fn()} />,
      );
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
        <PassengerFormModal handleSave={vi.fn()} handleClose={handleClose} />,
      );
      const cancelButton = screen.getAllByTestId("button")[0];

      //ACT
      await user.click(cancelButton);

      //ASSERT
      expect(cancelButton).toHaveTextContent("Cancel");
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("should call handleClose once when the user clicks the X icon", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleClose = vi.fn();
      render(
        <PassengerFormModal handleSave={vi.fn()} handleClose={handleClose} />,
      );

      //ACT
      await user.click(screen.getByTestId("icon-button"));

      //ASSERT
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
});

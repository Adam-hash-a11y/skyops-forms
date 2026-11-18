import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import { FormInputError } from "../../src/components/shared/formInputError/FormInputError";

describe("FormInputError", () => {
  describe("rendering", () => {
    it("should show the translated text when the message is a translation key", () => {
      //ARRANGE
      render(<FormInputError message="validation.flight.airline" />);

      //ACT
      const error = screen.getByTestId("form-input-error");

      //ASSERT
      expect(error).toHaveTextContent("Airline must be at least 5 characters");
    });

    it("should show the message as it is when it is plain text", () => {
      //ARRANGE
      render(<FormInputError message="Server not reachable" />);

      //ACT
      const error = screen.getByTestId("form-input-error");

      //ASSERT
      expect(error).toHaveTextContent("Server not reachable");
    });
  });
});

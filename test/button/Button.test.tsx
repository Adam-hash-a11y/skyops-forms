import { render, screen } from "@testing-library/react";
import { describe, expect, vi, it } from "vitest";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { Button } from "../../src/components/shared/button/Button";
import { ButtonVariant } from "../../src/components/shared/button/Button.types";

describe("Button", () => {
  describe("rendering", () => {
    it("should show the label and the icon passed as child", () => {
      //ARRANGE
      render(
        <Button label="Save">
          <span data-testid="button-icon" />
        </Button>,
      );

      //ACT
      const button = screen.getByTestId("button");

      //ASSERT
      expect(button).toHaveTextContent("Save");
      expect(button).toContainElement(screen.getByTestId("button-icon"));
    });

    it("should still show the label when no variant is given", () => {
      //ARRANGE
      render(<Button label="Save" />);

      //ACT
      const button = screen.getByTestId("button");

      //ASSERT
      expect(button).toHaveTextContent("Save");
    });

    it("should still show the label for a variant other than the default", () => {
      //ARRANGE
      render(<Button label="Delete" variant={ButtonVariant.DANGER} />);

      //ACT
      const button = screen.getByTestId("button");

      //ASSERT
      expect(button).toHaveTextContent("Delete");
    });
  });

  describe("user interactions", () => {
    it("should call handleButton once when the user clicks the button", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleButton = vi.fn();
      render(<Button label="Save" handleButton={handleButton} />);

      //ACT
      await user.click(screen.getByTestId("button"));

      //ASSERT
      expect(handleButton).toHaveBeenCalledTimes(1);
    });
  });

  describe("disabled", () => {
    it("should not call handleButton when the button is disabled", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleButton = vi.fn();
      render(<Button label="Save" handleButton={handleButton} disabled />);
      const button = screen.getByTestId("button");

      //ACT
      await user.click(button);

      //ASSERT
      expect(button).toBeDisabled();
      expect(handleButton).not.toHaveBeenCalled();
    });
  });
});

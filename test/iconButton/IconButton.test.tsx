import { render, screen } from "@testing-library/react";
import { describe, expect, vi, it } from "vitest";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { IconButton } from "../../src/components/shared/iconButton/IconButton";

describe("IconButton", () => {
  describe("rendering", () => {
    it("should show the icon passed as child", () => {
      //ARRANGE
      render(
        <IconButton>
          <span data-testid="icon-button-icon" />
        </IconButton>,
      );

      //ACT
      const button = screen.getByTestId("icon-button");

      //ASSERT
      expect(button).toContainElement(screen.getByTestId("icon-button-icon"));
    });
  });

  describe("user interactions", () => {
    it("should call handleButton once when the user clicks the button", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleButton = vi.fn();
      render(<IconButton handleButton={handleButton} />);

      //ACT
      await user.click(screen.getByTestId("icon-button"));

      //ASSERT
      expect(handleButton).toHaveBeenCalledTimes(1);
    });
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import { ProgressBar } from "../../src/components/shared/progressBar/ProgressBar";
import { theme } from "../../src/theme/theme";

describe("ProgressBar", () => {
  describe("width", () => {
    it("should fill 0% when no seat is booked", () => {
      //ARRANGE
      render(<ProgressBar value={0} max={10} />);

      //ACT
      const fill = screen.getByTestId("progress-bar-fill");

      //ASSERT
      expect(fill).toHaveStyle({ width: "0%" });
    });

    it("should fill 50% when 5 of 10 seats are booked", () => {
      //ARRANGE
      render(<ProgressBar value={5} max={10} />);

      //ACT
      const fill = screen.getByTestId("progress-bar-fill");

      //ASSERT
      expect(fill).toHaveStyle({ width: "50%" });
    });
  });

  describe("color", () => {
    it("should use the primary color at 89%", () => {
      //ARRANGE
      render(<ProgressBar value={89} max={100} />);

      //ACT
      const fill = screen.getByTestId("progress-bar-fill");

      //ASSERT
      expect(fill).toHaveStyle({
        backgroundColor: theme.colors.primary.main,
      });
    });

    it("should use the warning color at 90%", () => {
      //ARRANGE
      render(<ProgressBar value={90} max={100} />);

      //ACT
      const fill = screen.getByTestId("progress-bar-fill");

      //ASSERT
      expect(fill).toHaveStyle({
        backgroundColor: theme.colors.status.warning.main,
      });
    });

    it("should use the error color at 100%", () => {
      //ARRANGE
      render(<ProgressBar value={10} max={10} />);

      //ACT
      const fill = screen.getByTestId("progress-bar-fill");

      //ASSERT
      expect(fill).toHaveStyle({
        backgroundColor: theme.colors.status.error.main,
      });
    });

    it("should use the error color above 100%", () => {
      //ARRANGE
      render(<ProgressBar value={11} max={10} />);

      //ACT
      const fill = screen.getByTestId("progress-bar-fill");

      //ASSERT
      expect(fill).toHaveStyle({
        backgroundColor: theme.colors.status.error.main,
      });
    });
  });
});

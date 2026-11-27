import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";
import { NotFound } from "../../src/components/notFound/NotFound";

describe("NotFound", () => {
  describe("rendering", () => {
    it("should show the 404 title", () => {
      //ARRANGE
      render(
        <MemoryRouter>
          <NotFound />
        </MemoryRouter>,
      );

      //ACT
      const title = screen.getByTestId("not-found-title");

      //ASSERT
      expect(title).toHaveTextContent("404 - Page Not Found");
    });

    it("should show a Back to Home link that points to the flights page", () => {
      //ARRANGE
      render(
        <MemoryRouter>
          <NotFound />
        </MemoryRouter>,
      );

      //ACT
      const link = screen.getByTestId("not-found-link");

      //ASSERT
      expect(link).toHaveTextContent("Back to Home");
      expect(link).toHaveAttribute("href", "/flights");
    });
  });
});

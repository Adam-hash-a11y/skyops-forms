import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import i18n from "i18next";
import "@testing-library/jest-dom/vitest";
import { Header } from "../../src/components/header/Header";

describe("Header", () => {
  afterEach(async () => {
    cleanup();
    await i18n.changeLanguage("en");
  });

  describe("rendering", () => {
    it("should show the Flights, Passengers and Tickets links with their targets", () => {
      //ARRANGE
      render(
        <MemoryRouter initialEntries={["/flights"]}>
          <Header />
        </MemoryRouter>,
      );

      //ACT
      const flights = screen.getByTestId("header-link-flights");
      const passengers = screen.getByTestId("header-link-passengers");
      const tickets = screen.getByTestId("header-link-tickets");

      //ASSERT
      expect(flights).toHaveTextContent("Flights");
      expect(flights).toHaveAttribute("href", "/flights");
      expect(passengers).toHaveTextContent("Passengers");
      expect(passengers).toHaveAttribute("href", "/passengers");
      expect(tickets).toHaveTextContent("Tickets");
      expect(tickets).toHaveAttribute("href", "/tickets");
    });
  });

  describe("active link", () => {
    it("should highlight only Flights on a flight details page", () => {
      //ARRANGE
      render(
        <MemoryRouter initialEntries={["/flights/SKYOPS-105"]}>
          <Header />
        </MemoryRouter>,
      );

      //ACT
      const flights = screen.getByTestId("header-link-flights");
      const passengers = screen.getByTestId("header-link-passengers");
      const tickets = screen.getByTestId("header-link-tickets");

      //ASSERT
      expect(flights).toHaveClass("active");
      expect(passengers).not.toHaveClass("active");
      expect(tickets).not.toHaveClass("active");
    });

    it("should highlight only Tickets on the tickets page", () => {
      //ARRANGE
      render(
        <MemoryRouter initialEntries={["/tickets"]}>
          <Header />
        </MemoryRouter>,
      );

      //ACT
      const flights = screen.getByTestId("header-link-flights");
      const passengers = screen.getByTestId("header-link-passengers");
      const tickets = screen.getByTestId("header-link-tickets");

      //ASSERT
      expect(tickets).toHaveClass("active");
      expect(flights).not.toHaveClass("active");
      expect(passengers).not.toHaveClass("active");
    });
  });

  describe("language switch", () => {
    it("should show EN on the button and keep the dropdown closed at the start", () => {
      //ARRANGE
      render(
        <MemoryRouter initialEntries={["/flights"]}>
          <Header />
        </MemoryRouter>,
      );

      //ACT
      const button = screen.getByTestId("header-language-button");

      //ASSERT
      expect(button).toHaveTextContent("EN");
      expect(
        screen.queryByTestId("header-language-dropdown"),
      ).not.toBeInTheDocument();
    });

    it("should open the dropdown with EN, FR and DE when the user clicks the button", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(
        <MemoryRouter initialEntries={["/flights"]}>
          <Header />
        </MemoryRouter>,
      );

      //ACT
      await user.click(screen.getByTestId("header-language-button"));

      //ASSERT
      const options = screen.getAllByTestId("header-language-option");
      expect(options).toHaveLength(3);
      expect(options[0]).toHaveTextContent("EN");
      expect(options[1]).toHaveTextContent("FR");
      expect(options[2]).toHaveTextContent("DE");
    });

    it("should switch the navigation texts to French when the user chooses FR", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(
        <MemoryRouter initialEntries={["/flights"]}>
          <Header />
        </MemoryRouter>,
      );
      await user.click(screen.getByTestId("header-language-button"));

      //ACT
      await user.click(screen.getAllByTestId("header-language-option")[1]);

      //ASSERT
      await waitFor(() => {
        expect(screen.getByTestId("header-link-flights")).toHaveTextContent(
          "Vols",
        );
      });
      expect(screen.getByTestId("header-link-passengers")).toHaveTextContent(
        "Passagers",
      );
      expect(screen.getByTestId("header-link-tickets")).toHaveTextContent(
        "Billets",
      );
      expect(screen.getByTestId("header-language-button")).toHaveTextContent(
        "FR",
      );
    });

    it("should switch the navigation texts to German when the user chooses DE and back to English when the user chooses EN", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(
        <MemoryRouter initialEntries={["/flights"]}>
          <Header />
        </MemoryRouter>,
      );
      await user.click(screen.getByTestId("header-language-button"));

      //ACT
      await user.click(screen.getAllByTestId("header-language-option")[2]);

      //ASSERT
      await waitFor(() => {
        expect(screen.getByTestId("header-link-flights")).toHaveTextContent(
          "Flüge",
        );
      });
      expect(screen.getByTestId("header-link-passengers")).toHaveTextContent(
        "Passagiere",
      );
      expect(screen.getByTestId("header-link-tickets")).toHaveTextContent(
        "Tickets",
      );
      expect(screen.getByTestId("header-language-button")).toHaveTextContent(
        "DE",
      );

      //ACT
      await user.click(screen.getByTestId("header-language-button"));
      await user.click(screen.getAllByTestId("header-language-option")[0]);

      //ASSERT
      await waitFor(() => {
        expect(screen.getByTestId("header-link-flights")).toHaveTextContent(
          "Flights",
        );
      });
      expect(screen.getByTestId("header-link-passengers")).toHaveTextContent(
        "Passengers",
      );
      expect(screen.getByTestId("header-link-tickets")).toHaveTextContent(
        "Tickets",
      );
      expect(screen.getByTestId("header-language-button")).toHaveTextContent(
        "EN",
      );
    });

    it("should close the dropdown after the user chooses a language", async () => {
      //ARRANGE
      const user = userEvent.setup();
      render(
        <MemoryRouter initialEntries={["/flights"]}>
          <Header />
        </MemoryRouter>,
      );
      await user.click(screen.getByTestId("header-language-button"));

      //ACT
      await user.click(screen.getAllByTestId("header-language-option")[2]);

      //ASSERT
      expect(
        screen.queryByTestId("header-language-dropdown"),
      ).not.toBeInTheDocument();
    });
  });
});

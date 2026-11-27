import { render, screen } from "@testing-library/react";
import { describe, expect, vi, it } from "vitest";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { DeleteModal } from "../../src/components/shared/deleteModal/DeleteModal";
import { EntityName } from "../../src/types/entityTypes";

describe("DeleteModal", () => {
  describe("rendering", () => {
    it("should show the title and ask to delete the item", () => {
      //ARRANGE
      render(
        <DeleteModal
          title="Delete flight"
          action="Delete"
          itemName="SKYOPS-105"
          deleteButtonLabel="Delete flight"
          entityName={EntityName.FLIGHT}
          handleClose={vi.fn()}
          handleDelete={vi.fn()}
        />,
      );

      //ACT
      const modal = screen.getByTestId("delete-modal");

      //ASSERT
      expect(modal).toHaveTextContent("Delete flight");
      expect(modal).toHaveTextContent(
        "Delete SKYOPS-105 ? This cannot be undone.",
      );
    });
  });

  describe("warning", () => {
    it("should warn about the tickets when the flight has tickets", () => {
      //ARRANGE
      render(
        <DeleteModal
          title="Delete flight"
          action="Delete"
          itemName="SKYOPS-105"
          deleteButtonLabel="Delete flight"
          ticketCount={3}
          entityName={EntityName.FLIGHT}
          handleClose={vi.fn()}
          handleDelete={vi.fn()}
        />,
      );

      //ACT
      const modal = screen.getByTestId("delete-modal");

      //ASSERT
      expect(modal).toHaveTextContent(
        "3 tickets reference this flight. The API does not remove them; they will show as deleted.",
      );
    });

    it("should not show a warning when there are no tickets", () => {
      //ARRANGE
      render(
        <DeleteModal
          title="Delete flight"
          action="Delete"
          itemName="SKYOPS-105"
          deleteButtonLabel="Delete flight"
          ticketCount={0}
          entityName={EntityName.FLIGHT}
          handleClose={vi.fn()}
          handleDelete={vi.fn()}
        />,
      );

      //ACT
      const modal = screen.getByTestId("delete-modal");

      //ASSERT
      expect(modal).not.toHaveTextContent("tickets reference");
    });

    it("should not show a warning while the ticket count is not known yet", () => {
      //ARRANGE
      render(
        <DeleteModal
          title="Delete flight"
          action="Delete"
          itemName="SKYOPS-105"
          deleteButtonLabel="Delete flight"
          entityName={EntityName.FLIGHT}
          handleClose={vi.fn()}
          handleDelete={vi.fn()}
        />,
      );

      //ACT
      const modal = screen.getByTestId("delete-modal");

      //ASSERT
      expect(modal).not.toHaveTextContent("tickets reference");
    });
  });

  describe("user interactions", () => {
    it("should call handleClose once when the user clicks Cancel", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleClose = vi.fn();
      const handleDelete = vi.fn();
      render(
        <DeleteModal
          title="Delete flight"
          action="Delete"
          itemName="SKYOPS-105"
          deleteButtonLabel="Delete flight"
          entityName={EntityName.FLIGHT}
          handleClose={handleClose}
          handleDelete={handleDelete}
        />,
      );

      //ACT
      await user.click(screen.getAllByTestId("button")[0]);

      //ASSERT
      expect(handleClose).toHaveBeenCalledTimes(1);
      expect(handleDelete).not.toHaveBeenCalled();
    });

    it("should call handleClose once when the user clicks the close icon", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleClose = vi.fn();
      const handleDelete = vi.fn();
      render(
        <DeleteModal
          title="Delete flight"
          action="Delete"
          itemName="SKYOPS-105"
          deleteButtonLabel="Delete flight"
          entityName={EntityName.FLIGHT}
          handleClose={handleClose}
          handleDelete={handleDelete}
        />,
      );

      //ACT
      await user.click(screen.getByTestId("icon-button"));

      //ASSERT
      expect(handleClose).toHaveBeenCalledTimes(1);
      expect(handleDelete).not.toHaveBeenCalled();
    });

    it("should call handleDelete once when the user clicks the red delete button", async () => {
      //ARRANGE
      const user = userEvent.setup();
      const handleClose = vi.fn();
      const handleDelete = vi.fn();
      render(
        <DeleteModal
          title="Delete flight"
          action="Delete"
          itemName="SKYOPS-105"
          deleteButtonLabel="Delete flight"
          entityName={EntityName.FLIGHT}
          handleClose={handleClose}
          handleDelete={handleDelete}
        />,
      );

      //ACT
      await user.click(screen.getAllByTestId("button")[1]);

      //ASSERT
      expect(handleDelete).toHaveBeenCalledTimes(1);
      expect(handleClose).not.toHaveBeenCalled();
    });
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders the label", () => {
    render(<Button label="Click Me" />);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("calls handleButton on click with fireEvent", () => {
    const handleButton = vi.fn();
    render(<Button label="Click Me" handleButton={handleButton} />);
    fireEvent.click(screen.getByText("Click Me"));
    expect(handleButton).toHaveBeenCalledTimes(1);
  });

  it("calls handleButton on click with userEvent", async () => {
    const handleButton = vi.fn();
    render(<Button label="Click Me" handleButton={handleButton} />);
    await userEvent.click(screen.getByText("Click Me"));
    expect(handleButton).toHaveBeenCalledTimes(1);
  });

  it("does not call handleButton when disabled", async () => {
    const handleButton = vi.fn();
    render(<Button label="Click Me" handleButton={handleButton} disabled />);
    await userEvent.click(screen.getByText("Click Me"));
    expect(handleButton).not.toHaveBeenCalled();
  });

  it("renders children alongside label", () => {
    render(
      <Button label="Click Me">
        <span>Icon</span>
      </Button>,
    );
    expect(screen.getByText("Icon")).toBeInTheDocument();
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });
});

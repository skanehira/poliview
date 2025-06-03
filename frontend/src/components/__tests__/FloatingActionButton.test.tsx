import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FloatingActionButton } from "../FloatingActionButton";
import "@testing-library/jest-dom";

describe("FloatingActionButton", () => {
  const defaultProps = {
    showFabMenu: false,
    setShowFabMenu: vi.fn(),
    sortOrder: "newest" as const,
    onSortChange: vi.fn(),
    onAddPolicy: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the FAB button with plus icon when menu is closed", () => {
    render(<FloatingActionButton {...defaultProps} />);

    const fabButton = screen.getByRole("button", { name: "+" });
    expect(fabButton).toBeInTheDocument();
    expect(fabButton).toHaveClass(
      "h-14",
      "w-14",
      "transform",
      "font-bold",
      "text-3xl",
      "shadow-xl",
      "transition",
      "duration-300",
      "ease-in-out",
      "hover:scale-105",
    );
  });

  it("renders the FAB button with minus icon when menu is open", () => {
    const props = { ...defaultProps, showFabMenu: true };
    render(<FloatingActionButton {...props} />);

    const fabButton = screen.getByRole("button", { name: "−" });
    expect(fabButton).toBeInTheDocument();
  });

  it("calls setShowFabMenu when FAB button is clicked", () => {
    render(<FloatingActionButton {...defaultProps} />);

    const fabButton = screen.getByRole("button", { name: "+" });
    fireEvent.click(fabButton);

    expect(defaultProps.setShowFabMenu).toHaveBeenCalledWith(true);
  });

  it("toggles FAB menu state correctly", () => {
    // Test opening menu
    const { rerender } = render(<FloatingActionButton {...defaultProps} />);

    const fabButton = screen.getByRole("button", { name: "+" });
    fireEvent.click(fabButton);
    expect(defaultProps.setShowFabMenu).toHaveBeenCalledWith(true);

    // Test closing menu
    const propsWithOpenMenu = { ...defaultProps, showFabMenu: true };
    rerender(<FloatingActionButton {...propsWithOpenMenu} />);

    const fabButtonWithMenu = screen.getByRole("button", { name: "−" });
    fireEvent.click(fabButtonWithMenu);
    expect(defaultProps.setShowFabMenu).toHaveBeenCalledWith(false);
  });

  it("does not show menu items when showFabMenu is false", () => {
    render(<FloatingActionButton {...defaultProps} />);

    expect(screen.queryByText("政策を追加")).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue("新しい順")).not.toBeInTheDocument();
  });

  it("shows menu items when showFabMenu is true", () => {
    const props = { ...defaultProps, showFabMenu: true };
    render(<FloatingActionButton {...props} />);

    expect(screen.getByText("政策を追加")).toBeInTheDocument();
    expect(screen.getByDisplayValue("新しい順")).toBeInTheDocument();
  });

  it("calls onAddPolicy when add policy button is clicked", () => {
    const props = { ...defaultProps, showFabMenu: true };
    render(<FloatingActionButton {...props} />);

    const addButton = screen.getByText("政策を追加");
    fireEvent.click(addButton);

    expect(defaultProps.onAddPolicy).toHaveBeenCalledTimes(1);
  });

  it("renders sort dropdown with correct options", () => {
    const props = { ...defaultProps, showFabMenu: true };
    render(<FloatingActionButton {...props} />);

    const sortSelect = screen.getByDisplayValue("新しい順");
    expect(sortSelect).toBeInTheDocument();

    // Check all options are present
    expect(screen.getByText("新しい順")).toBeInTheDocument();
    expect(screen.getByText("人気度が高い順")).toBeInTheDocument();
    expect(screen.getByText("人気度が低い順")).toBeInTheDocument();
  });

  it("calls onSortChange when sort option is changed", () => {
    const props = { ...defaultProps, showFabMenu: true };
    render(<FloatingActionButton {...props} />);

    const sortSelect = screen.getByDisplayValue(
      "新しい順",
    ) as HTMLSelectElement;

    // Change the value directly and trigger the change event
    fireEvent.change(sortSelect, { target: { value: "popularity_desc" } });

    expect(defaultProps.onSortChange).toHaveBeenCalledTimes(1);

    // Just verify that the handler was called, since the mock function receives the actual event
    expect(defaultProps.onSortChange).toHaveBeenCalled();
  });

  it("displays correct sort order value", () => {
    const props = {
      ...defaultProps,
      showFabMenu: true,
      sortOrder: "popularity_desc" as const,
    };
    render(<FloatingActionButton {...props} />);

    const sortSelect = screen.getByDisplayValue("人気度が高い順");
    expect(sortSelect).toBeInTheDocument();
  });

  it("displays popularity_asc sort order correctly", () => {
    const props = {
      ...defaultProps,
      showFabMenu: true,
      sortOrder: "popularity_asc" as const,
    };
    render(<FloatingActionButton {...props} />);

    const sortSelect = screen.getByDisplayValue("人気度が低い順");
    expect(sortSelect).toBeInTheDocument();
  });

  it("has correct positioning and layout classes", () => {
    const { container } = render(<FloatingActionButton {...defaultProps} />);

    const fabContainer = container.firstChild;
    expect(fabContainer).toHaveClass("fixed", "right-8", "bottom-8", "z-20");

    const innerContainer = fabContainer?.firstChild;
    expect(innerContainer).toHaveClass("relative");
  });

  it("shows menu items with correct styling when menu is open", () => {
    const props = { ...defaultProps, showFabMenu: true };
    render(<FloatingActionButton {...props} />);

    const menuContainer = screen.getByText("政策を追加").parentElement;
    expect(menuContainer).toHaveClass(
      "absolute",
      "right-0",
      "bottom-full",
      "mb-3",
      "flex",
      "flex-col",
      "items-end",
      "space-y-3",
    );

    const addButton = screen.getByText("政策を追加");
    expect(addButton).toHaveClass("whitespace-nowrap", "text-sm", "shadow-lg");

    const sortContainer = screen.getByDisplayValue("新しい順").parentElement;
    expect(sortContainer).toHaveClass(
      "rounded-full",
      "bg-white",
      "p-2",
      "shadow-lg",
    );
  });

  it("has correct select element styling", () => {
    const props = { ...defaultProps, showFabMenu: true };
    render(<FloatingActionButton {...props} />);

    const sortSelect = screen.getByDisplayValue("新しい順");
    expect(sortSelect).toHaveClass(
      "rounded-full",
      "border",
      "border-gray-300",
      "p-2",
      "text-gray-800",
      "text-sm",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-blue-400",
    );
  });

  it("handles all sort order options correctly", () => {
    const sortOrders: Array<"newest" | "popularity_desc" | "popularity_asc"> = [
      "newest",
      "popularity_desc",
      "popularity_asc",
    ];

    for (const sortOrder of sortOrders) {
      const props = { ...defaultProps, showFabMenu: true, sortOrder };
      const { unmount } = render(<FloatingActionButton {...props} />);

      const expectedText = {
        newest: "新しい順",
        popularity_desc: "人気度が高い順",
        popularity_asc: "人気度が低い順",
      }[sortOrder];

      expect(screen.getByDisplayValue(expectedText)).toBeInTheDocument();
      unmount();
    }
  });
});

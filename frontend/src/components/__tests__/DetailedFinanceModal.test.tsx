import { Theme } from "@radix-ui/themes";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DetailedFinanceModal } from "../DetailedFinanceModal";

function renderWithTheme(component: React.ReactElement) {
  return render(<Theme>{component}</Theme>);
}

describe("DetailedFinanceModal", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders modal when isOpen is true", () => {
    renderWithTheme(
      <DetailedFinanceModal
        type="revenue"
        category="市税"
        period={2024}
        onClose={mockOnClose}
        isOpen={true}
      />,
    );

    expect(screen.getByText("市税の詳細 (2024) - 歳入")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    renderWithTheme(
      <DetailedFinanceModal
        type="revenue"
        category="市税"
        period={2024}
        onClose={mockOnClose}
        isOpen={false}
      />,
    );

    expect(
      screen.queryByText("市税の詳細 (2024) - 歳入"),
    ).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <DetailedFinanceModal
        type="revenue"
        category="市税"
        period={2024}
        onClose={mockOnClose}
        isOpen={true}
      />,
    );

    const closeButton = screen.getByRole("button", { name: "×" });
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  it("displays revenue modal title correctly", () => {
    renderWithTheme(
      <DetailedFinanceModal
        type="revenue"
        category="市税"
        period="2024-04"
        onClose={mockOnClose}
        isOpen={true}
      />,
    );

    expect(screen.getByText("市税の詳細 (2024-04) - 歳入")).toBeInTheDocument();
  });

  it("displays expenditure modal title correctly", () => {
    renderWithTheme(
      <DetailedFinanceModal
        type="expenditure"
        category="教育費"
        period={2024}
        onClose={mockOnClose}
        isOpen={true}
      />,
    );

    expect(screen.getByText("教育費の詳細 (2024) - 歳出")).toBeInTheDocument();
  });

  it("displays no data message when detailData is not available", () => {
    renderWithTheme(
      <DetailedFinanceModal
        type="revenue"
        category="存在しないカテゴリ"
        period={2024}
        onClose={mockOnClose}
        isOpen={true}
      />,
    );

    expect(
      screen.getByText("この期間のデータはありません。"),
    ).toBeInTheDocument();
  });

  it("displays chart and breakdown when data is available", () => {
    renderWithTheme(
      <DetailedFinanceModal
        type="revenue"
        category="市税"
        period={2024}
        onClose={mockOnClose}
        isOpen={true}
      />,
    );

    // Check for breakdown section
    expect(screen.getByText("内訳")).toBeInTheDocument();
  });

  it("displays correct period formatting for monthly data", () => {
    renderWithTheme(
      <DetailedFinanceModal
        type="revenue"
        category="市税"
        period="2024-04"
        onClose={mockOnClose}
        isOpen={true}
      />,
    );

    expect(screen.getByText("市税の詳細 (2024-04) - 歳入")).toBeInTheDocument();
  });

  it("displays correct period formatting for yearly data", () => {
    renderWithTheme(
      <DetailedFinanceModal
        type="revenue"
        category="市税"
        period={2024}
        onClose={mockOnClose}
        isOpen={true}
      />,
    );

    expect(screen.getByText("市税の詳細 (2024) - 歳入")).toBeInTheDocument();
  });

  it("handles different category types", () => {
    const { rerender } = renderWithTheme(
      <DetailedFinanceModal
        type="revenue"
        category="地方交付税"
        period={2024}
        onClose={mockOnClose}
        isOpen={true}
      />,
    );

    expect(
      screen.getByText("地方交付税の詳細 (2024) - 歳入"),
    ).toBeInTheDocument();

    rerender(
      <Theme>
        <DetailedFinanceModal
          type="expenditure"
          category="民生費"
          period={2024}
          onClose={mockOnClose}
          isOpen={true}
        />
      </Theme>,
    );

    expect(screen.getByText("民生費の詳細 (2024) - 歳出")).toBeInTheDocument();
  });

  it("renders proper dialog structure", () => {
    renderWithTheme(
      <DetailedFinanceModal
        type="revenue"
        category="市税"
        period={2024}
        onClose={mockOnClose}
        isOpen={true}
      />,
    );

    // Check for Dialog.Title
    expect(screen.getByText("市税の詳細 (2024) - 歳入")).toBeInTheDocument();

    // Check for close button
    expect(screen.getByRole("button", { name: "×" })).toBeInTheDocument();
  });

  it("handles modal close via onOpenChange", () => {
    const { rerender } = renderWithTheme(
      <DetailedFinanceModal
        type="revenue"
        category="市税"
        period={2024}
        onClose={mockOnClose}
        isOpen={true}
      />,
    );

    expect(screen.getByText("市税の詳細 (2024) - 歳入")).toBeInTheDocument();

    rerender(
      <Theme>
        <DetailedFinanceModal
          type="revenue"
          category="市税"
          period={2024}
          onClose={mockOnClose}
          isOpen={false}
        />
      </Theme>,
    );

    expect(
      screen.queryByText("市税の詳細 (2024) - 歳入"),
    ).not.toBeInTheDocument();
  });
});

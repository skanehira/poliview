import { Theme } from "@radix-ui/themes";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Policy } from "../../types/policy";
import { PolicySummarySection } from "../PolicySummarySection";

const mockPolicy: Policy = {
  id: "1",
  title: "Test Policy",
  purpose: "Test purpose",
  overview: "Test overview",
  detailedPlan: "Test detailed plan",
  problems: ["Problem 1"],
  benefits: ["Benefit 1"],
  drawbacks: ["Drawback 1"],
  year: 2024,
  keywords: ["test"],
  relatedEvents: ["Event 1"],
  upvotes: 5,
  downvotes: 2,
  comments: [],
};

function renderWithTheme(component: React.ReactElement) {
  return render(<Theme>{component}</Theme>);
}

describe("PolicySummarySection", () => {
  const mockOnSummarizePolicy = vi.fn();
  const mockOnToggleSimplifiedSummary = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when onSummarizePolicy is not provided", () => {
    render(<PolicySummarySection policy={mockPolicy} />);

    // When onSummarizePolicy is not provided, component should not render anything
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders summarize button when onSummarizePolicy is provided", () => {
    renderWithTheme(
      <PolicySummarySection
        policy={mockPolicy}
        onSummarizePolicy={mockOnSummarizePolicy}
        onToggleSimplifiedSummary={mockOnToggleSimplifiedSummary}
      />,
    );

    expect(
      screen.getByRole("button", { name: "✨政策をさらに分かりやすく" }),
    ).toBeInTheDocument();
  });

  it("calls onSummarizePolicy when summarize button is clicked", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <PolicySummarySection
        policy={mockPolicy}
        onSummarizePolicy={mockOnSummarizePolicy}
        onToggleSimplifiedSummary={mockOnToggleSimplifiedSummary}
      />,
    );

    const summarizeButton = screen.getByRole("button", {
      name: "✨政策をさらに分かりやすく",
    });
    await user.click(summarizeButton);

    expect(mockOnSummarizePolicy).toHaveBeenCalledWith(mockPolicy);
  });

  it("shows loading state when isSummarizing is true", () => {
    renderWithTheme(
      <PolicySummarySection
        policy={mockPolicy}
        onSummarizePolicy={mockOnSummarizePolicy}
        isSummarizing={true}
        onToggleSimplifiedSummary={mockOnToggleSimplifiedSummary}
      />,
    );

    expect(screen.getByText("要約中...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /要約中.../ })).toBeDisabled();
  });

  it("shows toggle button when simplified text is available", () => {
    renderWithTheme(
      <PolicySummarySection
        policy={mockPolicy}
        onSummarizePolicy={mockOnSummarizePolicy}
        simplifiedPolicyText="This is a simplified explanation"
        onToggleSimplifiedSummary={mockOnToggleSimplifiedSummary}
      />,
    );

    expect(
      screen.getByRole("button", { name: "要約を開く" }),
    ).toBeInTheDocument();
  });

  it('shows "要約を閉じる" when summary is open', () => {
    renderWithTheme(
      <PolicySummarySection
        policy={mockPolicy}
        onSummarizePolicy={mockOnSummarizePolicy}
        simplifiedPolicyText="This is a simplified explanation"
        showSimplifiedSummary={true}
        onToggleSimplifiedSummary={mockOnToggleSimplifiedSummary}
      />,
    );

    expect(
      screen.getByRole("button", { name: "要約を閉じる" }),
    ).toBeInTheDocument();
  });

  it("calls onToggleSimplifiedSummary when toggle button is clicked", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <PolicySummarySection
        policy={mockPolicy}
        onSummarizePolicy={mockOnSummarizePolicy}
        simplifiedPolicyText="This is a simplified explanation"
        onToggleSimplifiedSummary={mockOnToggleSimplifiedSummary}
      />,
    );

    const toggleButton = screen.getByRole("button", { name: "要約を開く" });
    await user.click(toggleButton);

    expect(mockOnToggleSimplifiedSummary).toHaveBeenCalledOnce();
  });

  it("displays simplified summary when showSimplifiedSummary is true", () => {
    renderWithTheme(
      <PolicySummarySection
        policy={mockPolicy}
        onSummarizePolicy={mockOnSummarizePolicy}
        simplifiedPolicyText="This is a simplified explanation"
        showSimplifiedSummary={true}
        onToggleSimplifiedSummary={mockOnToggleSimplifiedSummary}
      />,
    );

    expect(screen.getByText("高校生向け要約:")).toBeInTheDocument();
    expect(
      screen.getByText("This is a simplified explanation"),
    ).toBeInTheDocument();
  });

  it("does not display simplified summary when showSimplifiedSummary is false", () => {
    renderWithTheme(
      <PolicySummarySection
        policy={mockPolicy}
        onSummarizePolicy={mockOnSummarizePolicy}
        simplifiedPolicyText="This is a simplified explanation"
        showSimplifiedSummary={false}
        onToggleSimplifiedSummary={mockOnToggleSimplifiedSummary}
      />,
    );

    expect(screen.queryByText("高校生向け要約:")).not.toBeInTheDocument();
    expect(
      screen.queryByText("This is a simplified explanation"),
    ).not.toBeInTheDocument();
  });

  it("does not show toggle button when onToggleSimplifiedSummary is not provided", () => {
    renderWithTheme(
      <PolicySummarySection
        policy={mockPolicy}
        onSummarizePolicy={mockOnSummarizePolicy}
        simplifiedPolicyText="This is a simplified explanation"
      />,
    );

    expect(screen.queryByText("要約を開く")).not.toBeInTheDocument();
    expect(screen.queryByText("要約を閉じる")).not.toBeInTheDocument();
  });
});

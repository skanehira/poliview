import { Theme } from "@radix-ui/themes";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Policy } from "../../types/policy";
import { PolicyDetailModal } from "../PolicyDetailModal";

const mockPolicy: Policy = {
  id: "1",
  title: "Test Policy",
  purpose: "Test purpose",
  overview: "Test overview",
  detailedPlan: "Test detailed plan",
  problems: ["Problem 1", "Problem 2"],
  benefits: ["Benefit 1", "Benefit 2"],
  drawbacks: ["Drawback 1"],
  year: 2024,
  keywords: ["test", "policy"],
  relatedEvents: ["Event 1", "Event 2"],
  upvotes: 10,
  downvotes: 5,
  budget: 1000000,
  status: "進行中",
  comments: [
    {
      id: "comment1",
      author: "市民A",
      text: "Great policy!",
      timestamp: "2024-01-01 12:00:00",
      upvotes: 3,
      downvotes: 1,
    },
    {
      id: "comment2",
      author: "匿名市民",
      text: "I have concerns",
      timestamp: "2024-01-02 14:30:00",
      upvotes: 1,
      downvotes: 2,
    },
  ],
};

function renderWithTheme(component: React.ReactElement) {
  return render(<Theme>{component}</Theme>);
}

describe("PolicyDetailModal", () => {
  const mockOnClose = vi.fn();
  const mockOnVoteComment = vi.fn();
  const mockOnAddComment = vi.fn();
  const mockOnSummarizePolicy = vi.fn();
  const mockOnToggleSimplifiedSummary = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders modal when isOpen is true and policy is provided", () => {
    renderWithTheme(
      <PolicyDetailModal
        policy={mockPolicy}
        isOpen={true}
        onClose={mockOnClose}
        onVoteComment={mockOnVoteComment}
        onAddComment={mockOnAddComment}
        onSummarizePolicy={mockOnSummarizePolicy}
        onToggleSimplifiedSummary={mockOnToggleSimplifiedSummary}
      />,
    );

    expect(screen.getByText("Test Policy")).toBeInTheDocument();
    expect(screen.getByText("Test purpose")).toBeInTheDocument();
    expect(screen.getByText("Test overview")).toBeInTheDocument();
  });

  it("does not render when policy is null", () => {
    render(
      <PolicyDetailModal
        policy={null}
        isOpen={true}
        onClose={mockOnClose}
        onVoteComment={mockOnVoteComment}
        onAddComment={mockOnAddComment}
      />,
    );

    // When policy is null, the modal content should not be present
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <PolicyDetailModal
        policy={mockPolicy}
        isOpen={true}
        onClose={mockOnClose}
        onVoteComment={mockOnVoteComment}
        onAddComment={mockOnAddComment}
      />,
    );

    const closeButton = screen.getByRole("button", { name: "×" });
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  it("displays policy metadata correctly", () => {
    renderWithTheme(
      <PolicyDetailModal
        policy={mockPolicy}
        isOpen={true}
        onClose={mockOnClose}
        onVoteComment={mockOnVoteComment}
        onAddComment={mockOnAddComment}
      />,
    );

    expect(screen.getByText("年度: 2024")).toBeInTheDocument();
    expect(screen.getByText("進行中")).toBeInTheDocument();
    expect(screen.getByText("1,000,000 円")).toBeInTheDocument();
    expect(screen.getByText("67%")).toBeInTheDocument(); // popularity calculation: 10/(10+5) * 100
  });

  it("displays policy details correctly", () => {
    renderWithTheme(
      <PolicyDetailModal
        policy={mockPolicy}
        isOpen={true}
        onClose={mockOnClose}
        onVoteComment={mockOnVoteComment}
        onAddComment={mockOnAddComment}
      />,
    );

    expect(screen.getByText("Problem 1")).toBeInTheDocument();
    expect(screen.getByText("Problem 2")).toBeInTheDocument();
    expect(screen.getByText("Benefit 1")).toBeInTheDocument();
    expect(screen.getByText("Benefit 2")).toBeInTheDocument();
    expect(screen.getByText("Drawback 1")).toBeInTheDocument();
    expect(screen.getByText("test")).toBeInTheDocument();
    expect(screen.getByText("policy")).toBeInTheDocument();
  });

  it("displays comments correctly", () => {
    renderWithTheme(
      <PolicyDetailModal
        policy={mockPolicy}
        isOpen={true}
        onClose={mockOnClose}
        onVoteComment={mockOnVoteComment}
        onAddComment={mockOnAddComment}
      />,
    );

    expect(screen.getByText("市民A")).toBeInTheDocument();
    expect(screen.getByText("Great policy!")).toBeInTheDocument();
    expect(screen.getByText("匿名市民")).toBeInTheDocument();
    expect(screen.getByText("I have concerns")).toBeInTheDocument();
  });

  it("handles comment voting", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <PolicyDetailModal
        policy={mockPolicy}
        isOpen={true}
        onClose={mockOnClose}
        onVoteComment={mockOnVoteComment}
        onAddComment={mockOnAddComment}
      />,
    );

    const upvoteButtons = screen.getAllByText(/👍/);
    await user.click(upvoteButtons[0]);

    // Comments are displayed in reverse order, so first button is for comment2
    expect(mockOnVoteComment).toHaveBeenCalledWith("1", "comment2", "up");
  });

  it("handles comment submission", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <PolicyDetailModal
        policy={mockPolicy}
        isOpen={true}
        onClose={mockOnClose}
        onVoteComment={mockOnVoteComment}
        onAddComment={mockOnAddComment}
      />,
    );

    const commentTextarea = screen.getByPlaceholderText(
      "この政策に対するあなたの意見を投稿してください...",
    );
    const submitButton = screen.getByRole("button", { name: "コメントを投稿" });

    await user.type(commentTextarea, "Test comment");
    await user.click(submitButton);

    expect(mockOnAddComment).toHaveBeenCalledWith("1", "Test comment", false);
  });

  it("handles anonymous comment submission", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <PolicyDetailModal
        policy={mockPolicy}
        isOpen={true}
        onClose={mockOnClose}
        onVoteComment={mockOnVoteComment}
        onAddComment={mockOnAddComment}
      />,
    );

    const commentTextarea = screen.getByPlaceholderText(
      "この政策に対するあなたの意見を投稿してください...",
    );
    const anonymousCheckbox = screen.getByLabelText("匿名で投稿する");
    const submitButton = screen.getByRole("button", { name: "コメントを投稿" });

    await user.type(commentTextarea, "Anonymous test comment");
    await user.click(anonymousCheckbox);
    await user.click(submitButton);

    expect(mockOnAddComment).toHaveBeenCalledWith(
      "1",
      "Anonymous test comment",
      true,
    );
  });

  it("handles policy summarization", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <PolicyDetailModal
        policy={mockPolicy}
        isOpen={true}
        onClose={mockOnClose}
        onVoteComment={mockOnVoteComment}
        onAddComment={mockOnAddComment}
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

  it("shows loading state during summarization", () => {
    renderWithTheme(
      <PolicyDetailModal
        policy={mockPolicy}
        isOpen={true}
        onClose={mockOnClose}
        onVoteComment={mockOnVoteComment}
        onAddComment={mockOnAddComment}
        onSummarizePolicy={mockOnSummarizePolicy}
        isSummarizing={true}
        onToggleSimplifiedSummary={mockOnToggleSimplifiedSummary}
      />,
    );

    expect(screen.getByText("要約中...")).toBeInTheDocument();
  });

  it("displays simplified summary when available", () => {
    renderWithTheme(
      <PolicyDetailModal
        policy={mockPolicy}
        isOpen={true}
        onClose={mockOnClose}
        onVoteComment={mockOnVoteComment}
        onAddComment={mockOnAddComment}
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

  it("handles summary toggle", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <PolicyDetailModal
        policy={mockPolicy}
        isOpen={true}
        onClose={mockOnClose}
        onVoteComment={mockOnVoteComment}
        onAddComment={mockOnAddComment}
        onSummarizePolicy={mockOnSummarizePolicy}
        simplifiedPolicyText="This is a simplified explanation"
        showSimplifiedSummary={false}
        onToggleSimplifiedSummary={mockOnToggleSimplifiedSummary}
      />,
    );

    const toggleButton = screen.getByRole("button", { name: "要約を開く" });
    await user.click(toggleButton);

    expect(mockOnToggleSimplifiedSummary).toHaveBeenCalledOnce();
  });
});

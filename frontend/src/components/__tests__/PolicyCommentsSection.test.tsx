import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Theme } from "@radix-ui/themes";
import { PolicyCommentsSection } from "../PolicyCommentsSection";
import type { Policy } from "../../types/policy";

const mockPolicyWithComments: Policy = {
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

const mockPolicyWithoutComments: Policy = {
  ...mockPolicyWithComments,
  comments: [],
};

function renderWithTheme(component: React.ReactElement) {
  return render(<Theme>{component}</Theme>);
}

describe("PolicyCommentsSection", () => {
  const mockOnVoteComment = vi.fn();
  const mockOnAddComment = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders comments section title", () => {
    renderWithTheme(
      <PolicyCommentsSection
        policy={mockPolicyWithComments}
        onVoteComment={mockOnVoteComment}
        onAddComment={mockOnAddComment}
      />,
    );

    expect(screen.getByText("市民の声")).toBeInTheDocument();
  });

  it("displays existing comments", () => {
    renderWithTheme(
      <PolicyCommentsSection
        policy={mockPolicyWithComments}
        onVoteComment={mockOnVoteComment}
        onAddComment={mockOnAddComment}
      />,
    );

    expect(screen.getByText("市民A")).toBeInTheDocument();
    expect(screen.getByText("Great policy!")).toBeInTheDocument();
    expect(screen.getByText("2024-01-01 12:00:00")).toBeInTheDocument();

    expect(screen.getByText("匿名市民")).toBeInTheDocument();
    expect(screen.getByText("I have concerns")).toBeInTheDocument();
    expect(screen.getByText("2024-01-02 14:30:00")).toBeInTheDocument();
  });

  it("displays message when no comments exist", () => {
    renderWithTheme(
      <PolicyCommentsSection
        policy={mockPolicyWithoutComments}
        onVoteComment={mockOnVoteComment}
        onAddComment={mockOnAddComment}
      />,
    );

    expect(
      screen.getByText(
        "まだコメントはありません。最初のコメントを投稿してみましょう！",
      ),
    ).toBeInTheDocument();
  });

  it("displays comment vote counts", () => {
    renderWithTheme(
      <PolicyCommentsSection
        policy={mockPolicyWithComments}
        onVoteComment={mockOnVoteComment}
        onAddComment={mockOnAddComment}
      />,
    );

    expect(screen.getByText("👍 3")).toBeInTheDocument();
    expect(screen.getByText("👎 1")).toBeInTheDocument();
    expect(screen.getByText("👍 1")).toBeInTheDocument();
    expect(screen.getByText("👎 2")).toBeInTheDocument();
  });

  it("handles comment upvoting", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <PolicyCommentsSection
        policy={mockPolicyWithComments}
        onVoteComment={mockOnVoteComment}
        onAddComment={mockOnAddComment}
      />,
    );

    const upvoteButtons = screen.getAllByText(/👍/);
    await user.click(upvoteButtons[0]);

    // Comments are displayed in reverse order, so first button is for comment2
    expect(mockOnVoteComment).toHaveBeenCalledWith("1", "comment2", "up");
  });

  it("handles comment downvoting", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <PolicyCommentsSection
        policy={mockPolicyWithComments}
        onVoteComment={mockOnVoteComment}
        onAddComment={mockOnAddComment}
      />,
    );

    const downvoteButtons = screen.getAllByText(/👎/);
    await user.click(downvoteButtons[0]);

    // Comments are displayed in reverse order, so first button is for comment2
    expect(mockOnVoteComment).toHaveBeenCalledWith("1", "comment2", "down");
  });

  it("renders comment form", () => {
    renderWithTheme(
      <PolicyCommentsSection
        policy={mockPolicyWithComments}
        onVoteComment={mockOnVoteComment}
        onAddComment={mockOnAddComment}
      />,
    );

    expect(
      screen.getByPlaceholderText(
        "この政策に対するあなたの意見を投稿してください...",
      ),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("匿名で投稿する")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "コメントを投稿" }),
    ).toBeInTheDocument();
  });

  it("submits comment with correct data", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <PolicyCommentsSection
        policy={mockPolicyWithComments}
        onVoteComment={mockOnVoteComment}
        onAddComment={mockOnAddComment}
      />,
    );

    const textarea = screen.getByPlaceholderText(
      "この政策に対するあなたの意見を投稿してください...",
    );
    const submitButton = screen.getByRole("button", { name: "コメントを投稿" });

    await user.type(textarea, "This is my test comment");
    await user.click(submitButton);

    expect(mockOnAddComment).toHaveBeenCalledWith(
      "1",
      "This is my test comment",
      false,
    );
  });

  it("submits anonymous comment", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <PolicyCommentsSection
        policy={mockPolicyWithComments}
        onVoteComment={mockOnVoteComment}
        onAddComment={mockOnAddComment}
      />,
    );

    const textarea = screen.getByPlaceholderText(
      "この政策に対するあなたの意見を投稿してください...",
    );
    const anonymousCheckbox = screen.getByLabelText("匿名で投稿する");
    const submitButton = screen.getByRole("button", { name: "コメントを投稿" });

    await user.type(textarea, "Anonymous comment");
    await user.click(anonymousCheckbox);
    await user.click(submitButton);

    expect(mockOnAddComment).toHaveBeenCalledWith(
      "1",
      "Anonymous comment",
      true,
    );
  });

  it("clears comment form after submission", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <PolicyCommentsSection
        policy={mockPolicyWithComments}
        onVoteComment={mockOnVoteComment}
        onAddComment={mockOnAddComment}
      />,
    );

    const textarea = screen.getByPlaceholderText(
      "この政策に対するあなたの意見を投稿してください...",
    );
    const submitButton = screen.getByRole("button", { name: "コメントを投稿" });

    await user.type(textarea, "Test comment");
    await user.click(submitButton);

    expect(textarea).toHaveValue("");
  });

  it("requires comment text for submission", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <PolicyCommentsSection
        policy={mockPolicyWithComments}
        onVoteComment={mockOnVoteComment}
        onAddComment={mockOnAddComment}
      />,
    );

    const submitButton = screen.getByRole("button", { name: "コメントを投稿" });
    await user.click(submitButton);

    // Form should not submit without required text
    expect(mockOnAddComment).not.toHaveBeenCalled();
  });

  it("displays comments in reverse chronological order", () => {
    renderWithTheme(
      <PolicyCommentsSection
        policy={mockPolicyWithComments}
        onVoteComment={mockOnVoteComment}
        onAddComment={mockOnAddComment}
      />,
    );

    const comments = screen.getAllByText(/2024-01-/);
    // The second comment (2024-01-02) should appear first due to reverse order
    expect(comments[0]).toHaveTextContent("2024-01-02 14:30:00");
    expect(comments[1]).toHaveTextContent("2024-01-01 12:00:00");
  });
});

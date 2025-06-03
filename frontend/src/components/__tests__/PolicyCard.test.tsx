import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Policy } from "../../types/policy";
import { PolicyCard } from "../PolicyCard";
import "@testing-library/jest-dom";

describe("PolicyCard", () => {
  const mockPolicy: Policy = {
    id: "1",
    title: "テスト政策",
    year: 2024,
    overview: "これはテスト用の政策概要です。",
    purpose: "テスト目的",
    detailedPlan: "詳細なテスト計画",
    problems: ["問題1", "問題2"],
    benefits: ["利点1", "利点2"],
    drawbacks: ["欠点1", "欠点2"],
    keywords: ["キーワード1", "キーワード2"],
    relatedEvents: ["関連イベント1"],
    upvotes: 10,
    downvotes: 3,
    status: "進行中",
    comments: [],
  };

  const defaultProps = {
    policy: mockPolicy,
    onPolicySelect: vi.fn(),
    onVote: vi.fn(),
    getStatusClasses: vi.fn(() => "bg-blue-100 text-blue-800"),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders policy information correctly", () => {
    render(<PolicyCard {...defaultProps} />);

    expect(screen.getByText("テスト政策")).toBeInTheDocument();
    expect(screen.getByText("年度: 2024")).toBeInTheDocument();
    expect(
      screen.getByText("これはテスト用の政策概要です。"),
    ).toBeInTheDocument();
  });

  it("renders keywords correctly", () => {
    render(<PolicyCard {...defaultProps} />);

    expect(screen.getByText("キーワード1")).toBeInTheDocument();
    expect(screen.getByText("キーワード2")).toBeInTheDocument();
  });

  it("displays vote counts correctly", () => {
    render(<PolicyCard {...defaultProps} />);

    expect(screen.getByText("👍 10")).toBeInTheDocument();
    expect(screen.getByText("👎 3")).toBeInTheDocument();
  });

  it("calculates and displays popularity correctly", () => {
    render(<PolicyCard {...defaultProps} />);

    // 10 upvotes + 3 downvotes = 13 total, 10/13 * 100 = 76.9% ≈ 77%
    expect(screen.getByText("人気度: 77%")).toBeInTheDocument();
  });

  it("displays popularity with correct color classes", () => {
    // High popularity (>= 70%)
    render(<PolicyCard {...defaultProps} />);
    const popularityElement = screen.getByText("人気度: 77%");
    expect(popularityElement).toHaveClass("text-green-600");
  });

  it("displays medium popularity with yellow color", () => {
    const mediumPopularityPolicy = {
      ...mockPolicy,
      upvotes: 5,
      downvotes: 5,
    };
    const props = { ...defaultProps, policy: mediumPopularityPolicy };
    render(<PolicyCard {...props} />);

    // 5/10 * 100 = 50%
    const popularityElement = screen.getByText("人気度: 50%");
    expect(popularityElement).toHaveClass("text-yellow-600");
  });

  it("displays low popularity with red color", () => {
    const lowPopularityPolicy = {
      ...mockPolicy,
      upvotes: 2,
      downvotes: 8,
    };
    const props = { ...defaultProps, policy: lowPopularityPolicy };
    render(<PolicyCard {...props} />);

    // 2/10 * 100 = 20%
    const popularityElement = screen.getByText("人気度: 20%");
    expect(popularityElement).toHaveClass("text-red-600");
  });

  it("displays '評価なし' when no votes", () => {
    const noVotesPolicy = {
      ...mockPolicy,
      upvotes: 0,
      downvotes: 0,
    };
    const props = { ...defaultProps, policy: noVotesPolicy };
    render(<PolicyCard {...props} />);

    expect(screen.getByText("評価なし")).toBeInTheDocument();
  });

  it("displays status with correct classes", () => {
    render(<PolicyCard {...defaultProps} />);

    const statusElement = screen.getByText("進行中");
    expect(statusElement).toBeInTheDocument();
    expect(defaultProps.getStatusClasses).toHaveBeenCalledWith("進行中");
  });

  it("calls onPolicySelect when card is clicked", () => {
    render(<PolicyCard {...defaultProps} />);

    const card = screen.getByText("テスト政策").closest("div");
    expect(card).not.toBeNull();
    if (card) fireEvent.click(card);

    expect(defaultProps.onPolicySelect).toHaveBeenCalledWith(mockPolicy);
  });

  it("calls onVote with correct parameters for upvote", () => {
    render(<PolicyCard {...defaultProps} />);

    const upvoteButton = screen.getByText("👍 10");
    fireEvent.click(upvoteButton);

    expect(defaultProps.onVote).toHaveBeenCalledWith("1", "up");
  });

  it("calls onVote with correct parameters for downvote", () => {
    render(<PolicyCard {...defaultProps} />);

    const downvoteButton = screen.getByText("👎 3");
    fireEvent.click(downvoteButton);

    expect(defaultProps.onVote).toHaveBeenCalledWith("1", "down");
  });

  it("prevents card click when voting buttons are clicked", () => {
    render(<PolicyCard {...defaultProps} />);

    const upvoteButton = screen.getByText("👍 10");
    fireEvent.click(upvoteButton);

    // onPolicySelect should not be called when voting
    expect(defaultProps.onPolicySelect).not.toHaveBeenCalled();
  });

  it("renders without keywords when keywords array is empty", () => {
    const policyWithoutKeywords = {
      ...mockPolicy,
      keywords: [],
    };
    const props = { ...defaultProps, policy: policyWithoutKeywords };
    render(<PolicyCard {...props} />);

    expect(screen.queryByText("キーワード1")).not.toBeInTheDocument();
    expect(screen.queryByText("キーワード2")).not.toBeInTheDocument();
  });

  it("renders without status when status is not provided", () => {
    const policyWithoutStatus = {
      ...mockPolicy,
      status: undefined,
    };
    const props = { ...defaultProps, policy: policyWithoutStatus };
    render(<PolicyCard {...props} />);

    expect(screen.queryByText("進行中")).not.toBeInTheDocument();
  });

  it("has proper styling classes", () => {
    const { container } = render(<PolicyCard {...defaultProps} />);

    // カードの最上位要素を取得
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass(
      "bg-white",
      "p-6",
      "rounded-lg",
      "shadow-lg",
      "hover:shadow-xl",
      "transition-shadow",
      "duration-300",
      "cursor-pointer",
      "border",
      "border-gray-200",
      "flex",
      "flex-col",
      "justify-between",
    );
  });

  it("handles missing upvotes and downvotes gracefully", () => {
    const policyWithMissingVotes = {
      ...mockPolicy,
      upvotes: 0,
      downvotes: 0,
    };
    const props = { ...defaultProps, policy: policyWithMissingVotes };
    render(<PolicyCard {...props} />);

    expect(screen.getByText("👍 0")).toBeInTheDocument();
    expect(screen.getByText("👎 0")).toBeInTheDocument();
    expect(screen.getByText("評価なし")).toBeInTheDocument();
  });
});

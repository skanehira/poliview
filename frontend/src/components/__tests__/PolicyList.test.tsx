import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Policy } from "../../types/policy";
import { PolicyList } from "../PolicyList";
import "@testing-library/jest-dom";

describe("PolicyList", () => {
  const mockPolicies: Policy[] = [
    {
      id: "1",
      title: "環境政策",
      year: 2024,
      overview: "環境保護のための政策です。",
      purpose: "地球環境を守る",
      detailedPlan: "詳細な環境保護計画",
      problems: ["公害問題"],
      benefits: ["清浄な空気"],
      drawbacks: ["コスト増"],
      keywords: ["環境", "エコ"],
      relatedEvents: ["環境サミット"],
      upvotes: 15,
      downvotes: 2,
      status: "進行中",
      comments: [],
    },
    {
      id: "2",
      title: "教育政策",
      year: 2023,
      overview: "教育改革のための政策です。",
      purpose: "教育水準向上",
      detailedPlan: "詳細な教育改革計画",
      problems: ["教育格差"],
      benefits: ["学力向上"],
      drawbacks: ["予算不足"],
      keywords: ["教育", "学校"],
      relatedEvents: ["教育会議"],
      upvotes: 8,
      downvotes: 5,
      status: "完了",
      comments: [],
    },
    {
      id: "3",
      title: "交通政策",
      year: 2024,
      overview: "交通網整備のための政策です。",
      purpose: "交通渋滞解消",
      detailedPlan: "詳細な交通改善計画",
      problems: ["渋滞問題"],
      benefits: ["移動時間短縮"],
      drawbacks: ["工事による一時的な混乱"],
      keywords: ["交通", "道路"],
      relatedEvents: ["交通会議"],
      upvotes: 12,
      downvotes: 3,
      status: "進行中",
      comments: [],
    },
  ];

  const defaultProps = {
    policies: mockPolicies,
    searchTerm: "",
    onPolicySelect: vi.fn(),
    onVote: vi.fn(),
    getStatusClasses: vi.fn(() => "bg-blue-100 text-blue-800"),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all policies when no search term", () => {
    render(<PolicyList {...defaultProps} />);

    expect(screen.getByText("環境政策")).toBeInTheDocument();
    expect(screen.getByText("教育政策")).toBeInTheDocument();
    expect(screen.getByText("交通政策")).toBeInTheDocument();
  });

  it("filters policies by title search term", () => {
    const props = { ...defaultProps, searchTerm: "環境" };
    render(<PolicyList {...props} />);

    expect(screen.getByText("環境政策")).toBeInTheDocument();
    expect(screen.queryByText("教育政策")).not.toBeInTheDocument();
    expect(screen.queryByText("交通政策")).not.toBeInTheDocument();
  });

  it("filters policies by purpose search term", () => {
    const props = { ...defaultProps, searchTerm: "教育水準" };
    render(<PolicyList {...props} />);

    expect(screen.queryByText("環境政策")).not.toBeInTheDocument();
    expect(screen.getByText("教育政策")).toBeInTheDocument();
    expect(screen.queryByText("交通政策")).not.toBeInTheDocument();
  });

  it("filters policies by overview search term", () => {
    const props = { ...defaultProps, searchTerm: "交通網整備" };
    render(<PolicyList {...props} />);

    expect(screen.queryByText("環境政策")).not.toBeInTheDocument();
    expect(screen.queryByText("教育政策")).not.toBeInTheDocument();
    expect(screen.getByText("交通政策")).toBeInTheDocument();
  });

  it("filters policies by detailed plan search term", () => {
    const props = { ...defaultProps, searchTerm: "環境保護計画" };
    render(<PolicyList {...props} />);

    expect(screen.getByText("環境政策")).toBeInTheDocument();
    expect(screen.queryByText("教育政策")).not.toBeInTheDocument();
    expect(screen.queryByText("交通政策")).not.toBeInTheDocument();
  });

  it("filters policies by problems search term", () => {
    const props = { ...defaultProps, searchTerm: "教育格差" };
    render(<PolicyList {...props} />);

    expect(screen.queryByText("環境政策")).not.toBeInTheDocument();
    expect(screen.getByText("教育政策")).toBeInTheDocument();
    expect(screen.queryByText("交通政策")).not.toBeInTheDocument();
  });

  it("filters policies by keywords search term", () => {
    const props = { ...defaultProps, searchTerm: "エコ" };
    render(<PolicyList {...props} />);

    expect(screen.getByText("環境政策")).toBeInTheDocument();
    expect(screen.queryByText("教育政策")).not.toBeInTheDocument();
    expect(screen.queryByText("交通政策")).not.toBeInTheDocument();
  });

  it("filters policies by related events search term", () => {
    const props = { ...defaultProps, searchTerm: "交通会議" };
    render(<PolicyList {...props} />);

    expect(screen.queryByText("環境政策")).not.toBeInTheDocument();
    expect(screen.queryByText("教育政策")).not.toBeInTheDocument();
    expect(screen.getByText("交通政策")).toBeInTheDocument();
  });

  it("is case insensitive when filtering", () => {
    const props = { ...defaultProps, searchTerm: "環境" };
    render(<PolicyList {...props} />);

    expect(screen.getByText("環境政策")).toBeInTheDocument();
    expect(screen.queryByText("教育政策")).not.toBeInTheDocument();
    expect(screen.queryByText("交通政策")).not.toBeInTheDocument();
  });

  it("shows no results message when search term doesn't match any policies", () => {
    const props = { ...defaultProps, searchTerm: "存在しない政策" };
    render(<PolicyList {...props} />);

    expect(
      screen.getByText(
        "「存在しない政策」に一致する政策は見つかりませんでした。",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText("環境政策")).not.toBeInTheDocument();
  });

  it("shows empty state message when no policies and no search term", () => {
    const props = { ...defaultProps, policies: [], searchTerm: "" };
    render(<PolicyList {...props} />);

    expect(
      screen.getByText(
        "現在、登録されている政策はありません。ダミーデータが自動的に読み込まれます。",
      ),
    ).toBeInTheDocument();
  });

  it("displays policies in grid layout", () => {
    render(<PolicyList {...defaultProps} />);

    const gridContainer = screen.getAllByText("環境政策")[0].closest("div")
      ?.parentElement?.parentElement;
    expect(gridContainer).toHaveClass(
      "grid",
      "grid-cols-1",
      "gap-6",
      "sm:grid-cols-2",
      "lg:grid-cols-3",
    );
  });

  it("passes correct props to PolicyCard components", () => {
    render(<PolicyList {...defaultProps} />);

    // Check that PolicyCard components receive the correct props
    expect(defaultProps.getStatusClasses).toHaveBeenCalledWith("進行中");
    expect(defaultProps.getStatusClasses).toHaveBeenCalledWith("完了");
  });

  it("calls onPolicySelect when a policy card is clicked", () => {
    render(<PolicyList {...defaultProps} />);

    const policyCard = screen.getAllByText("環境政策")[0].closest("div");
    if (policyCard) {
      fireEvent.click(policyCard);
    }

    expect(defaultProps.onPolicySelect).toHaveBeenCalledWith(mockPolicies[0]);
  });

  it("calls onVote when voting on a policy", () => {
    render(<PolicyList {...defaultProps} />);

    const upvoteButton = screen.getByText("👍 15");
    fireEvent.click(upvoteButton);

    expect(defaultProps.onVote).toHaveBeenCalledWith("1", "up");
  });

  it("renders multiple policies with different data", () => {
    render(<PolicyList {...defaultProps} />);

    // Check that all policies are rendered with their specific data
    expect(screen.getByText("環境政策")).toBeInTheDocument();
    expect(screen.getAllByText("年度: 2024")).toHaveLength(2); // 環境政策と交通政策が両方2024年
    expect(screen.getByText("👍 15")).toBeInTheDocument();

    expect(screen.getByText("教育政策")).toBeInTheDocument();
    expect(screen.getByText("年度: 2023")).toBeInTheDocument();
    expect(screen.getByText("👍 8")).toBeInTheDocument();

    expect(screen.getByText("交通政策")).toBeInTheDocument();
    expect(screen.getByText("👍 12")).toBeInTheDocument();
  });

  it("handles policies with missing optional fields", () => {
    const policiesWithMissingFields: Policy[] = [
      {
        id: "1",
        title: "最小限政策",
        year: 2024,
        overview: "最小限の情報のみ",
        purpose: "テスト目的",
        detailedPlan: "テスト計画",
        problems: [],
        benefits: [],
        drawbacks: [],
        keywords: [],
        relatedEvents: [],
        upvotes: 0,
        downvotes: 0,
        status: "進行中",
        comments: [],
      },
    ];

    const props = { ...defaultProps, policies: policiesWithMissingFields };
    render(<PolicyList {...props} />);

    expect(screen.getByText("最小限政策")).toBeInTheDocument();
  });
});

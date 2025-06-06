import { Theme } from "@radix-ui/themes";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Policy } from "../../types/policy";
import {
  PolicyBenefitsSection,
  PolicyMetadataSection,
} from "../PolicyMetadataSection";

function renderWithTheme(component: React.ReactElement) {
  return render(<Theme>{component}</Theme>);
}

describe("PolicyMetadataSection", () => {
  const basePolicyData = {
    id: "1",
    title: "Test Policy",
    purpose: "Test purpose",
    overview: "Test overview",
    detailedPlan: "Test detailed plan",
    problems: ["Problem 1", "Problem 2"],
    benefits: ["Benefit 1"],
    drawbacks: ["Drawback 1"],
    year: 2024,
    keywords: ["test", "policy"],
    relatedEvents: ["Event 1", "Event 2"],
    comments: [],
  };

  it("displays basic policy information", () => {
    const policy: Policy = {
      ...basePolicyData,
      upvotes: 10,
      downvotes: 5,
    };

    renderWithTheme(<PolicyMetadataSection policy={policy} />);

    expect(screen.getByText("年度: 2024")).toBeInTheDocument();
    expect(screen.getByText("目的")).toBeInTheDocument();
    expect(screen.getByText("Test purpose")).toBeInTheDocument();
    expect(screen.getByText("概要")).toBeInTheDocument();
    expect(screen.getByText("Test overview")).toBeInTheDocument();
  });

  it("displays status when provided", () => {
    const policy: Policy = {
      ...basePolicyData,
      status: "進行中",
      upvotes: 5,
      downvotes: 2,
    };

    renderWithTheme(<PolicyMetadataSection policy={policy} />);

    expect(screen.getByText("ステータス")).toBeInTheDocument();
    expect(screen.getByText("進行中")).toBeInTheDocument();
  });

  it("applies correct status styling for 完了", () => {
    const policy: Policy = {
      ...basePolicyData,
      status: "完了",
      upvotes: 5,
      downvotes: 2,
    };

    renderWithTheme(<PolicyMetadataSection policy={policy} />);

    const statusElement = screen.getByText("完了");
    expect(statusElement).toHaveClass("rt-reset", "rt-Badge");
    expect(statusElement).toHaveAttribute("data-accent-color", "green");
  });

  it("applies correct status styling for 進行中", () => {
    const policy: Policy = {
      ...basePolicyData,
      status: "進行中",
      upvotes: 5,
      downvotes: 2,
    };

    renderWithTheme(<PolicyMetadataSection policy={policy} />);

    const statusElement = screen.getByText("進行中");
    expect(statusElement).toHaveClass("rt-reset", "rt-Badge");
    expect(statusElement).toHaveAttribute("data-accent-color", "blue");
  });

  it("applies correct status styling for 中止", () => {
    const policy: Policy = {
      ...basePolicyData,
      status: "中止",
      upvotes: 5,
      downvotes: 2,
    };

    renderWithTheme(<PolicyMetadataSection policy={policy} />);

    const statusElement = screen.getByText("中止");
    expect(statusElement).toHaveClass("rt-reset", "rt-Badge");
    expect(statusElement).toHaveAttribute("data-accent-color", "red");
  });

  it("displays budget when provided", () => {
    const policy: Policy = {
      ...basePolicyData,
      budget: 1500000,
      upvotes: 5,
      downvotes: 2,
    };

    renderWithTheme(<PolicyMetadataSection policy={policy} />);

    expect(screen.getByText("予算")).toBeInTheDocument();
    expect(screen.getByText("1,500,000 円")).toBeInTheDocument();
  });

  it("does not display budget when not provided", () => {
    const policy: Policy = {
      ...basePolicyData,
      upvotes: 5,
      downvotes: 2,
    };

    renderWithTheme(<PolicyMetadataSection policy={policy} />);

    expect(screen.queryByText("予算")).not.toBeInTheDocument();
  });

  it("displays budget when budget is 0", () => {
    const policy: Policy = {
      ...basePolicyData,
      budget: 0,
      upvotes: 5,
      downvotes: 2,
    };

    renderWithTheme(<PolicyMetadataSection policy={policy} />);

    expect(screen.getByText("予算")).toBeInTheDocument();
    expect(screen.getByText("0 円")).toBeInTheDocument();
  });

  it("calculates and displays popularity correctly", () => {
    const policy: Policy = {
      ...basePolicyData,
      upvotes: 15,
      downvotes: 5,
    };

    renderWithTheme(<PolicyMetadataSection policy={policy} />);

    expect(screen.getByText("人気度")).toBeInTheDocument();
    expect(screen.getByText("75%")).toBeInTheDocument(); // 15/(15+5) * 100 = 75%
  });

  it("applies correct popularity color styling for high popularity", () => {
    const policy: Policy = {
      ...basePolicyData,
      upvotes: 80,
      downvotes: 20,
    };

    renderWithTheme(<PolicyMetadataSection policy={policy} />);

    const popularityElement = screen.getByText("80%"); // 80/(80+20) * 100 = 80%
    expect(popularityElement).toHaveAttribute("data-accent-color", "green");
  });

  it("applies correct popularity color styling for medium popularity", () => {
    const policy: Policy = {
      ...basePolicyData,
      upvotes: 50,
      downvotes: 50,
    };

    renderWithTheme(<PolicyMetadataSection policy={policy} />);

    const popularityElement = screen.getByText("50%");
    expect(popularityElement).toHaveAttribute("data-accent-color", "yellow");
  });

  it("applies correct popularity color styling for low popularity", () => {
    const policy: Policy = {
      ...basePolicyData,
      upvotes: 20,
      downvotes: 80,
    };

    renderWithTheme(<PolicyMetadataSection policy={policy} />);

    const popularityElement = screen.getByText("20%");
    expect(popularityElement).toHaveAttribute("data-accent-color", "red");
  });

  it("displays problems section when problems exist", () => {
    const policy: Policy = {
      ...basePolicyData,
      upvotes: 5,
      downvotes: 2,
    };

    renderWithTheme(<PolicyMetadataSection policy={policy} />);

    expect(screen.getByText("解決したい問題点")).toBeInTheDocument();
    expect(screen.getByText("• Problem 1")).toBeInTheDocument();
    expect(screen.getByText("• Problem 2")).toBeInTheDocument();
  });

  it("displays detailed plan when provided", () => {
    const policy: Policy = {
      ...basePolicyData,
      upvotes: 5,
      downvotes: 2,
    };

    renderWithTheme(<PolicyMetadataSection policy={policy} />);

    expect(screen.getByText("具体的計画の内容")).toBeInTheDocument();
    expect(screen.getByText("Test detailed plan")).toBeInTheDocument();
  });

  it("displays benefits section", () => {
    const policy: Policy = {
      ...basePolicyData,
      upvotes: 5,
      downvotes: 2,
    };

    renderWithTheme(<PolicyBenefitsSection policy={policy} />);

    expect(screen.getByText("メリット")).toBeInTheDocument();
    expect(screen.getByText("• Benefit 1")).toBeInTheDocument();
  });

  it("displays drawbacks section", () => {
    const policy: Policy = {
      ...basePolicyData,
      upvotes: 5,
      downvotes: 2,
    };

    renderWithTheme(<PolicyBenefitsSection policy={policy} />);

    expect(screen.getByText("デメリット")).toBeInTheDocument();
    expect(screen.getByText("• Drawback 1")).toBeInTheDocument();
  });

  it("displays keywords section", () => {
    const policy: Policy = {
      ...basePolicyData,
      upvotes: 5,
      downvotes: 2,
    };

    renderWithTheme(<PolicyBenefitsSection policy={policy} />);

    expect(screen.getByText("関連キーワード")).toBeInTheDocument();
    expect(screen.getByText("test")).toBeInTheDocument();
    expect(screen.getByText("policy")).toBeInTheDocument();
  });

  it("displays related events section", () => {
    const policy: Policy = {
      ...basePolicyData,
      upvotes: 5,
      downvotes: 2,
    };

    renderWithTheme(<PolicyBenefitsSection policy={policy} />);

    expect(screen.getByText("政策に関するイベント")).toBeInTheDocument();
    expect(screen.getByText("Event 1")).toBeInTheDocument();
    expect(screen.getByText("Event 2")).toBeInTheDocument();
  });

  it("does not display optional sections when data is empty", () => {
    const policy: Policy = {
      ...basePolicyData,
      problems: [],
      benefits: [],
      drawbacks: [],
      keywords: [],
      relatedEvents: [],
      detailedPlan: "",
      upvotes: 5,
      downvotes: 2,
    };

    renderWithTheme(<PolicyMetadataSection policy={policy} />);

    expect(screen.queryByText("解決したい問題点")).not.toBeInTheDocument();
    expect(screen.queryByText("具体的計画の内容")).not.toBeInTheDocument();

    // Test PolicyBenefitsSection separately for benefits, drawbacks, etc.
    const { container } = render(
      <Theme>
        <PolicyBenefitsSection policy={policy} />
      </Theme>,
    );

    // Benefits section should not render anything when data is empty
    expect(container.textContent).toBe("");
  });
});

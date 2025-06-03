import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "../Header";
import "@testing-library/jest-dom";

describe("Header", () => {
  const defaultProps = {
    searchTerm: "",
    setSearchTerm: vi.fn(),
    activeTab: "policies" as const,
    setActiveTab: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the app title", () => {
    render(<Header {...defaultProps} />);

    expect(screen.getByText("市政の可視化アプリ")).toBeInTheDocument();
  });

  it("renders search input with placeholder", () => {
    render(<Header {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText(
      "キーワードで政策を検索...",
    );
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveValue("");
  });

  it("displays current search term in input", () => {
    const props = { ...defaultProps, searchTerm: "テスト検索" };
    render(<Header {...props} />);

    const searchInput = screen.getByPlaceholderText(
      "キーワードで政策を検索...",
    );
    expect(searchInput).toHaveValue("テスト検索");
  });

  it("calls setSearchTerm when search input changes", () => {
    render(<Header {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText(
      "キーワードで政策を検索...",
    );
    fireEvent.change(searchInput, { target: { value: "新しい検索" } });

    expect(defaultProps.setSearchTerm).toHaveBeenCalledWith("新しい検索");
  });

  it("renders both tab buttons", () => {
    render(<Header {...defaultProps} />);

    expect(screen.getByText("政策一覧")).toBeInTheDocument();
    expect(screen.getByText("市政の収支")).toBeInTheDocument();
  });

  it('shows policies tab as active when activeTab is "policies"', () => {
    const props = { ...defaultProps, activeTab: "policies" as const };
    render(<Header {...props} />);

    const policiesButton = screen.getByText("政策一覧");
    const financeButton = screen.getByText("市政の収支");

    // アクティブなタブのスタイルクラスを確認
    expect(policiesButton).toHaveClass(
      "border-b-2",
      "border-white",
      "text-white",
    );
    expect(financeButton).toHaveClass("text-blue-200", "hover:text-white");
  });

  it('shows finance tab as active when activeTab is "finance"', () => {
    const props = { ...defaultProps, activeTab: "finance" as const };
    render(<Header {...props} />);

    const policiesButton = screen.getByText("政策一覧");
    const financeButton = screen.getByText("市政の収支");

    // アクティブなタブのスタイルクラスを確認
    expect(financeButton).toHaveClass(
      "border-b-2",
      "border-white",
      "text-white",
    );
    expect(policiesButton).toHaveClass("text-blue-200", "hover:text-white");
  });

  it('calls setActiveTab with "policies" when policies tab is clicked', () => {
    render(<Header {...defaultProps} />);

    const policiesButton = screen.getByText("政策一覧");
    fireEvent.click(policiesButton);

    expect(defaultProps.setActiveTab).toHaveBeenCalledWith("policies");
  });

  it('calls setActiveTab with "finance" when finance tab is clicked', () => {
    render(<Header {...defaultProps} />);

    const financeButton = screen.getByText("市政の収支");
    fireEvent.click(financeButton);

    expect(defaultProps.setActiveTab).toHaveBeenCalledWith("finance");
  });

  it("has proper header styling classes", () => {
    render(<Header {...defaultProps} />);

    const header = screen.getByRole("banner");
    expect(header).toHaveClass(
      "fixed",
      "top-0",
      "left-0",
      "w-full",
      "bg-blue-600",
      "text-white",
      "p-4",
      "shadow-md",
      "rounded-b-lg",
      "z-10",
    );
  });

  it("has responsive layout classes", () => {
    render(<Header {...defaultProps} />);

    // コンテナクラスの確認
    const container = screen.getByText("市政の可視化アプリ").closest("div");
    expect(container).toHaveClass(
      "container",
      "mx-auto",
      "flex",
      "flex-col",
      "sm:flex-row",
      "justify-between",
      "items-center",
    );
  });

  it("search input has proper styling and focus states", () => {
    render(<Header {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText(
      "キーワードで政策を検索...",
    );
    expect(searchInput).toHaveClass(
      "p-2",
      "rounded-md",
      "border",
      "border-gray-300",
      "text-gray-800",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-blue-400",
      "w-full",
      "sm:w-64",
    );
  });
});

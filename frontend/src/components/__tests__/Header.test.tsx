import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
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

    expect(screen.getAllByText("政策一覧")).toHaveLength(2);
    expect(screen.getAllByText("市政の収支")).toHaveLength(2);
  });

  it('shows policies tab as active when activeTab is "policies"', () => {
    const props = { ...defaultProps, activeTab: "policies" as const };
    render(<Header {...props} />);

    const tabs = screen.getAllByRole("tab");
    const policiesButton = tabs[0];
    const financeButton = tabs[1];

    // Radix UIのタブコンポーネントの状態を確認
    expect(policiesButton).toHaveAttribute("aria-selected", "true");
    expect(financeButton).toHaveAttribute("aria-selected", "false");
  });

  it('shows finance tab as active when activeTab is "finance"', () => {
    const props = { ...defaultProps, activeTab: "finance" as const };
    render(<Header {...props} />);

    const tabs = screen.getAllByRole("tab");
    const policiesButton = tabs[0];
    const financeButton = tabs[1];

    // Radix UIのタブコンポーネントの状態を確認
    expect(financeButton).toHaveAttribute("aria-selected", "true");
    expect(policiesButton).toHaveAttribute("aria-selected", "false");
  });

  it('calls setActiveTab with "policies" when policies tab is clicked', async () => {
    const user = userEvent.setup();
    const mockSetActiveTab = vi.fn();
    const props = {
      ...defaultProps,
      activeTab: "finance" as const,
      setActiveTab: mockSetActiveTab,
    };
    render(<Header {...props} />);

    const policiesButton = screen.getAllByText("政策一覧")[0];
    await user.click(policiesButton);

    expect(mockSetActiveTab).toHaveBeenCalledWith("policies");
  });

  it('calls setActiveTab with "finance" when finance tab is clicked', async () => {
    const user = userEvent.setup();
    const mockSetActiveTab = vi.fn();
    const props = {
      ...defaultProps,
      activeTab: "policies" as const,
      setActiveTab: mockSetActiveTab,
    };
    render(<Header {...props} />);

    const financeButton = screen.getAllByText("市政の収支")[0];
    await user.click(financeButton);

    expect(mockSetActiveTab).toHaveBeenCalledWith("finance");
  });

  it("has proper header structure and accessibility", () => {
    render(<Header {...defaultProps} />);

    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();

    // ヘッダーが固定位置にあることを確認
    expect(header).toHaveStyle({ position: "fixed" });
  });

  it("has proper tab navigation accessibility", () => {
    render(<Header {...defaultProps} />);

    // タブリストが存在することを確認
    const tablist = screen.getByRole("tablist");
    expect(tablist).toBeInTheDocument();

    // 2つのタブが存在することを確認
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(2);
  });

  it("search input is properly accessible", () => {
    render(<Header {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText(
      "キーワードで政策を検索...",
    );

    // 入力フィールドが適切にアクセス可能であることを確認
    expect(searchInput).toBeInTheDocument();
    // Radix UI TextFieldでは、内部のinput要素に対してチェックする
    expect(searchInput).toHaveRole("textbox");
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Theme } from "@radix-ui/themes";
import { PolicyAddModal } from "../PolicyAddModal";

function renderWithTheme(component: React.ReactElement) {
  return render(<Theme>{component}</Theme>);
}

describe("PolicyAddModal", () => {
  const mockOnClose = vi.fn();
  const mockOnAddPolicy = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders modal when isOpen is true", () => {
    renderWithTheme(
      <PolicyAddModal
        isOpen={true}
        onClose={mockOnClose}
        onAddPolicy={mockOnAddPolicy}
      />,
    );

    expect(screen.getByText("新しい政策を追加")).toBeInTheDocument();
    expect(screen.getByLabelText("政策タイトル")).toBeInTheDocument();
    expect(screen.getByLabelText("年度")).toBeInTheDocument();
    expect(screen.getByLabelText("政策の目的")).toBeInTheDocument();
    expect(screen.getByLabelText("政策の概要")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    renderWithTheme(
      <PolicyAddModal
        isOpen={false}
        onClose={mockOnClose}
        onAddPolicy={mockOnAddPolicy}
      />,
    );

    expect(screen.queryByText("新しい政策を追加")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <PolicyAddModal
        isOpen={true}
        onClose={mockOnClose}
        onAddPolicy={mockOnAddPolicy}
      />,
    );

    const closeButton = screen.getByRole("button", { name: "×" });
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  it("displays all required form fields", () => {
    renderWithTheme(
      <PolicyAddModal
        isOpen={true}
        onClose={mockOnClose}
        onAddPolicy={mockOnAddPolicy}
      />,
    );

    // Required fields
    expect(screen.getByLabelText("政策タイトル")).toBeRequired();
    expect(screen.getByLabelText("年度")).toBeRequired();
    expect(screen.getByLabelText("政策の目的")).toBeRequired();
    expect(screen.getByLabelText("政策の概要")).toBeRequired();
    expect(screen.getByLabelText("ステータス")).toBeRequired();

    // Optional fields
    expect(screen.getByLabelText("具体的計画の内容")).toBeInTheDocument();
    expect(
      screen.getByLabelText("解決したい問題点 (カンマ区切り)"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("メリット (カンマ区切り)"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("デメリット (カンマ区切り)"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("キーワード (カンマ区切り)"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("政策に関するイベント (カンマ区切り)"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("予算 (円)")).toBeInTheDocument();
  });

  it("has default values in form fields", () => {
    renderWithTheme(
      <PolicyAddModal
        isOpen={true}
        onClose={mockOnClose}
        onAddPolicy={mockOnAddPolicy}
      />,
    );

    const currentYear = new Date().getFullYear();
    expect(
      screen.getByDisplayValue(currentYear.toString()),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("進行中")).toBeInTheDocument();
  });

  it("updates form fields when user types", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <PolicyAddModal
        isOpen={true}
        onClose={mockOnClose}
        onAddPolicy={mockOnAddPolicy}
      />,
    );

    const titleInput = screen.getByLabelText("政策タイトル");
    await user.type(titleInput, "テスト政策");

    expect(titleInput).toHaveValue("テスト政策");
  });

  it("submits form with correct data structure", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <PolicyAddModal
        isOpen={true}
        onClose={mockOnClose}
        onAddPolicy={mockOnAddPolicy}
      />,
    );

    // Fill in required fields
    await user.type(screen.getByLabelText("政策タイトル"), "テスト政策");
    await user.type(screen.getByLabelText("政策の目的"), "テストの目的");
    await user.type(screen.getByLabelText("政策の概要"), "テストの概要");

    // Fill in optional fields
    await user.type(
      screen.getByLabelText("メリット (カンマ区切り)"),
      "メリット1, メリット2",
    );
    await user.type(
      screen.getByLabelText("デメリット (カンマ区切り)"),
      "デメリット1, デメリット2",
    );
    await user.type(screen.getByLabelText("予算 (円)"), "1000000");

    const submitButton = screen.getByRole("button", { name: "政策を保存" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnAddPolicy).toHaveBeenCalledWith({
        title: "テスト政策",
        purpose: "テストの目的",
        overview: "テストの概要",
        detailedPlan: "",
        problems: [],
        benefits: ["メリット1", "メリット2"],
        drawbacks: ["デメリット1", "デメリット2"],
        year: new Date().getFullYear(),
        keywords: [],
        relatedEvents: [],
        budget: 1000000,
        status: "進行中",
      });
    });

    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  it("handles comma-separated fields correctly", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <PolicyAddModal
        isOpen={true}
        onClose={mockOnClose}
        onAddPolicy={mockOnAddPolicy}
      />,
    );

    // Fill in required fields
    await user.type(screen.getByLabelText("政策タイトル"), "テスト政策");
    await user.type(screen.getByLabelText("政策の目的"), "テストの目的");
    await user.type(screen.getByLabelText("政策の概要"), "テストの概要");

    // Test comma-separated fields with extra spaces
    await user.type(
      screen.getByLabelText("キーワード (カンマ区切り)"),
      " キーワード1 , キーワード2 , キーワード3 ",
    );

    const submitButton = screen.getByRole("button", { name: "政策を保存" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnAddPolicy).toHaveBeenCalledWith(
        expect.objectContaining({
          keywords: ["キーワード1", "キーワード2", "キーワード3"],
        }),
      );
    });
  });

  it("shows confirmation dialog when closing with unsaved changes", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <PolicyAddModal
        isOpen={true}
        onClose={mockOnClose}
        onAddPolicy={mockOnAddPolicy}
      />,
    );

    // Make changes to trigger unsaved state
    await user.type(screen.getByLabelText("政策タイトル"), "変更");

    // Try to close
    const closeButton = screen.getByRole("button", { name: "×" });
    await user.click(closeButton);

    // Should show confirmation dialog
    expect(
      screen.getByText("未保存の変更があります。破棄して閉じますか？"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "はい" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "いいえ" })).toBeInTheDocument();

    // onClose should not be called yet
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("closes without confirmation when no changes made", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <PolicyAddModal
        isOpen={true}
        onClose={mockOnClose}
        onAddPolicy={mockOnAddPolicy}
      />,
    );

    const closeButton = screen.getByRole("button", { name: "×" });
    await user.click(closeButton);

    // Should close directly without confirmation
    expect(
      screen.queryByText("未保存の変更があります。破棄して閉じますか？"),
    ).not.toBeInTheDocument();
    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  it("confirms discard changes and closes", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <PolicyAddModal
        isOpen={true}
        onClose={mockOnClose}
        onAddPolicy={mockOnAddPolicy}
      />,
    );

    // Make changes
    await user.type(screen.getByLabelText("政策タイトル"), "変更");

    // Try to close
    const closeButton = screen.getByRole("button", { name: "×" });
    await user.click(closeButton);

    // Confirm discard
    const confirmButton = screen.getByRole("button", { name: "はい" });
    await user.click(confirmButton);

    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  it("cancels discard and keeps modal open", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <PolicyAddModal
        isOpen={true}
        onClose={mockOnClose}
        onAddPolicy={mockOnAddPolicy}
      />,
    );

    // Make changes
    await user.type(screen.getByLabelText("政策タイトル"), "変更");

    // Try to close
    const closeButton = screen.getByRole("button", { name: "×" });
    await user.click(closeButton);

    // Cancel discard
    const cancelButton = screen.getByRole("button", { name: "いいえ" });
    await user.click(cancelButton);

    // Should still be open
    expect(screen.getByText("新しい政策を追加")).toBeInTheDocument();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("validates required fields", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <PolicyAddModal
        isOpen={true}
        onClose={mockOnClose}
        onAddPolicy={mockOnAddPolicy}
      />,
    );

    // Try to submit without filling required fields
    const submitButton = screen.getByRole("button", { name: "政策を保存" });
    await user.click(submitButton);

    // Should not call onAddPolicy
    expect(mockOnAddPolicy).not.toHaveBeenCalled();
  });

  it("handles status selection correctly", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <PolicyAddModal
        isOpen={true}
        onClose={mockOnClose}
        onAddPolicy={mockOnAddPolicy}
      />,
    );

    // Fill required fields
    await user.type(screen.getByLabelText("政策タイトル"), "テスト政策");
    await user.type(screen.getByLabelText("政策の目的"), "テストの目的");
    await user.type(screen.getByLabelText("政策の概要"), "テストの概要");

    // Change status
    const statusSelect = screen.getByLabelText("ステータス");
    await user.selectOptions(statusSelect, "完了");

    const submitButton = screen.getByRole("button", { name: "政策を保存" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnAddPolicy).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "完了",
        }),
      );
    });
  });

  it("renders proper dialog structure", () => {
    renderWithTheme(
      <PolicyAddModal
        isOpen={true}
        onClose={mockOnClose}
        onAddPolicy={mockOnAddPolicy}
      />,
    );

    // Check for Dialog.Title
    expect(screen.getByText("新しい政策を追加")).toBeInTheDocument();

    // Check for close button
    expect(screen.getByRole("button", { name: "×" })).toBeInTheDocument();

    // Check for submit button
    expect(
      screen.getByRole("button", { name: "政策を保存" }),
    ).toBeInTheDocument();
  });
});

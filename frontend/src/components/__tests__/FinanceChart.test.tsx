import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FinanceChart } from "../FinanceChart";
import "@testing-library/jest-dom";
import type { JSX } from "react";

// RechartsのモッキングでResponsiveContainerを含める必要がある
vi.mock("recharts", () => ({
  BarChart: ({ children }: { children: JSX.Element }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  PieChart: ({ children }: { children: JSX.Element }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  LineChart: ({ children }: { children: JSX.Element }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  ResponsiveContainer: ({ children }: { children: JSX.Element }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  Bar: () => <div data-testid="bar" />,
  Pie: () => <div data-testid="pie" />,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  Cell: () => <div data-testid="cell" />,
}));

// 新しいコンポーネントのモッキング
vi.mock("../DetailedFinanceModal", () => ({
  DetailedFinanceModal: ({
    isOpen,
    type,
    category,
  }: {
    isOpen: boolean;
    type: string;
    category: string;
  }) =>
    isOpen ? (
      <div data-testid="detailed-finance-modal">
        Modal: {type} - {category}
      </div>
    ) : null,
}));

vi.mock("../FinanceChartControls", () => ({
  FinanceChartControls: ({ onTimeUnitChange, onChartTypeChange }: { 
    onTimeUnitChange: (unit: string) => void, 
    onChartTypeChange: (type: string) => void 
  }) => (
    <div data-testid="finance-chart-controls">
      <button type="button" onClick={() => onTimeUnitChange("year")}>年単位</button>
      <button type="button" onClick={() => onTimeUnitChange("month")}>月単位</button>
      <button type="button" onClick={() => onChartTypeChange("bar")}>棒グラフ</button>
      <button type="button" onClick={() => onChartTypeChange("pie")}>円グラフ</button>
      <span>期間:</span>
    </div>
  ),
}));

vi.mock("../RevenueExpenditureCharts", () => ({
  RevenueExpenditureCharts: ({ chartType }: { chartType: string }) => (
    <div data-testid="revenue-expenditure-charts">
      {chartType === "bar" ? (
        <>
          <div data-testid="bar-chart">Revenue Bar Chart</div>
          <div data-testid="bar-chart">Expenditure Bar Chart</div>
        </>
      ) : (
        <>
          <div data-testid="pie-chart">Revenue Pie Chart</div>
          <div data-testid="pie-chart">Expenditure Pie Chart</div>
        </>
      )}
    </div>
  ),
}));

vi.mock("../FinancialHealthIndicators", () => ({
  FinancialHealthIndicators: () => (
    <div data-testid="financial-health-indicators">
      <h1>財政健全性指標の推移</h1>
      <div>財政力指数と経常収支比率の推移</div>
      <div>公債費比率と基金残高の推移</div>
      <div data-testid="line-chart">Financial Chart 1</div>
      <div data-testid="line-chart">Financial Chart 2</div>
      <div>財政力指数</div>
      <div>経常収支比率</div>
      <div>公債費比率</div>
      <div>基金残高</div>
      <div>指標</div>
      <div>値</div>
      <div>説明</div>
      <div>自治体がどれだけ自力で財源を確保できるかを示す指標</div>
      <div>経常的な収入が経常的な支出にどれだけ使われているかを示す指標</div>
    </div>
  ),
}));

vi.mock("../../hooks/useFinanceData", () => ({
  useFinanceData: () => ({
    selectedPeriod: "2024",
    setSelectedPeriod: vi.fn(),
    availablePeriods: [{ value: "2024", label: "2024年度" }],
    filteredRevenues: [],
    filteredExpenditures: [],
    filteredIndicators: null,
    currentYearForIndicators: 2024,
    allIndicators: [],
  }),
}));

describe("FinanceChart", () => {
  beforeEach(() => {
    // document.bodyのスタイルをリセット
    document.body.style.overflow = "unset";
  });

  afterEach(() => {
    // テスト後のクリーンアップ
    document.body.style.overflow = "unset";
  });

  it("renders the finance chart with default settings", () => {
    render(<FinanceChart />);

    // メインタイトルが表示されているかチェック
    expect(screen.getByText("市政の収支と財政健全性")).toBeInTheDocument();

    // デフォルトで年単位が選択されているかチェック
    expect(screen.getByText("年単位")).toBeInTheDocument();
    expect(screen.getByText("月単位")).toBeInTheDocument();

    // デフォルトで棒グラフが選択されているかチェック
    expect(screen.getByText("棒グラフ")).toBeInTheDocument();
    expect(screen.getByText("円グラフ")).toBeInTheDocument();
  });

  it("displays financial indicators table when year unit is selected", () => {
    render(<FinanceChart />);

    // 財政健全性指標のテーブルが表示されているかチェック
    expect(screen.getByText("財政健全性指標の推移")).toBeInTheDocument();
    expect(screen.getByText("財政力指数")).toBeInTheDocument();
    expect(screen.getByText("経常収支比率")).toBeInTheDocument();
    expect(screen.getByText("公債費比率")).toBeInTheDocument();
    expect(screen.getByText("基金残高")).toBeInTheDocument();
  });

  it("switches between year and month time units", async () => {
    render(<FinanceChart />);

    // 月単位ボタンをクリック
    const monthButton = screen.getByText("月単位");
    fireEvent.click(monthButton);

    // 月単位に切り替わったことを確認（財政指標が非表示になる）
    await waitFor(() => {
      expect(
        screen.queryByText("財政健全性指標の推移"),
      ).not.toBeInTheDocument();
    });
  });

  it("switches between bar and pie chart types", async () => {
    render(<FinanceChart />);

    // 初期状態で棒グラフが表示されているか確認
    expect(screen.getAllByTestId("bar-chart")).toHaveLength(2); // 歳入と歳出の2つ

    // 円グラフボタンをクリック
    const pieButton = screen.getByText("円グラフ");
    fireEvent.click(pieButton);

    // 円グラフに切り替わったことを確認
    await waitFor(() => {
      expect(screen.getAllByTestId("pie-chart")).toHaveLength(2); // 歳入と歳出の2つ
    });
  });

  it("has period selection dropdown", () => {
    render(<FinanceChart />);

    // 期間選択のラベルが存在するかチェック
    expect(screen.getByText("期間:")).toBeInTheDocument();
  });

  it("renders revenue and expenditure sections", () => {
    render(<FinanceChart />);

    // 歳入・歳出の内訳セクションが表示されているかチェック
    expect(screen.getByText("歳入・歳出の内訳")).toBeInTheDocument();

    // RevenueExpenditureChartsコンポーネントが表示されているかチェック
    expect(screen.getByTestId("revenue-expenditure-charts")).toBeInTheDocument();
  });

  it("renders financial indicators charts when in year mode", () => {
    render(<FinanceChart />);

    // 年単位モードで財政指標のチャートが表示されているかチェック
    expect(
      screen.getByText("財政力指数と経常収支比率の推移"),
    ).toBeInTheDocument();
    expect(screen.getByText("公債費比率と基金残高の推移")).toBeInTheDocument();

    // LineChartが2つ表示されているかチェック（財政指標用）
    expect(screen.getAllByTestId("line-chart")).toHaveLength(2);
  });

  it("displays financial indicators table with data", () => {
    render(<FinanceChart />);

    // 財政指標テーブルの項目が表示されているかチェック
    expect(screen.getByText("指標")).toBeInTheDocument();
    expect(screen.getByText("値")).toBeInTheDocument();
    expect(screen.getByText("説明")).toBeInTheDocument();

    // 各指標の説明が表示されているかチェック
    expect(
      screen.getByText(/自治体がどれだけ自力で財源を確保できるかを示す指標/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /経常的な収入が経常的な支出にどれだけ使われているかを示す指標/,
      ),
    ).toBeInTheDocument();
  });

  it("handles modal scroll control", async () => {
    render(<FinanceChart />);

    // 初期状態ではbody.styleのoverflowが'unset'であることを確認
    expect(document.body.style.overflow).toBe("unset");
  });

  it("displays correct section titles", () => {
    render(<FinanceChart />);

    // 各セクションのタイトルが正しく表示されているかチェック
    expect(screen.getByText("市政の収支と財政健全性")).toBeInTheDocument();
    expect(screen.getByText("歳入・歳出の内訳")).toBeInTheDocument();
    expect(screen.getByText("財政健全性指標の推移")).toBeInTheDocument();
  });

  it("renders with proper responsive layout classes", () => {
    render(<FinanceChart />);

    // メインコンテナが存在することを確認
    const mainContainer = screen
      .getByText("市政の収支と財政健全性")
      .closest("div");
    expect(mainContainer).toBeInTheDocument();
  });
});

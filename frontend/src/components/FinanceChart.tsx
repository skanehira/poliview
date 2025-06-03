import { useMemo, useState, useEffect } from "react";
import { Button } from "@radix-ui/themes";
import { DetailedFinanceModal } from "./DetailedFinanceModal";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  DUMMY_FINANCE_DATA_MONTHLY,
  DUMMY_FINANCE_DATA_YEARLY,
  DUMMY_FINANCE_INDICATORS,
} from "../data/finances";

export const FinanceChart: React.FC = () => {
  const [timeUnit, setTimeUnit] = useState<"year" | "month">("year");
  const [selectedPeriod, setSelectedPeriod] = useState<string | number>(""); // 初期値を空文字列に設定
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailedCategory, setDetailedCategory] = useState<string | null>(null);
  const [detailedType, setDetailedType] = useState<
    "revenue" | "expenditure" | null
  >(null);
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");

  // モーダル表示中の背景スクロール制御
  useEffect(() => {
    if (showDetailModal) {
      document.body.style.overflow = "hidden"; // スクロールを禁止
    } else {
      document.body.style.overflow = "unset"; // スクロールを許可
    }
    // コンポーネントのアンマウント時やselectedPolicyが変更された際にクリーンアップ
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showDetailModal]);

  // 利用可能な年度と月を生成 (useMemoを使用して最適化)
  const availablePeriods = useMemo(() => {
    const allYears = new Set<number>();
    for (const d of DUMMY_FINANCE_DATA_YEARLY.revenues) {
      allYears.add(d.year);
    }
    for (const d of DUMMY_FINANCE_DATA_MONTHLY.revenues) {
      allYears.add(d.year);
    }

    const sortedYears = Array.from(allYears).sort((a, b) => b - a); // 降順ソート

    if (timeUnit === "year") {
      return sortedYears.map((year) => ({ value: year, label: `${year}年度` }));
    }

    const periods = new Set<string>();
    for (const year of sortedYears) {
      for (let month = 1; month <= 12; month++) {
        const hasData = DUMMY_FINANCE_DATA_MONTHLY.revenues.some(
          (d) => d.year === year && d.month === month,
        );
        if (hasData) {
          periods.add(`${year}-${String(month).padStart(2, "0")}`);
        }
      }
    }
    // 月単位の期間を降順でソート (最新の月が最初に来るように)
    return Array.from(periods)
      .sort((a, b) => b.localeCompare(a))
      .map((period) => ({
        value: period,
        label: `${period.split("-")[0]}年${period.split("-")[1]}月`,
      }));
  }, [timeUnit]); // timeUnitが変更された場合にのみ再計算

  // selectedPeriodの初期設定とtimeUnit変更時の更新
  useEffect(() => {
    if (availablePeriods.length > 0) {
      // 現在のtimeUnitで利用可能な最新の期間を設定
      setSelectedPeriod(availablePeriods[0].value);
    } else {
      // データがない場合のフォールバック
      if (timeUnit === "year") {
        setSelectedPeriod(new Date().getFullYear());
      } else {
        setSelectedPeriod(
          `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`,
        );
      }
    }
  }, [timeUnit, availablePeriods]); // timeUnitとavailablePeriodsの変更を監視

  // 選択された期間のデータをフィルタリング
  const getFilteredFinanceData = (
    dataType: "revenues" | "expenditures",
    unit: "year" | "month",
    period: string | number,
  ) => {
    const sourceData =
      unit === "year"
        ? DUMMY_FINANCE_DATA_YEARLY[dataType]
        : DUMMY_FINANCE_DATA_MONTHLY[dataType];
    if (unit === "year") {
      return sourceData.filter((d) => d.year === period);
    }
    // unit === 'month'
    const [year, month] = (typeof period === "string" ? period : "")
      .split("-")
      .map(Number);
    return sourceData.filter(
      (d) => "month" in d && d.year === year && d.month === month,
    );
  };

  const filteredRevenues = getFilteredFinanceData(
    "revenues",
    timeUnit,
    selectedPeriod,
  );
  const filteredExpenditures = getFilteredFinanceData(
    "expenditures",
    timeUnit,
    selectedPeriod,
  );
  const currentYearForIndicators =
    typeof selectedPeriod === "number"
      ? selectedPeriod
      : Number.parseInt(String(selectedPeriod).split("-")[0], 10);
  const filteredIndicators = DUMMY_FINANCE_INDICATORS.find(
    (d) => d.year === currentYearForIndicators,
  );

  // ツールチップのフォーマッター
  const formatCurrency = (value: number): string => {
    if (value >= 100000000) {
      return `${(value / 100000000).toFixed(1)}億円`;
    }
    if (value >= 10000) {
      return `${(value / 10000).toFixed(0)}万円`;
    }
    return `${value}円`;
  };
  const formatRatio = (value: number): string => `${value.toFixed(1)}%`;
  const formatIndex = (value: number): string => value.toFixed(2);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A28DFF",
    "#FF69B4",
    "#8884d8",
    "#82ca9d",
  ]; // 円グラフの色

  // バークリックハンドラ
  const handleBarClick = (
    data: {
      year: number;
      category: string;
      amount: number;
    },
    type: "revenue" | "expenditure",
  ) => {
    setDetailedCategory(data.category);
    setDetailedType(type);
    setShowDetailModal(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        市政の収支と財政健全性
      </h2>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-3 sm:space-y-0 sm:space-x-4">
        {/* 時間単位選択 */}
        <div className="flex space-x-2 w-full sm:w-auto justify-center sm:justify-start">
          <Button
            onClick={() => setTimeUnit("year")}
            variant={timeUnit === "year" ? "solid" : "soft"}
            color="blue"
            size="2"
          >
            年単位
          </Button>
          <Button
            onClick={() => setTimeUnit("month")}
            variant={timeUnit === "month" ? "solid" : "soft"}
            color="blue"
            size="2"
          >
            月単位
          </Button>
        </div>

        {/* 期間選択ドロップダウン */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <label htmlFor="period-select" className="text-gray-700 font-medium">
            期間:
          </label>
          <select
            id="period-select"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {availablePeriods.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>

        {/* チャートタイプ選択ボタン */}
        <div className="flex space-x-2 w-full sm:w-auto justify-center sm:justify-end">
          <Button
            onClick={() => setChartType("bar")}
            variant={chartType === "bar" ? "solid" : "soft"}
            color="blue"
            size="2"
          >
            棒グラフ
          </Button>
          <Button
            onClick={() => setChartType("pie")}
            variant={chartType === "pie" ? "solid" : "soft"}
            color="blue"
            size="2"
          >
            円グラフ
          </Button>
        </div>
      </div>

      {/* 歳入・歳出グラフセクション */}
      <h3 className="text-xl font-bold text-gray-800 mb-4 mt-6 border-b pb-2">
        歳入・歳出の内訳
      </h3>
      {chartType === "bar" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 歳入棒グラフ */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              歳入 (
              {availablePeriods.find((p) => p.value === selectedPeriod)?.label})
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={filteredRevenues}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={formatCurrency} />
                <Legend />
                <Bar
                  dataKey="amount"
                  fill="#8884d8"
                  name="金額"
                  cursor="pointer"
                  onClick={(data) => handleBarClick(data, "revenue")}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 歳出棒グラフ */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              歳出 (
              {availablePeriods.find((p) => p.value === selectedPeriod)?.label})
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={filteredExpenditures}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={formatCurrency} />
                <Legend />
                <Bar
                  dataKey="amount"
                  fill="#82ca9d"
                  name="金額"
                  cursor="pointer"
                  onClick={(data) => handleBarClick(data, "expenditure")}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {chartType === "pie" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 歳入円グラフ */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              歳入内訳 (
              {availablePeriods.find((p) => p.value === selectedPeriod)?.label})
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={filteredRevenues}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="amount"
                  nameKey="category"
                  onClick={(data) => handleBarClick(data, "revenue")} // Pie chart click
                  cursor="pointer"
                >
                  {filteredRevenues.map((entry, index) => (
                    <Cell
                      key={`cell-revenue-${entry.category}-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={formatCurrency} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 歳出円グラフ */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              歳出内訳 (
              {availablePeriods.find((p) => p.value === selectedPeriod)?.label})
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={filteredExpenditures}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#82ca9d"
                  dataKey="amount"
                  nameKey="category"
                  onClick={(data) => handleBarClick(data, "expenditure")} // Pie chart click
                  cursor="pointer"
                >
                  {filteredExpenditures.map((entry, index) => (
                    <Cell
                      key={`cell-expenditure-${entry.category}-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={formatCurrency} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 財政健全性指標セクション (年単位のみ) */}
      {timeUnit === "year" && (
        <>
          <h3 className="text-xl font-bold text-gray-800 mb-4 mt-8 border-b pb-2">
            財政健全性指標の推移
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 財政力指数と経常収支比率の推移 */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                財政力指数と経常収支比率の推移
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={DUMMY_FINANCE_INDICATORS}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    stroke="#8884d8"
                    domain={[0.5, 1.0]}
                    tickFormatter={formatIndex}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#82ca9d"
                    domain={[80, 100]}
                    tickFormatter={formatRatio}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      if (typeof value === "number") {
                        if (name === "財政力指数")
                          return `${name}: ${formatIndex(value)}`;
                        if (name === "経常収支比率")
                          return `${name}: ${formatRatio(value)}`;
                      }
                      return `${name}: ${value}`;
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="fiscalCapacity"
                    stroke="#8884d8"
                    name="財政力指数"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="currentBalanceRatio"
                    stroke="#82ca9d"
                    name="経常収支比率"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 公債費比率と基金残高の推移 */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                公債費比率と基金残高の推移
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={DUMMY_FINANCE_INDICATORS}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    stroke="#FFBB28"
                    domain={[10, 20]}
                    tickFormatter={formatRatio}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#FF8042"
                    tickFormatter={formatCurrency}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      if (typeof value === "number") {
                        if (name === "公債費比率")
                          return `${name}: ${formatRatio(value)}`;
                        if (name === "基金残高")
                          return `${name}: ${formatCurrency(value)}`;
                      }
                      return `${name}: ${value}`;
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="publicDebtRatio"
                    stroke="#FFBB28"
                    name="公債費比率"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="fundBalance"
                    stroke="#FF8042"
                    name="基金残高"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 財政健全性指標の概要テーブル */}
          <h4 className="text-lg font-semibold text-gray-800 mb-4 mt-8">
            主要財政指標 ({currentYearForIndicators}年度)
          </h4>
          {filteredIndicators ? (
            <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                      指標
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                      値
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                      説明
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-3 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      財政力指数
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">
                      {formatIndex(filteredIndicators.fiscalCapacity)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      自治体がどれだけ自力で財源を確保できるかを示す指標。1に近いほど財政基盤が強い。
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      経常収支比率
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">
                      {formatRatio(filteredIndicators.currentBalanceRatio)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      経常的な収入が経常的な支出にどれだけ使われているかを示す指標。低いほど財政に余裕がある。
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      公債費比率
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">
                      {formatRatio(filteredIndicators.publicDebtRatio)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      歳入に占める借金返済額の割合。高いと将来の財政を圧迫する可能性。
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      基金残高
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">
                      {formatCurrency(filteredIndicators.fundBalance)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      将来の特定目的のために積み立てられた貯蓄の残高。多いほど財政的余裕がある。
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-600 text-sm mt-4">
              選択された年度の財政健全性指標データはありません。
            </p>
          )}
        </>
      )}

      <DetailedFinanceModal
        type={detailedType || "revenue"}
        category={detailedCategory || ""}
        period={selectedPeriod}
        onClose={() => setShowDetailModal(false)}
        isOpen={showDetailModal}
      />
    </div>
  );
};

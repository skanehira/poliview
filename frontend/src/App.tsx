import { useMemo, useState, useEffect, useCallback } from "react";
import { Button } from "@radix-ui/themes";
import { PolicyDetailModal } from "./components/PolicyDetailModal";
import { DetailedFinanceModal } from "./components/DetailedFinanceModal";
import { PolicyAddModal } from "./components/PolicyAddModal";
import type { Policy, NewPolicy, Policies } from "./types/policy";
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
} from "./data/finances";
import { DUMMY_POLICIES } from "./data/policies";

// 収支グラフコンポーネント
const FinanceChart: React.FC = () => {
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

function App() {
  const [policies, setPolicies] = useState<Policies>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [simplifiedPolicyText, setSimplifiedPolicyText] = useState(""); // LLMによる要約テキスト
  const [isSummarizing, setIsSummarizing] = useState(false); // LLM呼び出し中のローディング状態
  const [showSimplifiedSummary, setShowSimplifiedSummary] = useState(false); // 要約内容の開閉状態
  const [sortOrder, setSortOrder] = useState<
    "newest" | "popularity_desc" | "popularity_asc"
  >("newest"); // ソート順序のステート
  const [showFabMenu, setShowFabMenu] = useState(false); // FABメニューの開閉状態
  const [activeTab, setActiveTab] = useState<"policies" | "finance">(
    "policies",
  ); // 'policies' or 'finance'

  // ダミーデータをローカルステートに読み込む関数
  const loadDummyData = useCallback(() => {
    // policiesが空の場合のみダミーデータを読み込む
    if (policies.length === 0) {
      // 初期ソート順でソート
      const sortedDummyPolicies = [...DUMMY_POLICIES].sort(
        (a, b) => (b.year || 0) - (a.year || 0),
      );
      setPolicies(sortedDummyPolicies);
      console.log("Dummy data loaded successfully!");
    }
  }, [policies.length]);

  // アプリ起動時にダミーデータを自動で読み込む
  useEffect(() => {
    loadDummyData();
  }, [loadDummyData]); // 初回レンダリング時のみ実行

  // 政策の追加（ローカルステートに直接追加）
  const addPolicy = (newPolicy: NewPolicy) => {
    const policyWithId = {
      ...newPolicy,
      id: String(Date.now()), // ユニークなIDを生成
      upvotes: 0,
      downvotes: 0,
      problems: newPolicy.problems
        .map((s: string) => s.trim())
        .filter((s: string) => s), // 問題点も配列に変換
      comments: [], // 新しい政策にはコメント配列を初期化
    };
    setPolicies((prevPolicies) => {
      const updatedPolicies = [...prevPolicies, policyWithId];
      // 新しい政策が追加されたら、現在のソート順で再ソート
      return sortPolicies(updatedPolicies, sortOrder);
    });
    console.log("Policy added successfully!");
  };

  // 投票ハンドラー
  const handleVote = (policyId: string, type: "up" | "down") => {
    setPolicies((prevPolicies) => {
      const updatedPolicies = prevPolicies.map((policy) => {
        if (policy.id === policyId) {
          if (type === "up") {
            return { ...policy, upvotes: (policy.upvotes || 0) + 1 };
          }
          if (type === "down") {
            return { ...policy, downvotes: (policy.downvotes || 0) + 1 };
          }
        }
        return policy;
      });
      // 投票後も現在のソート順を維持
      return sortPolicies(updatedPolicies, sortOrder);
    });
  };

  // コメント投稿ハンドラ
  const handleAddComment = (
    policyId: string,
    commentText: string,
    isAnonymous: boolean,
  ) => {
    if (!commentText.trim()) return; // 空のコメントは投稿しない

    const newComment = {
      id: String(Date.now()),
      author: isAnonymous ? "匿名市民" : "市民", // 仮の投稿者名
      text: commentText.trim(),
      timestamp: new Date().toLocaleString(),
      upvotes: 0, // 新しいコメントのupvotesを初期化
      downvotes: 0, // 新しいコメントのdownvotesを初期化
    };

    setPolicies((prevPolicies) => {
      const updatedPolicies = prevPolicies.map((policy) =>
        policy.id === policyId
          ? { ...policy, comments: [...(policy.comments || []), newComment] }
          : policy,
      );
      return updatedPolicies; // policiesの状態を更新
    });
  };

  // コメント投票ハンドラ
  const handleCommentVote = (
    policyId: string,
    commentId: string,
    type: "up" | "down",
  ) => {
    setPolicies((prevPolicies) => {
      return prevPolicies.map((policy) => {
        if (policy.id === policyId) {
          const updatedComments = (policy.comments || []).map((comment) => {
            if (comment.id === commentId) {
              if (type === "up") {
                return { ...comment, upvotes: (comment.upvotes || 0) + 1 };
              }
              if (type === "down") {
                return { ...comment, downvotes: (comment.downvotes || 0) + 1 };
              }
            }
            return comment;
          });
          return { ...policy, comments: updatedComments };
        }
        return policy;
      });
    });
  };

  // 政策のソート関数
  const sortPolicies = (policyList: Policy[], order: string) => {
    return [...policyList].sort((a, b) => {
      if (order === "newest") {
        return (b.year || 0) - (a.year || 0); // 新しい順
      }
      if (order === "popularity_desc") {
        const totalVotesA = (a.upvotes || 0) + (a.downvotes || 0);
        const popularityA =
          totalVotesA > 0 ? (a.upvotes || 0) / totalVotesA : -1;
        const totalVotesB = (b.upvotes || 0) + (b.downvotes || 0);
        const popularityB =
          totalVotesB > 0 ? (b.upvotes || 0) / totalVotesB : -1;
        return popularityB - popularityA; // 人気度が高い順
      }
      if (order === "popularity_asc") {
        const totalVotesA = (a.upvotes || 0) + (a.downvotes || 0);
        const popularityA =
          totalVotesA > 0 ? (a.upvotes || 0) / totalVotesA : 2; // 評価なしを最後に
        const totalVotesB = (b.upvotes || 0) + (b.downvotes || 0);
        const popularityB =
          totalVotesB > 0 ? (b.upvotes || 0) / totalVotesB : 2; // 評価なしを最後に
        return popularityA - popularityB; // 人気度が低い順
      }
      return 0; // デフォルト
    });
  };

  // ソート順変更ハンドラー
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortOrder = e.target.value as
      | "newest"
      | "popularity_desc"
      | "popularity_asc";
    setSortOrder(newSortOrder);
    setPolicies((prevPolicies) => sortPolicies(prevPolicies, newSortOrder));
    setShowFabMenu(false); // ソート選択後、FABメニューを閉じる
  };

  // LLMによる政策要約機能
  const summarizePolicy = async (policy: Policy) => {
    setIsSummarizing(true);
    setSimplifiedPolicyText("要約を生成中..."); // ローディングメッセージ
    setShowSimplifiedSummary(true); // 要約生成開始時に開く

    const prompt = `以下の市政の政策について、高校生にもわかるように、より簡潔で平易な言葉で要約してください。特に、専門用語を避け、具体的な影響が伝わるように工夫してください。

政策タイトル: ${policy.title}
目的: ${policy.purpose}
概要: ${policy.overview}
具体的計画: ${policy.detailedPlan}`;

    const chatHistory: Array<{ role: string; parts: Array<{ text: string }> }> =
      [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const payload = { contents: chatHistory };
    const apiKey = ""; // If you want to use models other than gemini-2.0-flash or imagen-3.0-generate-002, provide an API key here. Otherwise, leave this as-is.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.status !== 200) {
        setSimplifiedPolicyText("要約の生成に失敗しました。");
        console.error("LLM API error:", response.status, response.statusText);
        return;
      }
      const result = await response.json();

      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        const text = result.candidates[0].content.parts[0].text;
        setSimplifiedPolicyText(text);
      } else {
        setSimplifiedPolicyText("要約の生成に失敗しました。");
        console.error("Unexpected LLM response structure:", result);
      }
    } catch (error) {
      setSimplifiedPolicyText("要約の生成中にエラーが発生しました。");
      console.error("Error calling LLM API:", error);
    } finally {
      setIsSummarizing(false);
    }
  };

  // 検索フィルタリング
  const filteredPolicies = policies.filter((policy) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      policy.title?.toLowerCase().includes(lowerCaseSearchTerm) ||
      policy.purpose?.toLowerCase().includes(lowerCaseSearchTerm) ||
      policy.overview?.toLowerCase().includes(lowerCaseSearchTerm) ||
      policy.detailedPlan?.toLowerCase().includes(lowerCaseSearchTerm) ||
      policy.problems?.some((problem) =>
        problem.toLowerCase().includes(lowerCaseSearchTerm),
      ) || // 問題点も検索対象に追加
      policy.keywords?.some((keyword) =>
        keyword.toLowerCase().includes(lowerCaseSearchTerm),
      ) ||
      policy.relatedEvents?.some((event) =>
        event.toLowerCase().includes(lowerCaseSearchTerm),
      )
    );
  });

  // ポリシー詳細モーダルを閉じる
  const closeModal = () => {
    setSelectedPolicy(null);
    setSimplifiedPolicyText(""); // モーダルを閉じるときに要約テキストをクリア
    setShowSimplifiedSummary(false); // モーダルを閉じるときに要約の開閉状態をリセット
  };

  // モーダル表示中の背景スクロール制御 (政策詳細モーダルのみ)
  useEffect(() => {
    if (selectedPolicy || showAddForm) {
      document.body.style.overflow = "hidden"; // スクロールを禁止
    } else {
      document.body.style.overflow = "unset"; // スクロールを許可
    }
    // コンポーネントのアンマウント時やselectedPolicyが変更された際にクリーンアップ
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedPolicy, showAddForm]); // 依存配列に追加

  // policiesが更新されたら、selectedPolicyも最新の状態に更新
  useEffect(() => {
    if (selectedPolicy) {
      const updatedSelectedPolicy = policies.find(
        (p) => p.id === selectedPolicy.id,
      );
      if (updatedSelectedPolicy) {
        setSelectedPolicy(updatedSelectedPolicy);
      } else {
        // もし選択されていた政策がpoliciesから削除された場合（通常は発生しないはずだが念のため）
        setSelectedPolicy(null);
      }
    }
  }, [policies, selectedPolicy]); // policiesの変更を監視

  // ステータスに応じたスタイルを返すヘルパー関数
  const getStatusClasses = (status: string) => {
    switch (status) {
      case "完了":
        return "bg-green-100 text-green-800";
      case "進行中":
        return "bg-blue-100 text-blue-800";
      case "中止":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 w-full bg-blue-600 text-white p-4 shadow-md rounded-b-lg z-10">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold mb-2 sm:mb-0">
            市政の可視化アプリ
          </h1>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="キーワードで政策を検索..."
              className="p-2 rounded-md border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {/* タブナビゲーション */}
        <div className="container mx-auto mt-4 flex border-b border-blue-500">
          <Button
            onClick={() => setActiveTab("policies")}
            variant={activeTab === "policies" ? "solid" : "ghost"}
            color="gray"
            size="2"
            className={
              activeTab === "policies"
                ? "border-b-2 border-white text-white"
                : "text-blue-200 hover:text-white"
            }
          >
            政策一覧
          </Button>
          <Button
            onClick={() => setActiveTab("finance")}
            variant={activeTab === "finance" ? "solid" : "ghost"}
            color="gray"
            size="2"
            className={
              activeTab === "finance"
                ? "border-b-2 border-white text-white"
                : "text-blue-200 hover:text-white"
            }
          >
            市政の収支
          </Button>
        </div>
      </header>

      {/* メインコンテンツ */}
      {/* ヘッダーの高さ分、上部にパディングを追加 */}
      <main className="container mx-auto p-4 flex-grow pt-40 sm:pt-36">
        {" "}
        {/* ヘッダーの高さに合わせて調整 */}
        {activeTab === "policies" && (
          <>
            {filteredPolicies.length === 0 && searchTerm !== "" ? (
              <p className="text-center text-gray-600 text-lg mt-8">
                「{searchTerm}」に一致する政策は見つかりませんでした。
              </p>
            ) : filteredPolicies.length === 0 && searchTerm === "" ? (
              <p className="text-center text-gray-600 text-lg mt-8">
                現在、登録されている政策はありません。ダミーデータが自動的に読み込まれます。
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {filteredPolicies.map((policy) => {
                  // 人気度を計算
                  const totalVotes =
                    (policy.upvotes || 0) + (policy.downvotes || 0);
                  const popularity =
                    totalVotes > 0
                      ? ((policy.upvotes || 0) / totalVotes) * 100
                      : null;

                  return (
                    <div
                      key={policy.id}
                      onClick={() => {
                        console.log("Policy selected:", policy.title);
                        setSelectedPolicy(policy);
                      }}
                      className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-200 flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="text-xl font-semibold text-blue-700 mb-2">
                          {policy.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          年度: {policy.year}
                        </p>
                        <p className="text-gray-700 text-sm line-clamp-3">
                          {policy.overview}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {policy.keywords?.map((keyword) => (
                            <span
                              key={keyword}
                              className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                        <div className="flex space-x-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVote(policy.id, "up");
                            }}
                            variant="soft"
                            color="green"
                            size="1"
                            radius="full"
                          >
                            👍 {policy.upvotes}
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVote(policy.id, "down");
                            }}
                            variant="soft"
                            color="red"
                            size="1"
                            radius="full"
                          >
                            👎 {policy.downvotes}
                          </Button>
                        </div>
                        {/* 人気度を表示 */}
                        {popularity !== null && (
                          <span
                            className={`text-sm font-semibold ${popularity >= 70 ? "text-green-600" : popularity >= 40 ? "text-yellow-600" : "text-red-600"}`}
                          >
                            人気度: {popularity.toFixed(0)}%
                          </span>
                        )}
                        {popularity === null && (
                          <span className="text-sm font-semibold text-gray-500">
                            評価なし
                          </span>
                        )}
                        {/* ステータス表示 */}
                        {policy.status && (
                          <span
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getStatusClasses(policy.status)}`}
                          >
                            {policy.status}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
        {activeTab === "finance" && <FinanceChart />}
      </main>

      {/* 政策詳細モーダル */}
      <PolicyDetailModal
        policy={selectedPolicy}
        isOpen={selectedPolicy !== null}
        onClose={closeModal}
        onVoteComment={handleCommentVote}
        onAddComment={handleAddComment}
        onSummarizePolicy={summarizePolicy}
        isSummarizing={isSummarizing}
        simplifiedPolicyText={simplifiedPolicyText}
        showSimplifiedSummary={showSimplifiedSummary}
        onToggleSimplifiedSummary={() =>
          setShowSimplifiedSummary(!showSimplifiedSummary)
        }
      />

      {/* フローティングアクションボタン (FAB) メニュー */}
      {activeTab === "policies" && ( // 政策一覧タブでのみFABを表示
        <div className="fixed bottom-8 right-8 z-20">
          <div className="relative">
            {" "}
            {/* このdivがFABとメニューの親となり、相対的な位置決めを可能にする */}
            {/* FABボタン */}
            <Button
              onClick={() => setShowFabMenu(!showFabMenu)}
              variant="solid"
              color="blue"
              size="4"
              radius="full"
              className="w-14 h-14 shadow-xl text-3xl font-bold transition duration-300 ease-in-out transform hover:scale-105"
            >
              {showFabMenu ? "−" : "+"}
            </Button>
            {/* メニュー項目 (FABボタンに対して絶対位置で配置) */}
            {showFabMenu && (
              <div className="absolute bottom-full right-0 mb-3 flex flex-col items-end space-y-3">
                <Button
                  onClick={() => {
                    setShowAddForm(true);
                    setShowFabMenu(false);
                  }}
                  variant="solid"
                  color="green"
                  size="2"
                  radius="full"
                  className="shadow-lg text-sm whitespace-nowrap"
                >
                  政策を追加
                </Button>
                <div className="bg-white rounded-full shadow-lg p-2">
                  <select
                    value={sortOrder}
                    onChange={handleSortChange}
                    className="p-2 rounded-full border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  >
                    <option value="newest">新しい順</option>
                    <option value="popularity_desc">人気度が高い順</option>
                    <option value="popularity_asc">人気度が低い順</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 政策追加モーダル */}
      <PolicyAddModal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onAddPolicy={(policy) => {
          addPolicy(policy);
          setShowFabMenu(false);
        }}
      />
    </div>
  );
}

export default App;

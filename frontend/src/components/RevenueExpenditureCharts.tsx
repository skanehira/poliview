import { Card, Flex, Grid, Heading } from "@radix-ui/themes";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  ChartClickData,
  ChartType,
  FinanceData,
  PeriodOption,
} from "../types/finance";
import { formatCurrency, CHART_COLORS } from "../utils/financeUtils";

interface RevenueExpenditureChartsProps {
  chartType: ChartType;
  filteredRevenues: FinanceData[];
  filteredExpenditures: FinanceData[];
  selectedPeriod: number;
  availablePeriods: PeriodOption[];
  onChartClick: (data: ChartClickData, type: "revenue" | "expenditure") => void;
}

export function RevenueExpenditureCharts({
  chartType,
  filteredRevenues,
  filteredExpenditures,
  selectedPeriod,
  availablePeriods,
  onChartClick,
}: RevenueExpenditureChartsProps) {
  const selectedPeriodLabel = availablePeriods.find(
    (p) => p.value === selectedPeriod,
  )?.label;

  if (chartType === "bar") {
    return (
      <Grid columns={{ initial: "1", lg: "2" }} gap="6">
        {/* 歳入棒グラフ */}
        <Card variant="surface">
          <Heading size="4" align="center" mb="4">
            歳入 ({selectedPeriodLabel})
          </Heading>
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
                onClick={(data) => onChartClick(data, "revenue")}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* 歳出棒グラフ */}
        <Card variant="surface">
          <Heading size="4" align="center" mb="4">
            歳出 ({selectedPeriodLabel})
          </Heading>
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
                onClick={(data) => onChartClick(data, "expenditure")}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Grid>
    );
  }

  return (
    <Grid columns={{ initial: "1", lg: "2" }} gap="6">
      {/* 歳入円グラフ */}
      <Card variant="surface">
        <Flex direction="column" align="center">
          <Heading size="4" mb="4">
            歳入内訳 ({selectedPeriodLabel})
          </Heading>
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
                onClick={(data) => onChartClick(data, "revenue")}
                cursor="pointer"
              >
                {filteredRevenues.map((entry, index) => (
                  <Cell
                    key={`cell-revenue-${entry.category}-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={formatCurrency} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Flex>
      </Card>

      {/* 歳出円グラフ */}
      <Card variant="surface">
        <Flex direction="column" align="center">
          <Heading size="4" mb="4">
            歳出内訳 ({selectedPeriodLabel})
          </Heading>
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
                onClick={(data) => onChartClick(data, "expenditure")}
                cursor="pointer"
              >
                {filteredExpenditures.map((entry, index) => (
                  <Cell
                    key={`cell-expenditure-${entry.category}-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={formatCurrency} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Flex>
      </Card>
    </Grid>
  );
}

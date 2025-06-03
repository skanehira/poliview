import { Box, Card, Grid, Heading, Table, Text } from "@radix-ui/themes";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FinanceIndicator } from "../types/finance";
import {
  formatCurrency,
  formatIndex,
  formatRatio,
} from "../utils/financeUtils";

interface FinancialHealthIndicatorsProps {
  indicators: FinanceIndicator[];
  currentYearData: FinanceIndicator | undefined;
  currentYear: number;
}

export function FinancialHealthIndicators({
  indicators,
  currentYearData,
  currentYear,
}: FinancialHealthIndicatorsProps) {
  return (
    <>
      <Heading
        size="5"
        mt="8"
        mb="4"
        style={{
          paddingBottom: "0.5rem",
          borderBottom: "1px solid var(--gray-6)",
        }}
      >
        財政健全性指標の推移
      </Heading>
      <Grid columns={{ initial: "1", lg: "2" }} gap="6">
        {/* 財政力指数と経常収支比率の推移 */}
        <Card variant="surface">
          <Heading size="4" align="center" mb="4">
            財政力指数と経常収支比率の推移
          </Heading>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={indicators}
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
        </Card>

        {/* 公債費比率と基金残高の推移 */}
        <Card variant="surface">
          <Heading size="4" align="center" mb="4">
            公債費比率と基金残高の推移
          </Heading>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={indicators}
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
        </Card>
      </Grid>

      {/* 財政健全性指標の概要テーブル */}
      <Heading size="4" mt="8" mb="4">
        主要財政指標 ({currentYear}年度)
      </Heading>
      {currentYearData ? (
        <Box
          style={{
            overflowX: "auto",
            borderRadius: "var(--radius-3)",
            border: "1px solid var(--gray-6)",
            boxShadow: "var(--shadow-3)",
          }}
        >
          <Table.Root size="2">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>指標</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>値</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>説明</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  <Text weight="medium">財政力指数</Text>
                </Table.Cell>
                <Table.Cell>
                  {formatIndex(currentYearData.fiscalCapacity)}
                </Table.Cell>
                <Table.Cell>
                  自治体がどれだけ自力で財源を確保できるかを示す指標。1に近いほど財政基盤が強い。
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <Text weight="medium">経常収支比率</Text>
                </Table.Cell>
                <Table.Cell>
                  {formatRatio(currentYearData.currentBalanceRatio)}
                </Table.Cell>
                <Table.Cell>
                  経常的な収入が経常的な支出にどれだけ使われているかを示す指標。低いほど財政に余裕がある。
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <Text weight="medium">公債費比率</Text>
                </Table.Cell>
                <Table.Cell>
                  {formatRatio(currentYearData.publicDebtRatio)}
                </Table.Cell>
                <Table.Cell>
                  歳入に占める借金返済額の割合。高いと将来の財政を圧迫する可能性。
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <Text weight="medium">基金残高</Text>
                </Table.Cell>
                <Table.Cell>
                  {formatCurrency(currentYearData.fundBalance)}
                </Table.Cell>
                <Table.Cell>
                  将来の特定目的のために積み立てられた貯蓄の残高。多いほど財政的余裕がある。
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Box>
      ) : (
        <Text size="2" color="gray" align="center" mt="4">
          選択された年度の財政健全性指標データはありません。
        </Text>
      )}
    </>
  );
}

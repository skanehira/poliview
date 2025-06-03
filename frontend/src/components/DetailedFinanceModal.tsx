import { Box, Button, Dialog, Flex, Heading, Text } from "@radix-ui/themes";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  DUMMY_DETAILED_EXPENDITURES,
  DUMMY_DETAILED_REVENUES,
} from "../data/expenditures";

interface DetailedFinanceModalProps {
  type: "revenue" | "expenditure";
  category: string;
  period: string | number;
  onClose: () => void;
  isOpen: boolean;
}

export function DetailedFinanceModal({
  type,
  category,
  period,
  onClose,
  isOpen,
}: DetailedFinanceModalProps) {
  const isRevenue = type === "revenue";
  const detailData = isRevenue
    ? DUMMY_DETAILED_REVENUES[
        category as keyof typeof DUMMY_DETAILED_REVENUES
      ]?.[
        period as keyof (typeof DUMMY_DETAILED_REVENUES)[keyof typeof DUMMY_DETAILED_REVENUES]
      ]
    : DUMMY_DETAILED_EXPENDITURES[
        category as keyof typeof DUMMY_DETAILED_EXPENDITURES
      ]?.[
        period as keyof (typeof DUMMY_DETAILED_EXPENDITURES)[keyof typeof DUMMY_DETAILED_EXPENDITURES]
      ];

  const formatCurrency = (value: number): string => {
    if (value >= 100000000) {
      return `${(value / 100000000).toFixed(1)}億円`;
    }
    if (value >= 10000) {
      return `${(value / 10000).toFixed(0)}万円`;
    }
    return `${value}円`;
  };

  if (!detailData) {
    return (
      <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <Dialog.Content maxWidth="36rem">
          <Dialog.Description
            style={{
              position: "absolute",
              width: "1px",
              height: "1px",
              padding: 0,
              margin: "-1px",
              overflow: "hidden",
              clip: "rect(0, 0, 0, 0)",
              whiteSpace: "nowrap",
              borderWidth: 0,
            }}
          >
            {category}の詳細な財務データと内訳を表示
          </Dialog.Description>
          <Flex justify="between" align="start" mb="4">
            <Dialog.Title>
              <Text size="5" weight="bold">
                {category}の詳細 ({period})
              </Text>
            </Dialog.Title>
            <Dialog.Close>
              <Button variant="ghost" color="gray" size="1">
                &times;
              </Button>
            </Dialog.Close>
          </Flex>

          <Dialog.Description>
            <Text color="gray">この期間のデータはありません。</Text>
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Root>
    );
  }

  const chartData = Object.entries(detailData).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Content maxWidth="36rem">
        <Dialog.Description
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: 0,
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            borderWidth: 0,
          }}
        >
          {category}の詳細な{isRevenue ? "歳入" : "歳出"}
          データをチャートと内詳で表示
        </Dialog.Description>
        <Flex justify="between" align="start" mb="4">
          <Dialog.Title>
            <Text size="5" weight="bold">
              {category}の詳細 ({period}) - {isRevenue ? "歳入" : "歳出"}
            </Text>
          </Dialog.Title>
          <Dialog.Close>
            <Button variant="ghost" color="gray" size="1">
              &times;
            </Button>
          </Dialog.Close>
        </Flex>

        <Box mb="4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={formatCurrency} />
              <Legend />
              <Bar
                dataKey="value"
                fill={isRevenue ? "#8884d8" : "#FF6384"}
                name="金額"
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box>
          <Heading size="4" mb="2">
            内訳
          </Heading>
          <Box style={{ paddingLeft: "1rem" }}>
            {Object.entries(detailData).map(([name, value]) => (
              <Text
                key={name}
                style={{ display: "block", marginBottom: "0.25rem" }}
              >
                • {name}: {formatCurrency(value)}
              </Text>
            ))}
          </Box>
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  );
}

import { Button, Dialog } from "@radix-ui/themes";
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
          <Dialog.Description className="sr-only">
            {category}の詳細な財務データと内訳を表示
          </Dialog.Description>
          <div className="mb-4 flex items-start justify-between">
            <Dialog.Title className="font-bold text-gray-800 text-xl">
              {category}の詳細 ({period})
            </Dialog.Title>
            <Dialog.Close>
              <Button variant="ghost" color="gray" size="1">
                &times;
              </Button>
            </Dialog.Close>
          </div>

          <Dialog.Description className="text-gray-700">
            この期間のデータはありません。
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
        <Dialog.Description className="sr-only">
          {category}の詳細な{isRevenue ? "歳入" : "歳出"}
          データをチャートと内訳で表示
        </Dialog.Description>
        <div className="mb-4 flex items-start justify-between">
          <Dialog.Title className="font-bold text-gray-800 text-xl">
            {category}の詳細 ({period}) - {isRevenue ? "歳入" : "歳出"}
          </Dialog.Title>
          <Dialog.Close>
            <Button variant="ghost" color="gray" size="1">
              &times;
            </Button>
          </Dialog.Close>
        </div>

        <div className="mb-4">
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
        </div>

        <div>
          <h4 className="mb-2 font-semibold text-gray-800 text-lg">内訳</h4>
          <ul className="list-inside list-disc text-gray-700">
            {Object.entries(detailData).map(([name, value]) => (
              <li key={name}>
                {name}: {formatCurrency(value)}
              </li>
            ))}
          </ul>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}

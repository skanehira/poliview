import { Button, Flex, Select, Text } from "@radix-ui/themes";
import type { ChartType, PeriodOption, TimeUnit } from "../types/finance";

interface FinanceChartControlsProps {
  timeUnit: TimeUnit;
  onTimeUnitChange: (unit: TimeUnit) => void;
  selectedPeriod: string | number;
  onPeriodChange: (period: number) => void;
  availablePeriods: PeriodOption[];
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
}

export function FinanceChartControls({
  timeUnit,
  onTimeUnitChange,
  selectedPeriod,
  onPeriodChange,
  availablePeriods,
  chartType,
  onChartTypeChange,
}: FinanceChartControlsProps) {
  return (
    <Flex
      direction={{ initial: "column", sm: "row" }}
      align="center"
      justify="between"
      gap="3"
      mb="4"
    >
      {/* 時間単位選択 */}
      <Flex gap="2">
        <Button
          onClick={() => onTimeUnitChange("year")}
          variant={timeUnit === "year" ? "solid" : "soft"}
          color="blue"
          size="2"
        >
          年単位
        </Button>
        <Button
          onClick={() => onTimeUnitChange("month")}
          variant={timeUnit === "month" ? "solid" : "soft"}
          color="blue"
          size="2"
        >
          月単位
        </Button>
      </Flex>

      {/* 期間選択ドロップダウン */}
      <Flex align="center" gap="2">
        <Text weight="medium">期間:</Text>
        <Select.Root
          value={selectedPeriod.toString()}
          onValueChange={(value) => {
            onPeriodChange(Number(value));
          }}
        >
          <Select.Trigger style={{ minWidth: "200px" }} />
          <Select.Content>
            {availablePeriods.map((period) => (
              <Select.Item key={period.value} value={period.value.toString()}>
                {period.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Flex>

      {/* チャートタイプ選択ボタン */}
      <Flex gap="2">
        <Button
          onClick={() => onChartTypeChange("bar")}
          variant={chartType === "bar" ? "solid" : "soft"}
          color="blue"
          size="2"
        >
          棒グラフ
        </Button>
        <Button
          onClick={() => onChartTypeChange("pie")}
          variant={chartType === "pie" ? "solid" : "soft"}
          color="blue"
          size="2"
        >
          円グラフ
        </Button>
      </Flex>
    </Flex>
  );
}

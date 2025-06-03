import { Card, Heading } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { DetailedFinanceModal } from "./DetailedFinanceModal";
import { FinanceChartControls } from "./FinanceChartControls";
import { FinancialHealthIndicators } from "./FinancialHealthIndicators";
import { RevenueExpenditureCharts } from "./RevenueExpenditureCharts";
import { useFinanceData } from "../hooks/useFinanceData";
import type { ChartClickData, ChartType, TimeUnit } from "../types/finance";

export function FinanceChart() {
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("year");
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailedCategory, setDetailedCategory] = useState<string | null>(null);
  const [detailedType, setDetailedType] = useState<
    "revenue" | "expenditure" | null
  >(null);

  const {
    selectedPeriod,
    setSelectedPeriod,
    availablePeriods,
    filteredRevenues,
    filteredExpenditures,
    filteredIndicators,
    currentYearForIndicators,
    allIndicators,
  } = useFinanceData(timeUnit);

  // モーダル表示中の背景スクロール制御
  useEffect(() => {
    if (showDetailModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showDetailModal]);

  // チャートクリックハンドラ
  const handleChartClick = (
    data: ChartClickData,
    type: "revenue" | "expenditure",
  ) => {
    setDetailedCategory(data.category);
    setDetailedType(type);
    setShowDetailModal(true);
  };

  return (
    <Card size="3" style={{ marginBottom: "1.5rem" }}>
      <Heading size="6" mb="4">
        市政の収支と財政健全性
      </Heading>

      <FinanceChartControls
        timeUnit={timeUnit}
        onTimeUnitChange={setTimeUnit}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        availablePeriods={availablePeriods}
        chartType={chartType}
        onChartTypeChange={setChartType}
      />

      {/* 歳入・歳出グラフセクション */}
      <Heading
        size="5"
        mt="6"
        mb="4"
        style={{
          paddingBottom: "0.5rem",
          borderBottom: "1px solid var(--gray-6)",
        }}
      >
        歳入・歳出の内訳
      </Heading>

      <RevenueExpenditureCharts
        chartType={chartType}
        filteredRevenues={filteredRevenues}
        filteredExpenditures={filteredExpenditures}
        selectedPeriod={selectedPeriod}
        availablePeriods={availablePeriods}
        onChartClick={handleChartClick}
      />

      {/* 財政健全性指標セクション (年単位のみ) */}
      {timeUnit === "year" && (
        <FinancialHealthIndicators
          indicators={allIndicators}
          currentYearData={filteredIndicators}
          currentYear={currentYearForIndicators}
        />
      )}

      <DetailedFinanceModal
        type={detailedType || "revenue"}
        category={detailedCategory || ""}
        period={selectedPeriod}
        onClose={() => setShowDetailModal(false)}
        isOpen={showDetailModal}
      />
    </Card>
  );
}

import { useEffect, useMemo, useState } from "react";
import {
  DUMMY_FINANCE_DATA_MONTHLY,
  DUMMY_FINANCE_DATA_YEARLY,
  DUMMY_FINANCE_INDICATORS,
} from "../data/finances";
import type { FinanceData, TimeUnit } from "../types/finance";

export function useFinanceData(timeUnit: TimeUnit) {
  const [selectedPeriod, setSelectedPeriod] = useState<string | number>("");

  // 利用可能な年度と月を生成
  const availablePeriods = useMemo(() => {
    const allYears = new Set<number>();
    for (const d of DUMMY_FINANCE_DATA_YEARLY.revenues) {
      allYears.add(d.year);
    }
    for (const d of DUMMY_FINANCE_DATA_MONTHLY.revenues) {
      allYears.add(d.year);
    }

    const sortedYears = Array.from(allYears).sort((a, b) => b - a);

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
    return Array.from(periods)
      .sort((a, b) => b.localeCompare(a))
      .map((period) => ({
        value: period,
        label: `${period.split("-")[0]}年${period.split("-")[1]}月`,
      }));
  }, [timeUnit]);

  // selectedPeriodの初期設定とtimeUnit変更時の更新
  useEffect(() => {
    if (availablePeriods.length > 0) {
      setSelectedPeriod(availablePeriods[0].value);
    } else {
      if (timeUnit === "year") {
        setSelectedPeriod(new Date().getFullYear());
      } else {
        setSelectedPeriod(
          `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`,
        );
      }
    }
  }, [timeUnit, availablePeriods]);

  // 選択された期間のデータをフィルタリング
  const getFilteredFinanceData = (
    dataType: "revenues" | "expenditures",
    unit: TimeUnit,
    period: string | number,
  ): FinanceData[] => {
    const sourceData =
      unit === "year"
        ? DUMMY_FINANCE_DATA_YEARLY[dataType]
        : DUMMY_FINANCE_DATA_MONTHLY[dataType];
    if (unit === "year") {
      return sourceData.filter((d) => d.year === period);
    }
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

  return {
    selectedPeriod,
    setSelectedPeriod,
    availablePeriods,
    filteredRevenues,
    filteredExpenditures,
    filteredIndicators,
    currentYearForIndicators,
    allIndicators: DUMMY_FINANCE_INDICATORS,
  };
}

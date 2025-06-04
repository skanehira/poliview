export interface FinanceData {
  year: number;
  category: string;
  amount: number;
  month?: number;
}

export interface FinanceIndicator {
  year: number;
  fiscalCapacity: number;
  currentBalanceRatio: number;
  publicDebtRatio: number;
  fundBalance: number;
}

export type TimeUnit = "year" | "month";
export type ChartType = "bar" | "pie";
export type FinanceType = "revenue" | "expenditure";

export interface PeriodOption {
  value: number;
  label: string;
}

export interface ChartClickData {
  year: number;
  category: string;
  amount: number;
}

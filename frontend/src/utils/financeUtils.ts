export const formatCurrency = (value: number): string => {
  if (value >= 100000000) {
    return `${(value / 100000000).toFixed(1)}億円`;
  }
  if (value >= 10000) {
    return `${(value / 10000).toFixed(0)}万円`;
  }
  return `${value}円`;
};

export const formatRatio = (value: number): string => `${value.toFixed(1)}%`;

export const formatIndex = (value: number): string => value.toFixed(2);

export const CHART_COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28DFF",
  "#FF69B4",
  "#8884d8",
  "#82ca9d",
];

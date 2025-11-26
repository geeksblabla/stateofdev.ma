export type ChartType = "bar" | "pie";

export const chartTypes: { label: string; value: ChartType }[] = [
  { label: "Bar Chart", value: "bar" },
  { label: "Pie Chart", value: "pie" }
];

"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartPoint } from "@/lib/types";

interface ResultsChartProps {
  data: ChartPoint[];
  variant?: "area" | "line";
  height?: number;
  color?: string;
}

const DEFAULT_COLOR = "#0d7377";

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name?: string }[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-charcoal/10 bg-white px-3 py-2 text-xs shadow-soft">
      <p className="font-medium text-charcoal">{label}</p>
      <p className="text-muted">{payload[0].value.toLocaleString()}</p>
    </div>
  );
}

export default function ResultsChart({
  data,
  variant = "area",
  height = 260,
  color = DEFAULT_COLOR,
}: ResultsChartProps) {
  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length === 0) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center rounded-xl border border-dashed border-charcoal/15 text-sm text-muted"
      >
        No data
      </div>
    );
  }

  const gradientId = `grad-${variant}`;

  if (variant === "line") {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={safeData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e1d8" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#6b6b6b" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#6b6b6b" }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: color, strokeOpacity: 0.2 }} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            dot={{ r: 3, fill: color }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={safeData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e7e1d8" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: "#6b6b6b" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#6b6b6b" }}
          tickLine={false}
          axisLine={false}
          width={40}
        />
        <Tooltip content={<ChartTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2.5}
          fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

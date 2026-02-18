interface SparklineViewProps {
  data: number[];
  isPositive: boolean;
  height?: number;
  width?: number;
}

export function SparklineView({ data, isPositive, height = 40, width = 96 }: SparklineViewProps) {
  if (!data || data.length === 0) {
    return <div style={{ height, width }} className="bg-muted/50 rounded" />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const padding = 4;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const normalizedY = (value - min) / range;
    const y = padding + chartHeight - normalizedY * chartHeight;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  const strokeColor = isPositive ? "oklch(0.8545 0.1675 159.6564)" : "oklch(0.6665 0.2111 2.8306)";
  const fillGradientId = isPositive ? "spark-up" : "spark-down";

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={fillGradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.2" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${pathD} L ${width - padding},${height} L ${padding},${height} Z`}
        fill={`url(#${fillGradientId})`}
      />
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

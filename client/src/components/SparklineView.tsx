interface SparklineViewProps {
  data: number[];
  isPositive: boolean;
  height?: number;
  className?: string;
}

export function SparklineView({
  data,
  isPositive,
  height = 40,
  className = "w-full",
}: SparklineViewProps) {
  if (!data || data.length === 0) {
    return <div style={{ height }} className={`bg-muted/50 rounded ${className}`} />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const padding = 2;
  const viewBoxWidth = 100;
  const viewBoxHeight = height;
  const chartWidth = viewBoxWidth - padding * 2;
  const chartHeight = viewBoxHeight - padding * 2;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const normalizedY = (value - min) / range;
    const y = padding + chartHeight - normalizedY * chartHeight;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  const strokeColor = isPositive ? "oklch(0.65 0.175 159.6564)" : "oklch(0.6665 0.2111 2.8306)";
  const fillGradientId = isPositive ? "spark-up" : "spark-down";

  return (
    <svg
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      preserveAspectRatio="none"
      className={className}
      style={{ height }}
    >
      <defs>
        <linearGradient id={fillGradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.15" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${pathD} L ${viewBoxWidth - padding},${viewBoxHeight} L ${padding},${viewBoxHeight} Z`}
        fill={`url(#${fillGradientId})`}
      />
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

interface SubwayLineBadgeProps {
  line: string;
  color?: "red" | "orange" | "yellow" | "green" | "blue" | "purple" | "gray" | "brown" | "lime";
  size?: "sm" | "md" | "lg";
}

const colorMap: Record<string, string> = {
  red: "#EE352E",
  orange: "#FF6319",
  yellow: "#FCCC0A",
  green: "#00933C",
  blue: "#0039A6",
  purple: "#B933AD",
  gray: "#A7A9AC",
  brown: "#996633",
  lime: "#6CBE45",
};

const sizeMap = {
  sm: { dimension: "w-6 h-6", fontSize: "text-xs" },
  md: { dimension: "w-8 h-8", fontSize: "text-sm" },
  lg: { dimension: "w-12 h-12", fontSize: "text-lg" },
};

export function SubwayLineBadge({ line, color = "blue", size = "md" }: SubwayLineBadgeProps) {
  const bgColor = colorMap[color];
  const textColor = color === "yellow" ? "#000000" : "#FFFFFF";
  const { dimension, fontSize } = sizeMap[size];

  return (
    <div
      className={`rounded-full flex items-center justify-center flex-shrink-0 ${dimension}`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <span className={`font-bold leading-none ${fontSize}`}>{line}</span>
    </div>
  );
}

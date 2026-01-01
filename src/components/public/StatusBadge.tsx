type PromiseStatus = "Not started" | "In progress" | "Completed" | "Stalled";

interface StatusBadgeProps {
  status: PromiseStatus | string;
  variant?: "circle" | "pill";
  size?: "sm" | "md" | "lg";
}

const getStatusStyle = (status: string): { bg: string; text: string; line: string } => {
  switch (status) {
    case "Not started":
      return { bg: "#A7A9AC", text: "#FFFFFF", line: "NS" };
    case "In progress":
      return { bg: "#0039A6", text: "#FFFFFF", line: "IP" };
    case "Completed":
      return { bg: "#00933C", text: "#FFFFFF", line: "C" };
    case "Stalled":
      return { bg: "#EE352E", text: "#FFFFFF", line: "S" };
    default:
      return { bg: "#A7A9AC", text: "#FFFFFF", line: "?" };
  }
};

export function StatusBadge({ status, variant = "circle", size = "md" }: StatusBadgeProps) {
  const style = getStatusStyle(status);
  
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-12 h-12 text-base",
  };

  if (variant === "pill") {
    return (
      <span
        className="inline-flex items-center px-4 py-2 font-bold uppercase tracking-wide text-xs"
        style={{ backgroundColor: style.bg, color: style.text }}
      >
        {status}
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <div
        className={`flex items-center justify-center rounded-full flex-shrink-0 ${sizeClasses[size]}`}
        style={{ backgroundColor: style.bg }}
      >
        <span className="font-bold" style={{ color: style.text }}>
          {style.line}
        </span>
      </div>
      <span className="font-bold text-sm uppercase tracking-wide text-foreground">
        {status}
      </span>
    </div>
  );
}

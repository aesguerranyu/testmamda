type PromiseStatus = "Not started" | "In progress" | "Completed" | "Stalled";

interface StatusBadgeProps {
  status: PromiseStatus;
}

// NYC Subway line indicator style
export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyle = (status: PromiseStatus): { bg: string; text: string; line: string } => {
    switch (status) {
      case "Not started":
        return { bg: "#A7A9AC", text: "#FFFFFF", line: "NS" }; // Gray line (like L/S)
      case "In progress":
        return { bg: "#0039A6", text: "#FFFFFF", line: "IP" }; // Blue line (like A/C/E)
      case "Completed":
        return { bg: "#00933C", text: "#FFFFFF", line: "C" }; // Green line (like 4/5/6)
      case "Stalled":
        return { bg: "#EE352E", text: "#FFFFFF", line: "S" }; // Red line (like 1/2/3)
      default:
        return { bg: "#A7A9AC", text: "#FFFFFF", line: "?" };
    }
  };

  const style = getStatusStyle(status);

  return (
    <div className="inline-flex items-center gap-2">
      {/* Subway circle indicator */}
      <div 
        className="flex items-center justify-center rounded-full"
        style={{ backgroundColor: style.bg, width: '2rem', height: '2rem' }}
      >
        <span 
          className="font-bold text-sm"
          style={{ color: style.text }}
        >
          {style.line}
        </span>
      </div>
      {/* Status text */}
      <span className="font-bold text-sm uppercase tracking-wide text-black">
        {status}
      </span>
    </div>
  );
}
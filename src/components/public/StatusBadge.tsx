type PromiseStatus = "Not started" | "In progress" | "Completed" | "Stalled" | "Broken";

interface StatusBadgeProps {
  status: PromiseStatus;
}

// NYC Subway line indicator style
export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyle = (status: PromiseStatus): { bg: string; text: string; line: string } => {
    switch (status) {
      case "Not started":
        return { bg: "#808183", text: "#FFFFFF", line: "NS" };
      case "In progress":
        return { bg: "#0039A6", text: "#FFFFFF", line: "IP" };
      case "Completed":
        return { bg: "#00933C", text: "#FFFFFF", line: "C" };
      case "Stalled":
        return { bg: "#FCCC0A", text: "#000000", line: "S" };
      case "Broken":
        return { bg: "#EE352E", text: "#FFFFFF", line: "B" };
      default:
        return { bg: "#808183", text: "#FFFFFF", line: "?" };
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
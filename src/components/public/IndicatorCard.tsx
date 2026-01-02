import { Link } from "react-router-dom";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface IndicatorCardProps {
  indicator: {
    id: string;
    headline: string;
    category: string;
    current: string;
    currentDescription?: string;
    target: string;
    descriptionParagraph: string;
    source: string;
    promise?: {
      id: string;
      headline: string;
      category: string;
    } | null;
  };
}

// Map categories to subway line colors
const getCategoryColor = (category: string): string => {
  const colorMap: { [key: string]: string } = {
    "Housing": "#EE352E",        // Red line (1,2,3)
    "Transportation": "#0039A6",  // Blue line (A,C,E)
    "Education": "#00933C",       // Green line (4,5,6)
    "Healthcare": "#FF6319",      // Orange line (B,D,F,M)
    "Environment": "#6CBE45",     // Lime (G line)
    "Affordability": "#FCCC0A",   // Yellow line (N,Q,R,W)
    "Labor": "#996633",           // Brown
    "Childcare": "#FF6319",       // Orange
    "Safety": "#B933AD",          // Purple (7 line)
    "Government Reform": "#A7A9AC" // Gray
  };
  return colorMap[category] || "#A7A9AC";
};

// Determine trend direction from target
const getTrendInfo = (target: string, current: string): { direction: 'up' | 'down' | null; isPositive: boolean } => {
  const targetLower = target.toLowerCase();
  
  // Check if target indicates increase or decrease
  if (targetLower.includes('increase') || targetLower.includes('higher') || targetLower === '100%') {
    return { direction: 'up', isPositive: true };
  }
  if (targetLower.includes('decrease') || targetLower.includes('lower') || targetLower.includes('reduce')) {
    return { direction: 'down', isPositive: true };
  }
  
  // Try to parse numeric targets
  const currentNum = parseFloat(current.replace(/[^0-9.-]/g, ''));
  const targetNum = parseFloat(target.replace(/[^0-9.-]/g, ''));
  
  if (!isNaN(currentNum) && !isNaN(targetNum)) {
    if (targetNum > currentNum) {
      return { direction: 'up', isPositive: true };
    } else if (targetNum < currentNum) {
      return { direction: 'down', isPositive: true };
    }
  }
  
  return { direction: null, isPositive: true };
};

// Calculate progress percentage
const calculateProgress = (current: string, target: string): number | null => {
  const currentNum = parseFloat(current.replace(/[^0-9.-]/g, ''));
  const targetNum = parseFloat(target.replace(/[^0-9.-]/g, ''));
  
  if (isNaN(currentNum) || isNaN(targetNum) || targetNum === 0) {
    return null;
  }
  
  // For percentage targets like "100%"
  if (target.includes('%') && targetNum > 0) {
    return Math.min(100, Math.max(0, (currentNum / targetNum) * 100));
  }
  
  // For decrease targets
  const targetLower = target.toLowerCase();
  if (targetLower.includes('decrease') || targetLower.includes('lower') || targetLower.includes('reduce')) {
    // Progress is inverse - lower is better
    return Math.min(100, Math.max(0, 100 - ((currentNum / 10) * 100)));
  }
  
  return Math.min(100, Math.max(0, (currentNum / targetNum) * 100));
};

// Get value color based on category and trend
const getValueColor = (category: string, target: string): string => {
  const targetLower = target.toLowerCase();
  
  // Yellow for affordability/decrease targets
  if (category === "Affordability" || targetLower.includes('decrease') || targetLower.includes('lower')) {
    return "#FCCC0A";
  }
  
  // Green for increase/positive targets
  return "#00933C";
};

export function IndicatorCard({ indicator }: IndicatorCardProps) {
  const relatedPromise = indicator.promise || null;
  const categoryColor = getCategoryColor(indicator.category);
  const textColor = indicator.category === "Affordability" ? "#000000" : "#FFFFFF";
  
  const trendInfo = getTrendInfo(indicator.target, indicator.current);
  const progress = calculateProgress(indicator.current, indicator.target);
  const valueColor = getValueColor(indicator.category, indicator.target);
  const progressColor = indicator.category === "Affordability" ? "#FCCC0A" : "#00933C";

  // Parse source to extract URL if present
  const parseSource = (source: string): { name: string; url?: string } => {
    const urlMatch = source.match(/(https?:\/\/[^\s]+)/);
    if (urlMatch) {
      const name = source.replace(urlMatch[0], '').replace(' - ', '').trim() || urlMatch[0];
      return { name, url: urlMatch[0] };
    }
    return { name: source };
  };

  const parsedSource = parseSource(indicator.source);

  return (
    <article className="bg-white border border-gray-200 h-full flex flex-col">
      {/* Category Header */}
      <div className="p-4 md:p-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div 
            className="flex items-center justify-center rounded-full shrink-0"
            style={{ 
              width: '3rem', 
              height: '3rem', 
              backgroundColor: categoryColor 
            }}
          >
            <span className="font-bold text-xl" style={{ color: textColor, lineHeight: 1 }}>
              {indicator.category.charAt(0)}
            </span>
          </div>
          <span 
            className="font-bold uppercase tracking-wider"
            style={{ 
              letterSpacing: '0.15em', 
              fontSize: '12px',
              color: categoryColor
            }}
          >
            {indicator.category}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-5 flex-grow flex flex-col">
        {/* Current Value with Trend Arrow */}
        <div className="flex items-start gap-2 mb-3">
          <div 
            className="font-bold"
            style={{ 
              fontSize: 'clamp(48px, 10vw, 64px)',
              color: valueColor,
              lineHeight: 1,
              letterSpacing: '-0.02em'
            }}
          >
            {indicator.current}
          </div>
          {trendInfo.direction && (
            <div className="mt-3">
              {trendInfo.direction === 'up' ? (
                <ArrowUp className="w-8 h-8 text-black" strokeWidth={3} />
              ) : (
                <ArrowDown className="w-8 h-8 text-black" strokeWidth={3} />
              )}
            </div>
          )}
        </div>

        {/* Headline */}
        <h3 
          className="font-bold text-black mb-3 tracking-tight" 
          style={{ fontSize: 'clamp(18px, 4vw, 22px)', lineHeight: 1.2 }}
        >
          {indicator.headline}
        </h3>

        {/* Target */}
        <div className="mb-4">
          <span 
            className="uppercase font-bold text-gray-500"
            style={{ letterSpacing: '0.1em', fontSize: '11px' }}
          >
            TARGET: {indicator.target}
          </span>
        </div>

        {/* Progress Bar */}
        {progress !== null && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span 
                className="uppercase font-bold text-gray-500"
                style={{ letterSpacing: '0.1em', fontSize: '11px' }}
              >
                PROGRESS
              </span>
              <span 
                className="font-bold"
                style={{ fontSize: '14px', color: progressColor }}
              >
                {Math.round(progress)}%
              </span>
            </div>
            <Progress 
              value={progress} 
              className="bg-gray-200"
              style={{ 
                '--progress-color': progressColor 
              } as React.CSSProperties}
            />
          </div>
        )}

        {/* Description Paragraph */}
        <p 
          className="mb-4 leading-relaxed flex-grow" 
          style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}
        >
          {indicator.descriptionParagraph}
        </p>

        {/* Data Source */}
        <div className="border-t border-gray-200 pt-4 mt-auto">
          <div className="mb-3">
            <div 
              className="uppercase font-bold mb-1 text-gray-500"
              style={{ letterSpacing: '0.1em', fontSize: '11px' }}
            >
              DATA SOURCE
            </div>
            <div className="text-sm">
              {parsedSource.url ? (
                <a 
                  href={parsedSource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:text-[#0039A6] underline"
                >
                  {parsedSource.name}
                </a>
              ) : (
                <span className="text-black">{parsedSource.name}</span>
              )}
            </div>
          </div>
        </div>

        {/* Related Promises */}
        {relatedPromise && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 
              className="uppercase font-bold mb-3 text-gray-500"
              style={{ letterSpacing: '0.1em', fontSize: '11px' }}
            >
              RELATED PROMISES
            </h4>
            <Link
              to={`/promises/${relatedPromise.id}`}
              className="text-black hover:text-[#0039A6] transition-colors no-underline flex items-center gap-3 p-3 border border-gray-200 hover:border-[#0039A6]"
              onClick={() => window.scrollTo(0, 0)}
            >
              <div 
                className="flex items-center justify-center rounded-full shrink-0"
                style={{ 
                  width: '2rem', 
                  height: '2rem', 
                  backgroundColor: getCategoryColor(relatedPromise.category)
                }}
              >
                <span 
                  className="font-bold text-xs" 
                  style={{ 
                    color: relatedPromise.category === "Affordability" ? "#000000" : "#FFFFFF",
                    lineHeight: 1 
                  }}
                >
                  {relatedPromise.category.charAt(0)}
                </span>
              </div>
              <span className="font-medium text-sm">{relatedPromise.headline}</span>
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
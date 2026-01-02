import { Link } from "react-router-dom";

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

export function IndicatorCard({ indicator }: IndicatorCardProps) {
  // Get related promise by headline reference if exists
  const relatedPromise = indicator.promise 
    ? indicator.promise 
    : null;

  const categoryColor = getCategoryColor(indicator.category);
  const textColor = indicator.category === "Economic Justice" ? "#000000" : "#FFFFFF";

  // Parse source to extract URL if present (format: "Source Name - https://url.com")
  const parseSource = (source: string): { name: string; url?: string } => {
    const parts = source.split(' - ');
    if (parts.length === 2) {
      return { name: parts[0], url: parts[1] };
    }
    return { name: source };
  };

  const parsedSource = parseSource(indicator.source);

  return (
    <article className="bg-white border border-gray-300 h-full flex flex-col">
      {/* Category Header */}
      <div className="p-3 md:p-4 border-b border-gray-300">
        <div className="flex items-center gap-2 sm:gap-3">
          <div 
            className="flex items-center justify-center rounded-full shrink-0"
            style={{ 
              width: 'clamp(2.5rem, 8vw, 3rem)', 
              height: 'clamp(2.5rem, 8vw, 3rem)', 
              backgroundColor: categoryColor 
            }}
          >
            <span className="font-bold" style={{ color: textColor, lineHeight: 1, fontSize: 'clamp(16px, 4vw, 20px)' }}>
              {indicator.category.charAt(0)}
            </span>
          </div>
          <span className="text-gray-600 font-bold uppercase tracking-wide" style={{ letterSpacing: '0.1em', fontSize: 'clamp(10px, 2.5vw, 12px)' }}>
            {indicator.category}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-3 md:p-4 flex-grow flex flex-col">
        {/* Current Value - Left Aligned */}
        <div className="mb-2">
          <div 
            className="font-bold break-words"
            style={{ 
              fontSize: 'clamp(48px, 10vw, 72px)',
              color: categoryColor,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            {indicator.current}
          </div>
        </div>

        {/* Current Description - 60% black */}
        {indicator.currentDescription && (
          <div className="mb-3">
            <span 
              className="font-medium"
              style={{ 
                color: 'rgba(0, 0, 0, 0.6)',
                fontSize: 'clamp(12px, 2.5vw, 14px)'
              }}
            >
              {indicator.currentDescription}
            </span>
          </div>
        )}

        {/* Headline */}
        <h3 className="font-bold text-black mb-2 tracking-tight" style={{ fontSize: 'clamp(16px, 3.5vw, 20px)' }}>
          {indicator.headline}
        </h3>

        {/* Target - Now below headline */}
        <div className="mb-3">
          <span className="uppercase font-bold" style={{ letterSpacing: '0.05em', color: '#6B7280', fontSize: 'clamp(9px, 2vw, 11px)' }}>
            Target: {indicator.target}
          </span>
        </div>

        {/* Description Paragraph */}
        <p className="mb-3 leading-relaxed" style={{ color: '#374151', fontSize: 'clamp(14px, 3vw, 14px)', lineHeight: '1.6' }}>
          {indicator.descriptionParagraph}
        </p>

        {/* Meta Info */}
        <div className="border-t border-gray-300 pt-4 mt-4">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <div className="text-xs uppercase font-bold mb-2" style={{ letterSpacing: '0.1em', color: '#6B7280' }}>
                Source
              </div>
              <div className="text-sm">
                {parsedSource.url ? (
                  <a 
                    href={parsedSource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline font-medium"
                  >
                    {parsedSource.name}
                  </a>
                ) : (
                  <span className="text-black">{parsedSource.name}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Promises */}
        {relatedPromise && (
          <div className="mt-4">
            <div className="border-t border-gray-300 pt-4">
              <h4 className="text-xs uppercase font-bold mb-3" style={{ letterSpacing: '0.1em', color: '#6B7280' }}>
                Related Promise
              </h4>
              <div className="flex flex-col gap-3">
                <Link
                  key={relatedPromise.id}
                  to={`/promises/${relatedPromise.id}`}
                  className="text-black hover:text-blue-600 transition-colors no-underline flex items-start gap-3 p-3 border border-gray-300 hover:border-blue-600"
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
                        color: relatedPromise.category === "Economic Justice" ? "#000000" : "#FFFFFF",
                        lineHeight: 1 
                      }}
                    >
                      {relatedPromise.category.charAt(0)}
                    </span>
                  </div>
                  <span className="font-medium flex-grow">{relatedPromise.headline}</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
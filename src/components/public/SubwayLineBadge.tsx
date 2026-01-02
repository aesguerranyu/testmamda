// NYC Subway-style line badge component
// Inspired by the iconic MTA subway line indicators

interface SubwayLineBadgeProps {
  line: string;
  color?: 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'gray' | 'brown';
  size?: 'sm' | 'md' | 'lg';
}

const colorMap = {
  red: '#EE352E',
  orange: '#FF6319',
  yellow: '#FCCC0A',
  green: '#6CBE45',
  blue: '#0039A6',
  purple: '#B933AD',
  gray: '#A7A9AC',
  brown: '#996633',
};

const sizeMap = {
  sm: { width: '1.5rem', height: '1.5rem', fontSize: '0.75rem' },
  md: { width: '2rem', height: '2rem', fontSize: '0.875rem' },
  lg: { width: '3rem', height: '3rem', fontSize: '1.125rem' },
};

export function SubwayLineBadge({ line, color = 'blue', size = 'md' }: SubwayLineBadgeProps) {
  const bgColor = colorMap[color];
  const textColor = color === 'yellow' ? '#000000' : '#FFFFFF';
  const dimensions = sizeMap[size];
  
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0"
      style={{ 
        backgroundColor: bgColor, 
        color: textColor,
        width: dimensions.width,
        height: dimensions.height,
        fontSize: dimensions.fontSize
      }}
    >
      <span className="font-bold" style={{ lineHeight: 1 }}>{line}</span>
    </div>
  );
}
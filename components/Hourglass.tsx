"use client";

type HourglassProps = {
  progress: number; // 0 to 1 representing time passed
  size?: number; // optional width/height, default ~180px
  sandColor?: string;
  glassColor?: string;
};

export function Hourglass({
  progress,
  size = 180,
  sandColor,
  glassColor,
}: HourglassProps) {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  
  // Hourglass dimensions - simple and minimal
  const width = size;
  const height = size;
  const padding = width * 0.2;
  const neckWidth = width * 0.15;
  const neckHeight = height * 0.1;
  const topChamberHeight = (height - neckHeight) / 2;
  const bottomChamberHeight = (height - neckHeight) / 2;
  
  // Positions
  const topChamberY = padding;
  const neckY = topChamberY + topChamberHeight;
  const bottomChamberY = neckY + neckHeight;
  const bottomChamberBottom = height - padding;
  
  // Sand levels based on progress
  const topSandHeight = topChamberHeight * (1 - clampedProgress);
  const bottomSandHeight = bottomChamberHeight * clampedProgress;
  
  // Top sand starts from top and shrinks downward
  const topSandY = topChamberY;
  // Bottom sand starts from bottom and grows upward
  const bottomSandY = bottomChamberBottom - bottomSandHeight;

  // Create unique IDs for clip paths
  const clipIdTop = `hourglass-top-${Math.random().toString(36).substr(2, 9)}`;
  const clipIdBottom = `hourglass-bottom-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="transition-transform duration-300"
      style={{
        transform: clampedProgress > 0 && clampedProgress < 1 ? "scale(1.02)" : "scale(1)",
      }}
    >
      <defs>
        {/* Clip path for top chamber */}
        <clipPath id={clipIdTop}>
          <path
            d={`M ${padding} ${topChamberY}
               L ${width * 0.5 - neckWidth / 2} ${neckY}
               L ${width * 0.5 + neckWidth / 2} ${neckY}
               L ${width - padding} ${topChamberY}
               Z`}
          />
        </clipPath>
        
        {/* Clip path for bottom chamber */}
        <clipPath id={clipIdBottom}>
          <path
            d={`M ${padding} ${bottomChamberBottom}
               L ${width * 0.5 - neckWidth / 2} ${bottomChamberY}
               L ${width * 0.5 + neckWidth / 2} ${bottomChamberY}
               L ${width - padding} ${bottomChamberBottom}
               Z`}
          />
        </clipPath>
      </defs>
      
      {/* Top chamber sand */}
      <rect
        x={padding}
        y={topSandY}
        width={width - padding * 2}
        height={topSandHeight}
        clipPath={`url(#${clipIdTop})`}
        fill={sandColor || "currentColor"}
        className="transition-all duration-200 ease-out"
      />
      
      {/* Bottom chamber sand */}
      <rect
        x={padding}
        y={bottomSandY}
        width={width - padding * 2}
        height={bottomSandHeight}
        clipPath={`url(#${clipIdBottom})`}
        fill={sandColor || "currentColor"}
        className="transition-all duration-200 ease-out"
      />
      
      {/* Glass outline - top chamber */}
      <path
        d={`M ${padding} ${topChamberY}
           L ${width * 0.5 - neckWidth / 2} ${neckY}
           L ${width * 0.5 + neckWidth / 2} ${neckY}
           L ${width - padding} ${topChamberY}
           Z`}
        fill="none"
        stroke={glassColor || "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.25}
      />
      
      {/* Glass outline - bottom chamber */}
      <path
        d={`M ${padding} ${bottomChamberBottom}
           L ${width * 0.5 - neckWidth / 2} ${bottomChamberY}
           L ${width * 0.5 + neckWidth / 2} ${bottomChamberY}
           L ${width - padding} ${bottomChamberBottom}
           Z`}
        fill="none"
        stroke={glassColor || "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.25}
      />
      
      {/* Neck connection */}
      <line
        x1={width * 0.5 - neckWidth / 2}
        y1={neckY}
        x2={width * 0.5 - neckWidth / 2}
        y2={bottomChamberY}
        stroke={glassColor || "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        opacity={0.25}
      />
      <line
        x1={width * 0.5 + neckWidth / 2}
        y1={neckY}
        x2={width * 0.5 + neckWidth / 2}
        y2={bottomChamberY}
        stroke={glassColor || "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        opacity={0.25}
      />
    </svg>
  );
}

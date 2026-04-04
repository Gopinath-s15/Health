import React from 'react';

export const AppLogo = ({ className = "w-10 h-10", noGlow = false }: { className?: string, noGlow?: boolean }) => {
  const filterProps = (glowColor: string) => noGlow ? {} : { filter: `drop-shadow(0 0 8px ${glowColor})` };

  return (
    <div className={`flex items-center justify-center shrink-0 relative ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl" fill="none">
        {/* Medical Cross Symbol - Green/Teal Glow */}
        <g className="heart-beat origin-center" style={filterProps('rgba(34, 197, 94, 0.6)')}>
          <path
            d="M 38 18 H 62 V 38 H 82 V 62 H 62 V 82 H 38 V 62 H 18 V 38 H 38 Z"
            fill="rgba(34, 197, 94, 0.15)"
            stroke="rgba(34, 197, 94, 0.8)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </g>
        {/* ECG Heartbeat Line - Red Waves */}
        <polyline
          className="ecg-line"
          points="8,50 25,50 32,25 45,85 52,50 64,50"
          stroke="#ef4444"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={filterProps('rgba(239, 68, 68, 0.8)')}
        />
        {/* AI text - White Glow */}
        <text
          x="66"
          y="58"
          className="font-display font-bold"
          fill="#ffffff"
          fontSize="24"
          stroke="none"
          style={filterProps('rgba(255,255,255,0.8)')}
        >
          AI
        </text>
      </svg>
    </div>
  );
};

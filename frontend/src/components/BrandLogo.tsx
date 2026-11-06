import React from 'react';

interface BrandLogoProps {
  variant?: 'mark' | 'white' | 'black' | 'full';
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'mark',
  size = 32,
  className,
  style,
}) => {
  if (variant === 'full') {
    return (
      <svg
        viewBox="0 0 340 100"
        width={size * 3.4}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={style}
      >
        <g transform="translate(4, 0)">
          <rect x="18" y="16" width="14" height="68" rx="4" fill="#0F172A" />
          <line x1="18" y1="33" x2="25" y2="33" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="18" y1="50" x2="27" y2="50" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="18" y1="67" x2="25" y2="67" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 32 24 C 64 24 82 34 82 50 C 82 66 64 76 32 76" stroke="#2563EB" strokeWidth="12" strokeLinecap="round" />
          <path d="M 36 36 C 54 36 66 42 66 50 C 66 58 54 64 36 64" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 4" opacity="0.95" />
        </g>
        <g transform="translate(98, 8)">
          <text x="10" y="44" fill="#F8FAFC" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="30" letterSpacing="0.02em">
            DARIUS<tspan fill="#38BDF8"> OS</tspan>
          </text>
          <text x="11" y="62" fill="#94A3B8" fontFamily="'JetBrains Mono', monospace" fontWeight="600" fontSize="10.5" letterSpacing="0.12em">
            ROAD DESIGN SYSTEM
          </text>
        </g>
      </svg>
    );
  }

  if (variant === 'black') {
    return (
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={style}
      >
        <rect x="18" y="16" width="14" height="68" rx="4" fill="#000000" />
        <line x1="18" y1="33" x2="25" y2="33" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="18" y1="50" x2="27" y2="50" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="18" y1="67" x2="25" y2="67" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 32 24 C 64 24 82 34 82 50 C 82 66 64 76 32 76" stroke="#000000" strokeWidth="12" strokeLinecap="round" />
        <path d="M 36 36 C 54 36 66 42 66 50 C 66 58 54 64 36 64" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 4" />
      </svg>
    );
  }

  if (variant === 'white') {
    return (
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={style}
      >
        <rect x="18" y="16" width="14" height="68" rx="4" fill="#FFFFFF" />
        <line x1="18" y1="33" x2="25" y2="33" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="18" y1="50" x2="27" y2="50" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="18" y1="67" x2="25" y2="67" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 32 24 C 64 24 82 34 82 50 C 82 66 64 76 32 76" stroke="#38BDF8" strokeWidth="12" strokeLinecap="round" />
        <path d="M 36 36 C 54 36 66 42 66 50 C 66 58 54 64 36 64" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 4" opacity="0.95" />
      </svg>
    );
  }

  // Default: Primary mark
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <rect x="18" y="16" width="14" height="68" rx="4" fill="#0F172A" />
      <line x1="18" y1="33" x2="25" y2="33" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="18" y1="50" x2="27" y2="50" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="18" y1="67" x2="25" y2="67" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 32 24 C 64 24 82 34 82 50 C 82 66 64 76 32 76" stroke="#2563EB" strokeWidth="12" strokeLinecap="round" />
      <path d="M 36 36 C 54 36 66 42 66 50 C 66 58 54 64 36 64" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 4" opacity="0.95" />
    </svg>
  );
};

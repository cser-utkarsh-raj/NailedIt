import React from 'react';

export function NailedItLogo({ size = 36, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="NailedIt Logo"
    >
      <defs>
        <linearGradient id="nailedBg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#3730A3" />
        </linearGradient>
        <linearGradient id="nailStrike" x1="14" y1="12" x2="34" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#C7D2FE" />
        </linearGradient>
      </defs>

      {/* Minimalist Squircle Base */}
      <rect width="48" height="48" rx="12" fill="url(#nailedBg)" />

      {/* Minimalist 16:9 Canvas Frame Outline */}
      <rect
        x="9"
        y="11"
        width="30"
        height="26"
        rx="5"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="2"
      />

      {/* Precision Geometric 'N' & Nail Stroke */}
      {/* Left vertical bar of N */}
      <rect x="15" y="16" width="3.5" height="16" rx="1.75" fill="#FFFFFF" />

      {/* Right vertical bar of N */}
      <rect x="29.5" y="16" width="3.5" height="16" rx="1.75" fill="#FFFFFF" />

      {/* Precision Diagonal Nail Strike connecting to form 'N' */}
      <path
        d="M16 16L32 32"
        stroke="url(#nailStrike)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Minimalist Gold Precision Tip / Accent */}
      <circle cx="33" cy="15" r="2" fill="#FBBF24" />
    </svg>
  );
}

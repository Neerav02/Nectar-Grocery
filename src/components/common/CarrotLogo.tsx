import React from 'react';

interface CarrotLogoProps {
  variant?: 'color' | 'white';
  className?: string;
}

export const CarrotLogo: React.FC<CarrotLogoProps> = ({
  variant = 'color',
  className = 'w-9 h-10',
}) => {
  const isColor = variant === 'color';

  const leafColor = isColor ? '#53B175' : '#FFFFFF';
  const bodyColor = isColor ? '#FF5533' : '#FFFFFF';
  const cutColor = isColor ? '#FFFFFF' : '#53B175';

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 3 Top Green Leaves */}
      <g fill={leafColor}>
        <rect x="55" y="8" width="15" height="32" rx="7.5" transform="rotate(-15 55 8)" />
        <rect x="68" y="14" width="15" height="32" rx="7.5" transform="rotate(18 68 14)" />
        <rect x="76" y="27" width="15" height="30" rx="7.5" transform="rotate(52 76 27)" />
      </g>

      {/* Orange Carrot Body */}
      <path
        d="M 72 37
           C 74 41, 71 49, 61 57
           L 26 84
           C 23 86, 20 84, 21 81
           L 38 48
           C 44 38, 54 30, 64 32
           C 69 33, 71 35, 72 37 Z"
        fill={bodyColor}
      />

      {/* 4 Notch Cuts (2 on left, 2 on right) */}
      <path
        d="M 33 53 L 47 48
           M 27 67 L 39 62
           M 67 48 L 57 53
           M 56 62 L 48 66"
        stroke={cutColor}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
};

import React from 'react';

interface CarrotLogoProps {
  variant?: 'color' | 'white';
  className?: string;
  size?: number | string;
}

export const CarrotLogo: React.FC<CarrotLogoProps> = ({
  variant = 'color',
  className = 'w-7 h-8',
}) => {
  const isColor = variant === 'color';

  const leafColor = isColor ? '#53B175' : '#FFFFFF';
  const bodyColor = isColor ? '#F3603F' : '#FFFFFF';
  const cutColor = isColor ? '#FFFFFF' : '#53B175';

  return (
    <svg
      viewBox="0 0 28 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 3 Top Leaves */}
      <path
        d="M11.2 7.8C10.5 4.5 11.8 1.8 13.9 0.8C16.0 -0.2 18.2 0.8 18.9 4.1C19.3 6.0 18.8 8.0 17.6 9.5C15.2 9.0 12.8 8.4 11.2 7.8Z"
        fill={leafColor}
      />
      <path
        d="M17.8 8.5C18.2 5.0 20.4 2.8 22.7 3.6C25.0 4.4 26.5 7.8 26.1 11.3C25.9 13.1 24.9 14.8 23.3 15.8C21.7 13.5 19.8 11.0 17.8 8.5Z"
        fill={leafColor}
      />
      <path
        d="M7.1 11.4C5.2 8.7 5.6 5.8 7.9 4.9C10.2 4.0 13.5 5.5 15.4 8.2C16.4 9.6 16.7 11.4 16.3 13.1C13.2 12.6 10.0 12.1 7.1 11.4Z"
        fill={leafColor}
      />

      {/* Tapered Carrot Body */}
      <path
        d="M23.1 12.6C23.9 13.6 24.0 15.0 23.4 16.3C20.6 22.1 14.8 28.9 9.8 33.1C9.2 33.6 8.3 33.4 7.9 32.7L0.4 20.3C-0.2 19.3 0.1 18.0 1.0 17.2C5.5 13.2 13.5 9.8 20.5 10.9C21.6 11.1 22.5 11.7 23.1 12.6Z"
        fill={bodyColor}
      />

      {/* White Diagonal Accent Cuts on Body */}
      <path
        d="M5.5 21.8L10.8 19.8M7.8 26.5L14.2 24.1M10.9 30.5L16.2 28.5"
        stroke={cutColor}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
};

import React from 'react';

interface CarrotLogoProps {
  variant?: 'color' | 'white';
  className?: string;
}

export const CarrotLogo: React.FC<CarrotLogoProps> = ({
  variant = 'color',
  className = 'w-8 h-9',
}) => {
  const isColor = variant === 'color';

  const leafColor = isColor ? '#53B175' : '#FFFFFF';
  const bodyColor = isColor ? '#F3603F' : '#FFFFFF';
  const cutColor = isColor ? '#FFFFFF' : '#53B175';

  return (
    <svg
      viewBox="0 0 54 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Leaf Top Cluster (Green #53B175) */}
      <g fill={leafColor}>
        <path d="M22.5 14.2C20.1 9.8 22.4 4.5 27.2 3.2C31.5 2.0 35.8 4.6 36.6 9.1C38.4 6.8 42.1 6.2 44.8 8.0C47.6 9.9 48.4 13.7 46.6 16.5C48.9 18.2 49.5 21.8 48.0 24.3C46.3 27.0 42.6 27.7 39.8 25.8C35.5 23.0 27.8 19.5 22.5 14.2Z" />
      </g>

      {/* Carrot Body (Orange #F3603F) */}
      <path
        d="M40.2 21.4C44.5 26.2 44.1 32.5 38.6 37.8L21.4 50.8C18.8 52.8 15.0 52.3 12.9 49.6L4.8 39.2C2.7 36.5 3.1 32.7 5.7 30.7L22.9 17.7C28.4 12.4 35.8 16.5 40.2 21.4Z"
        fill={bodyColor}
      />

      {/* White Cut Accents on Left Edge */}
      <path
        d="M13.2 36.8L21.8 30.3M10.1 43.1L16.7 38.1"
        stroke={cutColor}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
};

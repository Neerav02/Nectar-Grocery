import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'google' | 'facebook';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const PillButton: React.FC<PillButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = true,
  children,
  icon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-2 outline-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-[#53B175] text-white hover:bg-[#439B63] shadow-sm hover:shadow-md',
    secondary: 'bg-[#F2F3F2] text-[#53B175] hover:bg-[#E5E7E5]',
    outline: 'border border-[#E2E2E2] bg-white text-[#181725] hover:bg-gray-50',
    google: 'bg-[#5383EC] text-white hover:bg-[#4270D7]',
    facebook: 'bg-[#4A66AC] text-white hover:bg-[#3B5493]',
  };

  const sizeStyles = {
    sm: 'h-11 px-4 text-sm',
    md: 'h-14 px-6 text-base',
    lg: 'h-16 px-8 text-lg',
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
      ) : icon ? (
        <span className="mr-3">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};

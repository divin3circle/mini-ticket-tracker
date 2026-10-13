import { HugeiconsIcon } from '@hugeicons/react';
import { Loading03FreeIcons } from '@hugeicons/core-free-icons';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'size-4',
    md: 'size-8',
    lg: 'size-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <HugeiconsIcon
        icon={Loading03FreeIcons}
        className={`animate-spin text-primary ${sizes[size]}`}
        aria-hidden="true"
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
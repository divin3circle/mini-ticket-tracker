import { cn } from 'cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className, variant = 'text', width, height, ...props }: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-muted overflow-hidden';
  
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      style={{ width, height, ...props.style }}
      {...props}
    />
  );
}
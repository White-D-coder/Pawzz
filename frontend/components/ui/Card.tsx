import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

const Card = ({ className, children, hoverEffect = true, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-surface-border shadow-soft overflow-hidden transition-all',
        hoverEffect && 'hover:shadow-md hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { Card };

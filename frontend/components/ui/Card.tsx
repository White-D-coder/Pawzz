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
        'bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-shadow',
        hoverEffect && 'hover:shadow-xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { Card };

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
        'bg-white rounded-[2rem] border border-gray-100 shadow-cloud overflow-hidden transition-all duration-300',
        hoverEffect && 'hover:shadow-cloud-lg hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { Card };

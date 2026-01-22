import { ReactNode } from 'react';

interface FeatureGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export default function FeatureGrid({ 
  children, 
  columns = 3, 
  className = "" 
}: FeatureGridProps) {
  const gridClasses = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-6 max-w-5xl mx-auto ${className}`}>
      {children}
    </div>
  );
}

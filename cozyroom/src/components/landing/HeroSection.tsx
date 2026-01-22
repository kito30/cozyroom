import { ReactNode } from 'react';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description: string;
  children?: ReactNode;
}

export default function HeroSection({ 
  title, 
  subtitle, 
  description, 
  children 
}: HeroSectionProps) {
  return (
    <div className="text-center space-y-8 mb-16">
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white animate-slide-up">
        {title}
        {subtitle && (
          <span className="block mt-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500 bg-clip-text text-transparent">
            {subtitle}
          </span>
        )}
      </h1>
      <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-300 leading-relaxed animate-slide-up-delay">
        {description}
      </p>
      {children && (
        <div className="animate-slide-up-delay-2">
          {children}
        </div>
      )}
    </div>
  );
}

import Link from 'next/link';
import { ReactNode } from 'react';

interface CTAButtonProps {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  icon?: ReactNode;
  className?: string;
}

export default function CTAButton({ 
  href, 
  children, 
  variant = 'primary', 
  icon,
  className = "" 
}: CTAButtonProps) {
  const baseClasses = "inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 w-full sm:w-auto";
  
  const variantClasses = {
    primary: "text-white bg-linear-to-r from-emerald-500 to-teal-500 shadow-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/60 focus-visible:ring-emerald-500",
    secondary: "text-slate-200 bg-slate-800/50 backdrop-blur-xl border border-slate-700/80 shadow-black/40 hover:bg-slate-800/80 hover:border-slate-600 focus-visible:ring-slate-500",
  };

  return (
    <Link
      href={href}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      <span>{children}</span>
      {icon && <span className="ml-2">{icon}</span>}
    </Link>
  );
}

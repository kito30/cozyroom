import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  accentColor?: 'emerald' | 'blue' | 'indigo' | 'purple' | 'teal';
}

const colorClasses = {
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    ring: 'ring-emerald-500/20',
    hover: 'hover:border-emerald-500/50 hover:shadow-emerald-500/20',
  },
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    ring: 'ring-blue-500/20',
    hover: 'hover:border-blue-500/50 hover:shadow-blue-500/20',
  },
  indigo: {
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    ring: 'ring-indigo-500/20',
    hover: 'hover:border-indigo-500/50 hover:shadow-indigo-500/20',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    ring: 'ring-purple-500/20',
    hover: 'hover:border-purple-500/50 hover:shadow-purple-500/20',
  },
  teal: {
    bg: 'bg-teal-500/10',
    text: 'text-teal-400',
    ring: 'ring-teal-500/20',
    hover: 'hover:border-teal-500/50 hover:shadow-teal-500/20',
  },
};

export default function FeatureCard({ 
  icon, 
  title, 
  description, 
  accentColor = 'emerald' 
}: FeatureCardProps) {
  const colors = colorClasses[accentColor];

  return (
    <div className={`group relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl shadow-black/40 transition-all duration-300 ${colors.hover} hover:shadow-2xl hover:-translate-y-1`}>
      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${colors.bg} ${colors.text} mb-4 ring-1 ${colors.ring}`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

interface StatItemProps {
  value: string;
  label: string;
  gradient?: string;
}

function StatItem({ value, label, gradient = "from-emerald-400 to-teal-400" }: StatItemProps) {
  return (
    <div className="space-y-2">
      <div className={`text-4xl font-bold bg-linear-to-r ${gradient} bg-clip-text text-transparent`}>
        {value}
      </div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}

interface StatsSectionProps {
  stats: Array<{
    value: string;
    label: string;
    gradient?: string;
  }>;
}

export default function StatsSection({ stats }: StatsSectionProps) {
  return (
    <div className="relative border-t border-slate-800/50 bg-slate-900/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`grid grid-cols-2 md:grid-cols-${Math.min(stats.length, 4)} gap-8 text-center`}>
          {stats.map((stat) => (
            <StatItem key={`${stat.value}-${stat.label}`} {...stat} />
          ))}
        </div>
      </div>
    </div>
  );
}

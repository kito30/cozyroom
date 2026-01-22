interface BrandBadgeProps {
  text?: string;
  className?: string;
}

export default function BrandBadge({ text = "CozyRoom", className = "" }: BrandBadgeProps) {
  return (
    <div className={`inline-flex items-center justify-center rounded-2xl bg-slate-900/70 px-6 py-3 shadow-2xl shadow-black/40 ring-1 ring-slate-700/70 backdrop-blur-xl ${className}`}>
      <span className="mr-3 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.9)] animate-pulse" />
      <span className="text-sm font-semibold tracking-[0.2em] uppercase text-slate-200">
        {text}
      </span>
    </div>
  );
}

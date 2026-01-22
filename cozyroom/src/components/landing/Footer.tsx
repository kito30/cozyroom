interface FooterProps {
  text?: string;
  className?: string;
}

export default function Footer({ 
  text = "© 2026 CozyRoom. Built with ❤️ for a better digital experience.",
  className = "" 
}: FooterProps) {
  return (
    <div className={`border-t border-slate-800/50 bg-slate-950/50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-sm text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
}

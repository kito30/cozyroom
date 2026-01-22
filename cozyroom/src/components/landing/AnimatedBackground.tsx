export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-60 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700" />
      <div className="absolute bottom-20 right-1/3 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
    </div>
  );
}

/**
 * Loading skeleton shown while ProfileData suspends
 */
export default function ProfileSkeleton() {
  return (
    <div className="relative border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-6">
          {/* Avatar Skeleton */}
          <div className="h-32 w-32 rounded-full bg-slate-800/50 animate-pulse ring-4 ring-slate-800/50" />

          {/* User Info Skeleton */}
          <div className="flex-1 space-y-3">
            <div className="h-9 w-48 bg-slate-800/50 rounded-lg animate-pulse" />
            <div className="h-5 w-64 bg-slate-800/50 rounded-lg animate-pulse" />
            <div className="h-4 w-96 bg-slate-800/50 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

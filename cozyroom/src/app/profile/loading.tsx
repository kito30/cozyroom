export default function ProfileLoading() {
    return (
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Hero Header Skeleton */}
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

            {/* Form Skeleton */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl p-6 md:p-8 shadow-2xl shadow-black/40">
                    <div className="h-8 w-32 bg-slate-800/50 rounded-lg animate-pulse mb-6" />
                    
                    <div className="space-y-6">
                        {/* Avatar Upload Skeleton */}
                        <div className="flex items-center gap-6">
                            <div className="h-24 w-24 rounded-full bg-slate-800/50 animate-pulse ring-4 ring-slate-800/50" />
                            <div className="flex-1 space-y-2">
                                <div className="h-6 w-32 bg-slate-800/50 rounded-lg animate-pulse" />
                                <div className="h-4 w-48 bg-slate-800/50 rounded-lg animate-pulse" />
                                <div className="h-10 w-36 bg-slate-800/50 rounded-lg animate-pulse" />
                            </div>
                        </div>

                        {/* Form Fields Skeleton */}
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-5 w-24 bg-slate-800/50 rounded animate-pulse" />
                                <div className="h-11 w-full bg-slate-800/50 rounded-lg animate-pulse" />
                            </div>
                        ))}

                        {/* Submit Button Skeleton */}
                        <div className="flex justify-end pt-4">
                            <div className="h-12 w-36 bg-slate-800/50 rounded-xl animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

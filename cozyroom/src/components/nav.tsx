import Link from "next/link";
import { Suspense } from "react";
import AuthStatus from "@/src/components/AuthStatus";

function AuthStatusFallback() {
    return <div className="h-9 w-20 animate-pulse rounded-lg bg-slate-800/50" />;
}

export default function Nav() {
    return (
        <header className="sticky top-0 border-b border-slate-800/70 bg-slate-950/80 backdrop-blur z-10">
            <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 shadow-lg shadow-black/40 ring-1 ring-slate-700/80">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
                    </div>
                    <div className="leading-tight">
                        <span className="block text-sm font-semibold text-slate-50">
                            CozyRoom
                        </span>
                        <span className="block text-[11px] text-slate-400">
                            Your comfy corner
                        </span>
                    </div>
                </Link>

                <div className="flex items-center gap-4 text-sm">
                    <Link
                        href="/"
                        className="rounded-lg px-3 py-1.5 text-slate-300 transition hover:bg-slate-900 hover:text-slate-50"
                    >
                        Home
                    </Link>

                    <Suspense fallback={<AuthStatusFallback />}>
                        <AuthStatus />
                    </Suspense>
                </div>
            </nav>
        </header>
    );
}
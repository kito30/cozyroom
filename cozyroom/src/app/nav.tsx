'use client';

import Link from "next/link";
import { useAuth } from "@/src/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const Nav = () => {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const handleLogout = async () => {
        try {
            await fetch('/api/logout', { method: 'POST' });
            setIsMenuOpen(false);
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <header className="sticky top-0 z-30 border-b border-slate-800/70 bg-slate-950/80 backdrop-blur">
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

                    {isLoading ? (
                        // Loading state
                        <div className="h-9 w-20 animate-pulse rounded-lg bg-slate-800/50" />
                    ) : user ? (
                        // Logged in - show user menu
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-slate-300 ring-1 ring-slate-700/70 transition hover:bg-slate-800/80 hover:text-slate-50"
                            >
                                <div className="h-6 w-6 rounded-full bg-linear-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-xs font-bold text-slate-900">
                                    {user.email?.charAt(0).toUpperCase()}
                                </div>
                                <span className="max-w-[120px] truncate">
                                    {user.email?.split('@')[0]}
                                </span>
                            </button>

                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-800/80 bg-slate-900/95 backdrop-blur-xl shadow-xl shadow-black/40 animate-fade-in">
                                    <div className="p-2">
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-300 transition hover:bg-slate-800 hover:text-slate-50"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-rose-400 transition hover:bg-rose-500/10 hover:text-rose-300"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Not logged in - show login button
                        <Link
                            href="/login"
                            className="rounded-lg px-3 py-1.5 ring-1 ring-slate-600/70 transition hover:bg-slate-100/10 hover:text-white"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Nav;
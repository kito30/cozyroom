'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { UserIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { logoutAction } from "@/src/app/services/logout.action";

interface UserMenuProps {
    userEmail: string;
}

export default function UserMenu({ userEmail }: UserMenuProps) {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        if (!isMenuOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        // Add listener with a small delay to prevent immediate closing
        const timeoutId = setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
        }, 10);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isMenuOpen]);

    const handleLogout = async () => {
        await logoutAction();
        setIsMenuOpen(false);
        router.push('/login');
        router.refresh();
    };

    return (
        <div ref={menuRef} className="relative">
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-slate-300 ring-1 ring-slate-700/70 transition hover:bg-slate-800/80 hover:text-slate-50"
            >
                <div className="h-6 w-6 rounded-full bg-linear-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-xs font-bold text-slate-900">
                    {userEmail.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate">
                    {userEmail.split('@')[0]}
                </span>
            </button>

            {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-800/80 bg-slate-900/95 backdrop-blur-xl shadow-xl shadow-black/40 animate-fade-in ">
                    <div className="p-2">
                        <Link
                            href="/profile"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-300 transition hover:bg-slate-800 hover:text-slate-50"
                        >
                            <UserIcon className="w-4 h-4 " />
                            Profile
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-rose-400 transition hover:bg-rose-500/10 hover:text-rose-300"
                        >
                            <ArrowRightStartOnRectangleIcon className="w-4 h-4 " />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

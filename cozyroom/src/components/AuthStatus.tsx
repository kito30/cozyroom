'use client';

import Link from "next/link";
import { useAuth } from "@/src/providers/AuthProvider";
import UserMenu from "./UserMenu";

export default function AuthStatus() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="h-9 w-20 animate-pulse rounded-lg bg-slate-800/50" />;
    }

    if (user) {
        return <UserMenu userEmail={user.email || ''} />;
    }

    return (
        <Link
            href="/login"
            className="rounded-lg px-3 py-1.5 ring-1 ring-slate-600/70 transition hover:bg-slate-100/10 hover:text-white"
        >
            Login
        </Link>
    );
}

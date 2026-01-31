'use client';

import Link from "next/link";
import { useAuth } from "@/src/providers/AuthProvider";
import UserMenu from "@/src/components/UserMenu";

export default function AuthStatus() {
    const { user } = useAuth();

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

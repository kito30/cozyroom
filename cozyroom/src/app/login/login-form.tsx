'use client';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { loginAction, type LoginState } from './actions';
import Link from 'next/link';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-xl bg-linear-to-r from-blue-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/40 transition hover:from-blue-400 hover:to-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Logging in...' : 'Login'}
    </button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useActionState<LoginState, FormData>(loginAction, null);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center space-y-3">
          <div className="inline-flex items-center justify-center rounded-2xl bg-slate-900/70 px-4 py-2 shadow-lg shadow-black/40 ring-1 ring-slate-700/70 backdrop-blur">
            <span className="mr-2 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            <span className="text-xs font-medium tracking-[0.16em] uppercase text-slate-300">
              CozyRoom
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-50">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Sign in to continue your cozy session.
            </p>
          </div>
        </div>

        <form
          action={formAction}
          className="space-y-5 rounded-2xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl md:p-7"
        >
          {state?.error && (
            <div
              className="flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-950/60 px-3.5 py-2.5 text-sm text-red-100 shadow-sm shadow-red-900/60"
              role="alert"
            >
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.9)]" />
              <span className="leading-snug">
                {Array.isArray(state.error) ? state.error.join(', ') : state.error}
              </span>
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-200"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="mt-0.5 w-full rounded-xl border border-slate-700/80 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-sm shadow-black/40 outline-none transition focus:border-blue-400/80 focus:ring-2 focus:ring-blue-500/70"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-200"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="mt-0.5 w-full rounded-xl border border-slate-700/80 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-sm shadow-black/40 outline-none transition focus:border-blue-400/80 focus:ring-2 focus:ring-blue-500/70"
            />
          </div>

          <div className="pt-1">
            <SubmitButton />
          </div>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-400 hover:text-blue-300 transition">
            Create one here
          </Link>
        </p>
      </div>
    </div>
  );
}

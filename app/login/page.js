"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { GraduationCap } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const callbackUrl = "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push(callbackUrl);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-100 px-4 py-10 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="inline-flex items-center gap-2 font-heading text-2xl font-bold">
          <GraduationCap size={22} />
          Login
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Continue to AI Academic Dashboard
        </p>

        <button
          onClick={() => signIn("google", { callbackUrl })}
          className="mt-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold transition hover:border-brand-300 dark:border-slate-700 dark:bg-slate-950"
        >
          Continue with Google
        </button>

        <div className="my-4 text-center text-xs text-slate-500">or</div>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none ring-brand-400 focus:ring dark:border-slate-700 dark:bg-slate-950"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none ring-brand-400 focus:ring dark:border-slate-700 dark:bg-slate-950"
          />
          {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          New here?{" "}
          <Link href="/signup" className="font-semibold text-brand-700 underline dark:text-brand-300">
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function AuthNav() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="flex items-center gap-2">
      {user ? (
        <>
          <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900">
            <img
              src={user.image || "https://placehold.co/40x40/png"}
              alt={user.name || "User"}
              className="h-7 w-7 rounded-full object-cover"
            />
            <div className="hidden text-left sm:block">
              <p className="font-semibold">{user.name || "Student"}</p>
              <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-white px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 dark:border-rose-900 dark:bg-slate-900 dark:text-rose-300 dark:hover:bg-rose-950/30"
          >
            <LogOut size={15} />
            Logout
          </button>
        </>
      ) : (
        <Link
          href="/login"
          className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Login
        </Link>
      )}
    </div>
  );
}

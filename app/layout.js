import "./globals.css";
import { Mail, Phone, User } from "lucide-react";
import Providers from "./providers";

export const metadata = {
  title: "Academic Performance Analyzer",
  description: "Calculate, predict, and analyze your academic performance",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <footer className="px-4 pb-5 pt-2">
          <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-center gap-3 rounded-2xl border border-brand-200 bg-gradient-to-r from-brand-50 via-white to-cyan-50 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm dark:border-brand-900 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 dark:text-slate-200">
            <span className="inline-flex items-center gap-1.5">
              <User size={16} className="text-brand-600 dark:text-brand-300" />
              Harsh Goyal
            </span>
            <span className="hidden text-slate-400 sm:inline">|</span>
            <a
              href="mailto:harshgoyal190720@gmail.com"
              className="inline-flex items-center gap-1.5 transition hover:text-brand-700 dark:hover:text-brand-300"
            >
              <Mail size={16} className="text-brand-600 dark:text-brand-300" />
              harshgoyal190720@gmail.com
            </a>
            <span className="hidden text-slate-400 sm:inline">|</span>
            <a
              href="tel:+919464218808"
              className="inline-flex items-center gap-1.5 transition hover:text-brand-700 dark:hover:text-brand-300"
            >
              <Phone size={16} className="text-brand-600 dark:text-brand-300" />
              +91 9464218808
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}

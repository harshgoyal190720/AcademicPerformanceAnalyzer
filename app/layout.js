import "./globals.css";

export const metadata = {
  title: "Academic Performance Analyzer",
  description: "Calculate, predict, and analyze your academic performance",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <footer className="px-4 pb-3 text-center text-[11px] text-slate-600 dark:text-slate-400">
          <p>
            Harsh Goyal | harshgoyal190720@gmail.com | +91 9464218808
          </p>
        </footer>
      </body>
    </html>
  );
}

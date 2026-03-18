import "./globals.css";

export const metadata = {
  title: "Academic Performance Analyzer",
  description: "Calculate, predict, and analyze your academic performance",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

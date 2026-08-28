import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DecisionAI",
  description: "Modern app for decision making",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
                D
              </div>
              <span className="text-xl font-bold tracking-tight">DecisionAI</span>
            </div>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Dashboard</a>
              <a href="#" className="hover:text-foreground transition-colors">History</a>
              <a href="#" className="hover:text-foreground transition-colors">Settings</a>
            </nav>
            <div className="flex items-center gap-4">
              <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center p-6 md:p-12">
          {children}
        </main>
      </body>
    </html>
  );
}

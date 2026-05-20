import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
  variable: "--font-kanit",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { AppShell } from "@/components/AppShell";
import { AuthProvider } from "@/context/AuthContext";
import { ExpenseProvider } from "@/context/ExpenseContext";
import { ThemeProvider } from "@/context/ThemeContext";

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Nory - AI Expense Tracker",
  description: "A modern AI-powered expense tracking Progressive Web App",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nory",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${kanit.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <ExpenseProvider>
              <AppShell>{children}</AppShell>
            </ExpenseProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

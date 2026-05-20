"use client";

import {
  BarChart2,
  Clock,
  Home,
  Mic,
  Moon,
  Plus,
  Send,
  Sun,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useExpenses } from "@/context/ExpenseContext";
import { useTheme } from "@/context/ThemeContext";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [expenseInput, setExpenseInput] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const pathname = usePathname();
  const { addExpense } = useExpenses();
  const { theme, toggleTheme } = useTheme();
  const { isReady } = useAuth();

  // Prevent hydration mismatch and register Service Worker
  useEffect(() => {
    setMounted(true);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(
        (registration) => console.log("SW registered:", registration.scope),
        (err) => console.error("SW registration failed:", err),
      );
    }
  }, []);

  if (!mounted || !isReady) {
    return (
      <div className="flex justify-center min-h-screen bg-white dark:bg-[#0a0a0a] md:bg-zinc-200/50 md:dark:bg-black font-sans overscroll-none">
        <div className="w-full md:max-w-md h-[100dvh] bg-[#fdfdfd] dark:bg-[#0a0a0a] md:border-x border-black/5 dark:border-white/5" />
      </div>
    );
  }

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isFullscreenPage = pathname === "/profile/settings";

  if (isAuthPage || isFullscreenPage) {
    return (
      <div className="flex justify-center min-h-screen bg-white dark:bg-[#0a0a0a] md:bg-zinc-200/50 md:dark:bg-black overflow-hidden font-sans selection:bg-emerald-500/30 overscroll-none">
        <div className="relative w-full md:max-w-md h-[100dvh] bg-[#fdfdfd] dark:bg-[#0a0a0a] md:shadow-2xl overflow-hidden flex flex-col md:border-x border-black/5 dark:border-white/5 select-none">
          {children}
        </div>
      </div>
    );
  }

  const handleSend = () => {
    addExpense(expenseInput);
    setExpenseInput("");
    setIsInputFocused(false);
  };

  return (
    <div className="flex justify-center min-h-screen bg-white dark:bg-[#0a0a0a] md:bg-zinc-200/50 md:dark:bg-black overflow-hidden font-sans selection:bg-emerald-500/30 overscroll-none">
      <div className="relative w-full md:max-w-md h-[100dvh] bg-[#fdfdfd] dark:bg-[#0a0a0a] md:shadow-2xl overflow-hidden flex flex-col md:border-x border-black/5 dark:border-white/5 select-none">
        {/* Subtle Background Pattern/Glow */}
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-zinc-100 to-transparent dark:from-zinc-900/40 dark:to-transparent pointer-events-none" />

        {/* App Header */}
        <header className="px-6 pt-14 pb-2 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3 animate-fade-in-up">
            <Image
              src="/icon.png"
              alt="Nory Logo"
              width={36}
              height={36}
              className="rounded-[12px] object-cover shadow-sm border border-black/5 dark:border-white/10"
              style={{ width: "36px", height: "36px" }}
              priority
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiIgdmlld0JveD0iMCAwIDM2IDM2Ij48cmVjdCB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHJ4PSIxMiIgZmlsbD0iIzBiMGIwYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TjwvdGV4dD48L3N2Zz4=";
              }}
            />
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Nory
            </span>
          </div>

          <div className="flex items-center gap-2 animate-fade-in-up">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link
              href="/profile"
              className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <User size={18} />
            </Link>
          </div>
        </header>

        {/* Page Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto hide-scrollbar pb-48 z-10 relative">
          {children}
        </div>

        {/* Backdrop for input focus */}
        <div
          className={`absolute inset-0 bg-zinc-200/40 dark:bg-black/60 backdrop-blur-md z-40 transition-opacity duration-500 ease-out ${
            isInputFocused
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsInputFocused(false)}
        />

        {/* Quick Add Floating Input */}
        <div
          className={`absolute inset-x-6 bottom-32 z-50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isInputFocused
              ? "-translate-y-[220px] scale-[1.02]"
              : "translate-y-0 scale-100"
          }`}
        >
          <div
            className={`bg-white/90 dark:bg-[#1a1a1a]/90 backdrop-blur-2xl border transition-all duration-300 ${isInputFocused ? "border-zinc-300 dark:border-zinc-600 p-2.5 shadow-2xl" : "border-black/5 dark:border-white/10 p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]"} rounded-[2rem] flex items-center gap-1.5`}
          >
            <button
              className={`rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all shrink-0 ${isInputFocused ? "w-11 h-11" : "w-9 h-9"}`}
            >
              <Mic size={isInputFocused ? 20 : 18} />
            </button>
            <input
              ref={inputRef}
              type="text"
              placeholder="พิมพ์รายการ... (เช่น ชาเขียว 45)"
              value={expenseInput}
              onChange={(e) => setExpenseInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => {}}
              className={`flex-1 bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 px-2 min-w-0 font-medium transition-all ${isInputFocused ? "text-base" : "text-[15px]"}`}
            />
            <button
              onClick={handleSend}
              className={`rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${isInputFocused ? "w-11 h-11" : "w-9 h-9"} ${expenseInput.length > 0 ? "bg-zinc-900 text-white dark:bg-white dark:text-black hover:scale-105 shadow-md" : "bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed"}`}
            >
              {expenseInput.length > 0 ? (
                <Send
                  size={isInputFocused ? 16 : 14}
                  className="translate-x-[-1px] translate-y-[1px]"
                  strokeWidth={2.5}
                />
              ) : (
                <Plus size={isInputFocused ? 18 : 16} strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>

        {/* Floating Tabbar */}
        <div
          className={`absolute bottom-6 left-6 right-6 h-[72px] bg-white/80 dark:bg-[#111111]/80 backdrop-blur-3xl border border-black/5 dark:border-white/10 flex justify-between items-center px-4 z-30 rounded-[2rem] shadow-[0_20px_40px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgb(0,0,0,0.4)] transition-transform duration-500 ${isInputFocused ? "translate-y-[150%]" : "translate-y-0"} animate-fade-in-up delay-400`}
        >
          <NavItem icon={Home} href="/" active={pathname === "/"} />
          <NavItem
            icon={Clock}
            href="/timeline"
            active={pathname === "/timeline"}
          />

          {/* Center Action Button */}
          <button
            onClick={() => {
              setIsInputFocused(true);
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
            className="relative -top-5 w-14 h-14 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
          >
            <Plus size={28} strokeWidth={2.5} />
          </button>

          <NavItem
            icon={BarChart2}
            href="/analytics"
            active={pathname === "/analytics"}
          />
          <NavItem
            icon={User}
            href="/profile"
            active={pathname === "/profile"}
          />
        </div>
      </div>
    </div>
  );
}

function NavItem({
  icon: Icon,
  href,
  active = false,
}: {
  icon: any;
  href: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className="relative flex flex-col items-center justify-center w-12 h-12 group"
    >
      <div
        className={`transition-all duration-300 ${active ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-300 group-hover:scale-110"}`}
      >
        <Icon size={24} strokeWidth={active ? 2.5 : 2} />
      </div>
      {active && (
        <div className="absolute -bottom-1.5 w-1 h-1 bg-zinc-900 dark:bg-white rounded-full animate-fade-in-up" />
      )}
    </Link>
  );
}

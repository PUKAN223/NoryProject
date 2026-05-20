"use client";

import { Sparkles, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ExpenseItem } from "@/components/ExpenseItem";
import { useExpenses } from "@/context/ExpenseContext";
import { getUserProfileAction } from "@/app/actions/user";
import { getAIInsight } from "@/app/actions/ai";

const CURRENCY_SYMBOLS: Record<string, string> = {
  THB: "฿", USD: "$", EUR: "€", JPY: "¥",
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return "สวัสดียามดึก";
  if (h < 12) return "สวัสดีตอนเช้า";
  if (h < 17) return "สวัสดีตอนบ่าย";
  return "สวัสดีตอนเย็น";
}

export default function HomePage() {
  const { expenses, todayTotal, loading: expLoading } = useExpenses();
  const [user, setUser] = useState<{ username: string; dailyBudget: number; currency: string } | null>(null);
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [loadingTip, setLoadingTip] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await getUserProfileAction();
      if (res.success && res.data) setUser(res.data);
    }
    load();
  }, []);

  // Fetch AI tip when expenses change (with caching)
  useEffect(() => {
    if (expenses.length === 0) return;

    const cacheKey = "nory_ai_tip_home";
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { tip, count, time } = JSON.parse(cached);
        // Use cache if expense count is exactly the same, or if it was fetched less than 1 hour ago
        if (count === expenses.length || Date.now() - time < 1000 * 60 * 60) {
          setAiTip(tip);
          return;
        }
      } catch (e) {}
    }

    setLoadingTip(true);
    const mapped = expenses.slice(0, 10).map(e => ({ title: e.title, amount: e.amount, category: e.category }));
    getAIInsight(mapped).then(tip => {
      setAiTip(tip);
      setLoadingTip(false);
      localStorage.setItem(cacheKey, JSON.stringify({ tip, count: expenses.length, time: Date.now() }));
    });
  }, [expenses.length]);

  const budget = user?.dailyBudget || 300;
  const curr = CURRENCY_SYMBOLS[user?.currency || "THB"] || "฿";
  const remaining = budget - todayTotal;
  const isOverBudget = remaining < 0;

  return (
    <div className="animate-fade-in-up">
      <div className="px-6 pb-6 pt-4 flex flex-col gap-4">
        <div>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium ml-1">
            {getGreeting()}, {user?.username || "..."}
          </p>
        </div>

        {/* Budget Card */}
        <div className="bg-white dark:bg-[#111111] border border-black/[0.04] dark:border-white/[0.08] rounded-[2rem] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-2">
              ยอดใช้จ่ายวันนี้
            </p>
            <div className="flex items-baseline gap-1 text-zinc-900 dark:text-zinc-50">
              <span className="text-[2.75rem] leading-none font-bold tracking-tighter">
                <span className="text-[2rem] font-medium opacity-70 mr-1.5">{curr}</span>
                {todayTotal.toLocaleString("th-TH")}
              </span>
              <span className="text-zinc-400 font-medium text-xl">.00</span>
            </div>

            <div className="mt-6 pt-5 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
              <p className={`text-sm flex items-center gap-2 font-medium ${isOverBudget ? "text-red-500 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${isOverBudget ? "bg-red-100 dark:bg-red-500/20" : "bg-emerald-100 dark:bg-emerald-500/20"}`}>
                  {isOverBudget ? "⚠️" : "🎉"}
                </span>
                {isOverBudget ? "ใช้เกินงบแล้ว!" : "คุณใช้เงินตามงบ"}
              </p>
              <p className="text-zinc-400 dark:text-zinc-500 text-xs font-medium">
                {isOverBudget ? `เกิน ${curr}${Math.abs(remaining).toLocaleString("th-TH")}` : `เหลือ ${curr}${remaining.toLocaleString("th-TH")}`}
              </p>
            </div>
          </div>
        </div>

        {/* AI Insight Card */}
        {(aiTip || loadingTip) && (
          <div className="bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-950/30 dark:to-blue-950/30 border border-violet-200/50 dark:border-violet-500/10 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
              {loadingTip ? <Loader2 size={16} className="text-violet-500 animate-spin" /> : <Sparkles size={16} className="text-violet-500" />}
            </div>
            <div>
              <p className="text-[11px] font-semibold text-violet-500 dark:text-violet-400 uppercase tracking-wider mb-1">AI Insight</p>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
                {loadingTip ? "กำลังวิเคราะห์..." : aiTip}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="px-6">
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-[#fdfdfd]/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md py-2 z-20 -mx-6 px-6">
          <h2 className="text-zinc-900 dark:text-zinc-100 font-semibold text-lg tracking-tight">
            รายการล่าสุด
          </h2>
        </div>

        {expLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-zinc-400" size={24} />
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-zinc-400 dark:text-zinc-500 text-sm font-medium">ยังไม่มีรายจ่าย</p>
            <p className="text-zinc-300 dark:text-zinc-600 text-xs mt-1">พิมพ์ในช่องด้านล่างเพื่อเพิ่ม</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {expenses.slice(0, 6).map((expense, i) => (
              <ExpenseItem key={expense.id} expense={expense} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

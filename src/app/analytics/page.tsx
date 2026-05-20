"use client";

import { Loader2, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { getUserProfileAction } from "@/app/actions/user";
import { getAIInsight } from "@/app/actions/ai";

const CURRENCY_SYMBOLS: Record<string, string> = {
  THB: "฿", USD: "$", EUR: "€", JPY: "¥",
};

const CATEGORY_COLORS: Record<string, string> = {
  Food: "bg-orange-500", Drinks: "bg-amber-500", Transport: "bg-blue-500",
  Shopping: "bg-purple-500", Bills: "bg-emerald-500", Entertainment: "bg-pink-500",
  Health: "bg-red-500", Education: "bg-indigo-500", Other: "bg-zinc-500",
};

export default function AnalyticsPage() {
  const { expenses, loading: expLoading } = useExpenses();
  const [user, setUser] = useState<{ dailyBudget: number; currency: string } | null>(null);
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [loadingTip, setLoadingTip] = useState(false);

  useEffect(() => {
    getUserProfileAction().then(res => {
      if (res.success && res.data) setUser(res.data);
    });
  }, []);

  // Fetch AI tip when expenses change (with caching)
  useEffect(() => {
    if (expenses.length === 0) return;

    const cacheKey = "nory_ai_tip_analytics";
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
    const mapped = expenses.slice(0, 15).map(e => ({ title: e.title, amount: e.amount, category: e.category }));
    getAIInsight(mapped).then(tip => {
      setAiTip(tip);
      setLoadingTip(false);
      localStorage.setItem(cacheKey, JSON.stringify({ tip, count: expenses.length, time: Date.now() }));
    });
  }, [expenses.length]);

  const curr = CURRENCY_SYMBOLS[user?.currency || "THB"] || "฿";

  // Calculate last 7 days data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayExpenses = expenses.filter(e => {
      const ed = new Date(e.rawDate);
      return ed.getDate() === d.getDate() && ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
    });
    const total = dayExpenses.reduce((sum: number, e: any) => sum + e.amount, 0);
    return {
      label: d.toLocaleDateString("th-TH", { weekday: "short" }),
      total,
      isToday: i === 6,
    };
  });
  const maxDay = Math.max(...last7Days.map(d => d.total), 1);
  const weekTotal = last7Days.reduce((s, d) => s + d.total, 0);

  // Category breakdown
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });
  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const totalAll = Object.values(categoryTotals).reduce((s, v) => s + v, 0) || 1;

  return (
    <div className="px-6 pt-4 animate-fade-in-up pb-24">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          ภาพรวม
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mt-1">
          พฤติกรรมการใช้จ่าย 7 วันล่าสุด
        </p>
      </div>

      {expLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-zinc-400" size={32} />
        </div>
      ) : (
        <>
          {/* Weekly Summary Card */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white dark:bg-[#111111] border border-black/[0.04] dark:border-white/[0.08] rounded-[1.5rem] p-4 shadow-sm">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-1">ยอดรวม 7 วัน</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-white">{curr}{weekTotal.toLocaleString("th-TH")}</p>
            </div>
            <div className="bg-white dark:bg-[#111111] border border-black/[0.04] dark:border-white/[0.08] rounded-[1.5rem] p-4 shadow-sm">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-1">เฉลี่ยต่อวัน</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-white">{curr}{Math.round(weekTotal / 7).toLocaleString("th-TH")}</p>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white dark:bg-[#111111] border border-black/[0.04] dark:border-white/[0.08] rounded-[2rem] p-6 shadow-sm mb-6">
            <div className="flex items-end gap-2 h-36 mb-3">
              {last7Days.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <p className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                    {day.total > 0 ? `${curr}${day.total}` : ""}
                  </p>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-xl h-full relative overflow-hidden flex items-end">
                    <div
                      className={`w-full rounded-xl transition-all duration-700 ease-out ${day.isToday ? "bg-zinc-900 dark:bg-white" : "bg-zinc-300 dark:bg-zinc-600"}`}
                      style={{ height: `${day.total > 0 ? Math.max((day.total / maxDay) * 100, 8) : 0}%` }}
                    />
                  </div>
                  <span className={`text-[11px] font-semibold ${day.isToday ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-zinc-500"}`}>
                    {day.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          {sortedCategories.length > 0 && (
            <div className="bg-white dark:bg-[#111111] border border-black/[0.04] dark:border-white/[0.08] rounded-[2rem] p-6 shadow-sm mb-6">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-4">หมวดหมู่</h3>
              <div className="space-y-3">
                {sortedCategories.slice(0, 5).map(([cat, total]) => {
                  const pct = Math.round((total / totalAll) * 100);
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{cat}</span>
                        <span className="text-sm font-bold text-zinc-900 dark:text-white">{curr}{total.toLocaleString("th-TH")} <span className="text-zinc-400 font-normal text-xs">({pct}%)</span></span>
                      </div>
                      <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${CATEGORY_COLORS[cat] || "bg-zinc-500"}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI Insight */}
          <div className="bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-950/30 dark:to-blue-950/30 border border-violet-200/50 dark:border-violet-500/10 rounded-[1.5rem] p-5 shadow-sm">
            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center shrink-0">
                {loadingTip ? <Loader2 size={18} className="text-violet-500 animate-spin" /> : <Sparkles size={18} className="text-violet-500" />}
              </div>
              <div>
                <p className="text-[11px] font-semibold text-violet-500 dark:text-violet-400 uppercase tracking-wider mb-1">AI Insight</p>
                <p className="text-[15px] font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
                  {loadingTip ? "กำลังวิเคราะห์ข้อมูลของคุณ..." : aiTip || "เพิ่มรายจ่ายเพื่อรับคำแนะนำจาก AI"}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

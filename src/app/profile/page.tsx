"use client";

import {
  ChevronRight,
  Loader2,
  LogOut,
  Receipt,
  Settings,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { logoutAction } from "@/app/actions/auth";
import { getUserProfileAction } from "@/app/actions/user";
import { useExpenses } from "@/context/ExpenseContext";

const CURRENCY_SYMBOLS: Record<string, string> = {
  THB: "฿", USD: "$", EUR: "€", JPY: "¥",
};

export default function ProfilePage() {
  const [userData, setUserData] = useState<{
    username: string;
    email: string;
    avatarUrl: string | null;
    dailyBudget: number;
    currency: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const { expenses, todayTotal } = useExpenses();

  useEffect(() => {
    async function loadProfile() {
      const res = await getUserProfileAction();
      if (res.success && res.data) {
        setUserData(res.data);
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleLogout = async () => {
    await logoutAction();
    window.location.href = "/login";
  };

  const curr = CURRENCY_SYMBOLS[userData?.currency || "THB"] || "฿";

  return (
    <div className="px-6 pt-4 animate-fade-in-up pb-24">
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-zinc-400" size={32} />
        </div>
      ) : (
        <>
          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-400 to-blue-500 flex items-center justify-center text-white text-xl font-bold shadow-md uppercase overflow-hidden shrink-0">
              {userData?.avatarUrl ? (
                <img src={userData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                userData?.username?.[0] || "U"
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {userData?.username || "ผู้ใช้งาน"}
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                {userData?.email || ""}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-white dark:bg-[#111111] border border-black/[0.04] dark:border-white/[0.08] rounded-[1.5rem] p-4 flex flex-col items-center justify-center text-center shadow-sm">
              <Receipt size={22} className="text-blue-500 mb-2" />
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {expenses.length}
              </p>
              <p className="text-xs font-medium text-zinc-500">รายการทั้งหมด</p>
            </div>
            <div className="bg-white dark:bg-[#111111] border border-black/[0.04] dark:border-white/[0.08] rounded-[1.5rem] p-4 flex flex-col items-center justify-center text-center shadow-sm">
              <TrendingUp size={22} className="text-emerald-500 mb-2" />
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {curr}{todayTotal.toLocaleString("th-TH")}
              </p>
              <p className="text-xs font-medium text-zinc-500">ใช้ไปวันนี้</p>
            </div>
          </div>

          {/* Budget Info */}
          <div className="bg-white dark:bg-[#111111] border border-black/[0.04] dark:border-white/[0.08] rounded-[1.5rem] p-4 mb-8 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">งบรายวัน</span>
              <span className="text-lg font-bold text-zinc-900 dark:text-white">
                {curr}{(userData?.dailyBudget || 0).toLocaleString("th-TH")}
              </span>
            </div>
            <div className="mt-3 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${todayTotal > (userData?.dailyBudget || 300) ? "bg-red-500" : "bg-emerald-500"}`}
                style={{ width: `${Math.min((todayTotal / (userData?.dailyBudget || 300)) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-zinc-400 mt-1.5 text-right">
              {Math.round((todayTotal / (userData?.dailyBudget || 300)) * 100)}% ของงบ
            </p>
          </div>

          {/* Menu */}
          <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-3">
            เมนู
          </h3>
          <div className="bg-white dark:bg-[#111111] border border-black/[0.04] dark:border-white/[0.08] rounded-[1.5rem] overflow-hidden shadow-sm">
            <Link
              href="/profile/settings"
              className="w-full flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300 font-medium">
                <Settings size={18} />
                ตั้งค่าบัญชี & งบประมาณ
              </div>
              <ChevronRight size={18} className="text-zinc-400" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            >
              <div className="flex items-center gap-3 text-red-500 dark:text-red-400 font-medium">
                <LogOut size={18} />
                ออกจากระบบ
              </div>
              <ChevronRight size={18} className="text-red-400 opacity-50" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

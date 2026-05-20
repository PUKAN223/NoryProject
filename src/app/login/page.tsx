"use client";

import { AlertCircle, Loader2, Lock, LogIn, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginAction } from "@/app/actions/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await loginAction(username, password);
    if (!res.success) {
      setError(res.error || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
      setLoading(false);
    } else {
      // Reload to let middleware process cookies
      window.location.href = "/";
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 h-full relative z-10">
      <div className="w-full max-w-sm animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 rounded-[1.5rem] bg-white dark:bg-zinc-900 shadow-xl border border-black/5 dark:border-white/10 flex items-center justify-center mb-6 relative overflow-hidden">
            <Image src="/icon.png" alt="Nory" fill className="object-cover" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
            ยินดีต้อนรับสู่ Nory
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            แอปพลิเคชันจดรายรับรายจ่ายพลัง AI
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-3xl border border-black/5 dark:border-white/10 p-6 rounded-[2rem] shadow-[0_20px_40px_rgb(0,0,0,0.05)] dark:shadow-[0_20px_40px_rgb(0,0,0,0.4)]">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-2xl flex items-center gap-2 text-sm font-medium animate-fade-in-up">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="space-y-1.5 relative">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">
                ชื่อผู้ใช้งาน
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 pl-10 pr-4 py-3.5 rounded-2xl font-medium focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 relative">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">
                รหัสผ่าน
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="1234"
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 pl-10 pr-4 py-3.5 rounded-2xl font-medium focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold py-3.5 rounded-2xl shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform active:scale-95 mt-6 disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  เข้าสู่ระบบ
                  <LogIn size={18} strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-zinc-500 dark:text-zinc-400 text-sm">
              ยังไม่มีบัญชีใช่ไหม?{" "}
            </span>
            <Link
              href="/signup"
              className="text-zinc-900 dark:text-white font-semibold text-sm hover:underline"
            >
              สมัครสมาชิก
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

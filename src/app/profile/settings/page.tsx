"use client";

import {
  AlertCircle,
  Camera,
  CheckCircle2,
  ChevronLeft,
  CircleDollarSign,
  Globe,
  Loader2,
  Save,
  UserCircle,
  Mail,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getUserProfileAction,
  updateProfileAction,
  updateSettingsAction,
  updateAvatarAction,
} from "@/app/actions/user";

type Tab = "account" | "budget";

export default function SettingsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("account");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [dailyBudget, setDailyBudget] = useState("300");
  const [currency, setCurrency] = useState("THB");

  useEffect(() => {
    async function loadData() {
      const res = await getUserProfileAction();
      if (res.success && res.data) {
        setUsername(res.data.username);
        setEmail(res.data.email);
        setAvatarUrl(res.data.avatarUrl);
        setDailyBudget(res.data.dailyBudget.toString());
        setCurrency(res.data.currency);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "ขนาดไฟล์ต้องไม่เกิน 5MB" });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setAvatarUrl(base64);
      
      const res = await updateAvatarAction(base64);
      setMessage(res.success
        ? { type: "success", text: "อัปเดตรูปโปรไฟล์สำเร็จ ✨" }
        : { type: "error", text: res.error || "อัปเดตรูปโปรไฟล์ไม่สำเร็จ" });
      setTimeout(() => setMessage(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    if (tab === "account") {
      const res = await updateProfileAction(username, email);
      setMessage(res.success
        ? { type: "success", text: "อัปเดตบัญชีสำเร็จ ✨" }
        : { type: "error", text: res.error || "เกิดข้อผิดพลาด" });
    } else {
      const res = await updateSettingsAction(parseFloat(dailyBudget) || 0, currency);
      setMessage(res.success
        ? { type: "success", text: "อัปเดตงบประมาณสำเร็จ 🎯" }
        : { type: "error", text: res.error || "เกิดข้อผิดพลาด" });
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const currencies = [
    { value: "THB", label: "THB", symbol: "฿", flag: "🇹🇭" },
    { value: "USD", label: "USD", symbol: "$", flag: "🇺🇸" },
    { value: "EUR", label: "EUR", symbol: "€", flag: "🇪🇺" },
    { value: "JPY", label: "JPY", symbol: "¥", flag: "🇯🇵" },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fdfdfd] dark:bg-[#0a0a0a]">
      {/* Header */}
      <header className="px-6 pt-14 pb-4 flex items-center justify-between z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 sticky top-0">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 active:scale-95 transition-transform"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          การตั้งค่า
        </h1>
        <div className="w-10" />
      </header>

      {loading ? (
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="animate-spin text-zinc-400" size={32} />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pb-32">
          {/* Tab Switcher */}
          <div className="px-6 pt-6 pb-2">
            <div className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-1 flex gap-1">
              <button
                type="button"
                onClick={() => { setTab("account"); setMessage(null); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === "account" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 dark:text-zinc-400"}`}
              >
                บัญชี
              </button>
              <button
                type="button"
                onClick={() => { setTab("budget"); setMessage(null); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === "budget" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 dark:text-zinc-400"}`}
              >
                งบประมาณ
              </button>
            </div>
          </div>

          {/* Toast Message */}
          {message && (
            <div className="px-6 pt-2">
              <div
                className={`p-3.5 rounded-2xl flex items-center gap-3 font-medium text-sm transition-all animate-fade-in-up ${
                  message.type === "success"
                    ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                }`}
              >
                {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                {message.text}
              </div>
            </div>
          )}

          <form onSubmit={handleSave} className="px-6 pt-4 space-y-5 animate-fade-in-up">
            {tab === "account" ? (
              <>
                {/* Avatar Preview */}
                <div className="flex justify-center mb-2">
                  <label className="relative cursor-pointer group">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-400 to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg uppercase overflow-hidden">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        username?.[0] || "U"
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera size={20} className="text-white" />
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  </label>
                </div>

                {/* Username */}
                <div className="space-y-1.5">
                  <label htmlFor="username" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1 flex items-center gap-1.5">
                    <UserCircle size={14} /> ชื่อผู้ใช้งาน
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-zinc-100 dark:bg-zinc-900 border-none outline-none text-zinc-900 dark:text-zinc-100 px-4 py-3.5 rounded-2xl font-medium focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1 flex items-center gap-1.5">
                    <Mail size={14} /> อีเมล
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-100 dark:bg-zinc-900 border-none outline-none text-zinc-900 dark:text-zinc-100 px-4 py-3.5 rounded-2xl font-medium focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                {/* Budget Preview */}
                <div className="bg-white dark:bg-[#111111] border border-black/[0.04] dark:border-white/[0.08] rounded-[2rem] p-6 text-center shadow-sm">
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs font-medium mb-1">งบประมาณรายวัน</p>
                  <p className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
                    {currencies.find(c => c.value === currency)?.symbol}{parseFloat(dailyBudget || "0").toLocaleString("th-TH")}
                  </p>
                  <p className="text-zinc-400 text-xs mt-1">ต่อวัน</p>
                </div>

                {/* Daily Budget */}
                <div className="space-y-1.5">
                  <label htmlFor="budget" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1 flex items-center gap-1.5">
                    <CircleDollarSign size={14} /> จำนวนเงิน
                  </label>
                  <input
                    id="budget"
                    type="number"
                    value={dailyBudget}
                    onChange={(e) => setDailyBudget(e.target.value)}
                    className="w-full bg-zinc-100 dark:bg-zinc-900 border-none outline-none text-zinc-900 dark:text-zinc-100 px-4 py-3.5 rounded-2xl font-medium focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all"
                    min="0"
                    required
                  />
                </div>

                {/* Currency Selector */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1 flex items-center gap-1.5">
                    <Globe size={14} /> สกุลเงิน
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {currencies.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setCurrency(c.value)}
                        className={`flex flex-col items-center gap-1 py-3 rounded-2xl border text-sm font-semibold transition-all ${
                          currency === c.value
                            ? "bg-zinc-900 dark:bg-white text-white dark:text-black border-zinc-900 dark:border-white shadow-md"
                            : "bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-black/5 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        }`}
                      >
                        <span className="text-lg">{c.flag}</span>
                        <span>{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 active:scale-[0.98] shadow-md"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {saving ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

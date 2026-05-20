"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { Car, Coffee, Plus, ShoppingBag, Utensils, Zap, Gamepad2, Heart, GraduationCap } from "lucide-react";
import { getExpensesAction, addExpenseAction } from "@/app/actions/expenses";
import { parseExpenseWithAI } from "@/app/actions/ai";

const CATEGORY_MAP: Record<string, { icon: any; color: string; bg: string }> = {
  Food: { icon: Utensils, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-500/10" },
  Drinks: { icon: Coffee, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-500/10" },
  Transport: { icon: Car, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-500/10" },
  Shopping: { icon: ShoppingBag, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-500/10" },
  Bills: { icon: Zap, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-500/10" },
  Entertainment: { icon: Gamepad2, color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-100 dark:bg-pink-500/10" },
  Health: { icon: Heart, color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-500/10" },
  Education: { icon: GraduationCap, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-500/10" },
  Other: { icon: Plus, color: "text-zinc-600 dark:text-zinc-400", bg: "bg-zinc-100 dark:bg-zinc-500/10" },
};

function getVisuals(category: string) {
  return CATEGORY_MAP[category] || CATEGORY_MAP.Other;
}

function formatTime(date: Date) {
  const now = new Date();
  const d = new Date(date);
  const isToday = d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  if (isToday) return d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.getDate() === yesterday.getDate() && d.getMonth() === yesterday.getMonth() && d.getFullYear() === yesterday.getFullYear()) return "เมื่อวาน";
  return d.toLocaleDateString("th-TH", { month: "short", day: "numeric" });
}

interface ExpenseContextType {
  expenses: any[];
  addExpense: (expenseInput: string) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  loading: boolean;
  todayTotal: number;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExpenses() {
      const res = await getExpensesAction();
      if (res.success && res.data) {
        const mapped = res.data.map((exp: any) => {
          const visuals = getVisuals(exp.category);
          return {
            id: exp.id, title: exp.title, amount: exp.amount, category: exp.category,
            time: formatTime(exp.date), rawDate: exp.date,
            icon: visuals.icon, color: visuals.color, bg: visuals.bg,
          };
        });
        setExpenses(mapped);
      }
      setLoading(false);
    }
    fetchExpenses();
  }, []);

  // Calculate today's total
  const todayTotal = expenses.reduce((sum, exp) => {
    const d = new Date(exp.rawDate);
    const now = new Date();
    if (d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
      return sum + exp.amount;
    }
    return sum;
  }, 0);

  const addExpense = async (expenseInput: string) => {
    if (!expenseInput.trim()) return;

    // Use AI to parse the expense
    const parsed = await parseExpenseWithAI(expenseInput);
    const visuals = getVisuals(parsed.category);

    const tempId = Date.now().toString();
    const newExpense = {
      id: tempId, title: parsed.title, amount: parsed.amount, category: parsed.category,
      time: "กำลังบันทึก...", rawDate: new Date().toISOString(),
      icon: visuals.icon, color: visuals.color, bg: visuals.bg,
    };
    setExpenses(prev => [newExpense, ...prev]);

    const res = await addExpenseAction(parsed.title, parsed.amount, parsed.category);
    if (res.success && res.data) {
      setExpenses(prev => prev.map(exp =>
        exp.id === tempId
          ? { ...newExpense, id: res.data.id, time: formatTime(res.data.date), rawDate: res.data.date }
          : exp
      ));
    } else {
      setExpenses(prev => prev.filter(exp => exp.id !== tempId));
    }
  };

  const deleteExpense = async (id: string) => {
    // Optimistically update UI
    setExpenses(prev => prev.filter(exp => exp.id !== id));
    
    // Call server action
    const { deleteExpenseAction } = await import("@/app/actions/expenses");
    const res = await deleteExpenseAction(id);
    if (!res.success) {
      // Refresh list if failed
      const fetchRes = await getExpensesAction();
      if (fetchRes.success && fetchRes.data) {
        const mapped = fetchRes.data.map((exp: any) => {
          const visuals = getVisuals(exp.category);
          return {
            id: exp.id, title: exp.title, amount: exp.amount, category: exp.category,
            time: formatTime(exp.date), rawDate: exp.date,
            icon: visuals.icon, color: visuals.color, bg: visuals.bg,
          };
        });
        setExpenses(mapped);
      }
    }
  };

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, deleteExpense, loading, todayTotal }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (context === undefined) throw new Error("useExpenses must be used within an ExpenseProvider");
  return context;
}

"use client";

import { ExpenseItem } from "@/components/ExpenseItem";
import { useExpenses } from "@/context/ExpenseContext";

export default function TimelinePage() {
  const { expenses } = useExpenses();

  return (
    <div className="px-6 pt-4 animate-fade-in-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          ประวัติการใช้จ่าย
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mt-1">
          ทั้งหมด {expenses.length} รายการ
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {expenses.map((expense, i) => (
          <ExpenseItem key={expense.id} expense={expense} index={i} />
        ))}
      </div>
    </div>
  );
}

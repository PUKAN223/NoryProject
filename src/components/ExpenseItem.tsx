"use client";

import { Trash2, AlertCircle } from "lucide-react";
import { useExpenses } from "@/context/ExpenseContext";
import { useState } from "react";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";

export function ExpenseItem({
  expense,
  index = 0,
}: {
  expense: any;
  index?: number;
}) {
  const { deleteExpense } = useExpenses();
  const [showConfirm, setShowConfirm] = useState(false);
  const controls = useAnimation();
  const x = useMotionValue(0);
  
  // Only show red background when swiping left
  const bgOpacity = useTransform(x, [0, -30], [0, 1]);

  const handleDeleteConfirm = async () => {
    setShowConfirm(false);
    // Animate out
    await controls.start({ x: -window.innerWidth, opacity: 0, transition: { duration: 0.3 } });
    await deleteExpense(expense.id);
  };

  const handleDeleteCancel = () => {
    setShowConfirm(false);
    controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } });
  };

  return (
    <>
      <div
        className="relative w-full rounded-[1.25rem] group mb-3 animate-fade-in-up"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Background (Delete action) */}
        <motion.div
          style={{ opacity: bgOpacity }}
          className="absolute inset-y-0 right-0 w-1/2 bg-red-500 rounded-[1.25rem] flex items-center justify-end px-5 pointer-events-none"
        >
          <div className="flex flex-col items-center justify-center text-white">
            <Trash2 size={20} strokeWidth={2.5} />
            <span className="text-[10px] font-bold mt-1">ลบ</span>
          </div>
        </motion.div>

        {/* Foreground Draggable Card */}
        <motion.div
          drag="x"
          style={{ x }}
          dragConstraints={{ left: -80, right: 0 }}
          dragElastic={{ left: 0.2, right: 0 }}
          animate={controls}
          onDragEnd={(e, info) => {
            if (info.offset.x < -60) {
              setShowConfirm(true);
            } else {
              controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } });
            }
          }}
          className="relative z-10 flex items-center gap-4 bg-white dark:bg-[#111111] border border-black/[0.03] dark:border-white/[0.05] p-3.5 rounded-[1.25rem] shadow-sm touch-pan-y"
        >
          <div
            className={`w-12 h-12 rounded-[1rem] flex items-center justify-center shrink-0 ${expense.bg} ${expense.color}`}
          >
            <expense.icon size={22} strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0 pointer-events-none">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              {expense.title}
            </p>
            <p className="text-zinc-400 dark:text-zinc-500 text-[13px] mt-0.5">
              {expense.time}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 pointer-events-none">
            <p className="font-bold text-[17px] text-zinc-900 dark:text-zinc-100">
              <span className="opacity-70 text-sm font-medium mr-0.5">฿</span>
              {expense.amount}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Beautiful Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleDeleteCancel}
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative bg-white dark:bg-[#1a1a1a] rounded-[2rem] p-6 w-full max-w-sm shadow-2xl border border-black/5 dark:border-white/10"
          >
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mb-4 mx-auto text-red-500">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-xl font-bold text-center text-zinc-900 dark:text-zinc-100 mb-2">
              ยืนยันการลบ
            </h3>
            <p className="text-center text-zinc-500 dark:text-zinc-400 text-sm mb-6">
              คุณต้องการลบรายการ <span className="font-semibold text-zinc-700 dark:text-zinc-300">"{expense.title}"</span> ใช่หรือไม่? <br/> การกระทำนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="flex gap-3">
              <button 
                onClick={handleDeleteCancel}
                className="flex-1 py-3 rounded-xl font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleDeleteConfirm}
                className="flex-1 py-3 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
              >
                ลบรายการ
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

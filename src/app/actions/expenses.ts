"use server";

import { prisma } from "@/lib/prisma";
import { verifySession } from "./auth";

export async function getExpensesAction() {
  const session = await verifySession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: session.userId },
      orderBy: { date: "desc" },
    });

    return { success: true, data: expenses };
  } catch (error) {
    console.error("Get expenses error:", error);
    return { success: false, error: "Failed to load expenses" };
  }
}

export async function addExpenseAction(title: string, amount: number, category: string) {
  const session = await verifySession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const expense = await prisma.expense.create({
      data: {
        title,
        amount,
        category,
        userId: session.userId,
      },
    });

    return { success: true, data: expense };
  } catch (error) {
    console.error("Add expense error:", error);
    return { success: false, error: "Failed to add expense" };
  }
}

export async function deleteExpenseAction(id: string) {
  const session = await verifySession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    await prisma.expense.delete({
      where: {
        id,
        userId: session.userId, // Ensure the user owns this expense
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Delete expense error:", error);
    return { success: false, error: "Failed to delete expense" };
  }
}

"use server";

import { prisma } from "@/lib/prisma";
import { verifySession } from "./auth";

export async function getUserProfileAction() {
  const session = await verifySession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        username: true,
        email: true,
        dailyBudget: true,
        currency: true,
        avatarUrl: true,
      },
    });

    if (!user) return { success: false, error: "User not found" };

    return { success: true, data: user };
  } catch (error) {
    console.error("Get user profile error:", error);
    return { success: false, error: "Failed to load user profile" };
  }
}

export async function updateSettingsAction(
  dailyBudget: number,
  currency: string,
) {
  const session = await verifySession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    await prisma.user.update({
      where: { id: session.userId },
      data: {
        dailyBudget,
        currency,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Update settings error:", error);
    return { success: false, error: "Failed to update settings" };
  }
}

export async function updateProfileAction(username: string, email: string) {
  const session = await verifySession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    // Check if username or email is already taken by someone else
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { username, NOT: { id: session.userId } },
          { email, NOT: { id: session.userId } },
        ],
      },
    });

    if (existing) {
      if (existing.username === username)
        return { success: false, error: "Username already taken" };
      if (existing.email === email)
        return { success: false, error: "Email already taken" };
    }

    await prisma.user.update({
      where: { id: session.userId },
      data: {
        username,
        email,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function updateAvatarAction(avatarUrl: string) {
  const session = await verifySession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    await prisma.user.update({
      where: { id: session.userId },
      data: { avatarUrl },
    });

    return { success: true };
  } catch (error) {
    console.error("Update avatar error:", error);
    return { success: false, error: "Failed to update avatar" };
  }
}

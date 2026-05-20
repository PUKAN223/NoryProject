"use server";

import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "nory-super-secret-key-for-dev",
);

export async function loginAction(username: string, password: string) {
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return { success: false, error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { success: false, error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };
    }

    const token = await new SignJWT({
      userId: user.id,
      username: user.username,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(JWT_SECRET);

    const cookieStore = await cookies();
    cookieStore.set("nory-session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" };
  }
}

export async function signupAction(
  username: string,
  email: string,
  password: string,
) {
  try {
    if (password.length < 4) {
      return { success: false, error: "รหัสผ่านต้องมีความยาวอย่างน้อย 4 ตัวอักษร" };
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return { success: false, error: "ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้งานแล้ว" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: "เกิดข้อผิดพลาดในการสมัครสมาชิก" };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("nory-session");
  return { success: true };
}

export async function verifySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("nory-session")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: string; username: string };
  } catch (err) {
    return null;
  }
}

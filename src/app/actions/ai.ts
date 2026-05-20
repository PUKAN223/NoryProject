"use server";

import { GoogleGenAI, Type } from "@google/genai";

export interface ParsedExpense {
  title: string;
  amount: number;
  category: string;
}

export async function parseExpenseWithAI(input: string): Promise<ParsedExpense> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return fallbackParse(input);
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an expense parser for a Thai expense tracking app. Parse the following user input into a JSON object.

Rules:
- "title": Short item name in Thai. If quantity > 1, append " x{qty}" e.g. "กระเพรา x2". Keep original language.
- "unitPrice": price per unit (number). Extract from phrases like "ละ", "อัน", "กล่องละ", "ชิ้นละ", or per-item price.
- "quantity": how many units (number, default 1). Extract from "2 กล่อง", "สาม อัน", "x3", "สอง", etc.
- "amount": ALWAYS = unitPrice × quantity (calculated total, number)
- "category": one of "Food", "Drinks", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Education", "Other"

Examples:
- "กระเพรา 50 บาท 2 กล่อง" → title="กระเพรา x2", unitPrice=50, quantity=2, amount=100, category="Food"
- "ชาเขียว 35" → title="ชาเขียว", unitPrice=35, quantity=1, amount=35, category="Drinks"
- "น้ำ 3 ขวด ขวดละ 10" → title="น้ำ x3", unitPrice=10, quantity=3, amount=30, category="Drinks"
- "เดินไปสั่งกระเพรามา 50 บาทได้มั้ง 2 กล่อง" → title="กระเพรา x2", unitPrice=50, quantity=2, amount=100, category="Food"

User input: "${input}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            unitPrice: { type: Type.NUMBER },
            quantity: { type: Type.NUMBER },
            amount: { type: Type.NUMBER },
            category: { type: Type.STRING },
          },
          required: ["title", "unitPrice", "quantity", "amount", "category"],
        },
        temperature: 0.1,
      },
    });

    const text = response.text;
    if (!text) return fallbackParse(input);

    const parsed = JSON.parse(text);
    const qty = typeof parsed.quantity === "number" ? parsed.quantity : 1;
    const unitPrice = typeof parsed.unitPrice === "number" ? parsed.unitPrice : 0;
    const totalAmount = typeof parsed.amount === "number" ? parsed.amount : unitPrice * qty;

    return {
      title: parsed.title || input,
      amount: totalAmount,
      category: parsed.category || "Other",
    };
  } catch (error) {
    console.error("AI parse error:", error);
    return fallbackParse(input);
  }
}

export async function getAIInsight(expenses: { title: string; amount: number; category: string }[]): Promise<string> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY || expenses.length === 0) {
    return "เพิ่มรายจ่ายเพื่อรับคำแนะนำจาก AI";
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  try {
    const summary = expenses.slice(0, 10).map(e => `${e.title}: ${e.amount} บาท (${e.category})`).join(", ");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a friendly Thai financial advisor for a young Thai user. Based on these recent expenses, give ONE short, helpful tip in Thai (max 50 words). Be encouraging, use casual Thai, maybe add an emoji.

Recent expenses: ${summary}

Respond with ONLY the tip text, nothing else.`,
      config: {
        temperature: 0.7,
      },
    });

    return response.text?.trim() || "ติดตามรายจ่ายต่อไปนะ! 💪";
  } catch (error) {
    console.error("AI insight error:", error);
    return "ติดตามรายจ่ายต่อไปนะ! 💪";
  }
}

function fallbackParse(input: string): ParsedExpense {
  const amountMatch = input.match(/\d+(\.\d+)?/);
  const amount = amountMatch ? parseFloat(amountMatch[0]) : 0;
  const title = input.replace(/\d+(\.\d+)?/, "").trim() || "ไม่ระบุชื่อ";

  const t = title.toLowerCase();
  let category = "Other";
  if (t.includes("กาแฟ") || t.includes("ชา") || t.includes("น้ำ")) category = "Drinks";
  else if (t.includes("ข้าว") || t.includes("อาหาร") || t.includes("หมู")) category = "Food";
  else if (t.includes("รถ") || t.includes("น้ำมัน") || t.includes("bts")) category = "Transport";
  else if (t.includes("ซื้อ") || t.includes("ช้อป")) category = "Shopping";
  else if (t.includes("ไฟ") || t.includes("เน็ต") || t.includes("บิล")) category = "Bills";

  return { title, amount, category };
}

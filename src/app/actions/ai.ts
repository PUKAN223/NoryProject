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
      contents: `You are an expense parser for a Thai expense tracking app. Parse the following user input into a JSON object with these fields:
- "title": the name/description of the expense in Thai (keep original language)
- "amount": the numeric amount spent (number, no currency symbol)  
- "category": one of these categories: "Food", "Drinks", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Education", "Other"

If no amount is found, set amount to 0.
If the input is ambiguous, make your best guess.

User input: "${input}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            amount: { type: Type.NUMBER },
            category: { type: Type.STRING },
          },
          required: ["title", "amount", "category"],
        },
        temperature: 0.1,
      },
    });

    const text = response.text;
    if (!text) return fallbackParse(input);

    const parsed = JSON.parse(text);

    return {
      title: parsed.title || input,
      amount: typeof parsed.amount === "number" ? parsed.amount : 0,
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

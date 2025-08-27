// main.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const TOKEN = Deno.env.get("BOT_TOKEN");
const SECRET_PATH = "/sarcasm";
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const CREATOR_USERNAME = "amangeldimasakov";
const TARGET_BOT_USERNAME = "neirohambot";



// --- Состояния для математических сессий ---
// ключ = `${chatId}:${userId}`
const mathSessions: Record<string, boolean> = {};

// --- Функция решения математических выражений ---
function solveMath(expr: string): string {
  try {
    const sanitized = expr.replace(/[^-()\d/*+.]/g, "");
    // eslint-disable-next-line no-eval
    const result = eval(sanitized);
    return `${expr} = ${result}`;
  } catch {
    return `Не удалось вычислить: "${expr}" 😅`;
  }
}

// --- Webhook ---
serve(async (req: Request) => {
  const { pathname } = new URL(req.url);
  if (pathname !== SECRET_PATH) return new Response("ok");
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const update = await req.json();
  const msg = update.message;
  const chatId = msg?.chat?.id;
  const messageId = msg?.message_id;
  const userId = msg?.from?.id;
  const text = msg?.text;
  const username = msg?.from?.username;

  if (!chatId || !text || !userId) return new Response("ok");

  const sessionKey = `${chatId}:${userId}`;

  // --- Команда /math ---
  if (text.toLowerCase().startsWith("/math")) {
    mathSessions[sessionKey] = true; // активируем сессию для этого пользователя
    await sendMessage(chatId, "Напиши пример, и я его решу 😎", messageId);
    return new Response("ok");
  }

  // --- Если пользователь в математическом режиме ---
  if (mathSessions[sessionKey]) {
    const solution = solveMath(text);
    await sendMessage(chatId, solution, messageId);
    mathSessions[sessionKey] = false; // выключаем режим после решения
    return new Response("ok");
  }

  // --- Обычные ответы ---
  for (const r of RESPONSES) {
    if (r.keywords.some(kw => text.toLowerCase().includes(kw))) {
      await sendMessage(chatId, r.reply, messageId);
      return new Response("ok");
    }
  }

  return new Response("ok");
});

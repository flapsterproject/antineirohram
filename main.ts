import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const TOKEN = Deno.env.get("BOT_TOKEN");
const SECRET_PATH = "/sarcasm";
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const TARGET_BOT_USERNAME = "neirohambot";

// --- Состояния для математических сессий ---
const mathSessions: Record<number, boolean> = {}; // chatId -> активна ли сессия

// --- Ответы и сарказм ---
const RESPONSES = [
  { keywords: ["привет", "здравствуйте", "хай"], reply: "Привет, рад видеть тебя 😏" },
  { keywords: ["как дела"], reply: "Как обычно — сарказм спасает этот мир 🙃" },
];

const BOT_REPLIES = [
  "@neirohambot, я явно умнее тебя 🙄",
  "@neirohambot, твой интеллект — как Windows 95 😂",
];

function randomArray(arr: string[]) { return arr[Math.floor(Math.random() * arr.length)]; }

async function sendMessage(chatId: number, text: string, replyTo?: number) {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, reply_to_message_id: replyTo }),
  });
}

// --- Решение математических выражений ---
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
  const text = msg?.text;
  const username = msg?.from?.username;

  if (!chatId || !text) return new Response("ok");

  // Сарказм на @neirohambot
  if (username === TARGET_BOT_USERNAME) {
    await sendMessage(chatId, randomArray(BOT_REPLIES), messageId);
    return new Response("ok");
  }

  // --- Математическая команда ---
  if (text.toLowerCase() === "/math") {
    mathSessions[chatId] = true; // активируем сессию
    await sendMessage(chatId, "Напиши пример, и я его решу 😎", messageId);
    return new Response("ok");
  }

  // --- Если пользователь в математическом режиме ---
  if (mathSessions[chatId]) {
    const solution = solveMath(text);
    await sendMessage(chatId, solution, messageId);
    mathSessions[chatId] = false; // выключаем сессию
    return new Response("ok");
  }

  // --- Обычные ответы ---
  for (const r of RESPONSES) {
    if (r.keywords.some(kw => text.toLowerCase().includes(kw))) {
      await sendMessage(chatId, r.reply, messageId);
      return new Response("ok");
    }
  }

  // --- Ответ по умолчанию ---
  await sendMessage(chatId, `Интересно, что ты написал: "${text}" 😏`, messageId);
  return new Response("ok");
});



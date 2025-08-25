// main.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const TOKEN = Deno.env.get("BOT_TOKEN"); // твой бот-токен
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const SECRET_PATH = "/sarcasm"; // путь вебхука

// Саркастические шаблоны
const sarcasticReplies = [
  (text: string) => `Ого, @neirohambot пишет: "${text}"… ну что ж, шедевр! 😏`,
  (text: string) => `Внимание всем! @neirohambot сказал: "${text}" 🙄`,
  (text: string) => `Браво, @neirohambot, ваш вклад в беседу: "${text}" 🤨`,
  (text: string) => `"${text}" — так говорил @neirohambot. Истинная мудрость! 😂`,
];

// Функция для отправки сообщения
async function sendMessage(chat_id: number | string, text: string) {
  const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id, text, parse_mode: "HTML" }),
  });

  const data = await res.json();
  if (!data.ok) console.error("Ошибка отправки:", data);
}

// HTTP сервер Deno для вебхука
serve(async (req: Request) => {
  const { pathname } = new URL(req.url);

  if (pathname !== SECRET_PATH) return new Response("Bot is running.", { status: 200 });
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const update = await req.json();
  const message = update.message;
  const chatId = message?.chat?.id;
  const text = message?.text;

  if (!chatId || !text) return new Response("No chat ID or text", { status: 200 });

  // Если сообщение от @neirohambot
  if (message.from?.username === "neirohambot") {
    const replyFunc = sarcasticReplies[Math.floor(Math.random() * sarcasticReplies.length)];
    const replyText = replyFunc(text);
    await sendMessage(chatId, replyText);
  }

  return new Response("OK", { status: 200 });
});


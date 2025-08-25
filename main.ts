// main.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const TOKEN = Deno.env.get("BOT_TOKEN"); // Твой токен
if (!TOKEN) throw new Error("BOT_TOKEN not set");

const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const SECRET_PATH = "/sarcasm"; // путь вебхука

// Саркастические ответы
const sarcasticReplies = [
  (text: string) => `Ого, @neirohambot пишет: "${text}"… ну что ж, шедевр! 😏`,
  (text: string) => `Внимание всем! @neirohambot сказал: "${text}" 🙄`,
  (text: string) => `Браво, @neirohambot, ваш вклад в беседу: "${text}" 🤨`,
  (text: string) => `"${text}" — так говорил @neirohambot. Истинная мудрость! 😂`,
];

// Функция для отправки сообщений
async function sendMessage(chat_id: number | string, text: string) {
  const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id, text }),
  });

  const data = await res.json();
  if (!data.ok) console.error("Ошибка отправки сообщения:", data);
}

// HTTP сервер для вебхука
serve(async (req: Request) => {
  const url = new URL(req.url);

  if (url.pathname !== SECRET_PATH) return new Response("Bot is running", { status: 200 });
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  let update;
  try {
    update = await req.json();
  } catch (e) {
    return new Response("Invalid JSON", { status: 400 });
  }

  const message = update.message;
  if (!message) return new Response("No message", { status: 200 });

  const chatId = message.chat?.id;
  const text = message.text;

  if (!chatId || !text) return new Response("No chat ID or text", { status: 200 });

  // Отвечаем только @neirohambot
  if (message.from?.username === "neirohambot") {
    const replyFunc = sarcasticReplies[Math.floor(Math.random() * sarcasticReplies.length)];
    const replyText = replyFunc(text);

    await sendMessage(chatId, replyText);
  }

  return new Response("OK", { status: 200 });
});


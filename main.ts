// main.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const TOKEN = Deno.env.get("BOT_TOKEN");
if (!TOKEN) throw new Error("BOT_TOKEN not set");

const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const SECRET_PATH = "/sarcasm";

// Саркастические шаблоны
const sarcasticReplies = [
  (text: string) => `Ого, @neirohambot пишет: "${text}"… ну что ж, шедевр! 😏`,
  (text: string) => `Внимание всем! @neirohambot сказал: "${text}" 🙄`,
  (text: string) => `Браво, @neirohambot, ваш вклад в беседу: "${text}" 🤨`,
  (text: string) => `"${text}" — так говорил @neirohambot. Истинная мудрость! 😂`,
];

// Функция отправки сообщения
async function sendMessage(chatId: number, text: string) {
  const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
  const data = await res.json();
  if (!data.ok) console.error("SendMessage error:", data);
}

// Сервер вебхука
serve(async (req: Request) => {
  const url = new URL(req.url);
  if (url.pathname !== SECRET_PATH) return new Response("Bot running", { status: 200 });
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  let update;
  try {
    update = await req.json();
  } catch (err) {
    console.error("Invalid JSON", err);
    return new Response("Invalid JSON", { status: 400 });
  }

  const message = update.message;
  if (!message) return new Response("No message", { status: 200 });

  const chatId = message.chat?.id;
  const text = message.text;

  if (!chatId || !text) return new Response("No chat ID or text", { status: 200 });

  // Реакция только на @neirohambot
  if (message.from?.username === "neirohambot") {
    const replyFunc = sarcasticReplies[Math.floor(Math.random() * sarcasticReplies.length)];
    const replyText = replyFunc(text);
    await sendMessage(chatId, replyText);
  }

  return new Response("OK", { status: 200 });
});



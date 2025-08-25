// main.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const TOKEN = Deno.env.get("BOT_TOKEN");
if (!TOKEN) throw new Error("BOT_TOKEN not set");

const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const SECRET_PATH = "/sarcasm";

// Саркастические шаблоны
const sarcasticReplies = [
  (text: string) => `Интересно, ты написал: "${text}" 😏`,
  (text: string) => `Ого, серьезно? "${text}" 🙄`,
  (text: string) => `Ну конечно, "${text}" — это гениально 😂`,
  (text: string) => `"${text}" — ну что ж, спасибо за информацию 😅`,
];

// Функция отправки ответа
async function sendMessage(chatId: number, text: string, replyToMessageId?: number) {
  const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      reply_to_message_id: replyToMessageId,
    }),
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
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const message = update.message;
  if (!message || !message.text) return new Response("No message", { status: 200 });

  const chatId = message.chat.id;
  const replyFunc = sarcasticReplies[Math.floor(Math.random() * sarcasticReplies.length)];
  const replyText = replyFunc(message.text);

  // Отвечаем на сообщение
  await sendMessage(chatId, replyText, message.message_id);

  return new Response("OK", { status: 200 });
});

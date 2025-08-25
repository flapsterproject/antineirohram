// main.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const TOKEN = Deno.env.get("BOT_TOKEN");
const SECRET_PATH = "/sarcasm";
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const CHAT_ID = Number(Deno.env.get("CHAT_ID")); // сюда вставь ID группы

// саркастические ответы к пользователям
const USER_REPLIES = [
  "Ого, какой умный комментарий 😂",
  "Спасибо, твоя мысль очень ценна 🤦‍♂️",
  "Ты прямо философ нашего чата 🎭",
  "Вау, уровень сарказма: эксперт 🏆",
  "Продолжай, мы тут все словарь пополняем 📚",
];

// саркастические фразы про @neirohambot
const BOT_REPLIES = [
  "@neirohambot, я явно умнее тебя 🙄",
  "@neirohambot, ну кто же так думает 😂",
  "@neirohambot, ты опять пытаешься меня превзойти? 🎭",
  "@neirohambot, слишком просто для меня 😎",
  "@neirohambot, спасибо за развлечение 🤡",
];

function randomReply(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// случайное решение: обычный сарказм или про @neirohambot
function decideReply() {
  return Math.random() < 0.3 ? randomReply(BOT_REPLIES) : randomReply(USER_REPLIES);
}

async function sendMessage(chatId: number, text: string, replyTo?: number) {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      reply_to_message_id: replyTo,
      parse_mode: "Markdown",
    }),
  });
}

// Таймер: каждые 60 секунд отправляем сарказм про @neirohambot
setInterval(() => {
  const text = randomReply(BOT_REPLIES);
  sendMessage(CHAT_ID, text).catch(console.error);
}, 60_000); // 60 000 мс = 1 минута

// Webhook для реакции на пользователей
serve(async (req: Request) => {
  const { pathname } = new URL(req.url);
  if (pathname !== SECRET_PATH) return new Response("ok");
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const update = await req.json();
  const msg = update.message;
  const chatId = msg?.chat?.id;
  const messageId = msg?.message_id;

  if (!chatId || !msg?.text) return new Response("ok");

  // реагируем только на обычных пользователей
  if (!msg.from?.is_bot) {
    const reply = decideReply();
    await sendMessage(chatId, reply, messageId);
  }

  return new Response("ok");
});







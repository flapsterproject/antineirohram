// main.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const TOKEN = Deno.env.get("BOT_TOKEN");
const SECRET_PATH = "/sarcasm";
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

// саркастические ответы
const SARCASTIC_REPLIES = [
  "О, @neirohambot снова решил просветить нас 🙄",
  "Какой сюрприз, это же @neirohambot 🎉",
  "Внимание, гений в чате! Спасибо, @neirohambot 😂",
  "Опять ты, @neirohambot? Не устанешь удивлять 🎭",
  "Ну что ж, без тебя мы тут бы пропали 🏆",
];

function randomReply() {
  return SARCASTIC_REPLIES[Math.floor(Math.random() * SARCASTIC_REPLIES.length)];
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

serve(async (req: Request) => {
  const { pathname } = new URL(req.url);
  if (pathname !== SECRET_PATH) return new Response("ok");
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const update = await req.json();
  const msg = update.message;
  const chatId = msg?.chat?.id;
  const text = msg?.text;
  const messageId = msg?.message_id;
  const username = msg?.from?.username;

  if (!chatId || !text || !username) return new Response("ok");

  // ✅ реагируем только на сообщения пользователя @neirohambot
  if (username.toLowerCase() === "neirohambot") {
    await sendMessage(chatId, randomReply(), messageId);
  }

  return new Response("ok");
});






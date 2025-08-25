// main.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const TOKEN = Deno.env.get("BOT_TOKEN");
const SECRET_PATH = "/sarcasm";
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

// список запрещённых слов (можешь расширять)
const BAD_WORDS = ["бля", "сука", "нахуй", "ебать", "пиздец", "хуй" ,"tt"];

// саркастические ответы
const SARCASTIC_REPLIES = [
  "О, культурный человек в чате. Аж уши завяли 🎻",
  "Мама бы тобой гордилась. Ну или выгнала из дома 🤷‍♂️",
  "Прям как кандидат на премию *«Поэт Года»* 🏆",
  "Да-да, именно так люди и становятся гениями 🤡",
  "Спасибо, мы пополнили словарь великих мыслей 📚",
];

function containsBadWord(text: string): boolean {
  return BAD_WORDS.some((word) => text.toLowerCase().includes(word));
}

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

async function deleteMessage(chatId: number, messageId: number) {
  await fetch(`${TELEGRAM_API}/deleteMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
    }),
  });
}

serve(async (req: Request) => {
  const { pathname } = new URL(req.url);
  if (pathname !== SECRET_PATH) {
    return new Response("Bot is running.", { status: 200 });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const update = await req.json();
  const message = update.message;
  const chatId = message?.chat?.id;
  const text = message?.text;
  const messageId = message?.message_id;

  if (!chatId || !text) return new Response("No message", { status: 200 });

  // проверка чата: работает и в group, и в supergroup
  if (message.chat.type === "group" || message.chat.type === "supergroup") {
    if (containsBadWord(text)) {
      // удаляем сообщение
      await deleteMessage(chatId, messageId);

      // пишем сарказм
      await sendMessage(chatId, randomReply());
    }
  }

  return new Response("OK", { status: 200 });
});


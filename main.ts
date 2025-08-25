// main.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const TOKEN = Deno.env.get("BOT_TOKEN"); // задаёшь через переменные окружения
const SECRET_PATH = "/sarcasm"; // Webhook путь
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

// список "запрещённых" слов (мат/брань)
const BAD_WORDS = ["бля", "сука", "нахуй", "ебать", "пиздец", "хуй"];

// саркастические ответы
const SARCASTIC_REPLIES = [
  "Ого, какое культурное выражение. Бабушка бы тобой гордилась 🤦‍♂️",
  "Уровень интеллекта: максимальный. Прям Шекспир нашего чата 🎭",
  "Да-да, продолжай, мы тут все словарь пополняем 📚",
  "Вау, очередной поэт подъехал. Тебя точно на премию выдвинут 🏆",
  "Ну вот без этого слова мы бы вообще тебя не поняли 😂",
];

function containsBadWord(text: string): boolean {
  return BAD_WORDS.some((word) => text.toLowerCase().includes(word));
}

function randomReply() {
  return SARCASTIC_REPLIES[Math.floor(Math.random() * SARCASTIC_REPLIES.length)];
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

  if (!chatId || !text) return new Response("No message", { status: 200 });

  // проверяем мат
  if (containsBadWord(text)) {
    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        reply_to_message_id: message.message_id,
        text: randomReply(),
      }),
    });
  }

  return new Response("OK", { status: 200 });
});

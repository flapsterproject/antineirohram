// main.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const TOKEN = Deno.env.get("BOT_TOKEN"); // токен бота из переменных окружения
const SECRET_PATH = "/sarcasm"; // путь для вебхука
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

// Набор саркастических фраз
const sarcasticReplies = [
  "О, наш любимый оратор снова в деле 😏",
  "Без тебя тут так скучно было бы 😂",
  "Мир затаил дыхание, читая твои слова 🤡",
  "Так глубоко, что я чуть не утонул 🙃",
  "Гений мысли и отец сарказма ✨",
  "Лучше бы ты книгу написал 📖",
  "Ну всё, пошёл записывать это в цитатник 😬",
];

function getRandomReply() {
  return sarcasticReplies[Math.floor(Math.random() * sarcasticReplies.length)];
}

serve(async (req: Request) => {
  const { pathname } = new URL(req.url);

  // проверяем секретный путь
  if (pathname !== SECRET_PATH) {
    return new Response("Bot is running.", { status: 200 });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const update = await req.json();
  const message = update.message;
  const chatId = message?.chat?.id;
  const username = message?.from?.username;

  if (!chatId || !username) return new Response("No chat ID or username", { status: 200 });

  // реагируем только на @neirohambot
  if (username === "neirohambot" && message.text) {
    const reply = getRandomReply();

    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: reply,
        reply_to_message_id: message.message_id,
      }),
    });
  }

  return new Response("OK", { status: 200 });
});

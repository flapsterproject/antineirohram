// main.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const TOKEN = Deno.env.get("BOT_TOKEN");
const SECRET_PATH = "/sarcasm"; // webhook path
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

// Sarcastic replies
const sarcasticReplies = [
  "О, наш любимый оратор снова в деле 😏",
  "Без тебя тут так скучно было бы 😂",
  "Мир затаил дыхание, читая твои слова 🤡",
  "Так глубоко, что я чуть не утонул 🙃",
  "Гений мысли и отец сарказма ✨",
  "Лучше бы ты книгу написал 📖",
  "Ну всё, пошёл записывать это в цитатник 😬",
];
const getRandomReply = () =>
  sarcasticReplies[Math.floor(Math.random() * sarcasticReplies.length)];

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
  const callbackQuery = update.callback_query;

  const chatId = message?.chat?.id || callbackQuery?.message?.chat?.id;
  const text = message?.text;
  const fromUser = message?.from;

  if (!chatId) return new Response("No chat ID", { status: 200 });

  // React only to @neirohambot (username check)
  if (fromUser?.is_bot && fromUser?.username?.toLowerCase() === "neirohambot" && text) {
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

  // Answer callback query if exists
  if (callbackQuery) {
    await fetch(`${TELEGRAM_API}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callback_query_id: callbackQuery.id,
      }),
    });
  }

  return new Response("OK", { status: 200 });
});

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const TOKEN = Deno.env.get("BOT_TOKEN"); // твой токен бота
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const SECRET_PATH = "/sarcasm"; // путь вебхука

// Функция для отправки сообщений
async function sendMessage(chat_id: number, text: string) {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id, text }),
  });
}

// Саркастические ответы
const sarcasticReplies = [
  "Ой, какой умный! 😏",
  "Ну конечно, все вокруг виноваты, а ты нет 🤨",
  "Спасибо за мудрый комментарий, профессор 🙄",
  "Вау, это шедевр сарказма!",
];

// Запуск сервера
serve(async (req: Request) => {
  // Проверяем путь
  const url = new URL(req.url);
  if (url.pathname !== SECRET_PATH) return new Response("Not Found", { status: 404 });

  const body = await req.json();

  if (body.message) {
    const message = body.message;
    const chat_id = message.chat.id;

    // Проверяем, что сообщение от @neirohambot
    if (message.from?.username === "neirohambot") {
      const reply = sarcasticReplies[Math.floor(Math.random() * sarcasticReplies.length)];
      await sendMessage(chat_id, reply);
    }
  }

  return new Response("ok");
});


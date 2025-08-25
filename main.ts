import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const TOKEN = Deno.env.get("BOT_TOKEN");
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const SECRET_PATH = "/sarcasm";

// Функция для отправки сообщений
async function sendMessage(chat_id: number | string, text: string) {
  const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id,
      text,
      parse_mode: "HTML", // можно использовать HTML для форматирования
    }),
  });

  const data = await res.json();
  if (!data.ok) {
    console.error("Ошибка отправки сообщения:", data);
  }
}

// Саркастические ответы с шаблоном текста
const sarcasticReplies = [
  (text: string) => `Ого, @neirohambot пишет: "${text}"… ну что ж, шедевр! 😏`,
  (text: string) => `Внимание всем! @neirohambot сказал: "${text}" 🙄`,
  (text: string) => `Браво, @neirohambot, ваш вклад в беседу: "${text}" 🤨`,
  (text: string) => `"${text}" — так говорил @neirohambot. Истинная мудрость! 😂`,
];

serve(async (req: Request) => {
  const url = new URL(req.url);
  if (url.pathname !== SECRET_PATH) return new Response("Not Found", { status: 404 });

  const body = await req.json();

  if (body.message && body.message.from?.username === "neirohambot") {
    const chat_id = body.message.chat.id;
    const text = body.message.text || "";

    // Если текст есть, отправляем сарказм
    if (text.trim().length > 0) {
      const replyFunc = sarcasticReplies[Math.floor(Math.random() * sarcasticReplies.length)];
      const reply = replyFunc(text);
      await sendMessage(chat_id, reply);
    }
  }

  return new Response("ok");
});

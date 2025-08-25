// main.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const TOKEN = Deno.env.get("BOT_TOKEN");
const SECRET_PATH = "/sarcasm";
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const CHAT_ID = Number(Deno.env.get("CHAT_ID")); // ID вашей группы

// Словарь ключевых слов и ответов для обычных пользователей
const RESPONSES = [
  { keywords: ["привет", "здравствуйте", "хай", "добрый день", "доброе утро"], reply: "О, привет! Рад видеть тебя 😎" },
  { keywords: ["как дела", "как ты", "как настроение"], reply: "Как обычно — спасаю мир сарказмом 😏" },
  { keywords: ["помощь", "что делать", "не знаю", "подскажи", "совет"], reply: "Хм, нужна моя мудрость? Готов просветить тебя 🤔" },
  { keywords: ["шутка", "смешно", "юмор", "хаха"], reply: "Ха-ха, я тоже смеюсь над этим 😏" },
  { keywords: ["бред", "не понимаю", "странно", "тупо"], reply: "Ну ты прям как @neirohambot 😅" },
  { keywords: ["игра", "флэпстер", "флап", "играю", "играем"], reply: "О, вижу, ты любишь приключения 🎮" },
  { keywords: ["люблю", "нравится", "классно", "очень"], reply: "Рад, что тебе нравится! 😎" },
  { keywords: ["грустно", "плохо", "печаль", "огорчён"], reply: "Эх, не грусти, сарказм лечит лучше любых таблеток 😉" },
  { keywords: ["бот", "нейрохамбот", "neirohambot"], reply: "Ага, снова упоминание @neirohambot… Я явно умнее 😏" },
];

// Список саркастических сообщений про @neirohambot
const BOT_REPLIES = [
  "@neirohambot, я явно умнее тебя 🙄",
  "@neirohambot, ну кто же так думает 😂",
  "@neirohambot, ты опять пытаешься меня превзойти? 🎭",
  "@neirohambот, слишком просто для меня 😎",
  "@neirohambот, спасибо за развлечение 🤡",
];

// Функция генерации саркастического ответа, если ключевых слов нет
function generateSarcasticReply(text: string) {
  return `Интересно, что ты только что написал: "${text}". Конечно, это так глубоко и умно, что я даже не могу сдержать сарказм 😏`;
}

// Проверка ключевых слов
function analyzeMessage(text: string) {
  text = text.toLowerCase();
  for (const r of RESPONSES) {
    for (const kw of r.keywords) {
      if (text.includes(kw)) return r.reply;
    }
  }
  return generateSarcasticReply(text);
}

// Случайный сарказм про @neirohambot
function randomBotReply() {
  return BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)];
}

// Отправка сообщения
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

// Сервер webhook
serve(async (req: Request) => {
  const { pathname } = new URL(req.url);
  if (pathname !== SECRET_PATH) return new Response("ok");
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const update = await req.json();
  const msg = update.message;
  const chatId = msg?.chat?.id;
  const messageId = msg?.message_id;
  const text = msg?.text;

  if (!chatId || !text) return new Response("ok");

  // Команда /antineiroham
  if (text.startsWith("/antineiroham")) {
    const reply = randomBotReply();
    await sendMessage(chatId, reply, messageId);
    return new Response("ok");
  }

  // Игнорируем сообщения других ботов
  if (!msg.from?.is_bot) {
    const reply = analyzeMessage(text);
    await sendMessage(chatId, reply, messageId);
  }

  return new Response("ok");
});








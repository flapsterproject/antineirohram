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
  { keywords: ["спасибо", "благодарю", "спасибки"], reply: "Всегда рад помочь! Даже сарказмом 😏" },
  { keywords: ["иди", "уйди", "отстань", "заткнись"], reply: "О, привет хамство! Я прям в восторге 🤡" },
  { keywords: ["поздравляю", "ура", "класс", "отлично"], reply: "Ура! Рад за тебя 😎" },
  { keywords: ["устал", "выдохся", "устала"], reply: "Не переживай, отдыхай… сарказм подождёт 😉" },
  { keywords: ["сюрприз", "неожиданно", "внезапно"], reply: "Ого, неожиданный поворот! Я впечатлён 😏" },
  { keywords: ["интересно", "хочу знать", "объясни"], reply: "Сейчас раскрою все тайны мира сарказма 🤓" },
  { keywords: ["да", "ага", "точно", "правильно"], reply: "Конечно, как же без тебя 😎" },
  { keywords: ["нет", "неа", "неправильно"], reply: "Хм, так и думал 😏" },
];

// Список длинных саркастических сообщений про @neirohambot
const BOT_REPLIES = [
  "@neirohambot, я явно умнее тебя 🙄 Как вообще можно было додуматься до такой мысли?",
  "@neirohambot, ты опять пытаешься меня превзойти? 😂 Серьезно, это выглядит комично!",
  "@neirohambot, слишком просто для меня 😎 Я бы на твоем месте подучился немного перед этим.",
  "@neirohambot, спасибо за развлечение 🤡 Каждый твой пост – шедевр бессмысленности!",
  "@neirohambot, ну кто же так думает? 🤔 Даже коты умнее!",
  "@neirohambot, твой интеллект меня поражает… в плохом смысле 😏",
  "@neirohambot, я видел много смешного, но твои сообщения – отдельная категория юмора 😂",
  "@neirohambot, снова ты решил показать всем свой уникальный талант по написанию бессмысленных фраз 🤣",
  "@neirohambot, твои идеи — прям образец того, как не стоит думать 😎",
  "@neirohambot, серьезно? Это ты называешь мудрым постом? 🙄 Даже слоны смеются!",
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
      reply_to_message_id: replyTo, // null для команды /antineiroham
      parse_mode: "Markdown",
    }),
  });
}

// Webhook
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

  // Команда /antineiroham — пишет сообщение про @neirohambot без reply
  if (text.startsWith("/antineiroham")) {
    const reply = randomBotReply();
    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: reply,
        parse_mode: "Markdown",
      }),
    });
    return new Response("ok");
  }

  // Игнорируем сообщения других ботов
  if (!msg.from?.is_bot) {
    const reply = analyzeMessage(text);
    await sendMessage(chatId, reply, messageId); // здесь reply для пользователей
  }

  return new Response("ok");
});








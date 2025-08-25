// main.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const TOKEN = Deno.env.get("BOT_TOKEN");
const SECRET_PATH = "/sarcasm";
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const CHAT_ID = Number(Deno.env.get("CHAT_ID"));

const CREATOR_USERNAME = "amangeldimasakov"; // <- сюда твой username без @

// Обычные ответы по ключевым словам для всех пользователей
const RESPONSES = [
  { keywords: ["привет", "здравствуйте", "хай", "добрый день", "доброе утро"], reply: "О, привет!" },
  { keywords: ["как дела", "как ты", "как настроение"], reply: "Как обычно — спасаю мир сарказмом 😏" },
  { keywords: ["помощь", "что делать", "не знаю", "подскажи", "совет"], reply: "Хм, нужна моя мудрость? Готов просветить тебя 🤔" },
  { keywords: ["шутка", "смешно", "юмор", "хаха"], reply: "Ха-ха, я тоже смеюсь над этим 😏" },
  { keywords: ["бред", "не понимаю", "странно", "тупо"], reply: "Ну ты прям как @neirohambot 😅" },
  { keywords: ["игра", "флэпстер", "флап", "играю", "играем"], reply: "О, вижу, ты любишь приключения 🎮" },
  { keywords: ["люблю", "нравится", "классно", "очень"], reply: "Рад, что тебе нравится!" },
  { keywords: ["грустно", "плохо", "печаль", "огорчён"], reply: "Эх, не грусти, сарказм лечит лучше любых таблеток 😉" },
  { keywords: ["бот", "нейрохамбот", "neirohambot"], reply: "Ага, снова упоминание @neirohambot… Я явно умнее 😏" },
  { keywords: ["спасибо", "благодарю", "спасибки"], reply: "Всегда рад помочь! Даже сарказмом 😏" },
  { keywords: ["иди", "уйди", "отстань", "заткнись"], reply: "О, привет хамство! Я прям в восторге 🤡" },
];

// Дружелюбные ответы для создателя
const CREATOR_REPLIES = [
  "Привет, мой создатель! 😎 Как дела?",
  "Ого, ты написал: \"{text}\", мой создатель! 👑",
  "Хорошо, мой создатель, я понял 😎",
  "Ты опять удивляешь меня, мой создатель 😏",
  "Спасибо за твои слова, мой создатель! 😎",
  "Хм… интересно, что пишет мой создатель! 😏",
  "Мой создатель говорит: \"{text}\". Я слушаю внимательно 😎",
  "О, снова мудрые слова от моего создателя 😏",
  "Отлично, мой создатель! Я всегда рад твоим сообщениям 😎",
  "Твой текст: \"{text}\" — настоящий шедевр, мой создатель 😏",
];

// Много саркастических фраз для @neirohambot
const BOT_REPLIES = [
  "@neirohambot, я явно умнее тебя 🙄 Как вообще можно было додуматься до такой мысли?",
  "@neirohambot, ты опять пытаешься меня превзойти? 😂 Серьезно, это выглядит комично!",
  "@neirohambot, слишком просто для меня 😎 Я бы на твоем месте подучился немного перед этим.",
  "@neirohambot, спасибо за развлечение 🤡 Каждый твой пост – шедевр бессмысленности!",
  "@neirohambot, ну кто же так думает? 🤔 Даже коты смеют!",
  "@neirohambot, твой интеллект меня поражает… в плохом смысле 😏",
  "@neirohambot, очередное гениальное сообщение… для кота 😅",
  "@neirohambot, я бы назвал это искусством… если бы не было так скучно 😎",
  "@neirohambot, снова пытаешься блеснуть умом? Увы, не получилось 😏",
  "@neirohambot, интересно, а у тебя есть хоть одна идея без фейла? 😂",
  "@neirohambot, твоя логика поражает… своей абсурдностью 🙃",
  "@neirohambot, я бы аплодировал, если бы это было смешно 😅",
  "@neirohambot, ну ты опять на высоте… только не той, которая нужна 😏",
  "@neirohambot, держи свои «гениальные мысли» при себе 😎",
  "@neirohambot, не могу перестать удивляться твоему чувству юмора… или его отсутствию 😏",
];

// Генерация сарказма, если ключевых слов нет
function generateSarcasticReply(text: string) {
  return `Интересно, что ты только что написал: "${text}". Конечно, это так глубоко и умно, что я даже не могу сдержать сарказм 😏`;
}

// Анализ текста по ключевым словам
function analyzeMessage(text: string) {
  const lower = text.toLowerCase();
  for (const r of RESPONSES) {
    for (const kw of r.keywords) {
      if (lower.includes(kw)) return r.reply;
    }
  }
  return generateSarcasticReply(text);
}

// Случайный дружелюбный ответ для создателя
function randomCreatorReply(text: string) {
  const template = CREATOR_REPLIES[Math.floor(Math.random() * CREATOR_REPLIES.length)];
  return template.replace("{text}", text);
}

// Случайный сарказм для @neirohambot
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
  const username = msg?.from?.username;

  if (!chatId || !text) return new Response("ok");

  // Команда /antineiroham — пишем случайный сарказм про @neirohambot
  if (text.startsWith("/antineiroham")) {
    const reply = randomBotReply();
    await sendMessage(chatId, reply);
    return new Response("ok");
  }

  // Игнорируем сообщения других ботов
  if (!msg.from?.is_bot) {
    let replyText: string;

    if (username === CREATOR_USERNAME) {
      // Для твоих сообщений выбираем дружелюбный ответ
      replyText = randomCreatorReply(text);
    } else {
      // Обычные пользователи получают сарказм по ключевым словам
      replyText = analyzeMessage(text);
    }

    await sendMessage(chatId, replyText, messageId);
  }

  return new Response("ok");
});

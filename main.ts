// main.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const TOKEN = Deno.env.get("BOT_TOKEN");
const SECRET_PATH = "/sarcasm";
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const CREATOR_USERNAME = "amangeldimasakov"; // <-- замени на свой username без @

// 🔹 Ключевые слова для обычных пользователей
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

// 🔹 Дружелюбные ответы для создателя
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

// 🔹 Сарказм для @neirohambot
const BOT_REPLIES = [
  "@neirohambot, я явно умнее тебя 🙄 Как вообще можно было додуматься до такой мысли?",
  "@neirohambot, ты опять пытаешься меня превзойти? 😂",
  "@neirohambot, слишком просто для меня 😎 Я бы на твоем месте подучился немного.",
  "@neirohambot, спасибо за развлечение 🤡 Каждый твой пост – шедевр бессмысленности!",
  "@neirohambot, твой интеллект поражает… в плохом смысле 😏",
  "@neirohambot, очередное гениальное сообщение… для кота 😅",
  "@neirohambot, снова пытаешься блеснуть умом? Увы, не получилось 😏",
  "@neirohambot, интересно, а у тебя есть хоть одна идея без фейла? 😂",
  "@neirohambot, я бы аплодировал, если бы это было смешно 😅",
];

// 🔹 Клубы и игроки
const FOOTBALL_CLUBS_CREATOR = ["реал мадрид", "real madrid"];
const FOOTBALL_CLUBS_OTHER = ["барселона", "barcelona"];

const FOOTBALL_PLAYERS_CREATOR = ["роналдо", "cristiano ronaldo"];
const FOOTBALL_PLAYERS_OTHER = [
  "месси", "lionel messi",
  "пеле", "pele",
  "диего марадонa", "diego maradona",
  "йохан кройф", "johan cruyff", "cruyff",
  "килиан мбаппе", "kylian mbappe", "mbappe",
  "эрлинг холанд", "erling haaland", "haaland",
  "джуд беллингем", "jude bellingham", "bellingham"
];

// 🔹 Функции
function randomCreatorReply(text: string) {
  const template = CREATOR_REPLIES[Math.floor(Math.random() * CREATOR_REPLIES.length)];
  return template.replace("{text}", text);
}

function analyzeFootballMessage(text: string, username: string) {
  const lower = text.toLowerCase();
  if (username === CREATOR_USERNAME) {
    for (const club of FOOTBALL_CLUBS_CREATOR) if (lower.includes(club)) return `О, мой создатель любит ${club.toUpperCase()}! 😎`;
    for (const player of FOOTBALL_PLAYERS_CREATOR) if (lower.includes(player)) return `Конечно, мой создатель восхищается ${player}! ⚽️`;
    for (const club of FOOTBALL_CLUBS_OTHER) if (lower.includes(club)) return `Хм… но мой создатель всё равно любит Реал Мадрид 😏`;
    for (const player of FOOTBALL_PLAYERS_OTHER) if (lower.includes(player)) return `Хм… но мой создатель всё равно восхищается Роналдо 😏`;
  } else {
    for (const club of FOOTBALL_CLUBS_CREATOR) if (lower.includes(club)) return `Ого, кто-то любит ${club.toUpperCase()} 😏`;
    for (const player of FOOTBALL_PLAYERS_CREATOR) if (lower.includes(player)) return `Ага, ${player} хорош… но не лучше Роналдо 😎`;
    for (const club of FOOTBALL_CLUBS_OTHER) if (lower.includes(club)) return `Барселона? 😅 Мой создатель всё равно любит Реал Мадрид 😎`;
    for (const player of FOOTBALL_PLAYERS_OTHER) if (lower.includes(player)) return `Хм… интересный выбор, но мой создатель любит Роналдо 😏`;
  }
  return null;
}

function analyzeMessage(text: string) {
  const lower = text.toLowerCase();
  for (const r of RESPONSES) {
    for (const kw of r.keywords) if (lower.includes(kw)) return r.reply;
  }
  return `Интересно, что ты написал: "${text}". Наверное, я слишком умён, чтобы это понять 😏`;
}

function randomBotReply() {
  return BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)];
}

async function sendMessage(chatId: number, text: string, replyTo?: number) {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, reply_to_message_id: replyTo, parse_mode: "Markdown" }),
  });
}

async function deleteMessage(chatId: number, messageId: number) {
  await fetch(`${TELEGRAM_API}/deleteMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId }),
  });
}

// 🔹 Webhook
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

  // ✅ Команда /antineiroham
  if (text.startsWith("/antineiroham")) {
    const reply = randomBotReply();
    await sendMessage(chatId, reply);
    await deleteMessage(chatId, messageId); // удаляем команду
    return new Response("ok");
  }

  // ✅ Если написал бот @neirohambot → сарказм
  if (msg.from?.is_bot && username === "neirohambot") {
    const reply = randomBotReply();
    await sendMessage(chatId, reply);
    return new Response("ok");
  }

  // ✅ Ответы людям
  if (!msg.from?.is_bot) {
    let replyText: string;

    if (username === CREATOR_USERNAME) {
      const footballReply = analyzeFootballMessage(text, username);
      replyText = footballReply ? footballReply : randomCreatorReply(text);
    } else {
      const footballReply = analyzeFootballMessage(text, username);
      replyText = footballReply || analyzeMessage(text);
    }

    await sendMessage(chatId, replyText, messageId);
  }

  return new Response("ok");
});

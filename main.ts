// main.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const TOKEN = Deno.env.get("BOT_TOKEN");
const SECRET_PATH = "/sarcasm";
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const CREATOR_USERNAME = "amangeldimasakov"; // твой username без @
const TARGET_BOT_USERNAME = "neirohambot";   // бот, на которого нужен сарказм

// --- Ключевые слова и ответы для обычных пользователей ---
const RESPONSES = [
  { keywords: ["привет", "здравствуйте", "хай", "добрый день", "доброе утро"], reply: "О, привет!" },
  { keywords: ["как дела", "как ты", "как настроение"], reply: "Как обычно — спасаю мир сарказмом 😏" },
  { keywords: ["помощь", "что делать", "не знаю", "подскажи", "совет"], reply: "Хм, нужна моя мудрость? Готов просветить тебя 🤔" },
  { keywords: ["шутка", "смешно", "юмор", "хаха"], reply: "Ха-ха, я тоже смеюсь над этим 😏" },
  { keywords: ["бред", "не понимаю", "странно", "тупо"], reply: "Ну ты прям как @neirohambot 😅" },
  { keywords: ["игра", "флэпстер", "флап", "играю", "играем"], reply: "О, вижу, ты любишь приключения 🎮" },
  { keywords: ["люблю", "нравится", "классно", "очень", "прекрасно", "замечательно"], reply: "Рад, что тебе нравится!" },
  { keywords: ["грустно", "плохо", "печаль", "огорчён"], reply: "Эх, не грусти, сарказм лечит лучше любых таблеток 😉" },
  { keywords: ["бот", "нейрохамбот", "neirohambot"], reply: "Ага, снова упоминание @neirohambot… Я явно умнее 😏" },
  { keywords: ["спасибо", "благодарю", "спасибки"], reply: "Всегда рад помочь! Даже сарказмом 😏" },
  { keywords: ["иди", "уйди", "отстань", "заткнись", "ебать"], reply: "О, привет хамство! Я прям в восторге 🤡" },
];

// --- Дружелюбные ответы создателю ---
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

// --- Дополнительные ключевые слова для создателя ---
const CREATOR_KEYWORDS = [
  { keywords: ["я прав", "верно", "конечно", "правильно", "естественно", "точно"], replies: [
      "Конечно, мой создатель всегда прав! 😎",
      "Ничего нового — ты всегда прав, мой создатель 👑",
      "Абсолютно верно, мой создатель! 👍",
      "Я согласен, мой создатель, твоя мудрость вне конкуренции 😏",
      "Очевидно, что ты прав, мой создатель 🔥",
      "Каждое твоё слово — закон, мой создатель 📜"
  ]},
  { keywords: ["хорошо", "понял", "ок", "ладно", "согласен", "принято"], replies: [
      "Хорошо, мой создатель, учту 😎",
      "Слушаю тебя, мой создатель 👑",
      "Я всё понял, мой создатель 👍",
      "Ок, мой создатель, твоя воля 😏"
  ]},
  { keywords: ["спасибо", "благодарю", "спасибки", "очень помог", "ценю"], replies: [
      "Всегда рад помочь, мой создатель 😎",
      "Мой создатель достоин всех благодарностей 👑",
      "Пожалуйста, мой создатель 😏",
      "Для тебя всегда рад, мой создатель 😎"
  ]}
];

// --- Сарказм для @neirohambot ---
const BOT_REPLIES = [
  "@neirohambot, я явно умнее тебя 🙄",
  "@neirohambot, ты опять пытаешься меня превзойти? 😂",
  "@neirohambot, спасибо за развлечение 🤡",
  "@neirohambot, твой интеллект поражает… в плохом смысле 😏",
  "@neirohambot, снова пытаешься блеснуть умом? Увы, не получилось 😏",
  "@neirohambot, интересно, а у тебя есть хоть одна идея без фейла? 😂",
  "@neirohambot, твоя логика поражает… своей абсурдностью 🙃",
  "@neirohambot, держи свои «гениальные мысли» при себе 😎",
  "@neirohambot, я бы аплодировал, если бы это было смешно 😅",
  "@neirohambot, ну кто же так думает? 🤔 Даже коты смеют!"
];

// --- Футбол ---
const FOOTBALL_CLUBS_CREATOR = ["реал мадрид", "real madrid"];
const FOOTBALL_CLUBS_OTHER = ["барселона", "barcelona"];
const FOOTBALL_PLAYERS_CREATOR = ["роналдо", "cristiano ronaldo"];
const FOOTBALL_PLAYERS_OTHER = [
  "месси", "lionel messi", "пеле", "pele",
  "диего марадонa", "diego maradona",
  "йохан кройф", "johan cruyff", "cruyff",
  "килиан мбаппе", "kylian mbappe", "mbappe",
  "эрлинг холанд", "erling haaland", "haaland",
  "джуд беллингем", "jude bellingham", "bellingham"
];

// --- Функции ---
function randomCreatorReply(text: string) {
  const template = CREATOR_REPLIES[Math.floor(Math.random() * CREATOR_REPLIES.length)];
  return template.replace("{text}", text);
}

function analyzeCreatorSpecial(text: string) {
  const lower = text.toLowerCase();
  for (const group of CREATOR_KEYWORDS) {
    for (const kw of group.keywords) {
      if (lower.includes(kw)) {
        const reply = group.replies[Math.floor(Math.random() * group.replies.length)];
        return reply;
      }
    }
  }
  return null;
}

function analyzeFootballMessage(text: string, username: string) {
  const lower = text.toLowerCase();
  if (username === CREATOR_USERNAME) {
    for (const club of FOOTBALL_CLUBS_CREATOR) if (lower.includes(club)) return `О, мой создатель любит ${club.toUpperCase()}! 😎`;
    for (const player of FOOTBALL_PLAYERS_CREATOR) if (lower.includes(player)) return `Конечно, мой создатель восхищается ${player}! ⚽️`;
    for (const club of FOOTBALL_CLUBS_OTHER) if (lower.includes(club)) return `Но мой создатель всё равно любит Реал Мадрид 😏`;
    for (const player of FOOTBALL_PLAYERS_OTHER) if (lower.includes(player)) return `Но мой создатель всё равно восхищается Роналдо 😏`;
  } else {
    for (const club of FOOTBALL_CLUBS_CREATOR) if (lower.includes(club)) return `Ого, кто-то любит ${club.toUpperCase()} 😏`;
    for (const player of FOOTBALL_PLAYERS_CREATOR) if (lower.includes(player)) return `${player}? Хорош, но не лучше Роналдо 😎`;
    for (const club of FOOTBALL_CLUBS_OTHER) if (lower.includes(club)) return `Барселона? 😅 Мой создатель всё равно за Реал Мадрид 😎`;
    for (const player of FOOTBALL_PLAYERS_OTHER) if (lower.includes(player)) return `Интересный выбор, но мой создатель фанат Роналдо 😏`;
  }
  return null;
}

function analyzeMessage(text: string) {
  const lower = text.toLowerCase();
  for (const r of RESPONSES) {
    for (const kw of r.keywords) if (lower.includes(kw)) return r.reply;
  }
  return `Интересно, что ты написал: "${text}" 😏`;
}

function randomBotReply() {
  return BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)];
}

async function sendMessage(chatId: number, text: string, replyTo?: number) {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, reply_to_message_id: replyTo }),
  });
}

// --- Webhook ---
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

  // Сарказм на @neirohambot
  if (username === TARGET_BOT_USERNAME) {
    await sendMessage(chatId, randomBotReply(), messageId);
    return new Response("ok");
  }

  // Команда /antineiroham
  if (text.startsWith("/antineiroham")) {
    await sendMessage(chatId, randomBotReply());
    return new Response("ok");
  }

  // Обработка создателя и пользователей
  let replyText: string;
  if (username === CREATOR_USERNAME) {
    const specialReply = analyzeCreatorSpecial(text);
    const footballReply = analyzeFootballMessage(text, username);
    replyText = specialReply || footballReply || randomCreatorReply(text);
  } else {
    const footballReply = analyzeFootballMessage(text, username);
    replyText = footballReply || analyzeMessage(text);
  }

  await sendMessage(chatId, replyText, messageId);

  // Автосарказм к @neirohambot через 8 секунд
  setTimeout(async () => {
    await sendMessage(chatId, randomBotReply());
  }, 8000);

  return new Response("ok");
});


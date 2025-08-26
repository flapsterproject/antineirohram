// main.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const TOKEN = Deno.env.get("BOT_TOKEN");
const SECRET_PATH = "/sarcasm";
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const CREATOR_USERNAME = "amangeldimasakov"; 
const TARGET_BOT_USERNAME = "neirohambot";  

// --- Обычные ответы для пользователей ---
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
  { keywords: ["ебать", "пиздец", "черт", "блин"], reply: "Ого… кто-то ругается! 😏" }
];

// --- Супер расширенный словарь для создателя ---
const CREATOR_KEYWORDS = [
  // Приветствия
  { keywords: ["привет", "хай", "здравствуйте", "добрый день", "доброе утро", "добрый вечер", "здарова", "хаю", "йо", "салют"], replies: [
      "Привет, мой создатель! 😎 Как настроение?",
      "О, снова привет, мой создатель 👑",
      "Хай! Рад тебя видеть, мой создатель 😏",
      "Добрый день, мой создатель! Как успехи?",
      "Доброе утро, мой создатель! ☀️",
      "Добрый вечер, мой создатель! 🌙",
      "Здарова, мой создатель! 😎",
      "Йо, мой создатель! 👑",
      "Салют, мой создатель! 😏",
  ]},
  // Прощания
  { keywords: ["пока", "до свидания", "спокойной ночи", "успокойся", "до завтра", "увидимся", "счастливо", "до встречи", "прощай", "успехов"], replies: [
      "Пока, мой создатель! 😎 До новых слов!",
      "Спокойной ночи, мой создатель 🌙",
      "До завтра, мой создатель! 👑 Хорошего отдыха!",
      "Прощай на сегодня, мой создатель 😏",
      "До встречи, мой создатель! Удачи 😎",
      "Счастливо, мой создатель! 😎",
      "Увидимся, мой создатель! 👑",
      "Успехов, мой создатель! 🔥",
  ]},
  // Благодарности
  { keywords: ["спасибо", "благодарю", "спасибки", "очень помог", "ценю", "признателен", "большое спасибо", "огромное спасибо"], replies: [
      "Всегда рад помочь, мой создатель 😎",
      "Мой создатель достоин всех благодарностей 👑",
      "Пожалуйста, мой создатель 😏",
      "Для тебя всегда рад, мой создатель 😎",
      "Ценю, что сказал, мой создатель 👑",
      "Признателен, мой создатель 😎",
  ]},
  // Согласие и подтверждение
  { keywords: ["да", "верно", "конечно", "правильно", "точно", "согласен", "понял", "хорошо", "ок", "принято", "естественно", "разумеется"], replies: [
      "Конечно, мой создатель всегда прав! 😎",
      "Ничего нового — ты всегда прав, мой создатель 👑",
      "Абсолютно верно, мой создатель! 👍",
      "Я согласен, мой создатель, твоя мудрость вне конкуренции 😏",
      "Очевидно, что ты прав, мой создатель 🔥",
      "Каждое твоё слово — закон, мой создатель 📜",
      "Учту, мой создатель 😎",
  ]},
  // Настроение и эмоции
  { keywords: ["как дела", "как настроение", "что нового", "как жизнь", "как самочувствие", "устал", "рад", "грустно", "весело", "счастлив", "раздражён", "злюсь", "уставший", "доволен"], replies: [
      "Как обычно — спасаю мир сарказмом 😏",
      "Хм, интересно, что пишет мой создатель! 😎",
      "Рад слышать, мой создатель 👑",
      "Не грусти, мой создатель 😏",
      "Всё под контролем, мой создатель! 😎",
      "Усталость? Понимаю, мой создатель 😏",
      "Грустишь? Я рядом, мой создатель 👑",
      "Весело? Рад за тебя, мой создатель 😎",
      "Счастлив? Отлично, мой создатель 👑",
      "Раздражён? Спокойствие, мой создатель 😏",
  ]},
  // Похвала и восхищение
  { keywords: ["классно", "здорово", "отлично", "супер", "великолепно", "фантастика", "шикарно", "потрясающе"], replies: [
      "Я согласен, мой создатель, это действительно классно 😎",
      "Отлично сказано, мой создатель 👑",
      "Супер! Ты прав, мой создатель 😏",
      "Великолепно, мой создатель 😎",
      "Фантастика, мой создатель 👑",
      "Шикарно! Ты гений, мой создатель 😏",
      "Потрясающе! Мой создатель как всегда прав 😎",
  ]},
  // Здоровье и пожелания
  { keywords: ["спокойной ночи", "доброй ночи", "сладких снов", "хорошего дня", "удачи", "везения", "всего хорошего", "приятного дня"], replies: [
      "Спокойной ночи, мой создатель 🌙",
      "Сладких снов, мой создатель 😎",
      "Хорошего дня, мой создатель 👑",
      "Удачи, мой создатель! 😏",
      "Везения во всём, мой создатель 😎",
      "Всего хорошего, мой создатель 👑",
      "Приятного дня, мой создатель 😏",
  ]},
  // Общие вопросы и фразы
  { keywords: ["интересно", "правда", "шутка", "не знаю", "подскажи", "посоветуй", "что думаешь", "как считаешь", "помоги"], replies: [
      "Хм, любопытно, мой создатель 😎",
      "Конечно, мой создатель, я слушаю 👑",
      "Шутка? Я рад смеяться вместе с тобой, мой создатель 😏",
      "Не знаю? Давай вместе разберёмся, мой создатель 😎",
      "Слушаю твои советы, мой создатель 👑",
      "Интересно… что ты имеешь в виду, мой создатель 😏",
  ]},
  // Мягкая ругань / удивление
  { keywords: ["чёрт", "ё-моё", "блин", "ого", "вау", "не может быть", "ой"], replies: [
      "Хм, мой создатель выразился ярко 😏",
      "Ого, мой создатель 😎 Как впечатляет!",
      "Вау! Мой создатель, ты удивляешь 👑",
      "Чёрт… это интересно, мой создатель 😏",
      "Блин! Мой создатель, снова на высоте 😎",
      "Ё-моё, мой создатель, ты умеешь удивлять 👑",
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
  "@neirohambot, очередное гениальное сообщение… для кота 😅",
  "@neirohambot, твоя логика поражает… своей абсурдностью 🙃",
  "@neirohambot, держи свои «гениальные мысли» при себе 😎",
  "@neirohambot, не могу перестать удивляться твоему чувству юмора… или его отсутствию 😏",
];

// --- Футбол ---
const FOOTBALL_CLUBS_CREATOR = ["реал мадрид", "real madrid"];
const FOOTBALL_CLUBS_OTHER = ["барселона", "barcelona"];
const FOOTBALL_PLAYERS_CREATOR = ["роналдо", "cristiano ronaldo"];
const FOOTBALL_PLAYERS_OTHER = ["месси", "lionel messi","пеле", "pele","диего марадонa", "diego maradona","йохан кройф", "johan cruyff", "cruyff","килиан мбаппе", "kylian mbappe", "mbappe","эрлинг холанд", "erling haaland", "haaland","джуд беллингем", "jude bellingham", "bellingham"];

// --- Функции ---
function randomArray(arr: string[]) { return arr[Math.floor(Math.random() * arr.length)]; }

function analyzeCreatorMessage(text: string) {
  const lower = text.toLowerCase();
  for (const cat of CREATOR_KEYWORDS) {
    for (const kw of cat.keywords) if (lower.includes(kw)) return randomArray(cat.replies);
  }
  return `Я слушаю тебя, мой создатель 😎`;
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

function randomBotReply() { return randomArray(BOT_REPLIES); }

async function sendMessage(chatId: number, text: string, replyTo?: number) {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, reply_to_message_id: replyTo }),
  });
}

async function deleteMessage(chatId: number, messageId: number) {
  await fetch(`${TELEGRAM_API}/deleteMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId }),
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

  // Сарказм на @neirohambot сразу
  if (username === TARGET_BOT_USERNAME) {
    await sendMessage(chatId, randomBotReply(), messageId);
    return new Response("ok");
  }

  // Команда /antineiroham
  if (text.startsWith("/antineiroham")) {
    await sendMessage(chatId, randomBotReply());
    await deleteMessage(chatId, messageId);
    return new Response("ok");
  }

  // Ответ пользователю или создателю
  let replyText: string;
  if (username === CREATOR_USERNAME) {
    const footballReply = analyzeFootballMessage(text, username);
    replyText = footballReply ? footballReply : analyzeCreatorMessage(text);
  } else {
    const footballReply = analyzeFootballMessage(text, username);
    replyText = footballReply || analyzeMessage(text);
  }

  await sendMessage(chatId, replyText, messageId);

  // Автосарказм через 8 секунд
  setTimeout(async () => {
    await sendMessage(chatId, randomBotReply());
  }, 8000);

  return new Response("ok");
});

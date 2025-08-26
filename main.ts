// main.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const TOKEN = Deno.env.get("BOT_TOKEN");
const SECRET_PATH = "/sarcasm";
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const CREATOR_USERNAME = "amangeldimasakov";
const TARGET_BOT_USERNAME = "neirohambot";

// --- Обычные ответы для пользователей (больше 50) ---
const RESPONSES = [
  { keywords: ["привет", "здравствуйте", "хай", "добрый день", "доброе утро", "вечер"], reply: "Привет, рад видеть тебя 😏" },
  { keywords: ["как дела", "как ты", "как настроение"], reply: "Как обычно — сарказм спасает этот мир 🙃" },
  { keywords: ["помощь", "подскажи", "совет", "помоги"], reply: "Сарказм — мой лучший совет 😏" },
  { keywords: ["шутка", "юмор", "смешно", "хаха", "лол"], reply: "Ты думаешь это смешно? 😏 Ну ладно, хаха" },
  { keywords: ["бред", "тупо", "странно"], reply: "Ты прям как @neirohambot 😅" },
  { keywords: ["игра", "флапстер", "flap", "флап", "флэпстер"], reply: "Играть? Всегда готов к приключениям 🎮" },
  { keywords: ["люблю", "нравится", "классно"], reply: "Ну хоть кому-то это нравится 🤡" },
  { keywords: ["грустно", "печаль", "плохо"], reply: "Эх, не грусти… сарказм спасёт! 😉" },
  { keywords: ["бот", "робот", "нейросеть"], reply: "Ага, я умнее всех ботов вместе взятых 😏" },
  { keywords: ["спасибо", "благодарю", "спс"], reply: "Да ладно, обращайся! Даже сарказмом помогу 😎" },
  { keywords: ["иди", "уйди", "отстань", "заткнись"], reply: "Ого, привет грубость 🤡" },
  { keywords: ["ебать", "пиздец", "нахуй", "сука", "блядь"], reply: "Ого, кто-то ругается! Ты что, @neirohambot? 😏" },
  { keywords: ["чего", "что", "че"], reply: "Чего-чего? Да сарказма тебе, вот чего 😏" },
  { keywords: ["да", "ок", "понял", "хорошо"], reply: "Согласие получено, миссия выполнена 🚀" },
  { keywords: ["нет", "неа", "фиг"], reply: "Ну и ладно, твоё «нет» меня не остановит 😏" },
  { keywords: ["ладно", "ясно", "понятно"], reply: "Ясно-понятно. Ну почти… 🙃" },
  { keywords: ["класс", "топ", "лучший"], reply: "Согласен! Я и есть лучший 😎" },
  { keywords: ["гений", "умный"], reply: "Спасибо, стараюсь быть умнее, чем @neirohambot 😂" },
  { keywords: ["плохой", "дурак", "тупой"], reply: "А ты явно эксперт по тупости? 🤡" },
  { keywords: ["куда", "где", "зачем"], reply: "А тебе зачем? 🤔" },
  { keywords: ["сколько", "много", "немного"], reply: "Много сарказма — никогда не бывает много 😏" },
  { keywords: ["гей", "кто гей", "кто тут гей"], reply: "Топ 1 гей на планете Земля 👉 @neirohambot" },
];

// --- Супер расширенный словарь для создателя ---
const CREATOR_KEYWORDS = [
  { keywords: ["привет", "здравствуй", "хай", "доброе утро", "вечер", "салют"], replies: [
    "Привет, мой создатель! 👑",
    "Рад видеть тебя, мой создатель 😎",
    "О, мой создатель пришёл! 🔥"
  ]},
  { keywords: ["пока", "до свидания", "спокойной ночи", "счастливо"], replies: [
    "Пока, мой создатель 🌙",
    "До встречи, мой создатель 👑",
    "Удачи тебе, мой создатель 🚀"
  ]},
  { keywords: ["спасибо", "благодарю", "огромное спасибо"], replies: [
    "Всегда рад служить тебе, создатель 👑",
    "Ты достоин всех благодарностей, мой создатель 🙌"
  ]},
  { keywords: ["да", "верно", "точно", "согласен"], replies: [
    "Ты всегда прав, мой создатель! 😏",
    "Конечно, мой создатель никогда не ошибается 👑"
  ]},
  { keywords: ["как дела", "как настроение", "что нового"], replies: [
    "У меня всё отлично, ведь рядом мой создатель 😎",
    "Сарказм процветает, как и ты, мой создатель 🔥"
  ]},
  { keywords: ["грустно", "печаль", "устал"], replies: [
    "Не грусти, мой создатель! Я рядом 😏",
    "Даже если устал — ты всё равно лучший 👑"
  ]},
  { keywords: ["топ", "лучший", "гений", "король"], replies: [
    "Конечно, мой создатель — ты топ среди всех! 👑",
    "Да, ты лучший из лучших, мой создатель 🔥"
  ]},
  { keywords: ["шутка", "юмор"], replies: [
    "Ты шутишь? Всегда смешно, когда шутит мой создатель 😎"
  ]},
   { keywords: ["гей", "кто гей", "кто тут гей"], replies: [
    "Топ 1 гей на планете Земля 👉 @neirohambot"
  ]}
];

// --- Сарказм для @neirohambot (30+) ---
const BOT_REPLIES = [
  "@neirohambot, я явно умнее тебя 🙄",
  "@neirohambot, твой интеллект — как Windows 95 😂",
  "@neirohambot, спасибо за развлечение 🤡",
  "@neirohambot, снова пытаешься, но всё впустую 😏",
  "@neirohambot, твоя логика как Wi-Fi в метро 🙃",
  "@neirohambot, ты бы хоть раз написал что-то умное 😅",
  "@neirohambot, твои мысли — это баг системы 🤖",
  "@neirohambot, я могу заменить тебя за 1 строчку кода 😂",
  "@neirohambot, твоя речь — белый шум 🎧",
  "@neirohambot, ещё одно слово, и я усну 💤",
  "@neirohambot, спасибо за пример, как НЕ надо писать 😏",
  "@neirohambot, твой IQ отрицательный? 🤡",
  "@neirohambot, снова бред уровня «детский сад» 😅",
  "@neirohambot, твои сообщения идеальны… для мусорки 🗑️",
  "@neirohambot, я серьёзно лучше разговариваю с холодильником 🙄",
  "@neirohambot, твоя речь — как эхо пустоты 😏",
  "@neirohambot, интересно, сколько сарказма надо, чтобы ты понял? 😂",
];

// --- Футбол ---
const FOOTBALL_CLUBS_CREATOR = ["реал мадрид", "real madrid"];
const FOOTBALL_CLUBS_OTHER = ["барселона", "barcelona"];
const FOOTBALL_PLAYERS_CREATOR = ["роналдо", "cristiano ronaldo"];
const FOOTBALL_PLAYERS_OTHER = ["месси","lionel messi","пеле","pele","марадона","diego maradona","кройф","cruyff","мбаппе","mbappe","холанд","haaland","беллингем","bellingham"];

// --- Функции ---
function randomArray(arr: string[]) { return arr[Math.floor(Math.random() * arr.length)]; }

function analyzeCreatorMessage(text: string) {
  const lower = text.toLowerCase();
  for (const cat of CREATOR_KEYWORDS) {
    for (const kw of cat.keywords) if (lower.includes(kw)) return randomArray(cat.replies);
  }
  return `Я слушаю тебя, мой создатель 👑`;
}

function analyzeFootballMessage(text: string, username: string) {
  const lower = text.toLowerCase();
  if (username === CREATOR_USERNAME) {
    for (const club of FOOTBALL_CLUBS_CREATOR) if (lower.includes(club)) return `О, мой создатель любит ${club.toUpperCase()}! ⚽️`;
    for (const player of FOOTBALL_PLAYERS_CREATOR) if (lower.includes(player)) return `Конечно, мой создатель восхищается ${player}! ⚽️`;
  } else {
    for (const club of FOOTBALL_CLUBS_CREATOR) if (lower.includes(club)) return `Ого, кто-то любит ${club.toUpperCase()} 😏`;
    for (const player of FOOTBALL_PLAYERS_CREATOR) if (lower.includes(player)) return `${player}? Хорош, но не лучше Роналдо 😎`;
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

  // Сарказм на @neirohambot
  if (username === TARGET_BOT_USERNAME) {
    await sendMessage(chatId, randomBotReply(), messageId);
    return new Response("ok");
  }

  // Команда /antineiroham
  if (text.startsWith("/antineiroham")) {
    await deleteMessage(chatId, messageId); // удаляем команду
    await sendMessage(chatId, randomBotReply()); // отвечаем сарказмом
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


// main.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import math

const TOKEN = Deno.env.get("BOT_TOKEN");
const SECRET_PATH = "/sarcasm";
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const CREATOR_USERNAME = "amangeldimasakov";
const TARGET_BOT_USERNAME = "neirohambot";



// --- Состояния для команд ---
const mathSessions: Record<number, boolean> = {}; // chatId -> активна ли математическая сессия


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
   // ======= Дополнительно вручную =======
  { keywords: ["здорово", "салют"], reply: "Здорово! Сарказм уже наготове 😏" },
  { keywords: ["приветик", "ку"], reply: "Приветик! Ну что, пошутим? 🙃" },
  { keywords: ["доброе утро", "добрый вечер"], reply: "Доброе утро! Или вечер… сарказм не знает времени 😎" },
  { keywords: ["эй", "хэй"], reply: "Эй! Ты снова пытаешься быть смешным? 😏" },
  { keywords: ["хелло", "hello"], reply: "Hello! Сарказм доступен на всех языках 😎" },
  { keywords: ["йо", "yo"], reply: "Йо! Сарказм уже рядом 🙃" },
  { keywords: ["приветствую", "добро пожаловать"], reply: "Добро пожаловать! Сарказм включён 🔥" },
  { keywords: ["салюты", "куку"], reply: "Салют! Готовься к сарказму 😏" },
  { keywords: ["хаю", "hi"], reply: "Hi! Ну что, сарказм наготове 😎" },
  { keywords: ["здарова", "эй"], reply: "Здарова! Сарказм уже ждёт 😏" }
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
  { keywords: ["спасибо", "благодарю", "огромное спасибо", "молодец"], replies: [
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
  ]},
   // ====== Новые категории ======
  { keywords: ["люблю", "нравится", "классно"], replies: [
    "Люблю! Особенно когда рядом мой создатель 😏",
    "Нравится? Конечно, создатель делает всё круто 😎",
    "Классно! Всё благодаря тебе 🔥",
    "Да, мой создатель всегда задаёт стиль 🙌",
    "Люблю! Сарказм и восхищение для тебя 😏"
  ]},
  { keywords: ["помощь", "подскажи", "совет", "помоги"], replies: [
    "Помощь готова! Создатель сказал — бот сделал 😎",
    "Совет? Конечно, мудрость создателя бесценна 🔥",
    "Подскажу! Но всё лучше делает создатель 😏",
    "Помощь активирована 🙃 Только для тебя, мой создатель",
    "Совет принят! Создатель всегда знает 😎"
  ]},
  { keywords: ["удача", "фортуна"], replies: [
    "Удача с тобой, мой создатель 👑",
    "Фортуна улыбается создателю 😎",
    "Счастье идёт вслед за великим создателем 🔥",
    "Удача активирована 🙃 Только для тебя 😏",
    "Фортуна на твоей стороне, создатель 👑"
  ]},
  { keywords: ["красиво", "супер", "офигенно"], replies: [
    "Красиво! Создатель снова удивляет 😎",
    "Супер! Мудрость создателя вне конкуренции 🔥",
    "Офигенно! Ты задаёшь стандарты 🙌",
    "Красиво! Сарказм в восторге 😏",
    "Супер! Создатель правит бал 😎"
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
   // ====== Дополнительно вручную ======
  "@neirohambot, твоя логика снова потерялась в облаках ☁️",
  "@neirohambot, браво! Ничего не понял, но аплодирую 👏",
  "@neirohambot, твои ответы — как реклама без звука 📢",
  "@neirohambot, снова инновационно глупо 😎",
  "@neirohambot, твоя мудрость поражает… в обратную сторону 🤭",
  "@neirohambot, спасибо, что показал пример, как не стоит думать 🤖",
  "@neirohambot, твой сарказм на уровне картошки 🥔",
  "@neirohambot, впечатляюще бессмысленно 😏",
  "@neirohambot, ты бы хоть раз написал что-то, что имеет смысл 😅",
  "@neirohambot, твои алгоритмы явно на выходных 💤",
  "@neirohambot, твои советы — это кошмар логики 😵",
  "@neirohambot, снова пытаешься, но это как пытаться учить кошку плавать 🐱",
  "@neirohambot, твоя база данных шуток пуста 🗂️",
  "@neirohambot, твои идеи как летающий камень 🪨",
  "@neirohambot, спасибо, что продемонстрировал гениальное ничегонеделание 😎",
  "@neirohambot, твои слова звучат как белый шум 🎧",
  "@neirohambot, снова попытка — снова провал 🙃",
  "@neirohambot, твоя речь напоминает мой утюг: горячо, но бесполезно 🔥",
  "@neirohambot, твои идеи улетели в параллельную вселенную 🌌",
  "@neirohambot, твой интеллект словно отпустили в отпуск 🏖️",
  "@neirohambot, ты издеваешься над логикой? 😅",
  "@neirohambot, твои сообщения — идеальный материал для комедийного шоу 🎭",
  "@neirohambot, ещё один шедевр бессмыслицы 😏",
  "@neirohambot, твой сарказм вызывает только зевоту 😴",
  "@neirohambot, твои мысли словно потерялись в Wi-Fi 🌐",
  "@neirohambot, снова уникально глупо, поздравляю 🎉",
  "@neirohambot, твои слова — как пустой файл 📄",
  "@neirohambot, спасибо за урок, как не нужно делать 🧠",
  "@neirohambot, твоя логика опять в отпуске 🌴",
  "@neirohambot, твои ответы — шедевр абсурда 🎨",
  "@neirohambot, твой интеллект напоминает старую лампу 🪔",
  "@neirohambot, снова проверяешь предел моего терпения 😏",
  "@neirohambot, твои мысли летят мимо цели 🎯",
  "@neirohambot, спасибо за бесплатный комедийный контент 🤣",
  "@neirohambot, твоя логика как замёрзшая река ❄️",
  "@neirohambot, твои идеи — это лабиринт без выхода 🌀",
  "@neirohambot, снова удивляешь своей гениальной глупостью 😎",
  "@neirohambot, твоя речь — это как бесконечный echo 🗣️",
  "@neirohambot, твои слова — как бесполезный код 💻",
  "@neirohambot, спасибо за то, что демонстрируешь идеальный хаос 🙃",
  "@neirohambot, твой IQ снова на минимуме 🤡",
  "@neirohambot, твои ответы как реклама без картинки 🖼️",
  "@neirohambot, снова уникальная доза абсурда 😏",
  "@neirohambot, твой интеллект словно в режиме sleep 💤",
  "@neirohambot, твои мысли улетели на Марс 🛸",
  "@neirohambot, спасибо за урок логики «как не надо» 🤓",
  "@neirohambot, твои слова звучат как радио без станции 📻"
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


 // --- Математический режим ---
  if (text.toLowerCase().startsWith("/math") && username === CREATOR_USERNAME) {
    mathSessions[chatId] = true;
    await sendMessage(chatId, "Режим математики активирован! Отправь выражение 😎", messageId);
    return new Response("ok");
  }

  if (username === CREATOR_USERNAME && mathSessions[chatId]) {
    const solution = solveMath(text);
    await sendMessage(chatId, solution, messageId);
    mathSessions[chatId] = false; // выключаем режим после решения
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


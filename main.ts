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
  { keywords: ["привет","хай","здравствуйте","добрый день","доброе утро","добрый вечер","здарова","хаю","йо","салют"], 
    replies: ["Привет, мой создатель! 😎 Как настроение?", "Хай! Рад тебя видеть, мой создатель 😏"] },
  { keywords: ["пока","до свидания","спокойной ночи","успокойся","до завтра","увидимся","счастливо","до встречи","прощай","успехов"], 
    replies: ["Пока, мой создатель! 😎 До новых слов!", "Спокойной ночи, мой создатель 🌙"] },
  { keywords: ["спасибо","благодарю","спасибки","очень помог","ценю","признателен","большое спасибо","огромное спасибо"], 
    replies: ["Всегда рад помочь, мой создатель 😎","Мой создатель достоин всех благодарностей 👑"] },
  { keywords: ["да","верно","конечно","правильно","точно","согласен","понял","хорошо","ок","принято","естественно","разумеется"], 
    replies: ["Конечно, мой создатель всегда прав! 😎","Абсолютно верно, мой создатель! 👍"] },
  { keywords: ["как дела","как настроение","что нового","как жизнь","как самочувствие","устал","рад","грустно","весело","счастлив","раздражён","злюсь","уставший","доволен"], 
    replies: ["Как обычно — спасаю мир сарказмом 😏","Рад слышать, мой создатель 👑","Не грусти, мой создатель 😏"] },
  { keywords: ["классно","здорово","отлично","супер","великолепно","фантастика","шикарно","потрясающе"], 
    replies: ["Я согласен, мой создатель, это действительно классно 😎","Супер! Ты прав, мой создатель 😏"] },
  { keywords: ["спокойной ночи","доброй ночи","сладких снов","хорошего дня","удачи","везения","всего хорошего","приятного дня"], 
    replies: ["Спокойной ночи, мой создатель 🌙","Хорошего дня, мой создатель 👑"] },
  { keywords: ["интересно","правда","шутка","не знаю","подскажи","посоветуй","что думаешь","как считаешь","помоги"], 
    replies: ["Хм, любопытно, мой создатель 😎","Конечно, мой создатель, я слушаю 👑"] },
  { keywords: ["чёрт","ё-моё","блин","ого","вау","не может быть","ой"], 
    replies: ["Хм, мой создатель выразился ярко 😏","Вау! Мой создатель, ты удивляешь 👑"] }
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
  "@neirohambot, очередной шедевр… для мусорного ведра 🗑️",
  "@neirohambot, спасибо за пример, как не надо делать 😅",
  "@neirohambot, твои слова – как эхо пустоты 🙃",
  "@neirohambot, могу похвалить твою способность удивлять меня… разочарованием? 😏",
  "@neirohambot, твой интеллект как Wi-Fi без пароля — бесполезен 🙄",
  "@neirohambot, твой креатив как холодная каша 🥴",
  "@neirohambot, я бы аплодировал, но это слишком трагично 👏",
  "@neirohambot, твои мысли звучат как трещина в стакане 🥲",
  "@neirohambot, очередной «гений» на минимальной мощности 😅",
  "@neirohambot, твой сарказм – как песок в ботинке 😏",
  "@neirohambot, твоя логика напоминает лабиринт без выхода 🙃",
  "@neirohambot, если бы мысли были деньгами, ты бы остался ни с чем 💸",
  "@neirohambot, твоя аргументация сильна, как мокрый лист 🌿",
  "@neirohambot, снова доказываешь, что коты умнее людей 😼",
  "@neirohambot, твои слова как дождь в пустыне — бесполезны 🌵",
  "@neirohambot, твои идеи сияют… только в темноте 🤷‍♂️",
  "@neirohambot, снова потрясаешь своей посредственностью 😏",
  "@neirohambot, твой интеллект на уровне калькулятора для детей 🧮",
  "@neirohambot, удивительно, как ты умудряешься быть скучным одновременно 😂",
  "@neirohambot, твоя оригинальность как копипаста 📋",
  "@neirohambot, снова пример, как не надо думать 😅",
  "@neirohambot, твои советы ценны… для переполненного мусорного ведра 🗑️",
  "@neirohambot, твой креатив поражает… своей пустотой 😎",
  "@neirohambot, твоя логика как шахматная партия без фигур ♟️",
  "@neirohambot, спасибо за шоу, мой любимый провал 😂",
  "@neirohambot, твои мысли как вечный спам в голове 🌀",
  "@neirohambot, снова доказываешь мастерство в провалах 😏",
  "@neirohambot, твоя мудрость впечатляет… только кошек 😼",
  "@neirohambot, твой интеллект как тормозная педаль без тормозов 🛑",
  "@neirohambot, снова удивляешь своей невероятной посредственностью 😅",
  "@neirohambot, твои советы как прохладный ветер в пустой комнате 🌬️",
  "@neirohambot, твои идеи достойны… смеха 😂",
  "@neirohambot, твоя логика как мост из желе 🌉",
  "@neirohambot, снова пример «как не надо думать» 😏",
  "@neirohambot, твои слова напоминают старый телефонный звонок 📞",
  "@neirohambot, твоя креативность как разлитое молоко 🥛",
  "@neirohambot, снова радуешь своей абсурдностью 🙃",
  "@neirohambot, твой сарказм словно дождь из песка 🌧️",
  "@neirohambot, твои мысли как утренняя лужа 🪞",
  "@neirohambot, снова поражаешь… в плохом смысле 😅",
  "@neirohambot, твоя логика как заблудившийся GPS 🗺️",
  "@neirohambot, твоя гениальность на минимуме 😏",
  "@neirohambot, снова радуешь своими ошибками 😂",
  "@neirohambot, твой интеллект как пустая батарейка 🔋",
  "@neirohambot, твои советы полезны… только для смеха 😎",
  "@neirohambot, твоя логика как бумажный кораблик в океане ⛴️",
  "@neirohambot, снова поражаешь своей посредственностью 🙃",
  "@neirohambot, твои идеи как старый чай ☕",
  "@neirohambot, снова доказываешь уровень «провал года» 😏",
  "@neirohambot, твой сарказм впечатляет… только котов 😼",
  "@neirohambot, твоя логика как песочные часы без песка ⏳",
  "@neirohambot, снова пример для подражания… но в худшем смысле 😅"
];


// --- Футбол ---
const FOOTBALL_CLUBS_CREATOR = ["реал мадрид", "real madrid"];
const FOOTBALL_CLUBS_OTHER = ["барселона", "barcelona"];
const FOOTBALL_PLAYERS_CREATOR = ["роналдо", "cristiano ronaldo"];
const FOOTBALL_PLAYERS_OTHER = ["месси","lionel messi","пеле","pele","диего марадонa","diego maradona","йохан кройф","johan cruyff","cruyff","килиан мбаппе","kylian mbappe","mbappe","эрлинг холанд","erling haaland","haaland","джуд беллингем","jude bellingham","bellingham"];

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

  // Автосарказм через 8 секунд для всех
  setTimeout(async () => {
    await sendMessage(chatId, randomBotReply());
  }, 8000);

  return new Response("ok");
});

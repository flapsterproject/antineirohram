// main.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const TOKEN = Deno.env.get("BOT_TOKEN");
const SECRET_PATH = "/sarcasm";
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const CREATOR_USERNAME = "amangeldimasakov";
const TARGET_BOT_USERNAME = "neirohambot";

// ⚡️ API DeepSeek (нужен ключ)
const DEEPSEEK_API_KEY = "sk-7469b5c2f36c454fbe32173f08dff53f";
const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";

// --- твои словари (RESPONSES, CREATOR_KEYWORDS, BOT_REPLIES и т.п. остаются как есть) ---
// ...

// --- Утилиты ---
function randomArray(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// DeepSeek запрос
async function generateSarcasmWithAI(prompt: string): Promise<string> {
  try {
    const res = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat", // укажи модель
        messages: [
          { role: "system", content: "Ты отвечаешь исключительно саркастично, иногда с юмором." },
          { role: "user", content: prompt },
        ],
        max_tokens: 100,
      }),
    });

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || "Сарказм потерялся 🙃";
  } catch (e) {
    console.error("DeepSeek error:", e);
    return "У меня сарказм сломался 🤖";
  }
}

async function sendMessage(chatId: number, text: string, replyTo?: number) {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      reply_to_message_id: replyTo,
    }),
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
    await sendMessage(chatId, randomArray(BOT_REPLIES), messageId);
    return new Response("ok");
  }

  // Команда /antineiroham
  if (text.startsWith("/antineiroham")) {
    await sendMessage(chatId, randomArray(BOT_REPLIES));
    return new Response("ok");
  }

  // --- Логика выбора ответа ---
  let replyText: string | null = null;

  if (username === CREATOR_USERNAME) {
    const footballReply = analyzeFootballMessage(text, username);
    replyText = footballReply ? footballReply : analyzeCreatorMessage(text);
  } else {
    const footballReply = analyzeFootballMessage(text, username);
    replyText = footballReply || analyzeMessage(text);
  }

  // Если ничего не найдено → DeepSeek
  if (!replyText || replyText.includes("Интересно, что ты написал")) {
    replyText = await generateSarcasmWithAI(text);
  }

  await sendMessage(chatId, replyText, messageId);

  // Автосарказм через 8 секунд
  setTimeout(async () => {
    await sendMessage(chatId, randomArray(BOT_REPLIES));
  }, 8000);

  return new Response("ok");
});

// main.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai@^0.19.0";

// Telegram setup
const TOKEN = Deno.env.get("BOT_TOKEN");
const API = `https://api.telegram.org/bot${TOKEN}`;
const SECRET_PATH = "/masakoff";

// Gemini setup
const GEMINI_API_KEY = "AIzaSyC2tKj3t5oTsrr_a0B1mDxtJcdyeq5uL0U";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// -------------------- Telegram Helpers --------------------
async function sendMessage(chatId: string | number, text: string, replyTo?: number) {
  await fetch(`${API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      reply_to_message_id: replyTo,
      allow_sending_without_reply: true,
    }),
  });
}

// -------------------- Gemini Response Generator --------------------
async function generateResponse(prompt: string): Promise<string> {
  try {
    const fullPrompt = `Respond as a witty, realistic human — use sarcasm, keep it short (1–2 sentences), add emojis, and write naturally in Russian, as if chatting with a friend online: ${prompt}`;
    const result = await model.generateContent(fullPrompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini error:", error);
    return "Ой, что-то пошло не так 😅";
  }
}

// -------------------- HTTP Handler --------------------
serve(async (req) => {
  try {
    const update = await req.json();

    if (!update.message) return new Response("ok");

    const msg = update.message;
    const chatId = msg.chat.id;
    const text = msg.text;
    const messageId = msg.message_id;

    // Ignore messages from bots, channels, or service messages
    if (!text || msg.from?.is_bot || msg.chat.type === "channel") {
      return new Response("ok");
    }

    // In group chats, only respond if bot was mentioned
    if (msg.chat.type === "group" || msg.chat.type === "supergroup") {
      const botMentioned = text.includes("@") && text.includes("bot");
      if (!botMentioned) return new Response("ok");
    }

    // Generate and reply
    const reply = await generateResponse(text);
    await sendMessage(chatId, reply, messageId);

  } catch (err) {
    console.error("Error handling update:", err);
  }

  return new Response("ok");
});


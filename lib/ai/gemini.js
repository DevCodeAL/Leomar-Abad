/**
 * Gemini client.
 *
 * Two distinct calls, deliberately not combined: search grounding and strict
 * JSON schema output do not reliably coexist in one request, so research runs
 * grounded and free-form, then writing runs schema-constrained against those
 * notes. It also means the sources on a post are ones search actually
 * returned, rather than URLs the model produced while writing.
 */

import { GoogleGenAI } from "@google/genai";

export class GeminiError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = "GeminiError";
    this.cause = cause;
  }
}

export const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

/** The assistant answers short questions, so it gets its own (cheaper) default. */
export const CHAT_MODEL = process.env.GEMINI_CHAT_MODEL || DEFAULT_MODEL;

function client() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new GeminiError("GEMINI_API_KEY is not set");
  return new GoogleGenAI({ apiKey });
}

/**
 * Grounded research call. Returns the model's notes plus the URLs search
 * actually surfaced.
 * @param {string} prompt
 * @param {{ model?: string }} [options]
 */
export async function researchWithSearch(prompt, { model = DEFAULT_MODEL } = {}) {
  let response;

  try {
    response = await client().models.generateContent({
      model,
      contents: prompt,
      config: { tools: [{ googleSearch: {} }], temperature: 0.4 },
    });
  } catch (error) {
    throw new GeminiError(`Research call failed: ${error.message}`, error);
  }

  const notes = response?.text?.trim() ?? "";

  const grounding = response?.candidates?.[0]?.groundingMetadata;
  const chunks = grounding?.groundingChunks ?? [];
  const sources = [
    ...new Set(
      chunks
        .map((chunk) => chunk?.web?.uri)
        .filter((uri) => typeof uri === "string" && uri.startsWith("https://")),
    ),
  ];

  return { notes, sources, grounded: sources.length > 0 };
}

/**
 * Schema-constrained generation. Returns parsed JSON.
 * @param {string} prompt
 * @param {object} schema
 * @param {{ model?: string, temperature?: number }} [options]
 */
export async function generateStructured(
  prompt,
  schema,
  { model = DEFAULT_MODEL, temperature = 0.85 } = {},
) {
  let response;

  try {
    response = await client().models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature,
      },
    });
  } catch (error) {
    throw new GeminiError(`Generation call failed: ${error.message}`, error);
  }

  const text = response?.text?.trim();
  if (!text) throw new GeminiError("Model returned an empty response");

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new GeminiError(
      `Model returned invalid JSON: ${text.slice(0, 160)}`,
      error,
    );
  }
}

/** True when a key is configured. Lets callers pick a fallback without throwing. */
export function isConfigured() {
  return Boolean(process.env.GEMINI_API_KEY);
}

/**
 * Streaming chat turn for the portfolio assistant.
 *
 * Separate from the two calls above because it wants the opposite trade: no
 * grounding, no schema, and tokens delivered as they arrive so the chat panel
 * can type them out. The system instruction is passed as config rather than as
 * a leading turn — the API keeps it out of the conversation, which is one less
 * place a visitor can talk over it.
 *
 * @param {{ role: "user"|"assistant", content: string }[]} history
 * @param {string} message
 * @param {{ systemInstruction: string, model?: string, maxOutputTokens?: number, signal?: AbortSignal }} options
 * @returns {AsyncIterable<string>} text deltas
 */
export async function* streamChat(
  history,
  message,
  { systemInstruction, model = CHAT_MODEL, maxOutputTokens = 700, signal } = {},
) {
  const contents = [
    ...history.map((turn) => ({
      role: turn.role === "assistant" ? "model" : "user",
      parts: [{ text: turn.content }],
    })),
    { role: "user", parts: [{ text: message }] },
  ];

  let stream;

  try {
    stream = await client().models.generateContentStream({
      model,
      contents,
      config: {
        systemInstruction,
        temperature: 0.6,
        topP: 0.95,
        maxOutputTokens,
        /* Thinking off. These are two-sentence answers from a knowledge block
           that is already in the prompt — there is nothing to reason about,
           and on a 2.5 model the thinking pass would both add a second of
           latency before the first token and eat into maxOutputTokens, which
           can leave the reply empty. Keep GEMINI_CHAT_MODEL on a flash-class
           model: 2.5-pro rejects a zero budget. */
        thinkingConfig: { thinkingBudget: 0 },
        ...(signal ? { abortSignal: signal } : null),
      },
    });
  } catch (error) {
    throw new GeminiError(`Chat call failed: ${error.message}`, error);
  }

  for await (const chunk of stream) {
    const text = chunk?.text;
    if (text) yield text;
  }
}

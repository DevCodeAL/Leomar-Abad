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

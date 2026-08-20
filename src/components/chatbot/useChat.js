import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { detectIntent } from "../../../lib/chat/fallback.js";
import { LIMITS } from "../../../lib/chat/validate.js";
import { OPENING_SUGGESTIONS, suggestionsFor } from "../../../lib/chat/suggestions.js";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { streamAssistantReply } from "./transport";

const STORAGE_KEY = "portfolio-chat";
/** Kept short: this is a conversation, not an archive, and it rides in a tab. */
const STORED_MESSAGES = 24;

let nextId = 0;
const makeId = () => {
  nextId += 1;
  return `m${nextId}`;
};

function loadStored() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (entry) =>
          entry &&
          (entry.role === "user" || entry.role === "assistant") &&
          typeof entry.content === "string",
      )
      .slice(-STORED_MESSAGES)
      .map((entry) => ({
        id: makeId(),
        role: entry.role,
        content: entry.content,
      }));
  } catch {
    return [];
  }
}

/**
 * Conversation state for the assistant.
 *
 * Deltas are buffered and flushed on an animation frame rather than setting
 * state per chunk — the fallback types three characters every 12ms, which is
 * ~80 renders a second of an ever-growing markdown tree if you let it through.
 */
export function useChat() {
  const prefersReduced = useReducedMotion();
  const [messages, setMessages] = useState(loadStored);
  const [status, setStatus] = useState("idle"); // idle | streaming | error
  const [engine, setEngine] = useState(null); // model | fallback | offline
  const [error, setError] = useState(null);

  const abortRef = useRef(null);
  const bufferRef = useRef("");
  const frameRef = useRef(0);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          messages
            .filter((message) => message.content && !message.failed)
            .slice(-STORED_MESSAGES)
            .map(({ role, content }) => ({ role, content })),
        ),
      );
    } catch {
      // Private mode or a full quota. The conversation still works in memory.
    }
  }, [messages]);

  useEffect(
    () => () => {
      abortRef.current?.abort();
      cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  const run = useCallback(
    async (question, history) => {
      const controller = new AbortController();
      abortRef.current = controller;

      const replyId = makeId();

      setError(null);
      setEngine(null);
      setStatus("streaming");
      setMessages((current) => [
        ...current,
        { id: replyId, role: "assistant", content: "", streaming: true },
      ]);

      bufferRef.current = "";

      const flush = () => {
        frameRef.current = 0;
        const pending = bufferRef.current;
        if (!pending) return;
        bufferRef.current = "";

        setMessages((current) =>
          current.map((message) =>
            message.id === replyId
              ? { ...message, content: message.content + pending }
              : message,
          ),
        );
      };

      const schedule = () => {
        if (frameRef.current) return;
        frameRef.current = requestAnimationFrame(flush);
      };

      let failure = null;

      try {
        const events = streamAssistantReply({
          message: question,
          history,
          signal: controller.signal,
          instant: prefersReduced,
        });

        for await (const event of events) {
          if (event.type === "meta") setEngine(event.mode);
          else if (event.type === "delta") {
            bufferRef.current += event.text;
            schedule();
          } else if (event.type === "error") failure = event;
        }
      } catch {
        failure = { message: "Something went wrong while processing that. Please try again." };
      }

      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
      flush();

      if (controller.signal.aborted) return;

      abortRef.current = null;

      setMessages((current) =>
        current.map((message) =>
          message.id === replyId
            ? {
                ...message,
                streaming: false,
                failed: Boolean(failure) && !message.content,
              }
            : message,
        ),
      );

      if (failure) {
        setError(failure.message);
        setStatus("error");
        return;
      }

      setStatus("idle");
    },
    [prefersReduced],
  );

  const send = useCallback(
    (raw) => {
      const question = String(raw ?? "").trim().slice(0, LIMITS.messageChars);
      if (!question || status === "streaming") return;

      const history = messages
        .filter((message) => message.content && !message.failed)
        .map(({ role, content }) => ({ role, content }));

      setMessages((current) => [
        ...current,
        { id: makeId(), role: "user", content: question },
      ]);

      run(question, history);
    },
    [messages, run, status],
  );

  /** Re-ask the last question, discarding whatever came back the first time. */
  const retry = useCallback(() => {
    if (status === "streaming") return;

    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;

    const upToQuestion = messages.slice(0, messages.lastIndexOf(lastUser) + 1);
    setMessages(upToQuestion);

    run(
      lastUser.content,
      upToQuestion
        .slice(0, -1)
        .filter((message) => message.content && !message.failed)
        .map(({ role, content }) => ({ role, content })),
    );
  }, [messages, run, status]);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setMessages([]);
    setStatus("idle");
    setEngine(null);
    setError(null);
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;

    setMessages((current) =>
      current
        .map((message) => ({ ...message, streaming: false }))
        .filter((message) => message.role !== "assistant" || message.content),
    );
    setStatus("idle");
  }, []);

  /** Chips follow the last thing that was asked, minus anything already asked. */
  const suggestions = useMemo(() => {
    const userMessages = messages.filter((message) => message.role === "user");
    if (!userMessages.length) return OPENING_SUGGESTIONS;

    const asked = new Set(
      userMessages.map((message) => message.content.toLowerCase()),
    );
    const last = userMessages[userMessages.length - 1].content;

    return suggestionsFor(detectIntent(last), asked);
  }, [messages]);

  return {
    messages,
    status,
    engine,
    error,
    suggestions,
    send,
    retry,
    clear,
    stop,
    isEmpty: messages.length === 0,
  };
}

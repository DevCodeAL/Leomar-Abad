import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowDown, ChevronDown, Minus, RotateCcw, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusDot } from "@/components/ui/StatusDot";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { parseActions } from "../../../lib/chat/actions.js";
import { WELCOME_MESSAGE } from "../../../lib/chat/system-prompt.js";
import { useChat } from "./useChat";
import { ChatMessage } from "./ChatMessage";
import { ChatComposer } from "./ChatComposer";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { TypingIndicator } from "./TypingIndicator";

/** Below this the panel becomes a sheet: modal, scroll-locked, focus-trapped. */
const SHEET_QUERY = "(max-width: 639px)";

function useIsSheet() {
  const [isSheet, setIsSheet] = useState(
    () => typeof window !== "undefined" && window.matchMedia(SHEET_QUERY).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(SHEET_QUERY);
    const onChange = (event) => setIsSheet(event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return isSheet;
}

/**
 * The chat window.
 *
 * Two modes, one component. On a phone it is a near-fullscreen sheet and
 * behaves like a dialog — scroll locked behind it, focus trapped inside it. On
 * a desktop it is a docked panel and deliberately *not* modal: the portfolio
 * stays scrollable and clickable behind it, which is the whole point of an
 * assistant that sends you off to look at a project.
 *
 * Lazy-loaded — see ./Chatbot.jsx. Nothing in this file, its markdown renderer
 * or its transport is fetched until someone opens the assistant.
 */
export function ChatPanel({ id, onClose, onMinimize, minimized }) {
  const isSheet = useIsSheet();
  const {
    messages,
    status,
    engine,
    error,
    suggestions,
    send,
    retry,
    clear,
    stop,
    isEmpty,
  } = useChat();

  const panelRef = useRef(null);
  const composerRef = useRef(null);
  const logRef = useRef(null);
  const contentRef = useRef(null);
  const pinnedRef = useRef(true);
  const [showJump, setShowJump] = useState(false);

  const collapsed = minimized && !isSheet;
  const streaming = status === "streaming";
  const waiting =
    streaming && messages[messages.length - 1]?.content === "";

  useLockBodyScroll(isSheet && !minimized);

  /* Focus the composer on open. The panel only mounts while open, so mounting
     is the signal; focus is handed back to the launcher by <Chatbot/> on close. */
  useEffect(() => {
    if (collapsed) return undefined;

    const frame = requestAnimationFrame(() => composerRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [collapsed]);

  /* Escape closes from anywhere inside; Tab is trapped only in sheet mode,
     because the desktop panel is not modal and must not capture the page. */
  const onKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !isSheet || minimized) return;

      const focusable = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [isSheet, minimized, onClose],
  );

  /* Stay pinned to the newest message unless the visitor has scrolled up to
     re-read something — then hold position and offer a way back down. */
  const onScroll = useCallback(() => {
    const node = logRef.current;
    if (!node) return;

    const distance = node.scrollHeight - node.scrollTop - node.clientHeight;
    pinnedRef.current = distance < 72;
    setShowJump(!pinnedRef.current);
  }, []);

  useLayoutEffect(() => {
    const node = logRef.current;
    if (!node || !pinnedRef.current) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, suggestions, waiting]);

  /* A project card's image finishes loading after the message that contains it
     has rendered, which grows the log with no state change to react to. Without
     this the view silently drifts off the bottom and the "Latest" pill appears
     on a conversation nobody scrolled. */
  useEffect(() => {
    const node = logRef.current;
    if (!node || typeof ResizeObserver === "undefined") return undefined;

    const observer = new ResizeObserver(() => {
      if (pinnedRef.current) node.scrollTop = node.scrollHeight;
    });

    const content = contentRef.current;
    if (!content) return undefined;

    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  const jumpToLatest = () => {
    const node = logRef.current;
    if (!node) return;
    pinnedRef.current = true;
    setShowJump(false);
    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  };

  /* Announce a turn once it has finished, not while it is arriving. */
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    if (waiting) {
      setAnnouncement("Assistant is replying");
      return;
    }
    if (status !== "idle") return;

    const last = messages[messages.length - 1];
    if (last?.role === "assistant" && last.content) {
      setAnnouncement(parseActions(last.content).text);
    }
  }, [messages, status, waiting]);

  const onAsk = (question) => {
    pinnedRef.current = true;
    setShowJump(false);
    send(question);
  };

  return (
    <div
      id={id}
      ref={panelRef}
      role="dialog"
      aria-modal={isSheet && !minimized}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-subtitle`}
      onKeyDown={onKeyDown}
      className={cn(
        "fixed z-[45] flex animate-panel-in flex-col overflow-hidden",
        "rounded-2xl border border-line bg-surface shadow-lift sm:rounded-3xl",
        "origin-bottom-right",
        // Sheet
        "inset-x-2 top-[4.25rem] bottom-2",
        minimized && "top-auto",
        // Docked panel
        "sm:inset-x-auto sm:bottom-24 sm:right-6 sm:top-auto sm:w-[25rem]",
        collapsed ? "sm:h-auto" : "sm:h-[min(34rem,calc(100vh-10rem))]",
      )}
    >
      <Header
        id={id}
        engine={engine}
        collapsed={collapsed || (minimized && isSheet)}
        canClear={!isEmpty}
        onClear={clear}
        onMinimize={onMinimize}
        onClose={onClose}
      />

      {/* The transcript itself is not a live region: streaming would announce
          every token. Whole turns are announced here instead. */}
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      {minimized ? null : (
        <>
          <div
            ref={logRef}
            onScroll={onScroll}
            role="log"
            aria-label="Conversation with Leomar's AI assistant"
            className="relative flex-1 overflow-y-auto overscroll-contain px-3.5 py-4"
          >
            {/* One wrapper so the ResizeObserver above has a single element
                whose height tracks the whole transcript. */}
            <div ref={contentRef} className="space-y-4">
              {isEmpty ? (
                <Welcome
                  onSelect={onAsk}
                  suggestions={suggestions}
                  disabled={streaming}
                />
              ) : (
                <>
                  {messages.map((message, index) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      isLast={index === messages.length - 1}
                      onRetry={retry}
                      onNavigate={isSheet ? onClose : undefined}
                    />
                  ))}

                  {waiting ? <TypingIndicator /> : null}

                  {!streaming && suggestions.length ? (
                    <SuggestedQuestions
                      suggestions={suggestions}
                      onSelect={onAsk}
                      disabled={streaming}
                    />
                  ) : null}
                </>
              )}
            </div>
          </div>

          {error ? <ErrorBar message={error} onRetry={retry} /> : null}

          {showJump ? (
            <button
              type="button"
              onClick={jumpToLatest}
              className={cn(
                "absolute bottom-[6.5rem] left-1/2 flex -translate-x-1/2 items-center gap-1.5",
                "rounded-full border border-line-strong bg-elevated px-3 py-1.5",
                "text-[0.6875rem] font-semibold text-ink-muted shadow-lift",
                "transition-colors duration-200 hover:border-primary hover:text-primary",
              )}
            >
              <ArrowDown className="h-3 w-3" aria-hidden="true" />
              Latest
            </button>
          ) : null}

          <ChatComposer
            ref={composerRef}
            onSend={onAsk}
            onStop={stop}
            streaming={streaming}
          />
        </>
      )}
    </div>
  );
}

/* ── Header ─────────────────────────────────────────────────────────────── */

function Header({ id, engine, collapsed, canClear, onClear, onMinimize, onClose }) {
  return (
    <header className="relative shrink-0 overflow-hidden border-b border-line bg-elevated/70 backdrop-blur-xl">
      {/* Same hairline grid and palette wash the dashboard panels use, so the
          assistant reads as part of the site rather than an embedded widget. */}
      <span
        aria-hidden="true"
        className="grid-lines pointer-events-none absolute inset-0 opacity-[0.35]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-primary/20 blur-3xl"
      />

      <div className="relative flex items-start gap-3 px-3.5 py-3">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary shadow-glow-sm"
        >
          <Sparkles className="h-4 w-4" />
        </span>

        <div className="min-w-0 flex-1">
          {/* The status sits on the second line, not beside the title: three
              header buttons plus a status chip is more than the title can
              share a row with at this width without being truncated. */}
          <h2
            id={`${id}-title`}
            className="truncate text-[0.9375rem] font-bold leading-tight tracking-tight text-ink"
          >
            Leomar&apos;s AI Assistant
          </h2>

          <p
            id={`${id}-subtitle`}
            className={cn(
              "mt-1 text-xs leading-snug text-ink-muted",
              collapsed && "hidden sm:block",
            )}
          >
            {/* Inline rather than a flex row: as a flex child the sentence
                wraps *around* the chip and the two lines stop lining up. */}
            <Availability offline={Boolean(engine) && engine !== "model"} />
            Ask me anything about Leomar, his work, and projects.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          {canClear ? (
            <HeaderButton label="Clear conversation" onClick={onClear}>
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            </HeaderButton>
          ) : null}

          <HeaderButton
            label={collapsed ? "Expand the assistant" : "Minimise the assistant"}
            onClick={onMinimize}
          >
            {collapsed ? (
              <ChevronDown className="h-4 w-4 rotate-180" aria-hidden="true" />
            ) : (
              <Minus className="h-4 w-4" aria-hidden="true" />
            )}
          </HeaderButton>

          <HeaderButton label="Close the assistant" onClick={onClose}>
            <X className="h-4 w-4" aria-hidden="true" />
          </HeaderButton>
        </div>
      </div>
    </header>
  );
}

/**
 * "Offline" means the knowledge engine answered rather than the model. That
 * covers both of the modes where it can happen — `fallback`, the server
 * answering because there is no API key or the model failed, and `offline`,
 * the browser answering because it could not reach the endpoint at all. Only
 * `model` is online. Before the first reply `engine` is null and the label is
 * optimistic, because nothing has failed yet.
 *
 * It is stated rather than hidden: replies are narrower in that mode and a
 * visitor is owed the context. The dot stops pulsing to match, since the pulse
 * reads as "live" everywhere else on the site.
 */
function Availability({ offline }) {
  return (
    <span className="mr-1.5 inline-flex translate-y-[0.05em] items-center gap-1.5 align-middle">
      {offline ? (
        <span
          aria-hidden="true"
          className="h-2 w-2 shrink-0 rounded-full bg-ink-subtle"
        />
      ) : (
        <StatusDot />
      )}
      <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink-subtle">
        {offline ? "offline" : "online"}
      </span>
      <span aria-hidden="true" className="text-ink-subtle">
        ·
      </span>
    </span>
  );
}

function HeaderButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg text-ink-subtle",
        "transition-colors duration-200 hover:bg-surface hover:text-ink",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
      )}
    >
      {children}
    </button>
  );
}

/* ── Empty state ────────────────────────────────────────────────────────── */

function Welcome({ suggestions, onSelect, disabled }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2.5">
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary"
        >
          <Sparkles className="h-3.5 w-3.5" />
        </span>
        <p className="rounded-2xl rounded-tl-md border border-line bg-elevated px-3.5 py-3 text-[0.875rem] leading-[1.65] text-ink-muted">
          {WELCOME_MESSAGE}
        </p>
      </div>

      <div className="pl-[2.375rem]">
        <SuggestedQuestions
          opening
          suggestions={suggestions}
          onSelect={onSelect}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

/* ── Error ──────────────────────────────────────────────────────────────── */

function ErrorBar({ message, onRetry }) {
  return (
    <div
      role="status"
      className="flex items-center gap-2 border-t border-line bg-elevated px-3.5 py-2.5"
    >
      <p className="flex-1 text-xs leading-snug text-ink-muted">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className={cn(
          "shrink-0 rounded-full border border-line-strong px-3 py-1.5 text-[0.6875rem] font-semibold text-ink",
          "transition-colors duration-200 hover:border-primary hover:text-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        )}
      >
        Try again
      </button>
    </div>
  );
}

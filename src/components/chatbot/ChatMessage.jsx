import { useMemo } from "react";
import { AlertTriangle, Check, Copy, RotateCcw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { parseActions } from "../../../lib/chat/actions.js";
import { ChatMarkdown } from "./ChatMarkdown";
import { ChatActions } from "./ChatActions";

/**
 * One turn.
 *
 * The visitor's own words are rendered as text, never as markdown — nothing a
 * visitor types should be able to produce a link, a heading or a list in the
 * transcript. Only the assistant's side goes through the renderer.
 */
export function ChatMessage({ message, isLast, onRetry, onNavigate }) {
  if (message.role === "user") return <UserMessage content={message.content} />;

  return (
    <AssistantMessage
      message={message}
      isLast={isLast}
      onRetry={onRetry}
      onNavigate={onNavigate}
    />
  );
}

function UserMessage({ content }) {
  return (
    <div className="flex animate-bubble-in justify-end">
      <div
        className={cn(
          "max-w-[85%] rounded-2xl rounded-br-md border border-primary/25 bg-primary/10",
          "px-3.5 py-2.5 text-[0.875rem] leading-[1.6] text-ink",
        )}
      >
        {/* whitespace-pre-wrap keeps shift+enter line breaks, break-words stops
            a pasted URL from widening the panel. */}
        <p className="whitespace-pre-wrap break-words">{content}</p>
      </div>
    </div>
  );
}

function AssistantMessage({ message, isLast, onRetry, onNavigate }) {
  const { copied, copy } = useCopyToClipboard();

  const { text, actions } = useMemo(
    () => parseActions(message.content, { streaming: message.streaming }),
    [message.content, message.streaming],
  );

  const showTools = !message.streaming && Boolean(text);

  return (
    <div className="group/msg flex animate-bubble-in gap-2.5">
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary"
      >
        <Sparkles className="h-3.5 w-3.5" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="rounded-2xl rounded-tl-md border border-line bg-elevated px-3.5 py-3">
          {message.failed ? (
            <p className="flex items-start gap-2 text-[0.875rem] leading-[1.6] text-ink-muted">
              <AlertTriangle
                className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              Something went wrong while processing that. Please try again.
            </p>
          ) : (
            <>
              <ChatMarkdown>{text}</ChatMarkdown>
              {message.streaming ? (
                <span
                  aria-hidden="true"
                  className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.2em] animate-caret-blink bg-primary"
                />
              ) : null}
            </>
          )}

          {!message.streaming ? (
            <ChatActions actions={actions} onNavigate={onNavigate} />
          ) : null}
        </div>

        {/* Always visible on touch, where there is no hover to reveal them. */}
        {showTools ? (
          <div
            className={cn(
              "mt-1.5 flex items-center gap-1 pl-0.5 transition-opacity duration-200",
              "sm:opacity-0 sm:focus-within:opacity-100 sm:group-hover/msg:opacity-100",
            )}
          >
            <ToolButton
              label={copied ? "Copied" : "Copy reply"}
              onClick={() => copy(text)}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 animate-scale-in" aria-hidden="true" />
              ) : (
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              )}
            </ToolButton>

            {isLast ? (
              <ToolButton label="Regenerate reply" onClick={onRetry}>
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              </ToolButton>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ToolButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-lg text-ink-subtle",
        "transition-colors duration-200 hover:bg-elevated hover:text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
      )}
    >
      {children}
    </button>
  );
}

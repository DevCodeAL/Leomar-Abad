import { forwardRef, useLayoutEffect, useRef, useState } from "react";
import { ArrowUp, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { LIMITS } from "../../../lib/chat/validate.js";

const MIN_HEIGHT = 40;
const MAX_HEIGHT = 132;

/**
 * Kept short enough to fit one line at 390px. A placeholder that wraps
 * overflows the collapsed textarea and shows a stray scrollbar, because an
 * empty textarea's scrollHeight ignores the placeholder entirely.
 */
const PLACEHOLDER = "Ask about his projects or stack…";

/**
 * Auto-growing composer.
 *
 * `enterKeyHint="send"` and `rows={1}` matter more than they look on mobile:
 * they give the soft keyboard a Send key instead of a newline key, so the
 * Enter-to-send contract holds on a phone as well as a desktop.
 */
export const ChatComposer = forwardRef(function ChatComposer(
  { onSend, onStop, streaming },
  ref,
) {
  const [value, setValue] = useState("");
  const innerRef = useRef(null);

  const setRefs = (node) => {
    innerRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  useLayoutEffect(() => {
    const node = innerRef.current;
    if (!node) return;

    node.style.height = "auto";
    node.style.height = `${Math.min(Math.max(node.scrollHeight, MIN_HEIGHT), MAX_HEIGHT)}px`;
  }, [value]);

  const submit = () => {
    const question = value.trim();
    if (!question || streaming) return;
    setValue("");
    onSend(question);
  };

  const onKeyDown = (event) => {
    // Shift+Enter is a newline. So is Enter while an IME candidate window is
    // open — committing a composition must not also send the message.
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) {
      return;
    }
    event.preventDefault();
    submit();
  };

  const remaining = LIMITS.messageChars - value.length;
  const nearLimit = remaining <= 80;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="border-t border-line bg-surface/80 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl"
    >
      <div
        className={cn(
          "flex items-end gap-2 rounded-2xl border border-line bg-canvas-deep/60 p-1.5",
          "transition-[border-color,box-shadow] duration-300 ease-smooth",
          "focus-within:border-primary/50 focus-within:shadow-glow-sm",
        )}
      >
        <label htmlFor="chat-composer" className="sr-only">
          Ask about Leomar, his work and projects
        </label>

        <textarea
          id="chat-composer"
          ref={setRefs}
          rows={1}
          value={value}
          maxLength={LIMITS.messageChars}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={PLACEHOLDER}
          enterKeyHint="send"
          autoComplete="off"
          spellCheck="true"
          className={cn(
            "flex-1 resize-none bg-transparent px-2 py-2 text-[0.875rem] leading-[1.5] text-ink",
            "placeholder:text-ink-subtle focus:outline-none",
          )}
          style={{ maxHeight: MAX_HEIGHT }}
        />

        {streaming ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop generating"
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line-strong",
              "text-ink-muted transition-colors duration-200 hover:border-primary hover:text-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            )}
          >
            <Square className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!value.trim()}
            aria-label="Send message"
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
              "bg-primary text-primary-fg shadow-glow-sm",
              "transition-[transform,background-color,opacity] duration-200 ease-smooth",
              "hover:bg-primary-strong active:scale-95",
              "disabled:pointer-events-none disabled:opacity-35",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
            )}
          >
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <p className="mt-1.5 px-1 font-mono text-[0.625rem] leading-none text-ink-subtle">
        {nearLimit ? (
          <span className={remaining <= 0 ? "text-primary" : undefined}>
            {remaining} characters left
          </span>
        ) : (
          <>
            <kbd className="font-sans font-semibold">Enter</kbd> to send ·{" "}
            <kbd className="font-sans font-semibold">Shift</kbd> +{" "}
            <kbd className="font-sans font-semibold">Enter</kbd> for a new line
          </>
        )}
      </p>
    </form>
  );
});

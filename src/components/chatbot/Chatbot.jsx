import { Suspense, lazy, useCallback, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { ChatLauncher } from "./ChatLauncher";

/**
 * The assistant's mount point, and the only part of it in the main bundle.
 *
 * Everything with weight — the panel, the markdown renderer, the transport and
 * the offline knowledge engine — sits behind this lazy boundary, so a visitor
 * who never opens the assistant pays for the launcher and nothing else. The
 * chunk is prefetched on hover or focus (see ChatLauncher), which in practice
 * means it has already arrived by the time the click lands.
 */
const ChatPanel = lazy(() =>
  import("./ChatPanel").then((module) => ({ default: module.ChatPanel })),
);

const PANEL_ID = "portfolio-assistant";

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const launcherRef = useRef(null);

  const prefetch = useCallback(() => {
    import("./ChatPanel");
  }, []);

  const toggle = useCallback(() => {
    setOpen((current) => !current);
    setMinimized(false);
  }, []);

  /* Closing unmounts the panel; the transcript survives in sessionStorage, so
     re-opening picks the conversation back up. Minimising keeps it mounted —
     that is the difference, and it is why a reply in flight is only cancelled
     by an explicit close. */
  const close = useCallback(() => {
    setOpen(false);
    setMinimized(false);
    launcherRef.current?.focus();
  }, []);

  return (
    <>
      <ChatLauncher
        buttonRef={launcherRef}
        open={open}
        onToggle={toggle}
        onPrefetch={prefetch}
        panelId={PANEL_ID}
      />

      {open ? (
        <Suspense fallback={<PanelSkeleton />}>
          <ChatPanel
            id={PANEL_ID}
            minimized={minimized}
            onMinimize={() => setMinimized((current) => !current)}
            onClose={close}
          />
        </Suspense>
      ) : null}
    </>
  );
}

/** Holds the panel's exact footprint so opening never shifts the corner. */
function PanelSkeleton() {
  return (
    <div
      aria-hidden="true"
      className={[
        "fixed z-[45] flex animate-panel-in flex-col overflow-hidden",
        "rounded-2xl border border-line bg-surface shadow-lift sm:rounded-3xl",
        "inset-x-2 bottom-2 top-[4.25rem]",
        "sm:inset-x-auto sm:bottom-24 sm:right-6 sm:top-auto sm:h-[min(34rem,calc(100vh-10rem))] sm:w-[25rem]",
      ].join(" ")}
    >
      <div className="flex items-center gap-3 border-b border-line bg-elevated/70 px-3.5 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
          <Sparkles className="h-4 w-4" />
        </span>
        <div className="space-y-1.5">
          <span className="block h-3 w-40 rounded bg-line-strong/60" />
          <span className="block h-2.5 w-52 rounded bg-line/70" />
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <span className="absolute inset-x-0 top-0 h-px animate-shimmer bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      </div>
    </div>
  );
}

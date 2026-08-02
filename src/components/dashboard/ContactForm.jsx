import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const EMPTY = { name: "", email: "", message: "" };

/**
 * The original EmailJS form, rebuilt with explicit submit states and inline,
 * screen-reader-announced feedback instead of a blocking success modal.
 */
export function ContactForm() {
  const formRef = useRef(null);
  const [values, setValues] = useState(EMPTY);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (status === "success" || status === "error") setStatus("idle");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === "sending") return;

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, {
        publicKey: PUBLIC_KEY,
      });
      setValues(EMPTY);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const sending = status === "sending";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Field
        id="name"
        label="Your name"
        value={values.name}
        onChange={handleChange}
        placeholder="Jane Dela Cruz"
        autoComplete="name"
      />
      <Field
        id="email"
        type="email"
        label="Your email"
        value={values.email}
        onChange={handleChange}
        placeholder="jane@example.com"
        autoComplete="email"
      />
      <Field
        id="message"
        as="textarea"
        label="Your message"
        value={values.message}
        onChange={handleChange}
        placeholder="Tell me about your project…"
      />

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <Button type="submit" size="md" disabled={sending} className="min-w-[9.5rem]">
          {sending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              <Send
                className="h-4 w-4 transition-transform duration-300 ease-smooth group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                aria-hidden="true"
              />
              Send message
            </>
          )}
        </Button>

        <StatusMessage status={status} />
      </div>
    </form>
  );
}

function Field({ id, label, as = "input", type = "text", className, ...props }) {
  const Component = as;
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-2xs font-semibold uppercase tracking-[0.16em] text-ink-subtle"
      >
        {label}
      </label>
      <Component
        id={id}
        name={id}
        {...(as === "input" ? { type } : { rows: 5 })}
        required
        className={cn(
          "w-full rounded-xl border border-line bg-canvas-deep/50 px-3.5 py-2.5 text-sm text-ink",
          "placeholder:text-ink-subtle/70",
          "transition-[border-color,box-shadow] duration-200",
          "focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30",
          as === "textarea" && "resize-y min-h-[7.5rem]",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function StatusMessage({ status }) {
  if (status !== "success" && status !== "error") {
    return (
      <p className="text-xs text-ink-subtle" role="status" aria-live="polite">
        I usually reply within a day.
      </p>
    );
  }

  const success = status === "success";
  const Icon = success ? CheckCircle2 : AlertCircle;

  return (
    <p
      role="status"
      aria-live="polite"
      className={cn(
        "flex animate-fade-up items-center gap-2 text-xs font-medium",
        success ? "text-primary" : "text-ink",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      {success
        ? "Message sent — thank you for reaching out!"
        : "Couldn't send just now. Please email me directly instead."}
    </p>
  );
}

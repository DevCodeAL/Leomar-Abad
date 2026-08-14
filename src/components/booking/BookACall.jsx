import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CalendarCheck,
  CalendarX,
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  RefreshCw,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { BOOKING_EVENTS, track } from "@/lib/analytics";
import { DatePicker } from "./DatePicker";
import { useAvailability } from "./useAvailability";

const STEPS = ["date", "time", "details", "confirm"];

/**
 * Four-step booking flow.
 *
 * Availability and the final booking both come from the server; nothing here
 * decides what is bookable. The visitor's own timezone is shown alongside the
 * booking timezone when they differ, but the instant sent to the API is always
 * the exact UTC start the server offered.
 */
export function BookACall() {
  const { config, dates, slots, status, slotStatus, loadDates, loadSlots } =
    useAvailability();

  const [step, setStep] = useState("date");
  const [date, setDate] = useState(null);
  const [slot, setSlot] = useState(null);
  const [details, setDetails] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    trap: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitState, setSubmitState] = useState("idle"); // idle | sending | error
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmed, setConfirmed] = useState(null);

  const openedAt = useRef(Date.now());
  const announced = useRef(false);

  useEffect(() => {
    if (!announced.current && status === "ready") {
      announced.current = true;
      track(BOOKING_EVENTS.opened);
    }
  }, [status]);

  const visitorTimeZone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    [],
  );

  const showVisitorZone =
    config?.timeZone && visitorTimeZone && visitorTimeZone !== config.timeZone;

  const selectDate = (key) => {
    setDate(key);
    setSlot(null);
    setStep("time");
    loadSlots(key);
    track(BOOKING_EVENTS.dateSelected);
  };

  const selectSlot = (chosen) => {
    setSlot(chosen);
    setStep("details");
    track(BOOKING_EVENTS.timeSelected);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (submitState === "sending") return;

    setFieldErrors({});
    setErrorMessage("");
    setSubmitState("sending");
    track(BOOKING_EVENTS.started);

    try {
      const response = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...details,
          start: slot.start,
          elapsedMs: Date.now() - openedAt.current,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (response.ok && payload.status === "confirmed") {
        setConfirmed(payload.booking);
        setStep("done");
        track(BOOKING_EVENTS.completed, {
          durationMinutes: payload.booking?.durationMinutes,
        });
        return;
      }

      if (response.status === 400 && payload.fields) {
        setFieldErrors(payload.fields);
        setSubmitState("idle");
        setStep("details");
        track(BOOKING_EVENTS.failed, { reason: "validation" });
        return;
      }

      if (response.status === 409) {
        // Someone took it between listing and confirming: send them back to a
        // freshly loaded set of times rather than letting them retry a dead slot.
        setErrorMessage(payload.message);
        setSlot(null);
        setStep("time");
        loadSlots(date);
        setSubmitState("idle");
        track(BOOKING_EVENTS.failed, { reason: "slot_taken" });
        return;
      }

      setErrorMessage(
        payload.message ??
          "Something went wrong. Nothing was booked — please try again.",
      );
      setSubmitState("error");
      track(BOOKING_EVENTS.failed, { reason: payload.error ?? "unknown" });
    } catch {
      setErrorMessage(
        "We couldn't reach the server. Nothing was booked — please try again.",
      );
      setSubmitState("error");
      track(BOOKING_EVENTS.failed, { reason: "network" });
    }
  };

  if (step === "done" && confirmed) {
    return <Confirmation booking={confirmed} showVisitorZone={showVisitorZone} visitorTimeZone={visitorTimeZone} />;
  }

  if (status === "loading") return <LoadingState />;
  if (status === "error") {
    return (
      <ErrorState
        message="We're unable to check availability right now. Please try again shortly."
        onRetry={loadDates}
      />
    );
  }

  if (dates.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-elevated text-ink-subtle">
          <CalendarX className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="text-sm font-semibold text-ink">No times open right now</p>
        <p className="max-w-xs text-xs leading-relaxed text-ink-muted">
          My calendar is full for the next few weeks. Email me and we&apos;ll
          find a slot.
        </p>
      </div>
    );
  }

  return (
    <div>
      <StepIndicator current={step} />

      {errorMessage && step !== "confirm" ? (
        <p
          role="alert"
          className="mb-4 flex items-start gap-2 rounded-xl border border-line bg-elevated/70 p-3 text-xs text-ink"
        >
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
          {errorMessage}
        </p>
      ) : null}

      {step === "date" ? (
        <DatePicker dates={dates} selected={date} onSelect={selectDate} />
      ) : null}

      {step === "time" ? (
        <TimeStep
          date={date}
          slots={slots}
          slotStatus={slotStatus}
          timeZone={config?.timeZone}
          onBack={() => setStep("date")}
          onRetry={() => loadSlots(date)}
          onSelect={selectSlot}
        />
      ) : null}

      {step === "details" ? (
        <DetailsStep
          details={details}
          errors={fieldErrors}
          onChange={(next) => setDetails(next)}
          onBack={() => setStep("time")}
          onContinue={() => setStep("confirm")}
        />
      ) : null}

      {step === "confirm" ? (
        <ConfirmStep
          slot={slot}
          details={details}
          config={config}
          visitorTimeZone={showVisitorZone ? visitorTimeZone : null}
          submitState={submitState}
          errorMessage={errorMessage}
          onBack={() => setStep("details")}
          onSubmit={submit}
        />
      ) : null}
    </div>
  );
}

/* ── Steps ──────────────────────────────────────────────────────────────── */

function StepIndicator({ current }) {
  const index = STEPS.indexOf(current);

  return (
    <ol className="mb-5 flex items-center gap-1.5" aria-label="Booking progress">
      {STEPS.map((step, position) => (
        <li key={step} className="flex flex-1 items-center gap-1.5">
          <span
            aria-current={position === index ? "step" : undefined}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              position <= index ? "bg-primary" : "bg-line-strong",
            )}
          />
        </li>
      ))}
      <span className="ml-1 font-mono text-[0.625rem] text-ink-subtle">
        {index + 1}/{STEPS.length}
      </span>
    </ol>
  );
}

function TimeStep({ date, slots, slotStatus, timeZone, onBack, onRetry, onSelect }) {
  const heading = date
    ? new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: "UTC",
      }).format(new Date(`${date}T12:00:00Z`))
    : "";

  return (
    <div>
      <BackRow onBack={onBack} label={heading} />

      {slotStatus === "loading" ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <span
              key={index}
              className="h-10 animate-pulse rounded-xl border border-line bg-elevated"
            />
          ))}
          <span className="sr-only" role="status">
            Loading available times
          </span>
        </div>
      ) : null}

      {slotStatus === "error" ? (
        <ErrorState
          message="We're unable to check availability right now. Please try again shortly."
          onRetry={onRetry}
        />
      ) : null}

      {slotStatus === "ready" && slots.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line p-4 text-center text-xs text-ink-muted">
          No times left on this day. Try another date.
        </p>
      ) : null}

      {slotStatus === "ready" && slots.length > 0 ? (
        <>
          <div role="group" aria-label="Choose a time" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {slots.map((slot) => (
              <button
                key={slot.start}
                type="button"
                onClick={() => onSelect(slot)}
                className="rounded-xl border border-line bg-elevated/60 px-3 py-2.5 text-sm font-medium text-ink transition-[border-color,color,transform] duration-200 ease-smooth hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {slot.label}
              </button>
            ))}
          </div>
          {timeZone ? (
            <p className="mt-3 font-mono text-[0.625rem] text-ink-subtle">
              Times shown in {timeZone}
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function DetailsStep({ details, errors, onChange, onBack, onContinue }) {
  const canContinue = details.name.trim().length >= 2 && details.email.includes("@");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (canContinue) onContinue();
      }}
    >
      <BackRow onBack={onBack} label="Your details" />

      <div className="space-y-3.5">
        <Field
          id="name"
          label="Full name"
          value={details.name}
          error={errors.name}
          autoComplete="name"
          placeholder="Jane Dela Cruz"
          onChange={(value) => onChange({ ...details, name: value })}
        />
        <Field
          id="email"
          type="email"
          label="Email"
          value={details.email}
          error={errors.email}
          autoComplete="email"
          placeholder="jane@example.com"
          onChange={(value) => onChange({ ...details, email: value })}
        />
        <Field
          id="company"
          label="Company"
          optional
          value={details.company}
          error={errors.company}
          autoComplete="organization"
          placeholder="Acme Inc."
          onChange={(value) => onChange({ ...details, company: value })}
        />
        <Field
          id="message"
          as="textarea"
          label="What would you like to discuss?"
          optional
          value={details.message}
          error={errors.message}
          placeholder="A short note about your project…"
          onChange={(value) => onChange({ ...details, message: value })}
        />

        {/* Honeypot: off-screen rather than display:none, which some bots skip. */}
        <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="booking-website">Website</label>
          <input
            id="booking-website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={details.trap}
            onChange={(event) => onChange({ ...details, trap: event.target.value })}
          />
        </div>
      </div>

      <Button type="submit" size="md" className="mt-5 w-full" disabled={!canContinue}>
        Review booking
      </Button>
    </form>
  );
}

function ConfirmStep({
  slot,
  details,
  config,
  visitorTimeZone,
  submitState,
  errorMessage,
  onBack,
  onSubmit,
}) {
  const sending = submitState === "sending";

  const localLabel = visitorTimeZone
    ? new Intl.DateTimeFormat("en-US", {
        timeZone: visitorTimeZone,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(new Date(slot.start))
    : null;

  const dateLabel = new Intl.DateTimeFormat("en-GB", {
    timeZone: config?.timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(slot.start));

  return (
    <form onSubmit={onSubmit}>
      <BackRow onBack={onBack} label="Confirm booking" />

      <dl className="space-y-2 rounded-xl border border-line bg-elevated/50 p-4 text-sm">
        <Row label="Date" value={dateLabel} />
        <Row label="Time" value={slot.label} />
        <Row label="Duration" value={`${config?.durationMinutes ?? 30} minutes`} />
        <Row label="Time zone" value={config?.timeZone} mono />
        {localLabel ? (
          <Row label="Your time" value={`${localLabel} · ${visitorTimeZone}`} mono />
        ) : null}
        <Row label="Meeting" value="Google Meet" />
        <Row label="Name" value={details.name} />
        <Row label="Email" value={details.email} />
        {details.company ? <Row label="Company" value={details.company} /> : null}
      </dl>

      {errorMessage ? (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-xl border border-line bg-elevated/70 p-3 text-xs text-ink"
        >
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
          {errorMessage}
        </p>
      ) : null}

      <Button type="submit" size="md" className="mt-5 w-full" disabled={sending}>
        {sending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Booking…
          </>
        ) : (
          <>
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            Confirm booking
          </>
        )}
      </Button>

      <p className="mt-2.5 text-center text-[0.6875rem] text-ink-subtle">
        You&apos;ll get a Google Calendar invitation with the Meet link.
      </p>
    </form>
  );
}

function Confirmation({ booking, showVisitorZone, visitorTimeZone }) {
  const localLabel = showVisitorZone
    ? new Intl.DateTimeFormat("en-US", {
        timeZone: visitorTimeZone,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(new Date(booking.start))
    : null;

  return (
    <div className="animate-fade-up text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
        <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
      </span>

      <h3 className="mt-4 text-lg font-bold tracking-tight text-ink">
        You&apos;re booked
      </h3>
      <p className="mt-1 text-sm text-ink-muted">
        Your call is confirmed. See you then.
      </p>

      <div className="mt-5 space-y-1 rounded-xl border border-line bg-elevated/50 p-4">
        <p className="text-sm font-semibold text-ink">{booking.dateLabel}</p>
        <p className="text-sm text-ink">
          {booking.startLabel} – {booking.endLabel}
        </p>
        <p className="font-mono text-[0.6875rem] text-ink-subtle">
          {booking.timeZone}
          {localLabel ? ` · ${localLabel} your time` : ""}
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button href={booking.meetUrl} size="sm" className="flex-1">
          <Video className="h-4 w-4" aria-hidden="true" />
          Join meeting
        </Button>
        {booking.calendarLink ? (
          <Button
            href={booking.calendarLink}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            Add to calendar
          </Button>
        ) : null}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ink-muted">
        A calendar invitation with the Meet link has been sent to{" "}
        <span className="font-medium text-ink">{booking.email}</span>.
      </p>
    </div>
  );
}

/* ── Shared bits ────────────────────────────────────────────────────────── */

function BackRow({ onBack, label }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <button
        type="button"
        onClick={onBack}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-line text-ink-muted transition-colors duration-200 hover:border-primary/50 hover:text-primary"
        aria-label="Back"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <p className="truncate text-sm font-semibold text-ink">{label}</p>
    </div>
  );
}

function Row({ label, value, mono = false }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-2xs uppercase tracking-[0.14em] text-ink-subtle">
        {label}
      </dt>
      <dd
        className={cn(
          "min-w-0 truncate text-right text-ink",
          mono ? "font-mono text-[0.6875rem]" : "text-sm",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  error,
  onChange,
  as = "input",
  type = "text",
  optional = false,
  ...props
}) {
  const Component = as;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="flex items-baseline gap-2 text-2xs font-semibold uppercase tracking-[0.16em] text-ink-subtle"
      >
        {label}
        {optional ? (
          <span className="font-normal normal-case tracking-normal opacity-70">
            optional
          </span>
        ) : null}
      </label>

      <Component
        id={id}
        name={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...(as === "input" ? { type } : { rows: 3 })}
        className={cn(
          "w-full rounded-xl border bg-canvas-deep/50 px-3.5 py-2.5 text-sm text-ink",
          "placeholder:text-ink-subtle/70",
          "transition-[border-color,box-shadow] duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary/30",
          error ? "border-primary/70" : "border-line focus:border-primary/60",
          as === "textarea" && "min-h-[5.5rem] resize-y",
        )}
        {...props}
      />

      {error ? (
        <p id={`${id}-error`} className="text-[0.6875rem] text-primary">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-3" role="status" aria-live="polite">
      <span className="sr-only">Loading availability</span>
      <span className="block h-4 w-32 animate-pulse rounded-full bg-elevated" />
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 28 }, (_, index) => (
          <span
            key={index}
            className="aspect-square animate-pulse rounded-lg bg-elevated"
          />
        ))}
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line py-8 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-elevated text-ink-subtle">
        <Clock className="h-4 w-4" aria-hidden="true" />
      </span>
      <p className="max-w-xs text-xs leading-relaxed text-ink-muted">{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
        Try again
      </Button>
    </div>
  );
}

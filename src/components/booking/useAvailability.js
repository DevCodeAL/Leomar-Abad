import { useCallback, useEffect, useState } from "react";

/**
 * Availability fetching, with the three states the UI needs to show honestly:
 * loading, loaded, and unavailable. Slots always come from the server — the
 * browser never decides what is bookable.
 */
export function useAvailability() {
  const [config, setConfig] = useState(null);
  const [dates, setDates] = useState([]);
  const [slots, setSlots] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [slotStatus, setSlotStatus] = useState("idle"); // idle | loading | ready | error

  const loadDates = useCallback(async () => {
    setStatus("loading");
    try {
      const response = await fetch("/api/booking/availability");
      if (!response.ok && response.status !== 200) throw new Error("bad status");

      const payload = await response.json();
      setConfig(payload.config ?? null);
      setDates(payload.dates ?? []);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    loadDates();
  }, [loadDates]);

  const loadSlots = useCallback(async (dateKey) => {
    if (!dateKey) {
      setSlots([]);
      setSlotStatus("idle");
      return;
    }

    setSlotStatus("loading");
    try {
      const response = await fetch(
        `/api/booking/availability?date=${encodeURIComponent(dateKey)}`,
      );
      const payload = await response.json();

      // A 503 still carries a usable body; treat it as an error state rather
      // than pretending the day is fully booked.
      if (payload.error) {
        setSlots([]);
        setSlotStatus("error");
        return;
      }

      setSlots(payload.slots ?? []);
      setSlotStatus("ready");
    } catch {
      setSlots([]);
      setSlotStatus("error");
    }
  }, []);

  return {
    config,
    dates,
    slots,
    status,
    slotStatus,
    loadDates,
    loadSlots,
  };
}

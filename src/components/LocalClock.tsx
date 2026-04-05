"use client";

import { useEffect, useState } from "react";

export function LocalClock() {
  const [info, setInfo] = useState<{ city: string; time: string } | null>(null);

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const city = timezone.split("/").pop()?.replace(/_/g, " ") || "";

    function getTime() {
      return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: timezone,
      }).format(new Date());
    }

    setInfo({ city, time: getTime() });

    const interval = setInterval(() => {
      setInfo((prev) => (prev ? { ...prev, time: getTime() } : null));
    }, 30_000);

    return () => clearInterval(interval);
  }, []);

  if (!info) return null;

  return (
    <span className="text-brand-muted">
      {info.city}, {info.time}
    </span>
  );
}

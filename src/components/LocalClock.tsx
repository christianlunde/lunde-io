"use client";

import { useEffect, useState } from "react";

export function LocalClock() {
  const [info, setInfo] = useState<{ city: string; time: string } | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    async function init() {
      try {
        const res = await fetch("https://worldtimeapi.org/api/ip");
        const data = await res.json();
        const timezone = data.timezone as string;
        const city = timezone.split("/").pop()?.replace(/_/g, " ") || "";

        function getTime() {
          return new Intl.DateTimeFormat("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: timezone,
          }).format(new Date());
        }

        setInfo({ city, time: getTime() });

        interval = setInterval(() => {
          setInfo((prev) => prev ? { ...prev, time: getTime() } : null);
        }, 30_000);
      } catch {
        // Silently fail — clock is a nice-to-have
      }
    }

    init();
    return () => clearInterval(interval);
  }, []);

  if (!info) return null;

  return (
    <span className="text-brand-muted">
      {info.city}, {info.time}
    </span>
  );
}

"use client";

import { useEffect, useState } from "react";

interface LocalClockProps {
  city?: string;
  timezone?: string;
}

export function LocalClock({ city: cityProp, timezone: timezoneProp }: LocalClockProps) {
  const [info, setInfo] = useState<{ city: string; time: string } | null>(null);

  useEffect(() => {
    const timezone = timezoneProp || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const city = cityProp || timezone.split("/").pop()?.replace(/_/g, " ") || "";

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
  }, [cityProp, timezoneProp]);

  if (!info) return null;

  return (
    <span className="text-brand-muted">
      {info.city}, {info.time}
    </span>
  );
}

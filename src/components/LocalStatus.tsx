"use client";

import { useEffect, useState } from "react";

interface PlaceProps {
  city?: string;
  timezone?: string;
}

function useLocalPlace(cityProp?: string, timezoneProp?: string) {
  const [place, setPlace] = useState<{ city: string; time: string } | null>(null);

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

    setPlace({ city, time: getTime() });

    const interval = setInterval(() => {
      setPlace((prev) => (prev ? { ...prev, time: getTime() } : null));
    }, 30_000);

    return () => clearInterval(interval);
  }, [cityProp, timezoneProp]);

  return place;
}

function useTemperature() {
  const [temperature, setTemperature] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchWeather() {
      try {
        const res = await fetch("/api/weather");
        if (!res.ok) return;
        const data: { temperature?: number } = await res.json();
        if (active && typeof data.temperature === "number") {
          setTemperature(data.temperature);
        }
      } catch {
        // Non-critical
      }
    }

    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60_000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return temperature;
}

/** "19 °C Oslo" — the temperature is omitted until Yr answers. */
export function WeatherPlace({ city, timezone }: PlaceProps) {
  const place = useLocalPlace(city, timezone);
  const temperature = useTemperature();

  if (!place) return null;

  return (
    <span>
      {temperature !== null && `${temperature} °C `}
      {place.city}
    </span>
  );
}

/** "00:32" — minute-accurate local clock. */
export function Clock({ city, timezone }: PlaceProps) {
  const place = useLocalPlace(city, timezone);

  if (!place) return null;

  return <span>{place.time}</span>;
}

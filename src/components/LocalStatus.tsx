"use client";

import { useEffect, useState, type ComponentType } from "react";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
} from "react-feather";

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

/** MET symbol_code (e.g. "partlycloudy_night") → icon + accessible word. */
function describeSymbol(
  code: string | null,
): { Icon: ComponentType<{ size?: number | string; className?: string }>; word: string } | null {
  if (!code) return null;
  const base = code.split("_")[0];
  if (base.includes("thunder")) return { Icon: CloudLightning, word: "thunder" };
  if (base.includes("sleet")) return { Icon: CloudDrizzle, word: "sleet" };
  if (base.includes("snow")) return { Icon: CloudSnow, word: "snow" };
  if (base.includes("rain")) return { Icon: CloudRain, word: "rain" };
  if (base === "clearsky" || base === "fair") return { Icon: Sun, word: "clear" };
  if (base === "partlycloudy" || base === "cloudy" || base === "fog")
    return { Icon: Cloud, word: base === "fog" ? "fog" : "cloudy" };
  return null;
}

function useTemperature() {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [condition, setCondition] = useState<ReturnType<typeof describeSymbol>>(null);

  useEffect(() => {
    let active = true;

    async function fetchWeather() {
      try {
        const res = await fetch("/api/weather");
        if (!res.ok) return;
        const data: { temperature?: number; symbol?: string | null } = await res.json();
        if (active && typeof data.temperature === "number") {
          setTemperature(data.temperature);
          setCondition(describeSymbol(data.symbol ?? null));
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

  return { temperature, condition };
}

/** "19 °C Oslo" — the temperature is omitted until Yr answers. */
export function WeatherPlace({ city, timezone }: PlaceProps) {
  const place = useLocalPlace(city, timezone);
  const { temperature, condition } = useTemperature();

  if (!place) return null;

  return (
    <span className="flex items-center gap-1.5">
      {condition && (
        <span aria-hidden="true" className="flex items-center">
          <condition.Icon size={13} />
        </span>
      )}
      {condition && <span className="sr-only">{condition.word}</span>}
      {temperature !== null && <span>{temperature} °C</span>}
      <span>{place.city}</span>
    </span>
  );
}

/** "00:32" — minute-accurate local clock. */
export function Clock({ city, timezone }: PlaceProps) {
  const place = useLocalPlace(city, timezone);

  if (!place) return null;

  return <span>{place.time}</span>;
}

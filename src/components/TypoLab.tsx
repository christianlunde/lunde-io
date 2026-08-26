"use client";

// TEMPORARY typography lab: flips font family and weight scheme live so the
// combinations can be compared on the real page. Remove this file, its use
// in page.tsx, the extra fonts in layout.tsx and the [data-typo-*] CSS when
// a direction is chosen.
import { useEffect, useState } from "react";

const FONTS = [
  { id: "", label: "Geist Mono" },
  { id: "geist-sans", label: "Geist Sans" },
  { id: "inter", label: "Inter" },
  { id: "dm-sans", label: "DM Sans" },
  { id: "manrope", label: "Manrope" },
];

const WEIGHTS = [
  { id: "", label: "Chrome bold" },
  { id: "centerbold", label: "Senter bold" },
  { id: "regular", label: "Alt regular" },
];

function apply(attr: "data-typo-font" | "data-typo-weight", value: string) {
  if (value) document.documentElement.setAttribute(attr, value);
  else document.documentElement.removeAttribute(attr);
}

export function TypoLab() {
  const [font, setFont] = useState("");
  const [weight, setWeight] = useState("");

  useEffect(() => {
    const f = localStorage.getItem("typo-font") ?? "";
    const w = localStorage.getItem("typo-weight") ?? "";
    setFont(f);
    setWeight(w);
    apply("data-typo-font", f);
    apply("data-typo-weight", w);
  }, []);

  function pickFont(id: string) {
    setFont(id);
    localStorage.setItem("typo-font", id);
    apply("data-typo-font", id);
  }

  function pickWeight(id: string) {
    setWeight(id);
    localStorage.setItem("typo-weight", id);
    apply("data-typo-weight", id);
  }

  const chip =
    "rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide transition-colors";

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-1.5">
      <div className="flex flex-wrap justify-end gap-1.5">
        {FONTS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => pickFont(f.id)}
            className={`${chip} ${
              font === f.id
                ? "border-white bg-white/90 text-black"
                : "border-white/40 text-white/80 hover:border-white/80"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="flex gap-1.5">
        {WEIGHTS.map((w) => (
          <button
            key={w.id}
            type="button"
            onClick={() => pickWeight(w.id)}
            className={`${chip} ${
              weight === w.id
                ? "border-white bg-white/90 text-black"
                : "border-white/40 text-white/80 hover:border-white/80"
            }`}
          >
            {w.label}
          </button>
        ))}
      </div>
    </div>
  );
}

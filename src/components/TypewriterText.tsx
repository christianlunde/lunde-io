"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  text: string;
  speed?: number;
}

export function TypewriterText({ text, speed = 50 }: Props) {
  const [display, setDisplay] = useState(text);
  const prevText = useRef(text);
  const animating = useRef(false);

  useEffect(() => {
    if (text === prevText.current || animating.current) return;

    const old = prevText.current;
    prevText.current = text;
    animating.current = true;

    let i = old.length;

    // Erase old text
    const eraseInterval = setInterval(() => {
      if (i <= 0) {
        clearInterval(eraseInterval);

        // Type new text
        let j = 0;
        const typeInterval = setInterval(() => {
          if (j > text.length) {
            clearInterval(typeInterval);
            animating.current = false;
            return;
          }
          setDisplay(text.substring(0, j));
          j++;
        }, speed);

        return;
      }
      i--;
      setDisplay(old.substring(0, i));
    }, speed);

    return () => {
      clearInterval(eraseInterval);
      animating.current = false;
    };
  }, [text, speed]);

  return <>{display}</>;
}

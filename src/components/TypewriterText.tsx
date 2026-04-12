"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  text: string;
  speed?: number;
  /** Rich JSX shown instead of plain text once animation settles */
  children?: ReactNode;
}

export function TypewriterText({ text, speed = 50, children }: Props) {
  const [display, setDisplay] = useState(text);
  const [stable, setStable] = useState(true);

  const displayRef = useRef(text);
  const targetRef = useRef(text);
  const animatingRef = useRef(false);
  const cancelRef = useRef<() => void>(() => {});

  useEffect(() => {
    targetRef.current = text;

    if (text === displayRef.current) {
      if (!animatingRef.current) setStable(true);
      return;
    }
    if (animatingRef.current) return; // queued — picked up when current finishes

    startAnimation(displayRef.current, text);

    function startAnimation(from: string, to: string) {
      let cancelled = false;
      animatingRef.current = true;
      setStable(false);

      cancelRef.current = () => {
        cancelled = true;
        animatingRef.current = false;
      };

      let i = from.length;

      function erase() {
        if (cancelled) return;
        if (i > 0) {
          displayRef.current = from.substring(0, --i);
          setDisplay(displayRef.current);
          setTimeout(erase, speed);
        } else {
          typeChar(0);
        }
      }

      function typeChar(j: number) {
        if (cancelled) return;
        displayRef.current = to.substring(0, j);
        setDisplay(displayRef.current);
        if (j < to.length) {
          setTimeout(() => typeChar(j + 1), speed);
        } else {
          animatingRef.current = false;
          const pending = targetRef.current;
          if (pending !== to) {
            startAnimation(to, pending);
          } else {
            setStable(true);
          }
        }
      }

      erase();
    }

    return () => cancelRef.current();
  }, [text, speed]);

  if (stable && children !== undefined) return <>{children}</>;
  return <>{display}</>;
}

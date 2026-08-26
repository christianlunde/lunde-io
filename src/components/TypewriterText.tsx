"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  text: string;
  speed?: number;
  /** Rich JSX shown instead of plain text once animation settles */
  children?: ReactNode;
  /** Reports settling: false while erasing/typing, true when at rest. */
  onStableChange?: (stable: boolean) => void;
}

/** Number of leading characters `a` and `b` share. */
function sharedPrefix(a: string, b: string): number {
  const max = Math.min(a.length, b.length);
  let i = 0;
  while (i < max && a[i] === b[i]) i++;
  return i;
}

/** Number of trailing characters `a` and `b` share, not reaching into `skip`. */
function sharedSuffix(a: string, b: string, skip: number): number {
  const max = Math.min(a.length, b.length) - skip;
  let i = 0;
  while (i < max && a[a.length - 1 - i] === b[b.length - 1 - i]) i++;
  return i;
}

export function TypewriterText({ text, speed = 50, children, onStableChange }: Props) {
  const [display, setDisplay] = useState(text);
  const [stable, setStable] = useState(true);

  const displayRef = useRef(text);
  const targetRef = useRef(text);
  const animatingRef = useRef(false);
  const cancelRef = useRef<() => void>(() => {});

  const onStableRef = useRef(onStableChange);
  onStableRef.current = onStableChange;
  useEffect(() => {
    onStableRef.current?.(stable);
  }, [stable]);

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

      // Only retype what actually differs. Swapping one song for another
      // leaves "…while listening to " and the closing "." untouched, so just
      // the title is erased and replaced.
      const prefix = sharedPrefix(from, to);
      const suffix = sharedSuffix(from, to, prefix);
      const head = to.slice(0, prefix);
      const tail = suffix > 0 ? to.slice(to.length - suffix) : "";
      const fromMiddle = from.slice(prefix, from.length - suffix);
      const toMiddle = to.slice(prefix, to.length - suffix);

      function show(middle: string) {
        displayRef.current = head + middle + tail;
        setDisplay(displayRef.current);
      }

      let i = fromMiddle.length;

      function erase() {
        if (cancelled) return;
        if (i > 0) {
          show(fromMiddle.substring(0, --i));
          setTimeout(erase, speed);
        } else {
          typeChar(0);
        }
      }

      function typeChar(j: number) {
        if (cancelled) return;
        show(toMiddle.substring(0, j));
        if (j < toMiddle.length) {
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

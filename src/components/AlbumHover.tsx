"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";

interface Props {
  albumArt: string;
  songUrl: string;
  children: ReactNode;
}

export function AlbumHover({ albumArt, songUrl, children }: Props) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  if (!albumArt) {
    return (
      <a
        href={songUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-4 hover:opacity-70 transition-opacity"
      >
        {children}
      </a>
    );
  }

  return (
    <>
      <a
        href={songUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-4 hover:opacity-70 transition-opacity"
        onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
        onMouseLeave={() => setPos(null)}
      >
        {children}
      </a>
      {pos && (
        <span
          className="fixed pointer-events-none z-50 hidden sm:block"
          style={{ left: pos.x - 60, top: pos.y - 148 }}
        >
          <Image
            src={albumArt}
            alt=""
            width={120}
            height={120}
            className="rounded-lg shadow-lg"
            unoptimized
          />
        </span>
      )}
    </>
  );
}

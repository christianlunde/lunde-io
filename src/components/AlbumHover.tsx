"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";

interface Props {
  albumArt: string;
  songUrl: string;
  children: ReactNode;
}

export function AlbumHover({ albumArt, songUrl, children }: Props) {
  const [show, setShow] = useState(false);

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
    <span
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <a
        href={songUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-4 hover:opacity-70 transition-opacity"
      >
        {children}
      </a>
      {show && (
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 pointer-events-none animate-fade-in">
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
    </span>
  );
}

@AGENTS.md

# Project: lunde.io

Personal portfolio and journal for Christian Lunde — product designer.

## Language

- All UI text, labels, and content is in **English**
- URLs must be in English (e.g. `/about`, `/journal`, not `/om`)
- Dates use `en-US` locale
- HTML lang attribute: `en`

## Design

- Visual style matches lunde.io (Figma Sites version)
- Background: `#7DBCFF` (light), `#00162E` (dark)
- Text: `#00162E` (light), `#C5DFFF` (dark)
- Fonts: Space Grotesk (headings), Space Mono (body/mono)
- Minimal, typography-driven design — no unnecessary decoration
- Full-viewport hero on homepage, content sections below

## Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Sanity v3 (CMS) — embedded Studio at `/studio`
- Motion (animations, fade-in)
- Lenis (smooth scroll)
- npm as package manager
- Deploy target: Vercel

## Sanity

- Project ID: `cdambab2`
- Dataset: `production`
- Schemas: `journal`, `about`, `project`
- No API token needed for reading published content

## Content

- Christian left Agens in 2026 (was Head of Design & Partner, 2019–2026)
- Currently independent / exploring what's next
- Key clients: Uber, Apple, BBC, Sony Music, Electrolux, Philips, Adobe, Gjensidige, NAV, Norwegian Police, Nordic Choice Hotels, Norsk Tipping, Meny, Huma, Fæbrik
- Education: Hyper Island, Stockholm (2016–2018)
- Community: Friends of Figma Norway (leader), UX Norge (contributor)

## Structure

- `/` — Hero + clients + about + journal + career + footer
- `/about` — Full bio, client list, experience, education
- `/journal` — Blog posts from Sanity
- `/journal/[slug]` — Individual post
- `/studio` — Sanity Studio (embedded)

## Conventions

- Client components use `"use client"` directive
- FadeIn animations with staggered delays
- Dark/light mode via `.dark` class on `<html>`, persisted in localStorage
- LocalClock uses browser's `Intl` timezone (no external API)
- Logo section uses text placeholders — SVGs to be added by Christian later in `public/logos/`

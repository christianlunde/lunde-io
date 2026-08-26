@AGENTS.md

# Project: lunde.io

Personal portfolio and journal for Christian Lunde — product designer.

**This file is the rules. [`HANDOFF.md`](HANDOFF.md) is the history, the
reasoning behind the architecture, current status and the ops guide.** Read
both before changing anything. Decisions belong in these files, never in a
chat log — if something is worth remembering next session, write it down here.

## Working agreements

- **Answer Christian in Norwegian.** All UI text and content on the site stays
  English (see Language below).
- **Never push without being told.** Christian says when something ships.
  Committing locally is fine; pushing is a release (see Branches & deploy).
- **Ask which branch on every change**: does this belong on `preview`, `main`,
  or both? The two branches carry different homepages and are never merged.
- Verify in the browser before reporting done: happy path, light + dark,
  mobile width, no console errors.

## Branches & deploy

| Branch | Content | Deploys to |
|--------|---------|------------|
| `main` | Coming Soon page (Lofoten photo hero + NowPlaying + weather/clock) | **Production** — lunde.io |
| `preview` | Full portfolio (hero, clients, journal, music, places) | Vercel preview URL |

- **Push is the release.** GitHub Actions (`.github/workflows/deploy.yml`)
  runs the Vercel CLI on every push: `main` → production, `preview` → preview.
  Deploy is machine-independent; the secrets live in GitHub repo secrets.
- **Do NOT run `vercel deploy --prod` from the CLI in this project.** The house
  rule in `~/Projects/CLAUDE.md` covers the static open-* tools. Here a CLI
  deploy ships your working tree straight to lunde.io outside CI — and from
  `preview` that would push the full site into production.
- The branches split on 2026-04-05 and are **never merged**. Shared changes are
  re-applied by hand: `git checkout <other-branch> -- <file>`.
- `src/app/page.tsx` differs per branch and must **never** be synced.
  `page.full.tsx` on `preview` is a copy of the full homepage.
- The repo is **public on purpose** — Vercel Hobby blocks CI deploys from
  private repos. See HANDOFF.md.

## Language

- All UI text, labels, and content is in **English**
- URLs must be in English (e.g. `/about`, `/journal`, not `/om`)
- Dates use `en-US` locale
- HTML lang attribute: `en`

## Design

- Visual style matches lunde.io (Figma Sites version)
- Background: `#7DBCFF` (light), `#00162E` (dark)
- Text: `#00162E` (light), `#C5DFFF` (dark)
- Fonts: **Geist Sans everywhere, regular weight** (chosen 2026-08-27 after
  an on-page comparison against Geist Mono, Inter, DM Sans and Manrope).
  Top chrome runs `font-medium`; nothing is bold. The `font-mono` utility /
  `--font-mono` token still exists in markup for historical reasons but maps
  to Geist Sans. The font matches the `open-*` tool family. (Earlier the site
  ran Space Grotesk/Space Mono from the Figma Sites original, then Geist Mono.)
- Minimal, typography-driven design — no unnecessary decoration
- Full-viewport hero on homepage, content sections below
- Entrance animations start at `opacity: 0.01`, never `0` — an element at
  exactly 0 is never painted, so Lighthouse charges the fade to LCP as render
  delay. (`FadeIn.tsx` still uses `0`; fixing it is on the debt list.)

## Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Sanity v5 (CMS) — embedded Studio at `/studio`
- Motion (animations, fade-in)
- Vercel Web Analytics (`@vercel/analytics/next`, `<Analytics />` in `layout.tsx`)
- npm as package manager
- Deploy target: Vercel (Hobby)

## Do not reintroduce

- **Lenis smooth scroll** — caused scroll bugs on `/music` (scroll bounds
  computed before images loaded). Native scroll works fine. The package is
  still in `package.json` unused; remove it, don't wire it back up.
- **Raw `<script>` tags in components** — React 19 does not execute them. Use
  `next/script` with `strategy="beforeInteractive"` (see `layout.tsx`).

## Sanity

- Project ID: `cdambab2`
- Dataset: `production`
- Schemas: `journal`, `about`, `project`, `destination`
- No API token needed for reading published content
- Schema changes deploy with the site — there is no separate Sanity deploy
- **Content is currently frozen at build time** — no revalidation is
  configured, so published content does not appear until the next deploy.
  See "Kjent teknisk gjeld" in HANDOFF.md before building anything that
  depends on fresh CMS content.

## Content

- Christian left Agens in 2026 (was Head of Design & Partner, 2019–2026)
- Currently independent / exploring what's next
- Key clients: Uber, Apple, BBC, Sony Music, Electrolux, Philips, Adobe, Gjensidige, NAV, Norwegian Police, Nordic Choice Hotels, Norsk Tipping, Meny, Huma, Fæbrik
- Education: Hyper Island, Stockholm (2016–2018)
- Community: Friends of Figma Norway (leader), UX Norge (contributor)

## Structure

On `preview` (the full site):

- `/` — Hero + clients + about + journal + career + footer
- `/about` — Full bio, client list, experience, education
- `/journal`, `/journal/[slug]` — Blog posts from Sanity
- `/music` — Spotify top artists/tracks, recently played
- `/places`, `/places/[slug]` — Travel guides from Sanity (`/places/demo` is a
  hardcoded example, deletable once real content exists)
- `/studio` — Sanity Studio (embedded)
- `/api/spotify/*`, `/api/strava/weekly` — integration routes

On `main` only the homepage differs — `/about`, `/journal` and `/studio` are
also deployed and publicly reachable, just unlinked.

## Conventions

- Client components use `"use client"` directive
- FadeIn animations with staggered delays
- Dark/light mode via `.dark` class on `<html>`, persisted in localStorage,
  follows the system live via a `matchMedia` listener in the theme script
- `LocalClock` takes city + IANA timezone as props from Sanity `about.currentLocation`,
  falling back to the visitor's own timezone when empty
- Logo section uses text placeholders — SVGs to be added by Christian later in `public/logos/`

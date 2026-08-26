# lunde.io

Personal portfolio and journal for Christian Lunde, product designer.
Minimal and typography-driven, with live Spotify and Strava status,
a Sanity-backed journal, and travel guides.

**Next.js 16** (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Sanity v5 (embedded Studio) · Motion · Vercel

## Getting started

```bash
git clone https://github.com/christianlunde/lunde-io.git
cd lunde-io && npm install
```

Add `.env.local` in the root — it is gitignored and holds eight keys:
`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`,
`SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`,
`STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, `STRAVA_REFRESH_TOKEN`.
Transfer it securely between machines — never over chat or email.
Production has its own copies in Vercel.

```bash
npm run dev     # http://localhost:3000
npm run build   # always run before pushing
npm run lint
```

Content is edited in the embedded Sanity Studio at `/studio`.

## Branches

| Branch | Content | Deploys to |
|--------|---------|------------|
| `main` | Coming Soon page | Production — lunde.io |
| `preview` | Full portfolio | Vercel preview URL |

Pushing is the release: GitHub Actions runs the Vercel CLI on every push.
The two branches carry different homepages and are never merged — shared
changes are copied by hand. Do not deploy from the Vercel CLI in this project.

## Documentation

- **[CLAUDE.md](CLAUDE.md)** — the rules: branches, deploy, design, conventions
- **[HANDOFF.md](HANDOFF.md)** — history, why the architecture is what it is,
  current status, known technical debt, and the ops guide
- **[AGENTS.md](AGENTS.md)** — Next.js 16 warning for AI agents

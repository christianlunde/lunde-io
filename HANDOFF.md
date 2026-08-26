# lunde.io — Prosjekthistorikk og driftsguide

> Skrevet august 2026 som overlevering til ny maskin. Verifisert mot
> produksjon 26. august 2026. Les denne sammen med `CLAUDE.md`
> (regler som gjelder ved hver endring) og `AGENTS.md` (Next.js 16-advarsel).
>
> **Denne fila er historikken og hvorfor-et. `CLAUDE.md` er reglene.**
> Nye beslutninger hører hjemme her eller der — ikke i en chat.

## Om prosjektet

Personlig portefølje og journal for Christian Lunde, produktdesigner.
Designet matcher Figma Sites-versjonen av lunde.io: minimalistisk,
typografidrevet, bakgrunn `#7DBCFF` (lys) / `#00162E` (mørk), Space Grotesk
til overskrifter og Space Mono til brødtekst.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Sanity v5 (embedded Studio på `/studio`) · Motion (animasjoner) · Vercel (Hobby)

## Arkitektur — og hvorfor den er sånn

### To brancher med ulikt innhold

| Branch | Innhold | Deployes til |
|--------|---------|--------------|
| `main` | Coming Soon-side (NowPlaying + klokke) | **Produksjon** (lunde.io) |
| `preview` | Full portefølje (hero, klienter, journal, music, places) | Vercel preview-miljø |

Grunnen: GitHub-kontoen kan bare kobles til ett Vercel Hobby-prosjekt, så
deploy skjer via **GitHub Actions** (`.github/workflows/deploy.yml`) som kjører
Vercel CLI. Push til `main` → prod, push til `preview` → preview-URL.
Vercel-secrets (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`) ligger i
GitHub repo-secrets — deploy er derfor helt maskinuavhengig.

**Repoet er public med vilje.** Vercel Hobby blokkerer CI-deploys fra private
repos (feilen «GitHub User Not Found» — tolkes som teamsamarbeid). Vi prøvde å
strippe git-metadata; det hjalp ikke. Public repo løste det.

Branchene splittet 5. april 2026 i commit `4079ba0` («Add coming soon page as
temporary homepage») og har siden gått hver sin vei — de er **aldri merget**.
Delte endringer re-applikeres for hånd, så samme endring får ulik hash på hver
branch. Det er tilsiktet, ikke rot.

**Deling mellom brancher er manuell:** felleskomponenter, Sanity-skjemaer og
lib-filer kopieres med `git checkout <annen-branch> -- <fil>`.
`src/app/page.tsx` er **ulik per branch og skal aldri synkes**
(`page.full.tsx` på preview er en kopi av den fulle forsiden).

### Fjernet underveis (ikke gjeninnfør)

- **Lenis smooth scroll** — ga scroll-bugs på `/music` fordi scrollgrensen ble
  beregnet før bildene lastet. Fjernet helt; native scroll fungerer fint.
  (Merk: pakken ligger fortsatt i `package.json` uten å importeres — se
  «Kjent teknisk gjeld».)
- **Rå `<script>`-tag for tema** — React 19 kjører ikke script-tags i
  komponenter. Erstattet med `next/script` + `strategy="beforeInteractive"`.

## Hva som er bygget, i rekkefølge

### 1. Grunnoppsett
Forside (hero i full viewport, klienter, om, journal, karriere, footer),
`/about`, `/journal` + `/journal/[slug]` fra Sanity, dark/light mode via
`.dark`-klasse på `<html>` (localStorage + følger systemet live via
`matchMedia`-listener i temascriptet i `layout.tsx`).

### 2. Spotify-integrasjon
- `src/lib/spotify.ts` — token-refresh med modul-nivå caching, typede helpers
- API-ruter: `now-playing` (30s cache), `top-artists`/`top-tracks` (1t,
  `?range=`-param), `recently-played` (5min)
- `/music`-side: toppartister, topplåter, nylig spilt, tidsperiode-velger
- `TravelSoundtrack`: journalposter kan ha `spotifyPlaylistUrl` i Sanity →
  Spotify-embed nederst i posten

### 3. Strava-integrasjon
- `src/lib/strava.ts` + `/api/strava/weekly` — ukens sykkel-km, fallback til
  siste tur. Krevde re-autorisering med scope `activity:read_all`
  (app-token uten scope ga tomme svar — klassisk felle).

### 4. Dynamisk statustekst (HeroStatus / NowPlaying)
Fire scenarioer: bare musikk («…while listening to *sang*»), bare sykling
(«…on my bike (62 km this week)»), begge kombinert, eller ingen aktivitet
(→ «Previously Head of Design at Agens.»). Finnes i to varianter:
`HeroStatus.tsx` (preview-forsiden) og `NowPlaying.tsx` (main/Coming Soon).

### 5. Typewriter og albumhover — polert
- `TypewriterText.tsx` animerer **hele suffikset** ved alle state-endringer
  (sang↔ingen sang er like smooth som sang↔sang). Viser ren tekst under
  animasjon, bytter til rik JSX (lenker, hover) når stabil. Poller hvert 10. s.
- `AlbumHover.tsx`: albumcover følger musepekeren (`position: fixed` +
  `onMouseMove` — den gamle absolute-varianten hoppet), kun desktop
  (`hidden sm:block`).

### 6. Nåværende sted i Sanity
`about`-skjemaet har `currentLocation` (bynavn + IANA-tidssone, f.eks.
`Asia/Seoul`). `LocalClock` tar disse som props og viser «Seoul, 14:32» på
forsiden — faller tilbake til besøkerens egen tidssone hvis feltene er tomme.
**Begge forsider** (main og preview) sender props fra `getAbout()`.

### 7. Places-seksjonen (nyeste)
Premium reiseguide inspirert av Roadbook/Monocle: topp 10 steder per by.
- Sanity-skjema `destination`: tittel, slug, land, coverbilde, ingress,
  `mapCenter`, og `places[]` som **embedded array** (alt i ett dokument =
  enkel drag-to-reorder i Studio). Hvert sted: navn, kategori (forhåndsdefinert
  liste), beskrivelse, adresse, Google Maps-URL, koordinater, bilde, dato.
- `/places` (grid av `DestinationCard`) og `/places/[slug]`
  (coverbilde + nummererte `PlaceCard` med store ordenstall 01–10,
  kategori-badge, adresse, «Month Year»-dato, «Open in Maps →»).
- **Mapbox-kart er bevisst utsatt** (manglet token). Skjemaet har allerede
  koordinatfelter, så kartet kan legges til uten migrering — planen var
  `react-map-gl` med light-v11/dark-v11 som følger sitens tema.
- `/places/demo` viser hardkodet Lisboa-eksempel for å se designet uten
  Sanity-innhold. **Kan slettes** når ekte innhold finnes.

### 8. Vercel Web Analytics
Slått på i Vercel-dashboardet, koblet til i koden 26. august 2026:
`@vercel/analytics` + `<Analytics />` fra `@vercel/analytics/next` nederst i
`<body>` i `layout.tsx`. Fila er identisk på begge brancher, så endringen ble
kopiert rett over. Lokalt kjører SDK-en i debug-modus og sender ingenting —
konsollen logger «Debug mode is enabled by default in development», det er
normalt. Tall dukker først opp i dashboardet når endringen er **pushet**
(push = deploy).

### 9. Diverse
Tittel «Christian Lunde · Designer» (template `%s · Christian Lunde`),
Vercel-favicon fjernet (`icons: { icon: [] }`).

## Status akkurat nå (august 2026)

**Ferdig og pushet** på riktige brancher; GitHub Actions deployer grønt.
Siste deploy 12. april 2026 for begge brancher.

**Venter på innhold (gjøres i Studio, ikke kode):**
- [ ] Legge inn destinasjoner i Places (Portugal først; Sør-Korea, Japan og
      Bali står for tur)
- [ ] Fylle inn `currentLocation` i Om meg-dokumentet
- [ ] Klientlogoer som SVG i `public/logos/` (forsiden bruker tekstplaceholdere)

**Mulige neste steg (diskutert, ikke bygget):**
- [ ] Mapbox-kart på Places når token finnes
- [ ] Slette `/places/demo`
- [ ] «Spotify Wrapped»-ideer for /music (mer statistikk)

## Kjent teknisk gjeld

Kartlagt 26. august 2026 ved gjennomgang av stacken. Sortert etter hva som
haster mest. Ingenting av dette er fikset ennå.

### Ødelagt nå

- [ ] **Strava-integrasjonen er død — appen er satt til «Inactive» av Strava.**
      Bekreftet 26. august 2026: token-refresh svarer `200 OK`, men
      `/athlete/activities` svarer `403 Forbidden` med
      `{"resource":"Application","field":"Status","code":"Inactive"}`.
      Nøkler og scope (`activity:read_all read`) er intakte — det er selve
      API-appen som er deaktivert.
      **Årsak:** Stravas API-endringer (epost 1. juni 2026) krever Strava-
      abonnement for eksisterende Standard Tier-utviklere fra **30. juni 2026**.
      Den fristen gikk ut for ~8 uker siden.
      **Fiks:** krever en beslutning fra Christian — tegne Strava-abonnement
      (eposten nevner 3 måneder gratis for aktive utviklere), søke Extended
      Access Tier, eller fjerne sykkeldelen av statusteksten.
      Sjekk status i Stravas API settings dashboard.
      Konsekvens i mellomtiden: `HeroStatus`/`NowPlaying` faller stille tilbake
      til «Previously Head of Design at Agens.» — siden ser riktig ut, og
      ingenting varsler om at halve funksjonen er borte. Dette er
      skoleeksempelet på den stille feilhåndteringen under.

### Kommer (Strava, 1. juni 2027)

- [ ] **Base-URL endres** fra `https://www.strava.com/api/v3` til
      `https://www.api-v3.strava.com` — én linje i `src/lib/strava.ts`
      (`API_BASE`). Kan **ikke** byttes ennå: den nye verten svarer ikke på DNS
      per august 2026. Må gjøres før juni 2027.
- [ ] `oauth/deauthorize` pensjoneres til fordel for `oauth/revoke` — vi bruker
      ingen av dem, så ingen endring.
- Allerede i orden: autorisasjonstokens sendes i header (`Authorization: Bearer`),
      ikke som form-params. `TOKEN_URL` er ikke omfattet av URL-endringen.
- Ikke relevant: Club- og Segments Explore-endepunktene (deprekeres 1. sept 2026)
      brukes ikke — vi kaller kun `/athlete/activities`. Restriksjonen mot
      tredjeparts mellomledd gjelder ikke; dette er en direkte integrasjon.

### Blokkerer full lansering

- [ ] **Ingen revalidering — CMS-innholdet er fryst ved build.** `/`, `/about`,
      `/journal` og `/places` bygges som `○ Static`, og det finnes verken
      `export const revalidate`, `use cache`/`cacheLife` eller webhook-rute.
      Kombinert med `useCdn: true` i `src/sanity/client.ts` betyr det at et
      publisert journalinnlegg **aldri vises før neste deploy**. Minimalt fiks:
      `export const revalidate = 3600` på de fire sidene. Riktig fiks:
      `cacheComponents: true` + `'use cache'`/`cacheTag` i `queries.ts` og en
      Sanity-webhook som kaller `revalidateTag`.

### Ligger live på lunde.io nå

- [ ] **`/api/spotify/callback` er fortsatt deployet på `main`.** Rutens egen
      kommentar sier «save this to env vars, then remove this route». Den ble
      fjernet på `preview`, men aldri på `main`. Begrenset reell risiko (den
      ville echoet innsenderens egen token, ikke Christians), men den skal bort.
- [ ] **`/about`, `/journal` og `/studio` svarer 200 på lunde.io.** `main`
      byttet bare ut forsiden — de andre rutene er offentlige, bare ulenket.
      Ta stilling til om de skal `noindex`-es fram til lansering.

### Opprydding

- [ ] `lenis` er en død avhengighet — null importer, men fortsatt i `package.json`
- [ ] `pnpm-workspace.yaml` er en rest fra et pnpm-forsøk (prosjektet bruker npm)
- [ ] `public/` inneholder fem ubrukte create-next-app-SVG-er
- [ ] `react-feather` er inne for to ikoner (`Sun`, `Moon`)
- [ ] `motion` er inne for én fade — `FadeIn.tsx` kunne vært CSS
- [ ] Ingen `engines`/`.nvmrc` (Vercel kjører 24.x)

### Kvalitet

- [ ] **Avhengigheter ~4 måneder bak.** Tilgjengelige majors: Sanity 5 → 6 og
      next-sanity 12 → 13 (henger sammen, gjør samlet), `@portabletext/react`
      6 → 8, motion 12 → 13, eslint 9 → 10, TypeScript 5 → 7 (ta separat).
- [ ] **Sanity-laget er utypet** — `client.fetch` gir `any`, med
      `eslint-disable-next-line @typescript-eslint/no-explicit-any` i
      `src/sanity/image.ts` og `src/components/PortableText.tsx`.
      Sanity typegen ville fjernet begge.
- [ ] **Alt feiler stille.** Hver Sanity-spørring er `try { … } catch { return [] }`
      og hver Spotify-funksjon `catch { return { isPlaying: false } }`. En
      feilkonfigurert miljøvariabel gir tom side i stedet for feil, uten varsling.
      Spesielt: `data.refresh_token` leses aldri ved token-refresh. Verifisert
      26. august 2026 at Strava returnerer samme token som før, så dette er en
      latent risiko, ikke et aktivt problem — men det gjelder begge
      integrasjonene hvis leverandøren begynner å rotere.
      Strava-utfallet over sto udetektert i ~8 uker nettopp fordi ingenting
      varsler.
- [ ] **`FadeIn` animerer fra `opacity: 0`.** Et element på eksakt 0 males
      aldri, så Lighthouse belaster hele faden som LCP render delay.
      `0.01` er visuelt identisk. (Dokumentert i `open-base`-changeloggen.)
- [ ] **Mangler infrastrukturlaget** familien ellers har: `vercel.json` med
      sikkerhetsheadere, `og.png` (delinger blir bare tekst), favicon,
      `robots.txt`, `sitemap.xml`, `llms.txt`. CSP-en må skrives for hånd her —
      malens `default-src 'self'` er for stram for Sanity CDN, `i.scdn.co` og
      embedded Studio.

## Drift

### Oppsett på ny maskin
```bash
git clone https://github.com/christianlunde/lunde-io.git
cd lunde-io && npm install
```
Deretter: legg `.env.local` i roten (overføres sikkert — AirDrop/1Password,
**aldri** chat/e-post). Den er gitignored og har 8 nøkler:
`NEXT_PUBLIC_SANITY_PROJECT_ID` (cdambab2), `NEXT_PUBLIC_SANITY_DATASET`
(production), `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`,
`SPOTIFY_REFRESH_TOKEN`, `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`,
`STRAVA_REFRESH_TOKEN`. Produksjon er uavhengig — Vercel har egne kopier.

### Daglig arbeid
- `npm run dev` — lokal utvikling (localhost:3000)
- `npm run build` — kjør alltid før push; skal være feilfri
- Innhold redigeres i Studio på `/studio` (embedded — skjemaendringer deployes
  sammen med siten, ingen separat Sanity-deploy)
- Bytter du branch og får rare typefeil: `rm -rf .next` (stale cache)
- Henger git med `index.lock`-feil: `rm -f .git/index.lock`
- `node_modules` på ~870 MB er normalt (Next.js-binærfiler + Sanity Studio)

### Deploy-sjekkliste
1. Endringer på `preview` → commit → push → sjekk preview-URL
2. Delte filer som også trengs på main:
   `git checkout main && git checkout preview -- <filene> && commit && push`
3. Actions-fanen på GitHub viser deploy-status

### Fallgruver ved deploy

- **Ikke kjør `vercel deploy --prod` fra CLI her.** Husregelen i
  `~/Projects/CLAUDE.md` gjelder de statiske open-verktøyene. I dette
  prosjektet er push til `main` releasen — en CLI-deploy sender arbeidstreet
  ditt rett til lunde.io utenom CI, og står du på `preview` dytter du hele den
  fulle siden ut i produksjon.
- **Git-identiteten i dette repoet er `christian@christianlunde.com`** (lokal
  override; global er `c@lunde.io`). Vercel avviser CLI-deploys der
  commit-forfatteren ikke er verifisert på kontoen — derfor blanker workflowen
  `GIT_AUTHOR_*`. CI takler det; en CLI-deploy vil ikke gjøre det.
- **Vercel-planen bygger én deployment om gangen på hele kontoen.** Deployer du
  et annet prosjekt samtidig, står lunde-io i kø og viser UNKNOWN. Det er
  normalt — ikke avbryt og prøv på nytt.

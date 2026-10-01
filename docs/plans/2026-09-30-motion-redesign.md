# Motion Redesign — "Things that open"

**Date:** 2026-09-30
**Status:** Homepage, product pages, brand details and Labs implemented

## Direction

Calm craft. The studio is called Blossom, so the motion idea is *opening*:
things start as a closed point and unfold with purpose, once, then get out of
the way. Principles:

1. **Open from a point, don't slide in.** Reveals unmask or unfold from their origin.
2. **Every product demos itself.** Motion explains, it doesn't decorate.
3. **One signature moment per page.** Everything else stays quiet.
4. **Performance is part of the craft.** CSS first, tiny JS, reduced-motion
   gets a designed still frame (not just `duration: 0`).

## System

All tokens live in `src/styles/tokens.css` (kept separate from `global.css`
so other surfaces can reuse them).

| Token | Value | Use |
| --- | --- | --- |
| `--ease-bloom` | `cubic-bezier(0.22, 1, 0.36, 1)` | Entrances, confident deceleration |
| `--ease-soft` | `cubic-bezier(0.33, 0, 0.2, 1)` | Loops, ambient drift, colour |
| `--ease-spring` | `linear(…)` ≈ 5% overshoot | Tactile moments: petals, presses, snaps |
| `--dur-micro` / `--dur-ui` / `--dur-story` | 160 / 320 / 900ms | Feedback / interface / narrative |

Product hues (`--color-hue-{violet,gold,sky,ember}`) are declared with
`@theme static` because components select them by name at runtime. Each product
sets `hue` in its frontmatter; violet remains the studio colour.

`.reveal` is a scroll-driven entrance (`animation-timeline: view()`), gated by
`@supports` and `prefers-reduced-motion`, so unsupported browsers simply see
content in place. `--reveal-start` staggers siblings.

## Homepage (implemented)

- **Hero mark** (`BlossomMark.astro`): the logo glyph at hero scale, one petal
  per product hue. Petals open from the bud with the spring easing, then
  breathe slowly and lean toward the pointer (fine pointers only; a rAF-throttled
  write of two custom properties, eased in CSS).
- **Headline:** each line rises out of its own mask; a hand-drawn underline
  draws in under "well." Transform-only, no opacity fade on the headline.
- **Spotlight:** hovering a product in the "Now growing" row quiets the other
  petals and lifts that product's petal — pure CSS via `:has()`.
- **Product cards:** each stage plays a short CSS/SVG loop of the product doing
  its job (TCGIQ Fair Range, FaviGrab favicon grab, Lock In session). Loops
  pause off screen via IntersectionObserver. Numbers tick using registered
  `@property` integers + CSS counters. The un-animated state of each loop is a
  meaningful still, which is what reduced-motion visitors see.

## Product pages (implemented)

- **Card → page morph:** native cross-document View Transitions
  (`@view-transition { navigation: auto }` in `global.css`). The card stage and
  name share `view-transition-name`s (`stage-<slug>`, `name-<slug>`) with the
  product hero, so they glide into place; the header is named too so it holds
  still. Chosen over Astro's `<ClientRouter />` because the router swaps
  `<html>` attributes (dropping `data-theme`) and would require every script to
  re-initialise on `astro:page-load`. Unsupported browsers (Firefox today) and
  reduced-motion visitors get a normal navigation.
- **Hero:** two columns; the product's own demo loop plays at hero scale in a
  hue-shadowed frame (`ProductStage.astro`, shared with the cards).
- **Feature walkthrough** (`FeatureWalkthrough.astro`, replaces `FeatureGrid`):
  on large screens a sticky index tracks the feature in the middle band of the
  viewport (a small IntersectionObserver sets `data-active`), with a hue
  progress line; features brighten as they cross the centre via a scroll-driven
  animation. "(Pro)" in a description renders as a pill. Mobile gets a plain
  spaced list.
- Story, Updates and closing CTA share the same 4/7 editorial grid.

## Brand details (implemented)

- **Theme toggle:** the blossom glyph is open by day; at night its petals fold
  onto one centre and fill in, reading as a small moon beside two stars.
- **Header logo:** petals part slightly on hover.
- **Blog:** post-card titles share `view-transition-name: post-<slug>` with the
  post's H1, so they morph on navigation; the list eases in with staggered
  scroll reveals. Posts get a reading stem in the right-hand column, bound to
  the post body's view timeline (`timeline-scope: --post`), which fills as you
  read and blooms over the last stretch — in the related product's hue.
  Hidden where scroll-driven animations aren't supported.
- **404:** "This page lost a petal." One petal drifts to the ground, leaving a
  dashed outline; the resting frame doubles as the reduced-motion state.
- **OG image:** `public/og-default.png` (1200×630), rendered from HTML with
  the brand font — headline, blossom in product hues, product row.

## Next

- Labs (below).
- Products index hero to match the homepage.
- Per-feature demo states in the walkthrough, if it earns it.

## Labs — `labs.blossomstudios.dev` (implemented)

A separate static Astro app in `labs/`, deployed as its own Vercel project
(Root Directory `labs`) on the subdomain. See `labs/README.md` for adding an
experiment and the one-time Vercel setup.

- **Adding an experiment:** drop self-contained HTML in
  `labs/public/x/<slug>/index.html` and a short Markdown file in
  `labs/src/content/experiments/<slug>.md` (title, summary, date, hue,
  status, tags, optional thumbnail/notes). `url:` links out to an experiment
  hosted elsewhere. The build fails with a clear message if the HTML is
  missing.
- **Index:** newest first, numbered chronologically ("No. 001"); the newest
  card is featured full-width. **Viewer** (`/<slug>/`): the experiment in a
  sandboxed iframe (opaque origin by default; `sandbox: same-origin` opts in
  for trusted code needing storage), "Open full screen" for the raw file,
  notes below. Card thumbnails morph into the viewer frame (cross-document
  view transitions), as on the main site.
- **Isolation:** experiments ship in their own deploy, so nothing in Labs can
  slow or break blossomstudios.dev. The main site excludes `labs/` from its
  TypeScript and Tailwind scanning.
- **Shared brand:** Labs imports `../src/styles/tokens.css` directly, so it
  always matches the studio site; dependencies are pinned to the main site's
  versions.
- **Seed experiment:** No. 001 Petal Field — click or drag to plant blossoms
  that open on a spring and breathe; one HTML file, no libraries.

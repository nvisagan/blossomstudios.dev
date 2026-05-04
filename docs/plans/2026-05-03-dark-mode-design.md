# Dark Mode Design

**Date:** 2026-05-03
**Status:** Approved, ready for implementation plan

## Context

The site is currently single-theme (light only). The light theme is distinctively *warm* — off-white surface (`#fafaf9`), warm raised tier (`#f5f4f1`), warm borders. Dark mode should preserve that warmth rather than flip to a generic neutral charcoal.

The styling foundation is well-suited for theme switching: every component already consumes CSS variables via Tailwind v4's `@theme` directive in `src/styles/global.css`. Components reference tokens like `bg-surface`, `text-ink`, `border-border` — never raw hex values. This means a token-override strategy can deliver dark mode with zero component-level code changes.

## Goals

- Add a warm dark mode that mirrors the personality of the light theme.
- Respect the visitor's OS preference on first load.
- Give visitors a manual toggle to override and stick to one mode.
- Prevent flash-of-wrong-theme on page load (FOUC).
- Preserve accessibility: contrast, reduced-motion, keyboard-operable toggle.

## Non-Goals

- No per-component `dark:` utility classes — token overrides handle it.
- No three-state picker (light / dark / follow-system). Two-state toggle only.
- No animated cross-page theme transition (subtle in-place fade only).
- No theming of brand color across light/dark identity beyond minor luminance bump.

## Design

### 1. Control mechanism

A `data-theme` attribute on `<html>` with two values: `light`, `dark`.

Resolution order on every page load:
1. `localStorage.theme` if set (visitor explicitly chose).
2. Otherwise, OS preference via `window.matchMedia('(prefers-color-scheme: dark)')`.

A small inline script in `<head>` (before any styles render) runs synchronously to read the preference and set `data-theme`. This prevents FOUC on first paint and on every navigation.

For visitors who haven't chosen yet (no `localStorage.theme`), a `matchMedia` change listener flips the theme live when their OS theme changes. As soon as the toggle is clicked, the explicit choice is persisted and OS changes no longer affect them.

### 2. Token strategy

Keep all existing token names (`--color-surface`, `--color-ink`, `--color-accent`, etc.). Override their values inside `[data-theme="dark"]`. No component code changes.

Proposed warm-dark palette:

| Token | Light | Dark (warm) |
|---|---|---|
| `--color-surface` | `#fafaf9` | `#13110f` |
| `--color-surface-raised` | `#f5f4f1` | `#1c1a17` |
| `--color-surface-overlay` | `#eeedea` | `#252320` |
| `--color-ink` | `#0f0f0f` | `#f5f3ef` |
| `--color-ink-muted` | `#6b6b6b` | `#a8a39c` |
| `--color-ink-faint` | `#a3a3a3` | `#6e6964` |
| `--color-accent` | `#7c5cfc` | `#9d83ff` |
| `--color-accent-hover` | `#6a47f0` | `#b29eff` |
| `--color-accent-light` | `#ece8ff` | `rgba(157, 131, 255, 0.14)` |
| `--color-border` | `#e8e6e3` | `#2a2724` |
| `--color-border-hover` | `#d4d1cc` | `#3a3631` |

Special case: the `prose pre` code-block background currently uses `var(--color-ink)` — a flip would make code blocks light-on-dark in dark mode. Pin the code-block background to a fixed near-black (`#0a0908`) in both modes so code stays code.

### 3. Toggle UI

A single icon-only button placed in the header, immediately before the desktop nav links and inside the mobile menu on small screens.

- Round-rectangle, ~36×36px tap target, matches existing `rounded-lg` nav-link aesthetic.
- Moon icon when in light mode (click → dark). Sun icon when in dark mode (click → light).
- 200ms icon swap (subtle scale/rotate). Honors `prefers-reduced-motion`.
- `aria-label` toggles to "Switch to dark mode" / "Switch to light mode".
- `title` tooltip mirrors the aria-label.

### 4. Transitions

180ms `transition: background-color, color, border-color` on `body` and primary surface elements when the theme flips. Existing hover transitions are unaffected.

`@media (prefers-reduced-motion: reduce)` overrides the transition to `none` and the icon-swap to instant.

### 5. Persistence + cross-tab sync

- On toggle click: write `'light'` or `'dark'` to `localStorage.theme`, update `data-theme` on `<html>`, swap icon.
- A `storage` event listener syncs the choice across open tabs of the site.
- For visitors in implicit (OS-following) mode, a `matchMedia` change listener flips the theme live.

### 6. Files touched

- `src/styles/global.css` — add `[data-theme="dark"]` overrides, pin code-block bg, reduced-motion safeguards, theme-transition rules.
- `src/components/Head.astro` — inject inline FOUC-prevention script.
- `src/components/Header.astro` — render the toggle button (desktop + mobile menu).
- `src/components/ThemeToggle.astro` — **new** component: button markup + client script.

## Risks & Open Questions

- **Accent contrast in dark mode**: `#9d83ff` on `#13110f` should comfortably exceed WCAG AA for text. Will verify with a contrast check during implementation.
- **OG image / external embeds**: the favicon and OG image are static and won't theme — acceptable for v1.
- **Image assets in MDX content**: prose currently has no inverted-image treatment. Not an issue today (no embedded images in existing posts/products) but worth flagging if we ship screenshots later.

## Verification

- Visit `/`, `/products/`, `/products/tcgiq/`, `/blog/` and a blog detail page — both modes render with correct token values.
- First load with no `localStorage.theme` and OS in dark: site renders dark immediately, no flash.
- Click toggle: theme flips, choice persists across reload.
- Open second tab, toggle there: first tab updates via `storage` event.
- macOS Appearance flip while on the page in implicit mode: theme follows live.
- DevTools `prefers-reduced-motion: reduce`: transitions are instant.
- Lighthouse accessibility check on a representative page in both modes: no contrast regressions.

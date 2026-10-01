# Blossom Labs

`labs.blossomstudios.dev` — one-shot experiments, sketches and small ideas.
A separate static Astro app that shares the main site's brand tokens
(`../src/styles/tokens.css`).

## Add an experiment

1. **Drop the experiment in** `public/x/<slug>/index.html`.
   Any self-contained HTML works (inline CSS/JS, or files next to it in the
   same folder). It's served as-is at `/x/<slug>/`.
2. **Describe it** in `src/content/experiments/<slug>.md`:

   ```md
   ---
   title: My Experiment
   summary: One or two sentences for the card.
   date: 2026-10-01
   hue: sky            # violet | gold | sky | ember
   status: sketch      # sketch | prototype | graduated
   tags: [motion]
   thumbnail: /x/my-experiment/thumb.png   # optional, 16:10 works best
   ---

   Optional notes, shown under the experiment.
   ```

3. Commit. That's it — it appears on the index (newest first, numbered in
   order of date) with its own page at `/<slug>/`.

Hosted elsewhere? Skip step 1 and add `url: https://…` to the frontmatter;
the card links out instead of embedding.

### Sandbox

Experiments run in a sandboxed iframe with an opaque origin: scripts work,
but they can't read cookies or storage on this domain. If an experiment you
trust needs `localStorage`, set `sandbox: same-origin`. "Open full screen"
always loads the raw file directly.

## Develop

```sh
npm install
npm run dev     # http://localhost:4322
npm run build
```

## Deploy (Vercel, one-time)

1. New Project → import this repo → **Root Directory: `labs`**
   (framework preset: Astro). Keep "Include files outside the root
   directory in the Build Step" enabled — Labs imports the shared tokens.
2. Project → Settings → Domains → add `labs.blossomstudios.dev`, and create
   the DNS record Vercel shows (a `CNAME` to `cname.vercel-dns.com`).

Dependencies are pinned to the same versions as the main site; upgrade
both together.

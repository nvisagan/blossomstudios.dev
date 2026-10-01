---
title: Petal Field
summary: Click or drag to plant blossoms. Each one opens from the bud on a spring, in the four studio hues, then breathes.
date: 2026-10-01
hue: violet
status: sketch
tags: [motion, svg]
thumbnail: /x/petal-field/thumb.png
---

## Why

The Blossom mark opens on the homepage once. This asks what happens if you
let people plant as many as they like.

## How it works

- Each blossom is a tiny SVG of four circles, the same geometry as the logo.
- Petals open with a CSS `linear()` spring easing, staggered by 70ms, then
  breathe on a slow alternating loop.
- Overlaps use `mix-blend-mode: multiply` by day and `screen` at night.
- The field caps at 90 blossoms; the oldest wilt away as new ones arrive.
- No libraries, no canvas, one HTML file.

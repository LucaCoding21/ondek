# Motion Language Handoff — OnDek Animation System

You are being handed the motion and animation language from an existing site (OnDek, a Next.js marketing site) so you can apply it to THIS project. Your job has two phases:

1. **Audit this codebase first.** Inventory the pages and sections, the current animation setup (if any), the framework, and how components are structured. Do not write any animation code until you have a map of what exists and where each pattern below would land.
2. **Implement the motion system** described here, adapted to this site's structure. Match the *feel and rules*, not necessarily the exact class names.

---

## Stack

- **GSAP 3.15+** with **`@gsap/react`** (`useGSAP` hook) and **ScrollTrigger**
- **Lenis 1.3+** for site-wide smooth scrolling, driven by GSAP's ticker (see "Smooth scroll" below — the ticker wiring is load-bearing)
- Hero entrances are **CSS-only keyframes** (keeps LCP unblocked); everything else is GSAP
- Install: `npm i gsap @gsap/react lenis`

If this project is not React/Next, keep the same timings/easings and port the patterns to vanilla GSAP.

## Global rules (non-negotiable)

1. **Every GSAP animation lives inside `gsap.matchMedia()`** gated on `(prefers-reduced-motion: no-preference)`. GSAP writes inline styles, so a global reduced-motion CSS rule can't stop it. Reduced-motion users must get every section static and fully visible. Also add the global CSS kill-switch for CSS animations:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
       scroll-behavior: auto !important;
     }
   }
   ```
2. **Entrance reveals fire once** (`once: true` on the ScrollTrigger). Nothing replays on scroll-up.
3. **Fail visible.** For large images whose trigger might never fire, animate `y` only — no `opacity`. A missed trigger then leaves the element slightly offset, not invisible.
4. **Trigger off the element, not the section.** Each animated cluster gets its own ScrollTrigger so tall layouts don't fire everything at once.
5. **Use `useGSAP(() => {...}, { scope: ref })`** in every component and class-name selectors scoped to that ref. Return `() => mm.revert()` from the callback.
6. **No pinning for entrances.** Pins/scrubs are reserved for genuinely scroll-driven set pieces.

## Easing vocabulary

This is the voice of the site. Do not invent new curves.

| Ease | Use |
|---|---|
| `power3.out` | Default for every fade-up reveal (the workhorse — used ~100 times) |
| `power4.out` | Masked headline rises only |
| `power2.out` | Small quiet moves (micro-fades, the knock in the recoil) |
| `back.out(2.2)`–`back.out(2.4)` | The "pop": elements scaling in from 0 with overshoot (avatars, icons, small badges) |
| `elastic.out(1.1, 0.4)` | The "recoil": springy return after something gets knocked |
| `none` | All scroll scrubs |
| CSS `cubic-bezier(0.16, 1, 0.3, 1)` | Expo-out for CSS keyframe entrances and hover wipes |

Durations: reveals 0.8–1.0s; micro-moves 0.1–0.25s; recoil settles ~0.7s. Staggers: 0.1–0.14s. ScrollTrigger starts: `"top 78%"` for headings, `"top 82–85%"` for body content.

---

## The signature moves

### 1. Masked headline rise (the site's most-repeated move)

Every major `h1`/`h2` is split where the thought breaks, each line wrapped in its own `overflow-hidden` mask, and rises out of it.

```tsx
<h2 className="qs-heading ...">
  <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
    <span className="qs-heading-line block">Ready for a deck</span>
  </span>
  <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
    <span className="qs-heading-line block">that lasts?</span>
  </span>
</h2>
```

The `pb-[0.1em] -mb-[0.1em]` pair gives descenders room inside the mask without changing layout.

```js
gsap.from(".qs-heading-line", {
  yPercent: 115,
  duration: 1,
  ease: "power4.out",
  stagger: 0.14,
  scrollTrigger: { trigger: ".qs-heading", start: "top 78%", once: true },
});
```

### 2. The pop with recoil (the avatar move you're copying)

Small round elements (profile photos, badges) pop in one after another with overshoot, and **each landing physically knocks the neighboring text sideways, which then springs back elastically**. This is the "recoil" — the pop has weight.

```js
const tl = gsap.timeline({
  scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
});

// Text arrives quietly first so the pops have something to knock into
tl.from(".cp-text", { opacity: 0, y: 8, duration: 0.6, ease: "power2.out" });

PHOTOS.forEach((_, i) => {
  const popAt = 0.2 + i * 0.35; // pops land 0.35s apart
  tl.from(`.cp-avatar-${i}`, { scale: 0, duration: 0.8, ease: "back.out(2.2)" }, popAt)
    // the knock: sharp 5px shove timed to the pop's overshoot peak
    .to(".cp-text", { x: 5, duration: 0.12, ease: "power2.out" }, popAt + 0.2)
    // the recoil: springy elastic return
    .to(".cp-text", { x: 0, duration: 0.7, ease: "elastic.out(1.1, 0.4)" }, ">");
});
```

Markup notes: avatars are `size-8 rounded-full` in a `-space-x-2.5` overlap row with a 2px ring matching the panel background, `aria-hidden` on the row (decorative). Each avatar needs its own class (`cp-avatar-0/1/2`) so the pops sequence individually.

For standalone icon/element pops without the knock, use `scale: 0, ease: "back.out(2.4)"`.

### 3. Fade-up reveal (the workhorse)

```js
gsap.from(targets, {
  y: 24–60,        // small text 24–28, cards 32, big images 60 (bigger element = deeper rise)
  opacity: 0,
  duration: 0.8–0.9,
  ease: "power3.out",
  stagger: 0.12,   // when revealing a group of siblings
  scrollTrigger: { trigger: el, start: "top 82%", once: true },
});
```

Build a reusable `<Reveal>` wrapper (props: `stagger` selector, `delay`, `y`, default y=40, duration 0.9) and use it for low-ceremony sections; hand-write timelines only for set pieces.

### 4. Hero: CSS entrance + GSAP scroll parallax

Entrance is CSS-only so it never blocks LCP, desktop-only (`@media (min-width: 1025px)`):

```css
@keyframes hero-rise { from { transform: translateY(105%); } to { transform: translateY(0); } }
@keyframes hero-fade-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
/* Choreography: headline line 1 @0.2s, line 2 @0.33s (0.9s, cubic-bezier(0.16,1,0.3,1)),
   paragraph @0.5s, CTAs @0.64s, bottom strip @0.95s (0.7s ease-out) */
```

Headline lines use the same overflow-mask markup as move #1. Then GSAP owns only the scroll-out scrub:

```js
gsap.timeline({
  scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.5 },
})
  .to(".hero-img-wrap", { scale: 1.1, ease: "none" }, 0)   // image grows
  .to(".hero-copy", { yPercent: -14, ease: "none" }, 0);   // copy leads the scroll — depth separation
```

Clip the image wrapper (`overflow-hidden`) so the scale never spills.

### 5. Scroll scrubs and builds

- **ScrollScale**: a reusable wrapper that scrubs `scale` 0.94 → 1 → 0.94 as the element crosses the viewport (`start: "top bottom"`, `end: "bottom top"`, `scrub: 0.6`). Desktop + no-reduced-motion only — on touch it reads as jitter.
- **Scrubbed builds** (multi-part illustrations assembling): a timeline with `scrub: 0.8`, `start: "top 70%"`, `end: "+=60%"` (viewport-relative so the build takes the same scroll distance at any render size). Parts arrive with `fromTo` (`autoAlpha: 0, yPercent: -6` → visible), each offset `i * 0.75` so arrivals overlap instead of ticking one-by-one. Use `fromTo`, not `from`, so the hidden start state is written before first paint.

### 6. Hover micro-interactions (CSS, not GSAP)

- **Color-wipe CTA buttons**: the fill sweeps in from the left on hover and keeps traveling out through the right on leave (momentum, not a rubber band). Animate only `background-size` with an instant `background-position` swap:
  ```css
  .btn-wipe {
    background-color: var(--cta);
    background-image: linear-gradient(var(--dark), var(--dark));
    background-repeat: no-repeat;
    background-position: 100% 0%;
    background-size: 0% 100%;
    transition: background-size 0.55s cubic-bezier(0.16, 1, 0.3, 1), color 0.25s ease-out;
  }
  .btn-wipe:hover:not(:disabled) {
    background-position: 0% 0%;
    background-size: 100% 100%;
    color: var(--cta);
  }
  ```
- **Nav links**: 1px underline grows from the left, `width 0 → 100%` over 0.25s ease.
- **Card arrows**: `transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5` (diagonal nudge).
- Simple color transitions: `250ms ease`.

## Smooth scroll (Lenis + GSAP ticker)

One site-wide client component. The wiring details all matter:

```js
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // no inertia at all

const lenis = new Lenis({ anchors: true });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000)); // gsap reports seconds, lenis wants ms
gsap.ticker.lagSmoothing(0); // lag smoothing desyncs scrubs from real scroll position
```

Drive Lenis from GSAP's ticker (never a separate rAF loop — scrubs end up a frame behind). If this is a Next.js App Router site, also reset Lenis to top on route change (`lenis.scrollTo(0, { immediate: true })` when pathname changes, skipping initial load so reload restoration and #hash landings keep position).

---

## Phase 1: the audit (do this first)

Produce a short written map before touching code:

1. **Stack**: framework, existing animation libs, CSS approach, client/server component boundaries.
2. **Section inventory**: for each page, list sections top to bottom and classify each: hero / headline block / card grid / social-proof row / image feature / CTA panel / scroll set piece candidate.
3. **Assignment**: map each section to one pattern above. Rough guide: every major heading → masked rise (#1); body copy, cards, images → fade-up (#3), staggered when siblings; any avatar row, logo row, badge cluster, or star-rating → pop with recoil (#2); hero → #4; at most one or two scrubbed set pieces per page (#5); all buttons/links → #6.
4. **Flag risks**: existing transforms that GSAP would clobber, `overflow` clipping that masks need, images loaded lazily inside triggers, existing scroll libraries to remove.

Present the map, then implement.

## Phase 2: implementation order

1. Global CSS (reduced-motion kill-switch, btn-wipe, nav underline) + Lenis smooth scroll
2. `<Reveal>` and `<ScrollScale>` primitives
3. Hero (CSS entrance + scrub)
4. Masked headline rises across all major headings
5. Section reveals (fade-ups with staggers)
6. The pop-with-recoil moments (use sparingly — 1–2 per page; it's a highlight, not wallpaper)
7. Set-piece scrubs last, only where content earns them

## Taste rules

- Restraint: one ease family per job, no rotation/blur/skew entrances, no bounce except the deliberate pop/recoil moments.
- Motion hierarchy: the bigger the element, the deeper the rise (text 24px, cards 32px, hero images 60px).
- Choreography beats simultaneity: within a section, headline first, copy ~0.1–0.2s behind, media on its own trigger.
- Everything settles: no animation ends abruptly; the long-tail `*.out` curves are the identity of the site.
- Never animate layout properties. Transforms and opacity only (plus `background-size` for the wipe).

# Feature: Self‑Hosted Fonts (Work Sans + Space Grotesk)

**Status:** Ready for implementation
**Owners:** Tech Lead (build), QA (tests), PM (scope)
**Why:** Eliminate third‑party font calls, avoid consent banner, improve LCP, ensure legal clarity.

---

## Goals

- Use **Work Sans** for headlines/highlights and **Space Grotesk** for body/sub‑heads.
- Self‑host variable **WOFF2** only. No remote font CDNs.
- Zero client‑side storage on first paint; no cookies/localStorage required for fonts.
- Document licensing (OFL 1.1) and keep notices in repo.
- Ship with a smoke test proving **no third‑party requests** and **no cookies** on first load.

## Scope

- Implement local font delivery for Work Sans and Space Grotesk using `next/font/local`.
- Ensure `@font-face` uses local WOFF2 sources only; no external font hosts.
- Update Tailwind to expose `font-display` and `font-sans` families.
- Provide `/typography` page for visual verification of weights.
- Update Privacy to reflect font and tracking posture for first paint.

## Non‑Goals

- No auto subsetting in this pass (optional later).
- No theme persistence (use `prefers-color-scheme` for now).
- No analytics.

## Acceptance Criteria

- Fonts are loaded via `next/font/local` with `display: swap`.
- Tailwind exposes families as `font-display` (Work Sans) and `font-sans` (Space Grotesk).
- `/typography` route renders a weight ramp to verify variable axis.
- Playwright E2E confirms: 0 cookies after first navigation and 0 third‑party requests.
- `THIRD_PARTY_NOTICES.md` and each family’s `OFL.txt` are present.
- Privacy page states: _No cookies, self‑hosted fonts, no third‑party requests on first load._
- Explicitly verified: **no third-party network on first paint**; **@font-face uses local WOFF2**; **licenses included**.

---

## Manual Tasks (You)

### M1 — Download variable fonts + licenses

- Source variable **WOFF2** files for both families.
- Save each family’s `OFL.txt` license text.

**Validation:** Files are variable WOFF2, not TTF; `OFL.txt` present for each family.

### M2 — Add to repo

Place files exactly:

```
/public/fonts/work-sans/WorkSans-VariableFont_wght.woff2
/public/fonts/work-sans/OFL.txt
/public/fonts/space-grotesk/SpaceGrotesk-VariableFont_wght.woff2
/public/fonts/space-grotesk/OFL.txt
```

**Validation:** `pnpm dev` serves them at `/fonts/...`; no 404s.

### M3 — Optional subsetting (later if needed)

- Keep a backup of originals.
- Use `pyftsubset` to trim to Latin if budgets require.
- Re‑test rendering across pages.

### M4 — Update Privacy page

- Add a short statement: _No cookies or similar storage on first load. Fonts are self‑hosted. No third‑party requests on first load. Third‑party embeds load only after explicit user action._

---

## Cursor Agent Tasks (Repo Automation)

### A1 — Create spec doc

Create `docs/features/fonts-self-hosting.md` (this file) if missing; fill scope, AC, rollback.

### A2 — Create branch

Branch: `feat/fonts-local`.

### A3 — Font loader (`app/fonts.ts`)

Add `next/font/local` loaders and CSS variables:

```ts
// app/fonts.ts
import localFont from "next/font/local";

export const workSans = localFont({
  src: [
    {
      path: "/fonts/work-sans/WorkSans-VariableFont_wght.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-work-sans",
  display: "swap",
});

export const spaceGrotesk = localFont({
  src: [
    {
      path: "/fonts/space-grotesk/SpaceGrotesk-VariableFont_wght.woff2",
      weight: "300 700",
      style: "normal",
    },
  ],
  variable: "--font-space-grotesk",
  display: "swap",
});
```

**Validation:** Build succeeds; preload links and `@font-face` injected by Next.

### A4 — Wire in layout

Apply CSS vars at root:

```tsx
// app/layout.tsx
import "./globals.css";
import { workSans, spaceGrotesk } from "./fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${workSans.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

**Validation:** `document.documentElement.className` contains both variables.

### A5 — Tailwind mapping

Extend Tailwind families:

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";
export default {
  theme: {
    extend: {
      fontFamily: {
        display: [
          "var(--font-work-sans)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        sans: [
          "var(--font-space-grotesk)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
} satisfies Config;
```

**Validation:** `font-display` and `font-sans` render with the expected families.

### A6 — Typography usage

- Ensure `h1,h2` use `font-display`.
- Ensure body text uses `font-sans`.

### A7 — Example page

Create `/typography` route to visualize styles and weights:

```tsx
// app/typography/page.tsx
export default function Typography() {
  return (
    <main className="prose mx-auto p-6">
      <h1 className="font-display text-5xl">Work Sans — Display</h1>
      <h2 className="font-display text-3xl">Heading Level 2</h2>
      <p className="font-sans text-base leading-7">
        Space Grotesk — body text.
      </p>
      <section className="mt-8 grid grid-cols-2 gap-3">
        {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((w) => (
          <div key={w} className="font-display" style={{ fontWeight: w }}>
            Work Sans weight {w}
          </div>
        ))}
      </section>
    </main>
  );
}
```

**Validation:** All weights render from a single variable file.

### A8 — Accessibility smoke

Run axe (or `@axe-core/playwright`) on `/` and `/typography` to ensure no serious violations.

### A9 — Playwright E2E: no 3P and no cookies

Add test:

```ts
// tests/no-cookies-no-3p.spec.ts
import { test, expect } from "@playwright/test";

test("no third-party requests or cookies on first paint", async ({
  page,
  context,
}) => {
  const thirdParty: string[] = [];
  page.on("request", (req) => {
    const u = new URL(req.url());
    const isHttp = u.protocol === "http:" || u.protocol === "https:";
    const isLocal =
      u.hostname.endsWith("localhost") || u.hostname.endsWith("funkspace.de");
    if (isHttp && !isLocal) thirdParty.push(u.hostname);
  });

  await page.goto("/");
  expect(
    thirdParty,
    `3P calls detected: ${thirdParty.join(", ")}`,
  ).toHaveLength(0);

  const cookies = await context.cookies();
  expect(cookies.length).toBe(0);
});
```

**Validation:** Test passes locally and in CI.

### A10 — Notices

Create `THIRD_PARTY_NOTICES.md` listing both families, license (OFL 1.1), and link to `public/fonts/**/OFL.txt`.

### A11 — Cursor command

Create `.cursor/commands/fonts-setup.md` with repeatable steps to run lint, typecheck, E2E, and open the preview.

### A12 — PR & CI

Open PR `feat(fonts): self-host Work Sans + Space Grotesk`, ensure CI runs lint, types, unit and the E2E above. Merge when green.

---

## QA Checklist

- [ ] Headings use `font-display`; body uses `font-sans`.
- [ ] Only local WOFF2 files are requested on first load.
- [ ] Zero cookies on first navigation.
- [ ] `/typography` shows correct weights without layout shift.
- [ ] Axe: no serious issues.
- [ ] Notices and licenses included.

---

## Performance & Maintenance

- Consider subsetting later with `pyftsubset` to reduce WOFF2 size.
- Monitor LCP/CLS on preview after merge.
- Keep original full variable files in version control.

---

## Rollback Plan

- Revert branch `feat/fonts-local` and remove font loader.
- Restore previous Tailwind `fontFamily` values.
- Remove `/typography` route and the E2E test if it blocks hotfixes.

---

## Notes for Future Extensions

- Introduce typographic tokens (sizes/line-height/letter-spacing) via Style Dictionary and map them in Tailwind.
- Add Storybook Typography page for design review.
- If theme persistence is desired, gate any storage behind explicit user action and document it.

# CLAUDE.md

## What this is

A single-page, mobile-first "link tree" for flamenco guitarist **Juanito Pascual**,
plus a QR-code generator for his merch booth. People at a show scan a QR code,
land on this page, tap a payment button to preorder the album, and tap the gold
button to join the mailing list.

Built for Juanito by a friend (the repo owner). Juanito is **not** a developer —
every decision here favors "he can fix a typo on his phone" over elegance.

- **Album:** *Gold & Rose* — a flamenco celebration of Jimi Hendrix.
  Out February 2027 on Motéma Music. Singles late 2026.
- **Trio:** Juanito Pascual (guitar), Brad Barrett (bass), Tupac Mantilla (percussion).
- **Related site:** his EPK lives at <https://juanitopascualepk.netlify.app/>;
  his main site is <https://juanitopascual.com>. This repo is neither — it is the
  one-tap booth page only. Don't grow it into a second website.

## Layout

```
config.js      ALL editable content. The only file a non-developer touches.
index.html     Markup shell + every style rule. No build step.
app.js         Renders config.js into the page. Pure DOM, no framework.
qr/make-qr.js  `npm run qr -- <url>` -> SVG, PNGs, printable sheet in qr/out/
vercel.json    Static deploy config.
README.md      Step-by-step setup written for Juanito, not for an engineer.
```

## Hard rules

1. **No build step. No framework. No bundler. No npm dependency in the page.**
   The page must open correctly by double-clicking `index.html` on any machine,
   forever, with no toolchain installed. Only `qrcode` (a devDependency, used by
   the CLI script) is allowed, and it never ships to the browser.
2. **All content lives in `config.js`.** If you add a feature, add its knobs
   there with a `// TODO:` comment explaining exactly what to paste in. Never
   hard-code a URL, price, or name into `app.js` or `index.html`.
3. **Placeholders must never render as live buttons.** `app.js` has a `live()`
   guard: a URL that is empty or still contains the string `TODO` is dropped and
   listed in the red setup banner. Keep that guard intact — a dead PayPal link at
   a merch booth costs a real sale.
4. **Payments are peer-to-peer, by design.** PayPal.Me / Venmo / Cash App. There
   is no backend, no cart, no order database, and no card data ever touches this
   page. Don't add a server. If real checkout is ever wanted, that's a Stripe
   Payment Link pasted into `config.js` as one more payment entry — still no backend.
5. **Because P2P payments carry no shipping address**, the page shows a
   `shipNote` telling buyers to also join the mailing list. The Google Form is
   how Juanito learns where to ship. Don't remove that coupling without
   replacing it with something that actually collects an address.

## Mobile constraints that are not negotiable

This is used one-handed, in a dark venue, on bad cell service, by people holding
a drink. So:

- Every tappable thing is at least **58px** tall (`--tap`).
- Max content width **460px**; it is a phone page first and merely survives desktop.
- Total page weight stays tiny — the only external request is Google Fonts, and
  the page is fully readable if that request fails.
- Respect `prefers-reduced-motion` (already wired) and `env(safe-area-inset-*)`.
- Text on the wine background must stay high-contrast. The palette is
  deep wine `#1a0d12`, gold `#d8ae5f`, rose `#c2566e`, warm paper `#f6eee6`.
  Flamenco-and-Hendrix, not neon.

## QR rules

- Always generate at error-correction level **H** and pure black on pure white.
  Do not brand, tint, or gradient the QR itself — low contrast is the number one
  reason a code fails to scan under stage lighting.
- Ship vector (`qr.svg`) for anything printed; PNG is for screens only.
- After generating, the code must be **physically scan-tested**: a real phone,
  about three feet away, in dim light, and again after printing.

## Changing the live URL

The QR code encodes a URL. Once codes are printed, **that URL can never change.**
If the Vercel domain has to move, keep the old URL alive as a redirect rather
than reprinting signage mid-tour.

## Commands

```bash
npm run dev                          # serve locally at http://localhost:3000
npm run qr -- https://the-live-url   # regenerate QR assets into qr/out/
npx vercel --prod                    # deploy
```

## Before any show — checklist

- [ ] Every `TODO` in `config.js` replaced; red setup banner gone.
- [ ] Each payment button tapped on a real phone and it opens the right app
      with the right account name showing.
- [ ] Mailing-list form submitted once end-to-end; the row appears in the sheet.
- [ ] QR scanned off the printed page, in dim light, from three feet.
- [ ] Page checked on both an iPhone and an Android, portrait and landscape.

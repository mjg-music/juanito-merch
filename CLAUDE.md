# CLAUDE.md

## What this is

A single-page, mobile-first merch-booth page for flamenco guitarist **Juanito
Pascual**, plus a QR-code generator. People at a show scan a code on the merch
table, see what's for sale and what it costs, pay with Venmo/PayPal/cash/check,
and join the mailing list.

Built for Juanito by a friend (the repo owner). Juanito is **not** a developer —
every decision favors "he can fix a typo on his phone" over elegance.

- **Business entity:** checks are payable to **Three Columns Music**.
- **Upcoming album:** *Gold & Rose*, a flamenco celebration of Jimi Hendrix.
  Motéma Music, February 2027. Presale details still TBD — the page shows a
  "coming soon" row for it rather than a price.
- **Related sites:** the EPK is at <https://juanitopascualepk.netlify.app/> and
  his main site is <https://juanitopascual.com>. This repo is neither; it is the
  one-tap booth page only. Don't grow it into a second website.

## Layout

```
config.js      ALL editable content: merch, prices, payment handles, QR targets.
               The only file a non-developer touches.
index.html     Markup shell + every style rule. No build step.
app.js         Renders config.js into the page. Pure DOM, no framework.
qr/make-qr.js  `npm run qr` -> one SVG + two PNGs per QR target, plus a
               printable sheet. Reads its URLs from config.js.
vercel.json    Static deploy config.
README.md      Setup steps written for Juanito, not for an engineer.
```

## Hard rules

1. **No build step. No framework. No bundler. No npm dependency in the page.**
   The page must open correctly by double-clicking `index.html`, forever, with
   no toolchain installed. Only `qrcode` (a devDependency used by the CLI) is
   allowed, and it never ships to the browser.
2. **All content lives in `config.js`.** New features add their knobs there with
   a `// TODO:` comment saying exactly what to paste in. Never hard-code a URL,
   price, or title into `app.js` or `index.html`.
3. **Placeholders must never render as live buttons.** `app.js` and
   `make-qr.js` share a `live()` / `isTodo()` guard: a URL that is empty or
   still contains `TODO` is dropped, listed in the red setup banner, and skipped
   by the generator. Keep that intact — a dead payment link at a booth is a lost
   sale with no second chance.
4. **Payments are peer-to-peer and in-person, by design.** There is no cart, no
   backend, no order database, and no card data touches this page. Don't add a
   server. The page is a *price list plus payment handles*; the actual
   transaction happens in Venmo, in PayPal, or hand-to-hand.
5. **Amounts are never pre-filled.** CDs are bundle-priced (1/$20, 2/$30,
   3/$40), so the total depends on what the buyer picks. The page shows the
   tiers; the buyer types the amount in their payment app. Don't add
   `?amount=` parameters — they'd be wrong more often than right.

## Payment-method specifics

- **Venmo** — `@Juanito-Pascual`, linked as `https://venmo.com/u/Juanito-Pascual`.
  The `/u/` form is the current profile-link format. Works as a link and as a QR.
- **PayPal** — he has `jp@jpascual.com`, which is an **email, not a username**.
  PayPal.Me links require a username and PayPal does not auto-create one, so
  **no PayPal link or QR code can exist yet.** Until he claims one at
  <https://paypal.me/my/settings>, the page renders PayPal as a `type: "copy"`
  row: the address shown as selectable text with a Copy button. When he has a
  username, swap that block for a `type: "link"` and add a `paypal` entry to
  `qr.codes`. The `config.js` comment spells this out.
- **Cash and check** — `type: "info"` rows. No button, no link; just the
  instruction, with the check payee in bold.

## Email list

Juanito's own site already has an **"Email List Sign-up"** section at
<https://juanitopascual.com/contact>. The page and the `email` QR code both
point there. **Don't build a form, a Google Form, or a mailing-list integration** —
he already has one, and a second list would fragment his audience.

Consequence worth knowing: because the signup is on his site and payment happens
in a payment app, **nothing here captures a shipping address.** That's fine while
sales are hand-to-hand at a booth. If mail-order presales ever happen, that
needs solving deliberately — don't assume the current setup covers it.

## Mobile constraints that are not negotiable

Used one-handed, in a dark venue, on bad cell service, by people holding a drink.

- Every tappable thing is at least **58px** tall (`--tap`).
- Max content width **460px**; a phone page first, which merely survives desktop.
- The only external request is Google Fonts; the page is fully readable if it fails.
- Single committed dark palette — deep wine `#1a0d12`, gold `#d8ae5f`, rose
  `#c2566e`, warm paper `#f6eee6`. It deliberately does **not** follow the
  viewer's light theme, because it's read in a dim room. Keep `color-scheme: dark`
  on `:root`.
- Respect `prefers-reduced-motion` and `env(safe-area-inset-*)` (both wired).
- Prices use `font-variant-numeric: tabular-nums` so the menu column aligns.

## QR rules

- Always level **H** error correction, pure black on pure white. Never brand,
  tint, or gradient the code — low contrast is the number one reason a printed
  code fails under stage lighting.
- Ship vector (`.svg`) for anything printed; PNG is for screens only.
- `qr.codes` in `config.js` drives the generator. Each entry is either
  `use: "siteUrl"` (the deployed page) or a literal `url`.
- Codes must be **physically scan-tested** after printing: real phone, three
  feet, dim light.

## The URL is frozen once printed

A QR code is a URL rendered as pixels — static, with no redirect layer. Once
signage is printed, **that URL can never change.** The page it points to can be
edited freely forever. So: finalize the Vercel domain *before* generating codes,
and if hosting ever has to move, keep the old URL alive as a redirect rather
than reprinting signage mid-tour.

## Commands

```bash
npm run dev                          # serve locally at http://localhost:3000
npm run qr                           # build QR codes from config.js
npm run qr -- https://some-url       # same, overriding qr.siteUrl
npx vercel --prod                    # deploy
```

## Before any show — checklist

- [ ] Every `TODO` in `config.js` replaced; red setup banner gone from the page.
- [ ] Prices on the page match what Juanito is actually charging that night.
- [ ] Venmo button tapped on a real phone — opens the app on *his* profile.
- [ ] PayPal address copies correctly (or is a real link, if he claimed a username).
- [ ] Mailing-list button lands on the signup section, not a 404.
- [ ] Each printed code scanned in dim light from three feet.
- [ ] Page checked on both an iPhone and an Android.

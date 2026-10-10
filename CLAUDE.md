# CLAUDE.md

## What this is

A single-page, mobile-first merch-booth page for flamenco guitarist **Juanito
Pascual**, plus a QR-code generator. People at a show scan a code on the merch
table, see what's for sale and what it costs, pay with Venmo/PayPal/cash/check,
and join the mailing list.

Built for Juanito by a friend (the repo owner). Juanito is **not** a developer —
every decision favors "he can fix a typo on his phone" over elegance.

- **First show this is for:** Saturday **October 10, 2026**, 8 PM, Granada
  Theater, 3022 Hennepin Ave S, Minneapolis — with dancers from Zorongo Flamenco
  Dance Theater. The page carries this in `config.show`; update or null it out
  after the date passes, since a stale show line is worse than none.
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
- **PayPal** — he has `jp@jpascual.com`, which is an **email, not a username**,
  and in PayPal it resolves to the business name **Three Columns Music**. No
  tap-to-pay PayPal link can exist until Juanito does one of two things (each
  ~2 min): claim a PayPal.Me username at <https://paypal.me/my/settings>, or
  make an in-person QR code in the PayPal Business app (More → Get paid with
  QR codes) and send the image. Either value goes in `paypalLink` at the top of
  `config.js`; that single switch flips the row from `type: "copy"` to a real
  button *and* makes `npm run qr` build a `paypal` sign. Until then the row
  shows the address with a Copy button and says it shows up as Three Columns
  Music, so the buyer isn't thrown by an unfamiliar name at checkout.

  **Dead ends, verified Oct 2026 — don't re-try them:** the legacy
  `paypal.com/cgi-bin/webscr?cmd=_xclick&business=EMAIL` link does take an
  email, but PayPal deprecated it in Jan 2026 and it stops working around
  Jan 2027 — a printed sign would outlive the link. PayPal's replacement
  ("Payment Links & Buttons") needs a PayPal script loaded into the page,
  which violates the zero-third-party-requests rule. PayPal blocks headless
  browsers with a captcha, so neither can be verified from a script anyway —
  a real phone tap is the only test that counts.
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

Used one-handed, in a dark venue, on bad cell service, on an iPhone, by people
holding a drink — and by an audience that skews older than the web's defaults
assume. Optimize for the fifty-five-year-old in row G, not for a benchmark.

- **Zero third-party requests.** The display font is self-hosted in
  `assets/fonts/`; body text uses the system stack, which is San Francisco on
  an iPhone and costs nothing to load. Never reintroduce a Google Fonts link or
  any other external host — venue wifi is the enemy, and a page that needs
  another domain to render is a page that can fail at the booth.
- **First-load budget: ~100KB over 6 same-origin requests.** If a change pushes
  past that, something else comes out. Images are sized for their actual slot
  (the 124px portrait ships at 360px for 3x retina, not 800px).
- Every tappable thing is at least **62px** tall (`--tap`); pills and the copy
  button are 46px. Apple's floor is 44px — don't go under it anywhere.
- **Body text is 16px and secondary text is 14px**, deliberately larger than a
  typical marketing page. Don't shrink type to fit more in; cut content instead.
- All text passes WCAG AA against the *lightest* point of the background
  gradient, which is the worst case. Verified ratios are in the commit for
  "Optimize for iPhone"; re-check with that script if the palette changes.
- Max content width **460px**; a phone page first, which merely survives desktop.
- Single committed dark palette — deep wine `#1a0d12`, gold `#dcb468`, rose
  `#c2566e`, warm paper `#faf4ee`. It deliberately does **not** follow the
  viewer's light theme, because it's read in a dim room. Keep `color-scheme: dark`.
- `-webkit-text-size-adjust: 100%` so iOS doesn't reflow the type, and
  `touch-action: manipulation` on tappables to drop the 300ms delay **without**
  disabling pinch-zoom — older viewers rely on pinch-zoom, so never add
  `maximum-scale` or `user-scalable=no` to the viewport meta.
- Respect `prefers-reduced-motion` and `env(safe-area-inset-*)` (both wired).
- Prices use `font-variant-numeric: tabular-nums` so the menu column aligns.
- The portrait ships as `<picture>` with WebP + JPEG and explicit
  `width`/`height`, so nothing shifts as it loads.

## Keep it uncrowded

Juanito is not especially technical, and neither is much of his audience. Every
element on this page costs attention at a moment when someone is standing in a
loud room deciding whether to buy a CD. The bar for adding anything is high.
Cash and check share one row for exactly this reason. Before adding a section,
delete one.

## The print page

`print/` is generated by `npm run qr` and **committed**, because it is served as
part of the site at `<site>/print/`. That page is Juanito's: he opens it on his
phone and prints his own signage without going through anyone.

It is one document doing two jobs. `.screen` elements are the download page;
`.paper` elements are the signage, revealed only inside `@media print`. So
there is exactly one URL to remember and no separate PDF to keep in sync. The
QR codes are inline SVG in both views, so printing never waits on an image
fetch and never prints a blurry raster.

Write its copy for someone who does not think of himself as technical: short
numbered steps, no jargon, and never reference a file path or a terminal. It is
`noindex`, since it is for him, not for Google.

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
- [ ] PayPal: Copy puts `jp@jpascual.com` on the clipboard — or, if `paypalLink`
      is filled, the button opens PayPal with him as the recipient.
- [ ] Mailing-list button lands on the signup section, not a 404.
- [ ] Each printed code scanned in dim light from three feet.
- [ ] Page checked on both an iPhone and an Android.

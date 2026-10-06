# Juanito Pascual — merch booth page

**Live: <https://mjg-music.github.io/juanito-merch/>**
**Juanito's print page: <https://mjg-music.github.io/juanito-merch/print/>**

One page on a phone. People scan a QR code at the booth, see what's for sale and
what it costs, pay however they like, and join the mailing list.

No accounts to manage, no backend, no monthly cost.

---

## What's already filled in

From Juanito's notes, all of this is **done** in `config.js`:

- **CDs** — 1/$20, 2/$30, 3/$40 · *New Flamenco Trio*, *Language of the Heart*, *Cosas en Común*
- **Method book** — *The Total Flamenco Guitarist*, $25
- **New album presale** — shows a "details coming soon" line until there's real info
- **Venmo** — `@Juanito-Pascual`, live button and QR code
- **Cash** and **check** — check payee shown as *Three Columns Music*
- **Mailing list** — points at the Email List Sign-up on juanitopascual.com/contact

## What's still needed

### 1. A PayPal.Me username — Juanito has to do this

`jp@jpascual.com` is an email address, and **PayPal links only work from a
username.** PayPal doesn't create one automatically, so there's no way to make a
PayPal button or QR code from an email alone.

**Juanito:** go to <https://paypal.me/my/settings>, click Create, and pick a
username (`juanitopascual` if it's free). Takes about two minutes. Send Mike the
link it gives you.

Until then the page shows the PayPal address with a **Copy** button, so people
can still send money manually — it just takes them a few more taps.

### 2. T-shirts — if they're happening

Need sizes and a price. There's a commented-out block in `config.js` showing
exactly where it goes.

### 3. Presale details — when they exist

Right now the New Album section just says "details coming soon". When there's a
price and a date, that block becomes a normal priced row.

---

## Setup

### It's already online

The site is hosted free on GitHub Pages at
<https://mjg-music.github.io/juanito-merch/>, straight from this repo's `main`
branch. **To publish a change, just push it:**

```bash
git add -A && git commit -m "what changed" && git push
```

It goes live in about a minute. There is nothing to deploy and nothing to log
into.

The repo is public, which is what free GitHub Pages requires. There are no
passwords or keys in it — just the page and the QR script.

### Make the QR codes

```bash
npm run qr
```

It reads the URLs straight out of `config.js` and builds **three** codes:

| Code | Goes to |
|---|---|
| `booth` | the merch page (the main one for the table) |
| `email` | the mailing-list signup, straight to his site |
| `venmo` | his Venmo profile |

A `paypal` code gets added automatically once his PayPal.Me link is in `config.js`.

For each one you get `name.svg` (vector, for print), `name-print.png` (2400px,
large signs), and `name-screen.png` (600px, for Instagram or a text).

Everything lands in `print/`, which is part of the site. That means
**<https://mjg-music.github.io/juanito-merch/print/> is Juanito's own page** —
send him that link and he can print his own signs from a phone or laptop,
forever, without asking anyone. One button prints a full-page table tent for
each code plus a page of six hand-out cards; the download links give him the
image files for a print shop.

If a URL is still a placeholder, that code is skipped and the script tells you
which one.

---

## Changing something later

Edit `config.js`, then:

```bash
git add -A && git commit -m "updated prices" && git push
```

The URL stays the same, so **printed QR codes keep working.** Change prices, add
a title, swap the photo mid-tour — the signs on the table don't need reprinting.

> ⚠️ The one thing you must not change is the **URL**. A QR code is that URL,
> physically printed; there's no redirect in between. If hosting ever has to
> move, set up a redirect from the old address instead of reprinting everything.

---

## Add a photo (optional)

Drop a square photo at `assets/portrait.jpg` — about 800×800, under 300KB. Skip
it and a gold **JP** monogram shows instead; it looks intentional, so no rush.

---

## Night-of checklist

- [ ] Red setup notice is gone from the page
- [ ] Prices on the page match what he's actually charging
- [ ] Tapped the Venmo button on a real phone — opens the app on *his* profile
- [ ] Tapped Copy on the PayPal row — the address actually copies
- [ ] Mailing-list button lands on the signup section, not a 404
- [ ] Scanned each **printed** code from three feet away in dim light
- [ ] Looked at the page on an iPhone and an Android
- [ ] Table tent printed, cards cut, and a pen and paper for anyone who'd
      rather write their email down

## Preview locally

```bash
npm run dev     # http://localhost:3000
```

Or just double-click `index.html`.

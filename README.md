# Juanito Pascual — merch booth preorder page

One page on a phone. People scan a QR code at the booth, tap to pay, tap to
join the mailing list. That's the whole thing.

No accounts to manage, no backend, no monthly cost.

---

## Setup — about 20 minutes, once

### 1. Fill in `config.js`

Open `config.js`. Every line you need to change is marked `TODO`. You need:

| What | Where to get it | Looks like |
|---|---|---|
| PayPal link | paypal.com → **PayPal.Me** → claim your link | `https://paypal.me/juanitopascual` |
| Venmo username | Venmo app → Me → the `@name` under your photo | `juanito-pascual` (no `@`) |
| Cash App cashtag | Cash App → profile → your `$Cashtag` | `$juanitopascual` |

Until a value is filled in, that button is **hidden** and a red notice appears
at the top of the page reminding you. Nothing broken ever shows to a customer.

### 2. Make the mailing-list form

1. Go to <https://forms.google.com> → blank form.
2. Title it something like *Juanito Pascual — Mailing List*.
3. Add these questions:
   - **Email** (short answer, required)
   - **First name** (short answer)
   - **Mailing address** (paragraph) — *add this one if people are preordering
     a physical CD or vinyl; it's how you know where to ship it*
   - **Which did you order?** (multiple choice: CD / Vinyl / Just the mailing list)
4. Click **Send** → the 🔗 link icon → **Shorten URL** → **Copy**.
5. Paste it into `emailFormUrl` in `config.js`.

Responses collect in a Google Sheet you own (Responses tab → the green sheet
icon). Export to CSV any time to import into Mailchimp later.

### 3. Add a photo (optional)

Drop a square photo at `assets/portrait.jpg` — roughly 800×800, under 300KB.
Skip it and a gold **JP** monogram shows instead.

### 4. Put it online

```bash
npx vercel          # first run: it asks you to log in, then press Enter through the prompts
npx vercel --prod   # publish
```

Vercel prints your live URL, something like
`https://juanito-preorder.vercel.app`. **Write it down — the QR code bakes it in.**

Want a nicer address? In the Vercel dashboard → your project → Settings →
Domains, you can rename it to e.g. `juanitopascual-preorder.vercel.app` for free.
**Do this before printing QR codes.**

### 5. Make the QR codes

```bash
npm run qr -- https://your-live-url-from-step-4
```

That writes into `qr/out/`:

- **`print-sheet.html`** ← start here. Open it in a browser, press **Cmd+P**,
  choose *Save as PDF*. Page 1 is a big table-tent sign for the merch table.
  Page 2 is six wallet-sized cards to hand out — print on cardstock, cut on the
  dashed lines.
- `qr.svg` — vector. Give this to a print shop for banners or posters.
- `qr-print.png` — 2400px, for large signage.
- `qr-screen.png` — for Instagram stories, texts, or a slide.

---

## Changing something later

Edit `config.js`, then:

```bash
npx vercel --prod
```

The URL stays the same, so **already-printed QR codes keep working.** You can
change prices, add a Spotify link, or swap the photo mid-tour and the signs on
the table don't need reprinting.

> ⚠️ The one thing you must not change is the **URL** itself. The QR code is
> that URL, physically printed. If it ever has to move, set up a redirect from
> the old address instead of reprinting everything.

---

## Night-of checklist

- [ ] Red setup notice is gone from the page
- [ ] Tapped every payment button on a real phone — each opens the right app
      showing *your* name
- [ ] Filled out the mailing-list form yourself; the row showed up in the sheet
- [ ] Scanned the **printed** QR from three feet away in dim light
- [ ] Looked at the page on an iPhone and an Android
- [ ] Table tent printed, cards cut, a pen nearby for the people who'd rather
      write their email on paper

## Preview locally

```bash
npm run dev     # http://localhost:3000
```

Or just double-click `index.html`.

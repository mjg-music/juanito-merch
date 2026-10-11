#!/usr/bin/env node
/* ============================================================
   QR codes and the print page for the merch booth.

     npm run qr                          read URLs from config.js
     npm run qr -- https://the-live-url  same, but override siteUrl

   Everything lands in print/ , which is part of the site. So once it's
   pushed, Juanito can open

     <site>/print/

   on any phone or computer and print his own signs without asking
   anyone. The page itself is built by qr/signs.js; this file makes the
   codes and hands them over.

   Per code it writes:
     <name>.svg          vector — for a designer or print shop
     <name>-print.png    2400px — large signs
     <name>-screen.png   600px  — social / texts

   Error correction is level H (highest), so a code still scans with a
   crease, a thumb-smudge, or a drink ring on it.
   ============================================================ */

const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
// Inside the site, so it deploys with everything else.
const OUT = path.join(ROOT, 'print');

/* --- read config.js without a bundler ---------------------------------- */
function loadConfig() {
  const src = fs.readFileSync(path.join(ROOT, 'config.js'), 'utf8');
  const sandbox = { window: {} };
  new Function('window', src)(sandbox.window);
  if (!sandbox.window.SITE) throw new Error('config.js did not define window.SITE');
  return sandbox.window.SITE;
}

// Config holds HTML entities for the page; the console wants plain text.
function plain(s) {
  return String(s || '')
    .replace(/&amp;/g, '&').replace(/&mdash;/g, '—').replace(/&uacute;/g, 'ú')
    .replace(/&middot;/g, '·').replace(/&ldquo;/g, '"').replace(/&rdquo;/g, '"');
}

const SITE = loadConfig();
const cfg = SITE.qr || {};
const siteUrl = process.argv[2] || cfg.siteUrl || '';
const isTodo = u => !u || !/^https?:\/\//.test(u) || /TODO/i.test(u);

/* --- resolve every code entry ------------------------------------------ */
const entries = (cfg.codes || []).map(c => ({
  file: c.file,
  label: c.label,
  sub: c.sub,
  note: c.note,
  // `anchor` lands a siteUrl code partway down the page, e.g. anchor:"pay"
  // opens the booth page scrolled to the payment options.
  url: c.use === 'siteUrl'
    ? siteUrl + (c.anchor ? '#' + String(c.anchor).replace(/^#/, '') : '')
    : c.url
}));

// No PayPal code, even once paypalLink is set. Three codes at one table
// confused people at the Saturday show; PayPal is one tap from the booth
// code, and its address is printed in words on the signs.

const ready = entries.filter(e => !isTodo(e.url));
const blocked = entries.filter(e => isTodo(e.url));

if (!ready.length) {
  console.error(`
No QR codes could be built — every URL is still a placeholder.

  Set qr.siteUrl in config.js to the real site URL, or pass one:
    npm run qr -- https://your-site-url
`);
  process.exit(1);
}

const opts = {
  errorCorrectionLevel: 'H',
  margin: 3,
  // Pure black on pure white, always. Low contrast is the number one reason a
  // printed code fails to scan under venue lighting — never brand the code.
  color: { dark: '#000000', light: '#FFFFFF' }
};

// The printed URL is a fallback for someone typing it by hand, and nobody
// hand-types an anchor. The QR still carries the full link including #...,
// so the code lands on the sign-up box while the text stays typeable.
const pretty = u => u.replace(/^https?:\/\//, '').replace(/#.*$/, '').replace(/\/$/, '');

const printPage = require('./signs');

/* --- build -------------------------------------------------------------- */
(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const built = [];
  for (const e of ready) {
    const svg = await QRCode.toString(e.url, { ...opts, type: 'svg', width: 1000 });
    fs.writeFileSync(path.join(OUT, `${e.file}.svg`), svg);
    await QRCode.toFile(path.join(OUT, `${e.file}-print.png`), e.url, { ...opts, width: 2400 });
    await QRCode.toFile(path.join(OUT, `${e.file}-screen.png`), e.url, { ...opts, width: 600 });
    built.push({ ...e, svg });
  }

  // Remove files left behind by codes that have since been taken out of
  // config.js, so print/ only ever holds what the page links to.
  const keep = new Set(['index.html']);
  for (const b of built) ['.svg', '-print.png', '-screen.png'].forEach(x => keep.add(b.file + x));
  const gone = fs.readdirSync(OUT).filter(f => !keep.has(f) && /\.(svg|png|html)$/.test(f));
  gone.forEach(f => fs.unlinkSync(path.join(OUT, f)));

  fs.writeFileSync(path.join(OUT, 'index.html'), printPage({ SITE, codes: built, pretty }));

  console.log(`\nBuilt ${built.length} QR code${built.length === 1 ? '' : 's'} in print/\n`);
  if (gone.length) console.log(`  (removed old files: ${gone.join(', ')})\n`);
  for (const b of built) console.log(`  ${b.file.padEnd(8)} ${b.url}`);

  if (blocked.length) {
    console.log('\nSkipped (URL still a placeholder):');
    for (const b of blocked) console.log(`  ${b.file} — ${plain(b.label)}`);
  }

  const base = (siteUrl || '').replace(/\/$/, '');
  console.log(`
Juanito's print page:  ${base ? base + '/print/' : 'print/index.html'}

Push the repo and that page is live for him — he can print his own
signs from a phone or a laptop without asking anyone.
`);
})().catch(err => { console.error(err); process.exit(1); });

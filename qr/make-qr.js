#!/usr/bin/env node
/* ============================================================
   QR code generator for the merch booth.

     npm run qr                          read URLs from config.js
     npm run qr -- https://the-live-url  same, but override siteUrl

   Builds one set of codes per entry in `qr.codes` in config.js, into
   qr/out/ :

     <name>.svg          vector — use for anything printed
     <name>-print.png    2400px — large signs
     <name>-screen.png   600px  — social / slides
     print-sheet.html    open in a browser, Cmd+P -> Save as PDF

   Error correction is level H (highest), so a code still scans with a
   crease, a thumb-smudge, or a drink ring on it.
   ============================================================ */

const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(__dirname, 'out');

/* --- read config.js without a bundler ---------------------------------- */
function loadConfig() {
  const src = fs.readFileSync(path.join(ROOT, 'config.js'), 'utf8');
  const sandbox = { window: {} };
  new Function('window', src)(sandbox.window);
  if (!sandbox.window.SITE) throw new Error('config.js did not define window.SITE');
  return sandbox.window.SITE;
}

// Config holds HTML entities so the page can render them; print sheets are
// HTML too, but the console output should read as plain text.
function plain(s) {
  return String(s || '')
    .replace(/&amp;/g, '&').replace(/&mdash;/g, '—').replace(/&uacute;/g, 'ú')
    .replace(/&ldquo;/g, '"').replace(/&rdquo;/g, '"').replace(/&nbsp;/g, ' ');
}

const SITE = loadConfig();
const cfg = SITE.qr || {};
const override = process.argv[2];
const siteUrl = override || cfg.siteUrl || '';

const isTodo = u => !u || !/^https?:\/\//.test(u) || /TODO/i.test(u);

/* --- resolve every code entry ------------------------------------------ */
const entries = (cfg.codes || []).map(c => ({
  file: c.file,
  label: c.label,
  url: c.use === 'siteUrl' ? siteUrl : c.url
}));

// Once a PayPal.Me username exists in config.js, its QR code builds itself.
const ppUser = String(SITE.paypalUsername || '').trim()
  .replace(/^@/, '').replace(/^https?:\/\//, '')
  .replace(/^(www\.)?paypal\.me\//i, '').replace(/\/+$/, '');

if (ppUser && !entries.some(e => e.file === 'paypal')) {
  entries.push({
    file: 'paypal',
    label: 'Pay by PayPal',
    url: 'https://paypal.me/' + ppUser
  });
}

const ready = entries.filter(e => !isTodo(e.url));
const blocked = entries.filter(e => isTodo(e.url));

if (!ready.length) {
  console.error(`
No QR codes could be built — every URL is still a placeholder.

  Set qr.siteUrl in config.js to the real Vercel URL, or pass one:
    npm run qr -- https://your-site.vercel.app
`);
  process.exit(1);
}

const opts = {
  errorCorrectionLevel: 'H',
  margin: 3,
  // Pure black on pure white, always. Low contrast is the number one reason
  // a printed code fails to scan under venue lighting — never brand the code.
  color: { dark: '#000000', light: '#FFFFFF' }
};

const pretty = u => u.replace(/^https?:\/\//, '').replace(/\/$/, '');

/* --- printable sheet ---------------------------------------------------- */
function sheet(codes) {
  const tent = c => `
  <div class="page">
    <div class="tent">
      <h1>Juanito Pascual</h1>
      <p class="sub">${c.label}</p>
      <div class="qr">${c.svg}</div>
      <p class="cap">Scan with your phone camera</p>
      <p class="url">${pretty(c.url)}</p>
    </div>
    <p class="hint">Table tent — ${plain(c.label)}</p>
  </div>`;

  // Hand-out cards for the main booth code only; six to a page.
  const main = codes[0];
  const cards = `
  <div class="page">
    <div class="grid">
      ${Array.from({ length: 6 }).map(() => `<div class="card">
        <div class="name">Juanito Pascual</div>
        <div class="qr">${main.svg}</div>
        <div class="cap">${main.label}</div>
        <div class="url">${pretty(main.url)}</div>
      </div>`).join('')}
    </div>
    <p class="hint">Hand-out cards — print on cardstock, cut the dashed lines</p>
  </div>`;

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>Juanito Pascual — QR print sheet</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,500&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<style>
  @page { size: letter; margin: 0.4in; }
  * { box-sizing: border-box; }
  body { margin:0; background:#fff; color:#111; font-family:Inter,sans-serif; }
  .page { padding:0.2in; page-break-after:always; }
  .page:last-child { page-break-after:auto; }

  .tent { height:9.9in; border:2px solid #111; border-radius:18px;
          padding:0.5in 0.4in; display:flex; flex-direction:column;
          align-items:center; justify-content:center; gap:0.26in; text-align:center; }
  .tent h1 { font-family:"Cormorant Garamond",serif; font-size:44pt;
             font-weight:600; line-height:1; margin:0; }
  .tent .sub { font-family:"Cormorant Garamond",serif; font-style:italic;
               font-size:20pt; margin:0; color:#5a3a44; }
  .tent .qr { width:4.4in; height:4.4in; }
  .tent .cap { font-size:13pt; font-weight:600; margin:0; }
  .tent .url { font-size:10.5pt; color:#666; margin:0; }

  .grid { height:9.9in; display:grid; grid-template-columns:1fr 1fr;
          grid-template-rows:repeat(3,1fr); }
  .card { border:1px dashed #bbb; padding:0.2in; display:flex;
          flex-direction:column; align-items:center; justify-content:center;
          gap:7px; text-align:center; }
  .card .name { font-family:"Cormorant Garamond",serif; font-size:15pt;
                font-weight:600; line-height:1; }
  .card .qr { width:1.75in; height:1.75in; }
  .card .cap { font-size:7.5pt; color:#444; line-height:1.3; max-width:2.3in; }
  .card .url { font-size:6.5pt; color:#888; }

  .hint { margin:6px 0 0; font-size:8pt; color:#999; text-align:center; }
  @media print { .hint { display:none; } }
</style></head>
<body>
${codes.map(tent).join('')}
${cards}
</body></html>`;
}

/* --- build -------------------------------------------------------------- */
(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const built = [];
  for (const e of ready) {
    const svg = await QRCode.toString(e.url, { ...opts, type: 'svg', width: 1000 });
    fs.writeFileSync(path.join(OUT, `${e.file}.svg`), svg);
    await QRCode.toFile(path.join(OUT, `${e.file}-print.png`), e.url, { ...opts, width: 2400 });
    await QRCode.toFile(path.join(OUT, `${e.file}-screen.png`), e.url, { ...opts, width: 600 });
    built.push({ ...e, svg, label: plain(e.label) });
  }

  fs.writeFileSync(path.join(OUT, 'print-sheet.html'), sheet(built));

  console.log(`\nBuilt ${built.length} QR code${built.length === 1 ? '' : 's'} in qr/out/\n`);
  for (const b of built) {
    console.log(`  ${b.file.padEnd(8)} ${b.label}`);
    console.log(`  ${''.padEnd(8)} ${b.url}\n`);
  }

  if (blocked.length) {
    console.log('Skipped (URL still a placeholder):');
    for (const b of blocked) console.log(`  ${b.file} — ${plain(b.label)}`);
    console.log('');
  }

  console.log(`  print-sheet.html   open it, then Cmd+P -> Save as PDF

Before the show: scan each printed code with a real phone, about three
feet away, in dim light.
`);
})().catch(err => { console.error(err); process.exit(1); });

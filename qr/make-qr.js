#!/usr/bin/env node
/* ============================================================
   QR code generator for the merch booth.

     npm run qr                          read URLs from config.js
     npm run qr -- https://the-live-url  same, but override siteUrl

   Everything lands in print/ , which is part of the site. So once it's
   pushed, Juanito can open

     <site>/print/

   on any phone or computer and print his own signs, or download the
   image files, without asking anyone. That page is both the download
   page on screen AND the printable signage when you hit Print — the
   screen furniture is hidden by the print stylesheet.

   Per code it writes:
     <name>.svg          vector — for a print shop
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
  note: c.note,
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
    note: 'Opens PayPal to send money.',
    url: 'https://paypal.me/' + ppUser
  });
}

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

const pretty = u => u.replace(/^https?:\/\//, '').replace(/\/$/, '');

/* --- the page ----------------------------------------------------------
   One document doing two jobs: a download page on screen, and the actual
   signage when printed. Anything class="screen" is hidden on paper, and
   anything class="paper" is hidden on screen.                           */
function page(codes) {
  const artist = plain(SITE.artist || '');
  const show = SITE.show || {};
  const showLine = [plain(show.venue), (show.dates || []).map(plain).join('  ·  ')]
    .filter(Boolean).join('  ·  ');

  const card = c => `
    <section class="code">
      <div class="qrbox">${c.svg}</div>
      <div class="meta">
        <h2>${c.label}</h2>
        ${c.note ? `<p class="note">${c.note}</p>` : ''}
        <p class="url">${pretty(c.url)}</p>
        <div class="dl">
          <a class="btn" href="${c.file}-print.png" download>Download image</a>
          <a class="btn ghost" href="${c.file}.svg" download>For a print shop</a>
        </div>
      </div>
    </section>`;

  const tent = c => `
  <div class="sheet tent">
    <h1>${artist}</h1>
    ${showLine ? `<p class="where">${showLine}</p>` : ''}
    <div class="qr">${c.svg}</div>
    <p class="cap">${c.label}</p>
    <p class="scan">Scan with your phone camera</p>
    <p class="link">${pretty(c.url)}</p>
  </div>`;

  const main = codes[0];
  const cards = `
  <div class="sheet cards">
    ${Array.from({ length: 6 }).map(() => `<div class="handcard">
      <div class="name">${artist}</div>
      <div class="qr">${main.svg}</div>
      <div class="cap">${main.label}</div>
      <div class="link">${pretty(main.url)}</div>
    </div>`).join('')}
  </div>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${artist} — Print your QR codes</title>
<meta name="robots" content="noindex">
<meta name="theme-color" content="#1a0d12">
<link rel="apple-touch-icon" href="../assets/apple-touch-icon.png">
<link rel="preload" href="../assets/fonts/cormorant-600.woff2" as="font" type="font/woff2" crossorigin>
<style>
  @font-face{
    font-family:"Cormorant Garamond";
    font-style:normal;font-weight:600;font-display:swap;
    src:url("../assets/fonts/cormorant-600.woff2") format("woff2");
  }
  :root{
    --ink:#1a0d12;--gold:#dcb468;--gold-bright:#f4d79a;--rose-soft:#eda7b7;
    --paper:#faf4ee;--muted:#d2bcc4;--line:rgba(220,180,104,.26);
    --display:"Cormorant Garamond",Georgia,serif;
    --body:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,system-ui,sans-serif;
    color-scheme:dark;
  }
  *{box-sizing:border-box}
  html{-webkit-text-size-adjust:100%}
  body{
    margin:0;font-family:var(--body);font-size:16px;line-height:1.5;
    color:var(--paper);background:
      radial-gradient(120% 70% at 50% -10%,#3a1a26 0%,transparent 60%),
      var(--ink);
    background-attachment:fixed;-webkit-font-smoothing:antialiased;
  }
  a,button{touch-action:manipulation}
  .wrap{
    max-width:620px;margin:0 auto;
    padding:clamp(26px,6vw,46px) 18px calc(48px + env(safe-area-inset-bottom));
  }
  h1.title{
    font-family:var(--display);font-weight:600;
    font-size:clamp(32px,8vw,42px);line-height:1.05;margin:0 0 10px;
    text-wrap:balance;
  }
  .lede{font-size:16px;color:var(--muted);margin:0 0 26px;line-height:1.55}

  .how{
    border:1px solid var(--line);border-radius:14px;
    padding:18px 20px;margin:0 0 26px;background:rgba(250,244,238,.04);
  }
  .how h2{
    font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
    color:var(--muted);margin:0 0 12px;
  }
  .how ol{margin:0;padding-left:22px}
  .how li{margin:0 0 9px;line-height:1.55}
  .how li:last-child{margin-bottom:0}
  .how b{color:var(--gold-bright)}

  .print-all{
    display:flex;align-items:center;justify-content:center;gap:10px;
    width:100%;min-height:64px;padding:16px 22px;margin:0 0 34px;
    font:inherit;font-size:19px;font-weight:600;
    color:#20101a;cursor:pointer;
    background:linear-gradient(140deg,var(--gold) 0%,#c99a4c 100%);
    border:1px solid var(--gold-bright);border-radius:15px;
    box-shadow:0 10px 28px -14px rgba(220,180,104,.75);
  }
  .print-all:active{filter:brightness(1.06)}
  .print-all svg{width:22px;height:22px}

  .code{
    display:flex;gap:18px;align-items:center;
    border:1px solid var(--line);border-radius:15px;
    padding:18px;margin:0 0 14px;background:rgba(250,244,238,.04);
  }
  .qrbox{
    flex:none;width:122px;height:122px;padding:8px;
    background:#fff;border-radius:10px;
  }
  .qrbox svg{width:100%;height:100%;display:block}
  .meta{flex:1;min-width:0}
  .meta h2{font-size:19px;font-weight:600;margin:0 0 4px;line-height:1.25}
  .note{font-size:14px;color:var(--muted);margin:0 0 6px;line-height:1.45}
  .url{
    font-size:13px;color:var(--rose-soft);margin:0 0 12px;
    word-break:break-all;line-height:1.4;
  }
  .dl{display:flex;flex-wrap:wrap;gap:8px}
  .btn{
    display:inline-block;padding:11px 16px;min-height:46px;line-height:24px;
    font-size:15px;font-weight:600;text-decoration:none;
    color:var(--gold-bright);background:rgba(220,180,104,.14);
    border:1px solid var(--line);border-radius:999px;
  }
  .btn.ghost{background:transparent;color:var(--muted)}
  .btn:active{filter:brightness(1.15)}

  footer{
    margin-top:30px;font-size:14px;color:var(--muted);line-height:1.6;
    border-top:1px solid rgba(250,244,238,.1);padding-top:18px;
  }

  @media(max-width:460px){
    .code{flex-direction:column;align-items:flex-start;gap:14px}
    .qrbox{width:150px;height:150px;align-self:center}
    .dl .btn{flex:1;text-align:center}
  }

  /* ---------- paper ---------- */
  .paper{display:none}
  @media print{
    @page{size:letter;margin:0.4in}
    html,body{background:#fff!important;color:#111!important}
    .screen{display:none!important}
    .paper{display:block}

    .sheet{page-break-after:always;break-after:page}
    .sheet:last-child{page-break-after:auto;break-after:auto}

    .tent{
      height:9.9in;border:2px solid #111;border-radius:18px;
      padding:0.45in 0.4in;text-align:center;
      display:flex;flex-direction:column;align-items:center;
      justify-content:center;gap:0.2in;
    }
    .tent h1{
      font-family:var(--display);font-size:42pt;font-weight:600;
      line-height:1;margin:0;color:#111;
    }
    .tent .where{font-size:12pt;margin:0;color:#5a3a44;letter-spacing:.02em}
    .tent .qr{width:4.3in;height:4.3in}
    .tent .qr svg{width:100%;height:100%;display:block}
    .tent .cap{font-size:17pt;font-weight:600;margin:0;color:#111}
    .tent .scan{font-size:11pt;margin:0;color:#444}
    .tent .link{font-size:9.5pt;color:#777;margin:0}

    .cards{
      height:9.9in;display:grid;
      grid-template-columns:1fr 1fr;grid-template-rows:repeat(3,1fr);
    }
    .handcard{
      border:1px dashed #bbb;padding:0.16in;text-align:center;
      display:flex;flex-direction:column;align-items:center;
      justify-content:center;gap:6px;
    }
    .handcard .name{font-family:var(--display);font-size:14pt;font-weight:600;line-height:1}
    .handcard .qr{width:1.7in;height:1.7in}
    .handcard .qr svg{width:100%;height:100%;display:block}
    .handcard .cap{font-size:7.5pt;color:#333;line-height:1.3}
    .handcard .link{font-size:6pt;color:#888;word-break:break-all}
  }
</style>
</head>
<body>

<div class="wrap screen">
  <h1 class="title">Print your QR codes</h1>
  <p class="lede">These are the signs for the merch table. You can print them
    yourself on any printer — nothing needs to be ordered.</p>

  <div class="how">
    <h2>How to print</h2>
    <ol>
      <li>Tap <b>Print all signs</b> below.</li>
      <li>You'll get a big sign for the table, then a page of six small
        cards to hand out.</li>
      <li>Card stock looks best, but regular paper works fine.</li>
      <li>To send it to a print shop instead, choose <b>Save as PDF</b> in the
        print window and email them the file.</li>
    </ol>
  </div>

  <button class="print-all" type="button" onclick="window.print()">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M6 9V3h12v6"/><rect x="3.5" y="9" width="17" height="7.5" rx="2"/>
      <path d="M6 14h12v7H6z"/>
    </svg>
    Print all signs
  </button>

  ${codes.map(card).join('')}

  <footer>
    Before the show, scan a printed code with your phone from a few feet away
    in dim light, just to be sure. If you ever need these again, this page is
    always here.
  </footer>
</div>

<div class="paper">
${codes.map(tent).join('')}
${cards}
</div>

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
    built.push({ ...e, svg, label: plain(e.label), note: plain(e.note) });
  }

  fs.writeFileSync(path.join(OUT, 'index.html'), page(built));

  console.log(`\nBuilt ${built.length} QR code${built.length === 1 ? '' : 's'} in print/\n`);
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

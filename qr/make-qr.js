#!/usr/bin/env node
/* ============================================================
   QR code generator for the merch booth.

     npm run qr -- https://juanitopascual-preorder.vercel.app

   Writes into qr/out/ :
     qr.svg          vector — use this for anything printed
     qr-print.png    2400px — safe for large signs
     qr-screen.png   600px  — for Instagram / texts / slides
     print-sheet.html  open in a browser, Cmd+P -> Save as PDF
                       (one big table-tent card + six wallet cards)

   Error correction is set to "H" (highest), so the code still scans
   with a logo over the middle, a crease, or a coffee ring on it.
   ============================================================ */

const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const url = process.argv[2];
const label = process.argv[3] || 'Preorder the album + join the mailing list';

if (!url || !/^https?:\/\//.test(url)) {
  console.error('\nUsage: npm run qr -- <https://your-url> ["optional caption"]\n');
  process.exit(1);
}

const outDir = path.join(__dirname, 'out');
fs.mkdirSync(outDir, { recursive: true });

// Pure black on pure white. Do not be tempted to brand the QR itself —
// low contrast is the single most common reason codes fail to scan
// under dim venue lighting.
const opts = {
  errorCorrectionLevel: 'H',
  margin: 3,
  color: { dark: '#000000', light: '#FFFFFF' }
};

const pretty = url.replace(/^https?:\/\//, '').replace(/\/$/, '');

function sheet(svg) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>Juanito Pascual — QR print sheet</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,500&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<style>
  @page { size: letter; margin: 0.4in; }
  * { box-sizing: border-box; }
  body { margin:0; font-family:Inter,sans-serif; color:#111; background:#fff; }
  .page { page-break-after: always; padding: 0.2in; }
  .page:last-child { page-break-after: auto; }

  /* --- table tent: one big card, fills the page --- */
  .tent { border:2px solid #111; border-radius:18px; padding:0.5in 0.4in;
          text-align:center; height:9.9in; display:flex; flex-direction:column;
          align-items:center; justify-content:center; gap:0.26in; }
  .tent h1 { font-family:"Cormorant Garamond",serif; font-weight:600;
             font-size:46pt; line-height:1; margin:0; }
  .tent .sub { font-family:"Cormorant Garamond",serif; font-style:italic;
               font-size:20pt; margin:0; color:#5a3a44; }
  .tent .qr { width:4.4in; height:4.4in; }
  .tent .cap { font-size:13pt; font-weight:600; margin:0; max-width:5in; line-height:1.4; }
  .tent .url { font-size:10.5pt; color:#666; margin:0; letter-spacing:.02em; }
  .scan { font-size:9pt; letter-spacing:.2em; text-transform:uppercase; color:#8a6; display:none; }

  /* --- wallet cards: 2 x 3 grid, cut on the lines --- */
  .grid { display:grid; grid-template-columns:1fr 1fr; grid-template-rows:repeat(3,1fr);
          gap:0; height:9.9in; }
  .card { border:1px dashed #bbb; padding:0.2in; text-align:center;
          display:flex; flex-direction:column; align-items:center;
          justify-content:center; gap:7px; }
  .card .qr { width:1.75in; height:1.75in; }
  .card .name { font-family:"Cormorant Garamond",serif; font-size:15pt; font-weight:600; line-height:1; }
  .card .cap { font-size:7.5pt; color:#444; line-height:1.3; max-width:2.3in; }
  .card .url { font-size:6.5pt; color:#888; }
  .hint { font-size:8pt; color:#999; text-align:center; margin:6px 0 0; }
  @media print { .hint { display:none; } }
</style></head>
<body>

<div class="page">
  <div class="tent">
    <h1>Juanito Pascual</h1>
    <p class="sub">Gold &amp; Rose</p>
    <div class="qr">${svg}</div>
    <p class="cap">${label}</p>
    <p class="url">${pretty}</p>
  </div>
  <p class="hint">Page 1 — table tent. Print, fold, stand it on the merch table.</p>
</div>

<div class="page">
  <div class="grid">
    ${Array.from({ length: 6 }).map(() => `<div class="card">
      <div class="name">Juanito Pascual</div>
      <div class="qr">${svg}</div>
      <div class="cap">${label}</div>
      <div class="url">${pretty}</div>
    </div>`).join('')}
  </div>
  <p class="hint">Page 2 — six hand-out cards. Print on cardstock, cut on the dashed lines.</p>
</div>

</body></html>`;
}

(async () => {
  const svg = await QRCode.toString(url, { ...opts, type: 'svg', width: 1000 });

  await QRCode.toFile(path.join(outDir, 'qr-print.png'), url, { ...opts, width: 2400 });
  await QRCode.toFile(path.join(outDir, 'qr-screen.png'), url, { ...opts, width: 600 });
  fs.writeFileSync(path.join(outDir, 'qr.svg'), svg);
  fs.writeFileSync(path.join(outDir, 'print-sheet.html'), sheet(svg));

  console.log(`
QR codes generated for:  ${url}

  qr/out/qr.svg            vector, for print
  qr/out/qr-print.png      2400px, for large signs
  qr/out/qr-screen.png     600px, for social / slides
  qr/out/print-sheet.html  open it, then Cmd+P -> Save as PDF

Before the show: scan it with an actual phone, from about three feet
away, in dim light. Then scan it again after it is printed.
`);
})().catch(err => { console.error(err); process.exit(1); });

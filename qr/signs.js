/* ============================================================
   The print page: every sign for the merch table, in Juanito's
   EPK branding — Bebas Neue headlines, gold and purple on near-black
   and cream, and the psychedelic guitar mandala.

   One HTML document doing two jobs. On screen it lists each sign as a
   live preview with its own Print button; on paper (@media print) only
   the sheets come out. The previews and the paper are the same markup
   and the same CSS, so what Juanito sees is exactly what prints.

   Nothing here is content. Prices, payment handles and wording all come
   from config.js; this file only decides where they go on the paper.

   Hard rules carried over from the QR rules in CLAUDE.md:
     - every code is black on white, inside its own white quiet zone
     - only two codes exist (booth, email) — see config.js
     - every sign that asks for money also prints the handles in words,
       for the phone whose camera won't focus
   ============================================================ */

module.exports = function printPage({ SITE, codes, pretty }) {
  const S = SITE;
  const sg = S.signs || {};
  const code = file => codes.find(c => c.file === file);
  const booth = code('booth');
  const email = code('email');
  if (!booth) throw new Error('print page needs a "booth" code in config.js qr.codes');

  /* --- data pulled from config ----------------------------------------- */

  // Payment rows in words. Big line = the thing you type; small = the help.
  const pays = (S.payments || []).map(p => {
    if (p.type === 'copy') return { label: p.label, big: p.value, small: p.sub };
    if (p.type === 'link') return { label: p.label, big: p.sub, small: p.hint };
    return { label: p.label, big: p.sub, small: p.hint };
  });
  const pay = id => (S.payments || []).find(p => p.id === id) || {};
  const venmoHandle = pay('venmo').sub || '';
  const paypalEmail = pay('paypal').value || '';

  // "All three for $40 — save $20", worked out from the CD tiers so it can
  // never drift from the real prices. No tiers that parse, no deal line.
  const deal = (() => {
    const g = (S.merch || []).find(x => (x.options || []).length > 1);
    if (!g) return '';
    const tiers = g.options.map(o => ({
      n: parseInt(String(o.label), 10),
      p: parseFloat(String(o.price).replace(/[^0-9.]/g, ''))
    })).filter(t => t.n > 0 && t.p > 0);
    const one = tiers.find(t => t.n === 1);
    const top = tiers.sort((a, b) => b.n - a.n)[0];
    if (!one || !top || top.n < 2) return '';
    const save = one.p * top.n - top.p;
    if (save <= 0) return '';
    const words = ['', 'one', 'two', 'three', 'four', 'five', 'six'];
    const all = (g.titles || []).length === top.n;
    const qty = (all ? 'All ' : 'Any ') + (words[top.n] || top.n);
    return `${qty} ${g.heading} for $${top.p} · Save $${save}`;
  })();

  /* --- shared pieces --------------------------------------------------- */

  const IMG = '../assets/print/';
  const qr = (c, cls = '') => `<div class="qr ${cls}">${c.svg}</div>`;

  // Keep each " · " glued to the word before it, so a wrapped headline
  // never starts a line with a stray dot.
  const glue = t => String(t || '').replace(/ \u00b7 /g, '\u00a0\u00b7 ');

  const band = (kicker, headline, short) => `
    <header class="band${short ? ' short' : ''}">
      <img class="bg" src="${IMG}${short ? 'band-short' : 'band'}.jpg" alt="">
      <div class="in">
        <img class="logo" src="${IMG}logo-cream.png" alt="Juanito Pascual Trio">
        <div class="words">
          ${kicker ? `<p class="kicker">${kicker}</p>` : ''}
          <h1>${glue(headline)}</h1>
        </div>
      </div>
    </header>`;

  const strip = `<img class="strip" src="${IMG}strip.jpg" alt="">`;

  const payLine = `
    <p class="payline">
      <span><b>Venmo</b> ${venmoHandle}</span>
      ${paypalEmail ? `<span><b>PayPal</b> ${paypalEmail}</span>` : ''}
      <span><b>Cash</b> or <b>check</b></span>
    </p>`;

  /* --- the sheets ------------------------------------------------------ */

  const sheets = [];

  // 1. The main scan sign — the one people already liked.
  sheets.push({
    file: 'main',
    title: 'Main sign',
    blurb: 'The big code for the front of the table. Everything is behind it: prices, paying, and the email list.',
    html: `
    <div class="sheet s-main" data-file="main">
      ${band('Scan with your phone camera', booth.label)}
      <div class="body">
        <p class="lede">${booth.sub || ''}</p>
        ${qr(booth, 'big')}
        <p class="aim">Open your camera and point it here</p>
        <div class="fallback">
          <p class="kick">Camera won’t scan? Pay by name:</p>
          ${payLine}
          <p class="url">${pretty(booth.url)}</p>
        </div>
      </div>
      ${strip}
    </div>`
  });

  // 2. The merch menu — prices from across the room, the deal called out.
  const groups = (S.merch || []).map(g => {
    const rows = (g.options || []).map(o => `
        <div class="row"><span class="lab">${o.label}</span><span class="dots"></span><span class="price">${o.price}</span></div>`).join('');
    const titles = (g.titles || []).length
      ? `<p class="titles">${g.titles.map(t => `<span>${t}</span>`).join(' · ')}</p>` : '';
    const soon = g.soon ? `<p class="soon">${g.signNote || g.soonNote || ''}</p>` : '';
    return `<section class="grp"><h2>${g.heading}</h2>${rows}${titles}${soon}</section>`;
  }).join('');

  sheets.push({
    file: 'menu',
    title: 'Merch menu',
    blurb: 'Prices big enough to read from across the room, with the best deal called out.',
    html: `
    <div class="sheet s-menu" data-file="menu">
      ${band(sg.tagline || '', sg.menuHeadline || 'Merch')}
      <div class="body">
        <div class="cols">
          <div class="list">${groups}</div>
          <img class="trio" src="${IMG}trio.webp" alt="">
        </div>
        ${deal ? `<p class="deal">${deal}</p>` : ''}
        ${sg.perk ? `<p class="perk">${sg.perk}</p>` : ''}
        ${sg.quote ? `<blockquote><p>“${sg.quote}”</p><cite>${sg.quoteBy || ''}</cite></blockquote>` : ''}
        <div class="foot">
          ${qr(booth, 'small')}
          <div>
            <p class="kick">Scan to pay — or pay by name</p>
            ${payLine}
          </div>
        </div>
      </div>
      ${strip}
    </div>`
  });

  // 3. How to pay — every handle in words, readable without a camera.
  sheets.push({
    file: 'pay',
    title: 'How to pay',
    blurb: 'Every way to pay, written out. For anyone whose camera won’t scan.',
    html: `
    <div class="sheet s-pay" data-file="pay">
      ${band(pays.map(p => p.label).join(' · '), sg.payHeadline || 'How to Pay')}
      <div class="body">
        ${pays.map(p => `
        <div class="method">
          <h2>${p.label}</h2>
          <div><p class="big">${p.big || ''}</p>${p.small ? `<p class="small">${p.small}</p>` : ''}</div>
        </div>`).join('')}
        <div class="foot">
          ${qr(booth, 'mid')}
          <div>
            <p class="kick">Or scan it</p>
            <p class="say">See the prices and pay from your phone.</p>
          </div>
        </div>
      </div>
      ${strip}
    </div>`
  });

  // 4. The email list — the main goal of the night.
  if (email) sheets.push({
    file: 'email',
    title: 'Email list',
    blurb: 'Goes straight to the sign-up, with a reason to join: hearing the new album first.',
    html: `
    <div class="sheet s-email" data-file="email">
      ${band(email.sub || '', email.label)}
      <div class="body">
        ${sg.emailPitch ? `<p class="pitch">${sg.emailPitch}</p>` : ''}
        ${sg.emailPitchSub ? `<p class="pitchsub">${sg.emailPitchSub}</p>` : ''}
        ${qr(email, 'big')}
        <p class="aim">Open your camera and point it here</p>
        <p class="or">or go to <b>${pretty(email.url)}</b></p>
      </div>
      ${strip}
    </div>`
  });

  // 5. Table tent — fold in half and it stands up on its own. The top
  //    face is upside down on paper so it reads right once folded.
  const face = `
      <div class="face">
        ${band('', booth.label, true)}
        <div class="fbody">
          ${qr(booth, 'tent')}
          <div class="fwords">
            <p class="kick">Scan with your camera</p>
            <p class="fline"><b>Venmo</b><br>${venmoHandle}</p>
            ${paypalEmail ? `<p class="fline"><b>PayPal</b><br>${paypalEmail}</p>` : ''}
            <p class="fline"><b>Cash or check</b></p>
          </div>
        </div>
      </div>`;
  sheets.push({
    file: 'tent',
    title: 'Table tent',
    blurb: 'Fold it in half along the dotted line and it stands up by itself, readable from both sides.',
    html: `
    <div class="sheet s-tent" data-file="tent">
      <div class="flip">${face}</div>
      <div class="fold"><span>fold here</span></div>
      ${face}
    </div>`
  });

  // 6. Hand-out cards — six to a page.
  const card = `
      <div class="card">
        <div class="cband"><img src="${IMG}band-short.jpg" alt=""><span>${booth.label}</span></div>
        <div class="cbody">
          ${qr(booth, 'cqr')}
          <div>
            <p class="cname">${S.artist || ''}</p>
            <p class="cpay"><b>Venmo</b><br>${venmoHandle}</p>
            <p class="curl">${pretty(booth.url)}</p>
          </div>
        </div>
      </div>`;
  sheets.push({
    file: 'cards',
    title: 'Hand-out cards',
    blurb: 'Six small cards to a page. Cut along the dotted lines and leave them on the table.',
    html: `<div class="sheet s-cards" data-file="cards">${card.repeat(6)}</div>`
  });

  /* --- the page -------------------------------------------------------- */

  const items = sheets.map(s => `
    <article class="item">
      <div class="preview">${s.html}</div>
      <div class="meta">
        <h2>${s.title}</h2>
        <p>${s.blurb}</p>
        <button class="btn" type="button" onclick="printOne('${s.file}')">Print this sign</button>
      </div>
    </article>`).join('');

  const downloads = codes.map(c => `
        <li><b>${c.label}</b> &mdash;
          <a href="${c.file}.svg" download>vector</a> &middot;
          <a href="${c.file}-print.png" download>image</a></li>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${S.artist || ''} — Print your signs</title>
<meta name="robots" content="noindex">
<meta name="theme-color" content="#1a0d12">
<link rel="apple-touch-icon" href="../assets/apple-touch-icon.png">
<link rel="preload" href="../assets/fonts/bebas-neue.woff2" as="font" type="font/woff2" crossorigin>
<style>
  @font-face{font-family:"Bebas Neue";font-weight:400;font-display:swap;
    src:url("../assets/fonts/bebas-neue.woff2") format("woff2")}
  @font-face{font-family:"Cormorant Garamond";font-style:normal;font-weight:600;font-display:swap;
    src:url("../assets/fonts/cormorant-600.woff2") format("woff2")}
  @font-face{font-family:"Cormorant Garamond";font-style:italic;font-weight:500;font-display:swap;
    src:url("../assets/fonts/cormorant-italic-500.woff2") format("woff2")}

  :root{
    /* screen chrome: the booth page's palette */
    --wine:#1a0d12;--gold:#dcb468;--gold-bright:#f4d79a;--muted:#d2bcc4;
    --paper:#faf4ee;--line:rgba(220,180,104,.26);
    /* the signs: Juanito's EPK palette */
    --ink:#191210;--ink-soft:#3e342f;--ink-muted:#5f5048;
    --brand-gold:#c8963c;--gold-soft:#e5b450;--gold-deep:#8a5f14;
    --purple:#5a2d8c;--cream:#f5f0e8;--dark:#0c0a0d;
    --bebas:"Bebas Neue","Arial Narrow",Impact,sans-serif;
    --serif:"Cormorant Garamond",Georgia,serif;
    --sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    color-scheme:dark;
  }
  *{box-sizing:border-box}
  html{-webkit-text-size-adjust:100%}
  body{
    margin:0;font-family:var(--sans);font-size:16px;line-height:1.5;color:var(--paper);
    background:radial-gradient(120% 70% at 50% -10%,#3a1a26 0%,transparent 60%),var(--wine);
    background-attachment:fixed;-webkit-font-smoothing:antialiased;
  }
  button,a{touch-action:manipulation}

  /* ---------- screen: the list of signs ---------- */
  .wrap{max-width:980px;margin:0 auto;
    padding:clamp(26px,6vw,46px) 16px calc(48px + env(safe-area-inset-bottom))}
  h1.title{font-family:var(--serif);font-weight:600;font-size:clamp(32px,8vw,44px);
    line-height:1.05;margin:0 0 10px}
  .lede-s{color:var(--muted);margin:0 0 22px;max-width:620px}
  .how{border:1px solid var(--line);border-radius:14px;padding:18px 20px;margin:0 0 22px;
    background:rgba(250,244,238,.04);max-width:620px}
  .how h2{font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
    color:var(--muted);margin:0 0 10px}
  .how ol{margin:0;padding-left:22px}
  .how li{margin:0 0 8px}
  .how b{color:var(--gold-bright)}
  .print-all{display:block;width:100%;max-width:620px;min-height:62px;margin:0 0 30px;
    font:inherit;font-size:19px;font-weight:600;color:#20101a;cursor:pointer;
    background:linear-gradient(140deg,var(--gold) 0%,#c99a4c 100%);
    border:1px solid var(--gold-bright);border-radius:15px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px}
  .item{border:1px solid var(--line);border-radius:15px;padding:14px;
    background:rgba(250,244,238,.04);display:flex;flex-direction:column;gap:12px}
  .preview{position:relative;aspect-ratio:7.6/10;overflow:hidden;border-radius:8px;background:#fff}
  .preview>.sheet{position:absolute;top:0;left:0;transform-origin:0 0}
  .meta h2{font-family:var(--serif);font-weight:600;font-size:24px;margin:0 0 2px}
  .meta p{font-size:15px;color:var(--muted);margin:0 0 12px;line-height:1.45}
  .btn{width:100%;min-height:50px;font:inherit;font-size:16px;font-weight:600;cursor:pointer;
    color:var(--gold-bright);background:rgba(220,180,104,.14);
    border:1px solid var(--line);border-radius:999px}
  .btn:active,.print-all:active{filter:brightness(1.12)}
  details{margin-top:30px;color:var(--muted);font-size:14px;max-width:620px}
  details summary{cursor:pointer;min-height:46px;display:flex;align-items:center}
  details a{color:var(--gold-bright)}
  footer{margin-top:22px;font-size:14px;color:var(--muted);
    border-top:1px solid rgba(250,244,238,.1);padding-top:16px;max-width:620px}

  /* ---------- the sheets (screen previews and paper alike) ---------- */
  .sheet{
    width:7.6in;height:10in;position:relative;overflow:hidden;
    display:flex;flex-direction:column;
    background:#fff;color:var(--ink);font-family:var(--sans);line-height:1.25;
    border-radius:.14in;
    -webkit-print-color-adjust:exact;print-color-adjust:exact;
  }
  .sheet p{margin:0}
  .sheet b{font-weight:700}

  .band{position:relative;flex:none;height:2.3in;color:var(--cream);background:var(--dark)}
  .band .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
  .band .in{position:relative;height:100%;display:flex;align-items:center;gap:.32in;padding:0 .42in}
  .band .logo{width:1.55in;height:1.55in;flex:none}
  .band .words{min-width:0}
  .band .kicker{font:700 10pt var(--sans);letter-spacing:.2em;text-transform:uppercase;
    color:var(--gold-soft);margin-bottom:.06in}
  .band h1{font-family:var(--bebas);font-weight:400;font-size:52pt;line-height:.9;
    margin:0;color:var(--cream);letter-spacing:.01em;text-wrap:balance}
  .band.short{height:1.05in}
  .band.short .in{padding:0 .3in;gap:.2in}
  .band.short .logo{width:.8in;height:.8in}
  .band.short h1{font-size:30pt}

  .strip{display:block;flex:none;width:100%;height:.3in;object-fit:cover}
  .body{flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;
    padding:.28in .5in .26in}

  .qr{background:#fff;flex:none}
  .qr svg{display:block;width:100%;height:100%}
  .qr.big{width:4.4in;height:4.4in}
  .qr.mid{width:2.5in;height:2.5in}
  .qr.small{width:1.45in;height:1.45in}

  .kick{font:700 9.5pt var(--sans);letter-spacing:.18em;text-transform:uppercase;color:var(--purple)}
  .aim{font:700 14pt var(--sans);margin-top:.06in!important}
  .payline{font-size:12.5pt;color:var(--ink-soft);display:flex;flex-wrap:wrap;
    justify-content:center;gap:.04in .26in;margin-top:.05in!important}
  .payline b{color:var(--ink);font-weight:800}

  /* 1 main */
  .s-main .lede{font-size:16pt;color:var(--ink-soft);margin-bottom:.18in!important;text-align:center}
  .s-main .fallback{margin-top:auto;width:100%;text-align:center;
    border-top:2px solid var(--brand-gold);padding-top:.16in}
  .s-main .url{font-size:10pt;color:var(--ink-muted);margin-top:.06in!important}

  /* 2 menu */
  .s-menu .body{align-items:stretch;padding-top:.22in}
  .s-menu .cols{display:flex;gap:.25in;align-items:flex-start}
  .s-menu .list{flex:1;min-width:0}
  .s-menu .trio{width:2.55in;flex:none;margin-top:.1in}
  .s-menu .grp{margin-bottom:.18in}
  .s-menu h2{font-family:var(--bebas);font-weight:400;font-size:28pt;line-height:1;
    color:var(--purple);margin:0 0 .02in;letter-spacing:.02em}
  .s-menu .row{display:flex;align-items:baseline;gap:.08in;font-size:15.5pt;line-height:1.38}
  .s-menu .lab{white-space:nowrap}
  .s-menu .dots{flex:1;border-bottom:1.5px dotted #b8a99e;transform:translateY(-.06in)}
  .s-menu .price{font-family:var(--bebas);font-size:28pt;line-height:1;color:var(--gold-deep)}
  .s-menu .titles{font:italic 500 14pt var(--serif);color:var(--ink-soft);margin-top:.03in!important;line-height:1.3}
  .s-menu .titles span{white-space:nowrap}
  .s-menu .soon{font:italic 500 14pt var(--serif);color:var(--ink-soft)}
  .s-menu .deal{background:var(--purple);color:var(--cream);text-align:center;
    font-family:var(--bebas);font-size:23pt;letter-spacing:.03em;line-height:1;
    padding:.12in .2in .1in;border-radius:.08in;margin:.04in 0 0!important}
  .s-menu .perk{text-align:center;font-weight:700;font-size:13pt;margin-top:.1in!important}
  .s-menu blockquote{margin:.16in 0 0;text-align:center}
  .s-menu blockquote p{font:italic 500 21pt var(--serif);line-height:1.1}
  .s-menu cite{display:block;font:700 9pt var(--sans);letter-spacing:.2em;
    text-transform:uppercase;color:var(--gold-deep);font-style:normal;margin-top:.04in}
  .s-menu .foot{margin-top:auto;display:flex;align-items:center;gap:.26in;
    border-top:2px solid var(--brand-gold);padding-top:.16in}
  .s-menu .foot .payline{justify-content:flex-start;gap:.02in .2in}

  /* 3 pay */
  .s-pay .body{align-items:stretch;padding-top:.14in}
  .s-pay .method{display:flex;align-items:center;gap:.3in;padding:.27in 0;
    border-bottom:1.5px solid #e7ddd2}
  .s-pay .method h2{font-family:var(--bebas);font-weight:400;font-size:40pt;line-height:.95;
    color:var(--purple);width:1.75in;flex:none;margin:0;letter-spacing:.02em}
  .s-pay .big{font-size:25pt;font-weight:800;line-height:1.12;word-break:break-word}
  .s-pay .small{font-size:14pt;color:var(--ink-muted);margin-top:.05in!important}
  .s-pay .foot{margin-top:auto;display:flex;align-items:center;gap:.3in;padding-top:.12in}
  .s-pay .say{font-size:15pt;color:var(--ink-soft);margin-top:.06in!important}

  /* 4 email */
  .s-email .pitch{font-family:var(--bebas);font-size:33pt;line-height:1;color:var(--purple);
    text-align:center;letter-spacing:.02em}
  .s-email .pitchsub{font-size:13.5pt;color:var(--ink-muted);margin:.06in 0 .2in!important;text-align:center}
  .s-email .or{font-size:12.5pt;color:var(--ink-soft);margin-top:auto!important}

  /* 5 tent: two landscape faces, the top one upside down */
  .s-tent{border-radius:0}
  .s-tent .face{height:4.9in;display:flex;flex-direction:column;border-radius:.12in;overflow:hidden;
    border:1px solid #e7ddd2}
  .s-tent .flip{transform:rotate(180deg)}
  .s-tent .fold{flex:1;display:flex;align-items:center;position:relative}
  .s-tent .fold::before{content:"";flex:1;border-top:1.5px dashed #9d8f86}
  .s-tent .fold span{position:absolute;left:50%;transform:translateX(-50%);background:#fff;
    padding:0 .1in;font:600 8pt var(--sans);letter-spacing:.2em;text-transform:uppercase;color:#9d8f86}
  .s-tent .fbody{flex:1;display:flex;align-items:center;gap:.32in;padding:.2in .4in}
  .s-tent .qr.tent{width:3.25in;height:3.25in}
  .s-tent .fline{font-size:14pt;line-height:1.2;margin-top:.13in!important;color:var(--ink-soft)}
  .s-tent .fline b{font-family:var(--bebas);font-weight:400;font-size:19pt;letter-spacing:.03em;color:var(--purple)}

  /* 6 cards */
  .s-cards{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:repeat(3,1fr);border-radius:0}
  .s-cards .card{border:1px dashed #b8aca3;display:flex;flex-direction:column;overflow:hidden}
  .s-cards .cband{position:relative;height:.62in;flex:none;display:flex;align-items:center;
    justify-content:center;background:var(--dark)}
  .s-cards .cband img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
  .s-cards .cband span{position:relative;font-family:var(--bebas);font-size:17pt;color:var(--cream);letter-spacing:.03em}
  .s-cards .cbody{flex:1;display:flex;align-items:center;gap:.16in;padding:.14in .2in}
  .s-cards .qr.cqr{width:1.62in;height:1.62in}
  .s-cards .cname{font:600 15pt var(--serif);line-height:1.05}
  .s-cards .cpay{font-size:9.5pt;margin-top:.08in!important;color:var(--ink-soft);white-space:nowrap}
  .s-cards .curl{font-size:6.3pt;color:var(--ink-muted);margin-top:.06in!important;white-space:nowrap}

  /* ---------- paper ---------- */
  .paper{display:none}
  @media print{
    @page{size:letter;margin:.4in .45in}
    html,body{background:#fff!important}
    .screen{display:none!important}
    .paper{display:block}
    .paper .sheet{break-after:page;page-break-after:always;break-inside:avoid}
    .paper .sheet:last-child{break-after:auto;page-break-after:auto}
    .paper .sheet.skip{display:none!important}
  }
</style>
</head>
<body>

<div class="wrap screen">
  <h1 class="title">Print your signs</h1>
  <p class="lede-s">Everything for the merch table. Print them on the venue printer &mdash;
    in color if it can, but black and white works too.</p>

  <div class="how">
    <h2>How to print</h2>
    <ol>
      <li>Tap <b>Print this sign</b> under any sign to print just that one, or
        <b>Print every sign</b> for the whole set.</li>
      <li>For the table, the best three are the <b>Table tent</b>, the
        <b>Merch menu</b> and the <b>Email list</b> sign.</li>
      <li>The table tent folds in half along the dotted line and stands up on its own.</li>
      <li>To send one to a print shop, pick <b>Save as PDF</b> in the print window.</li>
    </ol>
  </div>

  <button class="print-all" type="button" onclick="printAll()">Print every sign</button>

  <div class="grid">${items}
  </div>

  <details>
    <summary>Just the QR codes, for a designer</summary>
    <ul>${downloads}
    </ul>
  </details>

  <footer>Before the show, scan one printed sign with your phone from a few feet
    away in dim light. If you ever need these again, this page is always here.</footer>
</div>

<div class="paper">${sheets.map(s => s.html).join('')}
</div>

<script>
  // Shrink each full-size sheet to fit its preview box.
  function fit() {
    document.querySelectorAll('.preview').forEach(function (p) {
      var s = p.firstElementChild;
      s.style.transform = 'scale(' + (p.clientWidth / s.offsetWidth) + ')';
    });
  }
  fit();
  window.addEventListener('resize', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

  var SHEETS = document.querySelectorAll('.paper .sheet');
  function show(only) {
    SHEETS.forEach(function (s) {
      s.classList.toggle('skip', !!only && s.dataset.file !== only);
    });
  }
  // Always put every sheet back, so the next print is not silently cropped
  // by whatever was clicked last.
  function reset() { show(null); }
  function printOne(file) { show(file); window.print(); }
  function printAll() { reset(); window.print(); }
  window.addEventListener('afterprint', reset);
</script>

</body></html>`;
};

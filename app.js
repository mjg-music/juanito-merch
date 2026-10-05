/* Renders the page from config.js. You should not need to edit this file. */
(function () {
  var S = window.SITE || {};
  var app = document.getElementById('app');

  // Brand marks, inline so the page has zero external requests beyond fonts.
  var ICONS = {
    paypal:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="color:#d8ae5f"><path d="M6 20l2.2-14h5.1c2.6 0 4.1 1.4 3.7 3.8-.4 2.6-2.4 4-5.2 4H9.5"/><path d="M10 20l.7-4.2"/></svg>',
    venmo:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="color:#d8ae5f"><path d="M5 5l4.5 14L19 5"/></svg>',
    cashapp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="color:#d8ae5f"><path d="M12 3v18"/><path d="M15.5 7.5c-1-1-2.2-1.4-3.6-1.4-2 0-3.4 1-3.4 2.6 0 1.5 1.2 2.2 3.4 2.8 2.3.6 3.6 1.4 3.6 3.1 0 1.8-1.6 2.8-3.7 2.8-1.6 0-2.9-.5-4-1.6"/></svg>',
    zelle:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="color:#d8ae5f"><path d="M12 3v18"/><path d="M7 8h10l-10 8h10"/></svg>',
    mail:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7.5l8.5 6 8.5-6"/></svg>',
    generic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="color:#d8ae5f"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v9M7.5 12h9"/></svg>'
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[<>"]/g, function (c) {
      return { '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // A link is "live" only if it's filled in and has no leftover TODO marker.
  function live(url) {
    return typeof url === 'string' && url.trim() !== '' && !/TODO/i.test(url);
  }

  function initials(name) {
    return String(name || 'JP').split(/\s+/).map(function (w) { return w[0] || ''; })
      .join('').slice(0, 2).toUpperCase();
  }

  function button(opts) {
    return '<a class="btn' + (opts.primary ? ' primary' : '') + '" href="' + esc(opts.url) + '"' +
      (/^https?:/.test(opts.url) ? ' target="_blank" rel="noopener"' : '') + '>' +
      '<span class="ico">' + (opts.icon || ICONS.generic) + '</span>' +
      '<span class="txt"><b>' + opts.label + '</b>' +
      (opts.sub ? '<small>' + opts.sub + '</small>' : '') + '</span>' +
      '<span class="arrow" aria-hidden="true">&rsaquo;</span></a>';
  }

  var html = '';

  // --- Setup warnings (visible only while placeholders remain) -------------
  var todo = [];
  if (!live(S.emailFormUrl)) todo.push('emailFormUrl');
  (S.payments || []).forEach(function (p) { if (!live(p.url)) todo.push('payments &rarr; ' + p.id); });
  if (todo.length) {
    html += '<div class="warn"><b>Setup needed.</b> Still on placeholder values in ' +
      '<code>config.js</code>: ' + todo.join(', ') + '. ' +
      'These buttons are hidden until you fill them in. This notice disappears on its own.</div>';
  }

  // --- Header -------------------------------------------------------------
  html += '<header>';
  html += S.portrait
    ? '<img class="portrait" src="' + esc(S.portrait) + '" alt="' + esc(S.artist) + '" ' +
      'onerror="this.outerHTML=\'<div class=&quot;monogram&quot;>' + initials(S.artist) + '</div>\'">'
    : '<div class="monogram">' + initials(S.artist) + '</div>';
  html += '<h1>' + (S.artist || '') + '</h1>';
  if (S.tagline) html += '<p class="tagline">' + S.tagline + '</p>';
  if (S.note) html += '<p class="note">' + S.note + '</p>';
  html += '</header><hr class="rule">';

  // --- Payments -----------------------------------------------------------
  var pays = (S.payments || []).filter(function (p) { return live(p.url); });
  if (pays.length) {
    html += '<p class="label">Preorder the album</p>';
    if (S.priceNote) html += '<p class="price">' + S.priceNote + '</p>';
    html += '<div class="stack">' + pays.map(function (p) {
      return button({ url: p.url, label: p.label, sub: p.sub, icon: ICONS[p.id] });
    }).join('') + '</div>';
    if (S.shipNote) html += '<p class="shipnote">' + S.shipNote + '</p>';
    html += '<hr class="rule">';
  }

  // --- Email signup -------------------------------------------------------
  if (live(S.emailFormUrl)) {
    html += '<p class="label">Stay in touch</p><div class="stack">' +
      button({
        url: S.emailFormUrl,
        label: S.emailLabel || 'Join the mailing list',
        sub: S.emailSub,
        icon: ICONS.mail,
        primary: true
      }) + '</div><hr class="rule">';
  }

  // --- Secondary links ----------------------------------------------------
  var links = (S.links || []).filter(function (l) { return live(l.url); });
  if (links.length) {
    html += '<ul class="links">' + links.map(function (l) {
      return '<li><a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + l.label + '</a></li>';
    }).join('') + '</ul>';
  }

  if (S.footer) html += '<footer>' + S.footer + '</footer>';

  app.innerHTML = html;
})();

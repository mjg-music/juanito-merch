/* Renders the page from config.js. You should not need to edit this file. */
(function () {
  var S = window.SITE || {};
  var app = document.getElementById('app');

  var ICONS = {
    venmo:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5l4.5 14L19 5"/></svg>',
    paypal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 20l2.2-14h5.1c2.6 0 4.1 1.4 3.7 3.8-.4 2.6-2.4 4-5.2 4H9.5"/><path d="M10 20l.7-4.2"/></svg>',
    cash:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="6.5" width="19" height="11" rx="2"/><circle cx="12" cy="12" r="2.6"/></svg>',
    check:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5.5" width="19" height="13" rx="2"/><path d="M6 15h5M6 11.5h3"/><path d="M15 13.5l1.8 1.8 3-3.6"/></svg>',
    mail:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7.5l8.5 6 8.5-6"/></svg>',
    generic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v9M7.5 12h9"/></svg>'
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[<>"]/g, function (c) {
      return { '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // A URL is "live" only if filled in and free of any leftover TODO marker.
  function live(url) {
    return typeof url === 'string' && url.trim() !== '' && !/TODO/i.test(url);
  }

  function initials(name) {
    return String(name || 'JP').split(/\s+/).map(function (w) { return w[0] || ''; })
      .join('').slice(0, 2).toUpperCase();
  }

  function icon(id) { return ICONS[id] || ICONS.generic; }

  /* --- PayPal: one username turns the copy row into a real button -------- */
  var ppUser = String(S.paypalUsername || '').trim()
    // Tolerate someone pasting the whole link or an @ by mistake.
    .replace(/^@/, '').replace(/^https?:\/\//, '').replace(/^(www\.)?paypal\.me\//i, '')
    .replace(/\/+$/, '');

  if (ppUser) {
    (S.payments || []).forEach(function (p) {
      if (p.id !== 'paypal') return;
      p.type = 'link';
      p.sub = 'Card or PayPal balance';
      p.url = 'https://paypal.me/' + ppUser;
      delete p.value;
    });
  }

  var html = '';

  /* --- Setup warnings, visible only while placeholders remain ------------ */
  var todo = [];
  (S.payments || []).forEach(function (p) {
    if (p.type === 'link' && !live(p.url)) todo.push('payment &rarr; ' + p.id);
  });
  if (!live(S.emailUrl)) todo.push('emailUrl');
  if (todo.length) {
    html += '<div class="warn"><b>Setup needed.</b> Still on placeholder values in ' +
      '<code>config.js</code>: ' + todo.join(', ') + '. These are hidden until filled ' +
      'in; this notice disappears on its own.</div>';
  }

  /* --- Header ----------------------------------------------------------- */
  html += '<header>';
  html += S.portrait
    ? '<img class="portrait" src="' + esc(S.portrait) + '" alt="' + esc(S.artist) + '" ' +
      'onerror="this.outerHTML=\'<div class=&quot;monogram&quot;><span>' +
      initials(S.artist) + '</span></div>\'">'
    : '<div class="monogram"><span>' + initials(S.artist) + '</span></div>';
  // Show line: confirms to someone standing at the booth that they scanned
  // the right code. Degrades gracefully if any field is missing.
  if (S.show) {
    var where = [S.show.venue, S.show.city].filter(Boolean).join(' &middot; ');
    var dates = (S.show.dates || []).filter(Boolean);
    if (where || dates.length) {
      html += '<p class="eyebrow">' +
        (where ? '<span>' + where + '</span>' : '') +
        dates.map(function (d) { return '<span>' + d + '</span>'; }).join('') +
        '</p>';
    }
  }

  html += '<h1>' + (S.artist || '') + '</h1>';
  if (S.tagline) html += '<p class="tagline">' + S.tagline + '</p>';
  if (S.note) html += '<p class="sub">' + S.note + '</p>';
  html += '</header><hr class="rule">';

  /* --- Merch menu -------------------------------------------------------- */
  var merch = S.merch || [];
  if (merch.length) {
    html += '<p class="label">At the booth</p><div class="menu">';
    merch.forEach(function (group) {
      html += '<section class="group"><h2>' + group.heading + '</h2>';

      if (group.soon) {
        html += '<p class="soon">' + (group.soonNote || 'More info soon') + '</p>';
      }

      (group.options || []).forEach(function (o) {
        // Dotted leader between the name and the price, like a menu.
        html += '<div class="row"><span class="row-label">' + o.label + '</span>' +
          '<span class="leader" aria-hidden="true"></span>' +
          '<span class="row-price">' + o.price + '</span></div>';
      });

      if (group.titles && group.titles.length) {
        html += '<ul class="titles">' + group.titles.map(function (t) {
          return '<li>' + t + '</li>';
        }).join('') + '</ul>';
      }

      html += '</section>';
    });
    html += '</div><hr class="rule">';
  }

  /* --- Payment methods --------------------------------------------------- */
  var pays = (S.payments || []).filter(function (p) {
    return p.type !== 'link' || live(p.url);
  });

  if (pays.length) {
    html += '<p class="label">How to pay</p><div class="stack">';

    pays.forEach(function (p) {
      var inner = '<span class="ico" aria-hidden="true">' + icon(p.id) + '</span>' +
        '<span class="txt"><b>' + p.label + '</b>' +
        (p.sub ? '<small>' + p.sub + '</small>' : '') + '</span>';

      if (p.type === 'link') {
        html += '<a class="btn" href="' + esc(p.url) + '" target="_blank" rel="noopener">' +
          inner + '<span class="arrow" aria-hidden="true">&rsaquo;</span></a>';

      } else if (p.type === 'copy') {
        // No link: PayPal needs a username for a real link, so until Juanito
        // claims one we show the address and let people copy it.
        html += '<div class="btn as-row">' + inner +
          '<button class="copy" type="button" data-copy="' + esc(p.value) + '">Copy</button>' +
          '</div><p class="copyval"><code>' + esc(p.value) + '</code></p>';

      } else {
        html += '<div class="btn as-row quiet">' + inner + '</div>';
      }
    });

    html += '</div><hr class="rule">';
  }

  /* --- Email list -------------------------------------------------------- */
  if (live(S.emailUrl)) {
    html += '<p class="label">Stay in touch</p><div class="stack">' +
      '<a class="btn primary" href="' + esc(S.emailUrl) + '" target="_blank" rel="noopener">' +
      '<span class="ico" aria-hidden="true">' + ICONS.mail + '</span>' +
      '<span class="txt"><b>' + (S.emailLabel || 'Join the mailing list') + '</b>' +
      (S.emailSub ? '<small>' + S.emailSub + '</small>' : '') + '</span>' +
      '<span class="arrow" aria-hidden="true">&rsaquo;</span></a></div><hr class="rule">';
  }

  /* --- Secondary links --------------------------------------------------- */
  var links = (S.links || []).filter(function (l) { return live(l.url); });
  if (links.length) {
    html += '<ul class="links">' + links.map(function (l) {
      return '<li><a href="' + esc(l.url) + '" target="_blank" rel="noopener">' +
        l.label + '</a></li>';
    }).join('') + '</ul>';
  }

  if (S.footer) html += '<footer>' + S.footer + '</footer>';

  app.innerHTML = html;

  /* --- Copy buttons ------------------------------------------------------ */
  var toast = document.getElementById('toast');
  var timer;
  function say(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }

  app.querySelectorAll('.copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var val = btn.getAttribute('data-copy');
      function ok() { btn.textContent = 'Copied'; say('Copied ' + val);
        setTimeout(function () { btn.textContent = 'Copy'; }, 1800); }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(val).then(ok, select);
      } else {
        select();
      }

      // Fallback: select the address so the viewer can copy it by hand.
      function select() {
        var code = btn.closest('.stack').querySelector('code');
        if (code && window.getSelection) {
          var r = document.createRange();
          r.selectNodeContents(code);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(r);
          say('Press and hold to copy');
        }
      }
    });
  });
})();

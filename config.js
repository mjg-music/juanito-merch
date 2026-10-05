/* ============================================================
   JUANITO PASCUAL — PREORDER / MERCH BOOTH PAGE
   ------------------------------------------------------------
   THIS IS THE ONLY FILE YOU NEED TO EDIT.
   Replace every value marked TODO. Save, commit, push.
   Nothing else in this project needs to change.
   ============================================================ */

window.SITE = {
  /* --- Header ------------------------------------------------ */
  artist: "Juanito Pascual",
  tagline: "Gold &amp; Rose — A Flamenco Celebration of Jimi Hendrix",
  // Shown under the tagline. Set to "" to hide.
  note: "Preorder the new album · Out February 2027 on Motéma Music",

  // Put a square photo at assets/portrait.jpg (about 800x800).
  // Set to null to show the gold monogram instead.
  portrait: "assets/portrait.jpg",

  /* --- Price shown on the page ------------------------------- */
  // Appears as a line of helper text above the payment buttons.
  // Set to "" to hide.
  priceNote: "CD preorder $25 · Vinyl preorder $40 · Add $5 for shipping",

  /* --- Email list -------------------------------------------- */
  // TODO: paste your Google Form share link here.
  // Make the form at forms.google.com -> one "Email" question (+ optional
  // "First name"). Click Send -> link icon -> copy link. Responses land in
  // a spreadsheet you own. See README.md step 2.
  emailFormUrl: "https://forms.gle/TODO_REPLACE_ME",
  emailLabel: "Join the mailing list",
  emailSub: "Tour dates, release news, nothing else",

  /* --- Payment options ---------------------------------------
     Order here = order on the page. Delete any block you don't want.
     Set `url` to "" and the button is hidden automatically.      */
  payments: [
    {
      id: "paypal",
      label: "PayPal",
      sub: "Card or PayPal balance",
      // TODO: your PayPal.Me link, e.g. "https://paypal.me/juanitopascual"
      url: "https://paypal.me/TODO_REPLACE_ME"
    },
    {
      id: "venmo",
      label: "Venmo",
      sub: "@TODO-replace-me",
      // TODO: replace TODO-replace-me with your Venmo username (no @).
      // The note/amount prefill is optional but nice.
      url: "https://venmo.com/TODO-replace-me?txn=pay&note=Gold%20%26%20Rose%20preorder"
    },
    {
      id: "cashapp",
      label: "Cash App",
      sub: "$TODO-replace-me",
      // TODO: replace with your $Cashtag
      url: "https://cash.app/$TODO-replace-me"
    }
  ],

  /* --- Secondary links (optional) ----------------------------
     Shown smaller, below the payment buttons. Delete freely.   */
  links: [
    { label: "Listen on Spotify",  url: "" },
    { label: "Instagram",          url: "https://instagram.com/jpas.guitar" },
    { label: "YouTube",            url: "https://youtube.com/@juanitopascual1" },
    { label: "juanitopascual.com", url: "https://juanitopascual.com" }
  ],

  /* --- Footer ------------------------------------------------- */
  // Shown at the very bottom. Set to "" to hide.
  footer: "Questions at the booth? Just ask — thank you for the support.",

  /* --- After-payment instruction ------------------------------
     Critical: a P2P payment alone doesn't tell you where to ship.
     This banner tells people to also sign up. Set to "" to hide. */
  shipNote: "After you pay, tap “Join the mailing list” so I know where to send it."
};

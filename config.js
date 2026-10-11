/* ============================================================
   JUANITO PASCUAL — MERCH BOOTH PAGE
   ------------------------------------------------------------
   THIS IS THE ONLY FILE YOU NEED TO EDIT.
   Anything marked TODO still needs a real value.
   Save, then run:  npx vercel --prod
   ============================================================ */

window.SITE = {

  /* ============================================================
     >>> PASTE WHATEVER JUANITO SENDS FOR PAYPAL HERE <<<

     Either of these works — just paste it between the quotes:

       1. His PayPal.Me username.  If his link is paypal.me/juanitopascual
          put  "juanitopascual"   (the whole link is fine too)

       2. The link behind the QR code the PayPal app makes for him.
          In the PayPal Business app: More → Get paid with QR codes.
          Text Mike the saved image; he'll pull the link out of it.

     Filling this in does three things on its own:
       • PayPal becomes a real tappable button, like Venmo
       • His email address comes off the page entirely
       • `npm run qr` builds a "Pay by PayPal" sign too

     Leave it "" and the page shows his email with a Copy button, which
     works but makes the buyer do the typing.

     NOT options, in case anyone goes looking: PayPal's old cgi-bin
     "Buy Now" links are deprecated and stop working in early 2027, and
     the new ones need a PayPal script loaded into the page, which this
     page never does. Both would be a dead payment link at a booth.
     ============================================================ */
  paypalLink: "",

  /* --- Header ------------------------------------------------ */
  artist: "Juanito Pascual",
  tagline: "Merch &amp; Mailing List",
  note: "Pick what you'd like, then pay any way below.",

  /* --- Tonight's show ----------------------------------------
     Shown as a small line above his name, so people know they're
     in the right place. Set show: null to hide it entirely.   */
  show: {
    venue: "Granada Theater",
    city: "Minneapolis, MN",
    // Two performances. Add or remove lines freely.
    dates: [
      "Sat Oct 10 &middot; 8 PM",
      "Sun Oct 11 &middot; 4 PM"
    ],
    // The printed signs leave the dates OFF by default, so the same sign
    // works at every gig forever. Only this web page carries the dates,
    // and you can change them here any time. Set true to print them too.
    onSigns: false
    // The ticket link lives in `links:` further down, not here.
  },

  // Square photo at assets/portrait.jpg (~800x800).
  // Leave as-is and a gold "JP" monogram shows instead.
  portrait: "assets/portrait.jpg",

  /* --- What's for sale ---------------------------------------
     `items` are listed with a price. `options` are the bundle
     tiers under a heading. Delete or add freely.             */
  merch: [
    {
      heading: "CDs",
      // Bundle pricing — buyer picks any titles.
      options: [
        { label: "1 CD",  price: "$20" },
        { label: "2 CDs", price: "$30" },
        { label: "3 CDs", price: "$40" }
      ],
      titles: [
        "New Flamenco Trio",
        "Language of the Heart",
        "Cosas en Com&uacute;n"
      ]
    },
    {
      heading: "Method Book",
      options: [
        { label: "The Total Flamenco Guitarist", price: "$25" }
      ]
    },
    {
      // No presale this run — the album is here to point people at the
      // mailing list. Flip `soon` off and add options + price when it's
      // actually for sale.
      heading: "New Album",
      soon: true,
      soonNote: "Gold &amp; Rose &mdash; out February 2027. " +
                "Join the mailing list below to hear first.",
      // The printed menu can't say "below", so it gets its own line.
      signNote: "Gold &amp; Rose &mdash; out February 2027 on Mot&eacute;ma Music"
    }
    // T-SHIRTS: when they exist, copy the Method Book block above,
    // change the heading to "T-Shirts" and list sizes + price.
  ],

  /* --- How to pay --------------------------------------------
     type "link"  -> a button that opens an app or website
     type "copy"  -> shows a value with a Copy button (no link)
     type "info"  -> plain instructions, no button
     Any "link" whose url still says TODO is hidden automatically. */
  payments: [
    {
      type: "link",
      id: "venmo",
      label: "Venmo",
      sub: "@Juanito-Pascual",
      url: "https://venmo.com/u/Juanito-Pascual",
      // Printed under the handle on the signs, for when a camera won't scan.
      hint: "Search Juanito-Pascual in the Venmo app"
    },
    {
      // Becomes a real button by itself once paypalLink (top of this
      // file) is filled in. Nothing to change here.
      type: "copy",
      id: "paypal",
      label: "PayPal",
      sub: "Shows up as <b>Three Columns Music</b>",
      value: "jp@jpascual.com"
    },
    {
      type: "info",
      id: "cash",
      label: "Cash or check",
      sub: "Checks payable to <b>Three Columns Music</b>",
      hint: "Cash is great too \u2014 right here at the table"
    }
  ],

  /* --- Email list --------------------------------------------
     His own site already has an "Email List Sign-up" section, so this
     points there. No form to build or maintain.

     The #mailing_list_feature_436168 on the end jumps straight down to the
     sign-up box, which otherwise sits a long way down that page. If he ever
     rebuilds juanitopascual.com that tag may stop matching, and the link
     just lands at the top of the contact page like it used to — nothing
     breaks. Delete from the # onward to go back to that.          */
  emailUrl: "https://juanitopascual.com/contact#mailing_list_feature_436168",
  emailLabel: "Join the mailing list",
  emailSub: "Tour dates and new releases",

  /* Where the sign-up sits on the page.
       true   at the TOP, above the prices — right while collecting
              emails is the main goal of the night
       false  back down below the payment buttons                  */
  emailFirst: true,
  emailHeading: "Stay in touch",

  /* --- Secondary links (optional) ---------------------------- */
  links: [
    // Whoever scans this is already AT tonight's show, so the ticket link
    // sells the NEXT one. Sunday is a separate Eventbrite event from
    // Saturday — a different link, not one page with two dates on it.
    // After Sunday, swap in the next show or delete this line.
    { label: "Tickets &middot; Sun 4 PM", url: "https://www.eventbrite.com/e/juanito-pascual-trio-a-flamenco-celebration-of-jimi-hendrix-tickets-1990935879811" },
    { label: "Instagram",          url: "https://instagram.com/jpas.guitar" },
    { label: "YouTube",            url: "https://youtube.com/@juanitopascual1" },
    { label: "juanitopascual.com", url: "https://juanitopascual.com" }
  ],

  /* --- Footer ------------------------------------------------- */
  footer: "Thank you for the support &mdash; come say hello.",

  /* --- Show notes --------------------------------------------
     The page at <site>/notes/ : a show-day checklist for Juanito and
     whoever is helping at the table. Tick boxes stay ticked on that
     phone until the "start fresh" button. Add, reword or delete lines
     freely; each `when` is a heading, each line under it a check box.  */
  showNotes: [
    {
      when: "Before doors",
      items: [
        "Cash box: bring change. Fives and tens, enough to break twenties for one-CD buyers.",
        "Light for the table: Mike brings one, or ask the venue. A dark table does not sell.",
        "Print the signs and the seat notes on the venue printer. Table tent, merch menu, email list.",
        "Scan one printed code with a phone from a few feet away in dim light.",
        "Guest list printed and handed to the door person.",
        "Seat notes dropped on the seats or tables before doors open."
      ]
    },
    {
      when: "On the mic",
      items: [
        "Announce the CDs with the price: twenty each, three for forty.",
        "Point at the merch table and say where it is.",
        "Mention the email list: sign up tonight to hear Gold &amp; Rose first."
      ]
    },
    {
      when: "Right after the show",
      items: [
        "Juanito goes straight to the merch table. Not the green room first.",
        "Stand next to the table, not behind it. Shake hands, talk, sign CDs.",
        "Someone else handles the money while Juanito talks."
      ]
    },
    {
      when: "Packing up",
      items: [
        "Count the cash box and note how many CDs and books sold.",
        "Collect any paper email sign-ups.",
        "Leftover seat notes and signs go back in the box for the next show."
      ]
    }
  ],

  /* --- QR codes ----------------------------------------------
     `npm run qr` builds one code per entry below.
     TODO: replace siteUrl with the real Vercel URL once deployed.
     Everything else is already correct.                      */
  qr: {
    siteUrl: "https://mjg-music.github.io/juanito-merch/",
    /* TWO codes, on purpose. Three at one table confused people at the
       Saturday show, so every sign uses one of these two:
         booth  everything: prices, how to pay, and the email list
         email  straight to the sign-up form
       label  the big words on the sign — a few words, read walking past
       sub    the smaller line under it
       note   shows on your print page only, never on a sign            */
    codes: [
      { file: "booth", label: "Merch \u00b7 Pay \u00b7 Email List",
        sub: "Prices, every way to pay, and the email list",
        note: "The main one \u2014 everything is behind this code.",
        use: "siteUrl" },
      { file: "email", label: "Join Juanito\u2019s Email List",
        sub: "Tour dates and new releases",
        note: "Goes straight to the sign-up on juanitopascual.com.",
        url: "https://juanitopascual.com/contact#mailing_list_feature_436168" }
      // Please don't add a third. PayPal and Venmo are both reachable from
      // the booth code, and their handles are printed in words on the signs.
    ]
  },

  /* --- Words on the printed signs ----------------------------
     Edit freely. Prices and payment details are NOT here — the signs
     read those from the merch and payments sections above, so the
     page and the paper can never disagree.                       */
  signs: {
    // Real press, from his EPK. Set quote: "" to leave it off.
    quote: "A flamenco phenom.",
    quoteBy: "The Boston Globe",
    tagline: "Fire. Elegance. Soul.",
    menuHeadline: "Take the Music Home",
    payHeadline: "Pay Any Way You Like",
    // The reason to sign up, printed big on the email sign.
    emailPitch: "Be the first to hear Gold &amp; Rose",
    emailPitchSub: "The new album \u00b7 February 2027 \u00b7 Mot\u00e9ma Music",
    // Optional. Only fill this in if it's TRUE every night, e.g.
    //   "Ask Juanito to sign it after the show"
    // Leave "" and nothing prints.
    perk: "",

    /* Seat notes: little slips to leave on every seat or table before the
       show, ten to a page. Someone reads it while they wait for the lights
       to go down, and it's in their pocket when they walk past the table.
       Set seatNote: "" to leave the sheet off the print page.            */
    seatNote: "Take the music home tonight",
    seatNoteSub: "CDs, the method book and the email list are at the merch " +
                 "table. Scan to see what's there, or come say hello after.",
    // The small line at the bottom of each slip, e.g. where the table is.
    seatNoteWhere: "Merch table in the lobby"
  }
};

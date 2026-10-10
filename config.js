/* ============================================================
   JUANITO PASCUAL — MERCH BOOTH PAGE
   ------------------------------------------------------------
   THIS IS THE ONLY FILE YOU NEED TO EDIT.
   Anything marked TODO still needs a real value.
   Save, then run:  npx vercel --prod
   ============================================================ */

window.SITE = {

  /* ============================================================
     >>> PASTE JUANITO'S PAYPAL.ME USERNAME HERE WHEN HE TEXTS IT <<<

     Just the username, nothing else. No "@", no "paypal.me/", no https.
     If his link is  https://paypal.me/juanitopascual
     then put       "juanitopascual"

     Filling this in does three things on its own:
       1. PayPal becomes a real tappable button on the page
       2. His email address comes off the page entirely
       3. `npm run qr` starts building a PayPal QR code too

     Leave it as "" until then and the page shows his email with a
     Copy button instead, which still works fine.
     ============================================================ */
  paypalUsername: "",

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
    onSigns: false,
    // Eventbrite listing. Shown in the links row at the bottom
    // so people can send it to a friend. Set to "" to hide.
    ticketUrl: "https://www.eventbrite.com/e/juanito-pascual-trio-a-flamenco-celebration-of-jimi-hendrix-tickets-1990615820505"
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
                "Join the mailing list below to hear first."
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
      url: "https://venmo.com/u/Juanito-Pascual"
    },
    {
      // TODO: PayPal.Me links need a USERNAME, not an email address.
      // Juanito: go to https://paypal.me/my/settings and claim one
      // (takes 2 min), then replace this whole block with:
      //   { type:"link", id:"paypal", label:"PayPal",
      //     sub:"Card or PayPal balance",
      //     url:"https://paypal.me/HIS-NEW-USERNAME" }
      type: "copy",
      id: "paypal",
      label: "PayPal",
      sub: "Send to this address",
      value: "jp@jpascual.com"
    },
    {
      type: "info",
      id: "cash",
      label: "Cash or check",
      sub: "Checks payable to <b>Three Columns Music</b>"
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
    { label: "Tickets",            url: "https://www.eventbrite.com/e/juanito-pascual-trio-a-flamenco-celebration-of-jimi-hendrix-tickets-1990615820505" },
    { label: "Instagram",          url: "https://instagram.com/jpas.guitar" },
    { label: "YouTube",            url: "https://youtube.com/@juanitopascual1" },
    { label: "juanitopascual.com", url: "https://juanitopascual.com" }
  ],

  /* --- Footer ------------------------------------------------- */
  footer: "Thank you for the support &mdash; come say hello.",

  /* --- QR codes ----------------------------------------------
     `npm run qr` builds one code per entry below.
     TODO: replace siteUrl with the real Vercel URL once deployed.
     Everything else is already correct.                      */
  qr: {
    siteUrl: "https://mjg-music.github.io/juanito-merch/",
    /* Each entry below becomes one printed sign.
         label  the BIG headline across the top of the sign — keep it to a
                few words, it is what someone reads walking past
         sub    the smaller line under the headline
         note   only appears on your own print page, not on the sign       */
    codes: [
      { file: "booth", label: "Merch &amp; Mailing List",
        sub: "Prices, how to pay, and the mailing list",
        note: "The main one. Put this on the table \u2014 it opens the page with prices, payment and the mailing list.",
        use: "siteUrl" },
      { file: "email", label: "Join the Mailing List",
        sub: "Tour dates and new releases",
        note: "Goes straight to the sign-up on juanitopascual.com.",
        url: "https://juanitopascual.com/contact#mailing_list_feature_436168" },
      { file: "venmo", label: "Pay by Venmo",
        sub: "@Juanito-Pascual",
        note: "Opens Venmo so someone can pay you directly.",
        url: "https://venmo.com/u/Juanito-Pascual" }
      // The PayPal code adds itself once paypalUsername is filled in at the top.
    ]
  }
};

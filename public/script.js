<!DOCTYPE html>
<!--
  ================================================================
  GO FIX TODAY — index.html
  ================================================================

  REVIEW IMAGES (job photos / proof gallery)
  - Create an /assets/ folder in the repo root
  - Name your images: review-1.jpg, review-2.jpg, ... review-6.jpg
    (JPG, WebP, or PNG all work — just update the src attributes below)
  - To add more images: duplicate any <div class="galItem">…</div>
    block inside <div class="reviewGallery"> and update src + caption

  CELL IMAGES (3D viewer)
  - Front face: reconditioned-toyota-hybrid-battery-cell-module-1200x789.webp
  - Back face:  reconditioned-toyota-hybrid-battery-cell-module-2-1536x1302.webp
  - Both files must be in the repo root (same level as index.html)

  AD DEEP-LINK ANCHORS
  - #reviews  → Proof / real job photos + testimonials
  - #cells    → Reconditioned NiMH cells (buy / order)
  - #services → Prius + Lexus service details
  - #faq      → FAQ (service + cells questions)

  ================================================================
-->
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GO FIX TODAY — Mobile Prius Hybrid Battery Repair (SoCal)</title>
  <meta name="description" content="Mobile Prius and select Lexus hybrid battery repair in Southern California. $99 diagnostic credited toward service. Text for a fast quote." />

  <!-- Google Ads — do not remove or reorder -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17973103075"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'AW-17973103075');
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,700;9..40,900&display=swap" rel="stylesheet" />

  <style>
    /* ── TOKENS ── */
    :root {
      --bg:     #0b0b0b;
      --text:   #f2f2f2;
      --muted:  #a7a7a7;
      --muted2: #666;
      --line:   rgba(255,255,255,.08);
      --line2:  rgba(255,255,255,.13);
      --accent: #C8F542;
      --shadow: 0 24px 80px rgba(0,0,0,.6);
      --r:      20px;
      --max:    1120px;
      --f:      'DM Sans', ui-sans-serif, system-ui, -apple-system, sans-serif;
    }

    /* ── RESET ── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background:
        radial-gradient(900px 500px at 18% -8%, rgba(200,245,66,.07), transparent 55%),
        radial-gradient(700px 420px at 88% 4%,  rgba(200,245,66,.045), transparent 55%),
        var(--bg);
      color: var(--text);
      font-family: var(--f);
      letter-spacing: -.2px;
    }
    a { color: inherit; text-decoration: none; }
    img { display: block; max-width: 100%; }

    /* ── LAYOUT ── */
    .wrap {
      max-width: var(--max);
      margin: 0 auto;
      padding: 20px 16px 80px;
    }

    /* ── NAV ── */
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 4px 0 14px;
    }
    .brand {
      font-weight: 950;
      letter-spacing: .5px;
      text-transform: uppercase;
      font-size: 17px;
      white-space: nowrap;
    }
    .brand .fx { color: var(--accent); }
    .topRight { display: flex; align-items: center; gap: 22px; }
    .topLinks {
      display: flex;
      gap: 20px;
      align-items: center;
      color: var(--muted);
      font-size: 13px;
      font-weight: 700;
    }
    .topLinks a { transition: color .15s; }
    .topLinks a:hover { color: #fff; }
    .langBtn {
      background: rgba(255,255,255,.055);
      border: 1px solid rgba(255,255,255,.12);
      color: var(--muted);
      font-family: var(--f);
      font-size: 11px;
      font-weight: 900;
      letter-spacing: .12em;
      padding: 6px 13px;
      border-radius: 999px;
      cursor: pointer;
      transition: background .15s, color .15s;
      white-space: nowrap;
    }
    .langBtn:hover { background: rgba(255,255,255,.1); color: #fff; }
    @media(max-width: 760px) { .topLinks { display: none; } }

    /* ── HERO ── */
    .hero {
      display: grid;
      grid-template-columns: 1.12fr .88fr;
      gap: 16px;
      align-items: start;
      margin-top: 4px;
      animation: fadeUp .45s ease both;
    }
    @media(max-width: 900px) { .hero { grid-template-columns: 1fr; } }
    .heroLeft { padding: 10px 0 0; }

    h1 {
      font-size: clamp(44px, 7.2vw, 84px);
      line-height: .93;
      letter-spacing: -1.8px;
      font-weight: 980;
    }
    .ac { color: var(--accent); }

    .sub {
      margin-top: 14px;
      color: var(--muted);
      font-size: 15px;
      line-height: 1.62;
      max-width: 50ch;
    }
    .ctaRow {
      margin-top: 18px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    /* ── BUTTONS ── */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 15px 22px;
      border-radius: 13px;
      font-weight: 950;
      font-family: var(--f);
      font-size: 15px;
      border: 1px solid transparent;
      cursor: pointer;
      user-select: none;
      transition: transform .08s, filter .15s, background .15s;
      min-width: 210px;
      letter-spacing: -.1px;
      white-space: nowrap;
    }
    .btn:active { transform: translateY(1px); }
    .btn-p {
      background: var(--accent);
      color: #0b0b0b;
      box-shadow: 0 14px 44px rgba(200,245,66,.15);
    }
    .btn-p:hover { filter: brightness(1.05); }
    .btn-s {
      background: rgba(255,255,255,.06);
      border-color: var(--line);
      color: #ddd;
      min-width: 170px;
    }
    .btn-s:hover { background: rgba(255,255,255,.09); }
    @media(max-width: 520px) { .btn { width: 100%; min-width: unset; } }

    .smallNote {
      margin-top: 10px;
      font-size: 12px;
      color: var(--muted2);
      line-height: 1.5;
    }

    /* ── TRUST ── */
    .trustBar {
      margin-top: 18px;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .ti {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 7px 11px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.07);
      background: rgba(255,255,255,.02);
      color: var(--muted);
      font-size: 12px;
      font-weight: 700;
    }
    .ti svg { flex-shrink: 0; }

    /* ── PRICING CARD ── */
    .card {
      background: linear-gradient(180deg, rgba(255,255,255,.048), rgba(255,255,255,.018));
      border: 1px solid var(--line);
      border-radius: var(--r);
      box-shadow: var(--shadow);
      padding: 20px;
      position: relative;
      overflow: hidden;
    }
    .card::before {
      content: "";
      position: absolute;
      inset: 0 auto auto 0;
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, rgba(200,245,66,.65), transparent);
    }
    .cardLabel {
      font-size: 10px;
      font-weight: 900;
      letter-spacing: .2em;
      text-transform: uppercase;
      color: var(--muted2);
      margin-bottom: 14px;
    }
    .priceGrid { display: grid; gap: 7px; }
    .prow {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 12px;
      border-radius: 11px;
      background: rgba(0,0,0,.26);
      border: 1px solid rgba(255,255,255,.05);
    }
    .prow .lbl { color: var(--muted); font-weight: 700; font-size: 13px; }
    .prow .val { color: #fff; font-weight: 950; font-size: 16px; }
    .prow .val.av { color: var(--accent); }
    .diagNote {
      font-size: 11px;
      color: var(--muted2);
      line-height: 1.45;
      padding: 4px 2px 8px;
    }
    .quickLinks { margin-top: 14px; display: grid; gap: 7px; }
    .qlink {
      padding: 10px 13px;
      border-radius: 11px;
      border: 1px solid rgba(255,255,255,.07);
      background: rgba(255,255,255,.022);
      color: #d9d9d9;
      font-weight: 800;
      font-size: 13px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: background .15s;
    }
    .qlink:hover { background: rgba(255,255,255,.04); }
    .qlink span:last-child { color: var(--accent); }

    /* ── SECTIONS ── */
    .section {
      margin-top: 18px;
      padding: 22px 20px;
      border-radius: var(--r);
      border: 1px solid var(--line);
      background: rgba(255,255,255,.018);
      scroll-margin-top: 20px;
    }
    .slabel {
      font-size: 10px;
      font-weight: 900;
      letter-spacing: .2em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 7px;
    }
    .section h2 {
      font-size: clamp(24px, 3.8vw, 32px);
      letter-spacing: -.8px;
      font-weight: 980;
      margin-bottom: 6px;
    }
    .section .sub { margin-top: 6px; }

    /* ── PROOF / PHOTO GALLERY ── */
    .proofBullets {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin: 12px 0 20px;
    }
    .proofBullets li {
      color: var(--muted);
      font-size: 13px;
      line-height: 1.5;
      display: flex;
      align-items: flex-start;
      gap: 9px;
    }
    .proofBullets li::before {
      content: "";
      display: block;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--accent);
      margin-top: 6px;
      flex-shrink: 0;
    }

    /* Swipeable gallery */
    .galWrap {
      margin: 0 -20px;
      padding: 0 20px 12px;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      display: flex;
      gap: 10px;
    }
    .galWrap::-webkit-scrollbar { display: none; }
    .galItem {
      flex: 0 0 72vw;
      max-width: 300px;
      scroll-snap-align: start;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,.09);
      background: rgba(0,0,0,.3);
    }
    @media(min-width: 600px) { .galItem { flex: 0 0 260px; } }
    .galItem img {
      width: 100%;
      height: 340px;
      object-fit: cover;
      pointer-events: none;
    }
    .galCap {
      padding: 9px 12px 10px;
      font-size: 11px;
      font-weight: 700;
      color: var(--muted2);
      letter-spacing: .02em;
    }

    /* Testimonials */
    .reviewGrid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-top: 20px;
    }
    @media(max-width: 760px) { .reviewGrid { grid-template-columns: 1fr; } }
    .revCard {
      padding: 16px;
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,.06);
      background: rgba(0,0,0,.22);
    }
    .revStars { color: var(--accent); font-size: 11px; letter-spacing: 2px; margin-bottom: 8px; }
    .revText {
      color: var(--muted);
      font-size: 13px;
      line-height: 1.6;
      font-style: italic;
      margin-bottom: 10px;
    }
    .revAuthor { font-weight: 800; font-size: 12px; color: #ccc; }
    .revMeta { font-size: 11px; color: var(--muted2); margin-top: 2px; }

    .igLink {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 16px;
      font-size: 12px;
      font-weight: 700;
      color: var(--muted2);
      transition: color .15s;
    }
    .igLink:hover { color: var(--muted); }

    /* ── HOW IT WORKS ── */
    .grid3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-top: 14px;
    }
    @media(max-width: 760px) { .grid3 { grid-template-columns: 1fr; } }
    .box {
      padding: 16px;
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,.07);
      background: rgba(0,0,0,.22);
    }
    .box .n { font-weight: 980; color: rgba(200,245,66,.22); font-size: 24px; margin-bottom: 6px; }
    .box .t { font-weight: 950; font-size: 14px; margin-bottom: 5px; }
    .box .d { color: var(--muted); line-height: 1.55; font-size: 13px; }

    /* ── SERVICES ── */
    .serviceSplit {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 14px;
    }
    @media(max-width: 760px) { .serviceSplit { grid-template-columns: 1fr; } }
    .svcCard {
      padding: 18px;
      border-radius: 18px;
      border: 1px solid rgba(255,255,255,.08);
      background: rgba(0,0,0,.22);
      position: relative;
      overflow: hidden;
    }
    .svcCard::before {
      content: "";
      position: absolute;
      inset: 0 auto auto 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, var(--accent), transparent);
    }
    .svcCard h3 { font-size: 19px; letter-spacing: -.4px; font-weight: 980; margin-bottom: 8px; }
    .svcCard p { color: var(--muted); line-height: 1.55; font-size: 13px; }
    .tagRow { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
    .tag {
      padding: 6px 11px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.08);
      background: rgba(255,255,255,.03);
      color: #ccc;
      font-size: 12px;
      font-weight: 700;
    }

    /* ── CELLS — 3D VIEWER ── */
    .cellsGrid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-top: 14px;
      align-items: start;
    }
    @media(max-width: 760px) { .cellsGrid { grid-template-columns: 1fr; } }

    .cell3dWrap {
      perspective: 900px;
      cursor: grab;
      user-select: none;
      touch-action: none;
      border-radius: 16px;
    }
    .cell3dWrap:active { cursor: grabbing; }
    .cell3dScene {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 10;
      transform-style: preserve-3d;
      will-change: transform;
    }
    .cell3dFace {
      position: absolute;
      inset: 0;
      border-radius: 16px;
      overflow: hidden;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border: 1px solid rgba(255,255,255,.1);
      box-shadow: 0 20px 60px rgba(0,0,0,.5);
    }
    .cell3dFace.back { transform: rotateY(180deg); }
    .cell3dFace img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }

    .pricePill {
      display: inline-block;
      margin-top: 10px;
      padding: 5px 14px;
      border-radius: 999px;
      background: rgba(200,245,66,.1);
      border: 1px solid rgba(200,245,66,.22);
      color: var(--accent);
      font-weight: 950;
      font-size: 13px;
    }
    .cell3dHint {
      text-align: center;
      font-size: 11px;
      color: var(--muted2);
      margin-top: 7px;
      letter-spacing: .04em;
      transition: opacity .5s;
    }

    .cellsCard {
      border: 1px solid rgba(255,255,255,.08);
      background: rgba(0,0,0,.22);
      border-radius: 18px;
      padding: 18px;
    }
    .cellsH { font-weight: 980; font-size: 17px; letter-spacing: -.3px; margin-bottom: 7px; }
    .cellsMini { color: var(--muted); font-size: 13px; line-height: 1.5; margin-bottom: 12px; }
    .cellsBullets {
      list-style: none;
      display: grid;
      gap: 8px;
      color: var(--muted);
      font-size: 13px;
    }
    .cellsBullets li {
      display: flex;
      gap: 9px;
      align-items: flex-start;
      line-height: 1.5;
    }
    .cellsBullets li::before {
      content: "";
      display: block;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: rgba(200,245,66,.45);
      margin-top: 6px;
      flex-shrink: 0;
    }
    .cellsBullets b { color: #ddd; }

    /* ── FAQ ── */
    .faqList { display: grid; gap: 8px; margin-top: 14px; }
    details {
      border: 1px solid rgba(255,255,255,.07);
      background: rgba(0,0,0,.2);
      border-radius: 14px;
      padding: 13px 16px;
    }
    summary {
      cursor: pointer;
      font-weight: 900;
      font-size: 14px;
      color: #f0f0f0;
      letter-spacing: -.15px;
      list-style: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }
    summary::-webkit-details-marker { display: none; }
    summary::after {
      content: "+";
      color: var(--accent);
      font-size: 18px;
      font-weight: 300;
      flex-shrink: 0;
      transition: transform .2s;
      line-height: 1;
    }
    details[open] summary::after { transform: rotate(45deg); }
    details p { color: var(--muted); line-height: 1.6; margin: 10px 0 2px; font-size: 13px; }

    /* ── FOOTER CTA ── */
    .footerCta {
      margin-top: 18px;
      padding: 24px 22px;
      border-radius: var(--r);
      border: 1px solid var(--line2);
      background: linear-gradient(180deg, rgba(200,245,66,.07), rgba(255,255,255,.015));
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }
    .footerCta h3 { font-size: clamp(19px, 3.5vw, 25px); letter-spacing: -.6px; font-weight: 980; margin-bottom: 5px; }
    .footerCta p { color: var(--muted); font-size: 13px; }

    /* ── FOOTER ── */
    footer {
      margin-top: 22px;
      color: var(--muted2);
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      gap: 10px;
      flex-wrap: wrap;
      border-top: 1px solid rgba(255,255,255,.06);
      padding-top: 16px;
    }
    .ml { color: var(--muted2); text-decoration: underline; text-underline-offset: 3px; }
    .ml:hover { color: var(--muted); }

    /* ── STICKY MOBILE BAR ── */
    .stickyBar {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 10px 16px 10px;
      background: rgba(11,11,11,.95);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border-top: 1px solid rgba(200,245,66,.12);
      z-index: 999;
      opacity: 0;
      pointer-events: none;
      transition: opacity .28s ease;
    }
    .stickyBar .btn { min-width: unset; width: 100%; padding: 14px; font-size: 15px; }
    @media(max-width: 760px) { .stickyBar { display: block; } .wrap { padding-bottom: 88px; } }

    /* ── POPUP ── */
    .popOverlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.72);
      backdrop-filter: blur(10px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 16px;
    }
    .popOverlay.show { display: flex; }
    .popBox {
      width: min(100%, 420px);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 50px 140px rgba(0,0,0,.7), 0 0 0 1px rgba(200,245,66,.12);
      animation: popIn .3s cubic-bezier(.22,1,.36,1) both;
    }
    .popTop {
      background: radial-gradient(circle at 30% 40%, rgba(200,245,66,.22), transparent 60%), linear-gradient(160deg, #1a2200, #0d0d0d);
      padding: 34px 28px 26px;
      text-align: center;
      position: relative;
    }
    .popClose {
      position: absolute;
      top: 14px;
      right: 14px;
      width: 34px;
      height: 34px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.12);
      background: rgba(255,255,255,.06);
      color: rgba(255,255,255,.5);
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background .15s, color .15s;
    }
    .popClose:hover { background: rgba(255,255,255,.12); color: #fff; }
    .popAmount { font-size: clamp(68px, 17vw, 88px); font-weight: 980; line-height: .85; letter-spacing: -3px; color: var(--accent); }
    .popOff { font-size: clamp(24px, 6vw, 32px); font-weight: 980; color: #fff; letter-spacing: -.5px; margin: 4px 0 0; }
    .popDesc { margin-top: 10px; color: rgba(255,255,255,.5); font-size: 13px; line-height: 1.5; }
    .popBottom { background: #0d0d0d; padding: 20px 28px 26px; }
    .popForm { display: grid; gap: 10px; }
    .popInputRow { display: flex; gap: 8px; }
    .popInput {
      flex: 1;
      min-height: 50px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,.12);
      background: rgba(255,255,255,.06);
      color: #fff;
      padding: 0 14px;
      font-size: 16px;
      font-family: var(--f);
      outline: none;
      transition: border-color .15s;
    }
    .popInput::placeholder { color: rgba(255,255,255,.3); }
    .popInput:focus { border-color: var(--accent); }
    .popSubmit {
      min-height: 50px;
      padding: 0 18px;
      border-radius: 12px;
      border: none;
      background: var(--accent);
      color: #0b0b0b;
      font-family: var(--f);
      font-size: 14px;
      font-weight: 950;
      cursor: pointer;
      transition: filter .12s, transform .08s;
      white-space: nowrap;
    }
    .popSubmit:hover { filter: brightness(1.05); }
    .popSubmit:active { transform: translateY(1px); }
    .popSubmit:disabled { opacity: .6; cursor: not-allowed; }
    .popConsent { display: flex; align-items: flex-start; gap: 8px; font-size: 11px; color: rgba(255,255,255,.3); line-height: 1.4; }
    .popConsent input { margin-top: 2px; accent-color: var(--accent); }
    .popOrCall { text-align: center; margin-top: 10px; }
    .popOrCall a { color: var(--muted); font-size: 13px; font-weight: 700; text-decoration: underline; text-underline-offset: 3px; }
    .popOrCall a:hover { color: #fff; }
    .popTerms { text-align: center; margin-top: 12px; font-size: 11px; color: var(--muted2); line-height: 1.4; }
    .popSuccess { display: none; text-align: center; padding: 16px; color: var(--accent); font-weight: 800; font-size: 14px; line-height: 1.5; }
    .popSuccess.show { display: block; }
    @media(max-width: 520px) {
      .popTop { padding: 26px 18px 20px; }
      .popBottom { padding: 16px 18px 22px; }
      .popInputRow { flex-direction: column; }
    }

    /* ── ANIMATIONS ── */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes popIn {
      from { opacity: 0; transform: scale(.92) translateY(20px); }
      to   { opacity: 1; transform: scale(1)   translateY(0); }
    }
  </style>
</head>
<body>
<div class="wrap">

  <!-- ═══ NAV ═══ -->
  <div class="top">
    <div class="brand">GO<span class="fx">FIX</span>TODAY</div>
    <div class="topRight">
      <nav class="topLinks">
        <a href="#reviews"  data-t="nav-reviews">Reviews</a>
        <a href="#services" data-t="nav-services">Services</a>
        <a href="#cells"    data-t="nav-cells">Cells</a>
        <a href="#faq"      data-t="nav-faq">FAQ</a>
      </nav>
      <button class="langBtn" id="langToggle">ES</button>
    </div>
  </div>

  <!-- ═══ HERO ═══ -->
  <div class="hero">
    <div class="heroLeft">
      <h1 data-t="hero-h1">Mobile Prius<br>Hybrid Battery<br><span class="ac">Repair. Your Door.</span></h1>
      <p class="sub" data-t="hero-sub">No towing. No dealership. We come to you, diagnose on-site, and fix it the same day when possible.</p>
      <div class="ctaRow">
        <a class="btn btn-p"
           href="sms:+16574782947?body=Hi%20GoFix%20Today%20%E2%80%94%20Prius%20battery%20help.%20Year%3A%20____%20City%3A%20____"
           onclick="trackTextConversion(event)"
           data-t="btn-text">Click to Text</a>
        <a class="btn btn-s"
           href="tel:+16574782947"
           onclick="trackCallClick(event)"
           data-t="btn-call">Click to Call</a>
      </div>
      <div class="smallNote" data-t="hero-note">Text <b>Year + City</b>. Most replies under 5 min. (657) 478-2947</div>
      <div class="trustBar">
        <div class="ti">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 1l2.12 4.3 4.74.69-3.43 3.34.81 4.72L8 11.77l-4.24 2.23.81-4.72L1.14 5.94l4.74-.69L8 1z" fill="#C8F542"/></svg>
          <span data-t="trust-1">5-star rated</span>
        </div>
        <div class="ti">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.5 6.3l-4 4a.75.75 0 01-1.06 0l-2-2a.75.75 0 011.06-1.06L7 8.74l3.47-3.47a.75.75 0 011.06 1.06z" fill="#C8F542"/></svg>
          <span data-t="trust-2">Licensed & insured</span>
        </div>
        <div class="ti">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 1.33A6.67 6.67 0 1014.67 8 6.67 6.67 0 008 1.33zm2.47 4.2L7.8 9.87a.67.67 0 01-.47.2.67.67 0 01-.47-.2L5.53 8.53a.67.67 0 01.94-.93l.87.86 2.2-3.86a.67.67 0 011.16.66z" fill="#C8F542"/></svg>
          <span data-t="trust-3">3-month warranty</span>
        </div>
      </div>
    </div>

    <!-- Pricing card -->
    <div class="card">
      <div class="cardLabel" data-t="card-label">Pricing</div>
      <div class="priceGrid">
        <div class="prow">
          <div class="lbl" data-t="price-diag-lbl">Mobile Diagnostic</div>
          <div class="val av">$99</div>
        </div>
        <div class="diagNote" data-t="price-diag-note">Credited toward repair or replacement if you move forward.</div>
        <div class="prow">
          <div class="lbl" data-t="price-repair-lbl">Battery Repair</div>
          <div class="val">from <span class="av">$399</span></div>
        </div>
        <div class="prow">
          <div class="lbl" data-t="price-replace-lbl">Full Replacement</div>
          <div class="val">from <span class="av">$999</span></div>
        </div>
        <div class="prow">
          <div class="lbl" data-t="price-warranty-lbl">Warranty</div>
          <div class="val av" style="font-size:14px" data-t="price-warranty-val">3 months</div>
        </div>
      </div>
      <div class="diagNote" style="margin-top:12px;padding:0" data-t="card-area">Serving Orange County, South Bay &amp; surrounding SoCal areas. Final price after on-site diagnostic.</div>
      <div class="quickLinks">
        <a class="qlink" href="#lexus"><span data-t="qlink-lexus">Lexus hybrid battery service</span><span>→</span></a>
        <a class="qlink" href="#cells"><span data-t="qlink-cells">Buy reconditioned cells</span><span>→</span></a>
      </div>
    </div>
  </div>

  <!-- ═══ PROOF / REVIEWS ═══ -->
  <div class="section" id="reviews">
    <div class="slabel" data-t="proof-label">Real Jobs</div>
    <h2 data-t="proof-h2">Hundreds of batteries fixed across SoCal.</h2>
    <ul class="proofBullets">
      <li data-t="proof-b1">Same-day service at your home or workplace — no towing, no drop-off</li>
      <li data-t="proof-b2">Every battery tested and warranted before we leave the job</li>
      <li data-t="proof-b3">Long Beach, Anaheim, Torrance, Garden Grove, and surrounding cities</li>
    </ul>

    <!-- Swipeable photo gallery -->
    <!-- Add review-1.jpg through review-6.jpg in /assets/ folder.
         To add more images: duplicate a .galItem block and update src + caption. -->
    <div class="galWrap">
      <div class="galItem">
        <img src="assets/review-1.jpg" alt="2011 Prius hybrid battery fix — Long Beach" loading="lazy" />
        <div class="galCap">2011 Prius — Long Beach, CA</div>
      </div>
      <div class="galItem">
        <img src="assets/review-2.jpg" alt="2010 Prius hybrid battery fix — Garden Grove" loading="lazy" />
        <div class="galCap">2010 Prius — Garden Grove, CA</div>
      </div>
      <div class="galItem">
        <img src="assets/review-3.jpg" alt="Prius hybrid battery repair — SoCal" loading="lazy" />
        <div class="galCap">Prius — Orange County, CA</div>
      </div>
      <div class="galItem">
        <img src="assets/review-4.jpg" alt="Hybrid battery replacement — SoCal" loading="lazy" />
        <div class="galCap">Prius — South Bay, CA</div>
      </div>
      <div class="galItem">
        <img src="assets/review-5.jpg" alt="On-site hybrid battery repair" loading="lazy" />
        <div class="galCap">Mobile service — Torrance, CA</div>
      </div>
      <div class="galItem">
        <img src="assets/review-6.jpg" alt="Battery cells repair completed" loading="lazy" />
        <div class="galCap">Prius — Anaheim, CA</div>
      </div>
    </div>

    <!-- Testimonials -->
    <div class="reviewGrid">
      <div class="revCard">
        <div class="revStars">★ ★ ★ ★ ★</div>
        <div class="revText">"Came to my house, diagnosed it in 30 minutes, and had the battery repaired the same afternoon. Way better than the dealership."</div>
        <div class="revAuthor">Carlos M.</div>
        <div class="revMeta">2013 Prius — Anaheim, CA</div>
      </div>
      <div class="revCard">
        <div class="revStars">★ ★ ★ ★ ★</div>
        <div class="revText">"Texted in the morning, they were at my office by 2pm. Professional, explained everything, fair price."</div>
        <div class="revAuthor">Priya S.</div>
        <div class="revMeta">2010 Prius — Long Beach, CA</div>
      </div>
      <div class="revCard">
        <div class="revStars">★ ★ ★ ★ ★</div>
        <div class="revText">"Bought 8 cells for my own repair. Good quality, fair price, answered all my questions. Solid operation."</div>
        <div class="revAuthor">Mike T.</div>
        <div class="revMeta">Battery cells — Torrance, CA</div>
      </div>
    </div>

    <a class="igLink" href="https://instagram.com/gofixtoday" target="_blank" rel="noopener" data-t="ig-link">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="3"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
      See more on Instagram @gofixtoday
    </a>
  </div>

  <!-- ═══ HOW IT WORKS ═══ -->
  <div class="section">
    <div class="slabel" data-t="how-label">How it works</div>
    <h2 data-t="how-h2">Three steps, no runaround.</h2>
    <div class="grid3">
      <div class="box">
        <div class="n">01</div>
        <div class="t" data-t="how-1t">Text us</div>
        <div class="d" data-t="how-1d">Send your year and city. We reply fast with pricing and availability.</div>
      </div>
      <div class="box">
        <div class="n">02</div>
        <div class="t" data-t="how-2t">We come to you</div>
        <div class="d" data-t="how-2d">On-site diagnostic at your home or workplace. No towing, no drop-off.</div>
      </div>
      <div class="box">
        <div class="n">03</div>
        <div class="t" data-t="how-3t">Fixed same day</div>
        <div class="d" data-t="how-3d">Repair or replacement done on-site. Tested before we leave. Warranty included.</div>
      </div>
    </div>
  </div>

  <!-- ═══ SERVICES ═══ -->
  <div class="section" id="services">
    <div class="slabel" data-t="svc-label">Services</div>
    <h2 data-t="svc-h2">What we fix.</h2>
    <p class="sub" data-t="svc-sub">Mobile diagnostic, cell-level repair, or full pack replacement — all done at your location in LA and OC.</p>
    <div class="serviceSplit">
      <div class="svcCard">
        <h3 data-t="svc-prius-h">Prius hybrid battery</h3>
        <p data-t="svc-prius-p">Our core service. Mobile diagnostic, cell repair, or full pack replacement for Toyota Prius and Prius-family hybrids. Most jobs completed same day.</p>
        <div class="tagRow">
          <span class="tag">Prius Gen 2 &amp; 3</span>
          <span class="tag">Prius C / V</span>
          <span class="tag">Camry Hybrid</span>
          <span class="tag">Mobile service</span>
        </div>
        <div class="ctaRow" style="margin-top:14px">
          <a class="btn btn-p"
             href="sms:+16574782947?body=Hi%20GoFix%20Today%20%E2%80%94%20Prius%20battery%20help.%20Year%3A%20____%20City%3A%20____"
             onclick="trackTextConversion(event)"
             data-t="btn-text">Click to Text</a>
        </div>
      </div>
      <div class="svcCard" id="lexus">
        <h3 data-t="svc-lexus-h">Lexus hybrid battery</h3>
        <p data-t="svc-lexus-p">We service select Lexus hybrid models with compatible NiMH battery systems. Text your year and model and we'll confirm compatibility.</p>
        <div class="tagRow">
          <span class="tag">RX 400h / 450h</span>
          <span class="tag">CT 200h</span>
          <span class="tag">HS 250h</span>
          <span class="tag">Text to confirm fit</span>
        </div>
        <div class="ctaRow" style="margin-top:14px">
          <a class="btn btn-p"
             href="sms:+16574782947?body=Hi%20GoFix%20Today%20%E2%80%94%20Lexus%20hybrid%20battery.%20Year%3A%20____%20Model%3A%20____%20City%3A%20____"
             onclick="trackTextConversion(event)"
             data-t="svc-lexus-btn">Text about Lexus</a>
        </div>
      </div>
    </div>
  </div>

  <!-- ═══ CELLS ═══ -->
  <div class="section" id="cells">
    <div class="slabel" data-t="cells-label">Cells</div>
    <h2 data-t="cells-h2">Reconditioned NiMH Battery Cells.</h2>
    <p class="sub" data-t="cells-sub">Individual cells for DIY repairs or shops. Tested, reconditioned, ready to drop in.</p>

    <div class="cellsGrid">
      <!-- 3D interactive cell viewer — drag to rotate, shows both sides of the module -->
      <div>
        <div class="cell3dWrap" id="cell3dWrap">
          <div class="cell3dScene" id="cell3dScene">
            <div class="cell3dFace">
              <img src="reconditioned-toyota-hybrid-battery-cell-module-1200x789.webp"
                   alt="Reconditioned Toyota hybrid battery cell module — front" />
            </div>
            <div class="cell3dFace back">
              <img src="reconditioned-toyota-hybrid-battery-cell-module-2-1536x1302.webp"
                   alt="Reconditioned Toyota hybrid battery cell module — back" />
            </div>
          </div>
        </div>
        <div class="pricePill">$35 / cell</div>
        <div class="cell3dHint" id="cell3dHint" data-t="cell3d-hint">Drag to explore</div>
      </div>

      <div class="cellsCard">
        <div class="cellsH" data-t="cells-card-h">Order by text.</div>
        <div class="cellsMini" data-t="cells-card-sub">Text your Prius year, quantity, and city for pickup or delivery options.</div>
        <ul class="cellsBullets">
          <li data-t="cells-b1"><b>$35 per cell</b> — tested and reconditioned</li>
          <li data-t="cells-b2"><b>Pickup available</b> in SoCal</li>
          <li data-t="cells-b3"><b>Mobile install</b> available on request</li>
          <li data-t="cells-b4">Not sure how many? Text your symptoms and we'll advise</li>
        </ul>
        <div class="ctaRow" style="margin-top:16px">
          <a class="btn btn-p"
             href="sms:+16574782947?body=Hi%20GoFix%20Today%20%E2%80%94%20I%20want%20battery%20cells.%20Prius%20year%3A%20____%20Qty%3A%20____%20City%3A%20____"
             onclick="trackTextConversion(event)"
             data-t="cells-btn">Text to Order Cells</a>
        </div>
      </div>
    </div>

    <div class="faqList" style="margin-top:14px">
      <details>
        <summary data-t="cfaq-1q">Which Prius years are compatible?</summary>
        <p data-t="cfaq-1a">We carry cells for most Prius model years. Text your year and we'll confirm.</p>
      </details>
      <details>
        <summary data-t="cfaq-2q">Do you sell cells for Lexus hybrids?</summary>
        <p data-t="cfaq-2a">Yes, for select compatible models. Text your year and model for the right fit.</p>
      </details>
      <details>
        <summary data-t="cfaq-3q">Can you install them for me?</summary>
        <p data-t="cfaq-3a">Yes. Mobile install available depending on vehicle, location, and schedule. Text for the fastest answer.</p>
      </details>
    </div>
  </div>

  <!-- ═══ FAQ ═══ -->
  <div class="section" id="faq">
    <div class="slabel" data-t="faq-label">FAQ</div>
    <h2 data-t="faq-h2">Common questions.</h2>
    <div class="faqList">
      <details>
        <summary data-t="faq-1q">Do you only work on Prius?</summary>
        <p data-t="faq-1a">Prius is our main focus, but we also support select Lexus hybrid models. Text your year and model to confirm.</p>
      </details>
      <details>
        <summary data-t="faq-2q">What does the $99 diagnostic include?</summary>
        <p data-t="faq-2a">We come to your location and test the entire hybrid battery pack at the cell level. You get a clear answer on what's failing and what it costs to fix. If you proceed, the $99 is credited toward the total.</p>
      </details>
      <details>
        <summary data-t="faq-3q">How long does a repair take?</summary>
        <p data-t="faq-3a">Most repairs take 1–3 hours on-site. Full replacements may take longer. We aim to complete same day.</p>
      </details>
      <details>
        <summary data-t="faq-4q">Do you offer a warranty?</summary>
        <p data-t="faq-4a">Yes. All battery repairs and replacements include a 3-month warranty.</p>
      </details>
      <details>
        <summary data-t="faq-5q">What areas do you serve?</summary>
        <p data-t="faq-5a">Orange County, South Bay, and surrounding SoCal areas. Text your city and we'll confirm.</p>
      </details>
      <details>
        <summary data-t="faq-6q">How do I get the fastest quote?</summary>
        <p data-t="faq-6a">Text your year and city. That gives us everything we need for a fast answer — usually under 5 minutes.</p>
      </details>
    </div>
  </div>

  <!-- ═══ FOOTER CTA ═══ -->
  <div class="footerCta">
    <div>
      <h3 data-t="fcta-h">Hybrid battery trouble?</h3>
      <p data-t="fcta-p">Text your year and city. Most quotes in under 5 min.</p>
    </div>
    <div class="ctaRow" style="margin-top:0">
      <a class="btn btn-p"
         href="sms:+16574782947?body=Hi%20GoFix%20Today%20%E2%80%94%20Prius%20battery%20help.%20Year%3A%20____%20City%3A%20____"
         onclick="trackTextConversion(event)"
         data-t="btn-text">Click to Text</a>
      <a class="btn btn-s"
         href="tel:+16574782947"
         onclick="trackCallClick(event)"
         data-t="btn-call">Click to Call</a>
    </div>
  </div>

  <!-- ═══ FOOTER ═══ -->
  <footer>
    <div>© <span id="yr"></span> GO FIX TODAY — Southern California</div>
    <div style="display:flex;gap:12px;flex-wrap:wrap">
      <a class="ml" href="#services">Services</a>
      <a class="ml" href="#cells">Cells</a>
      <a class="ml" href="https://wa.me/16574782947?text=Hi%20GoFix%20Today%20%E2%80%94%20question%20about%20hybrid%20battery%20service." target="_blank" rel="noopener">WhatsApp</a>
      <a class="ml" href="https://instagram.com/gofixtoday" target="_blank" rel="noopener">@gofixtoday</a>
    </div>
  </footer>

</div><!-- /wrap -->

<!-- ═══ POPUP — PHONE CAPTURE ($100 OFF) ═══ -->
<div class="popOverlay" id="popOverlay" aria-hidden="true">
  <div class="popBox" role="dialog" aria-modal="true">
    <div class="popTop">
      <button class="popClose" id="popClose" aria-label="Close">×</button>
      <div class="popAmount">$100</div>
      <div class="popOff">OFF your battery service</div>
      <div class="popDesc">Enter your number and we'll text you the voucher code.</div>
    </div>
    <div class="popBottom">
      <div id="popFormWrap">
        <form class="popForm" id="popForm">
          <div class="popInputRow">
            <input class="popInput" id="popPhone" type="tel" inputmode="tel" autocomplete="tel" placeholder="Your phone number" required />
            <button class="popSubmit" id="popSubmitBtn" type="submit">Get Voucher</button>
          </div>
          <label class="popConsent">
            <input id="popConsent" type="checkbox" required />
            <span>I agree to receive texts from GoFix Today. Not required to purchase. Reply STOP to opt out.</span>
          </label>
        </form>
        <div class="popOrCall"><a href="tel:+16574782947" onclick="trackCallClick(event)">or call (657) 478-2947</a></div>
        <div class="popTerms">$99 diagnostic credited toward repair. New customers. SoCal only.<br>Msg &amp; data rates may apply.</div>
      </div>
      <div class="popSuccess" id="popSuccess">Check your phone — we'll text you the voucher shortly.</div>
    </div>
  </div>
</div>

<!-- ═══ STICKY MOBILE BAR (single primary CTA) ═══ -->
<div class="stickyBar" id="stickyBar">
  <a class="btn btn-p"
     href="sms:+16574782947?body=Hi%20GoFix%20Today%20%E2%80%94%20Prius%20battery%20help.%20Year%3A%20____%20City%3A%20____"
     onclick="trackTextConversion(event)"
     data-t="btn-text">Click to Text</a>
</div>

<script>
  /* ── YEAR ── */
  document.getElementById('yr').textContent = new Date().getFullYear();

  /* ── CONVERSION TRACKING ── */
  function safeGtag() { return typeof window.gtag === 'function'; }
  function trackTextConversion(e) {
    if (!e) return;
    try {
      var h = e.currentTarget.getAttribute('href');
      if (safeGtag()) {
        gtag('event', 'conversion', {
          'send_to': 'AW-17973103075/HcX2CNuTk4gcEOOTn_pC',
          'value': 1.0,
          'currency': 'USD'
        });
      }
      e.preventDefault();
      setTimeout(function() { window.location.href = h; }, 220);
    } catch(err) {}
  }
  function trackCallClick(e) {
    if (!e) return;
    try {
      if (safeGtag()) {
        gtag('event', 'click_call', { method: 'tel', page_location: window.location.href });
      }
    } catch(err) {}
  }

  /* ── POPUP ── */
  var WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyWGuSL-XWm2PuVJCoBil5kOFaW7PuKraVoyG3SvVwkmL1pNgztANX59xQunMf9CVJi/exec';
  var popOverlay   = document.getElementById('popOverlay');
  var popClose     = document.getElementById('popClose');
  var popForm      = document.getElementById('popForm');
  var popPhone     = document.getElementById('popPhone');
  var popConsent   = document.getElementById('popConsent');
  var popSubmitBtn = document.getElementById('popSubmitBtn');
  var popFormWrap  = document.getElementById('popFormWrap');
  var popSuccess   = document.getElementById('popSuccess');

  function openPopup() { if (!popOverlay) return; popOverlay.classList.add('show'); popOverlay.setAttribute('aria-hidden', 'false'); }
  function closePopup() { if (!popOverlay) return; popOverlay.classList.remove('show'); popOverlay.setAttribute('aria-hidden', 'true'); }

  // Popup disabled by default — set to a reasonable number (e.g. 25000) to re-enable
  setTimeout(function() {
    if (!sessionStorage.getItem('gofix_pop')) { openPopup(); sessionStorage.setItem('gofix_pop', '1'); }
  }, 99999999999);

  if (popClose) popClose.addEventListener('click', closePopup);
  if (popOverlay) popOverlay.addEventListener('click', function(e) { if (e.target === popOverlay) closePopup(); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closePopup(); });

  if (popForm) {
    popForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      var phone = popPhone.value.trim();
      if (!phone || !popConsent.checked) return;
      popSubmitBtn.disabled = true;
      popSubmitBtn.textContent = 'Sending…';
      try {
        if (safeGtag()) {
          gtag('event', 'conversion', { 'send_to': 'AW-17973103075/HcX2CNuTk4gcEOOTn_pC', 'value': 1.0, 'currency': 'USD' });
          gtag('event', 'offer_lead_submit', { offer_type: '$100_off_popup', page_location: window.location.href });
        }
        await fetch(WEBHOOK_URL, {
          method: 'POST', mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: phone, source: 'voucher_popup' })
        });
      } catch(err) {}
      popFormWrap.style.display = 'none';
      popSuccess.classList.add('show');
    });
  }

  /* ── STICKY BAR ── */
  (function() {
    var bar = document.getElementById('stickyBar');
    if (!bar || window.innerWidth > 760) return;
    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          var show = window.scrollY > 360;
          bar.style.opacity = show ? '1' : '0';
          bar.style.pointerEvents = show ? 'auto' : 'none';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  })();

  /* ── 3D CELL VIEWER ── */
  (function() {
    var wrap  = document.getElementById('cell3dWrap');
    var scene = document.getElementById('cell3dScene');
    var hint  = document.getElementById('cell3dHint');
    if (!wrap || !scene) return;

    var rotX = -4, rotY = 14;
    var autoAngle = 14;
    var auto = true;
    var dragging = false;
    var lastX = 0, lastY = 0;
    var hintHidden = false;
    var resumeTimer = null;

    function applyRot(rx, ry) {
      scene.style.transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
    }

    (function loop() {
      if (auto) {
        autoAngle += 0.22;
        applyRot(rotX, autoAngle);
      }
      requestAnimationFrame(loop);
    })();

    function stopAuto() {
      if (auto) {
        rotY = autoAngle;
        auto = false;
        if (hint && !hintHidden) { hint.style.opacity = '0'; hintHidden = true; }
      }
      clearTimeout(resumeTimer);
    }

    function scheduleResume() {
      resumeTimer = setTimeout(function() {
        autoAngle = rotY;
        auto = true;
      }, 2800);
    }

    /* Mouse */
    wrap.addEventListener('mousedown', function(e) {
      dragging = true;
      lastX = e.clientX; lastY = e.clientY;
      stopAuto();
      e.preventDefault();
    });
    window.addEventListener('mousemove', function(e) {
      if (!dragging) return;
      rotY += (e.clientX - lastX) * 0.52;
      rotX -= (e.clientY - lastY) * 0.26;
      rotX = Math.max(-28, Math.min(28, rotX));
      applyRot(rotX, rotY);
      lastX = e.clientX; lastY = e.clientY;
    });
    window.addEventListener('mouseup', function() {
      if (dragging) { dragging = false; scheduleResume(); }
    });

    /* Touch */
    wrap.addEventListener('touchstart', function(e) {
      dragging = true;
      lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
      stopAuto();
    }, { passive: true });
    wrap.addEventListener('touchmove', function(e) {
      if (!dragging) return;
      rotY += (e.touches[0].clientX - lastX) * 0.52;
      rotX -= (e.touches[0].clientY - lastY) * 0.26;
      rotX = Math.max(-28, Math.min(28, rotX));
      applyRot(rotX, rotY);
      lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
    }, { passive: true });
    wrap.addEventListener('touchend', function() {
      if (dragging) { dragging = false; scheduleResume(); }
    });
  })();

  /* ── LANGUAGE TOGGLE (EN / ES) ── */
  (function() {
    var T = {
      en: {
        'nav-reviews':       'Reviews',
        'nav-services':      'Services',
        'nav-cells':         'Cells',
        'nav-faq':           'FAQ',
        'hero-h1':           'Mobile Prius<br>Hybrid Battery<br><span class="ac">Repair. Your Door.</span>',
        'hero-sub':          'No towing. No dealership. We come to you, diagnose on-site, and fix it the same day when possible.',
        'btn-text':          'Click to Text',
        'btn-call':          'Click to Call',
        'hero-note':         'Text <b>Year + City</b>. Most replies under 5 min. (657) 478-2947',
        'trust-1':           '5-star rated',
        'trust-2':           'Licensed &amp; insured',
        'trust-3':           '3-month warranty',
        'card-label':        'Pricing',
        'price-diag-lbl':    'Mobile Diagnostic',
        'price-diag-note':   'Credited toward repair or replacement if you move forward.',
        'price-repair-lbl':  'Battery Repair',
        'price-replace-lbl': 'Full Replacement',
        'price-warranty-lbl':'Warranty',
        'price-warranty-val':'3 months',
        'card-area':         'Serving Orange County, South Bay &amp; surrounding SoCal areas. Final price after on-site diagnostic.',
        'qlink-lexus':       'Lexus hybrid battery service',
        'qlink-cells':       'Buy reconditioned cells',
        'proof-label':       'Real Jobs',
        'proof-h2':          'Hundreds of batteries fixed across SoCal.',
        'proof-b1':          'Same-day service at your home or workplace — no towing, no drop-off',
        'proof-b2':          'Every battery tested and warranted before we leave the job',
        'proof-b3':          'Long Beach, Anaheim, Torrance, Garden Grove, and surrounding cities',
        'ig-link':           'See more on Instagram @gofixtoday',
        'how-label':         'How it works',
        'how-h2':            'Three steps, no runaround.',
        'how-1t':            'Text us',
        'how-1d':            'Send your year and city. We reply fast with pricing and availability.',
        'how-2t':            'We come to you',
        'how-2d':            'On-site diagnostic at your home or workplace. No towing, no drop-off.',
        'how-3t':            'Fixed same day',
        'how-3d':            'Repair or replacement done on-site. Tested before we leave. Warranty included.',
        'svc-label':         'Services',
        'svc-h2':            'What we fix.',
        'svc-sub':           'Mobile diagnostic, cell-level repair, or full pack replacement — all done at your location in LA and OC.',
        'svc-prius-h':       'Prius hybrid battery',
        'svc-prius-p':       'Our core service. Mobile diagnostic, cell repair, or full pack replacement for Toyota Prius and Prius-family hybrids. Most jobs completed same day.',
        'svc-lexus-h':       'Lexus hybrid battery',
        'svc-lexus-p':       'We service select Lexus hybrid models with compatible NiMH battery systems. Text your year and model and we\'ll confirm compatibility.',
        'svc-lexus-btn':     'Text about Lexus',
        'cells-label':       'Cells',
        'cells-h2':          'Reconditioned NiMH Battery Cells.',
        'cells-sub':         'Individual cells for DIY repairs or shops. Tested, reconditioned, ready to drop in.',
        'cells-card-h':      'Order by text.',
        'cells-card-sub':    'Text your Prius year, quantity, and city for pickup or delivery options.',
        'cells-b1':          '<b>$35 per cell</b> — tested and reconditioned',
        'cells-b2':          '<b>Pickup available</b> in SoCal',
        'cells-b3':          '<b>Mobile install</b> available on request',
        'cells-b4':          'Not sure how many? Text your symptoms and we\'ll advise',
        'cells-btn':         'Text to Order Cells',
        'cell3d-hint':       'Drag to explore',
        'cfaq-1q':           'Which Prius years are compatible?',
        'cfaq-1a':           'We carry cells for most Prius model years. Text your year and we\'ll confirm.',
        'cfaq-2q':           'Do you sell cells for Lexus hybrids?',
        'cfaq-2a':           'Yes, for select compatible models. Text your year and model for the right fit.',
        'cfaq-3q':           'Can you install them for me?',
        'cfaq-3a':           'Yes. Mobile install available depending on vehicle, location, and schedule. Text for the fastest answer.',
        'faq-label':         'FAQ',
        'faq-h2':            'Common questions.',
        'faq-1q':            'Do you only work on Prius?',
        'faq-1a':            'Prius is our main focus, but we also support select Lexus hybrid models. Text your year and model to confirm.',
        'faq-2q':            'What does the $99 diagnostic include?',
        'faq-2a':            'We come to your location and test the entire hybrid battery pack at the cell level. You get a clear answer on what\'s failing and what it costs to fix. If you proceed, the $99 is credited toward the total.',
        'faq-3q':            'How long does a repair take?',
        'faq-3a':            'Most repairs take 1–3 hours on-site. Full replacements may take longer. We aim to complete same day.',
        'faq-4q':            'Do you offer a warranty?',
        'faq-4a':            'Yes. All battery repairs and replacements include a 3-month warranty.',
        'faq-5q':            'What areas do you serve?',
        'faq-5a':            'Orange County, South Bay, and surrounding SoCal areas. Text your city and we\'ll confirm.',
        'faq-6q':            'How do I get the fastest quote?',
        'faq-6a':            'Text your year and city. That gives us everything we need for a fast answer — usually under 5 minutes.',
        'fcta-h':            'Hybrid battery trouble?',
        'fcta-p':            'Text your year and city. Most quotes in under 5 min.'
      },
      es: {
        'nav-reviews':       'Reseñas',
        'nav-services':      'Servicios',
        'nav-cells':         'Celdas',
        'nav-faq':           'FAQ',
        'hero-h1':           'Reparación Móvil<br>de Batería Híbrida<br><span class="ac">En Tu Casa.</span>',
        'hero-sub':          'Sin grúa. Sin concesionario. Vamos a tu ubicación, diagnosticamos en el lugar y reparamos el mismo día cuando es posible.',
        'btn-text':          'Enviar Mensaje',
        'btn-call':          'Llamar Ahora',
        'hero-note':         'Escribe <b>Año + Ciudad</b>. Respondemos en menos de 5 min. (657) 478-2947',
        'trust-1':           '5 estrellas',
        'trust-2':           'Licenciado y asegurado',
        'trust-3':           'Garantía de 3 meses',
        'card-label':        'Precios',
        'price-diag-lbl':    'Diagnóstico Móvil',
        'price-diag-note':   'Se acredita hacia la reparación o reemplazo si decides continuar.',
        'price-repair-lbl':  'Reparación de Batería',
        'price-replace-lbl': 'Reemplazo Completo',
        'price-warranty-lbl':'Garantía',
        'price-warranty-val':'3 meses',
        'card-area':         'Servimos Orange County, South Bay y zonas aledañas en el sur de California.',
        'qlink-lexus':       'Servicio de batería Lexus',
        'qlink-cells':       'Comprar celdas recondicionadas',
        'proof-label':       'Trabajos Reales',
        'proof-h2':          'Cientos de baterías reparadas en el sur de California.',
        'proof-b1':          'Servicio el mismo día en tu casa o trabajo — sin grúa ni entrega del carro',
        'proof-b2':          'Cada batería probada y garantizada antes de irnos',
        'proof-b3':          'Long Beach, Anaheim, Torrance, Garden Grove y ciudades vecinas',
        'ig-link':           'Ver más en Instagram @gofixtoday',
        'how-label':         'Cómo funciona',
        'how-h2':            'Tres pasos, sin complicaciones.',
        'how-1t':            'Escríbenos',
        'how-1d':            'Manda tu año y ciudad. Te respondemos rápido con precio y disponibilidad.',
        'how-2t':            'Vamos a tu casa',
        'how-2d':            'Diagnóstico en tu ubicación. Sin grúa ni entrega del carro.',
        'how-3t':            'Reparado el mismo día',
        'how-3d':            'Reparación o reemplazo en el lugar. Probado antes de irnos. Garantía incluida.',
        'svc-label':         'Servicios',
        'svc-h2':            'Lo que reparamos.',
        'svc-sub':           'Diagnóstico móvil, reparación celular o reemplazo completo — todo en tu ubicación en LA y OC.',
        'svc-prius-h':       'Batería híbrida Prius',
        'svc-prius-p':       'Nuestro servicio principal. Diagnóstico móvil, reparación de celdas o reemplazo de paquete completo para Toyota Prius. La mayoría de los trabajos se completan el mismo día.',
        'svc-lexus-h':       'Batería híbrida Lexus',
        'svc-lexus-p':       'Damos servicio a modelos Lexus híbridos seleccionados con sistemas de batería NiMH compatibles. Escríbenos tu año y modelo y confirmamos compatibilidad.',
        'svc-lexus-btn':     'Escribir sobre Lexus',
        'cells-label':       'Celdas',
        'cells-h2':          'Celdas de Batería NiMH Recondicionadas.',
        'cells-sub':         'Celdas individuales para reparaciones DIY o talleres. Probadas, recondicionadas, listas para instalar.',
        'cells-card-h':      'Ordena por mensaje.',
        'cells-card-sub':    'Escríbenos el año de tu Prius, cantidad y ciudad para opciones de entrega o recogida.',
        'cells-b1':          '<b>$35 por celda</b> — probada y recondicionada',
        'cells-b2':          '<b>Recogida disponible</b> en el sur de California',
        'cells-b3':          '<b>Instalación móvil</b> disponible bajo pedido',
        'cells-b4':          '¿No sabes cuántas necesitas? Escríbenos tus síntomas y te asesoramos',
        'cells-btn':         'Pedir Celdas por Mensaje',
        'cell3d-hint':       'Arrastra para explorar',
        'cfaq-1q':           '¿Qué años de Prius son compatibles?',
        'cfaq-1a':           'Tenemos celdas para la mayoría de los años. Escríbenos tu año y confirmamos.',
        'cfaq-2q':           '¿Venden celdas para Lexus híbridos?',
        'cfaq-2a':           'Sí, para modelos compatibles seleccionados. Escríbenos tu año y modelo.',
        'cfaq-3q':           '¿Pueden instalarlas?',
        'cfaq-3a':           'Sí. Instalación móvil disponible según vehículo, ubicación y horario. Escríbenos para confirmación rápida.',
        'faq-label':         'Preguntas Frecuentes',
        'faq-h2':            'Preguntas comunes.',
        'faq-1q':            '¿Solo trabajan con Prius?',
        'faq-1a':            'El Prius es nuestra especialidad, pero también damos servicio a modelos Lexus híbridos selectos. Escríbenos tu año y modelo para confirmar.',
        'faq-2q':            '¿Qué incluye el diagnóstico de $99?',
        'faq-2a':            'Vamos a tu ubicación y probamos toda la batería híbrida a nivel celular. Recibes una respuesta clara sobre qué está fallando y el costo de la reparación. Si decides continuar, los $99 se acreditan al total.',
        'faq-3q':            '¿Cuánto tarda una reparación?',
        'faq-3a':            'La mayoría de las reparaciones toman 1–3 horas en el lugar. Los reemplazos completos pueden tardar más. Buscamos terminar el mismo día.',
        'faq-4q':            '¿Ofrecen garantía?',
        'faq-4a':            'Sí. Todas las reparaciones y reemplazos incluyen 3 meses de garantía.',
        'faq-5q':            '¿Qué áreas cubren?',
        'faq-5a':            'Orange County, South Bay y áreas cercanas en el sur de California. Escríbenos tu ciudad y confirmamos.',
        'faq-6q':            '¿Cómo obtengo una cotización rápida?',
        'faq-6a':            'Escríbenos tu año y ciudad. Con eso podemos responderte rápido — generalmente en menos de 5 minutos.',
        'fcta-h':            '¿Problemas con la batería híbrida?',
        'fcta-p':            'Escríbenos tu año y ciudad. La mayoría de las cotizaciones en menos de 5 min.'
      }
    };

    var stored = localStorage.getItem('gofix_lang');
    var browserEs = navigator.language && navigator.language.toLowerCase().startsWith('es');
    var lang = stored || (browserEs ? 'es' : 'en');
    var btn  = document.getElementById('langToggle');

    function setLang(l) {
      lang = l;
      var map = T[l] || T['en'];
      document.querySelectorAll('[data-t]').forEach(function(el) {
        var key = el.getAttribute('data-t');
        if (map[key] !== undefined) el.innerHTML = map[key];
      });
      btn.textContent = l === 'en' ? 'ES' : 'EN';
      document.documentElement.lang = l;
      localStorage.setItem('gofix_lang', l);
    }

    setLang(lang);
    if (btn) btn.addEventListener('click', function() { setLang(lang === 'en' ? 'es' : 'en'); });
  })();
</script>
</body>
</html>

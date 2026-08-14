/* =========================================================================
   ALLURE — interactions
   Apple fluid-interface principles applied to the web:
   · feedback on pointer-down     · 1:1 pointer tracking
   · interruptible spring motion  · reduced-motion aware
   ========================================================================= */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------------
     Product catalogue — each bottle drawn as inline SVG (no photography
     dependency for the prototype; swap for real bottle shots in production)
     --------------------------------------------------------------------- */
  const bottle = (fill, cap) => `
    <svg class="bottle" viewBox="0 0 100 150" aria-hidden="true">
      <defs>
        <linearGradient id="glass${fill.slice(1)}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${fill}" stop-opacity="0.95"/>
          <stop offset="1" stop-color="${fill}" stop-opacity="0.55"/>
        </linearGradient>
      </defs>
      <rect x="40" y="6" width="20" height="16" rx="2" fill="${cap}"/>
      <rect x="43" y="20" width="14" height="10" fill="${cap}" opacity="0.8"/>
      <path d="M30 34 h40 a8 8 0 0 1 8 8 v92 a8 8 0 0 1 -8 8 h-40 a8 8 0 0 1 -8 -8 v-92 a8 8 0 0 1 8 -8 z"
            fill="url(#glass${fill.slice(1)})" stroke="#C9A84C" stroke-width="1" stroke-opacity="0.5"/>
      <rect x="34" y="86" width="32" height="34" rx="2" fill="#111" opacity="0.28"/>
      <path d="M50 92 L57 108 L54 108 L52.4 103 L47.6 103 L46 108 L43 108 Z"
            fill="#E8D6B3"/>
      <ellipse cx="40" cy="52" rx="5" ry="16" fill="#F8F5EF" opacity="0.18"/>
    </svg>`;

  const PRODUCTS = [
    { name: "Noir Absolu",    notes: "Oud · Leather · Smoke",       price: 240, desc: "The house signature. A nocturnal extrait of smoked oud wrapped in warm leather.", fill: "#2E2E2E", cap: "#C9A84C" },
    { name: "Or Sauvage",     notes: "Amber · Saffron · Gold",      price: 265, desc: "Radiant and untamed — golden amber lifted by a thread of saffron.",            fill: "#C9A84C", cap: "#A8862F" },
    { name: "Champagne Rose", notes: "Rose · Pepper · Musk",        price: 220, desc: "Effervescent rose over soft musk. Celebratory, intimate, unforgettable.",       fill: "#E8D6B3", cap: "#C9A84C" },
    { name: "Ivoire",         notes: "Iris · Vanilla · Sandalwood", price: 210, desc: "A whisper of powdered iris and cream. Quiet luxury, worn close to the skin.",    fill: "#F8F5EF", cap: "#C9A84C" }
  ];

  const grid = document.getElementById("products");
  if (grid) {
    grid.innerHTML = PRODUCTS.map((p, i) => `
      <article class="product reveal" data-delay="${i % 3}" data-tilt>
        <span class="product__glow" aria-hidden="true"></span>
        <div class="product__bottle">${bottle(p.fill, p.cap)}</div>
        <h3 class="product__name">${p.name}</h3>
        <p class="product__notes">${p.notes}</p>
        <p class="product__desc">${p.desc}</p>
        <div class="product__foot">
          <span class="product__price">$${p.price} <small>· 50ml extrait</small></span>
          <button class="product__add" type="button" data-add="${p.name}">Add</button>
        </div>
      </article>`).join("");
  }

  /* ---------------------------------------------------------------------
     Scroll reveal — IntersectionObserver, one-shot
     --------------------------------------------------------------------- */
  const reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(el => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(el => io.observe(el));
  }

  /* ---------------------------------------------------------------------
     Nav — translucent → solid on scroll; content passes beneath
     --------------------------------------------------------------------- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.setAttribute("data-scrolled", String(window.scrollY > 40));
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------------------------------------------------------------------
     Mobile menu toggle
     --------------------------------------------------------------------- */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (toggle && links) {
    const setOpen = (open) => {
      links.setAttribute("data-open", String(open));
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "✕" : "☰";
    };
    toggle.addEventListener("click", () => setOpen(links.getAttribute("data-open") !== "true"));
    links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setOpen(false)));
  }

  /* ---------------------------------------------------------------------
     Interruptible spring tilt on product cards.
     Reads the LIVE (presentation) value each frame and eases toward the
     pointer target — so grabbing/leaving mid-motion never jumps.
     --------------------------------------------------------------------- */
  if (!reduceMotion && window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
      const MAX = 5;                    // degrees
      const K = 0.16;                   // spring stiffness toward target (per frame)

      const frame = () => {
        cx += (tx - cx) * K;
        cy += (ty - cy) * K;
        card.style.transform =
          `perspective(900px) rotateX(${cy.toFixed(3)}deg) rotateY(${cx.toFixed(3)}deg) translateY(-6px)`;
        if (Math.abs(tx - cx) > 0.01 || Math.abs(ty - cy) > 0.01) {
          raf = requestAnimationFrame(frame);
        } else { raf = null; }
      };
      const kick = () => { if (raf == null) raf = requestAnimationFrame(frame); };

      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        tx = px * MAX * 2;
        ty = -py * MAX * 2;
        kick();
      });
      card.addEventListener("pointerleave", () => { tx = 0; ty = 0; kick(); });
    });
  }

  /* ---------------------------------------------------------------------
     Add-to-bag + join form — lightweight feedback (status → completion)
     --------------------------------------------------------------------- */
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (!btn) return;
    const original = btn.textContent;
    btn.textContent = "Added ✓";
    btn.style.background = "var(--gold)";
    btn.style.color = "var(--noir)";
    setTimeout(() => { btn.textContent = original; btn.style.background = ""; btn.style.color = ""; }, 1400);
  });

  const form = document.getElementById("joinForm");
  const msg = document.getElementById("joinMsg");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = form.querySelector("input").value.trim();
      const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
      msg.textContent = ok
        ? "Welcome to the atelier — check your inbox for your discovery set."
        : "Please enter a valid email address.";
      msg.style.color = ok ? "var(--gold)" : "#e08a7a";
      if (ok) form.reset();
    });
  }

  /* Update the est. year copy to the real current year where used as numerals */
})();

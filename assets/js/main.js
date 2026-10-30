/* =========================================================
   Dental Dúo — main.js
   Seguridad: modo estricto, sin innerHTML/eval, sin handlers
   inline, enlaces de WhatsApp con encodeURIComponent().
   ========================================================= */
(() => {
  "use strict";

  /* ---------- Configuración ---------- */
  const WA_TURNOS = "5493794895407";
  const waLink = (number, msg) => `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.body.classList.remove("no-js");

  /* ---------- Enlaces de WhatsApp con mensaje prellenado ---------- */
  document.querySelectorAll(".js-wa[data-msg]").forEach((a) => {
    const match = a.getAttribute("href").match(/wa\.me\/(\d+)/);
    a.href = waLink(match ? match[1] : WA_TURNOS, a.dataset.msg);
  });

  /* ---------- Header con sombra al hacer scroll ---------- */
  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menú móvil ---------- */
  const toggle = document.querySelector(".menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const setMenu = (open) => {
    mobileNav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  };
  toggle.addEventListener("click", () => setMenu(!mobileNav.classList.contains("is-open")));
  mobileNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ---------- Aparición suave de secciones ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Reels de Instagram: carga al hacer clic (facade) ----------
     No se conecta con Instagram hasta que la persona elige ver un video. */
  document.querySelectorAll(".reel-facade").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.reel;
      if (!/^[A-Za-z0-9_-]{6,20}$/.test(id)) return; // solo IDs válidos
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.instagram.com/reel/${id}/embed/`;
      iframe.title = btn.dataset.title || "Reel de Instagram de Dental Dúo";
      iframe.loading = "lazy";
      iframe.width = "360";
      iframe.height = "640";
      iframe.decoding = "async";
      iframe.setAttribute("allowfullscreen", "");
      iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-presentation");
      btn.replaceWith(iframe);
      iframe.focus();
    });
  });

  /* ---------- Carteles del hero: se turnan sobre la foto ---------- */
  const badges = document.querySelectorAll("[data-badges] .badge-msg");
  if (badges.length > 1 && !reduceMotion) {
    let b = 0;
    setInterval(() => {
      if (document.hidden) return;
      badges[b].classList.remove("is-active");
      b = (b + 1) % badges.length;
      badges[b].classList.add("is-active");
    }, 2800);
  }

  /* ---------- Rotador "pop" (solo mobile): una tarjeta a la vez ----------
     En PC las tarjetas se ven todas juntas; con movimiento reducido, también. */
  const mqMobile = window.matchMedia("(max-width: 767px)");
  document.querySelectorAll("[data-rotator]").forEach((wrap) => {
    const items = Array.from(wrap.children);
    if (items.length < 2 || reduceMotion) return;
    const dots = document.createElement("div");
    dots.className = "rotator-dots";
    const dotBtns = items.map((_, n) => {
      const d = document.createElement("button");
      d.type = "button";
      d.setAttribute("aria-label", `Ver tarjeta ${n + 1} de ${items.length}`);
      d.addEventListener("click", () => { show(n); restart(); });
      dots.appendChild(d);
      return d;
    });
    wrap.after(dots);

    let idx = 0; let timer = null; let inView = false;
    function show(n) {
      items[idx].classList.remove("is-active");
      dotBtns[idx].removeAttribute("aria-current");
      idx = n;
      items[idx].classList.add("is-active");
      dotBtns[idx].setAttribute("aria-current", "true");
    }
    const stop = () => { clearInterval(timer); timer = null; };
    function restart() {
      stop();
      if (mqMobile.matches && inView) timer = setInterval(() => show((idx + 1) % items.length), 3600);
    }
    const apply = () => {
      wrap.classList.toggle("is-rotating", mqMobile.matches);
      if (mqMobile.matches) show(idx); else items.forEach((it) => it.classList.remove("is-active"));
      restart();
    };
    mqMobile.addEventListener("change", apply);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([en]) => { inView = en.isIntersecting; restart(); }, { threshold: 0.3 }).observe(wrap);
    } else { inView = true; }
    // Deslizar con el dedo también cambia de tarjeta
    let x0 = null;
    wrap.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    wrap.addEventListener("touchend", (e) => {
      if (x0 === null || !mqMobile.matches) return;
      const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) < 40) return;
      show((idx + (dx < 0 ? 1 : items.length - 1)) % items.length); restart();
    }, { passive: true });
    apply();
  });

  /* ---------- Carrusel con flechas y puntos (tratamientos) ---------- */
  document.querySelectorAll("[data-carousel]").forEach((car) => {
    const track = car.querySelector(".carousel-track");
    const cards = Array.from(track.children);
    const prev = car.querySelector(".carousel-btn--prev");
    const next = car.querySelector(".carousel-btn--next");
    const dotsWrap = car.querySelector(".carousel-dots");
    const step = () => (cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth);
    const dots = cards.map((_, n) => {
      const d = document.createElement("button");
      d.type = "button";
      d.setAttribute("aria-label", `Ir al tratamiento ${n + 1}`);
      d.addEventListener("click", () => track.scrollTo({ left: n * step(), behavior: reduceMotion ? "auto" : "smooth" }));
      dotsWrap.appendChild(d);
      return d;
    });
    const update = () => {
      const s = step() || 1;
      const first = Math.round(track.scrollLeft / s);
      const visible = Math.max(1, Math.round(track.clientWidth / s));
      const max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
      dots.forEach((d, n) => {
        const on = n >= first && n < first + visible;
        if (on) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
      });
    };
    const go = (dir) => track.scrollBy({ left: dir * step(), behavior: reduceMotion ? "auto" : "smooth" });
    prev.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => go(1));
    track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    });
    let raf = 0;
    track.addEventListener("scroll", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
    window.addEventListener("resize", update);
    update();
  });

  /* ---------- Obras sociales: carrusel continuo + buscador ---------- */
  const osTrack = document.querySelector(".os-track");
  const osCards = osTrack ? Array.from(osTrack.children) : [];
  if (osTrack) {
    // Copia decorativa para el bucle infinito (oculta a lectores de pantalla)
    osCards.forEach((li) => {
      const c = li.cloneNode(true);
      c.setAttribute("aria-hidden", "true");
      osTrack.appendChild(c);
    });
  }
  const osInput = document.getElementById("os-q");
  const osResult = document.getElementById("os-result");
  if (osInput && osResult) {
    const norm = (v) => String(v || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const marquee = document.querySelector(".os-marquee");
    const allCards = osTrack ? Array.from(osTrack.children) : [];
    const link = (label, msg) => {
      const a = document.createElement("a");
      a.href = waLink(WA_TURNOS, msg);
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = label;
      return a;
    };
    let t;
    osInput.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const raw = osInput.value.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, 40);
        const q = norm(raw);
        allCards.forEach((c) => c.classList.remove("is-match"));
        if (marquee) marquee.classList.remove("is-filtering");
        if (!q) { osResult.replaceChildren(); return; }
        const hits = osCards.filter((c) => norm(c.dataset.os).includes(q));
        if (marquee) marquee.classList.toggle("is-filtering", hits.length > 0);
        if (hits.length) {
          const names = hits.map((c) => c.dataset.os);
          allCards.forEach((c) => { if (names.includes(c.dataset.os)) c.classList.add("is-match"); });
          const ok = document.createElement("span");
          ok.className = "ok";
          ok.textContent = `✓ Sí, trabajamos con ${names.slice(0, 3).join(", ")}${names.length > 3 ? " y otras" : ""}. `;
          osResult.replaceChildren(ok, link("Consultá tu plan", `Hola Dental Dúo, tengo ${names[0]} y quiero pedir un turno.`));
        } else {
          osResult.replaceChildren(
            document.createTextNode("No la encontramos en la lista, pero puede que igual te atendamos. "),
            link("Consultanos por WhatsApp", `Hola Dental Dúo, quiero saber si atienden mi obra social: ${raw}`)
          );
        }
      }, 180);
    });
  }

  /* ---------- Formulario → WhatsApp (con capas antibots) ----------
     1) Honeypot  2) Trampa de tiempo (< 3 s)  3) Validación y largo máximo
     4) Consentimiento  5) Botón bloqueado unos segundos (anti doble envío)
     No se guarda ni se envía nada a un servidor: el mensaje lo envía la
     persona desde su propio WhatsApp. */
  const form = document.getElementById("turno-form");
  if (form) {
    const loadedAt = Date.now();
    const submitBtn = form.querySelector('button[type="submit"]');
    const errName = document.getElementById("e-nombre");
    const errConsent = document.getElementById("e-consent");
    const clean = (v, max) => String(v || "").replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (form.website.value) return;                // honeypot completado: bot
      if (Date.now() - loadedAt < 3000) return;      // envío demasiado rápido: bot

      const nombre = clean(form.nombre.value, 60);
      errName.textContent = "";
      errConsent.textContent = "";
      if (nombre.length < 2) { errName.textContent = "Por favor, escribí tu nombre."; form.nombre.focus(); return; }
      if (!form.consent.checked) { errConsent.textContent = "Necesitamos tu consentimiento para continuar."; form.consent.focus(); return; }

      const obra = clean(form.obra.value, 60);
      const mensaje = clean(form.mensaje.value, 400);
      const lineas = [
        `Hola Dental Dúo, soy ${nombre}.`,
        `Quiero pedir un turno (${clean(form.para.value, 30).toLowerCase()}).`,
        `Motivo: ${clean(form.motivo.value, 40)}.`,
        obra ? `Obra social: ${obra}.` : "",
        mensaje
      ].filter(Boolean);

      submitBtn.disabled = true;
      window.open(waLink(WA_TURNOS, lineas.join("\n")), "_blank", "noopener,noreferrer");
      setTimeout(() => { submitBtn.disabled = false; }, 4000);
    });
  }

  /* ---------- El WhatsApp flotante no tapa la firma de Tereré Estudio ---------- */
  const dock = document.querySelector(".wa-dock");
  const firma = document.querySelector(".firma-te");
  if (dock && firma && "IntersectionObserver" in window) {
    new IntersectionObserver(([en]) => {
      const visible = en.isIntersecting ? Math.max(0, window.innerHeight - en.boundingClientRect.top) : 0;
      dock.style.setProperty("--lift", `${Math.min(visible, firma.offsetHeight)}px`);
      dock.classList.toggle("is-lifted", en.isIntersecting);
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] }).observe(firma);
  }

  /* ---------- Año del footer ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* =========================================================
     SPEECH BUBBLE DE WHATSAPP
     - Aparece con "escribiendo…" y tipeo, y suma un CTA.
     - El mensaje cambia según la sección visible.
     - Se oculta en Contacto; si se cierra, no vuelve en la sesión.
     ========================================================= */
  const BUBBLE_MSGS = {
    default:          { text: "¡Hola! 👋 ¿Coordinamos tu turno? Te respondemos por WhatsApp.", cta: "Pedí tu turno", msg: "Hola Dental Dúo, quiero pedir un turno." },
    tratamientos:     { text: "¿No sabés qué tratamiento necesitás? Contanos y te orientamos.", cta: "Consultanos", msg: "Hola Dental Dúo, quiero consultar qué tratamiento necesito." },
    equipo:           { text: "Pablo y Melanie te esperan en Jujuy 731. ¿Reservamos tu lugar?", cta: "Reservá tu turno", msg: "Hola Dental Dúo, quiero reservar un turno." },
    "obras-sociales": { text: "¿Querés saber si atendemos tu obra social? Te lo confirmamos al toque.", cta: "Consultar mi cobertura", msg: "Hola Dental Dúo, quiero saber si atienden mi obra social: " },
    instagram:        { text: "¿Te quedó alguna duda? Escribinos, respondemos todo.", cta: "Hacer una consulta", msg: "Hola Dental Dúo, tengo una consulta: " }
  };

  const bubble = document.getElementById("wa-bubble");
  if (!bubble) return;
  const textEl = document.getElementById("bubble-text");
  const cta = document.getElementById("bubble-cta");
  const ctaLabel = cta.querySelector("span");
  const closeBtn = bubble.querySelector(".bubble-close");

  // Solo se guarda una preferencia de interfaz (no datos personales).
  const store = {
    get: (k) => { try { return sessionStorage.getItem(k); } catch (_) { return null; } },
    set: (k, v) => { try { sessionStorage.setItem(k, v); } catch (_) { /* sin almacenamiento */ } }
  };

  let dismissed = store.get("dd-bubble-closed") === "1";
  let current = null;
  let pending = "default";
  let inContact = false;
  let firstRender = true;
  let timers = [];

  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
  const later = (fn, ms) => { timers.push(setTimeout(fn, ms)); };

  const typingIndicator = () => {
    const wrap = document.createElement("span");
    wrap.className = "typing";
    wrap.setAttribute("aria-label", "Escribiendo");
    for (let i = 0; i < 3; i += 1) wrap.appendChild(document.createElement("i"));
    return wrap;
  };

  function render(key) {
    if (key === current) return;
    const m = BUBBLE_MSGS[key] || BUBBLE_MSGS.default;
    current = key;
    clearTimers();
    cta.classList.remove("is-visible");
    ctaLabel.textContent = m.cta;
    cta.href = waLink(WA_TURNOS, m.msg);

    if (reduceMotion) { textEl.textContent = m.text; cta.classList.add("is-visible"); return; }

    textEl.replaceChildren(typingIndicator());
    later(() => {
      const chars = Array.from(m.text);
      const typed = document.createElement("span");
      const cursor = document.createElement("span");
      cursor.className = "bubble-cursor";
      cursor.setAttribute("aria-hidden", "true");
      textEl.replaceChildren(typed, cursor);
      let i = 0;
      const step = () => {
        i += 1;
        typed.textContent = chars.slice(0, i).join("");
        if (i < chars.length) later(step, 26);
        else { cursor.classList.add("is-done"); later(() => cta.classList.add("is-visible"), 150); }
      };
      step();
    }, firstRender ? 1100 : 600);
    firstRender = false;
  }

  const open = () => {
    if (dismissed || inContact) return;
    bubble.classList.add("is-open");
    render(pending);
  };
  const hide = () => bubble.classList.remove("is-open");

  closeBtn.addEventListener("click", () => {
    dismissed = true;
    store.set("dd-bubble-closed", "1");
    clearTimers();
    hide();
    document.querySelector(".wa-float").focus();
  });
  bubble.addEventListener("keydown", (e) => { if (e.key === "Escape") closeBtn.click(); });

  if (!dismissed) setTimeout(open, reduceMotion ? 1500 : 3500);

  if ("IntersectionObserver" in window) {
    let switchTimer;
    const sectionIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const id = en.target.id;
        if (id === "contacto") { inContact = true; hide(); return; }
        inContact = false;
        pending = Object.prototype.hasOwnProperty.call(BUBBLE_MSGS, id) ? id : "default";
        clearTimeout(switchTimer);
        switchTimer = setTimeout(() => {
          if (dismissed) return;
          if (bubble.classList.contains("is-open")) render(pending);
          else if (current !== null) open();
        }, 700);
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    document.querySelectorAll("main > section").forEach((s) => sectionIO.observe(s));
  }
})();

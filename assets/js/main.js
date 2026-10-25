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
      iframe.setAttribute("allowfullscreen", "");
      iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-presentation");
      btn.replaceWith(iframe);
      iframe.focus();
    });
  });

  /* ---------- Mapa: carga al hacer clic (fachada sin rastreo) ----------
     No se conecta con Google hasta que la persona elige ver el mapa. */
  const mapBtn = document.querySelector(".map-load");
  if (mapBtn) {
    mapBtn.addEventListener("click", () => {
      const src = mapBtn.dataset.mapSrc || "";
      if (!/^https:\/\/maps\.google\.com\/maps\?/.test(src)) return; // solo el origen esperado
      const iframe = document.createElement("iframe");
      iframe.src = src;
      iframe.title = mapBtn.dataset.mapTitle || "Mapa";
      iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
      iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox");
      const facade = mapBtn.closest(".map-facade");
      facade.replaceWith(iframe);
      iframe.focus();
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
    preguntas:        { text: "¿Te quedó alguna duda? Escribinos, respondemos todo.", cta: "Hacer una consulta", msg: "Hola Dental Dúo, tengo una consulta: " }
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

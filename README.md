# Dental Dúo — Landing page

Landing de turnos para **Dental Dúo**, consultorio odontológico de la Od. Melanie Leguizamón y el Od. Pablo Sebastián Pintos (Jujuy 731, Corrientes Capital).

Sitio estático sin dependencias ni build, pensado para Netlify. El JavaScript va en un archivo aparte para poder usar una CSP estricta.

```
index.html                 landing
privacidad.html            Política de privacidad (Ley 25.326)
404.html                   página de error propia
assets/js/main.js          interacciones (sin innerHTML, modo estricto)
fonts/                     Fraunces y Figtree en woff2 + licencias OFL
_headers / _redirects      config. Netlify (cabeceras de seguridad, CSP, redirecciones)
robots.txt, sitemap.xml, .well-known/security.txt
favicon.png
assets/img/
  firma-terereestudio.webp   firma "Desarrollado por Tereré Estudio"
  logo-dental-duo-400.webp    logo para header y footer
  logo-dental-duo.png         logo en alta (fallback / descargas)
  equipo-dental-duo-800.webp  foto del dúo
  equipo-dental-duo.jpg       foto original optimizada
  og-dental-duo.jpg           imagen para compartir (1200×630)
  apple-touch-icon.png
```

---

## 1. Diagnóstico de marca

- **Rubro:** odontología general y estética, consultorio de barrio en Corrientes Capital. Compite con clínicas grandes y consultorios individuales; su ventaja es ser cercano, integral y aceptar muchas obras sociales.
- **Público:** familias y adultos jóvenes de Corrientes, con obra social o particulares. Les duele: el dolor de muelas que no espera, no saber si la obra social cubre, el miedo o la vergüenza de ir. Desean: resolver rápido, sentirse bien con su sonrisa, un lugar de confianza para toda la familia.
- **Arquetipo:** **Cuidador** (con matiz de Persona común). Lo dicen ellos mismos: "Estamos para cuidarte". Trato cercano, urgencias, niños.
- **Valores → visual:**
  - Cuidado → curvas suaves, arcos, colores cálidos.
  - Cercanía → fotos reales del dúo, voseo, preguntas en primera persona.
  - Integralidad → tratamientos agrupados por necesidad, no por técnica.
  - Complementariedad ("dúo") → piezas en pares: dos profesionales, dos colores de acento (agua y rosa).
  - Prolijidad → mucho aire, líneas finas color arena.
- **Tono:** cercano y profesional, voseo rioplatense, frases cortas, sin tecnicismos innecesarios.
- **Conversión:** turnos por WhatsApp. CTA principal **"Pedí tu turno"** (header, hero, cada tratamiento, CTA final, formulario y botón flotante).

## 2. Design system

| Token | HEX | Uso |
|---|---|---|
| `--color-teal` | `#6A97A2` | Agua del logotipo. Solo decorativo (3.2:1). |
| `--color-primary` | `#2C5F6B` | Agua profunda: botones, links, énfasis. 7.1:1 sobre blanco. |
| `--color-primary-ink` | `#1F4A54` | Fondos oscuros (sección diferenciales). |
| `--color-sand` | `#BAAF94` | Arena del trazo del diente: líneas, viñetas, motivo. |
| `--color-umber` | `#6B5A3E` | Arena profunda: etiquetas. 6.2:1. |
| `--color-blush` | `#EBCFC6` | Acento rosa (consultorio, ambo de Melanie). |
| `--color-bg` | `#FAF7F2` | Marfil de fondo. |
| `--color-text` | `#2A2824` | Texto. 13.8:1. |

- **Tipografía:** *Fraunces* (titulares, serif cálida con itálica expresiva que dialoga con la firma manuscrita del logo, sin competir con ella) + *Figtree* (texto, sans muy legible en mobile). Escala fluida con `clamp()`.
- **Forma:** radios generosos (10/18/28 px) y un **arco** (`--radius-arch`) que remite a la corona del diente, usado en la foto del hero y los íconos.
- **Motivo:** red de líneas orgánicas color arena, inspirada en las líneas internas del logo (el logo en sí no se modifica).
- **Íconos:** trazo fino redondeado, un solo estilo.
- **Movimiento:** aparición suave al hacer scroll y hover sutil; se desactiva con `prefers-reduced-motion`.

**Logo:** se usó la imagen provista sin redibujar ni recolorear. Solo se recortó el marco oscuro de la captura alrededor del círculo blanco. Si hay un archivo original (SVG o PNG sin fondo), reemplazar `assets/img/logo-dental-duo-*`.

## 3. Estructura

Header fijo → Hero → Te entendemos (objeciones) → Tratamientos → Por qué Dental Dúo → El dúo → Cómo funciona → Obras sociales → Reels de Instagram → Preguntas frecuentes → CTA final → Contacto (datos, mapa y formulario que arma el mensaje de WhatsApp) → Footer + WhatsApp flotante.

## 4. Datos pendientes [COMPLETAR]

- [ ] **Horarios de atención** (contacto y FAQ).
- [ ] **Matrículas** de ambos profesionales (equipo y footer).
- [ ] **Bio breve / especialidad** de cada uno.
- [ ] **Dominio definitivo** (canonical, Open Graph y Schema usan `https://www.dentalduo.com.ar/` como provisorio).
- [ ] **Confirmar lista de obras sociales**: sale de historias de Instagram de noviembre de 2023.
- [ ] **Testimonios reales** con permiso (hay un comentario marcado en la sección de obras sociales para agregarlos).
- [ ] Logo en archivo original (SVG/PNG transparente).
- [ ] Email, si quieren mostrarlo.
- [ ] Confirmar que el WhatsApp de turnos es **3794-895407** (el link de la bio de Instagram es un acortador `wa.link`).

## 5. Sugerencias

1. **Hero alternativo enfocado en urgencias:** "¿Te duele una muela? Te atendemos." para campañas pagas, con el mismo diseño.
2. **A/B del CTA:** "Pedí tu turno" vs. "Escribinos por WhatsApp"; medir clics con Google Analytics o Meta Pixel.
3. **Casos antes/después** (con consentimiento) en la sección de tratamientos estéticos: es el contenido que mejor convierte en estética dental.

## Cómo editar

- Número de turnos: constante `WA_TURNOS` en `assets/js/main.js` y los `href` con `wa.me/5493794895407`.
- Mensajes del speech bubble: objeto `BUBBLE_MSGS` en `assets/js/main.js`.
- Mensajes prellenados: atributo `data-msg` de cada botón.
- Reels: cambiar el `data-reel="ID"` de cada botón en la sección Instagram.
- Colores y tipografías: variables en `:root`.

---

## Firma

Franja "Desarrollado por Tereré Estudio" después del `</footer>` en `index.html`, `privacidad.html` y `404.html`, enlazada a https://terereestudio.com.ar. Imagen en `assets/img/firma-terereestudio.webp` (decodificada del data URI oficial, 360×120). El WhatsApp flotante sube solo cuando la franja está visible, para no taparla.

---

## Seguridad

Estándar Tereré Estudio: **hosting en Netlify** (HTTPS automático, CDN y protección DDoS básica). Cloudflare no se usa como proxy delante de Netlify.

### 1. Medidas integradas en el código
- **CSP estricta** (`_headers`, con respaldo por `<meta>` en cada página): solo recursos propios; `script-src 'self'` sin `unsafe-inline`; `font-src 'self'`; `img-src 'self' data:`; iframes solo de Google Maps e Instagram, y únicamente después de un clic.
- **Fuentes locales** en `/fonts` (Fraunces y Figtree, mismos ejes y pesos que antes, woff2, subset latin, `font-display: swap`, licencia OFL incluida). Ya no hay conexión a Google Fonts.
- **Mapa e Instagram con fachada:** ninguna conexión a Google ni a Meta al abrir la página. El mapa y cada reel se cargan solo al hacer clic, con aviso, y dentro de un iframe con `sandbox`. "Abrir en Google Maps" es un enlace externo.
- **Anti-XSS:** sin `innerHTML`, `eval` ni handlers inline; el JS está en `assets/js/main.js` en modo estricto; los iframes solo aceptan el origen esperado.
- **Enlaces:** todos los `target="_blank"` con `rel="noopener noreferrer"`; mensajes de WhatsApp con `encodeURIComponent()`.
- **Formulario:** honeypot, trampa de tiempo (menos de 3 s = bot), largos máximos, limpieza de caracteres de control, consentimiento no premarcado y bloqueo contra doble envío. No envía datos a ningún servidor (arma el mensaje de WhatsApp). La migración a Netlify Forms queda pendiente de aprobación porque cambia textos visibles.
- **Privacidad:** Política de privacidad (Ley 25.326) con la leyenda de la AAIP y mención a WhatsApp (Meta); sin cookies ni analítica; imágenes sin EXIF; email no publicado.
- **Sitio:** 404 propia, `security.txt`, `robots.txt` sin rutas sensibles, `README.md` bloqueado en `_redirects`.

### 2. Configuración del servidor (Netlify)
- `_headers`: HSTS, CSP, `nosniff`, Referrer-Policy, Permissions-Policy, X-Frame-Options, COOP y cache de fuentes y recursos.
- `_redirects`: bloqueo de archivos del repo y regla de dominio único lista para activar.
- En Netlify: activar **Force HTTPS** (Domain management → HTTPS).

### 3. Pendientes [COMPLETAR]
- [ ] Dominio definitivo (canonical, OG, Schema, sitemap, robots, `_redirects`, `security.txt`).
- [ ] Datos del responsable para la Política de privacidad: nombre o razón social, CUIT, domicilio y email de contacto para datos personales.
- [ ] Revisión legal recomendada de la Política de privacidad.
- [ ] Email de seguridad de Tereré Estudio para `security.txt` (se completa una única vez).
- [ ] Después de publicar: verificar en **securityheaders.com**, **SSL Labs** y **Mozilla Observatory** (objetivo: nota A) y revisar la consola sin errores de CSP.
- Recomendado al cliente: 2FA y bloqueo de transferencia del dominio en NIC.ar, 2FA en Netlify, Instagram y WhatsApp Business; SPF, DKIM y DMARC si usan email del dominio.

### 4. Riesgos residuales (en simple)
- **WhatsApp y Meta:** las conversaciones de turnos pasan por WhatsApp, que es de un tercero. Conviene no pedir ni recibir estudios o datos clínicos por ese medio.
- **Mapa y reels:** solo si la persona hace clic, Google o Instagram reciben su IP.
- **Spam por WhatsApp:** el formulario no pasa por un servidor, así que no hay filtro del lado servidor; un bot podría escribir directo al número. Riesgo bajo, se gestiona desde WhatsApp.
- **El texto legal es una base:** debe revisarlo un profesional antes de publicar.

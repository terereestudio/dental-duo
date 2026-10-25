# Dental Dúo — Landing page

Landing de turnos para **Dental Dúo**, consultorio odontológico de la Od. Melanie Leguizamón y el Od. Pablo Sebastián Pintos (Jujuy 731, Corrientes Capital).

Un solo archivo (`index.html`) con CSS y JS internos. Sin dependencias ni build: se publica tal cual (GitHub Pages, Netlify, Vercel, hosting estático).

```
index.html
favicon.png
assets/img/
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

- Número de turnos: constante `WA_TURNOS` al final de `index.html` y los `href` con `wa.me/5493794895407`.
- Mensajes prellenados: atributo `data-msg` de cada botón.
- Reels: cambiar el ID en `https://www.instagram.com/reel/ID/embed/`.
- Colores y tipografías: variables en `:root`.

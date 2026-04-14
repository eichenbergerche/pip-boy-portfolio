# PIP-BOY 3000 · Portfolio UX/UI

Portfolio personal con temática Fallout / Pip-Boy 3000.

## Estructura

```
portfolio/
├── index.html            ← Página principal
├── css/
│   ├── hud-themes.css    ← Variables de color (cargar primero)
│   ├── pipboy.css        ← Layout y componentes
│   ├── crt-effect.css    ← Efecto de tele vieja (CRT)
│   └── responsive.css    ← Media queries
├── js/
│   ├── sound.js          ← Motor de audio (Web Audio API)
│   ├── animations.js     ← Boot sequence y skill bars
│   ├── dial.js           ← Perilla de navegación
│   └── settings.js       ← Temas de color, CRT, formulario, reloj
├── assets/
│   ├── images/           ← Capturas de proyectos y avatar
│   └── fonts/            ← Fuentes locales (opcional)
└── README.md
```

## Qué editar

| Qué                     | Dónde                              |
|-------------------------|------------------------------------|
| Nombre / rol / bio      | `index.html` → sección STAT        |
| Foto de perfil          | `index.html` → `.stat-avatar`      |
| Porcentaje de skills    | `index.html` → `data-value="XX"`   |
| Links LinkedIn etc.     | `index.html` → `.stat-links`       |
| Proyectos               | `index.html` → `.inv-item`         |
| Imágenes de proyectos   | `assets/images/` + `index.html`    |
| Experiencia / educación | `index.html` → sección DATA        |
| Email de contacto       | `index.html` → sección MAP         |
| Formulario (backend)    | `js/settings.js` → comentario AQUÍ |
| Texto del boot          | `js/animations.js` → `BOOT_LINES`  |
| Ticker inferior         | `index.html` → `.ticker-inner`     |

## Deploy en GitHub Pages

1. Crear repositorio en GitHub (público)
2. Subir toda la carpeta `portfolio/` (o su contenido)
3. Settings → Pages → Branch: main / root → Save
4. URL: `https://TU-USUARIO.github.io/NOMBRE-REPO/`

## Tecnologías

- HTML5 semántico + ARIA
- CSS puro (variables, Grid, Flexbox, conic-gradient)
- JavaScript vanilla (ES2020+)
- Web Audio API (sin archivos de audio externos)
- Google Fonts: Share Tech Mono + VT323

/**
 * settings.js
 * Panel de configuración del HUD (sección RADIO).
 *
 * Funcionalidades:
 *   - Selector de tema de color (5 opciones)
 *   - Toggle efecto CRT (líneas de escaneo + flicker)
 *   - Toggle Phosphor Glow
 *   - Persistencia via localStorage
 *
 * Depende de: hud-themes.css (define las variables por data-theme)
 *             crt-effect.css (activa con clase .crt-on en body)
 */

'use strict';

'use strict';

// Sonido general para clicks en la UI (EXCLUYENDO el dial)
document.addEventListener('click', (e) => {
  // 1. Excluir cualquier cosa que sea parte del dial/navegación
  const isDialControl = e.target.closest(
    '#navDial, .tab-btn, #prevTabBtn, #nextTabBtn, #powerBtn'
  );

  // 2. Si es parte del dial, NO hacer nada (dial.js ya maneja esos sonidos)
  if (isDialControl) return;

  // 3. Solo dispara si el click es en algo interactivo DENTRO de las pantallas
  const isInteractive = e.target.closest(
    '.pip-link, .color-opt, .toggle-row, .inv-header, .tab-content, #sendMsg'
  );

  if (isInteractive) playUIClick();
});


/* ── Mapa de temas: nombre de opción → valor del atributo data-theme ── */
const THEME_MAP = {
  green: '',       // Default — no necesita atributo
  amber: 'amber',
  blue:  'blue',
  red:   'red',
  white: 'white',
};

/* ════════════════════════════════════════
   SELECTOR DE COLOR HUD
════════════════════════════════════════ */
document.getElementById('colorOptions').addEventListener('click', (e) => {
  const opt = e.target.closest('.color-opt');
  if (!opt) return;

  /* Marcar la opción activa */
  document.querySelectorAll('.color-opt').forEach((o) => o.classList.remove('active'));
  opt.classList.add('active');

  /* Aplicar tema al :root via data-theme */
  const theme = opt.dataset.theme;
  document.documentElement.setAttribute('data-theme', THEME_MAP[theme] ?? '');

  /* Persistir elección */
  try { localStorage.setItem('pipHudTheme', theme); } catch (_) {}
});

/* Restaurar tema guardado al cargar */
(function restoreTheme() {
  try {
    const saved = localStorage.getItem('pipHudTheme');
    if (!saved) return;
    const savedOpt = document.querySelector(`.color-opt[data-theme="${saved}"]`);
    if (savedOpt) savedOpt.click();
  } catch (_) {}
})();

/* ════════════════════════════════════════
   TOGGLE EFECTO CRT
════════════════════════════════════════ */
let crtOn   = true;
const crtKnob = document.getElementById('crtToggleKnob');
const crtBtn  = document.getElementById('crtToggle');

function toggleCRT() {
  crtOn = !crtOn;
  document.body.classList.toggle('crt-on', crtOn);
  crtKnob.classList.toggle('on', crtOn);
  crtBtn.setAttribute('aria-checked', String(crtOn));
  try { localStorage.setItem('pipCRT', crtOn ? '1' : '0'); } catch (_) {}
}

crtBtn.addEventListener('click', toggleCRT);
crtBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCRT(); }
});

/* ════════════════════════════════════════
   TOGGLE PHOSPHOR GLOW
════════════════════════════════════════ */
let glowOn   = true;
const glowKnob = document.getElementById('glowToggleKnob');
const glowBtn  = document.getElementById('glowToggle');
const screenEl = document.getElementById('pipboyScreen');

function toggleGlow() {
  glowOn = !glowOn;
  glowKnob.classList.toggle('on', glowOn);
  glowBtn.setAttribute('aria-checked', String(glowOn));
  screenEl.style.boxShadow = glowOn ? '' : 'none';
  try { localStorage.setItem('pipGlow', glowOn ? '1' : '0'); } catch (_) {}
}

glowBtn.addEventListener('click', toggleGlow);
glowBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleGlow(); }
});

/* ════════════════════════════════════════
   RESTAURAR PREFERENCIAS AL CARGAR
════════════════════════════════════════ */
(function restoreEffects() {
  try {
    if (localStorage.getItem('pipCRT')  === '0') toggleCRT();
    if (localStorage.getItem('pipGlow') === '0') toggleGlow();
  } catch (_) {}
})();

/* ════════════════════════════════════════
   FORMULARIO DE CONTACTO
   EDITAR: reemplaza el console.log por tu integración real
   (Formspree, Netlify Forms, EmailJS, etc.)
════════════════════════════════════════ */
const sendBtn  = document.getElementById('sendMsg');
const feedback = document.getElementById('formFeedback');

if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    const name  = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const msg   = document.getElementById('contact-msg').value.trim();

    if (!name || !email || !msg) {
      feedback.textContent  = '⚠ Completa todos los campos antes de transmitir.';
      feedback.style.color  = 'var(--hud-dim)';
      feedback.style.display = 'block';
      return;
    }

    /* ── AQUÍ: integra tu servicio de formularios ──
       Ejemplo con Formspree:
       fetch('https://formspree.io/f/TU_ID', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ name, email, message: msg }),
       }); */
    console.log('[contacto]', { name, email, msg });

    feedback.textContent  = '✓ Mensaje transmitido. Me pondré en contacto pronto.';
    feedback.style.color  = 'var(--hud-secondary)';
    feedback.style.display = 'block';
  });
}

/* ════════════════════════════════════════
   RELOJ EN LA BARRA DE ESTADO
════════════════════════════════════════ */
function updateClock() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const timeEl = document.getElementById('statusRight');
  if (timeEl) timeEl.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

setInterval(updateClock, 1000);
updateClock();

/* ════════════════════════════════════════
   PROYECTOS — Expandir / colapsar
════════════════════════════════════════ */
document.querySelectorAll('.inv-item').forEach((item) => {
  item.querySelector('.inv-header').addEventListener('click', () => {
    const wasExpanded = item.classList.contains('expanded');
    /* Colapsar todos */
    document.querySelectorAll('.inv-item').forEach((i) => i.classList.remove('expanded'));
    /* Expandir el clickeado si estaba cerrado */
    if (!wasExpanded) item.classList.add('expanded');
  });
});

/**
 * dial.js
 * Lógica de la perilla de navegación del Pip-Boy.
 *
 * Soporta:
 *   - Click en las pestañas de la barra de tabs
 *   - Click en botones ◀ ▶
 *   - Arrastre del dial con mouse (drag circular)
 *   - Scroll de rueda del mouse sobre el dial
 *   - Touch drag en móvil
 *   - Teclado: flechas izquierda/derecha cuando el dial tiene foco
 *
 * Depende de: sound.js (playDialClick, playTabChange)
 *             animations.js (animateSkillBars)
 */

'use strict';

/* ── Configuración de tabs ──
   El orden del array define el orden de rotación del dial */
const TABS       = ['stat', 'inv', 'data', 'map', 'radio'];
const TAB_LABELS = { stat: 'STAT', inv: 'INV', data: 'DATA', map: 'MAP', radio: 'HUD' };

/* ── Estado interno ── */
let currentTab    = 0;
let dialRotation  = 0;   // grados acumulados de rotación visual
let isDragging    = false;
let dragStartAngle = 0;
let dragStartTab   = 0;

/* ── Referencias al DOM ── */
const dialEl         = document.getElementById('navDial');
const tabBtns        = document.querySelectorAll('.tab-btn');
const sections       = document.querySelectorAll('.pip-section');
const activeTabLabel = document.getElementById('activeTabLabel');

/* ════════════════════════════════════════
   goToTab(idx)
   Navega a la pestaña de índice idx (con wrap circular).
════════════════════════════════════════ */
function goToTab(idx) {
  const prev = currentTab;
  currentTab = ((idx % TABS.length) + TABS.length) % TABS.length;

  /* Sin cambio: no hacer nada */
  if (prev === currentTab) return;

  /* ── Sonido: clic mecánico + chirp de fósforo ── */
  const direction = idx - prev;
  playDialClick(direction);

  /* ── Actualizar estado visual de tabs ── */
  tabBtns.forEach((btn, i) => {
    btn.classList.toggle('active', i === currentTab);
    btn.setAttribute('aria-selected', String(i === currentTab));
  });

  /* ── Mostrar sección activa ── */
  sections.forEach((sec, i) => {
    sec.classList.toggle('active', i === currentTab);
  });

  /* ── Etiqueta de tab activo ── */
  activeTabLabel.textContent = TAB_LABELS[TABS[currentTab]];

  /* ── LEDs indicadores ── */
  for (let i = 0; i < TABS.length; i++) {
    const led = document.getElementById('led' + i);
    if (led) led.classList.toggle('lit', i === currentTab);
  }

  /* ── Rotar dial visualmente (72° por tab = 360°/5) ── */
  const delta = currentTab - prev;
  dialRotation += delta * 72;
  dialEl.style.transform = `rotate(${dialRotation}deg)`;
  dialEl.setAttribute('aria-valuenow', String(currentTab));

  /* ── Reanimar skill bars si volvemos a STAT ── */
  if (TABS[currentTab] === 'stat') {
    animateSkillBars();
  }
}

/* ════════════════════════════════════════
   Obtener ángulo del puntero respecto al centro del elemento
════════════════════════════════════════ */
function getAngle(e, el) {
  const rect = el.getBoundingClientRect();
  const cx   = rect.left + rect.width  / 2;
  const cy   = rect.top  + rect.height / 2;
  const x    = (e.clientX ?? e.touches?.[0]?.clientX ?? cx) - cx;
  const y    = (e.clientY ?? e.touches?.[0]?.clientY ?? cy) - cy;
  return Math.atan2(y, x) * (180 / Math.PI);
}

/* ════════════════════════════════════════
   Eventos
════════════════════════════════════════ */

/* Click en pestañas */
tabBtns.forEach((btn, i) => {
  btn.addEventListener('click', () => goToTab(i));
});

/* Botones ◀ ▶ */
document.getElementById('prevTabBtn').addEventListener('click', () => goToTab(currentTab - 1));
document.getElementById('nextTabBtn').addEventListener('click', () => goToTab(currentTab + 1));

/* Drag con mouse */
dialEl.addEventListener('mousedown', (e) => {
  isDragging     = true;
  dragStartAngle = getAngle(e, dialEl);
  dragStartTab   = currentTab;
  e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const delta = getAngle(e, dialEl) - dragStartAngle;
  const steps = Math.round(delta / 72);
  if (steps !== 0) goToTab(dragStartTab + steps);
});

document.addEventListener('mouseup', () => { isDragging = false; });

/* Drag con touch (móvil) */
dialEl.addEventListener('touchstart', (e) => {
  isDragging     = true;
  dragStartAngle = getAngle(e, dialEl);
  dragStartTab   = currentTab;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  const delta = getAngle(e, dialEl) - dragStartAngle;
  const steps = Math.round(delta / 72);
  if (steps !== 0) goToTab(dragStartTab + steps);
}, { passive: true });

document.addEventListener('touchend', () => { isDragging = false; });

/* Scroll de rueda sobre el dial */
dialEl.addEventListener('wheel', (e) => {
  e.preventDefault();
  goToTab(currentTab + (e.deltaY > 0 ? 1 : -1));
}, { passive: false });

/* Teclado cuando el dial tiene foco */
dialEl.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToTab(currentTab + 1);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goToTab(currentTab - 1);
});

/* ── Botón de encendido / apagado ── */
let isOff = false;
document.getElementById('powerBtn').addEventListener('click', () => {
  isOff = !isOff;
  document.getElementById('offScreen').classList.toggle('visible', isOff);
});

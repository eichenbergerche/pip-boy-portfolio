'use strict';

/* animations.js
 * Secuencia de boot y animaciones de la UI.
 */


/* ── Utilidades ── */

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


/* ── Línea de arranque por idioma ──
 * Este array se carga desde i18n.translations.boot_lines */
function getBootLines(i18nInstance) {
  return i18nInstance.translations.boot_lines || [
    // fallback en inglés
    'ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL',
    'COPYRIGHT 2075-2077 ROBCO INDUSTRIES',
    '',
    'PIP-BOY 3000 MKIII — BOOTING SYSTEM...',
    'LOADING VAULT-TEC OS v2.1.0',
    'CHECKING DATA INTEGRITY... OK',
    'LOADING UX/UI MODULE................',
    'LOADING PORTFOLIO MODULE............',
    'LOADING CONTACT MODULE..............',
    '',
    'WELCOME, VAULT DWELLER.',
    'SYSTEM READY. ■'
  ];
}


/* ── bootSequence ──
 * Escribe las líneas de boot línea a línea */
async function bootSequence(i18n) {
  const textEl  = document.getElementById('bootText');
  const screenEl = document.getElementById('bootScreen');

  const lines = getBootLines(i18n);

  let content = '';
  for (const line of lines) {
    content += line + '\n';        // ✅ así es
    textEl.textContent = content;

    const delay = line === '' ? 80 : line.includes('...') ? 260 : 120;
    await sleep(delay);
  }

  await sleep(900);

  screenEl.style.transition = 'opacity 0.6s ease';
  screenEl.style.opacity    = '0';
  await sleep(600);
  screenEl.style.display = 'none';

  animateSkillBars();
  setTimeout(() => {
    const ticker = document.querySelector('.ticker-inner');
    ticker.style.animationPlayState = 'running';

    ticker.addEventListener('mouseenter', () => {
      ticker.style.animationPlayState = 'paused';
    });

    ticker.addEventListener('mouseleave', () => {
      ticker.style.animationPlayState = 'running';
    });
  }, 800);
}


/* ── animateSkillBars ── */
function animateSkillBars() {
  document.querySelectorAll('.skill-bar-fill').forEach((bar) => {
    setTimeout(() => {
      bar.style.width = bar.dataset.value + '%';
    }, 100);
  });
}


/* Arrancar el boot cuando el DOM esté listo */
document.addEventListener('DOMContentLoaded', () => {
  // Asumiendo que `i18n` se expone como variable global
  window.i18n = new I18n(); // ya existe en i18n.js

  window.addEventListener('load', () => {
    bootSequence(window.i18n);
  });
});
/**
 * sound.js
 * Reproductor de sonidos del Pip-Boy.
 *
 * Usa el archivo: assets/sounds/pipboy-select.mp3
 * Si el archivo no existe, las funciones fallan silenciosamente
 * (no rompen nada en el resto de la app).
 *
 * Funciones globales usadas por dial.js:
 *   playDialClick(direction)  — sonido al girar la perilla
 *   playTabChange()           — sonido al cambiar de sección
 */

'use strict';

/**
 * Cargamos el audio UNA sola vez al iniciar la página.
 * Ruta relativa desde index.html → assets/sounds/pipboy-select.mp3
 *
 * EDITAR: si querés usar otro archivo cambiá la ruta aquí.
 */
const pipboySelectSound = new Audio('assets/sounds/pipboy-select.mp3');

/**
 * Función interna: clona el audio y lo reproduce.
 * Clonar permite disparar el sonido aunque el anterior no terminó
 * (por ejemplo si el usuario gira el dial rápido).
 *
 * @param {number} volume — entre 0.0 y 1.0
 */
function playSound(volume) {
  try {
    const sfx = pipboySelectSound.cloneNode();
    sfx.volume = volume;
    sfx.play().catch(() => {
      // El navegador puede bloquear el audio antes de la primera
      // interacción del usuario — ignoramos ese error silenciosamente.
    });
  } catch (_) {
    // Si el archivo no existe o hay otro error, no hacemos nada.
  }
}

/**
 * playDialClick(direction)
 * Se llama desde dial.js al girar la perilla.
 * Volumen un poco más alto que el cambio de tab.
 *
 * @param {number} direction — positivo = derecha, negativo = izquierda
 */
function playDialClick(direction) {
  try {
    const sfx = new Audio('assets/sounds/deck_ui_tab_transition_01.wav');
    sfx.volume = 0.6;
    sfx.play().catch(() => {});
  } catch (_) {}
}

/**
 * playTabChange()
 * Se llama desde dial.js 40ms después del clic,
 * cuando la pantalla ya cambió de sección.
 */
function playTabChange() {
  playSound(0.4);
}


// Sonido para clicks en elementos interactivos dentro de las pantallas
const pipboyClickSound = new Audio('assets/sounds/deck_ui_slider_down.wav');

function playUIClick() {
  try {
    const sfx = pipboyClickSound.cloneNode();
    sfx.volume = 0.5;
    sfx.play().catch(() => {});
  } catch (_) {}
}
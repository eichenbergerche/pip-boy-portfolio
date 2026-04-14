// i18n.js - Sistema de traducción multilingüe

class I18n {
  constructor() {
    // 1. Idioma guardado en localStorage
    const savedLang = localStorage.getItem('lang');

    // 2. Fallback por defecto: SIEMPRE inglés
    const defaultLang = 'en';

    // 3. Elegir idioma inicial
    this.currentLang = savedLang || defaultLang;
    this.translations = {};
    this.init();
  }

  async init() {
    await this.loadTranslations(this.currentLang);
    this.setupLanguageButtons();
    this.translatePage();
  }

  async loadTranslations(lang) {
    try {
      const response = await fetch(`lang/${lang}.json`);
      this.translations = await response.json();
    } catch (error) {
      console.error(`Error loading ${lang}.json:`, error);
    }
  }

  translatePage() {
    // 1. Traducir todos los textos
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (this.translations[key]) {
        element.textContent = this.translations[key];
      }
    });

    // 2. Cambiar el PDF del CV
    const cvLink = document.getElementById('cvLink');
    if (cvLink) {
      const attr = `data-cv-${this.currentLang}`;
      if (cvLink.hasAttribute(attr)) {
        cvLink.href = cvLink.getAttribute(attr);
      }
    }

    // 3. Sincronizar el botón ACTIVO con this.currentLang
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-lang') === this.currentLang) {
        btn.classList.add('active');
      }
    });

    // 4. Ajustar el idioma de la página
    document.documentElement.lang = this.currentLang;
    localStorage.setItem('lang', this.currentLang);
  }

  setupLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const lang = e.target.getAttribute('data-lang');

        if (!['es', 'en', 'pt'].includes(lang)) {
          console.warn('Idioma no soportado:', lang);
          return;
        }

        // Actualizar el botón activo
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        // Cambiar idioma y PDF
        await this.loadTranslations(lang);
        this.currentLang = lang;
        this.translatePage();

        if (typeof playTabChange === 'function') {
          playTabChange();
        }
      });
    });
  }
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new I18n();
});
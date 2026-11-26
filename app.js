(() => {
  'use strict';

  const STORAGE_THEME_KEY = 'color-scheme';
  const STORAGE_PROGRESS_KEY = 'melek_bisnis_progress_v1';

  function safeGetStorage(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function safeSetStorage(key, value) {
    try {
      if (value === null) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, value);
      }
      return true;
    } catch {
      return false;
    }
  }

  function formatIDR(amount) {
    const rounded = Math.round(Number(amount) || 0);
    const sign = rounded < 0 ? '-' : '';
    const abs = Math.abs(rounded);
    return `${sign}Rp${abs.toLocaleString('id-ID')}`;
  }

  function parseNumeric(val, fallback = 0) {
    const num = Number(val);
    return Number.isFinite(num) ? num : fallback;
  }

  /* 1. Two-state Theme Toggle (System <-> Opposite override) */
  function initThemeToggle() {
    const meta = document.querySelector('meta[name="color-scheme"]');
    const btn = document.getElementById('theme-toggle');
    if (!meta || !btn) return;

    const labelEl = btn.querySelector('[data-theme-label]');
    const mq = window.matchMedia('(prefers-color-scheme: dark)');

    const getSystemTheme = () => (mq.matches ? 'dark' : 'light');

    const getStoredTheme = () => {
      const saved = safeGetStorage(STORAGE_THEME_KEY);
      return saved === 'light' || saved === 'dark' ? saved : null;
    };

    const getRenderedTheme = () => getStoredTheme() || getSystemTheme();

    function applyTheme(stored) {
      meta.setAttribute('content', stored || 'light dark');
      if (stored === 'light' || stored === 'dark') {
        document.documentElement.setAttribute('data-theme', stored);
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      const rendered = stored || getSystemTheme();
      const nextTheme = rendered === 'dark' ? 'light' : 'dark';
      btn.setAttribute(
        'aria-label',
        nextTheme === 'dark' ? 'Ubah ke tema gelap' : 'Ubah ke tema terang'
      );
      if (labelEl) {
        labelEl.textContent = stored
          ? stored === 'dark'
            ? 'Gelap'
            : 'Terang'
          : rendered === 'dark'
          ? 'Sistem (Gelap)'
          : 'Sistem (Terang)';
      }
    }

    applyTheme(getStoredTheme());

    btn.addEventListener('click', () => {
      const currentRendered = getRenderedTheme();
      const target = currentRendered === 'dark' ? 'light' : 'dark';
      const system = getSystemTheme();
      const nextStored = target === system ? null : target;
      safeSetStorage(STORAGE_THEME_KEY, nextStored);
      applyTheme(nextStored);
    });

    mq.addEventListener('change', () => {
      applyTheme(getStoredTheme());
    });

    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_THEME_KEY) {
        applyTheme(getStoredTheme());
      }
    });
  }

  /* 2. Responsive Navbar measurement (ResizeObserver + Popover fallback) */
  function initNavbar() {
    const header = document.querySelector('.site-header');
    const inner = header?.querySelector('.header-inner');
    const menuBtn = header?.querySelector('.menu-button');
    const menu = document.getElementById('site-menu');
    if (!header || !inner || !menuBtn || !menu) return;

    const supportsPopover = Object.hasOwn(HTMLElement.prototype, 'popover');

    if (!supportsPopover) {
      menu.removeAttribute('popover');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('is-open-fallback');
        menuBtn.setAttribute('aria-expanded', String(isOpen));
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('is-open-fallback')) {
          menu.classList.remove('is-open-fallback');
          menuBtn.setAttribute('aria-expanded', 'false');
          menuBtn.focus();
        }
      });
    } else {
      menu.addEventListener('toggle', (e) => {
        menuBtn.setAttribute('aria-expanded', String(e.newState === 'open'));
      });
    }

    let lastMeasuredHeaderWidth = 0;

    function measureNav() {
      const headerWidth = header.clientWidth;
      const wasWide = header.classList.contains('is-wide');
      if (!wasWide && headerWidth <= lastMeasuredHeaderWidth) {
        return;
      }
      lastMeasuredHeaderWidth = headerWidth;

      const wasOpen = supportsPopover && menu.matches(':popover-open');
      header.classList.add('is-measuring');
      header.classList.add('is-wide');
      menu.removeAttribute('popover');

      const fits = inner.scrollWidth <= inner.clientWidth;

      if (!fits) {
        header.classList.remove('is-wide');
        if (supportsPopover) {
          menu.setAttribute('popover', 'auto');
          if (wasOpen) {
            try {
              menu.showPopover();
            } catch {
              /* Ignore if not top-layer ready */
            }
          }
        }
      } else {
        menu.classList.remove('is-open-fallback');
      }

      window.requestAnimationFrame(() => {
        header.classList.remove('is-measuring');
      });
    }

    measureNav();
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(measureNav);
      ro.observe(header);
      ro.observe(menu);
    } else {
      window.addEventListener('resize', measureNav);
    }
  }

  /* 3. Scroll Progress fallback when CSS scroll() timeline is unavailable */
  function initScrollProgress() {
    const progressEl = document.getElementById('reading-progress');
    if (!progressEl) return;
    if (CSS.supports('animation-timeline', 'scroll()')) return;

    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      progressEl.style.transform = `scaleX(${ratio})`;
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
  }

  /* 4. Scrollspy sync & IntersectionObserver fallback */
  function initScrollspy() {
    const tocLinks = [...document.querySelectorAll('.toc-nav a[href^="#"]')];
    if (tocLinks.length === 0) return;

    if (CSS.supports('scroll-target-group: auto')) {
      const syncAria = () => {
        const current = document.querySelector('.toc-nav a:target-current');
        tocLinks.forEach((link) => {
          link.setAttribute('aria-current', link === current ? 'true' : 'false');
        });
      };
      syncAria();
      document.addEventListener('scrollend', syncAria);
      return;
    }

    const sections = tocLinks
      .map((a) => document.querySelector(a.getAttribute('href')))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            tocLinks.forEach((link) => {
              const active = link.getAttribute('href') === `#${id}`;
              link.classList.toggle('target-current', active);
              link.setAttribute('aria-current', active ? 'true' : 'false');
            });
          }
        });
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
  }

  /* 5. Range slider CSS variable sync + +/- stepper pairing */
  function initRangeControls() {
    const ranges = [...document.querySelectorAll('input[type="range"]')];
    ranges.forEach((slider) => {
      const sync = () => {
        slider.style.setProperty('--attr-min', slider.min || '0');
        slider.style.setProperty('--attr-max', slider.max || '100');
        slider.style.setProperty('--control-value', slider.value);
      };
      sync();
      slider.addEventListener('input', sync);
      slider.addEventListener('change', sync);
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-step-target]');
      if (!btn) return;
      const targetId = btn.getAttribute('data-step-target');
      const delta = parseNumeric(btn.getAttribute('data-step-delta'), 0);
      const input = document.getElementById(targetId);
      if (!input) return;

      const min = input.min !== '' ? Number(input.min) : -Infinity;
      const max = input.max !== '' ? Number(input.max) : Infinity;
      const current = parseNumeric(input.value, 0);
      const next = Math.min(max, Math.max(min, current + delta));
      input.value = String(next);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }

  /* 6. Learning Progress Tracker across multi-page phases */
  function getProgressMap() {
    const raw = safeGetStorage(STORAGE_PROGRESS_KEY);
    if (!raw) return {};
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  function initProgressTracker() {
    const phaseId = document.body.getAttribute('data-phase');
    const toggleBtn = document.getElementById('phase-complete-btn');
    const statusText = document.getElementById('phase-complete-status');

    if (phaseId && toggleBtn) {
      const renderPhaseState = () => {
        const map = getProgressMap();
        const done = Boolean(map[phaseId]);
        toggleBtn.setAttribute('aria-pressed', String(done));
        toggleBtn.textContent = done
          ? 'Tandai Belum Selesai'
          : 'Tandai Fase Ini Selesai Dipelajari';
        if (statusText) {
          statusText.textContent = done
            ? 'Status: Selesai dipelajari (tersimpan di browser ini).'
            : 'Status: Belum ditandai selesai.';
        }
      };

      renderPhaseState();
      toggleBtn.addEventListener('click', () => {
        const map = getProgressMap();
        map[phaseId] = !map[phaseId];
        safeSetStorage(STORAGE_PROGRESS_KEY, JSON.stringify(map));
        renderPhaseState();
      });
    }

    const indexSummary = document.getElementById('progress-summary');
    const resetBtn = document.getElementById('reset-progress-btn');
    const phaseBadges = [...document.querySelectorAll('[data-phase-status]')];

    if (indexSummary || phaseBadges.length > 0) {
      const renderHubProgress = () => {
        const map = getProgressMap();
        const phases = ['fase-1', 'fase-2', 'fase-3', 'fase-4', 'fase-5'];
        const doneCount = phases.filter((p) => Boolean(map[p])).length;

        phaseBadges.forEach((el) => {
          const p = el.getAttribute('data-phase-status');
          const isDone = Boolean(map[p]);
          el.classList.toggle('is-done', isDone);
          el.textContent = isDone ? 'Selesai dipelajari' : 'Belum selesai';
        });

        if (indexSummary) {
          if (doneCount === 0) {
            indexSummary.textContent =
              'Belum ada fase yang ditandai selesai. Mulai dari Fase 1 dan gunakan tombol "Tandai Fase Ini Selesai" di akhir halaman.';
          } else {
            indexSummary.textContent = `${doneCount} dari ${phases.length} fase telah kamu selesaikan.`;
          }
        }
        if (resetBtn) {
          resetBtn.disabled = doneCount === 0;
        }
      };

      renderHubProgress();
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          safeSetStorage(STORAGE_PROGRESS_KEY, JSON.stringify({}));
          renderHubProgress();
        });
      }
    }
  }


  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initNavbar();
    initScrollProgress();
    initScrollspy();
    initRangeControls();
    initProgressTracker();
  });
})();

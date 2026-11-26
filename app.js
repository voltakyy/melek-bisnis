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

  /* 7. Phase 1: Idea & Campus Problem Validator */
  function initPhase1Simulator() {
    const form = document.getElementById('sim-fase-1');
    if (!form) return;

    const ideaInput = document.getElementById('f1-idea');
    const freqInput = document.getElementById('f1-freq');
    const payInput = document.getElementById('f1-pay');
    const reachInput = document.getElementById('f1-reach');
    const riskInput = document.getElementById('f1-risk');

    const freqVal = document.getElementById('f1-freq-val');
    const payVal = document.getElementById('f1-pay-val');
    const reachVal = document.getElementById('f1-reach-val');
    const riskVal = document.getElementById('f1-risk-val');

    const outTitle = document.getElementById('f1-out-title');
    const outScore = document.getElementById('f1-out-score');
    const outVerdict = document.getElementById('f1-out-verdict');
    const outNext = document.getElementById('f1-out-next');

    const render = () => {
      const idea = (ideaInput.value || '').trim();
      const freq = parseNumeric(freqInput.value, 3);
      const pay = parseNumeric(payInput.value, 3);
      const reach = parseNumeric(reachInput.value, 3);
      const risk = parseNumeric(riskInput.value, 3);

      freqVal.textContent = `${freq} / 5`;
      payVal.textContent = `${pay} / 5`;
      reachVal.textContent = `${reach} / 5`;
      riskVal.textContent = `${risk} / 5`;

      if (!idea) {
        outTitle.textContent = 'Belum ada ide diisi';
        outScore.textContent = '- / 20';
        outVerdict.className = 'status-banner is-neutral';
        outVerdict.textContent =
          'Isi nama ide atau masalah di sebelah kiri untuk mengevaluasi kelayakannya.';
        outNext.textContent =
          'Contoh: Jasa desain PPT kilat, PO nasi ayam kos malam, atau jastip print tugas.';
        return;
      }

      const total = freq + pay + reach + risk;
      outTitle.textContent = idea;
      outScore.textContent = `${total} / 20`;

      if (total >= 16) {
        outVerdict.className = 'status-banner is-positive';
        outVerdict.textContent =
          'Layak langsung diuji (Skor Tinggi): masalah nyata, calon pembeli dekat, dan risiko awal rendah.';
        outNext.textContent =
          'Langkah berikutnya: tawarkan ke 5 teman atau grup kos pakai sistem Pre-Order (PO) atau DP sebelum keluar modal stok.';
      } else if (total >= 11) {
        outVerdict.className = 'status-banner is-neutral';
        outVerdict.textContent =
          'Potensial, tetapi perlu dipersempit (Skor Sedang): perkuat salah satu skor yang masih 1 atau 2.';
        outNext.textContent =
          'Saran: kalau risiko stok masih tinggi, ubah dulu jadi sistem PO atau reseller agar tidak rugi di awal.';
      } else {
        outVerdict.className = 'status-banner is-negative';
        outVerdict.textContent =
          'Terlalu berisiko atau pasarnya belum jelas (Skor Rendah): jangan keluar modal uang dulu.';
        outNext.textContent =
          'Uji ulang apakah teman kampus benar-benar rela membayar untuk ini, bukan sekadar bilang "ide bagus".';
      }
    };

    form.addEventListener('input', render);
    form.querySelectorAll('[data-f1-preset]').forEach((btn) => {
      btn.addEventListener('click', () => {
        ideaInput.value = btn.getAttribute('data-idea') || '';
        freqInput.value = btn.getAttribute('data-freq') || '4';
        payInput.value = btn.getAttribute('data-pay') || '4';
        reachInput.value = btn.getAttribute('data-reach') || '4';
        riskInput.value = btn.getAttribute('data-risk') || '4';
        [freqInput, payInput, reachInput, riskInput].forEach((el) =>
          el.dispatchEvent(new Event('input', { bubbles: true }))
        );
      });
    });

    render();
  }

  /* 8. Phase 2: Unit Economics (HPP, Margin, BEP) + Cash Flow vs Profit Simulators */
  function initPhase2Simulators() {
    const unitForm = document.getElementById('sim-unit-economics');
    if (unitForm) {
      const priceEl = document.getElementById('f2-price');
      const hppEl = document.getElementById('f2-hpp');
      const fixedEl = document.getElementById('f2-fixed');
      const unitsEl = document.getElementById('f2-units');
      const unitsVal = document.getElementById('f2-units-val');

      const outRev = document.getElementById('f2-out-rev');
      const outCogs = document.getElementById('f2-out-cogs');
      const outGross = document.getElementById('f2-out-gross');
      const outNet = document.getElementById('f2-out-net');
      const outMargin = document.getElementById('f2-out-margin');
      const outBep = document.getElementById('f2-out-bep');
      const outStatus = document.getElementById('f2-out-status');

      const renderUnit = () => {
        const price = parseNumeric(priceEl.value, -1);
        const hpp = parseNumeric(hppEl.value, -1);
        const fixed = parseNumeric(fixedEl.value, -1);
        const units = parseNumeric(unitsEl.value, 0);
        unitsVal.textContent = `${units} unit`;

        if (price <= 0 || hpp < 0 || fixed < 0) {
          outRev.textContent = '-';
          outCogs.textContent = '-';
          outGross.textContent = '-';
          outNet.textContent = '-';
          outMargin.textContent = '-';
          outBep.textContent = '-';
          outStatus.className = 'status-banner is-negative';
          outStatus.textContent =
            'Input tidak valid: Harga jual harus lebih dari Rp0 dan biaya tidak boleh bernilai negatif.';
          return;
        }

        const rev = price * units;
        const totalCogs = hpp * units;
        const gross = rev - totalCogs;
        const net = gross - fixed;
        const marginPct = rev > 0 ? (net / rev) * 100 : 0;
        const contribPerUnit = price - hpp;

        outRev.textContent = formatIDR(rev);
        outCogs.textContent = formatIDR(totalCogs);
        outGross.textContent = formatIDR(gross);
        outNet.textContent = formatIDR(net);
        outMargin.textContent = `${marginPct.toFixed(1)}%`;

        if (contribPerUnit <= 0) {
          outBep.textContent = 'Tidak pernah balik modal';
          outStatus.className = 'status-banner is-negative';
          outStatus.textContent =
            'Bahaya: Harga jual sama atau lebih rendah dari HPP bahan. Semakin laris, semakin besar ruginya!';
          return;
        }

        const bepUnits = Math.ceil(fixed / contribPerUnit);
        outBep.textContent = `${bepUnits.toLocaleString('id-ID')} unit`;

        if (units < bepUnits) {
          outStatus.className = 'status-banner is-negative';
          outStatus.textContent = `Belum balik modal (Rugi ${formatIDR(Math.abs(net))}). Kamu butuh minimal ${bepUnits - units} unit lagi untuk mencapai BEP.`;
        } else if (net === 0) {
          outStatus.className = 'status-banner is-neutral';
          outStatus.textContent =
            'Tepat di titik impas (BEP): semua biaya tertutup, laba bersih Rp0.';
        } else {
          outStatus.className = 'status-banner is-positive';
          outStatus.textContent = `Usaha untung bersih ${formatIDR(net)} (margin bersih ${marginPct.toFixed(1)}%).`;
        }
      };

      unitForm.addEventListener('input', renderUnit);
      unitForm.querySelectorAll('[data-f2-preset]').forEach((btn) => {
        btn.addEventListener('click', () => {
          priceEl.value = btn.getAttribute('data-price') || '15000';
          hppEl.value = btn.getAttribute('data-hpp') || '6000';
          fixedEl.value = btn.getAttribute('data-fixed') || '300000';
          unitsEl.value = btn.getAttribute('data-units') || '100';
          unitsEl.dispatchEvent(new Event('input', { bubbles: true }));
        });
      });

      renderUnit();
    }

    const cfForm = document.getElementById('sim-cashflow');
    if (cfForm) {
      const startCashEl = document.getElementById('f2-cf-start');
      const arPctEl = document.getElementById('f2-cf-arpct');
      const arPctVal = document.getElementById('f2-cf-arpct-val');
      const stockSpendEl = document.getElementById('f2-cf-stock');

      const outPaperProfit = document.getElementById('f2-cf-profit');
      const outCashIn = document.getElementById('f2-cf-in');
      const outCashOut = document.getElementById('f2-cf-out');
      const outEndCash = document.getElementById('f2-cf-end');
      const outReceivable = document.getElementById('f2-cf-ar');
      const outDiag = document.getElementById('f2-cf-diag');

      const fixedRev = 1500000;
      const fixedCogsUsed = 600000;
      const fixedOpex = 300000;
      const accountingProfit = fixedRev - fixedCogsUsed - fixedOpex; // Rp600.000

      const renderCF = () => {
        const startCash = parseNumeric(startCashEl.value, 0);
        const arPct = parseNumeric(arPctEl.value, 0);
        const extraStock = parseNumeric(stockSpendEl.value, 0);
        arPctVal.textContent = `${arPct}% bayar nanti (kasbon)`;

        const receivable = Math.round((fixedRev * arPct) / 100);
        const cashIn = fixedRev - receivable;
        const cashOut = fixedCogsUsed + fixedOpex + Math.max(0, extraStock);
        const endCash = startCash + cashIn - cashOut;

        outPaperProfit.textContent = formatIDR(accountingProfit);
        outCashIn.textContent = formatIDR(cashIn);
        outCashOut.textContent = formatIDR(cashOut);
        outEndCash.textContent = formatIDR(endCash);
        outReceivable.textContent = formatIDR(receivable);

        if (endCash < 0) {
          outDiag.className = 'status-banner is-negative';
          outDiag.textContent = `Krisis Cash Flow! Di catatan kamu untung ${formatIDR(accountingProfit)}, tetapi kas di rekening minus ${formatIDR(Math.abs(endCash))}. Uangmu nyangkut di piutang/stok.`;
        } else if (endCash < startCash) {
          outDiag.className = 'status-banner is-neutral';
          outDiag.textContent = `Waspada: secara kertas untung ${formatIDR(accountingProfit)}, tetapi kas tunai berkurang dari modal awal karena sebagian uang tertahan di piutang atau stok.`;
        } else {
          outDiag.className = 'status-banner is-positive';
          outDiag.textContent = `Cash Flow sehat! Penjualan tunai masuk cepat dan stok terkendali, kas akhir bertambah menjadi ${formatIDR(endCash)}.`;
        }
      };

      cfForm.addEventListener('input', renderCF);
      renderCF();
    }
  }

  /* 9. Phase 3: Compounding (Buffett vs Simons lesson) & Tails You Win */
  function initPhase3Simulators() {
    const compForm = document.getElementById('sim-compounding');
    if (compForm) {
      const capEl = document.getElementById('f3-cap');
      const rateEl = document.getElementById('f3-rate');
      const yearsEl = document.getElementById('f3-years');
      const rateVal = document.getElementById('f3-rate-val');
      const yearsVal = document.getElementById('f3-years-val');

      const outFinal = document.getElementById('f3-out-final');
      const outHalf = document.getElementById('f3-out-half');
      const outLate = document.getElementById('f3-out-late');
      const outBar = document.getElementById('f3-out-note');

      const renderComp = () => {
        const cap = Math.max(0, parseNumeric(capEl.value, 1000000));
        const rate = parseNumeric(rateEl.value, 15) / 100;
        const years = parseNumeric(yearsEl.value, 30);

        rateVal.textContent = `${(rate * 100).toFixed(0)}% / tahun`;
        yearsVal.textContent = `${years} tahun`;

        const fullResult = cap * Math.pow(1 + rate, years);
        const halfYears = Math.max(1, Math.floor(years / 2));
        const halfResult = cap * Math.pow(1 + rate, halfYears);
        const lastFiveGain = fullResult - cap * Math.pow(1 + rate, Math.max(0, years - 5));

        outFinal.textContent = formatIDR(fullResult);
        outHalf.textContent = formatIDR(halfResult);
        outLate.textContent = formatIDR(lastFiveGain);
        const latePct = fullResult > 0 ? (lastFiveGain / fullResult) * 100 : 0;
        outBar.className = 'status-banner is-positive';
        outBar.textContent = `Sebesar ${latePct.toFixed(1)}% dari hasil akhir muncul hanya dalam 5 tahun terakhir! Itulah mengapa Warren Buffett meraih $81,5 miliar dari $84,5 miliar kekayaannya setelah usia 65 tahun (Bab 4, hal. 55).`;
      };

      compForm.addEventListener('input', renderComp);
      renderComp();
    }

    const tailBtn = document.getElementById('f3-tail-run');
    if (tailBtn) {
      const lossEl = document.getElementById('f3-tail-loss');
      const multEl = document.getElementById('f3-tail-mult');
      const outSummary = document.getElementById('f3-tail-summary');
      const outList = document.getElementById('f3-tail-list');

      const runTails = () => {
        const costPerTest = Math.max(50000, parseNumeric(lossEl.value, 200000));
        const winnerMult = Math.max(2, parseNumeric(multEl.value, 25));

        const results = [];
        let totalSpent = 0;
        let totalReturn = 0;
        let winCount = 0;

        for (let i = 1; i <= 10; i++) {
          totalSpent += costPerTest;
          let ret = 0;
          let label = 'Gagal (Rugi 100% biaya tes)';
          if (i === 9) {
            ret = costPerTest * winnerMult;
            label = `Pemenang Ekor Panjang (${winnerMult}x modal tes)`;
            winCount++;
          } else if (i === 4 || i === 7) {
            ret = costPerTest * 1.5;
            label = 'Cukup baik (1.5x modal tes)';
            winCount++;
          }
          totalReturn += ret;
          results.push(`Eksperimen #${i}: ${label} -> ${formatIDR(ret)}`);
        }

        const net = totalReturn - totalSpent;
        outSummary.className = net >= 0 ? 'status-banner is-positive' : 'status-banner is-negative';
        outSummary.textContent = `Dari 10 tes (total modal ${formatIDR(totalSpent)}), ${10 - winCount} ide gagal/rugi. Hasil total ${formatIDR(totalReturn)} (Laba bersih ${formatIDR(net)}).`;
        outList.replaceChildren();
        results.forEach((line) => {
          const li = document.createElement('li');
          li.textContent = line;
          outList.appendChild(li);
        });
      };

      tailBtn.addEventListener('click', runTails);
      runTails();
    }
  }

  /* 10. Phase 4: 3-Statement Mini Audit Simulator */
  function initPhase4Simulator() {
    const form = document.getElementById('sim-statements');
    if (!form) return;

    const cashEl = document.getElementById('f4-cash');
    const arEl = document.getElementById('f4-ar');
    const invEl = document.getElementById('f4-inv');
    const fixedAssetEl = document.getElementById('f4-fixed');
    const shortDebtEl = document.getElementById('f4-sdebt');
    const longDebtEl = document.getElementById('f4-ldebt');
    const netIncomeEl = document.getElementById('f4-netinc');

    const outAssets = document.getElementById('f4-out-assets');
    const outLiab = document.getElementById('f4-out-liab');
    const outEquity = document.getElementById('f4-out-equity');
    const outCR = document.getElementById('f4-out-cr');
    const outDER = document.getElementById('f4-out-der');
    const outROE = document.getElementById('f4-out-roe');
    const outDiag = document.getElementById('f4-out-diag');

    const render = () => {
      const cash = Math.max(0, parseNumeric(cashEl.value, 0));
      const ar = Math.max(0, parseNumeric(arEl.value, 0));
      const inv = Math.max(0, parseNumeric(invEl.value, 0));
      const fixedA = Math.max(0, parseNumeric(fixedAssetEl.value, 0));
      const sDebt = Math.max(0, parseNumeric(shortDebtEl.value, 0));
      const lDebt = Math.max(0, parseNumeric(longDebtEl.value, 0));
      const netInc = parseNumeric(netIncomeEl.value, 0);

      const currentAssets = cash + ar + inv;
      const totalAssets = currentAssets + fixedA;
      const totalLiab = sDebt + lDebt;
      const equity = totalAssets - totalLiab;

      outAssets.textContent = formatIDR(totalAssets);
      outLiab.textContent = formatIDR(totalLiab);
      outEquity.textContent = formatIDR(equity);

      const cr = sDebt > 0 ? currentAssets / sDebt : Infinity;
      const der = equity > 0 ? totalLiab / equity : Infinity;
      const roe = equity > 0 ? (netInc / equity) * 100 : 0;

      outCR.textContent = Number.isFinite(cr) ? `${cr.toFixed(2)}x` : 'Tanpa utang pendek';
      outDER.textContent = equity > 0 ? `${der.toFixed(2)}x` : 'Ekuitas <= 0 (Defisit)';
      outROE.textContent = equity > 0 ? `${roe.toFixed(1)}%` : '-';

      if (equity <= 0) {
        outDiag.className = 'status-banner is-negative';
        outDiag.textContent =
          'Kritis (Ekuitas Negatif): Total utang lebih besar daripada seluruh aset usaha. Tidak ada Margin of Safety.';
      } else if (Number.isFinite(cr) && cr < 1) {
        outDiag.className = 'status-banner is-negative';
        outDiag.textContent =
          'Risiko Gagal Bayar Jangka Pendek (Current Ratio < 1x): Aset lancar tidak cukup untuk menutup utang jatuh tempo dekat.';
      } else if (der > 1.5 || cash < sDebt * 0.25) {
        outDiag.className = 'status-banner is-neutral';
        outDiag.textContent =
          'Waspada Leverage / Kas Tipis: Utang cukup berat atau kas tunai terlalu sedikit dibanding kewajiban jangka pendek.';
      } else {
        outDiag.className = 'status-banner is-positive';
        outDiag.textContent =
          'Neraca Sehat & Punya Ruang Kesalahan: Aset lancar kuat menutup tagihan pendek dan rasio utang terkendali.';
      }
    };

    form.addEventListener('input', render);
    form.querySelectorAll('[data-f4-preset]').forEach((btn) => {
      btn.addEventListener('click', () => {
        cashEl.value = btn.getAttribute('data-cash') || '5000000';
        arEl.value = btn.getAttribute('data-ar') || '1000000';
        invEl.value = btn.getAttribute('data-inv') || '2000000';
        fixedAssetEl.value = btn.getAttribute('data-fixed') || '4000000';
        shortDebtEl.value = btn.getAttribute('data-sdebt') || '2000000';
        longDebtEl.value = btn.getAttribute('data-ldebt') || '1000000';
        netIncomeEl.value = btn.getAttribute('data-netinc') || '2400000';
        render();
      });
    });

    render();
  }

  /* 11. Phase 5: Margin of Safety & Mission Statement Builder */
  function initPhase5Simulator() {
    const form = document.getElementById('sim-fase-5');
    if (!form) return;

    const horizonEl = document.getElementById('f5-horizon');
    const reserveEl = document.getElementById('f5-reserve');
    const intrinsicEl = document.getElementById('f5-intrinsic');
    const marketEl = document.getElementById('f5-market');
    const reserveVal = document.getElementById('f5-reserve-val');

    const outMos = document.getElementById('f5-out-mos');
    const outMission = document.getElementById('f5-out-mission');
    const outGame = document.getElementById('f5-out-game');

    const render = () => {
      const horizon = horizonEl.value;
      const reserveMonths = parseNumeric(reserveEl.value, 6);
      const intrinsic = parseNumeric(intrinsicEl.value, 10000);
      const market = parseNumeric(marketEl.value, 7500);
      reserveVal.textContent = `${reserveMonths} bulan biaya hidup`;

      const mosPct = intrinsic > 0 ? ((intrinsic - market) / intrinsic) * 100 : 0;
      if (intrinsic <= 0 || market <= 0) {
        outMos.textContent = 'Input tidak valid';
        outGame.className = 'status-banner is-negative';
        outGame.textContent = 'Nilai intrinsik dan harga pasar harus lebih besar dari 0.';
      } else {
        outMos.textContent = `${mosPct.toFixed(1)}%`;
        if (mosPct >= 25 && reserveMonths >= 6) {
          outGame.className = 'status-banner is-positive';
          outGame.textContent = `Margin of Safety kuat (${mosPct.toFixed(1)}%) dan dana cadangan ${reserveMonths} bulan siap menahan badai tanpa jual paksa.`;
        } else if (mosPct < 0) {
          outGame.className = 'status-banner is-negative';
          outGame.textContent = `Harga pasar lebih mahal ${Math.abs(mosPct).toFixed(1)}% di atas taksiran nilai intrinsik. Margin of Safety negatif.`;
        } else {
          outGame.className = 'status-banner is-neutral';
          outGame.textContent = `Margin of Safety ${mosPct.toFixed(1)}%. Pertimbangkan menambah diskon harga beli atau mempertebal dana cadangan kas.`;
        }
      }

      const horizonCopy = {
        short: 'pedagang jangka pendek yang harus memantau sentimen pasar harian',
        medium: 'pebisnis bertumbuh 3 sampai 5 tahun yang fokus membangun arus kas dan pelanggan loyal',
        long: 'investor bisnis jangka panjang (10 sampai 30 tahun) yang membiarkan peracikan bekerja tanpa terganggu kepanikan sementara'
      };

      outMission.textContent = `Pernyataan Misiku: "Saya bermain sebagai ${horizonCopy[horizon] || horizonCopy.long}. Saya menjaga cadangan kas minimal ${reserveMonths} bulan biaya agar tidak pernah dipaksa menjual aset saat pasar panik, dan selalu menuntut Margin of Safety sebelum menaruh modal besar."`;
    };

    form.addEventListener('input', render);
    render();
  }


  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initNavbar();
    initScrollProgress();
    initScrollspy();
    initRangeControls();
    initProgressTracker();
    initPhase1Simulator();
    initPhase2Simulators();
    initPhase3Simulators();
    initPhase4Simulator();
    initPhase5Simulator();
  });
})();

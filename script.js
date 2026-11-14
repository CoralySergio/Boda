
/* ═══════════════════════════════════════════════════
   INVITACIÓN DE BODA — Coral & Sergio
   Script: countdown, carruseles, animaciones, formulario
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────────────────────────────
     1. COUNTDOWN — Cuenta atrás (6 Marzo 2027)
     ───────────────────────────────────── */
  const EVENT_DATE = new Date('2027-03-06T12:00:00+01:00').getTime();

  const timerEls = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
  };

  function updateCountdown() {
    const now = Date.now();
    const diff = EVENT_DATE - now;

    if (diff <= 0) {
      timerEls.days.textContent = '00';
      timerEls.hours.textContent = '00';
      timerEls.minutes.textContent = '00';
      timerEls.seconds.textContent = '00';
      clearInterval(countdownInterval);
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    timerEls.days.textContent = String(d).padStart(2, '0');
    timerEls.hours.textContent = String(h).padStart(2, '0');
    timerEls.minutes.textContent = String(m).padStart(2, '0');
    timerEls.seconds.textContent = String(s).padStart(2, '0');
  }

  const countdownInterval = setInterval(updateCountdown, 1000);
  updateCountdown();


  /* ─────────────────────────────────────
     2. CARRUSELES — Swipe táctil + autoplay
     ───────────────────────────────────── */
  const carousels = document.querySelectorAll('[data-carousel]');

  /* ── Carruseles sincronizados de "Nosotros" ────────────── */
  const coupleSection = document.querySelector('.couple-section');
  const nosotrosCarousels = coupleSection
    ? Array.from(coupleSection.querySelectorAll('[data-carousel]'))
    : [];

  // Estado compartido para los carruseles de Nosotros
  const sync = {
    current: 0,
    total: 0,
    cycles: 0,
    maxCycles: 3,
    stopped: false,
    timer: null,
    instances: []
  };

  // Inicializar cada carrusel de Nosotros
  nosotrosCarousels.forEach((carousel) => {
    const track = carousel.querySelector('.carousel-track');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    const slides = Array.from(track.children);
    const total = slides.length;

    if (total <= 1) return;

    // Crear dots
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Foto ${i + 1}`);
      dot.addEventListener('click', () => syncGoTo(i));
      dotsContainer.appendChild(dot);
    }

    const dots = Array.from(dotsContainer.children);
    const inst = { track, dots, total, carousel };
    sync.instances.push(inst);
    if (total > sync.total) sync.total = total;

    // Touch / swipe
    let startX = 0, deltaX = 0, isDragging = false, localCurrent = 0;

    inst.getLocal = () => localCurrent;
    inst.setLocal = (v) => { localCurrent = v; };

    carousel.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].clientX;
      deltaX = 0;
      localCurrent = sync.current;
      track.style.transition = 'none';
    }, { passive: true });

    carousel.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      deltaX = e.touches[0].clientX - startX;
      const offset = -(localCurrent * 100) + (deltaX / carousel.offsetWidth) * 100;
      track.style.transform = `translateX(${offset}%)`;
    }, { passive: true });

    carousel.addEventListener('touchend', () => {
      isDragging = false;
      track.style.transition = '';

      const threshold = carousel.offsetWidth * 0.2;

      if (deltaX < -threshold && sync.current < sync.total - 1) {
        syncGoTo(sync.current + 1);
      } else if (deltaX > threshold && sync.current > 0) {
        syncGoTo(sync.current - 1);
      } else {
        syncGoTo(sync.current);
      }
    });
  });

  // Ir a una slide en todos los carruseles de Nosotros
  function syncGoTo(index) {
    if (index < 0) index = 0;
    if (index >= sync.total) index = sync.total - 1;
    sync.current = index;

    sync.instances.forEach((inst) => {
      const clamped = Math.min(index, inst.total - 1);
      inst.track.style.transform = `translateX(-${clamped * 100}%)`;
      inst.dots.forEach((d, i) => d.classList.toggle('active', i === clamped));
    });
  }

  // Avance automático sincronizado con conteo de ciclos
  function syncNext() {
    if (sync.stopped) return;
    const nextIndex = sync.current + 1;

    if (nextIndex >= sync.total) {
      sync.cycles++;

      if (sync.cycles >= sync.maxCycles) {
        syncGoTo(sync.total - 1);
        clearInterval(sync.timer);
        sync.stopped = true;
        return;
      }

      syncGoTo(0);
    } else {
      syncGoTo(nextIndex);
    }
  }

  if (sync.instances.length > 0 && sync.total > 1) {
    sync.timer = setInterval(syncNext, 4500);
  }

  /* ── Carruseles normales (fuera de Nosotros) ───────────── */
  carousels.forEach((carousel) => {
    if (nosotrosCarousels.includes(carousel)) return;

    const track = carousel.querySelector('.carousel-track');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    const slides = Array.from(track.children);
    const total = slides.length;

    if (total <= 1) return;

    let current = 0;
    let startX = 0;
    let deltaX = 0;
    let isDragging = false;
    let autoplayTimer = null;

    // Crear dots
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Foto ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }

    const dots = Array.from(dotsContainer.children);

    function goTo(index) {
      current = ((index % total) + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
      resetAutoplay();
    }

    function next() {
      goTo(current + 1);
    }

    function startAutoplay() {
      autoplayTimer = setInterval(next, 4500);
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }

    startAutoplay();

    // Touch / swipe
    carousel.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].clientX;
      deltaX = 0;
      track.style.transition = 'none';
    }, { passive: true });

    carousel.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      deltaX = e.touches[0].clientX - startX;
      const offset = -(current * 100) + (deltaX / carousel.offsetWidth) * 100;
      track.style.transform = `translateX(${offset}%)`;
    }, { passive: true });

    carousel.addEventListener('touchend', () => {
      isDragging = false;
      track.style.transition = '';

      const threshold = carousel.offsetWidth * 0.2;

      if (deltaX < -threshold && current < total - 1) {
        goTo(current + 1);
      } else if (deltaX > threshold && current > 0) {
        goTo(current - 1);
      } else {
        goTo(current);
      }
    });
  });


  /* ─────────────────────────────────────
     3. SCROLL ANIMATIONS — Fade-in
     ───────────────────────────────────── */
  const fadeElements = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    fadeElements.forEach((el) => observer.observe(el));
  } else {
    fadeElements.forEach((el) => el.classList.add('visible'));
  }


  /* ─────────────────────────────────────
     4. FORMULARIO ÚNICO — Envío de todo
     ───────────────────────────────────── */

  const ENDPOINTS = {
    rsvp: 'https://script.google.com/macros/s/AKfycbyg_D0_eOHtUEfdCDzevl3J_y775Wf1c5_Ql3H5aWTPDvOQuYfaw6d-OQBDFarxm4bL/exec',
  };

  /**
   * Enviar datos a Google Apps Script
   * usando un iframe oculto + formulario real.
   */
  function submitToSheet(endpoint, payload) {
    return new Promise((resolve, reject) => {
      // Modo demo
      if (endpoint.includes('YOUR_')) {
        console.log('📋 Datos del formulario (modo demo):', payload);
        setTimeout(resolve, 800);
        return;
      }

      try {
        // Crear iframe oculto
        const iframeName = 'rsvp-iframe-' + Date.now();
        const iframe = document.createElement('iframe');
        iframe.name = iframeName;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        // Crear formulario real que apunte al iframe
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = endpoint;
        form.target = iframeName;
        form.style.display = 'none';

        // Añadir cada campo como input hidden
        for (const [key, value] of Object.entries(payload)) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        }

        document.body.appendChild(form);

        // Cuando el iframe cargue, limpiamos
        iframe.addEventListener('load', () => {
          setTimeout(() => {
            document.body.removeChild(form);
            document.body.removeChild(iframe);
            resolve({ result: 'ok' });
          }, 500);
        });

        // Timeout de seguridad (10 segundos)
        setTimeout(() => {
          try {
            document.body.removeChild(form);
            document.body.removeChild(iframe);
          } catch (e) {
            /* ya eliminados */
          }
          resolve({ result: 'ok' });
        }, 10000);

        // Enviar el formulario
        form.submit();
      } catch (err) {
        reject(err);
      }
    });
  }

  function showStatus(el, message, type) {
    el.textContent = message;
    el.className = 'form-status form-status--' + type;
  }

  // ─── Formulario RSVP + Canciones ───
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpStatus = document.getElementById('rsvpStatus');
  const songsTextarea = document.getElementById('song-list');
  const guestsSelect = document.getElementById('rsvp-guests');
  const guestsCustomField = document.getElementById('rsvp-guests-custom');
  const guestCustomGroup = document.getElementById('guest-custom-group');
  const meatCount = document.getElementById('meat-count');
  const fishCount = document.getElementById('fish-count');
  const meatInput = document.getElementById('menu-carne-input');
  const fishInput = document.getElementById('menu-pescado-input');
  const menuTotal = document.getElementById('menuTotal');

  const menuState = {
    meat: 0,
    fish: 0,
  };

  // Total real de asistentes, sin límite máximo de 6
  function getTotalGuests() {
    if (!guestsSelect) return 1;

    // value="5" = +5 acompañantes o más
    if (guestsSelect.value === '5') {
      const customValue = Number(guestsCustomField?.value);

      return Number.isInteger(customValue) && customValue >= 6
        ? customValue
        : 6;
    }

    return Number(guestsSelect.value || 0) + 1;
  }

  // Mostrar campo de cantidad personalizada
  function updateGuestCustomVisibility() {
    if (!guestCustomGroup || !guestsSelect) return;

    const shouldShow = guestsSelect.value === '5';

    guestCustomGroup.classList.toggle('visible', shouldShow);
    guestCustomGroup.style.display = shouldShow ? 'flex' : 'none';

    if (shouldShow && guestsCustomField && !guestsCustomField.value) {
      guestsCustomField.value = '6';
    }
  }

  // Controlar botones + y -
  function updateMenuButtonsState() {
    const totalGuests = getTotalGuests();
    const totalSelected = menuState.meat + menuState.fish;

    document.querySelectorAll('.menu-stepper-btn').forEach((button) => {
      const parentType = button.closest('.menu-stepper')?.dataset.menuType;
      if (!parentType) return;

      const isIncrease = button.dataset.action === 'increase';

      if (isIncrease) {
        button.disabled = totalSelected >= totalGuests;
      } else {
        button.disabled = menuState[parentType] <= 0;
      }
    });
  }

  // Actualizar menús y resumen sin mostrar "Restan"
  function updateMenuOptions() {
    if (!guestsSelect || !menuTotal) return;

    const totalGuests = getTotalGuests();
    const existingTotal = menuState.meat + menuState.fish;

    // Si se reducen los comensales, ajustar menús
    if (existingTotal > totalGuests) {
      const overflow = existingTotal - totalGuests;

      if (menuState.fish >= overflow) {
        menuState.fish -= overflow;
      } else {
        menuState.meat -= overflow - menuState.fish;
        menuState.fish = 0;
      }
    }

    if (meatCount) meatCount.textContent = String(menuState.meat);
    if (fishCount) fishCount.textContent = String(menuState.fish);
    if (meatInput) meatInput.value = String(menuState.meat);
    if (fishInput) fishInput.value = String(menuState.fish);

    menuTotal.textContent =
      `Total de comensales: ${totalGuests} · Carnes: ${menuState.meat} · Pescados: ${menuState.fish}`;

    updateMenuButtonsState();
  }

  // Detectar cambios en número de acompañantes
  if (guestsSelect) {
    guestsSelect.addEventListener('change', () => {
      updateGuestCustomVisibility();
      updateMenuOptions();
    });
  }

  // Detectar cambios en número personalizado
  if (guestsCustomField) {
    guestsCustomField.addEventListener('input', updateMenuOptions);
  }

  updateGuestCustomVisibility();

  // Contadores de carne y pescado
  document.querySelectorAll('.menu-stepper-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const parentType = button.closest('.menu-stepper')?.dataset.menuType;
      if (!parentType) return;

      const isIncrease = button.dataset.action === 'increase';
      const totalGuests = getTotalGuests();
      const currentValue = menuState[parentType];

      if (isIncrease) {
        if (menuState.meat + menuState.fish >= totalGuests) return;
        menuState[parentType] += 1;
      } else {
        if (currentValue <= 0) return;
        menuState[parentType] -= 1;
      }

      if (meatCount) meatCount.textContent = String(menuState.meat);
      if (fishCount) fishCount.textContent = String(menuState.fish);
      if (meatInput) meatInput.value = String(menuState.meat);
      if (fishInput) fishInput.value = String(menuState.fish);

      updateMenuOptions();
    });
  });

  updateMenuOptions();

  // ─── Envío de confirmación de asistencia ───
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fd = new FormData(rsvpForm);

      const totalGuests = getTotalGuests();
      const meatMenus = Number(fd.get('menu_carne') || 0);
      const fishMenus = Number(fd.get('menu_pescado') || 0);
      const selectedGuests = Number(fd.get('acompanantes') || 0);
      const customGuestCount = Number(fd.get('acompanantes_custom') || 0);

      const companionCount = selectedGuests === 5
        ? getTotalGuests() - 1
        : selectedGuests;

      const payload = {
        nombre: fd.get('nombre')?.trim() || 'Anónimo',
        asiste: fd.get('asiste') || 'Sin respuesta',
        acompanantes: String(companionCount),
        total_comensales: String(totalGuests),
        menu_carne: String(meatMenus),
        menu_pescado: String(fishMenus),
        alergias: fd.get('alergias')?.trim() || 'Ninguna',
        info_extra: fd.get('info_extra')?.trim() || '',
        canciones: songsTextarea ? songsTextarea.value.trim() : '',
        timestamp: new Date().toISOString(),
      };

      // Comprobar confirmación de asistencia
      if (!fd.get('asiste')) {
        showStatus(
          rsvpStatus,
          'Por favor, indica si asistirás.',
          'error'
        );
        return;
      }

      // Validar comensales personalizados
      if (
        fd.get('asiste') === 'sí' &&
        selectedGuests === 5 &&
        (!Number.isInteger(customGuestCount) || customGuestCount < 6)
      ) {
        showStatus(
          rsvpStatus,
          'Indica un número total de comensales válido (6 o más).',
          'error'
        );
        return;
      }

      // Exigir un menú por comensal
      if (
        fd.get('asiste') === 'sí' &&
        meatMenus + fishMenus !== totalGuests
      ) {
        showStatus(
          rsvpStatus,
          'Debes indicar un menú para cada comensal.',
          'error'
        );
        return;
      }

      showStatus(rsvpStatus, 'Enviando…', 'sending');

      try {
        await submitToSheet(ENDPOINTS.rsvp, payload);

        showStatus(
          rsvpStatus,
          '¡Gracias! Tu respuesta ha sido recibida. ♥',
          'success'
        );

        rsvpForm.reset();

        if (songsTextarea) songsTextarea.value = '';

        menuState.meat = 0;
        menuState.fish = 0;

        updateGuestCustomVisibility();
        updateMenuOptions();

      } catch (err) {
        console.error('Error al enviar:', err);

        showStatus(
          rsvpStatus,
          'No se pudo enviar. Inténtalo de nuevo más tarde.',
          'error'
        );
      }
    });
  }


  /* ─────────────────────────────────────
     5. SMOOTH SCROLL — Click en scroll hint
     ───────────────────────────────────── */
  const scrollHint = document.querySelector('.scroll-hint');

  if (scrollHint) {
    scrollHint.addEventListener('click', () => {
      const nextSection = document.querySelector('.hero + *');

      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    });

    scrollHint.style.cursor = 'pointer';
  }


  /* ─────────────────────────────────────
     6. PARALLAX SUTIL — Esquinas del hero
     ───────────────────────────────────── */
  const hero = document.getElementById('hero');
  const corners = document.querySelectorAll('.corner-ornament');

  if (
    hero &&
    corners.length > 0 &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    const cornerData = Array.from(corners).map((c) => {
      const flip = c.classList.contains('corner-tr') ? 'scaleX(-1)'
        : c.classList.contains('corner-bl') ? 'scaleY(-1)'
        : c.classList.contains('corner-br') ? 'scale(-1)'
        : '';

      const direction =
        c.classList.contains('corner-tl') ||
        c.classList.contains('corner-tr') ? 1 : -1;

      return { el: c, flip, direction };
    });

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroH = hero.offsetHeight;

          if (scrollY < heroH) {
            const factor = scrollY * 0.04;

            cornerData.forEach(({ el, flip, direction }) => {
              el.style.transform =
                `${flip} translateY(${factor * direction}px)`.trim();
            });
          }

          ticking = false;
        });

        ticking = true;
      }
    });
  }

})();

/* Vanilla adaptations of the supplied Originkit chat/reveal and Tilt references. */
(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('.feature-back').forEach(link => {
    link.addEventListener('click', event => {
      const previousPage = document.referrer;
      if (!previousPage || window.history.length < 2) return;
      try {
        if (new URL(previousPage).origin !== window.location.origin) return;
      } catch (_) { return; }
      event.preventDefault();
      try { window.sessionStorage.setItem('portfolio-return-internal', '1'); } catch (_) { }
      window.history.back();
    });
  });

  window.addEventListener('pageshow', event => {
    if (!event.persisted) return;
    try { window.sessionStorage.removeItem('portfolio-return-internal'); } catch (_) { }
  });

  document.querySelectorAll('[data-slider]').forEach(shell => {
    const type = shell.dataset.slider;
    const element = shell.querySelector('.swiper');
    const slides = [...element.querySelectorAll('.swiper-slide')];
    const requested = new URLSearchParams(window.location.search).get('proyecto');
    const initialSlide = type === 'projects' ? Math.max(0, slides.findIndex(s => s.dataset.project === requested)) : 0;
    const config = {
      initialSlide, speed: reduced.matches ? 0 : 950, spaceBetween: 24,
      slidesPerView: 1, rewind: type !== 'history', watchOverflow: true,
      autoHeight: type === 'projects',
      autoplay: reduced.matches ? false : { delay: type === 'history' ? 8500 : 7500, disableOnInteraction: true, pauseOnMouseEnter: true, stopOnLastSlide: type === 'history' },
      navigation: { prevEl: shell.querySelector('.slider-prev'), nextEl: shell.querySelector('.slider-next') },
      pagination: { el: shell.querySelector('.slider-pagination'), clickable: true,
        renderBullet: (i, className) => `<button type="button" class="${className}" aria-label="Ir a ${slides[i]?.querySelector('h2,h3')?.textContent || ('diapositiva ' + (i+1))}"></button>` },
      a11y: { enabled: true, prevSlideMessage: 'Anterior', nextSlideMessage: 'Siguiente', slideLabelMessage: '{{index}} de {{slidesLength}}', containerRoleDescriptionMessage: 'Carrusel' }
    };
    if (type === 'history') config.breakpoints = { 0: { slidesPerView: 1.08 }, 768: { slidesPerView: 2 }, 1400: { slidesPerView: 3 } };
    if (type === 'templates') config.breakpoints = { 0: { slidesPerView: 1 }, 768: { slidesPerView: 1.3 }, 1400: { slidesPerView: 1.45 } };
    const swiper = new Swiper(element, config);
    const updateSlideAccess = () => {
      const visibleCount = Math.ceil(Number(swiper.params.slidesPerView));
      slides.forEach((slide, i) => {
        const hidden = i < swiper.activeIndex || i >= swiper.activeIndex + visibleCount;
        slide.inert = hidden;
        slide.setAttribute('aria-hidden', String(hidden));
      });
    };
    swiper.on('slideChange', updateSlideAccess);
    swiper.on('resize', updateSlideAccess);
    updateSlideAccess();
    const pause = shell.querySelector('.slider-pause');
    const updatePause = () => {
      const stopped = !swiper.autoplay.running;
      pause.setAttribute('aria-pressed', String(stopped));
      pause.setAttribute('aria-label', stopped ? 'Reproducir automáticamente' : 'Pausar reproducción automática');
      pause.innerHTML = `<i class="bi bi-${stopped ? 'play' : 'pause'}-fill" aria-hidden="true"></i>`;
    };
    pause.addEventListener('click', () => {
      if (swiper.autoplay.running) swiper.autoplay.stop();
      else { if (type === 'history' && swiper.isEnd) swiper.slideTo(0); swiper.autoplay.start(); }
      updatePause();
    });
    swiper.on('autoplayStart', updatePause);
    swiper.on('autoplayStop', updatePause);
    shell.addEventListener('focusin', event => { if (event.target !== pause) swiper.autoplay.stop(); });
    shell.addEventListener('keydown', event => {
      if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
      event.preventDefault(); swiper.autoplay.stop();
      event.key === 'ArrowLeft' ? swiper.slidePrev() : swiper.slideNext();
    });
    reduced.addEventListener('change', () => { swiper.params.speed = reduced.matches ? 0 : 950; if (reduced.matches) swiper.autoplay.stop(); });
    // Offscreen carousels wait for the reader instead of reaching the end unseen.
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { if (!reduced.matches && !shell.dataset.seen) swiper.autoplay.start(); shell.dataset.seen = 'true'; }
      else swiper.autoplay.stop();
      updatePause();
    }, { threshold: .25 });
    observer.observe(shell);
    swiper.autoplay.stop(); updatePause();
  });

  document.querySelectorAll('.isotope-filters [role="button"]').forEach(filter => {
    filter.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); filter.click(); } });
  });

  document.querySelectorAll('.education-panel').forEach(panel => {
    const summary = panel.querySelector('summary');
    summary.addEventListener('click', event => {
      event.preventDefault();
      if (!panel.open) {
        panel.classList.remove('education-closing');
        panel.open = true;
        return;
      }
      panel.classList.add('education-closing');
      window.setTimeout(() => {
        panel.open = false;
        panel.classList.remove('education-closing');
      }, reduced.matches ? 0 : 600);
    });
  });

  const story = document.querySelector('.booking-section');
  if (story) {
    const play = () => {
      if (reduced.matches) return;
      story.classList.add('story-ready'); story.classList.remove('story-playing');
      void story.offsetWidth;
      story.classList.add('story-playing');
    };
    if (!reduced.matches) {
      story.classList.add('story-ready');
      const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { play(); observer.disconnect(); }
      }, { threshold: .25 });
      observer.observe(story.querySelector('.booking-story'));
    }
    story.querySelector('.story-replay').addEventListener('click', play);
  }

  document.querySelectorAll('[data-tilt]').forEach(frame => {
    const card = frame.querySelector('.portrait-card');
    const sheen = frame.querySelector('.portrait-sheen');
    const current = [0, 0, 0], target = [0, 0, 0], velocity = [0, 0, 0];
    let raf = 0, previous = 0;
    const tick = time => {
      const dt = previous ? Math.min((time - previous) / 16.67, 2.5) : 1;
      previous = time;
      let moving = false;
      for (let i = 0; i < 3; i++) {
        velocity[i] += (target[i] - current[i]) * .16 * dt;
        velocity[i] *= Math.pow(.72, dt);
        current[i] += velocity[i] * dt;
        if (Math.abs(target[i] - current[i]) > .001 || Math.abs(velocity[i]) > .001) moving = true;
        else current[i] = target[i];
      }
      const [x, y, light] = current;
      card.style.transform = `translateZ(${-14 * light}px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg)`;
      card.style.boxShadow = `0 ${20-11*light}px ${44-20*light}px -8px rgba(15,23,42,${.22-.07*light})`;
      sheen.style.backgroundImage = `radial-gradient(42% 34% at ${(x+1)*50}% ${(y+1)*50}%,rgba(9,14,28,${.33*light}),transparent),radial-gradient(52% 42% at ${(1-x)*50}% ${(1-y)*50}%,rgba(255,255,255,${.2*light}),transparent)`;
      if (moving) raf = requestAnimationFrame(tick);
      else { raf = 0; previous = 0; }
    };
    const start = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const reset = () => { target.fill(0); start(); };
    frame.addEventListener('pointermove', event => {
      if (reduced.matches) return;
      const rect = frame.getBoundingClientRect();
      target[0] = Math.max(-1,Math.min(1,(event.clientX-rect.left)/rect.width*2-1));
      target[1] = Math.max(-1,Math.min(1,(event.clientY-rect.top)/rect.height*2-1));
      target[2] = 1; start();
    });
    frame.addEventListener('pointerleave', reset);
    frame.addEventListener('pointercancel', reset);
    frame.addEventListener('pointerup', event => { if (event.pointerType !== 'mouse') reset(); });
    reduced.addEventListener('change', reset);
  });
})();

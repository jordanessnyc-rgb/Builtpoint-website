/* BuiltPoint — site behaviour */
(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* Header: solid once scrolled past the hero */
  const header = $('.site-header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-solid', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile menu */
  const burger = $('.burger');
  if (burger) {
    burger.addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) burger.click();
    });
    $$('.menu__links a').forEach((a) => a.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
      burger.setAttribute('aria-expanded', 'false');
    }));
  }

  /* Scroll reveal */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* Count-up stats */
  const counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const target = parseFloat(el.dataset.count);
        const dur = 1400;
        const start = performance.now();
        const step = (t) => {
          const p = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString();
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach((el) => cio.observe(el));
  }

  /* Project filters */
  const filters = $$('.filters button');
  if (filters.length) {
    filters.forEach((btn) => btn.addEventListener('click', () => {
      filters.forEach((b) => b.classList.toggle('is-active', b === btn));
      const f = btn.dataset.filter;
      $$('.project[data-type]').forEach((p) => {
        p.classList.toggle('is-hidden', f !== 'all' && p.dataset.type !== f);
      });
    }));
  }

  /* Team member modal */
  const modal = $('#member-modal');
  if (modal) {
    const photo = $('.modal__photo img', modal);
    const name = $('.modal__name', modal);
    const role = $('.modal__role', modal);
    const bio = $('.modal__bio', modal);
    let lastFocus = null;
    const close = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };
    $$('.member').forEach((m) => m.addEventListener('click', () => {
      lastFocus = m;
      photo.src = $('img', m).src;
      photo.alt = m.dataset.name;
      name.textContent = m.dataset.name;
      role.textContent = m.dataset.role;
      bio.textContent = m.dataset.bio || '';
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      $('.modal__close', modal).focus();
    }));
    $('.modal__close', modal).addEventListener('click', close);
    $('.modal__backdrop', modal).addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('is-open')) close(); });
  }

  /* Forms: progressive enhancement. Point the form's action at Formspree,
     Netlify Forms, Basin, etc. and remove data-demo to submit for real. */
  $$('form[data-demo]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = $('.form__status', form) || form.nextElementSibling;
      if (status && status.classList.contains('form__status')) {
        status.textContent = form.dataset.success || 'Thanks — we’ll be in touch shortly.';
        status.classList.add('is-visible');
      }
      form.reset();
    });
  });

  /* Footer year */
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();

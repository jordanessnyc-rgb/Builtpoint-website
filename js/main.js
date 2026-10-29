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

  /* Forms ----------------------------------------------------------------
     Submissions are sent as JSON to FORM_ENDPOINT. Works with Web3Forms
     (set FORM_KEY to the access key) or Formspree (set FORM_ENDPOINT to the
     form's URL and leave FORM_KEY empty). While FORM_ENDPOINT is empty the
     forms run in demo mode and only show their success message. */
  const FORM_ENDPOINT = 'https://api.web3forms.com/submit';
  const FORM_KEY = '';

  $$('form[data-form]').forEach((form) => {
    const status = $('.form__status', form) || form.nextElementSibling;
    const button = $('button[type="submit"]', form);
    const show = (text, isError) => {
      if (!status || !status.classList.contains('form__status')) return;
      status.textContent = text;
      status.classList.toggle('is-error', !!isError);
      status.classList.add('is-visible');
    };
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if ($('[name="botcheck"]', form)?.checked) return; // honeypot
      const live = FORM_ENDPOINT && (FORM_KEY || !FORM_ENDPOINT.includes('web3forms'));
      if (!live) {
        console.warn('Form submission not configured: set FORM_ENDPOINT / FORM_KEY in js/main.js');
        show(form.dataset.success || 'Thanks. We’ll be in touch shortly.');
        form.reset();
        return;
      }
      const data = {};
      new FormData(form).forEach((v, k) => { data[k] = data[k] ? data[k] + ', ' + v : v; });
      delete data.botcheck;
      if (FORM_KEY) data.access_key = FORM_KEY;
      data.subject = form.dataset.subject || 'New website submission';
      data.from_name = 'BuiltPoint website';
      const label = button ? button.innerHTML : '';
      if (button) { button.disabled = true; button.textContent = 'Sending…'; }
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        });
        const json = await res.json().catch(() => ({}));
        if (res.ok && json.success !== false) {
          show(form.dataset.success || 'Thanks. We’ll be in touch shortly.');
          form.reset();
        } else {
          show(json.message || 'Something went wrong. Please email us at hello@builtpointconstruction.com.', true);
        }
      } catch (err) {
        show('We couldn’t send your message. Please email us at hello@builtpointconstruction.com.', true);
      } finally {
        if (button) { button.disabled = false; button.innerHTML = label; }
      }
    });
  });

  /* Footer year */
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();

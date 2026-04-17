/* =====================================================
   TIMELESS TRIPS — main.js v5
   Fixes: mobile dropdown, email+WA form, all interactions
   ===================================================== */
(function () {
  'use strict';

  /* ─── 1. Sticky header ───────────────────────────── */
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ─── 2. Desktop Dropdown (hover + bridge) ───────── */
  function initDesktopDropdowns() {
    document.querySelectorAll('.has-dropdown').forEach(item => {
      let timer;
      const dd = item.querySelector('.dropdown');
      const open  = () => { clearTimeout(timer); document.querySelectorAll('.has-dropdown.open').forEach(el => { if (el !== item) el.classList.remove('open'); }); item.classList.add('open'); };
      const close = () => { timer = setTimeout(() => item.classList.remove('open'), 120); };
      item.addEventListener('mouseenter', open);
      item.addEventListener('mouseleave', close);
      if (dd) {
        dd.addEventListener('mouseenter', () => clearTimeout(timer));
        dd.addEventListener('mouseleave', close);
      }
    });
  }

  /* ─── 3. Mobile Nav ──────────────────────────────── */
  const navToggle = document.getElementById('nav-toggle');
  const mainNav   = document.getElementById('main-nav');

  function closeNav() {
    if (!mainNav) return;
    mainNav.classList.remove('open');
    if (navToggle) { navToggle.classList.remove('open'); navToggle.setAttribute('aria-expanded','false'); }
    document.body.style.overflow = '';
    // Close all submenus too
    document.querySelectorAll('.has-dropdown.open').forEach(el => el.classList.remove('open'));
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    document.addEventListener('click', e => { if (!navToggle.contains(e.target) && !mainNav.contains(e.target)) closeNav(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

    // Mobile accordion — dropdown trigger click
    mainNav.querySelectorAll('.dropdown-trigger').forEach(trigger => {
      trigger.addEventListener('click', e => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          e.stopPropagation();
          const parent = trigger.closest('.has-dropdown');
          const isOpen = parent.classList.contains('open');
          // Close all others
          document.querySelectorAll('.has-dropdown.open').forEach(el => { if (el !== parent) el.classList.remove('open'); });
          parent.classList.toggle('open', !isOpen);
        }
      });
    });

    // Close nav on non-dropdown leaf link click (mobile)
    mainNav.querySelectorAll('a:not(.dropdown-trigger)').forEach(link => {
      link.addEventListener('click', () => { if (window.innerWidth <= 768) closeNav(); });
    });
  }

  // Init desktop dropdowns on load
  function handleViewport() {
    if (window.innerWidth > 768) initDesktopDropdowns();
  }
  handleViewport();
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) { document.body.style.overflow = ''; }
    handleViewport();
  }, { passive: true });

  /* ─── 4. Active nav link ─────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-list > li > a:not(.nav-book-btn):not(.nav-call-btn)').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });

  /* ─── 5. Scroll Reveal ───────────────────────────── */
  const revealEls = document.querySelectorAll(
    '.pkg-card,.cat-card,.why-card,.testi-card,.how-step,.gal-item,.value-card,.reveal'
  );
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const idx = [...revealEls].indexOf(entry.target);
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          entry.target.classList.add('visible');
        }, (idx % 4) * 80);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
    revealEls.forEach(el => {
      if (el.classList.contains('visible')) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity .6s ease, transform .6s ease';
      io.observe(el);
    });
  }

  /* ─── 6. Lightbox ────────────────────────────────── */
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = '<button class="lb-close" aria-label="Close">&times;</button><img src="" alt="" />';
  document.body.appendChild(lb);
  const lbImg = lb.querySelector('img');

  const openLightbox = (src, alt) => { lbImg.src = src; lbImg.alt = alt||''; lb.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeLightbox = () => { lb.classList.remove('open'); document.body.style.overflow = ''; setTimeout(() => lbImg.src='', 300); };

  lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && lb.classList.contains('open')) closeLightbox(); });
  document.querySelectorAll('.gal-item img, .pkg-gallery-thumbs img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });

  /* ─── 7. Toast ───────────────────────────────────── */
  let toastEl, toastTimer;
  function showToast(msg, type = 'info', ms = 5000) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; document.body.appendChild(toastEl); }
    const colors = { success:'#0d7377', error:'#c0392b', info:'#1a1a18' };
    toastEl.style.borderLeftColor = colors[type] || colors.info;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), ms);
  }

  /* ─── 8. Form → WhatsApp + Email ─────────────────── */
  /*
    EMAIL SETUP (free, 200/month):
    1. Create account at emailjs.com
    2. Connect Gmail (info@timelesstrips.in) as Email Service
    3. Create template with fields: from_name, from_mobile, package_name,
       travel_date, pax_count, message, to_email
    4. Replace the 3 placeholders below with your actual IDs
  */
  const EMAILJS_SERVICE  = 'YOUR_SERVICE_ID';
  const EMAILJS_TEMPLATE = 'YOUR_TEMPLATE_ID';
  const EMAILJS_KEY      = 'YOUR_PUBLIC_KEY';
  const EMAIL_ON         = EMAILJS_SERVICE !== 'YOUR_SERVICE_ID';

  if (EMAIL_ON) {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    s.onload = () => window.emailjs && emailjs.init({ publicKey: EMAILJS_KEY });
    document.head.appendChild(s);
  }

  document.querySelectorAll('.enquiry-form').forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const g = n => (form.querySelector(`[name="${n}"]`)?.value || '').trim();
      const name = g('name'), mobile = g('mobile'), pkg = g('package') || 'a package';
      const dates = g('dates'), pax = g('pax'), message = g('message');

      if (!name)   { showToast('⚠️ Please enter your name.', 'error'); return; }
      const cleanMobile = mobile.replace(/[\s+\-()]/g,'');
      if (!cleanMobile || !/^[6-9]\d{9}$/.test(cleanMobile)) {
        showToast('⚠️ Enter a valid 10-digit Indian mobile number.', 'error'); return;
      }

      const btn = form.querySelector('[type="submit"]');
      const origHTML = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '&#8987; Sending…';

      // Build WA message
      let waMsg = `Hi! I'm *${name}* and I'm interested in *${pkg}*.`;
      if (dates)   waMsg += ` Travel date: ${dates}.`;
      if (pax)     waMsg += ` Travellers: ${pax}.`;
      if (message) waMsg += ` Note: ${message}.`;
      waMsg += ` My number: ${mobile}. Please share details and pricing.`;

      // 1. Open WhatsApp
      window.open(`https://api.whatsapp.com/send/?phone=918396000504&text=${encodeURIComponent(waMsg)}`, '_blank', 'noopener,noreferrer');

      // 2. Email if configured
      if (EMAIL_ON && window.emailjs) {
        try {
          await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
            from_name: name, from_mobile: mobile, package_name: pkg,
            travel_date: dates || 'Not specified', pax_count: pax || 'Not specified',
            message: message || 'None', to_email: 'info@timelesstrips.in'
          });
          showToast('✅ WhatsApp opened & email sent!', 'success');
        } catch (err) {
          showToast('✅ WhatsApp opened — we respond in minutes!', 'success');
        }
      } else {
        showToast('✅ WhatsApp opened — we respond in minutes!', 'success');
      }

      setTimeout(() => { btn.disabled = false; btn.innerHTML = origHTML; }, 3000);
    });
  });

  /* ─── 9. Smooth anchor scroll ────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 84, behavior: 'smooth' });
      }
    });
  });

  /* ─── 10. Stat counter ───────────────────────────── */
  document.querySelectorAll('.stat-num').forEach(el => {
    const raw = el.textContent.trim();
    const match = raw.match(/[\d,]+/);
    if (!match) return;
    const target = parseInt(match[0].replace(/,/g,''), 10);
    const suffix = raw.replace(match[0], '');
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      let cur = 0; const step = Math.ceil(target/55);
      const t = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = cur.toLocaleString('en-IN') + suffix;
        if (cur >= target) clearInterval(t);
      }, 28);
      io.unobserve(el);
    }, { threshold: 0.5 });
    io.observe(el);
  });

  /* ─── 11. Readonly inputs styling ─────────────────── */
  document.querySelectorAll('input[readonly]').forEach(inp => {
    inp.style.background = 'var(--warm-bg)';
    inp.style.cursor = 'default';
    inp.style.color = 'var(--muted)';
  });

})();

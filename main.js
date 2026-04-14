/* =====================================================
   TIMELESS TRIPS — main.js v4
   Fixes: dropdown hover gap, email + WhatsApp form,
   scroll reveal, lightbox, stat counters
   Email via EmailJS (free) → info.frenzyowl@gmail.com
   ===================================================== */
(function () {
  'use strict';

  /* ─── 1. Sticky header shadow ─────────────────────── */
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ─── 2. Desktop Dropdowns (hover with safe bridge) ── */
  function initDesktopDropdowns() {
    document.querySelectorAll('.has-dropdown').forEach(item => {
      let closeTimer;

      const openMenu = () => {
        clearTimeout(closeTimer);
        document.querySelectorAll('.has-dropdown.open').forEach(el => {
          if (el !== item) el.classList.remove('open');
        });
        item.classList.add('open');
      };

      const closeMenu = () => {
        closeTimer = setTimeout(() => item.classList.remove('open'), 120);
      };

      item.addEventListener('mouseenter', openMenu);
      item.addEventListener('mouseleave', closeMenu);

      const dd = item.querySelector('.dropdown');
      if (dd) {
        dd.addEventListener('mouseenter', () => clearTimeout(closeTimer));
        dd.addEventListener('mouseleave', closeMenu);
      }
    });
  }

  /* ─── 3. Mobile Nav ───────────────────────────────── */
  const navToggle = document.getElementById('nav-toggle');
  const mainNav   = document.getElementById('main-nav');

  function closeNav() {
    if (!mainNav) return;
    mainNav.classList.remove('open');
    if (navToggle) {
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    document.addEventListener('click', e => {
      if (!navToggle.contains(e.target) && !mainNav.contains(e.target)) closeNav();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

    // Mobile accordion dropdowns
    document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
      trigger.addEventListener('click', e => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          const parent = trigger.closest('.has-dropdown');
          document.querySelectorAll('.has-dropdown.open').forEach(el => {
            if (el !== parent) el.classList.remove('open');
          });
          parent.classList.toggle('open');
        }
      });
    });

    mainNav.querySelectorAll('a:not(.dropdown-trigger)').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) closeNav();
      });
    });
  }

  // Init desktop dropdowns on load; re-run on resize
  function handleViewport() {
    if (window.innerWidth > 768) initDesktopDropdowns();
  }
  handleViewport();
  window.addEventListener('resize', handleViewport, { passive: true });

  /* ─── 4. Active nav link ──────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-list > li > a:not(.nav-book-btn):not(.nav-call-btn)').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });

  /* ─── 5. Scroll Reveal ────────────────────────────── */
  const revealEls = document.querySelectorAll(
    '.pkg-card, .cat-card, .why-card, .testi-card, .how-step, .gal-item, .value-card, .reveal'
  );
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const idx = [...revealEls].indexOf(entry.target);
        setTimeout(() => {
          entry.target.style.opacity  = '1';
          entry.target.style.transform = 'translateY(0)';
          entry.target.classList.add('visible');
        }, (idx % 4) * 90);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

    revealEls.forEach(el => {
      if (el.classList.contains('visible')) return;
      el.style.opacity   = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = 'opacity .6s ease, transform .6s ease';
      io.observe(el);
    });
  }

  /* ─── 6. Lightbox ─────────────────────────────────── */
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = '<button class="lb-close" aria-label="Close image">&times;</button><img src="" alt="" />';
  document.body.appendChild(lb);
  const lbImg = lb.querySelector('img');
  const lbClose = lb.querySelector('.lb-close');

  function openLightbox(src, alt) {
    lbImg.src = src; lbImg.alt = alt || '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 300);
  }

  lbClose.addEventListener('click', closeLightbox);
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lb.classList.contains('open')) closeLightbox();
  });

  document.querySelectorAll('.gal-item img, .pkg-gallery-thumbs img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });

  /* ─── 7. Toast notification ───────────────────────── */
  let toastEl = null;
  let toastTimer = null;

  function showToast(msg, type = 'info', ms = 5000) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      document.body.appendChild(toastEl);
    }
    const colours = { success: '#0d7377', error: '#c0392b', info: '#1a1a18' };
    toastEl.style.borderLeftColor = colours[type] || colours.info;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), ms);
  }

  /* ─── 8. Form → WhatsApp + Email ──────────────────── */
  /*
     Email is sent via EmailJS (https://www.emailjs.com — free tier: 200 emails/month).
     HOW TO ACTIVATE EMAIL:
     1. Create free account at emailjs.com
     2. Connect Gmail (info.frenzyowl@gmail.com) as email service
     3. Create an email template — note your: SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY
     4. Replace the three placeholder strings below with your actual IDs
     Until configured, the form still sends via WhatsApp (always works).
  */
  const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // e.g. 'service_abc123'
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // e.g. 'template_xyz789'
  const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // e.g. 'abcDEFghiJKL'
  const EMAIL_CONFIGURED    = (EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID');

  // Lazy-load EmailJS only if configured
  if (EMAIL_CONFIGURED) {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    s.onload = () => window.emailjs && window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    document.head.appendChild(s);
  }

  document.querySelectorAll('.enquiry-form').forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const get = name => (form.querySelector(`[name="${name}"]`)?.value || '').trim();
      const name    = get('name');
      const mobile  = get('mobile');
      const pkg     = get('package') || 'a package';
      const dates   = get('dates');
      const pax     = get('pax');
      const message = get('message');

      // Validation
      if (!name) { showToast('⚠️ Please enter your name.', 'error'); return; }
      if (!mobile || !/^[6-9]\d{9}$/.test(mobile.replace(/[\s+\-()]/g, ''))) {
        showToast('⚠️ Please enter a valid 10-digit Indian mobile number.', 'error');
        return;
      }

      // Disable submit button
      const btn = form.querySelector('[type="submit"]');
      const origText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '⏳ Sending…';

      // Build WhatsApp message
      let waMsg = `Hi! I'm *${name}* and I'm interested in *${pkg}*.`;
      if (dates)   waMsg += ` Travel date: ${dates}.`;
      if (pax)     waMsg += ` Travellers: ${pax}.`;
      if (message) waMsg += ` Note: ${message}.`;
      waMsg += ` My number: ${mobile}.`;

      // 1. Always open WhatsApp
      window.open(
        `https://api.whatsapp.com/send/?phone=918396000504&text=${encodeURIComponent(waMsg)}`,
        '_blank', 'noopener,noreferrer'
      );

      // 2. Send email if EmailJS is configured
      if (EMAIL_CONFIGURED && window.emailjs) {
        try {
          await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            from_name:    name,
            from_mobile:  mobile,
            package_name: pkg,
            travel_date:  dates  || 'Not specified',
            pax_count:    pax    || 'Not specified',
            message:      message || 'None',
            to_email:     'info.frenzyowl@gmail.com',
            reply_to:     mobile
          });
          showToast('✅ Enquiry sent! WhatsApp opened & email delivered.', 'success');
        } catch (err) {
          console.warn('EmailJS error:', err);
          showToast('✅ WhatsApp opened! Email sending failed — we\'ll respond via WhatsApp.', 'info');
        }
      } else {
        showToast('✅ WhatsApp opened — we\'ll respond within minutes!', 'success');
      }

      // Re-enable button after 3s
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = origText;
      }, 3000);
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

  /* ─── 10. Stat counter animation ─────────────────── */
  document.querySelectorAll('.stat-num').forEach(el => {
    const raw = el.textContent.trim();
    const match = raw.match(/[\d,]+/);
    if (!match) return;
    const target = parseInt(match[0].replace(/,/g, ''), 10);
    const suffix = raw.replace(match[0], '');
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      let cur = 0;
      const step = Math.ceil(target / 55);
      const t = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = cur.toLocaleString('en-IN') + suffix;
        if (cur >= target) clearInterval(t);
      }, 28);
      io.unobserve(el);
    }, { threshold: 0.5 });
    io.observe(el);
  });

  /* ─── 11. Input: readonly fields subtle style ──── */
  document.querySelectorAll('input[readonly]').forEach(inp => {
    inp.style.background = 'var(--warm-bg)';
    inp.style.cursor     = 'default';
    inp.style.color      = 'var(--muted)';
  });

})();

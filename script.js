/* ============================================
   JSG CONTRACTING & REMODELING — Main JS
   Liquid Glass Design — Premium Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Preloader ---
  const preloader = document.getElementById('preloader');
  if (preloader) {
    const hide = () => setTimeout(() => preloader.classList.add('hidden'), 600);
    if (document.readyState === 'complete') hide();
    else window.addEventListener('load', hide);
  }

  // --- Navbar Scroll ---
  const nav = document.getElementById('mainNav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Mobile Nav Toggle ---
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });
    navMenu.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Scroll Animations ---
  const animEls = document.querySelectorAll('.anim-on-scroll');
  if (animEls.length > 0 && !prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    animEls.forEach(el => observer.observe(el));
  } else {
    animEls.forEach(el => el.classList.add('visible'));
  }

  // --- Counter Animation ---
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (counters.length > 0 && !prefersReducedMotion) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target);
          const duration = 2000;
          const startTime = performance.now();

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(target * eased);
            if (progress < 1) requestAnimationFrame(animate);
            else el.textContent = target;
          };
          requestAnimationFrame(animate);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  } else {
    counters.forEach(c => { c.textContent = c.dataset.target; });
  }

  // --- Smooth anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Contact Form (Formspree) ---
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const btnSpan = submitBtn.querySelector('span');
      const originalText = btnSpan.textContent;

      submitBtn.disabled = true;
      btnSpan.textContent = 'Sending…';

      try {
        const response = await fetch('https://formspree.io/f/meedoqpj', {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          contactForm.style.display = 'none';
          if (formSuccess) formSuccess.classList.add('show');
        } else {
          const data = await response.json();
          const msg = data.errors ? data.errors.map(e => e.message).join(', ') : 'Submission failed. Please try again or call us directly.';
          alert(msg);
          submitBtn.disabled = false;
          btnSpan.textContent = originalText;
        }
      } catch {
        alert('Unable to send — please check your connection or call (603) 966-7714.');
        submitBtn.disabled = false;
        btnSpan.textContent = originalText;
      }
    });
  }

  // --- Active nav link highlighting ---
  const sections = document.querySelectorAll('section[id]');
  if (sections.length > 0) {
    const navLinks = document.querySelectorAll('.nav-link');
    const highlightNav = () => {
      let current = '';
      sections.forEach(section => {
        const top = section.offsetTop - 120;
        if (window.scrollY >= top) current = section.getAttribute('id');
      });
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
      });
    };
    window.addEventListener('scroll', highlightNav, { passive: true });
  }
});

// CADD EXPERT — shared site behaviour (vanilla JS, no dependencies)

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  /* ---------- highlight active nav link ---------- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });

  /* ---------- reveal-on-scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- animated counters (title-block stats) ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const animateCounter = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1200;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased * 10) / 10;
        el.textContent = (Number.isInteger(target) ? Math.round(value) : value) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      const cio = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            cio.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(c => cio.observe(c));
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ---------- courses accordion ---------- */
  document.querySelectorAll('.accordion-trig').forEach(trig => {
    trig.addEventListener('click', () => {
      const item = trig.closest('.accordion-item');
      const panel = item.querySelector('.accordion-panel');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.accordion-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.accordion-panel').style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        panel.style.maxHeight = null;
      } else {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---------- contact form: validate, then hand off to WhatsApp ---------- */
  const form = document.getElementById('enquiryForm');
  if (form) {
    const WHATSAPP_NUMBER = '919363624241'; // primary number, country code 91

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const nameField = form.querySelector('#f-name');
      const phoneField = form.querySelector('#f-phone');
      const courseField = form.querySelector('#f-course');

      const setInvalid = (field, isInvalid) => {
        field.closest('.field').classList.toggle('invalid', isInvalid);
      };

      const nameOk = nameField.value.trim().length > 1;
      setInvalid(nameField, !nameOk);
      if (!nameOk) valid = false;

      const phoneDigits = phoneField.value.replace(/\D/g, '');
      const phoneOk = phoneDigits.length >= 10;
      setInvalid(phoneField, !phoneOk);
      if (!phoneOk) valid = false;

      const courseOk = courseField.value !== '';
      setInvalid(courseField, !courseOk);
      if (!courseOk) valid = false;

      if (!valid) return;

      const name = nameField.value.trim();
      const email = form.querySelector('#f-email').value.trim();
      const course = courseField.value;
      const message = form.querySelector('#f-message').value.trim();

      const lines = [
        'New enquiry from the website:',
        `Name: ${name}`,
        `Phone: ${phoneField.value.trim()}`,
        email ? `Email: ${email}` : null,
        `Course interested: ${course}`,
        message ? `Message: ${message}` : null
      ].filter(Boolean);

      const text = encodeURIComponent(lines.join('\n'));
      const successBox = form.querySelector('.form-success');
      if (successBox) successBox.classList.add('show');

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
      form.reset();
    });
  }

});

/**
 * Elite Plumbing — Premium Dark Template — Plumber variant
 * main.js — Handles: cursor glow, mobile nav, smooth scroll,
 * stats counter, scroll fade-in, why-us fly-in, how-we-work
 * animation, contact form validation
 *
 * No external libraries. Vanilla JS only. ES6+.
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════
     1. CURSOR-FOLLOWING GLOW
     A large radial gradient follows the mouse
     with smooth lag via CSS transition.
  ═══════════════════════════════════════════ */
  var cursorGlow = document.getElementById('cursor-glow');

  if (cursorGlow) {
    document.addEventListener('mousemove', function (e) {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    });

    // Hide on touch devices
    document.addEventListener('touchstart', function () {
      cursorGlow.style.display = 'none';
    }, { once: true });
  }

  /* ═══════════════════════════════════════════
     1B. NAVBAR SCROLL — transparent → frosted glass
  ═══════════════════════════════════════════ */
  var navbar = document.getElementById('navbar');

  if (navbar) {
    function checkScroll() {
      if (window.scrollY > 50) {
        navbar.classList.add('navbar--scrolled');
      } else {
        navbar.classList.remove('navbar--scrolled');
      }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll(); // check on load
  }

  /* ═══════════════════════════════════════════
     2. MOBILE NAVIGATION
  ═══════════════════════════════════════════ */
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (hamburger && mobileMenu) {
    function openMenu() {
      mobileMenu.setAttribute('aria-hidden', 'false');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Close menu');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      mobileMenu.setAttribute('aria-hidden', 'true');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function () {
      var isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      if (isOpen) { closeMenu(); } else { openMenu(); }
    });

    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close menu when any link inside mobile menu is tapped (Get a Quote, phone, etc.)
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        hamburger.focus();
      }
    });
  }

  /* ═══════════════════════════════════════════
     3. SMOOTH SCROLL
  ═══════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ═══════════════════════════════════════════
     4. STATS COUNTER ANIMATION
  ═══════════════════════════════════════════ */
  var statNumbers = document.querySelectorAll('.stat-number[data-target]');

  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        statsObserver.unobserve(entry.target);
        animateCounter(entry.target);
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(function (el) {
      statsObserver.observe(el);
    });
  }

  function animateCounter(el) {
    var target   = parseFloat(el.getAttribute('data-target'));
    var suffix   = el.getAttribute('data-suffix') || '';
    var decimals = parseInt(el.getAttribute('data-decimals'), 10) || 0;
    var duration = 2000;
    var start    = performance.now();

    function step(now) {
      var elapsed  = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased    = 1 - Math.pow(1 - progress, 3);
      var current  = eased * target;
      el.textContent = (decimals > 0 ? current.toFixed(decimals) : Math.round(current)) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  /* ═══════════════════════════════════════════
     5. SCROLL FADE-IN
  ═══════════════════════════════════════════ */
  if ('IntersectionObserver' in window) {
    var fadeTargets = document.querySelectorAll(
      '.service-card, .review-card, .section-header'
    );

    fadeTargets.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    });

    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, idx) {
        if (!entry.isIntersecting) return;
        var isHeader = entry.target.classList.contains('section-header');
        var delay = isHeader ? 0 : Math.min(idx * 60, 300);
        setTimeout(function () {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, delay);
        fadeObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeTargets.forEach(function (el) {
      fadeObserver.observe(el);
    });
  }

  /* ═══════════════════════════════════════════
     6. WHY CHOOSE US — fly-in cards
  ═══════════════════════════════════════════ */
  var whyCards = document.querySelectorAll('.why-card');

  if (whyCards.length && 'IntersectionObserver' in window) {
    whyCards.forEach(function (card) {
      card.classList.add('why-card--hidden');
    });

    var whyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('why-card--hidden');
        whyObserver.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

    whyCards.forEach(function (card) {
      whyObserver.observe(card);
    });
  }

  /* ═══════════════════════════════════════════
     7. HOW WE WORK — staggered animation
  ═══════════════════════════════════════════ */
  var howInner = document.querySelector('.how-inner');

  if (howInner && 'IntersectionObserver' in window) {
    var howIntro = document.querySelector('.how-intro');
    var howSteps = document.querySelectorAll('.how-step');

    if (howIntro) {
      howIntro.style.opacity = '0';
      howIntro.style.transform = 'translateX(-24px)';
      howIntro.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    }

    howSteps.forEach(function (step) {
      step.style.opacity = '0';
      step.style.transform = 'translateY(28px)';
      step.style.transition = 'opacity 0.55s ease, transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)';
    });

    var howObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        if (howIntro) {
          howIntro.style.opacity = '1';
          howIntro.style.transform = 'translateX(0)';
        }

        howSteps.forEach(function (step, i) {
          setTimeout(function () {
            step.style.opacity = '1';
            step.style.transform = 'translateY(0)';
          }, 100 + (i * 150));
        });

        howObserver.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    howObserver.observe(howInner);
  }

  /* ═══════════════════════════════════════════
     8. CONTACT FORM — validation & submission
  ═══════════════════════════════════════════ */
  const form       = document.getElementById('contact-form');
  const submitBtn  = document.getElementById('submit-btn');
  const successMsg = document.getElementById('form-success');
  const errorMsg   = document.getElementById('form-error');

  if (!form) return;

  // Stamp page_url + form_rendered_at on render so the n8n time-trap can
  // verify the visitor took at least 3 seconds to fill the form.
  var pageUrlField = form.querySelector('input[name="page_url"]');
  var renderedAtField = form.querySelector('input[name="form_rendered_at"]');
  if (pageUrlField) pageUrlField.value = location.href;
  if (renderedAtField) renderedAtField.value = String(Date.now());

  ['contact-name', 'contact-email', 'contact-phone', 'contact-message'].forEach(function (id) {
    var field = document.getElementById(id);
    if (!field) return;
    field.addEventListener('input', function () {
      clearError(field);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var honeypot = form.querySelector('input[name="website"]');
    if (honeypot && honeypot.value.trim() !== '') {
      showSuccess();
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    // Capture the lead values now in case we need a mailto: fallback.
    var name = document.getElementById('contact-name').value.trim();
    var email = document.getElementById('contact-email').value.trim();
    var phone = document.getElementById('contact-phone').value.trim();
    var message = document.getElementById('contact-message').value.trim();

    // Build a JSON body so the n8n webhook gets a clean object.
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });

    // 6-second timeout via AbortController for cross-browser support.
    var controller = new AbortController();
    var timeoutId = setTimeout(function () { controller.abort(); }, 6000);

    fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data),
      signal: controller.signal
    })
      .then(function (res) {
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error('Server error: ' + res.status);
        showSuccess();
      })
      .catch(function () {
        clearTimeout(timeoutId);
        setLoading(false);
        showServerError(name, email, phone, message);
      });
  });

  function validateForm() {
    var valid = true;

    var nameField    = document.getElementById('contact-name');
    var emailField   = document.getElementById('contact-email');
    var phoneField   = document.getElementById('contact-phone');
    var messageField = document.getElementById('contact-message');

    if (!nameField.value.trim()) {
      showError(nameField, 'err-name', 'Please enter your name.');
      valid = false;
    }

    if (!emailField.value.trim()) {
      showError(emailField, 'err-email', 'Please enter your email address.');
      valid = false;
    } else if (!isValidEmail(emailField.value.trim())) {
      showError(emailField, 'err-email', 'Please enter a valid email address.');
      valid = false;
    }

    if (!phoneField.value.trim()) {
      showError(phoneField, 'err-phone', 'Please enter your phone number.');
      valid = false;
    } else {
      var cleaned = phoneField.value.replace(/\D/g, '');
      if (cleaned.length < 8 || cleaned.length > 12) {
        showError(phoneField, 'err-phone', 'Please enter a valid phone number.');
        valid = false;
      }
    }
    // Message is optional — no validation

    return valid;
  }

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  function showError(field, errorId, message) {
    field.classList.add('has-error');
    var errorEl = document.getElementById(errorId);
    if (errorEl) { errorEl.textContent = message; }
  }

  function clearError(field) {
    field.classList.remove('has-error');
    var errorId = field.getAttribute('aria-describedby');
    var errorEl = errorId ? document.getElementById(errorId) : null;
    if (errorEl) { errorEl.textContent = ''; }
  }

  function setLoading(loading) {
    var defaultText = submitBtn.querySelector('.btn-default-text');
    var loadingText = submitBtn.querySelector('.btn-loading-text');
    submitBtn.disabled = loading;
    if (defaultText) defaultText.hidden = loading;
    if (loadingText) loadingText.hidden = !loading;
  }

  function showSuccess() {
    setLoading(false);
    form.reset();
    var prompt = document.getElementById('form-prompt');
    if (prompt) { prompt.hidden = true; } else { form.hidden = true; }
    if (successMsg) { successMsg.hidden = false; }
    if (errorMsg)   { errorMsg.hidden   = true;  }
  }

  function showServerError(name, email, phone, message) {
    // Build a mailto: fallback so the lead isn't lost if the webhook fails.
    var mailto = document.getElementById('mailto-fallback');
    if (mailto) {
      var notifyEmailField = form.querySelector('input[name="notify_email"]');
      var notifyEmail = notifyEmailField ? notifyEmailField.value : '';
      var subject = encodeURIComponent('Website enquiry from ' + (name || ''));
      var bodyText = 'Name: ' + (name || '') + '\nEmail: ' + (email || '') + '\nPhone: ' + (phone || '') + '\n\n' + (message || '');
      mailto.href = 'mailto:' + notifyEmail + '?subject=' + subject + '&body=' + encodeURIComponent(bodyText);
    }
    var prompt = document.getElementById('form-prompt');
    if (prompt) { prompt.hidden = true; } else { form.hidden = true; }
    if (errorMsg)   { errorMsg.hidden   = false; }
    if (successMsg) { successMsg.hidden = true;  }
  }

  /* ═══════════════════════════════════════════
     DYNAMIC FOOTER YEAR
  ═══════════════════════════════════════════ */
  var yearSpan = document.getElementById('footer-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

})();

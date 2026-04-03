/* ═══════════════════════════════════════════
   Easy Day Moving — Funnel Script v2
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  // ── DOM refs ──
  const form = document.getElementById('lead-form');
  const steps = Array.from(document.querySelectorAll('.step'));
  const nextBtn = document.getElementById('next-btn');
  const prevBtn = document.getElementById('prev-btn');
  const submitBtn = document.getElementById('submit-btn');
  const errorBox = document.getElementById('form-error');
  const progressFill = document.getElementById('progress-bar-fill');
  const progressStepText = document.getElementById('progress-step-text');
  const resultCard = document.getElementById('result-card');
  const resultTier = document.getElementById('result-tier');
  const resultRange = document.getElementById('result-range');
  const resultGreeting = document.getElementById('result-greeting');
  const phoneInput = document.getElementById('phone-input');

  let currentStep = 0;
  const totalSteps = steps.length;

  // ── Utilities ──
  function trackEvent(name, data) {
    // Google Analytics 4
    if (typeof gtag === 'function') {
      gtag('event', name, data || {});
    }
    // Meta Pixel
    if (typeof fbq === 'function') {
      fbq('trackCustom', name, data || {});
    }
    // Generic dataLayer push
    if (window.dataLayer) {
      window.dataLayer.push({ event: name, ...data });
    }
  }

  // ── Progress ──
  function updateProgress() {
    const pct = ((currentStep + 1) / totalSteps) * 100;
    progressFill.style.width = pct + '%';
    progressStepText.textContent = 'Step ' + (currentStep + 1) + ' of ' + totalSteps;

    prevBtn.disabled = currentStep === 0;
    nextBtn.classList.toggle('hidden', currentStep === totalSteps - 1);
    submitBtn.classList.toggle('hidden', currentStep !== totalSteps - 1);
  }

  function showStep(index) {
    steps.forEach(function (step, i) {
      step.classList.toggle('active', i === index);
    });
    currentStep = index;
    errorBox.textContent = '';
    updateProgress();

    // Scroll funnel card into view on mobile
    if (window.innerWidth < 768) {
      var card = document.querySelector('.funnel-card');
      if (card) {
        setTimeout(function () {
          card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }

    trackEvent('funnel_step_view', { step: index + 1 });
  }

  // ── Validation ──
  function getStepFields(step) {
    return Array.from(step.querySelectorAll('input[required], select[required]'));
  }

  function validateStep(stepIndex) {
    var step = steps[stepIndex];
    var fields = getStepFields(step);

    for (var i = 0; i < fields.length; i++) {
      var field = fields[i];
      if (!field.value.trim()) {
        var name = field.name;
        var messages = {
          moveType: 'Please select a move type.',
          moveSize: 'Please select a move size.',
          fromAddress: 'Please enter your current address.',
          toAddress: 'Please enter your new address.',
          moveDate: 'Please choose a move date.',
          name: 'Please enter your name.',
          phone: 'Please enter your phone number.'
        };
        errorBox.textContent = messages[name] || 'Please complete this step.';
        field.focus && field.focus();
        return false;
      }
    }

    // Phone validation on last step
    if (stepIndex === totalSteps - 1) {
      var phoneField = form.querySelector('input[name="phone"]');
      var phoneDigits = (phoneField.value || '').replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        errorBox.textContent = 'Please enter a valid 10-digit phone number.';
        phoneField.focus();
        return false;
      }
    }

    // Email validation (optional field but validate format if filled)
    if (stepIndex === totalSteps - 1) {
      var emailField = form.querySelector('input[name="email"]');
      if (emailField.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) {
        errorBox.textContent = 'Please enter a valid email address.';
        emailField.focus();
        return false;
      }
    }

    errorBox.textContent = '';
    return true;
  }

  // ── Navigation ──
  nextBtn.addEventListener('click', function () {
    if (!validateStep(currentStep)) return;
    if (currentStep < totalSteps - 1) {
      trackEvent('funnel_step_complete', { step: currentStep + 1 });
      showStep(currentStep + 1);
    }
  });

  prevBtn.addEventListener('click', function () {
    if (currentStep > 0) showStep(currentStep - 1);
  });

  // ── Option Grids ──
  function handleSingleSelect(group) {
    var buttons = group.querySelectorAll('button');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');

        var inputName = group.dataset.name;
        var target = form.querySelector('input[name="' + inputName + '"]');
        if (target) target.value = btn.dataset.value;
        errorBox.textContent = '';

        // Auto-advance after 350ms for single-select steps
        setTimeout(function () {
          if (currentStep < totalSteps - 1) {
            trackEvent('funnel_step_complete', { step: currentStep + 1, auto: true });
            showStep(currentStep + 1);
          }
        }, 350);
      });
    });
  }

  function handleMultiSelect(group) {
    group.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        btn.classList.toggle('selected');
      });
    });
  }

  document.querySelectorAll('.single-select').forEach(handleSingleSelect);
  document.querySelectorAll('.multi-select').forEach(handleMultiSelect);

  function getMultiSelectValues(name) {
    var group = document.querySelector('.multi-select[data-name="' + name + '"]');
    if (!group) return [];
    return Array.from(group.querySelectorAll('button.selected')).map(function (btn) {
      return btn.dataset.value;
    });
  }

  // ── Phone Formatting ──
  if (phoneInput) {
    phoneInput.addEventListener('input', function (e) {
      var raw = e.target.value.replace(/\D/g, '');
      if (raw.length > 10) raw = raw.slice(0, 10);
      var formatted = '';
      if (raw.length > 0) formatted = '(' + raw.slice(0, 3);
      if (raw.length >= 3) formatted += ') ' + raw.slice(3, 6);
      if (raw.length >= 6) formatted += '-' + raw.slice(6, 10);
      e.target.value = formatted;
    });
  }

  // ── Date min ──
  var dateInput = form.querySelector('input[name="moveDate"]');
  if (dateInput) {
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var dd = String(today.getDate()).padStart(2, '0');
    dateInput.setAttribute('min', yyyy + '-' + mm + '-' + dd);
  }

  // ── UTM + Attribution ──
  function populateTrackingFields() {
    var params = new URLSearchParams(window.location.search);
    var fields = {
      utmSource: 'utm_source',
      utmCampaign: 'utm_campaign',
      utmMedium: 'utm_medium',
      utmContent: 'utm_content',
      utmTerm: 'utm_term',
      gclid: 'gclid'
    };

    Object.keys(fields).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = params.get(fields[id]) || '';
    });

    var refEl = document.getElementById('referrer');
    if (refEl) refEl.value = document.referrer || '';

    var lpEl = document.getElementById('landingPage');
    if (lpEl) lpEl.value = window.location.href || '';
  }

  // ── Submit ──
  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (!validateStep(currentStep)) return;

    var formData = new FormData(form);
    var payload = Object.fromEntries(formData.entries());
    payload.access = getMultiSelectValues('access');
    payload.specialItems = getMultiSelectValues('specialItems');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Getting your estimate...';
    errorBox.textContent = '';

    try {
      var response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      var data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.message || 'Submission failed.');
      }

      // Show result
      form.classList.add('hidden');
      resultCard.classList.remove('hidden');
      resultTier.textContent = data.tier;
      resultRange.textContent = data.range;
      progressFill.style.width = '100%';
      progressStepText.textContent = 'Complete';

      // Personalized greeting
      var firstName = (data.name || '').split(' ')[0];
      if (firstName) {
        resultGreeting.textContent = firstName + ', you\'re all set!';
      }

      // Scroll to result
      resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

      trackEvent('funnel_complete', {
        tier: data.tier,
        range: data.range
      });

      // Track conversion for ads
      if (typeof gtag === 'function') {
        gtag('event', 'conversion', { send_to: 'AW-XXXXX/YYYYY' });
      }
      if (typeof fbq === 'function') {
        fbq('track', 'Lead');
      }

    } catch (err) {
      errorBox.textContent = err.message || 'Something went wrong. Please try again.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'See My Flat-Rate Estimate <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    }
  });

  // ── Scroll Animations ──
  function initScrollAnimations() {
    var targets = document.querySelectorAll('.step-card, .included-card, .testimonial-card, .area-pills span');
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.classList.add('fade-in', 'visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (el, i) {
      el.classList.add('fade-in');
      el.style.transitionDelay = (i % 4) * 80 + 'ms';
      observer.observe(el);
    });
  }

  // ── Init ──
  populateTrackingFields();
  showStep(0);
  initScrollAnimations();

  trackEvent('funnel_view', { page: 'main' });

})();

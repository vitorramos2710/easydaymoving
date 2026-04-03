/* ═══════════════════════════════════════════
   Easy Day Moving — Final Script
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  var form = document.getElementById('lead-form');
  var steps = Array.from(document.querySelectorAll('.step'));
  var nextBtn = document.getElementById('next-btn');
  var prevBtn = document.getElementById('prev-btn');
  var submitBtn = document.getElementById('submit-btn');
  var errorBox = document.getElementById('form-error');
  var progressFill = document.getElementById('progress-bar-fill');
  var progressStepText = document.getElementById('progress-step-text');
  var resultCard = document.getElementById('result-card');
  var resultTier = document.getElementById('result-tier');
  var resultRange = document.getElementById('result-range');
  var resultGreeting = document.getElementById('result-greeting');
  var phoneInput = document.getElementById('phone-input');

  var currentStep = 0;
  var totalSteps = steps.length;

  function trackEvent(name, data) {
    if (typeof gtag === 'function') gtag('event', name, data || {});
    if (typeof fbq === 'function') fbq('trackCustom', name, data || {});
    if (window.dataLayer) window.dataLayer.push({ event: name, ...data });
  }

  function updateProgress() {
    var pct = ((currentStep + 1) / totalSteps) * 100;
    progressFill.style.width = pct + '%';
    progressStepText.textContent = 'Step ' + (currentStep + 1) + ' of ' + totalSteps;
    prevBtn.disabled = currentStep === 0;
    nextBtn.classList.toggle('hidden', currentStep === totalSteps - 1);
    submitBtn.classList.toggle('hidden', currentStep !== totalSteps - 1);
  }

  function showStep(index) {
    steps.forEach(function (s, i) { s.classList.toggle('active', i === index); });
    currentStep = index;
    errorBox.textContent = '';
    updateProgress();
    if (window.innerWidth < 768) {
      var card = document.querySelector('.hero-card');
      if (card) setTimeout(function () { card.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80);
    }
    trackEvent('funnel_step_view', { step: index + 1 });
  }

  function getStepFields(step) {
    return Array.from(step.querySelectorAll('input[required], select[required]'));
  }

  function validateStep(idx) {
    var step = steps[idx];
    var fields = getStepFields(step);
    for (var i = 0; i < fields.length; i++) {
      if (!fields[i].value.trim()) {
        var msgs = { moveType: 'Please select a service.', moveSize: 'Please select a size.', fromAddress: 'Please enter your current address.', toAddress: 'Please enter your new address.', moveDate: 'Please choose a date.', name: 'Please enter your name.', phone: 'Please enter your phone number.' };
        errorBox.textContent = msgs[fields[i].name] || 'Please complete this step.';
        if (fields[i].focus) fields[i].focus();
        return false;
      }
    }
    if (idx === totalSteps - 1) {
      var ph = form.querySelector('input[name="phone"]');
      if ((ph.value || '').replace(/\D/g, '').length < 10) { errorBox.textContent = 'Please enter a valid 10-digit phone number.'; ph.focus(); return false; }
      var em = form.querySelector('input[name="email"]');
      if (em.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim())) { errorBox.textContent = 'Please enter a valid email.'; em.focus(); return false; }
    }
    errorBox.textContent = '';
    return true;
  }

  nextBtn.addEventListener('click', function () {
    if (!validateStep(currentStep)) return;
    if (currentStep < totalSteps - 1) { trackEvent('funnel_step_complete', { step: currentStep + 1 }); showStep(currentStep + 1); }
  });

  prevBtn.addEventListener('click', function () { if (currentStep > 0) showStep(currentStep - 1); });

  function handleSingleSelect(group) {
    var btns = group.querySelectorAll('button');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        var t = form.querySelector('input[name="' + group.dataset.name + '"]');
        if (t) t.value = btn.dataset.value;
        errorBox.textContent = '';
        setTimeout(function () {
          if (currentStep < totalSteps - 1) { trackEvent('funnel_step_complete', { step: currentStep + 1, auto: true }); showStep(currentStep + 1); }
        }, 280);
      });
    });
  }

  function handleMultiSelect(group) {
    group.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () { btn.classList.toggle('selected'); });
    });
  }

  document.querySelectorAll('.single-select').forEach(handleSingleSelect);
  document.querySelectorAll('.multi-select').forEach(handleMultiSelect);

  function getMultiValues(name) {
    var g = document.querySelector('.multi-select[data-name="' + name + '"]');
    if (!g) return [];
    return Array.from(g.querySelectorAll('button.selected')).map(function (b) { return b.dataset.value; });
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', function (e) {
      var r = e.target.value.replace(/\D/g, '');
      if (r.length > 10) r = r.slice(0, 10);
      var f = '';
      if (r.length > 0) f = '(' + r.slice(0, 3);
      if (r.length >= 3) f += ') ' + r.slice(3, 6);
      if (r.length >= 6) f += '-' + r.slice(6, 10);
      e.target.value = f;
    });
  }

  var dateInput = form.querySelector('input[name="moveDate"]');
  if (dateInput) {
    var d = new Date();
    dateInput.setAttribute('min', d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'));
  }

  function populateTracking() {
    var p = new URLSearchParams(window.location.search);
    var map = { utmSource: 'utm_source', utmCampaign: 'utm_campaign', utmMedium: 'utm_medium', utmContent: 'utm_content', utmTerm: 'utm_term', gclid: 'gclid' };
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) el.value = p.get(map[id]) || ''; });
    var ref = document.getElementById('referrer'); if (ref) ref.value = document.referrer || '';
    var lp = document.getElementById('landingPage'); if (lp) lp.value = window.location.href || '';
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!validateStep(currentStep)) return;
    var fd = new FormData(form);
    var payload = Object.fromEntries(fd.entries());
    payload.access = getMultiValues('access');
    payload.specialItems = getMultiValues('specialItems');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Getting your estimate...';
    errorBox.textContent = '';
    try {
      var res = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      var data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || 'Submission failed.');
      form.classList.add('hidden');
      resultCard.classList.remove('hidden');
      resultTier.textContent = data.tier;
      resultRange.textContent = data.range;
      progressFill.style.width = '100%';
      progressStepText.textContent = 'Complete';
      var firstName = (data.name || '').split(' ')[0];
      if (firstName) resultGreeting.textContent = firstName + ', you\'re all set.';
      resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      trackEvent('funnel_complete', { tier: data.tier, range: data.range });
      if (typeof gtag === 'function') gtag('event', 'conversion', { send_to: 'AW-XXXXX/YYYYY' });
      if (typeof fbq === 'function') fbq('track', 'Lead');
    } catch (err) {
      errorBox.textContent = err.message || 'Something went wrong. Please try again.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'See My Quote';
    }
  });

  /* ═══ SCROLL REVEAL ═══ */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { observer.observe(el); });
  }

  populateTracking();
  showStep(0);
  initReveal();
  trackEvent('funnel_view', { page: 'main' });
})();

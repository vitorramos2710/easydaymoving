/* ═══════════════════════════════════════════
   Easy Day Moving — Dynamic Funnel Script
   Custom flows per service type
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Flow definitions: each service gets its own step sequence ──
  var FLOWS = {
    apartment:      ['service', 'apt-size', 'addresses', 'date', 'apt-access', 'special-packing', 'contact'],
    house:          ['service', 'house-size', 'addresses', 'date', 'house-access', 'special-packing', 'contact'],
    'small-office': ['service', 'office-size', 'addresses', 'date', 'office-access', 'office-items', 'contact'],
    packing:        ['service', 'packing-what', 'address-single', 'packing-size', 'date', 'contact'],
    'junk-removal': ['service', 'junk-type', 'junk-amount', 'address-single', 'date', 'contact'],
    'small-move':   ['service', 'small-items', 'addresses', 'date', 'move-access', 'contact']
  };

  var DEFAULT_FLOW = ['service'];

  // ── DOM refs ──
  var form = document.getElementById('lead-form');
  var allSteps = Array.from(document.querySelectorAll('.fstep'));
  var nextBtn = document.getElementById('next-btn');
  var prevBtn = document.getElementById('prev-btn');
  var submitBtn = document.getElementById('submit-btn');
  var errorBox = document.getElementById('form-error');
  var progressFill = document.getElementById('progress-bar-fill');
  var progressText = document.getElementById('progress-step-text');
  var resultCard = document.getElementById('result-card');
  var resultTier = document.getElementById('result-tier');
  var resultRange = document.getElementById('result-range');
  var resultGreeting = document.getElementById('result-greeting');
  var phoneInput = document.getElementById('phone-input');

  var currentFlow = DEFAULT_FLOW;
  var currentIndex = 0;
  var selectedService = null;

  // ── Helpers ──
  function getStepEl(sid) {
    return document.querySelector('.fstep[data-sid="' + sid + '"]');
  }

  function trackEvent(name, data) {
    if (typeof gtag === 'function') gtag('event', name, data || {});
    if (typeof fbq === 'function') fbq('trackCustom', name, data || {});
    if (window.dataLayer) window.dataLayer.push({ event: name, ...data });
  }

  // ── Progress ──
  function updateProgress() {
    var total = currentFlow.length;
    var pct = ((currentIndex + 1) / total) * 100;
    progressFill.style.width = pct + '%';
    progressText.textContent = 'Step ' + (currentIndex + 1) + ' of ' + total;

    prevBtn.disabled = currentIndex === 0;
    var isLast = currentIndex === total - 1;
    nextBtn.classList.toggle('hidden', isLast);
    submitBtn.classList.toggle('hidden', !isLast);
  }

  // ── Show step ──
  function showStep(index) {
    allSteps.forEach(function (s) { s.classList.remove('active'); });
    var sid = currentFlow[index];
    var el = getStepEl(sid);
    if (el) el.classList.add('active');
    currentIndex = index;
    errorBox.textContent = '';
    updateProgress();

    if (window.innerWidth < 768) {
      var card = document.querySelector('.hero-card');
      if (card) setTimeout(function () { card.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80);
    }

    trackEvent('funnel_step_view', { step: index + 1, sid: sid });
  }

  // ── Validate current step ──
  function validateCurrentStep() {
    var sid = currentFlow[currentIndex];
    var el = getStepEl(sid);
    if (!el) return true;

    var fields = Array.from(el.querySelectorAll('input[required], select[required]'));
    for (var i = 0; i < fields.length; i++) {
      if (!fields[i].value.trim()) {
        var msgs = {
          moveType: 'Please select a service.',
          moveSize: 'Please select a size.',
          fromAddress: 'Please enter the address.',
          toAddress: 'Please enter the destination.',
          moveDate: 'Please choose a date.',
          name: 'Please enter your name.',
          phone: 'Please enter your phone number.'
        };
        errorBox.textContent = msgs[fields[i].name] || 'Please complete this step.';
        if (fields[i].focus) fields[i].focus();
        return false;
      }
    }

    // Phone validation on contact step
    if (sid === 'contact') {
      var ph = form.querySelector('.fstep[data-sid="contact"] input[name="phone"]');
      if (ph && (ph.value || '').replace(/\D/g, '').length < 10) {
        errorBox.textContent = 'Please enter a valid 10-digit phone number.';
        ph.focus();
        return false;
      }
      var em = form.querySelector('.fstep[data-sid="contact"] input[name="email"]');
      if (em && em.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim())) {
        errorBox.textContent = 'Please enter a valid email.';
        em.focus();
        return false;
      }
    }

    errorBox.textContent = '';
    return true;
  }

  // ── Navigation ──
  nextBtn.addEventListener('click', function () {
    if (!validateCurrentStep()) return;
    if (currentIndex < currentFlow.length - 1) {
      trackEvent('funnel_step_complete', { step: currentIndex + 1 });
      showStep(currentIndex + 1);
    }
  });

  prevBtn.addEventListener('click', function () {
    if (currentIndex > 0) showStep(currentIndex - 1);
  });

  // ── Option grids ──
  function initSingleSelects() {
    document.querySelectorAll('.single-select').forEach(function (group) {
      var btns = group.querySelectorAll('button');
      btns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          // Clear all buttons in THIS group
          btns.forEach(function (b) { b.classList.remove('selected'); });
          btn.classList.add('selected');

          // Set hidden input value
          var inputName = group.dataset.name;
          // Find the hidden input in the same fstep
          var fstep = group.closest('.fstep');
          var target = fstep ? fstep.querySelector('input[name="' + inputName + '"]') : form.querySelector('input[name="' + inputName + '"]');
          if (target) target.value = btn.dataset.value;
          errorBox.textContent = '';

          // If this is the SERVICE step, set the flow
          var sid = fstep ? fstep.dataset.sid : null;
          if (sid === 'service') {
            selectedService = btn.dataset.value;
            currentFlow = FLOWS[selectedService] || DEFAULT_FLOW;

            // Set default packing value for non-move services
            if (selectedService === 'packing') {
              var packInput = form.querySelector('select[name="packing"]');
              if (packInput) packInput.value = 'full';
            }
            if (selectedService === 'junk-removal') {
              // Set toAddress to N/A for junk removal
              var toAddr = form.querySelector('input[name="toAddress"]');
              if (toAddr) toAddr.value = 'N/A (junk removal)';
            }
          }

          // Auto-advance after selection
          setTimeout(function () {
            if (currentIndex < currentFlow.length - 1) {
              trackEvent('funnel_step_complete', { step: currentIndex + 1, auto: true });
              showStep(currentIndex + 1);
            }
          }, 280);
        });
      });
    });
  }

  function initMultiSelects() {
    document.querySelectorAll('.multi-select').forEach(function (group) {
      group.querySelectorAll('button').forEach(function (btn) {
        btn.addEventListener('click', function () {
          btn.classList.toggle('selected');
        });
      });
    });
  }

  function getMultiValues(name) {
    var vals = [];
    document.querySelectorAll('.multi-select[data-name="' + name + '"]').forEach(function (g) {
      // Only get values from the currently active flow's steps
      var fstep = g.closest('.fstep');
      if (fstep && fstep.classList.contains('active') || isStepInFlow(fstep)) {
        g.querySelectorAll('button.selected').forEach(function (b) {
          if (vals.indexOf(b.dataset.value) === -1) vals.push(b.dataset.value);
        });
      }
    });
    return vals;
  }

  function isStepInFlow(fstep) {
    if (!fstep) return false;
    var sid = fstep.dataset.sid;
    return currentFlow.indexOf(sid) !== -1;
  }

  // ── Phone formatting ──
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

  // ── Date min ──
  var dateInputs = form.querySelectorAll('input[name="moveDate"]');
  dateInputs.forEach(function (d) {
    var now = new Date();
    d.setAttribute('min', now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0'));
  });

  // ── Tracking fields ──
  function populateTracking() {
    var p = new URLSearchParams(window.location.search);
    var map = { utmSource: 'utm_source', utmCampaign: 'utm_campaign', utmMedium: 'utm_medium', utmContent: 'utm_content', utmTerm: 'utm_term', gclid: 'gclid' };
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) el.value = p.get(map[id]) || ''; });
    var ref = document.getElementById('referrer'); if (ref) ref.value = document.referrer || '';
    var lp = document.getElementById('landingPage'); if (lp) lp.value = window.location.href || '';
  }

  // ── Submit ──
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    // Collect all form data
    var fd = new FormData(form);
    var payload = Object.fromEntries(fd.entries());

    // Get multi-select values from steps that are in the current flow
    payload.access = getMultiValues('access');
    payload.specialItems = getMultiValues('specialItems');

    // Ensure required fields have defaults
    if (!payload.toAddress || payload.toAddress === '') payload.toAddress = 'N/A';
    if (!payload.packing) payload.packing = 'none';
    if (!payload.moveSize) payload.moveSize = 'studio';

    submitBtn.disabled = true;
    submitBtn.textContent = 'Getting your estimate...';
    errorBox.textContent = '';

    try {
      var res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      var data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || 'Submission failed.');

      form.classList.add('hidden');
      resultCard.classList.remove('hidden');
      resultTier.textContent = data.tier;
      resultRange.textContent = data.range;
      progressFill.style.width = '100%';
      progressText.textContent = 'Complete';

      var firstName = (data.name || '').split(' ')[0];
      if (firstName) resultGreeting.textContent = firstName + ', you\'re all set.';

      resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      trackEvent('funnel_complete', { tier: data.tier, range: data.range, service: selectedService });

      if (typeof gtag === 'function') gtag('event', 'conversion', { send_to: 'AW-XXXXX/YYYYY' });
      if (typeof fbq === 'function') fbq('track', 'Lead');
    } catch (err) {
      errorBox.textContent = err.message || 'Something went wrong. Please try again.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'See My Quote';
    }
  });

  // ── Scroll reveal ──
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

  // ── Init ──
  initSingleSelects();
  initMultiSelects();
  populateTracking();
  showStep(0);
  initReveal();
  trackEvent('funnel_view', { page: 'main' });

})();

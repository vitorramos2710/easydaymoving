/* ═══════════════════════════════════════════
   Easy Day Moving — Bulletproof Funnel
   Zero forms. Zero hidden inputs. Just data.
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Flow definitions ── */
  var FLOWS = {
    apartment:      ['service','apt-size','addresses','date','apt-access','special-packing','contact'],
    house:          ['service','house-size','addresses','date','house-access','special-packing','contact'],
    'small-office': ['service','office-size','addresses','date','office-access','office-items','contact'],
    packing:        ['service','packing-what','packing-size','address-single','date','contact'],
    'junk-removal': ['service','junk-type','junk-amount','address-single','date','contact'],
    'small-move':   ['service','small-items','addresses','date','move-access','contact']
  };

  /* ── The one source of truth ── */
  var data = {
    moveType: '', moveSize: 'studio', fromAddress: '', toAddress: 'N/A',
    moveDate: '', packing: 'none', contactPreference: 'text',
    name: '', phone: '', email: '',
    access: [], specialItems: [],
    utmSource: '', utmCampaign: '', utmMedium: '', utmContent: '',
    utmTerm: '', gclid: '', referrer: '', landingPage: ''
  };

  var flow = ['service'];
  var idx = 0;

  /* ── DOM ── */
  var allSteps = document.querySelectorAll('.fs');
  var btnNext = document.getElementById('btn-next');
  var btnBack = document.getElementById('btn-back');
  var btnSubmit = document.getElementById('btn-submit');
  var err = document.getElementById('err');
  var progFill = document.getElementById('progress-fill');
  var progText = document.getElementById('progress-text');
  var funnelForm = document.getElementById('funnel-form');
  var resultEl = document.getElementById('result');

  /* ── Helpers ── */
  function sid() { return flow[idx]; }
  function el(s) { return document.querySelector('.fs[data-sid="'+s+'"]'); }

  function show(i) {
    allSteps.forEach(function(s){ s.classList.remove('active'); });
    var step = el(flow[i]);
    if (step) step.classList.add('active');
    idx = i;
    err.textContent = '';
    progFill.style.width = ((i+1)/flow.length*100)+'%';
    progText.textContent = 'Step '+(i+1)+' of '+flow.length;
    btnBack.disabled = i === 0;
    btnNext.classList.toggle('hidden', i === flow.length-1);
    btnSubmit.classList.toggle('hidden', i !== flow.length-1);
    if (window.innerWidth < 768) {
      var c = document.querySelector('.hero-card');
      if (c) setTimeout(function(){ c.scrollIntoView({behavior:'smooth',block:'start'}); }, 80);
    }
  }

  /* ── Collect from current step ── */
  function collect() {
    var s = el(sid());
    if (!s) return;

    // Text inputs by ID
    var from = s.querySelector('#inp-from');
    var fromS = s.querySelector('#inp-from-single');
    var to = s.querySelector('#inp-to');
    var date = s.querySelector('#inp-date');
    var contact = s.querySelector('#inp-contact');
    var packing = s.querySelector('#inp-packing');
    var name = s.querySelector('#inp-name');
    var phone = s.querySelector('#inp-phone');
    var email = s.querySelector('#inp-email');

    if (from && from.value.trim()) data.fromAddress = from.value.trim();
    if (fromS && fromS.value.trim()) data.fromAddress = fromS.value.trim();
    if (to && to.value.trim()) data.toAddress = to.value.trim();
    if (date && date.value) data.moveDate = date.value;
    if (contact) data.contactPreference = contact.value;
    if (packing) data.packing = packing.value;
    if (name && name.value.trim()) data.name = name.value.trim();
    if (phone && phone.value.trim()) data.phone = phone.value.trim();
    if (email && email.value.trim()) data.email = email.value.trim();

    // Multi-selects: gather from ALL steps in current flow (not just current)
    data.access = [];
    data.specialItems = [];
    flow.forEach(function(stepId) {
      var stepEl = el(stepId);
      if (!stepEl) return;
      stepEl.querySelectorAll('.option-grid[data-mode="multi"]').forEach(function(g) {
        var key = g.dataset.key;
        g.querySelectorAll('button.selected').forEach(function(b) {
          if (key === 'access' && data.access.indexOf(b.dataset.val) === -1) data.access.push(b.dataset.val);
          if (key === 'specialItems' && data.specialItems.indexOf(b.dataset.val) === -1) data.specialItems.push(b.dataset.val);
        });
      });
    });
  }

  /* ── Validate ── */
  function validate() {
    var s = sid();
    var step = el(s);

    // Single-selects: must have a selection
    var sg = step.querySelector('.option-grid[data-mode="single"]');
    if (sg && !sg.querySelector('button.selected')) {
      err.textContent = 'Please make a selection.';
      return false;
    }

    // Multi-select steps: ALWAYS valid (optional)
    // No validation needed for access, specialItems, etc.

    // Address validation
    if (s === 'addresses') {
      var f = step.querySelector('#inp-from');
      var t = step.querySelector('#inp-to');
      if (!f.value.trim()) { err.textContent = 'Please enter your current address.'; f.focus(); return false; }
      if (!t.value.trim()) { err.textContent = 'Please enter your new address.'; t.focus(); return false; }
    }
    if (s === 'address-single') {
      var a = step.querySelector('#inp-from-single');
      if (!a.value.trim()) { err.textContent = 'Please enter the address.'; a.focus(); return false; }
    }

    // Date validation
    if (s === 'date') {
      var d = step.querySelector('#inp-date');
      if (!d.value) { err.textContent = 'Please choose a date.'; d.focus(); return false; }
    }

    // Contact validation
    if (s === 'contact') {
      var n = step.querySelector('#inp-name');
      var p = step.querySelector('#inp-phone');
      if (!n.value.trim()) { err.textContent = 'Please enter your name.'; n.focus(); return false; }
      var digits = (p.value||'').replace(/\D/g,'');
      if (digits.length < 10) { err.textContent = 'Please enter a valid 10-digit phone number.'; p.focus(); return false; }
      var e = step.querySelector('#inp-email');
      if (e.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.value.trim())) { err.textContent = 'Please enter a valid email.'; e.focus(); return false; }
    }

    err.textContent = '';
    return true;
  }

  /* ── Single select buttons ── */
  document.querySelectorAll('.option-grid[data-mode="single"]').forEach(function(grid) {
    var btns = grid.querySelectorAll('button');
    btns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        btns.forEach(function(b){ b.classList.remove('selected'); });
        btn.classList.add('selected');

        var key = grid.dataset.key;
        data[key] = btn.dataset.val;
        err.textContent = '';

        // If service step, set flow
        var step = grid.closest('.fs');
        if (step && step.dataset.sid === 'service') {
          var svc = btn.dataset.val;
          data.moveType = svc;
          flow = FLOWS[svc] || ['service'];
          data.access = [];
          data.specialItems = [];
          if (svc === 'junk-removal' || svc === 'packing') data.toAddress = 'N/A';
          if (svc === 'packing') data.packing = 'full';
        }

        // Auto-advance
        setTimeout(function() {
          if (idx < flow.length - 1) show(idx + 1);
        }, 250);
      });
    });
  });

  /* ── Multi select buttons ── */
  document.querySelectorAll('.option-grid[data-mode="multi"]').forEach(function(grid) {
    grid.querySelectorAll('button').forEach(function(btn) {
      btn.addEventListener('click', function() { btn.classList.toggle('selected'); });
    });
  });

  /* ── Navigation ── */
  btnNext.addEventListener('click', function() {
    collect();
    if (!validate()) return;
    if (idx < flow.length - 1) show(idx + 1);
  });

  btnBack.addEventListener('click', function() {
    if (idx > 0) show(idx - 1);
  });

  /* ── Submit ── */
  btnSubmit.addEventListener('click', async function() {
    collect();
    if (!validate()) return;

    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Getting your estimate...';
    err.textContent = '';

    try {
      var res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      var json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || 'Submission failed.');

      // Show result
      funnelForm.classList.add('hidden');
      resultEl.classList.remove('hidden');
      progFill.style.width = '100%';
      progText.textContent = 'Complete';

      document.getElementById('r-tier').textContent = json.tier;
      document.getElementById('r-range').textContent = json.range;

      var first = (json.name || '').split(' ')[0];
      if (first) document.getElementById('r-greeting').textContent = first + ', you\'re all set.';

      // Customize per service
      var svc = json.moveType || data.moveType;
      var sub = document.getElementById('r-sub');
      var vIcon = document.getElementById('r-video-icon');
      var vTitle = document.getElementById('r-video-title');
      var vText = document.getElementById('r-video-text');
      var cta1 = document.getElementById('r-cta1');
      var urg = document.getElementById('r-urgency');

      if (svc === 'junk-removal') {
        sub.textContent = 'Estimated junk removal range:';
        vIcon.textContent = '📸';
        vTitle.textContent = 'Send us a photo of what needs to go.';
        vText.textContent = 'A quick photo helps us confirm your exact flat rate. Most replies in 15 min.';
        cta1.textContent = '📸 Text Photos of Items';
        cta1.href = 'sms:+12138664956&body=Hi, here are photos of junk I need removed:';
        urg.textContent = '⚡ Same-week junk removal available';
      } else if (svc === 'packing') {
        sub.textContent = 'Estimated packing service range:';
        vTitle.textContent = 'Show us what needs packing.';
        vText.textContent = 'A quick walkthrough helps lock in your flat rate.';
        urg.textContent = '⚡ Packing crews available within 48 hours';
      } else if (svc === 'small-move') {
        sub.textContent = 'Estimated small move range:';
        vTitle.textContent = 'Show us the items.';
        vText.textContent = 'A quick photo or video of what you\'re moving locks in your price.';
        cta1.textContent = '📱 Text Photos / Video';
        cta1.href = 'sms:+12138664956&body=Hi, items for my small move:';
        urg.textContent = '⚡ Small moves often available within 48 hours';
      } else if (svc === 'small-office') {
        sub.textContent = 'Estimated office move range:';
        vTitle.textContent = 'Walk us through the office.';
        vText.textContent = 'A 30-second video helps us plan crew and equipment.';
        urg.textContent = '⚡ Weekend office moves available';
      }

      resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Google Ads conversion
      if (typeof gtag === 'function') {
        gtag('event', 'conversion', {
          send_to: 'AW-17973103075/HcX2CNuTk4gcEOOTn_pC',
          value: 1.0,
          currency: 'USD'
        });
      }

    } catch (e) {
      err.textContent = e.message || 'Something went wrong. Please try again.';
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.textContent = 'See My Quote';
    }
  });

  /* ── Phone formatting ── */
  var ph = document.getElementById('inp-phone');
  if (ph) {
    ph.addEventListener('input', function(e) {
      var r = e.target.value.replace(/\D/g,'').slice(0,10);
      var f = '';
      if (r.length > 0) f = '(' + r.slice(0,3);
      if (r.length >= 3) f += ') ' + r.slice(3,6);
      if (r.length >= 6) f += '-' + r.slice(6);
      e.target.value = f;
    });
  }

  /* ── Date min ── */
  var dateEl = document.getElementById('inp-date');
  if (dateEl) {
    var now = new Date();
    dateEl.min = now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');
  }

  /* ── UTM tracking ── */
  var params = new URLSearchParams(window.location.search);
  data.utmSource = params.get('utm_source') || '';
  data.utmCampaign = params.get('utm_campaign') || '';
  data.utmMedium = params.get('utm_medium') || '';
  data.utmContent = params.get('utm_content') || '';
  data.utmTerm = params.get('utm_term') || '';
  data.gclid = params.get('gclid') || '';
  data.referrer = document.referrer || '';
  data.landingPage = window.location.href || '';

  /* ── Scroll reveal ── */
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function(el) { obs.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el) { el.classList.add('visible'); });
  }

  /* ── Init ── */
  show(0);

})();

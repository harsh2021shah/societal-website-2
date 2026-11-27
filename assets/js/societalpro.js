/* SocietalPro site helpers: contact form (Web3Forms) and shared utilities. */
(function () {
  'use strict';

  // Web3Forms access key. Get one free at https://web3forms.com (it is safe to be public).
  var WEB3FORMS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';

  window.SP = window.SP || {};

  // Indian number formatting: 4,82,500
  SP.inr = function (n, decimals) {
    if (!isFinite(n)) n = 0;
    var d = decimals == null ? 0 : decimals;
    return '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d });
  };
  SP.num = function (v) {
    var n = parseFloat(String(v == null ? '' : v).replace(/[^0-9.\-]/g, ''));
    return isFinite(n) ? n : 0;
  };
  SP.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  SP.copy = function (text, btn) {
    var done = function () {
      if (!btn) return;
      var old = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
      setTimeout(function () { btn.innerHTML = old; }, 1600);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () { SP._fallbackCopy(text); done(); });
    } else { SP._fallbackCopy(text); done(); }
  };
  SP._fallbackCopy = function (text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  };
  SP.download = function (filename, content, mime) {
    var blob = new Blob([content], { type: mime || 'text/plain;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  };
  SP.csv = function (rows) {
    return '﻿' + rows.map(function (r) {
      return r.map(function (c) {
        c = String(c == null ? '' : c);
        return /[",\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c;
      }).join(',');
    }).join('\r\n');
  };
  SP.store = {
    get: function (k, d) { try { var v = localStorage.getItem('sp_' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('sp_' + k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  };

  // ---------- Contact form ----------
  document.querySelectorAll('form.sp-web3form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.sp-form-status');
      var btn = form.querySelector('button[type=submit]');
      var setStatus = function (cls, msg) { status.className = 'sp-form-status ' + cls; status.innerHTML = msg; };

      if (!form.checkValidity()) {
        setStatus('err', 'Please fill in your name, a valid email and a message.');
        var bad = form.querySelector(':invalid'); if (bad) bad.focus();
        return;
      }
      if (WEB3FORMS_KEY.indexOf('YOUR_') === 0) {
        setStatus('err', 'The form isn’t connected yet. Please email <a href="mailto:support@societalpro.com">support@societalpro.com</a> or message us on WhatsApp.');
        return;
      }
      var data = new FormData(form);
      data.append('access_key', WEB3FORMS_KEY);
      btn.setAttribute('disabled', 'disabled');
      var oldLabel = btn.innerHTML;
      btn.innerHTML = 'Sending…';
      fetch('https://api.web3forms.com/submit', { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res.success) {
            form.reset();
            setStatus('ok', 'Thank you. Your message is with us, and we’ll get back to you soon.');
          } else {
            setStatus('err', 'That didn’t go through. Please try again, or email support@societalpro.com.');
          }
        })
        .catch(function () { setStatus('err', 'That didn’t go through. Please check your connection, or email support@societalpro.com.'); })
        .then(function () { btn.removeAttribute('disabled'); btn.innerHTML = oldLabel; });
    });
  });
})();

// Use native selects inside SocietalPro forms and tools (better on mobile, simpler events).
(function () {
  if (window.jQuery && jQuery.fn.niceSelect) {
    jQuery('.sp-field select, .sp-tool-shell select').niceSelect('destroy');
  }
})();

// ?shot in the URL skips the preloader and entrance animations (used for automated screenshots).
(function () {
  if (location.search.indexOf('shot') === -1) return;
  var st = document.createElement('style');
  st.textContent = '#preloader{display:none!important}.heroTitleUp,.xbFadeUp,.xbFadeUpContent,.xbFadeUpImg,.xbFadeUpItem,.wow{visibility:visible!important;opacity:1!important;transform:none!important;filter:none!important;animation:none!important}';
  document.head.appendChild(st);
})();

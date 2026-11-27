/* SocietalPro free tools. Everything runs in the browser; nothing is sent anywhere. */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var inr = SP.inr, num = SP.num, esc = SP.esc;
  var onInput = function (root, fn) { root.addEventListener('input', fn); root.addEventListener('change', fn); };
  var todayISO = function (offsetDays) {
    var d = new Date(); d.setDate(d.getDate() + (offsetDays || 0));
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };
  var fmtDate = function (iso) {
    if (!iso) return '__________';
    var d = new Date(iso + 'T00:00:00');
    return isNaN(d) ? iso : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  var fmtTime = function (t) {
    if (!t) return '______';
    var p = t.split(':'), h = +p[0], m = p[1];
    return ((h % 12) || 12) + ':' + m + (h < 12 ? ' AM' : ' PM');
  };
  var seg = function (el, cb) {
    el.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      $$('button', el).forEach(function (x) { x.classList.toggle('on', x === b); });
      cb(b);
    });
  };

  /* ---------------- 1. Openness score ---------------- */
  (function () {
    var root = $('#tool-openness'); if (!root) return;
    var Q = [
      { q: 'Do payments carry a clear note?', h: 'For example, “October maintenance” or “Parking, Q3”, visible to the people it concerns.', fix: ['Make a note mandatory for every payment', 'Agree that no payment is recorded without a one-line note saying what it is for.'] },
      { q: 'Are monthly income and expense accounts shared with all members?', h: 'A simple summary of income, expenses and balance, not just at the AGM.', fix: ['Share a one-page monthly account', 'Use the free monthly accounts template and share it with members every month.'] },
      { q: 'Are big expenses backed by quotes and an approval note?', h: 'For example, collecting two or three quotes for repairs and recording who approved what.', fix: ['Attach quotes and approval to big expenses', 'Set a limit above which three quotes and a recorded committee approval are needed.'] },
      { q: 'Are decisions voted on and the results recorded?', h: 'One flat, one vote, with the outcome written down.', fix: ['Record every vote and its result', 'Write down the question, the votes for and against, and the decision, every time.'] },
      { q: 'Are meeting minutes shared with members within two weeks?', h: 'AGM, special meetings and committee decisions that affect everyone.', fix: ['Publish minutes within two weeks', 'Use the free minutes generator and share minutes with all members soon after each meeting.'] },
      { q: 'Can residents raise requests and see their status?', h: 'Instead of requests getting lost in a group chat.', fix: ['Give requests a home', 'Log every request with a date and status so residents can see it is being handled.'] },
      { q: 'Would your records survive a change of committee?', h: 'Accounts, minutes and documents are kept centrally, not on one person’s phone or laptop.', fix: ['Keep records in one shared place', 'Move accounts, minutes and documents to a place the society owns, not a single person.'] },
      { q: 'Can every resident follow along, whatever their language?', h: 'Notices and updates that elders and non-English speakers can read too.', fix: ['Share updates in residents’ languages', 'Send key notices in the languages your residents are most comfortable with.'] },
    ];
    var OPTS = [['Yes, on record', 2], ['Partly', 1], ['Not yet', 0]];
    var answers = [], i = 0;
    $('#oq-total').textContent = Q.length;

    function render() {
      $('#oq-n').textContent = i + 1;
      $('#oq-bar').style.width = ((i + 1) / Q.length * 100) + '%';
      $('#oq-q').textContent = Q[i].q;
      $('#oq-help').textContent = Q[i].h;
      $('#oq-back').disabled = i === 0;
      $('#oq-opts').innerHTML = OPTS.map(function (o, k) {
        return '<button type="button" class="sp-quiz-opt" data-v="' + o[1] + '"><span class="k">' + 'ABC'[k] + '</span>' + o[0] + '</button>';
      }).join('');
    }
    function result() {
      $('#oq-quiz').hidden = true; $('#oq-result').hidden = false;
      var total = answers.reduce(function (a, b) { return a + b; }, 0);
      var score = Math.round(total / (Q.length * 2) * 100);
      $('#oq-score').textContent = score;
      setTimeout(function () { $('#oq-ring').style.strokeDashoffset = 490 - 490 * score / 100; }, 50);
      var band = score >= 80 ? ['Running in the open', 'Your society already has strong open habits. Keep them consistent, and help the society next door.']
        : score >= 50 ? ['Opening up', 'Good foundations. A few habits would make your records much easier for every member to follow.']
          : ['Getting started', 'Every open society starts somewhere. Pick one or two habits below and begin at the next meeting.'];
      $('#oq-band').textContent = band[0];
      $('#oq-band-text').textContent = band[1];
      var plan = Q.map(function (q, k) { return { q: q, v: answers[k] }; }).filter(function (x) { return x.v < 2; })
        .sort(function (a, b) { return a.v - b.v; });
      $('#oq-plan').innerHTML = plan.length ? plan.slice(0, 5).map(function (x, k) {
        return '<li><span class="n">' + (k + 1) + '</span><div><strong>' + esc(x.q.fix[0]) + '</strong>' + esc(x.q.fix[1]) + '</div></li>';
      }).join('') : '<li><span class="n"><i class="fa-solid fa-check"></i></span><div><strong>Keep it up</strong>Consider applying for the Open Society badge and sharing your practices with neighbouring societies.</div></li>';
      root._summary = 'Our Society Openness Score: ' + score + '/100 (' + band[0] + ')\n\nNext steps:\n' +
        (plan.length ? plan.slice(0, 5).map(function (x, k) { return (k + 1) + '. ' + x.q.fix[0]; }).join('\n') : 'Keep our open habits consistent.') +
        '\n\nTake the check: https://societalpro.com/free-tools/openness-score/';
    }
    $('#oq-opts').addEventListener('click', function (e) {
      var b = e.target.closest('.sp-quiz-opt'); if (!b) return;
      answers[i] = +b.dataset.v;
      if (i < Q.length - 1) { i++; render(); } else { result(); }
    });
    $('#oq-back').addEventListener('click', function () { if (i > 0) { i--; render(); } });
    $('#oq-restart').addEventListener('click', function () {
      answers = []; i = 0; $('#oq-ring').style.strokeDashoffset = 490;
      $('#oq-result').hidden = true; $('#oq-quiz').hidden = false; render();
    });
    $('#oq-copy').addEventListener('click', function () { SP.copy(root._summary, this); });
    render();
  })();

  /* ---------------- 2. Maintenance split ---------------- */
  (function () {
    var root = $('#tool-split'); if (!root) return;
    var mode = 'equal';
    seg($('#ms-mode'), function (b) {
      mode = b.dataset.mode;
      $$('[data-show]', root).forEach(function (el) { el.hidden = el.dataset.show !== mode; });
      calc();
    });
    function roundUp(v, step) { return step <= 1 ? Math.round(v) : Math.ceil(v / step) * step; }
    function calc() {
      var total = num($('#ms-total').value), step = +$('#ms-round').value, share, rows = [], msg;
      if (mode === 'equal') {
        var flats = Math.max(1, Math.floor(num($('#ms-flats').value)));
        var exact = total / flats; share = roundUp(exact, step);
        $('#ms-label').textContent = 'Per flat, per month';
        $('#ms-sub').textContent = inr(total) + ' ÷ ' + flats + ' flats';
        rows = [['Exact share', inr(exact, 2)], ['Per flat, per year', inr(share * 12)], ['Total collected at this share', inr(share * flats)], ['Difference from budget', inr(share * flats - total)]];
        msg = 'Dear residents,\n\nThis month’s maintenance has been worked out as ' + inr(total) + ' shared equally across ' + flats + ' flats, which comes to ' + inr(share) + ' per flat.\n\nPlease pay with a note saying the month it is for. Thank you.';
      } else {
        var area = Math.max(1, num($('#ms-area-total').value)), mine = num($('#ms-area-flat').value);
        var rate = total / area; share = roundUp(rate * mine, step);
        $('#ms-label').textContent = 'Your flat, per month';
        $('#ms-sub').textContent = mine + ' sq ft × ' + inr(rate, 2) + ' per sq ft';
        rows = [['Rate per sq ft', inr(rate, 2)], ['Exact share', inr(rate * mine, 2)], ['Per year', inr(share * 12)]];
        msg = 'Dear residents,\n\nThis month’s maintenance of ' + inr(total) + ' has been shared by carpet area at ' + inr(rate, 2) + ' per sq ft. For a ' + mine + ' sq ft flat, that comes to ' + inr(share) + '.\n\nPlease pay with a note saying the month it is for. Thank you.';
      }
      $('#ms-out').textContent = inr(share);
      $('#ms-rows').innerHTML = rows.map(function (r) { return '<div><span>' + r[0] + '</span><b>' + r[1] + '</b></div>'; }).join('');
      $('#ms-msg').textContent = msg;
    }
    onInput(root, calc);
    $('#ms-copy').addEventListener('click', function () { SP.copy($('#ms-msg').textContent, this); });
    calc();
  })();

  /* ---------------- 3. Late fee ---------------- */
  (function () {
    var root = $('#tool-late'); if (!root) return;
    $('#lf-due').value = todayISO(-45); $('#lf-paid').value = todayISO(0);
    function calc() {
      var amt = num($('#lf-amt').value), rate = num($('#lf-rate').value), grace = Math.max(0, Math.floor(num($('#lf-grace').value)));
      var due = new Date($('#lf-due').value + 'T00:00:00'), upto = new Date($('#lf-paid').value + 'T00:00:00');
      var days = (isNaN(due) || isNaN(upto)) ? 0 : Math.round((upto - due) / 86400000);
      var charged = Math.max(0, days - grace);
      var fee = Math.round(amt * rate / 100 * charged / 365);
      $('#lf-out').textContent = inr(fee);
      $('#lf-sub').textContent = days <= 0 ? 'Not overdue yet.' : 'At ' + rate + '% per year for ' + charged + ' day' + (charged === 1 ? '' : 's') + '. Check your bye-laws before applying.';
      $('#lf-rows').innerHTML = [['Days overdue', Math.max(0, days)], ['Grace period', grace + ' days'], ['Days charged', charged], ['Overdue amount', inr(amt)], ['Total payable', inr(amt + fee)]]
        .map(function (r) { return '<div><span>' + r[0] + '</span><b>' + r[1] + '</b></div>'; }).join('');
      var flat = $('#lf-flat').value.trim(), forWhat = $('#lf-for').value.trim() || 'maintenance';
      $('#lf-msg').textContent = 'Hello' + (flat ? ' (' + flat + ')' : '') + ',\n\nA friendly reminder: ' + inr(amt) + ' for ' + forWhat + ' was due on ' + fmtDate($('#lf-due').value) + '.' +
        (fee > 0 ? ' As per our society’s rules, a late fee of ' + inr(fee) + ' applies up to ' + fmtDate($('#lf-paid').value) + ', making the total ' + inr(amt + fee) + '.' : '') +
        '\n\nIf you have already paid, thank you, and please ignore this message. If anything is unclear, just reply and we’ll help.\n\nThank you,\nManaging Committee';
    }
    onInput(root, calc);
    $('#lf-copy').addEventListener('click', function () { SP.copy($('#lf-msg').textContent, this); });
    calc();
  })();

  /* ---------------- 4. Monthly accounts ---------------- */
  (function () {
    var root = $('#tool-accounts'); if (!root) return;
    var KEY = 'accounts_v1';
    var DEFAULT = {
      soc: '', month: todayISO(0).slice(0, 7), open: 0,
      income: [['Maintenance collected', 150000, '60 flats'], ['Parking charges', 6000, ''], ['Clubhouse booking', 1500, 'A-302, 12th']],
      expense: [['Security agency', 42000, 'Monthly invoice'], ['Housekeeping', 24000, ''], ['Electricity (common areas)', 18500, 'Bill attached'], ['Lift AMC', 6500, 'Quarterly instalment'], ['Repairs', 3800, 'Plumber, Block C leak']],
    };
    var state = SP.store.get(KEY, null) || JSON.parse(JSON.stringify(DEFAULT));

    function rowHTML(r) {
      return '<tr><td><input type="text" value="' + esc(r[0]) + '" aria-label="Item"></td>' +
        '<td class="num"><input type="number" inputmode="decimal" value="' + (r[1] === '' ? '' : esc(r[1])) + '" aria-label="Amount"></td>' +
        '<td><input type="text" value="' + esc(r[2]) + '" aria-label="Note" placeholder="What was this for?"></td>' +
        '<td class="sp-no-print"><button type="button" class="sp-del" aria-label="Remove row"><i class="fa-solid fa-trash"></i></button></td></tr>';
    }
    function draw() {
      $('#ma-soc').value = state.soc; $('#ma-month').value = state.month; $('#ma-open').value = state.open;
      $('#ma-income tbody').innerHTML = state.income.map(rowHTML).join('');
      $('#ma-expense tbody').innerHTML = state.expense.map(rowHTML).join('');
      totals();
    }
    function read(id) {
      return $$('#' + id + ' tbody tr').map(function (tr) {
        var i = $$('input', tr); return [i[0].value, i[1].value === '' ? '' : num(i[1].value), i[2].value];
      });
    }
    function totals() {
      state.soc = $('#ma-soc').value; state.month = $('#ma-month').value; state.open = num($('#ma-open').value);
      state.income = read('ma-income'); state.expense = read('ma-expense');
      var sum = function (rows) { return rows.reduce(function (a, r) { return a + num(r[1]); }, 0); };
      var tin = sum(state.income), tout = sum(state.expense), close = state.open + tin - tout;
      $('#ma-t-open').textContent = inr(state.open); $('#ma-t-in').textContent = inr(tin);
      $('#ma-t-out').textContent = inr(tout); $('#ma-t-close').textContent = inr(close);
      $('#ma-sum-in').textContent = inr(tin); $('#ma-sum-out').textContent = inr(tout);
      var monthLabel = state.month ? new Date(state.month + '-01T00:00:00').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '';
      $('#ma-print-title').textContent = (state.soc || 'Society') + ': monthly accounts';
      $('#ma-print-sub').textContent = monthLabel;
      SP.store.set(KEY, state);
      return { tin: tin, tout: tout, close: close, monthLabel: monthLabel };
    }
    onInput(root, totals);
    root.addEventListener('click', function (e) {
      var del = e.target.closest('.sp-del');
      if (del) { del.closest('tr').remove(); totals(); return; }
      var add = e.target.closest('[data-add]');
      if (add) { $('#' + add.dataset.add + ' tbody').insertAdjacentHTML('beforeend', rowHTML(['', '', ''])); totals(); $('#' + add.dataset.add + ' tbody tr:last-child input').focus(); }
    });
    $('#ma-printbtn').addEventListener('click', function () { totals(); window.print(); });
    $('#ma-reset').addEventListener('click', function () { if (confirm('Clear this template and start again?')) { state = JSON.parse(JSON.stringify(DEFAULT)); draw(); } });
    $('#ma-csv').addEventListener('click', function () {
      var t = totals();
      var rows = [[state.soc || 'Society', t.monthLabel], [], ['Opening balance', state.open], [], ['INCOME', 'Amount (INR)', 'Note']]
        .concat(state.income.map(function (r) { return [r[0], r[1], r[2]]; }))
        .concat([['Total income', t.tin], [], ['EXPENSES', 'Amount (INR)', 'Note']])
        .concat(state.expense.map(function (r) { return [r[0], r[1], r[2]]; }))
        .concat([['Total expenses', t.tout], [], ['Closing balance', t.close]]);
      SP.download('society-accounts-' + (state.month || 'month') + '.csv', SP.csv(rows), 'text/csv;charset=utf-8');
    });
    draw();
  })();

  /* ---------------- 5. AGM checklist ---------------- */
  (function () {
    var root = $('#tool-agm'); if (!root) return;
    var KEY = 'agm_v1';
    var ITEMS = [
      ['Have the audited accounts been shared before the meeting?', 'Members need time to read the numbers before they’re asked to approve them.'],
      ['What were the biggest expenses this year, and were quotes collected?', 'Large spends are where clear notes and comparisons matter most.'],
      ['How much is in the sinking and repair funds, and where is it kept?', 'These funds protect the building’s future and belong to every member.'],
      ['How much is outstanding in dues, and how is it being followed up?', 'Ask about the total and the process, not about individual neighbours.'],
      ['Were the decisions from the last AGM carried out?', 'A decision only counts if someone follows it through.'],
      ['Which contracts are up for renewal, and how will vendors be chosen?', 'Lift AMC, security and housekeeping are usually the largest recurring costs.'],
      ['Are there pending legal, statutory or compliance matters?', 'For example conveyance, property tax, insurance, fire safety or NOCs.'],
      ['What is the repair plan and budget for next year?', 'Planning early avoids surprise collections later.'],
      ['How are decisions and minutes recorded and shared?', 'Records should outlive any one committee.'],
      ['How can members raise requests and see their status?', 'Everyone should be able to ask, and see that they’ve been heard.'],
    ];
    var done = SP.store.get(KEY, []);
    $('#agm-list').innerHTML = ITEMS.map(function (it, k) {
      return '<li><input type="checkbox" id="agm-' + k + '"' + (done[k] ? ' checked' : '') + '><label for="agm-' + k + '" style="cursor:pointer"><strong>' + (k + 1) + '. ' + esc(it[0]) + '</strong><p>' + esc(it[1]) + '</p></label></li>';
    }).join('');
    function upd() {
      done = ITEMS.map(function (_, k) { return $('#agm-' + k).checked; });
      var n = done.filter(Boolean).length;
      $('#agm-done').textContent = n; $('#agm-bar').style.width = (n * 10) + '%';
      SP.store.set(KEY, done);
    }
    root.addEventListener('change', upd);
    $('#agm-print').addEventListener('click', function () { window.print(); });
    $('#agm-copy').addEventListener('click', function () {
      SP.copy('10 questions every member should ask at the AGM\n\n' + ITEMS.map(function (it, k) { return (k + 1) + '. ' + it[0]; }).join('\n') + '\n\nFrom SocietalPro: https://societalpro.com/free-tools/agm-checklist/', this);
    });
    upd();
  })();

  /* ---------------- 6. Meeting notice & minutes ---------------- */
  (function () {
    var root = $('#tool-notice'); if (!root) return;
    var tab = 'notice';
    $('#mn-date').value = todayISO(21);
    seg($('#mn-tab'), function (b) {
      tab = b.dataset.tab;
      $$('[data-tab-show]', root).forEach(function (el) { el.hidden = el.dataset.tabShow !== tab; });
      draw();
    });
    function v(id) { return $('#' + id).value.trim(); }
    function lines(id) { return v(id).split(/\n+/).map(function (s) { return s.trim(); }).filter(Boolean); }
    function draw() {
      var soc = v('mn-soc') || 'Society name', reg = v('mn-reg'), type = v('mn-type'), agenda = lines('mn-agenda');
      var by = v('mn-by') || '______________', role = v('mn-role') || 'Hon. Secretary';
      var head = '<h2>' + esc(soc) + '</h2>' + (reg ? '<p class="center muted">' + esc(reg) + '</p>' : '');
      var html, text;
      if (tab === 'notice') {
        var days = type.indexOf('Committee') > -1 ? '' : '<p>Members are requested to attend in person. If a quorum is not present at the scheduled time, the meeting may be adjourned as per the society’s bye-laws. Supporting documents, including the accounts, are available for members to see on request.</p>';
        html = head + '<h3 class="center" style="margin-top:18px">NOTICE OF ' + esc(type.toUpperCase()) + '</h3>' +
          '<p class="center muted">Date of notice: ' + fmtDate(todayISO(0)) + '</p>' +
          '<p>Notice is hereby given that the ' + esc(type) + ' of ' + esc(soc) + ' will be held on <b>' + fmtDate(v('mn-date')) + '</b> at <b>' + fmtTime(v('mn-time')) + '</b> at <b>' + esc(v('mn-venue') || '__________') + '</b> to transact the following business:</p>' +
          '<h3>Agenda</h3><ol>' + agenda.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ol>' + days +
          '<div class="sig"><div>By order of the Managing Committee</div><div>' + esc(by) + '<br>' + esc(role) + '</div></div>';
        text = soc + (reg ? '\n' + reg : '') + '\n\nNOTICE OF ' + type.toUpperCase() + '\n\nNotice is hereby given that the ' + type + ' of ' + soc + ' will be held on ' + fmtDate(v('mn-date')) + ' at ' + fmtTime(v('mn-time')) + ' at ' + (v('mn-venue') || '__________') + ' to transact the following business:\n\nAgenda\n' +
          agenda.map(function (a, k) { return (k + 1) + '. ' + a; }).join('\n') + '\n\nBy order of the Managing Committee\n' + by + ', ' + role;
      } else {
        var dec = lines('mn-decisions'), q = v('mn-quorum') === 'yes';
        var present = v('mn-present') || '___', chair = v('mn-chair') || '______________';
        html = head + '<h3 class="center" style="margin-top:18px">MINUTES OF THE ' + esc(type.toUpperCase()) + '</h3>' +
          '<p>Held on <b>' + fmtDate(v('mn-date')) + '</b> at <b>' + fmtTime(v('mn-time')) + '</b> at <b>' + esc(v('mn-venue') || '__________') + '</b>.</p>' +
          '<p><b>Chair:</b> ' + esc(chair) + ' &nbsp;·&nbsp; <b>Members present:</b> ' + esc(present) + '</p>' +
          '<p>' + (q ? 'The quorum being present, the chair called the meeting to order.' : 'The quorum was not present. The meeting was adjourned as per the bye-laws.') + '</p>' +
          (q ? '<h3>Proceedings and decisions</h3><ol>' + agenda.map(function (a, k) { return '<li><b>' + esc(a) + '</b><br>' + esc(dec[k] || 'Decision: ____________________') + '</li>'; }).join('') + '</ol>' : '') +
          '<p>The meeting ended with a vote of thanks to the chair.</p>' +
          '<div class="sig"><div>' + esc(chair) + '<br>Chair</div><div>' + esc(by) + '<br>' + esc(role) + '</div></div>';
        text = soc + '\n\nMINUTES OF THE ' + type.toUpperCase() + '\n\nHeld on ' + fmtDate(v('mn-date')) + ' at ' + fmtTime(v('mn-time')) + ' at ' + (v('mn-venue') || '__________') + '.\nChair: ' + chair + ' · Members present: ' + present + '\n\n' +
          (q ? 'The quorum being present, the chair called the meeting to order.\n\n' + agenda.map(function (a, k) { return (k + 1) + '. ' + a + '\n   ' + (dec[k] || 'Decision: ________'); }).join('\n') : 'The quorum was not present. The meeting was adjourned as per the bye-laws.') +
          '\n\nChair: ' + chair + '\n' + role + ': ' + by;
      }
      $('#mn-doc').innerHTML = html; root._text = text;
    }
    onInput(root, draw);
    $('#mn-print').addEventListener('click', function () { window.print(); });
    $('#mn-copy').addEventListener('click', function () { SP.copy(root._text, this); });
    draw();
  })();

  /* ---------------- 7. Quorum ---------------- */
  (function () {
    var root = $('#tool-quorum'); if (!root) return;
    function calc() {
      var members = Math.max(1, Math.floor(num($('#qc-members').value))), rule = $('#qc-rule').value;
      $$('[data-rule]', root).forEach(function (el) { el.hidden = el.dataset.rule.split(' ').indexOf(rule) === -1; });
      var pctNeeded = Math.ceil(members * num($('#qc-pct').value) / 100), fixed = Math.floor(num($('#qc-fixed').value));
      var needed = rule === 'pct' ? pctNeeded : rule === 'fixed' ? fixed : Math.min(pctNeeded, fixed);
      var present = Math.floor(num($('#qc-present').value));
      var qOk = present >= needed;
      $('#qc-q-out').innerHTML = qOk ? '<span style="color:#16A34A"><i class="fa-solid fa-circle-check"></i> Met</span>' : '<span style="color:#DC2626"><i class="fa-solid fa-circle-xmark"></i> Not met</span>';
      $('#qc-q-sub').textContent = present + ' present, ' + needed + ' needed' + (qOk ? '.' : ' (' + (needed - present) + ' more).');

      var f = Math.floor(num($('#qc-for').value)), a = Math.floor(num($('#qc-against').value)), ab = Math.floor(num($('#qc-abstain').value));
      var maj = $('#qc-maj').value, cast = f + a, base, frac, label;
      if (maj.indexOf('present') === 0) { base = present; frac = 2 / 3; label = 'two-thirds of members present'; }
      else { base = cast; frac = +maj; label = frac === 0.5 ? 'more than half of votes cast' : (frac > 0.7 ? 'three-quarters' : 'two-thirds') + ' of votes cast'; }
      var need = frac === 0.5 ? Math.floor(base / 2) + 1 : Math.ceil(base * frac - 1e-9);
      var pass = qOk && f >= need && base > 0;
      $('#qc-r-out').innerHTML = !qOk ? '<span style="color:#5B6678">No valid vote</span>' : pass ? '<span style="color:#16A34A"><i class="fa-solid fa-circle-check"></i> Passes</span>' : '<span style="color:#DC2626"><i class="fa-solid fa-circle-xmark"></i> Does not pass</span>';
      $('#qc-r-sub').textContent = !qOk ? 'A resolution can’t be passed without quorum.' : f + ' for, ' + need + ' needed (' + label + ').';
      var warn = (f + a + ab > present) ? '<div><span style="color:#DC2626">Votes exceed members present</span><b>Check counts</b></div>' : '';
      $('#qc-rows').innerHTML = [['Total members', members], ['Quorum needed', needed], ['Votes cast (for + against)', cast], ['Abstentions', ab], ['Votes needed to pass', need]]
        .map(function (r) { return '<div><span>' + r[0] + '</span><b>' + r[1] + '</b></div>'; }).join('') + warn;
    }
    onInput(root, calc);
    calc();
  })();

  /* ---------------- 8. Visitor register ---------------- */
  (function () {
    var root = $('#tool-visitor'); if (!root) return;
    function draw() {
      var cols = ['Date', 'Time in', 'Visitor name', 'Flat', 'Purpose'];
      if ($('#vr-count').checked) cols.push('No.');
      if ($('#vr-vehicle').checked) cols.push('Vehicle no.');
      if ($('#vr-phone').checked) cols.push('Phone (last 4)');
      cols.push('Time out', 'Guard');
      var n = +$('#vr-rows').value, body = '';
      for (var r = 0; r < n; r++) body += '<tr>' + cols.map(function () { return '<td></td>'; }).join('') + '</tr>';
      $('#vr-doc').innerHTML = '<h2>' + esc($('#vr-soc').value || 'Society') + '</h2><p class="center muted">Visitor register · ' + esc($('#vr-gate').value || '') + ' · Page ____</p>' +
        '<table><thead><tr>' + cols.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr></thead><tbody>' + body + '</tbody></table>' +
        '<p class="muted" style="margin-top:12px">This register is kept by the Secretary for the safety of residents. Visitor details are used only for security and are not shared.</p>';
    }
    onInput(root, draw);
    $('#vr-print').addEventListener('click', function () { window.print(); });
    draw();
  })();
})();

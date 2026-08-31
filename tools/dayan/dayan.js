/* ============================================================
   大衍筮法 · logic.js
   49 蓍：分二 → 挂一 → 揲四 → 归奇，三变成爻（6/7/8/9）
   十八变成卦：本卦 + 变卦（老阳九、老阴六为动）
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };

  var vals = [];      // 爻值 6/7/8/9，自下而上
  var stepsLog = [];  // 每爻三变详情
  var busy = false;

  function isYang(v) { return v === 9 || v === 7; }
  function isMoving(v) { return v === 9 || v === 6; }
  function markOf(v) {
    if (v === 9) return '老阳 · 重 ○';
    if (v === 6) return '老阴 · 交 ×';
    if (v === 7) return '少阳 · 单';
    return '少阴 · 拆';
  }

  /* ---------- 一变：分二/挂一/揲四/归奇 ---------- */
  function oneChange(n) {
    var left = CY.randInt(n - 1) + 1;   // 分二：左手之数（1..n-1）
    var right = n - left;
    right -= 1;                          // 挂一：右手取一挟于指间
    var rl = left % 4 || 4;              // 揲四：左堆每四一数，余（无余取四）
    var rr = right % 4 || 4;             // 揲四：右堆之余
    var removed = 1 + rl + rr;           // 归奇：挂一 + 两余，非五即九（再变非四即八）
    return { left: left, rl: rl, rr: rr, removed: removed, rest: n - removed };
  }

  /* ---------- 三变成一爻 ---------- */
  function oneYao() {
    var n = 49, steps = [];
    for (var i = 0; i < 3; i++) {
      var c = oneChange(n);
      steps.push(c);
      n = c.rest;
    }
    return { val: n / 4, steps: steps, rest: n };
  }

  /* ---------- 逐爻演算 ---------- */
  function castYao(cb) {
    busy = true;
    var y = oneYao();
    setTimeout(function () {
      vals.push(y.val);
      stepsLog.push(y);
      renderProcess();
      busy = false;
      cb && cb();
    }, 420);
  }

  $('#step').addEventListener('click', function () {
    if (busy || vals.length >= 6) return;
    castYao(function () { if (vals.length >= 6) finish(); });
  });

  $('#auto').addEventListener('click', function () {
    if (busy || vals.length >= 6) return;
    step();
    function step() {
      castYao(function () {
        if (vals.length < 6) setTimeout(step, 300); else finish();
      });
    }
  });

  $('#reset').addEventListener('click', function () {
    vals = []; stepsLog = [];
    $('#process').innerHTML = '';
    $('#result').innerHTML = '';
    $('#step').disabled = false;
    $('#auto').disabled = false;
  });

  /* ---------- 过程区 ---------- */
  function renderProcess() {
    var html = '';
    for (var i = 5; i >= 0; i--) {
      if (i >= vals.length) continue;
      var v = vals[i], yang = isYang(v), mv = isMoving(v);
      var line = yang
        ? '<svg width="120" height="16" viewBox="0 0 120 16"><rect x="2" y="2" width="116" height="12" rx="2" fill="' + (mv ? 'var(--amber)' : 'var(--cyan)') + '" opacity=".9"/></svg>'
        : '<svg width="120" height="16" viewBox="0 0 120 16"><rect x="2" y="2" width="50" height="12" rx="2" fill="' + (mv ? 'var(--amber)' : 'var(--dim)') + '" opacity=".9"/><rect x="68" y="2" width="50" height="12" rx="2" fill="' + (mv ? 'var(--amber)' : 'var(--dim)') + '" opacity=".9"/></svg>';
      var s = stepsLog[i];
      /* 三变的归奇数 */
      var gui = s.steps.map(function (c, k) { return '第' + '一二三'[k] + '变归奇' + c.removed; }).join(' · ');
      html += '<div class="yao-row' + (mv ? ' move' : '') + '"><span class="yname">' + CY.yaoName(i, yang) + '</span>' +
        '<span class="yline">' + line + '</span>' +
        '<span class="ymark">' + markOf(v) + '</span>' +
        '<span class="ygod" style="color:var(--dim);font-size:11px">' + gui + '</span></div>';
    }
    $('#process').innerHTML = '<section class="panel"><h4>蓍演进程（' + vals.length + ' / 6 爻，共 ' + vals.length * 3 + ' 变）</h4>' + html + '</section>';
  }

  /* ---------- 成卦结算 ---------- */
  function finish() {
    $('#step').disabled = true;
    $('#auto').disabled = true;
    var lines = vals.map(function (v) { return isYang(v) ? 1 : 0; });
    var moving = vals.map(function (v, i) { return isMoving(v) ? i : -1; }).filter(function (i) { return i >= 0; });
    var ben = CY.guaFromLines(lines);
    var bian = moving.length ? CY.guaFromLines(CY.bianLines(lines, moving)) : null;
    var moveNames = moving.map(function (i) { return CY.yaoName(i, lines[i] === 1); }).join('、');

    var html = '<div class="res-grid">' +
      guaCard('本卦 · 现状', ben.info, lines, moving);
    if (bian) html += guaCard('变卦 · 走向', bian.info, CY.bianLines(lines, moving), []);
    html += '</div>';

    html += '<section class="panel hl"><h4>占断</h4><dl class="kv">' +
      '<dt>卦身</dt><dd>' + ben.info.name + '（' + ben.info.up + '上' + ben.info.low + '下）<span class="bdg ' + CY.luckClass(ben.info.luck) + '">' + ben.info.luck + '</span></dd>' +
      '<dt>动爻</dt><dd>' + (moving.length ? moveNames : '无动爻（六爻安静，事态平稳）') + '</dd>' +
      '<dt>蓍数</dt><dd>五十大衍，虚一不用，四十九蓍三变成爻；' +
        (moving.length ? '老阳九、老阴六发动而变' : '今无九六，七八定爻') + '</dd>' +
      '</dl><div class="divider"></div>' +
      '<p>' + ben.info.text + '</p>';
    if (bian) {
      html += '<p style="margin-top:8px;color:var(--dim)">动爻既动，其势趋向「' + bian.info.name + '」：' + bian.info.text + '</p>';
    }
    html += '<p class="note" style="margin-top:14px">断曰：' + judge(ben, bian, moving.length) + '</p></section>';
    $('#result').innerHTML = html;
  }

  function judge(ben, bian, mvCount) {
    var open = '现状如「' + ben.info.text + '」';
    if (!mvCount) return open + '；十八变而六爻皆静，无动之机，宜守常待时，短期内局势少变。';
    var chg = bian ? ' 变机既动，其势趋向「' + bian.info.text + '」' : '';
    if (mvCount >= 3) return open + '；' + chg + '。动爻过多，卦象纷乱，所问之事牵扯面广、变数大，宜拆分问题再占。';
    return open + '；' + chg + '。动爻少而清，事之脉络可循，顺势而行。';
  }

  function guaCard(title, info, lines, moving) {
    var T = function (k) { return CY.TRIS[k]; };
    return '<section class="panel"><h4>' + title + '</h4><div class="gua-box">' + CY.svgGua(lines, moving) +
      '<div class="gua-meta"><div class="gname">' + info.name + '</div>' +
      '<div class="gtris">' + T(info.up).sym + ' ' + info.up + T(info.up).nature + ' 上 · ' + T(info.low).sym + ' ' + info.low + T(info.low).nature + ' 下</div>' +
      '<span class="bdg ' + CY.luckClass(info.luck) + '">' + info.luck + '</span>' +
      '<p class="gtext" style="margin-top:8px">' + info.text + '</p></div></div></section>';
  }

  /* ---------- 纪日显示 ---------- */
  (function () {
    var gz = CY.todayGanZhi();
    $('#day').innerHTML =
      '<dt>今日</dt><dd>' + CY.fmtDate(new Date()) + ' · <b style="color:var(--cyan)">' + gz.name + '日</b>（蓍法起例可记之日辰）</dd>';
  })();
})();

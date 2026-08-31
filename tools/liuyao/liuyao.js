/* ============================================================
   六爻 · logic.js
   三枚铜钱 × 6 → 摇卦 / 动爻 / 本卦·变卦 / 六神
   爻值：9 老阳(动○)  7 少阳   8 少阴   6 老阴(动×)
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var GODS = ['青龙', '朱雀', '勾陈', '腾蛇', '白虎', '玄武'];
  var GOD_START = { '甲': 0, '乙': 0, '丙': 1, '丁': 1, '戊': 2, '己': 3, '庚': 4, '辛': 4, '壬': 5, '癸': 5 };

  var vals = [];   // 爻值 6/7/8/9，自下而上
  var busy = false;

  /* ---------- 日干自动推算（今日干支 → 选定日干 → 排六神） ---------- */
  (function initDayGan() {
    var gz = CY.todayGanZhi();
    var now = new Date();
    $('#gan').value = gz.gan; // 自动选定
    var gzWx = { '木': '木', '火': '火', '土': '土', '金': '金', '水': '水' };
    $('#rizhi').innerHTML =
      '<dt>今日</dt><dd>' + CY.fmtDate(now) + ' · <b style="color:var(--cyan)">' + gz.name + '日</b>（' + gz.gan + gzWx[gz.wx] + '）</dd>' +
      '<dt>日干</dt><dd><b>' + gz.gan + '</b> · 五行属' + gz.wx + ' · 六神自<b>' + GODS[GOD_START[gz.gan]] + '</b>起</dd>' +
      '<dt>排位</dt><dd>六十甲子第 ' + (gz.idx + 1) + ' 位 · 已自动选定日干选项</dd>';
  })();

  function godOf(i) { return GODS[(GOD_START[$('#gan').value] + i) % 6]; }
  function isYang(v) { return v === 9 || v === 7; }
  function isMoving(v) { return v === 9 || v === 6; }
  function markOf(v) {
    if (v === 9) return '老阳 · 重 ○';
    if (v === 6) return '老阴 · 交 ×';
    if (v === 7) return '少阳 · 单';
    return '少阴 · 拆';
  }

  /* ---------- 掷三枚钱 ---------- */
  function tossCoins(cb) {
    busy = true;
    var coins = [$('#c1'), $('#c2'), $('#c3')];
    coins.forEach(function (c) { c.classList.remove('b'); c.classList.add('spin'); c.textContent = '?'; });
    /* 生成三枚结果：背=1（阳面）、字=0（阴面） */
    var coinArr = coins.map(function () { return CY.coin(); });
    var backs = coinArr.reduce(function (a, b) { return a + b; }, 0);
    setTimeout(function () {
      coins.forEach(function (c, idx) {
        c.classList.remove('spin');
        var b = coinArr[idx] === 1;
        c.textContent = b ? '背' : '字';
        c.classList.toggle('b', b);
      });
      busy = false;
      cb(backs);
    }, 560);
  }

  $('#toss').addEventListener('click', function () {
    if (busy || vals.length >= 6) return;
    tossCoins(function (backs) {
      var v = [6, 7, 8, 9][backs]; // 0背=6  1背=7  2背=8  3背=9
      vals.push(v);
      renderProcess();
      if (vals.length >= 6) finish();
    });
  });

  $('#auto').addEventListener('click', function () {
    if (busy || vals.length >= 6) return;
    step();
    function step() {
      tossCoins(function (backs) {
        vals.push([6, 7, 8, 9][backs]);
        renderProcess();
        if (vals.length < 6) setTimeout(step, 260); else finish();
      });
    }
  });

  $('#reset').addEventListener('click', reset);
  function reset() {
    vals = [];
    ['#c1', '#c2', '#c3'].forEach(function (s) {
      var c = $(s); c.textContent = '?'; c.classList.remove('b', 'spin');
    });
    $('#process').innerHTML = '';
    $('#result').innerHTML = '';
    $('#toss').disabled = false;
    $('#auto').disabled = false;
  }

  /* ---------- 过程区：自上爻往下显示 ---------- */
  function renderProcess() {
    var html = '';
    for (var i = 5; i >= 0; i--) {
      if (i >= vals.length) continue;
      var v = vals[i], yang = isYang(v), mv = isMoving(v);
      var line = yang
        ? '<svg width="120" height="16" viewBox="0 0 120 16"><rect x="2" y="2" width="116" height="12" rx="2" fill="' + (mv ? 'var(--amber)' : 'var(--cyan)') + '" opacity=".9"/></svg>'
        : '<svg width="120" height="16" viewBox="0 0 120 16"><rect x="2" y="2" width="50" height="12" rx="2" fill="' + (mv ? 'var(--amber)' : 'var(--dim)') + '" opacity=".9"/><rect x="68" y="2" width="50" height="12" rx="2" fill="' + (mv ? 'var(--amber)' : 'var(--dim)') + '" opacity=".9"/></svg>';
      html += '<div class="yao-row' + (mv ? ' move' : '') + '"><span class="yname">' + CY.yaoName(i, yang) + '</span>' +
        '<span class="yline">' + line + '</span>' +
        '<span class="ygod">' + godOf(i) + '</span>' +
        '<span class="ymark">' + markOf(v) + '</span></div>';
    }
    $('#process').innerHTML = '<section class="panel"><h4>摇卦进程（' + vals.length + ' / 6）</h4>' + html + '</section>';
  }

  /* ---------- 成卦结算 ---------- */
  function finish() {
    $('#toss').disabled = true;
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

    html += '<section class="panel hl"><h4>断卦</h4><dl class="kv">' +
      '<dt>卦身</dt><dd>' + ben.info.name + '（' + ben.info.up + '上' + ben.info.low + '下）<span class="bdg ' + CY.luckClass(ben.info.luck) + '">' + ben.info.luck + '</span></dd>' +
      '<dt>动爻</dt><dd>' + (moving.length ? moveNames : '无动爻（静卦，事态平稳）') + '</dd>' +
      '<dt>六神</dt><dd>' + $('#gan').value + '日起' + GODS[GOD_START[$('#gan').value]] + '，已标注于各爻</dd>' +
      '</dl><div class="divider"></div>' +
      '<p>' + ben.info.text + '</p>';
    if (bian) {
      html += '<p style="margin-top:8px;color:var(--dim)">动爻发动，事在演进：' + ben.info.name + ' → ' + bian.info.name + '，' + bian.info.text + '</p>';
    }
    html += '<p class="note" style="margin-top:14px">断曰：' + judge(ben, bian, moving.length) + '</p></section>';

    $('#result').innerHTML = html;
  }

  function judge(ben, bian, mvCount) {
    var open = '现状如「' + ben.info.text + '」';
    if (!mvCount) return open + '；六爻安静，无动之机，宜守常待时，短期内局势少变。';
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
})();

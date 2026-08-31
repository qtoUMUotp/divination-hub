/* ============================================================
   梅花易数 · logic.js
   时间起卦 / 数字起卦 → 本卦·互卦·变卦 + 体用生克
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  var T = function (k) { return CY.TRIS[k]; };

  /* ---------- 下拉框初始化（默认当前时间） ---------- */
  var now = new Date();
  var selY = $('#t-year'), selM = $('#t-month'), selD = $('#t-day'), selH = $('#t-hour');
  ZHI.forEach(function (z, i) { selY.add(new Option((i + 1) + ' · ' + z + '年', i + 1)); });
  selY.value = ((now.getFullYear() - 4) % 12 + 12) % 12 + 1;
  var mOpt = '', dOpt = '', hOpt = '';
  for (var m = 1; m <= 12; m++) mOpt += '<option value="' + m + '">' + m + ' 月</option>';
  for (var d = 1; d <= 31; d++) dOpt += '<option value="' + d + '">' + d + ' 日</option>';
  ZHI.forEach(function (z, i) {
    var h = (i * 2 + 23) % 24, h2 = (h + 1) % 24;
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    hOpt += '<option value="' + (i + 1) + '">' + z + '时（' + p(h) + ':00–' + p(h2) + ':59）</option>';
  });
  selM.innerHTML = mOpt; selD.innerHTML = dOpt; selH.innerHTML = hOpt;
  selM.value = now.getMonth() + 1;
  selD.value = now.getDate();
  selH.value = Math.floor((now.getHours() + 1) / 2) % 12 + 1;

  /* ---------- 模式切换 ---------- */
  var mode = 'time';
  $('#tab-time').addEventListener('click', function () { switchMode('time'); });
  $('#tab-num').addEventListener('click', function () { switchMode('num'); });
  function switchMode(m) {
    mode = m;
    $('#tab-time').classList.toggle('on', m === 'time');
    $('#tab-num').classList.toggle('on', m === 'num');
    $('#mode-time').style.display = m === 'time' ? '' : 'none';
    $('#mode-num').style.display = m === 'num' ? '' : 'none';
  }

  $('#rand').addEventListener('click', function () {
    switchMode('num');
    $('#n-up').value = CY.randInt(999) + 1;
    $('#n-low').value = CY.randInt(999) + 1;
    $('#n-mv').value = '';
  });

  /* ---------- 起卦 ---------- */
  function warn(msg) { $('#result').innerHTML = '<div class="note warn">' + CY.esc(msg) + '</div>'; }
  function rem(n, k) { var r = n % k; return r === 0 ? k : r; }

  $('#go').addEventListener('click', function () {
    var upN, lowN, mvN;
    if (mode === 'time') {
      var s1 = +selY.value + +selM.value + +selD.value;
      upN = rem(s1, 8);
      lowN = rem(s1 + (+selH.value), 8);
      mvN = rem(s1 + (+selH.value), 6);
    } else {
      upN = parseInt($('#n-up').value, 10);
      lowN = parseInt($('#n-low').value, 10);
      if (!upN || upN < 1 || !lowN || lowN < 1) { warn('请输入两个正整数'); return; }
      var extra = parseInt($('#n-mv').value, 10);
      mvN = rem(extra > 0 ? extra : upN + lowN, 6);
    }
    render(upN, lowN, mvN);
  });

  /* ---------- 渲染 ---------- */
  function guaCard(title, info, lines, moving) {
    return '<section class="panel"><h4>' + title + '</h4>' +
      '<div class="gua-box">' + CY.svgGua(lines, moving) +
      '<div class="gua-meta">' +
      '<div class="gname">' + info.name + '</div>' +
      '<div class="gtris">' + T(info.up).sym + ' ' + info.up + T(info.up).nature + ' 上 · ' + T(info.low).sym + ' ' + info.low + T(info.low).nature + ' 下</div>' +
      '<span class="bdg ' + CY.luckClass(info.luck) + '">' + info.luck + '</span>' +
      '<p class="gtext" style="margin-top:8px">' + info.text + '</p>' +
      '</div></div></section>';
  }

  function render(upN, lowN, mvN) {
    var up = CY.TRIS_KEYS[upN - 1], low = CY.TRIS_KEYS[lowN - 1];
    var lines = CY.linesFrom(up, low);
    var moving = [mvN - 1]; // 爻自下而上 0-5
    var ben = CY.guaInfo(up, low);
    var hu = CY.guaFromLines(CY.huLines(lines));
    var bian = CY.guaFromLines(CY.bianLines(lines, moving));

    /* 体用：动爻在上卦（第 4-6 爻）→ 上卦为用 */
    var yongUp = mvN - 1 >= 3;
    var tiK = yongUp ? low : up, yongK = yongUp ? up : low;
    var ty = CY.tiYong(CY.TRIS[tiK].wx, CY.TRIS[yongK].wx);

    var cards =
      guaCard('本卦 · 事之现状', ben, lines, moving) +
      guaCard('互卦 · 中间过程', hu.info, CY.huLines(lines), []) +
      guaCard('变卦 · 最终走向', bian.info, CY.bianLines(lines, moving), []);

    var panel = '<section class="panel hl"><h4>卦象推演</h4><dl class="kv">' +
      '<dt>动爻</dt><dd>第 ' + mvN + ' 爻（' + CY.yaoName(mvN - 1, lines[mvN - 1] === 1) + '）动，变机在' + (yongUp ? '上卦' : '下卦') + '</dd>' +
      '<dt>上卦</dt><dd>' + up + ' ' + T(up).sym + '（' + T(up).nature + '·' + T(up).wx + '） ← 数 ' + upN + '</dd>' +
      '<dt>下卦</dt><dd>' + low + ' ' + T(low).sym + '（' + T(low).nature + '·' + T(low).wx + '） ← 数 ' + lowN + '</dd>' +
      '<dt>体卦（我方）</dt><dd>' + tiK + ' ' + T(tiK).sym + '（' + T(tiK).wx + '）</dd>' +
      '<dt>用卦（外部）</dt><dd>' + yongK + ' ' + T(yongK).sym + '（' + T(yongK).wx + '）</dd>' +
      '</dl><div class="divider"></div>' +
      '<p><span class="bdg ' + CY.luckClass(ty.lv) + '">' + ty.lv + '</span> ' + ty.t + '</p>' +
      '<p style="margin-top:8px;color:var(--dim)">综合：' + ben.name + ' → ' + bian.info.name + '，事由「' + ben.text + '」走向「' + bian.info.text + '」</p>' +
      '</section>';

    $('#result').innerHTML = '<div class="res-grid">' + cards + '</div>' + panel;
  }
})();

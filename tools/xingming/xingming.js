/* ============================================================
   姓名九宫 · logic.js
   康熙笔画 → 五格数理（81 数理）+ 三才 + 洛书九宫落星
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var ST = window.XM_DATA.STROKES;
  var NUM81 = window.XM_DATA.NUM81;
  var JG = window.XM_DATA.JIUGONG;

  var WX_TAIL = function (n) {
    var r = n % 10;
    return r === 1 || r === 2 ? '木' : r === 3 || r === 4 ? '火' : r === 5 || r === 6 ? '土' : r === 7 || r === 8 ? '金' : '水';
  };
  var SC = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  var KC = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' };
  function luckClass(g) {
    if (g === '大吉' || g === '吉') return 'b-ji';
    if (g === '凶') return 'b-xiong';
    return 'b-zhong';
  }
  function num81(n) { while (n > 81) n -= 80; return NUM81[n]; }
  function nineSum(n) {
    while (n > 9) { n = String(n).split('').reduce(function (a, c) { return a + (+c); }, 0); }
    return n;
  }

  $('#go').addEventListener('click', function () {
    var xing = $('#f-xing').value.trim();
    var ming = $('#f-ming').value.trim();
    if (!xing || !ming) { warn('请输入姓氏与名字'); return; }
    var xs = xing.split(''), ms = ming.split('');

    /* 笔画：字典 → 未收录则提示手动输入 */
    var need = [];
    xs.concat(ms).forEach(function (ch) { if (!ST[ch] && need.indexOf(ch) < 0) need.push(ch); });
    if (need.length) { manualWarn(need); return; }

    var x1 = ST[xs[0]], x2 = xs.length > 1 ? ST[xs[1]] : 0;
    var m1 = ST[ms[0]], m2 = ms.length > 1 ? ST[ms[1]] : 0;
    var doubleX = xs.length > 1, doubleM = ms.length > 1;

    var tian = doubleX ? x1 + x2 : x1 + 1;
    var ren = (doubleX ? x2 : x1) + m1;
    var di = doubleM ? m1 + m2 : m1 + 1;
    var zong = x1 + x2 + m1 + m2;
    var wai = doubleM ? m2 + 1 : (doubleX ? x1 : 2);

    render(xs, ms, [tian, ren, di, wai, zong]);
  });

  function warn(msg) { $('#result').innerHTML = '<div class="note warn">' + CY.esc(msg) + '</div>'; }
  function manualWarn(need) {
    $('#result').innerHTML =
      '<section class="panel"><h4>手动输入笔画</h4>' +
      '<p style="color:var(--dim);font-size:14px">以下字不在字典中，请查《康熙字典》笔画后填入（氵=4、艹=6、右阝=7、左阝=8）：</p>' +
      '<div class="form-grid" style="margin-top:12px;max-width:420px">' +
      need.map(function (ch, i) {
        return '<div><label class="fl">' + CY.esc(ch) + '</label><input type="number" min="1" max="36" class="stk" data-ch="' + CY.esc(ch) + '"></div>';
      }).join('') +
      '</div><div class="btn-row"><button class="btn" id="stk-ok">确认并排盘</button></div></section>';
    $('#stk-ok').addEventListener('click', function () {
      var ok = true;
      document.querySelectorAll('.stk').forEach(function (inp) {
        var v = parseInt(inp.value, 10);
        if (!v || v < 1) { ok = false; inp.style.borderColor = 'var(--red)'; return; }
        ST[inp.dataset.ch] = v;
      });
      if (!ok) return;
      $('#go').click();
    });
  }

  function render(xs, ms, g) {
    var tian = g[0], ren = g[1], di = g[2], wai = g[3], zong = g[4];
    var nT = num81(tian), nR = num81(ren), nD = num81(di), nW = num81(wai), nZ = num81(zong);

    /* 三才 */
    var wt = WX_TAIL(tian), wr = WX_TAIL(ren), wd = WX_TAIL(di);
    var rel = [];
    if (SC[wr] === wt || wt === wr) rel.push('天生人（' + wt + '→' + wr + '）顺');
    else if (KC[wr] === wt) rel.push('天生人（' + wt + '克' + wr + '）逆');
    else rel.push('天生人（' + wt + '→' + wr + '）平');
    if (SC[wr] === wd || wd === wr) rel.push('人生地（' + wr + '→' + wd + '）顺');
    else if (KC[wr] === wd) rel.push('人生地（' + wr + '克' + wd + '）逆');
    else rel.push('人生地（' + wr + '→' + wd + '）平');
    var shun = rel.filter(function (r) { return r.indexOf('顺') >= 0; }).length;

    /* 九宫落星 */
    var star = nineSum(zong);
    var j = JG[star];

    /* 总评 */
    var score = 0;
    [nR, nZ, nD, nW, nT].forEach(function (n) {
      score += n[0] === '大吉' ? 2 : n[0] === '吉' ? 1 : n[0] === '半吉' ? 0.5 : 0;
    });
    score += shun * 0.5;
    var grade = score >= 6 ? ['上', 'b-ji', '数理通泰，三才相得——传统口径中的佳名。'] :
                 score >= 3.5 ? ['中', 'b-zhong', '数理参差，有吉有瑕——可取之处为主，个别格须留意。'] :
                 ['下', 'b-xiong', '数理多滞——民俗口径下不算理想，名字只是符号，人定胜名。'];

    /* 五格表 */
    var rows = [
      ['天格 · 祖荫', tian, nT], ['人格 · 主运', ren, nR], ['地格 · 前运', di, nD],
      ['外格 · 人际', wai, nW], ['总格 · 后运', zong, nZ]
    ];
    var tb = '<table class="tb"><tr><th>格</th><th>数</th><th>吉凶</th><th>数理</th></tr>' +
      rows.map(function (r) {
        return '<tr><td class="mono">' + r[0] + '</td><td class="mono" style="color:var(--cyan);font-size:16px">' + r[1] +
          '</td><td><span class="bdg ' + luckClass(r[2][0]) + '">' + r[2][0] + '</span></td><td style="color:var(--dim)">' + r[2][1] + '</td></tr>';
      }).join('') + '</table>';

    /* 九宫格 */
    var grid = '<div class="jg">';
    var order = [4, 9, 2, 3, 5, 7, 8, 1, 6]; /* 洛书：巽东南 离南 坤西南 震东 中 兑西 艮东北 坎北 乾西北 */
    order.forEach(function (k) {
      var hit = k === star;
      var info = JG[k];
      grid += '<div class="cell' + (hit ? ' hit' : '') + '"><div class="cn">' + k + ' · ' + info[1] + '</div><div class="cs">' + (hit ? '★ ' : '') + info[0] + '</div></div>';
    });
    grid += '</div>';

    $('#result').innerHTML =
      '<h2 class="sec">' + CY.esc(xs.join('')) + CY.esc(ms.join('')) + ' · 命盘</h2>' +
      '<div class="res-grid">' +
      '<section class="panel hl"><h4>五格数理</h4>' + tb +
      '<div class="divider"></div><dl class="kv"><dt>三才</dt><dd>' + wt + ' · ' + wr + ' · ' + wd + '（' + rel.join('；') + '）</dd></dl>' +
      '</section>' +
      '<section class="panel"><h4>九宫落星 · 第' + star + '宫</h4>' + grid +
      '<div class="divider"></div><dl class="kv">' +
      '<dt>落星</dt><dd>' + j[0] + '（' + j[1] + '）</dd>' +
      '<dt>方位</dt><dd>' + j[2] + '</dd>' +
      '<dt>宫性</dt><dd><span class="bdg ' + (j[3] === '吉' || j[3] === '大吉' ? 'b-ji' : j[3] === '小凶' ? 'b-zhong' : 'b-xiong') + '">' + j[3] + '</span></dd>' +
      '<dt>星性</dt><dd>' + j[4] + '</dd></dl></section>' +
      '</div>' +
      '<section class="panel hl" style="margin-top:16px"><h4>总评</h4>' +
      '<p><span class="bdg ' + grade[1] + '" style="font-size:14px;padding:4px 16px">' + grade[0] + '评</span> ' + grade[2] + '</p>' +
      '<p class="note" style="margin-top:12px">人格 ' + ren + '（' + nR[0] + '）为主，总格 ' + zong + '（' + nZ[0] + '）为辅——传统姓名学以这两格最重要。</p></section>';
  }
})();

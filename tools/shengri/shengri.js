/* ============================================================
   生日洛书九宫 · logic.js
   生日八位数字 → 1-9 出现次数 → 洛书九宫落位
   洛书排布：4 9 2 / 3 5 7 / 8 1 6（戴九履一，左三右七）
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };

  /* 洛书九宫：三行，每宫一个数字 */
  var GRID = [[4, 9, 2], [3, 5, 7], [8, 1, 6]];
  var POS = { 4: '东南 · 巽', 9: '正南 · 离', 2: '西南 · 坤', 3: '正东 · 震', 5: '中宫', 7: '正西 · 兑', 8: '东北 · 艮', 1: '正北 · 坎', 6: '西北 · 乾' };

  var MEAN = {
    1: { t: '独立 · 开创 · 领导', d: '1 多的人自主早、敢开头，容易独断；缺 1 者宜练主见与担当。' },
    2: { t: '敏感 · 合作 · 平衡', d: '2 多的人体贴、善协调，也易受他人情绪牵动；缺 2 者宜学倾听与配合。' },
    3: { t: '表达 · 创意 · 社交', d: '3 多的人能说会写、点子多，易散而不聚焦；缺 3 者宜练表达自己。' },
    4: { t: '秩序 · 务实 · 稳健', d: '4 多的人重规则与执行力，易固守成规；缺 4 者宜建立秩序感与坚持。' },
    5: { t: '自由 · 变化 · 冒险', d: '5 多的人爱自由、接受变化，易不安定；缺 5 者宜主动求变、敢试错。' },
    6: { t: '责任 · 关怀 · 家庭', d: '6 多的人重情义与责任，易过度付出；缺 6 者宜学关心与承诺。' },
    7: { t: '分析 · 求真 · 内省', d: '7 多的人好钻研、直觉敏锐，易想多行少；缺 7 者宜练独立思考。' },
    8: { t: '权力 · 财富 · 执行', d: '8 多的人务实重结果、能扛事，易贪功急进；缺 8 者宜练金钱与目标感。' },
    9: { t: '博爱 · 智慧 · 理想', d: '9 多的人格局大、心怀天下，易空想不落地；缺 9 者宜扩视野、存大志。' }
  };

  $('#go').addEventListener('click', function () {
    var y = parseInt($('#y').value, 10), m = parseInt($('#m').value, 10), d = parseInt($('#d').value, 10);
    if (!y || y < 1900 || y > 2100 || !m || m < 1 || m > 12 || !d || d < 1 || d > 31) {
      $('#result').innerHTML = '<section class="panel"><p style="color:var(--mag)">请输入完整的公历生日（年 1900–2100）。</p></section>';
      return;
    }
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    var digits = ('' + y + p(m) + p(d)).split('').map(Number);
    var count = {};
    for (var i = 1; i <= 9; i++) count[i] = 0;
    var zeros = 0;
    digits.forEach(function (dg) { if (dg === 0) zeros++; else count[dg]++; });

    /* 主命数：全部数字相加，缩到一位 */
    var sum = digits.reduce(function (a, b) { return a + b; }, 0);
    while (sum > 9) sum = String(sum).split('').reduce(function (a, b) { return a + Number(b); }, 0);

    render(count, zeros, sum, y + '-' + p(m) + '-' + p(d));
  });

  function render(count, zeros, mainNum, dateStr) {
    var max = 0;
    for (var i = 1; i <= 9; i++) if (count[i] > max) max = count[i];

    var cells = '';
    GRID.forEach(function (row) {
      row.forEach(function (no) {
        var c = count[no], miss = c === 0;
        var dots = '';
        for (var k = 0; k < c; k++) dots += '●';
        cells += '<div class="ls-cell' + (no === 5 ? ' center' : '') + (miss ? ' miss' : '') + '">' +
          '<span class="ls-pos">' + POS[no] + '</span>' +
          '<div class="ls-no">' + no + (miss ? ' <span style="font-size:12px">缺</span>' : '') + '</div>' +
          '<div class="ls-dots">' + (miss ? '—' : dots) + '</div>' +
          '<div class="ls-mt">' + (miss ? '此处留白' : MEAN[no].t.split(' · ')[0] + ' ×' + c) + '</div>' +
          '</div>';
      });
    });

    var missList = [];
    for (var j = 1; j <= 9; j++) if (count[j] === 0) missList.push(j);
    var strongList = [];
    for (var k2 = 1; k2 <= 9; k2++) if (count[k2] >= 2) strongList.push(k2);

    var missHtml = missList.length
      ? '<dd>' + missList.map(function (n) { return '<b style="color:var(--mag)">' + n + '</b>（' + MEAN[n].t + '）：' + MEAN[n].d; }).join('<br>') + '</dd>'
      : '<dd>九数俱全，能量分布均匀，无明显课题。</dd>';
    var strongHtml = strongList.length
      ? '<dd>' + strongList.map(function (n) { return '<b style="color:var(--cyan)">' + n + '</b> ×' + count[n] + '：' + MEAN[n].t; }).join('<br>') + '</dd>'
      : '<dd>各数出现均不超过一次，气质分散而不偏科。</dd>';

    $('#result').innerHTML =
      '<section class="panel hl"><h4>洛书落宫 · ' + dateStr + '</h4>' +
      '<div class="ls-grid">' + cells + '</div>' +
      '<p class="note" style="text-align:center">数字 0 不入洛书（共 ' + zeros + ' 个）——0 象"空"，在九宫体系中视为圆满之数，不落宫。</p>' +
      '</section>' +
      '<section class="panel"><h4>数位解读</h4><dl class="kv">' +
      '<dt>主命数</dt><dd><b style="color:var(--amber);font-size:18px">' + mainNum + '</b> · ' + MEAN[mainNum].t + ' —— ' + MEAN[mainNum].d + '</dd>' +
      '<dt>强势数</dt>' + strongHtml +
      '<dt>缺数（课题）</dt>' + missHtml +
      '</dl><div class="divider"></div>' +
      '<p class="note">缺数不是缺陷而是"此生功课"：数字能量学的看法是——缺什么，就先用什么补什么，主动练习即成优势。强数越多越要防过犹不及。</p></section>';
  }
})();

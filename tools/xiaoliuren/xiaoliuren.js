/* ============================================================
   小六壬（马前课） · logic.js
   月→日→时 依次落宫，六宫：大安 留连 速喜 赤口 小吉 空亡
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  /* ---------- 六宫数据 ---------- */
  var PAL = [
    { name: '大安', luck: '吉', wx: '木', speed: '迟慢', god: '青龙',
      total: '身未动，事安稳，贵人相扶，谋事虽缓必成。',
      fine: { 财: '财运平稳，渐入佳境。', 情: '感情安稳，宜守宜缓。', 行: '出行平安，行程稍缓。', 病: '病情稳定，缓缓向愈。', 物: '失物未远，可寻回。' } },
    { name: '留连', luck: '凶', wx: '水', speed: '拖延', god: '玄武',
      total: '事多拖延，反复纠缠，人未归，信未至，宜耐心。',
      fine: { 财: '财有纠缠，迟得或有反复。', 情: '旧情牵连，藕断丝连。', 行: '行程延误，原地滞留。', 病: '病情缠绵，迁延未愈。', 物: '失物难寻，或在北方。' } },
    { name: '速喜', luck: '吉', wx: '火', speed: '迅速', god: '朱雀',
      total: '喜事将至，音信立到，立等可成，宜速不宜迟。',
      fine: { 财: '财运即至，速有进项。', 情: '喜讯快至，宜表白。', 行: '出行顺利，一路顺风。', 病: '可愈之象，宜速就医。', 物: '失物速寻，南方可觅。' } },
    { name: '赤口', luck: '凶', wx: '金', speed: '口舌', god: '白虎',
      total: '口舌是非，争执官讼，宜慎言避锋，忍让为上。',
      fine: { 财: '防因口失财，谨慎交易。', 情: '多口角，宜冷静沟通。', 行: '出行有阻，防口舌争执。', 病: '病情反复，防意外伤。', 物: '失物难寻，防人藏匿。' } },
    { name: '小吉', luck: '吉', wx: '木', speed: '和合', god: '六合',
      total: '和合吉利，将门有喜，婚恋皆宜，事可商量。',
      fine: { 财: '小有进财，和气生财。', 情: '婚恋大吉，良缘可期。', 行: '出行遇贵人，半路有喜。', 病: '小恙无碍，安心调养。', 物: '失物可寻，或将自回。' } },
    { name: '空亡', luck: '凶', wx: '土', speed: '落空', god: '勾陈',
      total: '事多落空，信音稀疏，徒劳无功，不宜强求。',
      fine: { 财: '财落空，防破耗。', 情: '缘分未到，强求无益。', 行: '出行受阻，计划生变。', 病: '病势虚象，宜详察。', 物: '失物难回，勿再寻。' } }
  ];

  /* ---------- 初始化下拉框 ---------- */
  var now = new Date();
  var mOpt = '', dOpt = '', hOpt = '';
  for (var m = 1; m <= 12; m++) mOpt += '<option value="' + m + '">' + m + ' 月</option>';
  for (var d = 1; d <= 31; d++) dOpt += '<option value="' + d + '">' + d + ' 日</option>';
  ZHI.forEach(function (z, i) { hOpt += '<option value="' + (i + 1) + '">' + z + '时</option>'; });
  $('#k-month').innerHTML = mOpt;
  $('#k-day').innerHTML = dOpt;
  $('#k-hour').innerHTML = hOpt;
  $('#k-month').value = now.getMonth() + 1;
  $('#k-day').value = now.getDate();
  $('#k-hour').value = Math.floor((now.getHours() + 1) / 2) % 12 + 1;

  $('#now').addEventListener('click', function () {
    $('#k-month').value = now.getMonth() + 1;
    $('#k-day').value = now.getDate();
    $('#k-hour').value = Math.floor((now.getHours() + 1) / 2) % 12 + 1;
  });

  /* ---------- 六宫常显 ---------- */
  function renderGrid(hits) {
    hits = hits || {};
    var html = PAL.map(function (p, i) {
      var cls = 'pal';
      if (hits.m === i) cls += ' step';
      if (hits.d === i) cls += ' step';
      if (hits.h === i) cls += ' final';
      return '<div class="' + cls + '" id="pal-' + i + '"><div class="pn">' + p.name +
        '</div><div class="pl" style="color:' + (p.luck === '吉' ? 'var(--grn)' : 'var(--red)') + '">' + p.god + ' · ' + p.luck + '</div></div>';
    }).join('');
    $('#pal-grid').innerHTML = html;
  }
  renderGrid();

  /* ---------- 起课 ---------- */
  $('#go').addEventListener('click', function () {
    var mo = +$('#k-month').value, d = +$('#k-day').value, h = +$('#k-hour').value;
    var iM = (mo - 1) % 6, iD = (iM + d - 1) % 6, iH = (iD + h - 1) % 6;
    renderGrid({});
    $('#result').innerHTML = '';

    /* 动画：月 → 日 → 时 依次点亮 */
    var steps = [
      { delay: 0, hits: { m: iM } },
      { delay: 700, hits: { m: iM, d: iD } },
      { delay: 1400, hits: { m: iM, d: iD, h: iH } }
    ];
    steps.forEach(function (s) {
      setTimeout(function () { renderGrid(s.hits); }, s.delay);
    });
    setTimeout(function () { showResult(iM, iD, iH, { mo: mo, d: d, h: h }); }, 2100);
  });

  function showResult(iM, iD, iH, inp) {
    var p = PAL[iH];
    var hitName = function (i) { return PAL[i].name; };
    var fine = '';
    ['财', '情', '行', '病', '物'].forEach(function (k) {
      fine += '<dt>' + k + '</dt><dd>' + p.fine[k] + '</dd>';
    });
    var hh = ZHI[inp.h - 1];
    $('#result').innerHTML =
      '<section class="panel hl"><h4>落宫断语</h4>' +
      '<div class="big-word" style="color:' + (p.luck === '吉' ? 'var(--cyan)' : 'var(--mag)') + '">' + p.name + '</div>' +
      '<p style="text-align:center;margin:6px 0 2px"><span class="bdg ' + (p.luck === '吉' ? 'b-ji' : 'b-xiong') + '">' + p.luck + '</span>' +
      ' <span class="bdg b-cy">' + p.god + '</span> <span class="bdg b-zhong">' + p.wx + '</span> <span class="bdg b-mg">' + p.speed + '</span></p>' +
      '<p style="text-align:center;color:var(--dim);font-family:var(--mono);font-size:13px">' + inp.mo + '月 → ' + hitName(iM) + ' ／ ' + inp.d + '日 → ' + hitName(iD) + ' ／ ' + hh + '时 → ' + p.name + '</p>' +
      '<div class="divider"></div>' +
      '<p style="text-align:center;font-size:17px">' + p.total + '</p>' +
      '<div class="divider"></div>' +
      '<dl class="kv"><dt>求财</dt><dd>' + p.fine.财 + '</dd><dt>感情</dt><dd>' + p.fine.情 + '</dd>' +
      '<dt>出行</dt><dd>' + p.fine.行 + '</dd><dt>疾病</dt><dd>' + p.fine.病 + '</dd><dt>寻物</dt><dd>' + p.fine.物 + '</dd></dl>' +
      '</section>';
  }
})();

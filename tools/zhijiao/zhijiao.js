/* ============================================================
   掷筊 · logic.js
   双筊（一平一凸）→ 圣筊 / 笑筊 / 阴筊 + 连掷记录
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };

  var RESULTS = {
    sheng: { name: '圣筊', cls: 'b-ji', head: '一阳一阴 · 允准',
      text: '筊象分明，所问之事可行，方向正确。既得允准，宜笃定行之，不再反复。' },
    xiao:  { name: '笑筊', cls: 'b-zhong', head: '两阳 · 未置可否',
      text: '神明含笑不答：或所问不清，或时机未到。宜厘清问题、端正心念后再掷，忌连续催问。' },
    yin:   { name: '阴筊', cls: 'b-xiong', head: '两阴 · 不允',
      text: '筊象沉沉，所问之事不宜行，或另有更妥之路。强求无益，宜退而再思。' }
  };

  var busy = false;
  var log = [];      // { type, time }
  var shengRun = 0;  // 连续圣筊计数

  $('#toss').addEventListener('click', function () {
    if (busy) return;
    busy = true;
    var j1 = $('#j1'), j2 = $('#j2');
    [j1, j2].forEach(function (j) { j.classList.remove('yang', 'yin'); j.classList.add('spin'); j.textContent = '筊'; });
    /* 1 = 阳面（平面朝上） 0 = 阴面（凸面朝上） */
    var a = CY.coin(), b = CY.coin();
    setTimeout(function () {
      [j1, j2].forEach(function (j, i) {
        j.classList.remove('spin');
        var yang = (i === 0 ? a : b) === 1;
        j.classList.add(yang ? 'yang' : 'yin');
        j.textContent = yang ? '阳' : '阴';
      });
      var sum = a + b;
      var type = sum === 1 ? 'sheng' : (sum === 2 ? 'xiao' : 'yin');
      if (type === 'sheng') shengRun++; else shengRun = 0;
      log.unshift({ type: type, shengRun: shengRun });
      render(type);
      busy = false;
    }, 680);
  });

  $('#reset').addEventListener('click', function () {
    log = []; shengRun = 0;
    $('#result').innerHTML = '';
    [$('#j1'), $('#j2')].forEach(function (j) { j.classList.remove('yang', 'yin', 'spin'); j.textContent = '筊'; });
  });

  function render(type) {
    var r = RESULTS[type];
    var extra = '';
    if (type === 'sheng' && shengRun >= 3) {
      extra = '<p style="margin-top:10px;color:var(--cyan)"><b>连得三圣！</b>确据已成，事可定夺。</p>';
    }
    var items = log.slice(0, 12).map(function (e, i) {
      var rr = RESULTS[e.type];
      return '<span class="bdg ' + rr.cls + '" style="font-size:12px;padding:2px 10px;margin:2px">' +
        (i === 0 ? '最新 ' : '') + rr.name + (e.shengRun >= 3 ? '×' + e.shengRun : '') + '</span>';
    }).join(' ');
    $('#result').innerHTML =
      '<section class="panel hl"><h4>筊象</h4>' +
      '<p style="text-align:center;font-size:18px;letter-spacing:4px"><span class="bdg ' + r.cls + '" style="font-size:16px;padding:6px 22px">' + r.name + '</span></p>' +
      '<p style="text-align:center;color:var(--dim);margin-top:6px">' + r.head + '</p>' +
      '<div class="divider"></div>' +
      '<p>' + r.text + '</p>' + extra +
      (log.length > 1 ? '<div class="divider"></div><dt style="color:var(--dim);font-size:12px">本组掷筊记录</dt><div style="margin-top:6px">' + items + '</div>' : '') +
      '</section>';
  }
})();

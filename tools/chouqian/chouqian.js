/* ============================================================
   抽签 · logic.js
   摇签动画 → 六十灵签取一支 → 签诗 + 解曰
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var Q = window.QIAN_DATA;

  function luckClass(g) {
    if (g.indexOf('上') >= 0 && g !== '中下') return 'b-ji';
    if (g === '中下') return 'b-zhong';
    if (g === '中' || g === '中吉' || g === '中平') return 'b-zhong';
    return 'b-xiong';
  }

  var busy = false;
  $('#go').addEventListener('click', function () {
    if (busy) return;
    busy = true;
    var tube = $('#tube');
    $('#result').innerHTML = '';
    tube.classList.add('shake');
    setTimeout(function () {
      tube.classList.remove('shake');
      var q = Q[CY.randInt(Q.length)];
      show(q);
      busy = false;
    }, 1400);
  });

  function show(q) {
    var v = q.v.split('，');
    var verse = v.map(function (line) { return line + '<br>'; }).join('');
    $('#result').innerHTML =
      '<section class="panel hl"><h4>灵签已出</h4>' +
      '<div class="qian-no">第 ' + q.n + ' 签 · ' + q.g + '</div>' +
      '<div class="qian-verse">' + verse + '</div>' +
      '<p style="text-align:center"><span class="bdg ' + luckClass(q.g) + '" style="font-size:14px;padding:4px 16px">' + q.g + '</span></p>' +
      '<div class="divider"></div>' +
      '<dl class="kv" style="max-width:480px;margin:0 auto"><dt>解曰</dt><dd>' + q.j + '</dd>' +
      '<dt>提示</dt><dd>签诗取意象印证处境，吉签宜把握，凶签重警示——规避即是化吉。</dd></dl>' +
      '</section>';
  }
})();

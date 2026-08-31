/* ============================================================
   吕祖灵签 · logic.js
   摇签动画 → 百签取一支 → 古人典故 + 签文 + 解曰
   等第由解曰关键词推断（吕祖签通行版无固定等第）
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var Q = window.LZ_DATA;

  function grade(q) {
    var t = q.j + q.v;
    if (/不吉|大凶|凶之象|绝望|不祥|难圆|皆不利|万事如灰/.test(t)) return { g: '凶', c: 'b-xiong' };
    if (/大吉|凡事皆吉|每事大吉|无往不利|吉庆/.test(t)) return { g: '吉', c: 'b-ji' };
    return { g: '中', c: 'b-zhong' };
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
      show(Q[CY.randInt(Q.length)]);
      busy = false;
    }, 1400);
  });

  function show(q) {
    var gr = grade(q);
    var verse = q.v.split('，').map(function (line) { return line + '<br>'; }).join('');
    $('#result').innerHTML =
      '<section class="panel hl"><h4>吕祖灵签已出</h4>' +
      '<div class="qian-no">第 ' + q.n + ' 签 · 古人 ' + q.t + '</div>' +
      '<div class="qian-verse">' + verse + '</div>' +
      '<p style="text-align:center"><span class="bdg ' + gr.c + '" style="font-size:14px;padding:4px 16px">' + gr.g + '</span></p>' +
      '<div class="divider"></div>' +
      '<dl class="kv" style="max-width:480px;margin:0 auto"><dt>解曰</dt><dd>' + q.j + '</dd>' +
      '<dt>提示</dt><dd>签上"等第"由解曰关键词推断（吕祖签通行版不标等第）。典故是签眼——先读故事处境，再映照自身。</dd></dl>' +
      '</section>';
  }
})();

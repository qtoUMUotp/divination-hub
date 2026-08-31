/* ============================================================
   塔罗 · logic.js
   牌库 / 牌阵 / 正逆位 → 位置化解读
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var D = window.TAROT_DATA;

  /* ---------- 牌阵下拉 ---------- */
  var spOpt = '';
  D.SPREADS.forEach(function (s) { spOpt += '<option value="' + s.id + '">' + s.name + '</option>'; });
  $('#spread').innerHTML = spOpt;

  /* ---------- 抽牌（无重复） ---------- */
  function draw(deck, n, allowRev) {
    var idx = deck.map(function (_, i) { return i; });
    /* 洗牌：Fisher-Yates，用加密随机数 */
    for (var i = idx.length - 1; i > 0; i--) {
      var j = CY.randInt(i + 1);
      var t = idx[i]; idx[i] = idx[j]; idx[j] = t;
    }
    return idx.slice(0, n).map(function (k) {
      var c = Object.assign({}, deck[k]);
      c.reversed = allowRev ? CY.coin() === 1 : false;
      return c;
    });
  }

  /* ---------- 牌面渲染 ---------- */
  function cardHTML(c, pos) {
    var rev = c.reversed;
    var keys = rev ? c.rev : c.up;
    var tag = c.type === 'major' ? 'MAJOR ' + c.no : c.suitName + ' · ' + (c.el || '');
    return '<div class="tcard-wrap">' +
      '<div class="pos-tag">「' + pos + '」</div>' +
      '<div class="tcard' + (rev ? ' rev' : '') + '">' +
      '<div class="tno">' + (c.no !== '' ? c.no : '◈') + '</div>' +
      '<div class="tsym">' + c.sym + '</div>' +
      '<div class="tnm">' + c.name + (rev ? ' ⇅' : '') + '</div>' +
      '</div>' +
      '<div class="tname">' + c.name + ' <span class="bdg ' + (rev ? 'b-mg' : 'b-cy') + '">' + (rev ? '逆位' : '正位') + '</span></div>' +
      '<div class="tkeys mono">' + tag + '</div>' +
      '<div class="tkeys" style="color:var(--txt);margin-top:4px">' + keys + '</div>' +
      '</div>';
  }

  $('#go').addEventListener('click', function () {
    var sp = D.SPREADS.filter(function (s) { return s.id === $('#spread').value; })[0];
    var deckAll = D.buildDeck();
    var deck = $('#deck').value === 'major' ? deckAll.filter(function (c) { return c.type === 'major'; }) : deckAll;
    var cards = draw(deck, sp.positions.length, $('#rev').checked);

    var html = '<h2 class="sec">' + sp.name + ' · 抽牌结果</h2><div class="spread-grid">';
    cards.forEach(function (c, i) {
      html += cardHTML(c, sp.positions[i]);
    });
    html += '</div>';

    /* 整体氛围 */
    var majors = cards.filter(function (c) { return c.type === 'major'; }).length;
    var revs = cards.filter(function (c) { return c.reversed; }).length;
    var mood = [];
    if (majors >= Math.ceil(cards.length / 2)) mood.push('大阿卡纳过半——深层原型力量主导，事情触及命运课题而非日常琐事。');
    else if (cards.length > 1) mood.push('小阿卡纳为主——事情更多落在日常、人际与具体事务层面。');
    if (revs === 0) mood.push('无逆位——能量流通顺畅。');
    else if (revs >= Math.ceil(cards.length / 2)) mood.push('逆位过半——能量多处受阻，宜放缓节奏、先理顺内在。');
    else mood.push('有 ' + revs + ' 张逆位——个别环节有阻力。');

    html += '<section class="panel hl" style="margin-top:16px"><h4>整体氛围</h4><p>' + mood.join('') + '</p>' +
      '<p class="note" style="margin-top:12px">解读顺序：先看「结局/未来」定走向，再回看「现状/阻碍」找原因；牌义是钥匙，问题才是锁。</p></section>';

    $('#result').innerHTML = html;
  });
})();

/* ============================================================
   core.js — 全站核心：随机数 / 八卦·六十四卦引擎 / 导航注入
   各工具 logic.js 通过 window.CY 调用，避免重复实现
   ============================================================ */
(function () {
  'use strict';
  var CY = (window.CY = {});

  /* ---------- 相对路径基准（工具页在 /tools/ 下需回退两级） ---------- */
  CY.base = /\/tools\//.test(location.pathname) ? '../..' : '.';

  /* ---------- 随机数（crypto，无偏） ---------- */
  CY.randInt = function (n) {
    if (n <= 1) return 0;
    var max = Math.floor(0xffffffff / n) * n;
    var a = new Uint32Array(1), v;
    do { crypto.getRandomValues(a); v = a[0]; } while (v >= max);
    return v % n;
  };
  CY.pick = function (arr) { return arr[CY.randInt(arr.length)]; };
  CY.coin = function () { return CY.randInt(2); }; // 1=背(阳) 0=字(阴)

  /* ---------- 八卦（lines 自下而上，1=阳 0=阴） ---------- */
  var TRIS = {
    '乾': { sym: '☰', lines: [1, 1, 1], wx: '金', nature: '天' },
    '兑': { sym: '☱', lines: [1, 1, 0], wx: '金', nature: '泽' },
    '离': { sym: '☲', lines: [1, 0, 1], wx: '火', nature: '火' },
    '震': { sym: '☳', lines: [1, 0, 0], wx: '木', nature: '雷' },
    '巽': { sym: '☴', lines: [0, 1, 1], wx: '木', nature: '风' },
    '坎': { sym: '☵', lines: [0, 1, 0], wx: '水', nature: '水' },
    '艮': { sym: '☶', lines: [0, 0, 1], wx: '土', nature: '山' },
    '坤': { sym: '☷', lines: [0, 0, 0], wx: '土', nature: '地' }
  };
  CY.TRIS = TRIS;
  CY.TRIS_KEYS = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤']; // 模 8 取卦，余 0 为 8（坤）

  /* ---------- 六十四卦 [上卦, 下卦, 卦名, 断辞, 吉凶] ---------- */
  var GUA = [
    ['乾', '乾', '乾为天', '刚健中正，龙德在天，大有可为。', '大吉'],
    ['坤', '坤', '坤为地', '厚德载物，顺势包容，宜静不宜动。', '吉'],
    ['坎', '震', '水雷屯', '万物始生，初创艰难，守正待时。', '凶'],
    ['艮', '坎', '山水蒙', '蒙昧初开，宜求师问学，不可冒进。', '中'],
    ['坎', '乾', '水天需', '云上于天，待时而动，饮食宴乐。', '中吉'],
    ['乾', '坎', '天水讼', '天水违行，争讼之象，宜和不宜争。', '凶'],
    ['坤', '坎', '地水师', '行险而顺，统兵征战，纪律为先。', '中吉'],
    ['坎', '坤', '水地比', '水行地上，亲比依附，众人相助。', '吉'],
    ['巽', '乾', '风天小畜', '密云不雨，小有积蓄，力未足须等待。', '中吉'],
    ['乾', '兑', '天泽履', '履虎尾而不咬，谨慎前行可无事。', '中吉'],
    ['坤', '乾', '地天泰', '天地交泰，通达安泰，三阳开泰。', '大吉'],
    ['乾', '坤', '天地否', '天地不交，闭塞不通，小人当道。', '凶'],
    ['乾', '离', '天火同人', '二人同心，其利断金，同志相聚。', '吉'],
    ['离', '乾', '火天大有', '火在天上，盛大丰有，如日中天。', '大吉'],
    ['坤', '艮', '地山谦', '山藏地中，谦卑下人，谦谦君子。', '吉'],
    ['震', '坤', '雷地豫', '雷出地奋，喜悦顺动，安乐备至。', '吉'],
    ['兑', '震', '泽雷随', '泽中有雷，随时而动，随缘而行。', '吉'],
    ['艮', '巽', '山风蛊', '山下有风，积弊须整，治乱兴革。', '中'],
    ['坤', '兑', '地泽临', '泽上有地，上临下视，君临天下。', '吉'],
    ['巽', '坤', '风地观', '风行地上，观察省视，以德服人。', '中吉'],
    ['离', '震', '火雷噬嗑', '口中有物，咬而合之，须断是非。', '中'],
    ['艮', '离', '山火贲', '山下有火，文饰之象，外美内质。', '中吉'],
    ['艮', '坤', '山地剥', '山附于地，剥落衰减，阴盛阳衰。', '凶'],
    ['坤', '震', '地雷复', '雷在地中，一阳来复，转机初现。', '吉'],
    ['乾', '震', '天雷无妄', '天下雷行，不妄为则吉，妄动有灾。', '中吉'],
    ['艮', '乾', '山天大畜', '天在山中，大有蓄积，厚积薄发。', '大吉'],
    ['艮', '震', '山雷颐', '山下有雷，颐养之道，慎言节食。', '中吉'],
    ['兑', '巽', '泽风大过', '泽灭木，大为过越，非常之举须慎。', '凶'],
    ['坎', '坎', '坎为水', '重重险陷，外险内险，惟心亨通。', '凶'],
    ['离', '离', '离为火', '明两作离，附丽光明，虚心亨通。', '吉'],
    ['兑', '艮', '泽山咸', '山上有泽，感应相交，心心相印。', '吉'],
    ['震', '巽', '雷风恒', '雷风相与，恒久不变，持之以恒。', '吉'],
    ['乾', '艮', '天山遁', '天下有山，退避之时，君子远小人。', '中'],
    ['震', '乾', '雷天大壮', '雷在天上，声势壮大，过刚易折。', '吉'],
    ['离', '坤', '火地晋', '明出地上，晋升前进，蒸蒸日上。', '吉'],
    ['坤', '离', '地火明夷', '明入地中，光明受损，晦而再晦。', '凶'],
    ['巽', '离', '风火家人', '风自火出，家人同心，各正其位。', '吉'],
    ['离', '兑', '火泽睽', '上火下泽，乖背离异，同中有异。', '凶'],
    ['坎', '艮', '水山蹇', '山上有水，前行艰难，宜返身修德。', '凶'],
    ['震', '坎', '雷水解', '雷雨作解，解除困难，赦过宥罪。', '中吉'],
    ['艮', '兑', '山泽损', '山下有泽，损上益下，损中有得。', '中'],
    ['巽', '震', '风雷益', '风雷相助，损上益下，大有裨益。', '吉'],
    ['兑', '乾', '泽天夬', '泽上于天，决断去小人，刚决果行。', '中吉'],
    ['乾', '巽', '天风姤', '天下有风，不期而遇，阴长须防。', '中'],
    ['兑', '坤', '泽地萃', '泽上于地，荟萃聚集，英杰共事。', '吉'],
    ['坤', '巽', '地风升', '地中生木，步步高升，积小成高。', '吉'],
    ['兑', '坎', '泽水困', '泽无水困，穷困之象，困而弥坚。', '凶'],
    ['坎', '巽', '水风井', '木上有水，井养不穷，守恒供应。', '中吉'],
    ['兑', '离', '泽火革', '泽中有火，变革之象，改旧换新。', '中吉'],
    ['离', '巽', '火风鼎', '木上有火，鼎新调养，成器之象。', '吉'],
    ['震', '震', '震为雷', '洊雷震动，动而亨通，恐惧修省。', '吉'],
    ['艮', '艮', '艮为山', '兼山艮止，知止则定，宜静不宜动。', '中吉'],
    ['巽', '艮', '风山渐', '山上有木，循序渐进，欲速不达。', '吉'],
    ['震', '兑', '雷泽归妹', '泽上有雷，归妹失位，行为不当。', '凶'],
    ['震', '离', '雷火丰', '雷电皆至，丰盛至极，丰中藏忧。', '吉'],
    ['离', '艮', '火山旅', '火在山上，旅行在外，漂泊不定。', '中'],
    ['巽', '巽', '巽为风', '随风巽入，谦逊顺从，申命行事。', '中吉'],
    ['兑', '兑', '兑为泽', '丽泽相滋，喜悦相通，朋友讲习。', '吉'],
    ['巽', '坎', '风水涣', '风行水上，涣散离析，宜聚不宜散。', '中'],
    ['坎', '兑', '水泽节', '泽上有水，节制有度，苦节不可贞。', '中吉'],
    ['巽', '兑', '风泽中孚', '泽上有风，诚信立身，中心诚信。', '吉'],
    ['震', '艮', '雷山小过', '山上有雷，小事可过，大事勿越。', '中'],
    ['坎', '离', '水火既济', '水火既济，大功告成，防盛极变。', '吉'],
    ['离', '坎', '火水未济', '火水未济，尚未完成，慎终如始。', '中']
  ];
  var GUA_MAP = {};
  GUA.forEach(function (g) { GUA_MAP[g[0] + g[1]] = g; });

  /* ---------- 卦象接口 ---------- */
  CY.guaInfo = function (up, low) {
    var g = GUA_MAP[up + low];
    return { up: up, low: low, name: g[2], text: g[3], luck: g[4] };
  };
  CY.linesFrom = function (up, low) { return TRIS[low].lines.concat(TRIS[up].lines); };
  CY.guaFromLines = function (lines) {
    var lo = lines.slice(0, 3).join(''), up = lines.slice(3).join('');
    var lowKey = null, upKey = null;
    Object.keys(TRIS).forEach(function (k) {
      if (TRIS[k].lines.join('') === lo) lowKey = k;
      if (TRIS[k].lines.join('') === up) upKey = k;
    });
    return { up: upKey, low: lowKey, info: CY.guaInfo(upKey, lowKey) };
  };
  /* 互卦：2,3,4 爻为下卦，3,4,5 爻为上卦 */
  CY.huLines = function (l) { return [l[1], l[2], l[3], l[2], l[3], l[4]]; };
  /* 变卦：翻转动爻 */
  CY.bianLines = function (l, moving) {
    return l.map(function (v, i) { return moving && moving.indexOf(i) >= 0 ? 1 - v : v; });
  };
  /* 爻名：初九 / 九二 / 六三 / 上六 …（i 自下而上 0-5） */
  CY.yaoName = function (i, yang) {
    var n = yang ? '九' : '六';
    var p = ['初', '二', '三', '四', '五', '上'][i];
    return (i === 0 || i === 5) ? p + n : n + p;
  };
  /* 卦符渲染：SVG，六爻自下而上，动爻琥珀色高亮 */
  CY.svgGua = function (lines, moving) {
    moving = moving || [];
    var bar = 13, gap = 9, W = 108, H = gap + 6 * (bar + gap);
    var s = '<svg class="gua-svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg">';
    for (var i = 0; i < 6; i++) {
      var y = gap + (5 - i) * (bar + gap);
      var isMove = moving.indexOf(i) >= 0;
      var fill = isMove ? 'var(--amber)' : (lines[i] ? 'var(--cyan)' : 'var(--dim)');
      var glow = isMove ? 'rgba(255,201,77,.5)' : (lines[i] ? 'rgba(46,230,255,.35)' : 'rgba(126,147,184,.25)');
      if (lines[i]) {
        s += '<rect x="4" y="' + y + '" width="100" height="' + bar + '" rx="2" fill="' + fill + '" opacity=".9" style="filter:drop-shadow(0 0 5px ' + glow + ')"/>';
      } else {
        s += '<rect x="4" y="' + y + '" width="44" height="' + bar + '" rx="2" fill="' + fill + '" opacity=".9" style="filter:drop-shadow(0 0 5px ' + glow + ')"/>';
        s += '<rect x="60" y="' + y + '" width="44" height="' + bar + '" rx="2" fill="' + fill + '" opacity=".9" style="filter:drop-shadow(0 0 5px ' + glow + ')"/>';
      }
      if (isMove) {
        s += '<circle cx="97" cy="' + (y + bar / 2 + 1) + '" r="2.6" fill="var(--amber)"/>';
      }
    }
    return s + '</svg>';
  };

  /* ---------- 五行生克（体用分析） ---------- */
  var SHENG = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  var KE = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' };
  CY.wxEl = function (wx) { return { '木': '行', '火': '炎', '土': '厚', '金': '锐', '水': '流' }[wx]; };
  CY.tiYong = function (ti, yong) {
    if (ti === yong) return { lv: '吉', t: '体用比和——内外同气，事顺而稳。' };
    if (SHENG[yong] === ti) return { lv: '吉', t: '用生体——外力来助，得人得势。' };
    if (KE[ti] === yong) return { lv: '小吉', t: '体克用——我制局势，费力可成。' };
    if (KE[yong] === ti) return { lv: '凶', t: '用克体——外势压我，事多阻滞。' };
    if (SHENG[ti] === yong) return { lv: '小耗', t: '体生用——我往外泄，劳而耗损。' };
    return { lv: '中', t: '生克不明，事在两可。' };
  };

  /* ---------- 干支纪日（六爻日干 / 大衍纪日通用） ----------
     以 1949-10-01（甲子日）为基准，按六十甲子循环推算任意公历日期的日干支 */
  CY.dayGanZhi = function (y, m, d) {
    var GAN = '甲乙丙丁戊己庚辛壬癸', ZHI = '子丑寅卯辰巳午未申酉戌亥';
    var WX = { '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水' };
    var a = Math.floor((14 - m) / 12), yy = y + 4800 - a, mm = m + 12 * a - 3;
    var jdn = d + Math.floor((153 * mm + 2) / 5) + 365 * yy +
      Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
    var idx = (((jdn - 2433191) % 60) + 60) % 60; // 2433191 = 1949-10-01 的儒略日数（甲子）
    var g = GAN[idx % 10], z = ZHI[idx % 12];
    return { idx: idx, gan: g, zhi: z, name: g + z, wx: WX[g], jdn: jdn };
  };
  CY.todayGanZhi = function () {
    var t = new Date();
    return CY.dayGanZhi(t.getFullYear(), t.getMonth() + 1, t.getDate());
  };
  CY.fmtDate = function (t) {
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    return t.getFullYear() + '-' + p(t.getMonth() + 1) + '-' + p(t.getDate());
  };

  /* ---------- HTML 转义 ---------- */
  CY.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  CY.luckClass = function (luck) {
    if (luck.indexOf('吉') >= 0 && luck !== '小吉') return 'b-ji';
    if (luck === '小吉' || luck === '小耗') return 'b-zhong';
    if (luck.indexOf('凶') >= 0) return 'b-xiong';
    return 'b-zhong';
  };

  /* ---------- 导航 / 页签 / 页脚注入（全站统一） ---------- */
  function esc(s) { return CY.esc(s); }
  function renderNav() {
    var nav = document.getElementById('site-nav');
    if (!nav) return;
    var reg = window.TOOL_REGISTRY || [];
    var cur = document.body.dataset.tool;
    var links = reg.map(function (t) {
      return '<a class="nl' + (t.id === cur ? ' on' : '') + '" href="' + CY.base + '/' + t.use + '">' + t.icon + ' ' + esc(t.name) + '</a>';
    }).join('');
    nav.innerHTML = '<div class="nav-in"><span class="logo">玄<b>机</b> · CYBER ORACLE</span>' + links +
      '<a class="nl home" href="' + CY.base + '/index.html">⌂ HOME</a></div>';
  }
  function renderTabs() {
    var tool = document.body.dataset.tool, page = document.body.dataset.page;
    if (!tool || !page) return;
    var host = document.getElementById('page-tabs');
    if (!host) return;
    var t = (window.TOOL_REGISTRY || []).filter(function (x) { return x.id === tool; })[0];
    if (!t) return;
    host.innerHTML =
      '<a href="' + CY.base + '/' + t.use + '" class="' + (page === 'use' ? 'on' : '') + '">◈ 使用</a>' +
      '<a href="' + CY.base + '/' + t.intro + '" class="' + (page === 'intro' ? 'on' : '') + '">◎ 介绍</a>';
  }
  function renderFooter() {
    var f = document.getElementById('site-footer');
    if (!f) return;
    f.innerHTML = '<div class="wrap"><p>玄机 · CYBER ORACLE // 赛博占卜工具合集<br>' +
      '本站内容仅供传统文化研究与娱乐参考，不构成任何现实决策依据。<br>' +
      'PURE FRONT-END · GITHUB PAGES READY · <a href="https://github.com" target="_blank" rel="noopener">SOURCE</a></p></div>';
  }
  document.addEventListener('DOMContentLoaded', function () { renderNav(); renderTabs(); renderFooter(); });
})();

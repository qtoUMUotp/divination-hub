/* ============================================================
   工具注册表 —— 全站唯一的"添加新工具"入口
   新增占卜工具三步：
   1. 复制 tools/_template/ 目录为 tools/你的工具id/
   2. 在下面数组里追加一个条目
   3. 完成 logic.js 与 data.js
   首页卡片、全站导航、页签会自动更新，无需改动其他文件
   ============================================================ */
window.TOOL_REGISTRY = [
  {
    id: 'meihua',
    icon: '❁',
    name: '梅花易数',
    en: 'PLUM BLOSSOM',
    tag: '时数起卦 · 体用生克',
    desc: '以时间或数字起卦，观本卦、互卦、变卦，用五行生克断吉凶。',
    use: 'tools/meihua/index.html',
    intro: 'tools/meihua/intro.html'
  },
  {
    id: 'liuyao',
    icon: '☰',
    name: '六爻',
    en: 'SIX LINES',
    tag: '三钱摇卦 · 动爻变卦',
    desc: '三枚铜钱掷六次成卦，老阳老阴为动爻，观卦变与六神断事。',
    use: 'tools/liuyao/index.html',
    intro: 'tools/liuyao/intro.html'
  },
  {
    id: 'xiaoliuren',
    icon: '✦',
    name: '小六壬',
    en: 'MA QIAN KE',
    tag: '马前课 · 月日时落宫',
    desc: '掌上起课：以月、日、时三数依次落宫，六宫定吉凶快慢。',
    use: 'tools/xiaoliuren/index.html',
    intro: 'tools/xiaoliuren/intro.html'
  },
  {
    id: 'tarot',
    icon: '✧',
    name: '塔罗',
    en: 'TAROT',
    tag: '78 牌 · 三种牌阵',
    desc: '二十二大阿卡纳与五十六小牌，单张、三张、凯尔特十字牌阵，含正逆位。',
    use: 'tools/tarot/index.html',
    intro: 'tools/tarot/intro.html'
  },
  {
    id: 'chouqian',
    icon: '⚄',
    name: '抽签',
    en: 'LOTTERY',
    tag: '六十灵签 · 签诗解曰',
    desc: '摇签筒得一签，签分上中下等第，签诗与解曰示事之所趋。',
    use: 'tools/chouqian/index.html',
    intro: 'tools/chouqian/intro.html'
  },
  {
    id: 'xingming',
    icon: '⊞',
    name: '姓名九宫',
    en: 'NAME GRID',
    tag: '五格数理 · 洛书九宫',
    desc: '以康熙笔画推姓名五格、八十一数理、三才与九宫落星。',
    use: 'tools/xingming/index.html',
    intro: 'tools/xingming/intro.html'
  },
  {
    id: 'guanyin',
    icon: '◉',
    name: '观音灵签',
    en: 'GUANYIN LOTS',
    tag: '一百签 · 签诗解曰',
    desc: '民间流传最广的百签体系，分上上、中平、下下三等，签诗与解曰示事之所趋。',
    use: 'tools/guanyin/index.html',
    intro: 'tools/guanyin/intro.html'
  },
  {
    id: 'lvzu',
    icon: '⚡',
    name: '吕祖灵签',
    en: 'LUZU LOTS',
    tag: '一百签 · 古人典故',
    desc: '吕洞宾百签，每签附历史典故——以古人际遇喻问事处境，先读故事再映照自身。',
    use: 'tools/lvzu/index.html',
    intro: 'tools/lvzu/intro.html'
  },
  {
    id: 'zhijiao',
    icon: '◐',
    name: '掷筊',
    en: 'JIAO DIVINATION',
    tag: '阴阳二筊 · 问事决疑',
    desc: '一对月牙筊杯掷出圣筊、笑筊、阴筊，是 / 否 / 不答，连掷三圣为确据。',
    use: 'tools/zhijiao/index.html',
    intro: 'tools/zhijiao/intro.html'
  },
  {
    id: 'dayan',
    icon: '≡',
    name: '大衍筮法',
    en: 'YARROW STALKS',
    tag: '五十蓍草 · 三变成爻',
    desc: '《系辞》古法：分二挂一揲四归奇，三变成爻、十八变成卦，老阳老阴为动。',
    use: 'tools/dayan/index.html',
    intro: 'tools/dayan/intro.html'
  },
  {
    id: 'shengri',
    icon: '⊕',
    name: '生日洛书九宫',
    en: 'LO SHU GRID',
    tag: '生日数位 · 洛书落宫',
    desc: '生日数字 1–9 的出现次数落入洛书九宫，强数即天赋、缺数即课题。',
    use: 'tools/shengri/index.html',
    intro: 'tools/shengri/intro.html'
  }
];

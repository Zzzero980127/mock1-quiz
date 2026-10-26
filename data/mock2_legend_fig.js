/* 二模：建築材料剖面圖例、給排水設備圖例的「看圖辨識」題（圖在 _legend_syms.js，由筆記產生程式共用）。
 * 掛在「剖面與建築圖例」單元最後（id 不變）。 */
(function () {
  var Q = window.QUIZ_DATA || [], LEG = window.LEG, H = window.QH;
  if (!LEG) return;
  var s = Q.filter(function (x) { return x.id === 'draw'; })[0];
  var u = s && s.units.filter(function (x) { return x.name === '剖面與建築圖例'; })[0];
  if (!u) return;

  var MAT = Object.keys(LEG.mat), PL = Object.keys(LEG.plumb), WIN = Object.keys(LEG.win || {}), SYM = Object.keys(LEG.sym || {});
  var MATEXP = {
    '磚': '磚：整塊塗滿 45° 斜線。', '鋼筋混凝土 RC': '鋼筋混凝土 RC：斜線加碎石小三角形，再加鋼筋斷面的黑點。',
    '木材': '木材：方框內畫交叉對角線與年輪弧線。', '卵石': '卵石：大小不一的橢圓形顆粒。',
    '地盤': '地盤：一條粗地平線，下方畫短斜線並分層。', '粉刷': '粉刷：牆面外側的薄層，用細斜線加小點表示。',
    '石材': '石材：45° 斜線一實線、一虛線交錯。', '金屬': '金屬：粗而疏的 45° 斜線（線條比磚的斜線粗）。', '合板': '合板：多層薄板，層與層的纖維方向交錯（隔層畫斜線）。',
    '輕質牆': '輕質牆：兩條平行實線中間畫細虛線（點線）。', '空心磚': '空心磚：磚的斜線中有空心的洞（白色小長方形）。',
    '保溫吸音材': '保溫吸音材：用連續鋸齒（之字形）線表示。'
  };
  var PLEXP = {
    '閘閥': '閘閥：蝴蝶結形（兩個尖端相對的三角形）加閥桿手輪，中心沒有圓。', '球型閥': '球型閥：蝴蝶結形，中心多一個實心圓。',
    '蝶閥': '蝶閥：管線兩側兩條短橫線，中間一片斜閥板。', '止回閥': '止回閥：三角形加一條垂直線，水只能單向流（朝三角形尖端）。',
    '下彎': '下彎（管線向下彎）：管末端的圓內畫往下的弧線，沒有實心點。', '上彎': '上彎（管線向上彎）：管末端的圓內畫實心點。'
  };
  var WINEXP = {
    '固定窗': '固定窗：窗框中間只畫一條細線，窗扇不能開啟。', '橫拉窗': '橫拉窗：兩扇錯開的平行線，表示左右滑動。',
    '單開窗': '單開窗：一條窗扇線加開啟弧線（虛線弧），表示繞一邊轉開。', '推開窗': '推開窗：窗扇線斜向推出，呈 V 字形。'
  };
  var SYMEXP = {
    '高程記號': '高程記號：倒三角形尖端指在水平線上，旁邊註記高程數字（如 +3.00）。',
    '坡度符號（1／10）': '坡度符號：直角三角形，垂直邊 1、水平邊 n，上方實心箭頭指下坡方向。',
    '指北針': '指北針：圓內畫箭頭，箭頭尖端標 N。', '基準線編號': '基準線編號：單點鏈線端點的圓圈內寫編號（橫向①②③、縱向ⒶⒷⒸ）。',
    '剖面標記 A-4／2': '剖面標記 A-4／2：圓圈分上下兩半，下半是圖號 A-4、上半是該張圖內的編號 2，箭頭表示視線方向。'
  };
  function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function others(list, name, k) { return shuf(list.filter(function (x) { return x !== name; })).slice(0, k); }
  function one(body, hbg) { return '<svg class="lgfig" viewBox="0 0 100 64" xmlns="http://www.w3.org/2000/svg" role="img">' + body + '</svg>'; }
  function four(kind, names) {
    var out = '<svg class="lgfig" viewBox="0 0 220 150" xmlns="http://www.w3.org/2000/svg" role="img">';
    names.forEach(function (n, i) {
      var x = (i % 2) * 110, y = Math.floor(i / 2) * 75;
      out += '<g transform="translate(' + x + ' ' + y + ')">' + LEG[kind][n] + '<text x="4" y="14" font-size="12" fill="currentColor" stroke="none">' + '①②③④'.charAt(i) + '</text></g>';
    });
    return out + '</svg>';
  }
  var NUM = ['①', '②', '③', '④'];

  function idGen(kind, list, exp, label) {
    return { t: label + '看圖辨識', g: function (R) {
      var n = R.pick(list);
      return ['下圖所示的' + label + '圖例，代表哪一種' + (kind === 'mat' ? '材料' : kind === 'plumb' ? '設備' : '符號') + '？', [n].concat(others(list, n, 3)), exp[n], one(LEG[kind][n])];
    } };
  }
  function gridGen(kind, list, exp, label) {
    return { t: label + '編號辨認', g: function (R) {
      var pick = shuf(list).slice(0, 4), n = R.pick(pick), i = pick.indexOf(n);
      var ans = NUM[i], rest = NUM.filter(function (x) { return x !== ans; });
      return ['下圖四個' + label + '圖例，哪一個編號是「' + n + '」？', [ans].concat(rest), exp[n] + '（圖中是第 ' + ans + ' 個。）', four(kind, pick)];
    } };
  }

  var easy = [idGen('mat', MAT, MATEXP, '建築材料剖面'), idGen('plumb', PL, PLEXP, '給排水衛生設備')];
  if (WIN.length) easy.push(idGen('win', WIN, WINEXP, '窗平面'));
  if (SYM.length) easy.push(idGen('sym', SYM, SYMEXP, '建築圖基本符號'));
  var hard = [gridGen('mat', MAT, MATEXP, '建築材料剖面'), gridGen('plumb', PL, PLEXP, '給排水衛生設備'), gridGen('win', WIN, WINEXP, '窗平面'), gridGen('sym', SYM.slice(0, 4).concat(SYM.slice(4)), SYMEXP, '建築圖基本符號')];
  var tc = [
    { t: '（仿統測）材料圖例', g: function (R) {
      var n = R.pick(MAT);
      return ['（仿統測）建築圖中，下圖的剖面圖例表示何種材料？', [n].concat(others(MAT, n, 3)), MATEXP[n], one(LEG.mat[n])];
    } },
    { t: '（仿統測）衛生設備圖例', g: function (R) {
      var n = R.pick(PL);
      return ['（仿統測）給排水平面圖中，下圖的圖例代表？', [n].concat(others(PL, n, 3)), PLEXP[n], one(LEG.plumb[n])];
    } }
  ];
  u.qs = (u.qs || []).concat(easy);
  u.hard = (u.hard || []).concat(hard);
  u.tc = (u.tc || []).concat(tc);
})();

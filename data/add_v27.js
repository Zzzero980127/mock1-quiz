/* v2.9：再加一批變化圖題型（補還沒有變化圖的單元）。
 * 力學：力偶（力的位置與角度變化）、梯子上有人（位置變化）、推箱子（施力高度變化）
 * 測量：三角高程（仰角／俯角）、水準管靈敏度、土方斷面（挖方／填方、平均斷面法）
 * 製圖：線條種類與用途、正多邊形角度；數學：絕對值函數圖形
 * 用 GF（add_v24.js）；一律 addEasy／addHard／addTc 往後接，不插隊、不刪題。
 */
(function () {
  var G = GF, H = QH, D = H.dec, n = H.n, rad = G.rad;
  function O(ans, c, mf) { var r = H.opts(ans, c, mf); return r.length < 4 ? H.fill(r) : r; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function U(u, d) { return function (x) { return D(x, d === undefined ? 2 : d) + ' ' + u; }; }
  function more(f, ans) { return function (k) { return f(ans * (1 + (k % 2 ? 1 : -1) * 0.1 * Math.ceil(k / 2)) + (ans === 0 ? k : 0)); }; }
  var TG = { 30: [0.5, 0.866], 37: [0.6, 0.8], 45: [0.707, 0.707], 53: [0.8, 0.6], 60: [0.866, 0.5], 90: [1, 0] };

  /* ================= 力學 ================= */

  // 力偶：兩個大小相等方向相反的力，作用點與角度隨機
  function couple() {
    var Lm = ri(4, 10), a = ri(0, 2), b = Lm - ri(0, 2), F = pick([10, 20, 30, 40, 50]), ang = pick([90, 90, 30, 37, 53, 60]), up = pick([1, -1]), d = (b - a) * TG[ang][0], M = F * d;
    var x0 = 70, x1 = 290, y = 115, sc = (x1 - x0) / Lm, X = function (m) { return x0 + m * sc; }, s = G.Rc(x0, y - 5, x1 - x0, 10, 'fill2 acc');
    // 左邊的力方向角 th（數學角度，與桿夾 ang），右邊的力方向相反
    var th = up > 0 ? 180 - ang : -ang, L1 = 60, c = Math.cos(rad(th)), sn = Math.sin(rad(th));
    var ax = X(a), bx = X(b), tipA = [ax + L1 * c, y - L1 * sn], tipB = [bx - L1 * c, y + L1 * sn];
    s += G.A(ax, y, tipA[0], tipA[1], 'acc') + G.A(bx, y, tipB[0], tipB[1], 'acc');
    s += G.T(tipA[0] + 6, tipA[1] + (up > 0 ? -4 : 12), 'F = ' + F + ' N', 'start', 'small') + G.T(tipB[0] + 6, tipB[1] + (up > 0 ? 12 : -4), 'F = ' + F + ' N', 'start', 'small');
    if (ang !== 90) s += G.arc(ax, y, 22, up > 0 ? 180 : 0, th) + G.lab(ax, y, 36, ((up > 0 ? 180 : 0) + th) / 2, ang + '°') + G.arc(bx, y, 22, up > 0 ? 360 : 180, th + 180) + G.lab(bx, y, 36, ((up > 0 ? 360 : 180) + th + 180) / 2, ang + '°');
    s += G.dim(X(a), X(b), y + 70, (b - a) + ' m') + G.C(X(a), y, 3, 'dot') + G.C(X(b), y, 3, 'dot');
    var dir = up > 0 ? '順時針' : '逆時針', Mu = function (v, dd) { return D(v, 2) + ' N·m（' + dd + '）'; }, other = up > 0 ? '逆時針' : '順時針';
    return ['如圖，桿上作用一對大小相等、方向相反的平行力（力偶），兩力作用點相距 ' + (b - a) + ' m' + (ang === 90 ? '、皆垂直於桿' : '、與桿夾 ' + ang + '°（sin' + ang + '° = ' + TG[ang][0] + '）') + '，此力偶矩為何？', O(Mu(M, dir), [Mu(M, other), Mu(F * (b - a), ang === 90 ? other : dir), Mu(2 * M, dir), Mu(M / 2, dir)]),
      '力偶矩 = 力 × 兩力作用線的垂直距離。垂直距離 = ' + (b - a) + (ang === 90 ? '' : ' × sin' + ang + '° = ' + D(d, 3)) + ' m → M = ' + F + ' × ' + D(d, 3) + ' = ' + D(M, 2) + ' N·m。\n左邊的力' + (up > 0 ? '向上、右邊向下 → 順時針' : '向下、右邊向上 → 逆時針') + '。力偶對任何點的力矩都一樣。', G.svg(400, 220, s)];
  }

  // 梯子上有人：人的位置、梯子角度隨機
  function ladder() {
    var t = pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [5, 12, 13]]), bm = t[0], hm = t[1], Lm = t[2], W = pick([100, 150, 200]), Wp = pick([500, 600, 700, 800]), sf = pick([0.25, 0.5, 0.6, 0.75, 0.8]);
    var Nw = (W * bm / 2 + Wp * sf * bm) / hm, N = W + Wp, mu = Nw / N, ask = pick(['f', 'f', 'mu', 'nw']);
    var sc = 150 / Math.max(bm, hm), wx = 300, gy = 200, fx = wx - bm * sc, ty = gy - hm * sc, s = G.hH(20, wx, gy) + G.hV(wx, 20, gy, 1) + G.L(fx, gy, wx, ty, 'thick2 acc');
    var px = fx + (wx - fx) * sf, py = gy + (ty - gy) * sf; s += G.C(px, py - 10, 7, '') + G.L(px, py - 3, px, py + 12, 'thick') + G.T(px - 12, py - 8, '人 ' + Wp + ' N', 'end', 'small');
    s += G.dim(fx, wx, gy + 26, bm + ' m') + G.dimV(wx + 22, ty, gy, hm + ' m', 1) + G.T(fx - 6, gy - 6, 'A', 'end') + G.T(wx - 8, ty - 6, 'B', 'end');
    var Nu = U('N'), fig = G.svg(360, 240, s);
    var ex = '牆光滑 → 牆只給水平反力 N_B；地面給 N_A（向上）與摩擦 f（向牆）。\n對 A 取矩：N_B × ' + hm + ' = ' + W + ' × ' + D(bm / 2, 2) + '（梯重在中點）+ ' + Wp + ' × ' + D(sf * bm, 2) + '（人在 ' + D(sf * Lm, 2) + ' m 處，水平距 ' + D(sf * bm, 2) + ' m）\n→ N_B = ' + Nu(Nw) + ' = 所需摩擦 f；N_A = ' + N + ' N；μ_min = f/N_A = ' + D(mu, 3) + '。';
    var q = '如圖，長 ' + Lm + ' m、重 ' + W + ' N 的均質梯子靠在光滑牆上，重 ' + Wp + ' N 的人站在距梯腳 ' + D(sf * Lm, 2) + ' m 處，';
    if (ask === 'f') return [q + '地面需提供的摩擦力為何？', O(Nu(Nw), [Nu(W * bm / 2 / hm), Nu(Wp * bm / hm), Nu(N * bm / hm), Nu(Nw * hm / bm)], more(Nu, Nw)), ex, fig];
    if (ask === 'nw') return [q + '牆對梯子的反力為何？', O(Nu(Nw), [Nu(N), Nu(Nw * hm / bm), Nu(W * bm / 2 / hm), Nu(Wp * sf)], more(Nu, Nw)), ex, fig];
    return [q + '梯子不滑動所需的最小摩擦係數為何？', O(D(mu, 3), [D(Nw / Wp, 3), D(bm / hm, 3), D(bm / (2 * hm), 3), D(mu * 2, 3)]), ex, fig];
  }

  // 推箱子：施力高度隨機，判斷先滑或先翻
  function boxTip() {
    for (var t = 0; t < 40; t++) {
      var b = ri(4, 10) * 10, h = ri(6, 14) * 10, yp = ri(3, h / 10) * 10, W = pick([200, 300, 400, 500, 600]), mu = pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.6]);
      var Ps = mu * W, Pt = W * b / (2 * yp); if (Math.abs(Ps - Pt) < 1) continue;
      var slide = Ps < Pt, gy = 200, sc = 150 / Math.max(b, h), bw = b * sc, bh = h * sc, x0 = 180 - bw / 2, s = G.hH(20, 330, gy) + G.Rc(x0, gy - bh, bw, bh, 'fill2 acc');
      s += G.A(x0 - 70, gy - yp * sc, x0 - 2, gy - yp * sc, 'acc') + G.T(x0 - 74, gy - yp * sc + 4, 'P', 'end') + G.dimV(x0 - 30, gy - yp * sc, gy, yp + ' cm', -1) + G.dim(x0, x0 + bw, gy + 22, b + ' cm') + G.dimV(x0 + bw + 24, gy - bh, gy, h + ' cm', 1);
      s += G.C(180, gy - bh / 2, 3, 'dot') + G.A(180, gy - bh / 2, 180, gy - bh / 2 + 28) + G.T(186, gy - bh / 2 + 26, 'W', 'start', 'small');
      var Nu = U('N'), ans = slide ? '先滑動，P = ' + Nu(Ps) : '先翻倒，P = ' + Nu(Pt);
      return ['如圖，重 ' + W + ' N 的均質箱子（μs = ' + mu + '），在離地 ' + yp + ' cm 處施水平推力 P，逐漸加大 P 時箱子會先發生什麼？', O(ans, [slide ? '先翻倒，P = ' + Nu(Pt) : '先滑動，P = ' + Nu(Ps), '先翻倒，P = ' + Nu(W * b / (2 * h)), '同時滑動與翻倒', '先滑動，P = ' + Nu(W)]),
        '滑動：P = μW = ' + Nu(Ps) + '。\n翻倒：繞前下角取矩 P × ' + yp + ' = W × ' + b / 2 + '（重心水平距）→ P = ' + Nu(Pt) + '。\n取較小的先發生 → ' + ans + '。施力點越高越容易翻倒。', G.svg(360, 235, s)];
    }
    return boxTip();
  }

  /* ================= 測量 ================= */

  // 三角高程：仰角或俯角、儀器高與覘標高隨機
  function trigHeight() {
    var S = ri(8000, 30000) / 100, a = pick([3, 5, 8, 10, 12, 15]), up = Math.random() < 0.6, sa = +Math.sin(rad(a)).toFixed(4), ih = ri(140, 165) / 100, th = ri(120, 200) / 100, HA = ri(20000, 80000) / 1000;
    var dh = (up ? 1 : -1) * S * sa + ih - th, HB = HA + dh, ask = pick(['dh', 'HB', 'HB']), M = U('m', 3);
    var Ax = 40, Ay = up ? 190 : 80, Bx = 310, vis = Math.max(14, a * 1.6), By = Ay - (up ? 1 : -1) * (Bx - Ax) * Math.tan(rad(vis)) * 0.6, s = '';
    s += G.L(Ax, Ay, Ax, Ay - 30, 'thick') + G.Rc(Ax - 8, Ay - 36, 16, 8, 'fill') + G.L(Bx, By, Bx, By - 26, 'thick') + G.C(Bx, By - 28, 4, '');
    s += G.L(Ax, Ay - 32, Bx, By - 28, 'acc') + G.L(Ax, Ay - 32, Bx, Ay - 32, 'thin dash') + G.arc(Ax, Ay - 32, 40, 0, up ? vis : -vis) + G.lab(Ax, Ay - 32, 56, up ? vis / 2 : -vis / 2, (up ? '仰角 ' : '俯角 ') + a + '°');
    s += G.hH(10, 90, Ay) + G.hH(270, 350, By) + G.T(Ax - 6, Ay + 18, 'A', 'end') + G.T(Bx + 10, By + 4, 'B', 'start') + G.T((Ax + Bx) / 2, (Ay + By) / 2 - 40, '斜距 S = ' + S.toFixed(2) + ' m', 'middle', 'small');
    s += G.T(Ax + 12, Ay - 12, 'i = ' + ih.toFixed(2), 'start', 'small') + G.T(Bx - 10, By - 12, 't = ' + th.toFixed(2), 'end', 'small');
    var q = '如圖，在 A 點（高程 ' + HA.toFixed(3) + ' m）以全站儀觀測 B 點稜鏡，斜距 ' + S.toFixed(2) + ' m、' + (up ? '仰角' : '俯角') + ' ' + a + '°（sin' + a + '° = ' + sa + '），儀器高 i = ' + ih.toFixed(2) + ' m、稜鏡高 t = ' + th.toFixed(2) + ' m，';
    var ex = '高差 Δh = ' + (up ? '+' : '−') + 'S sinα + i − t = ' + (up ? '' : '−') + S.toFixed(2) + '×' + sa + ' + ' + ih.toFixed(2) + ' − ' + th.toFixed(2) + ' = ' + D(dh, 3) + ' m（俯角時 S sinα 取負）。\nH_B = H_A + Δh = ' + M(HB) + '。';
    var wrong = (up ? -1 : 1) * S * sa + ih - th;
    if (ask === 'dh') return [q + 'B 點相對 A 點的高差為何？', O(M(dh), [M(wrong), M(dh - ih + th), M(dh - 2 * ih + 2 * th), M(S * sa)]), ex, G.svg(360, 230, s)];
    return [q + 'B 點的高程為何？', O(M(HB), [M(HA + wrong), M(HA + dh - ih + th), M(HA + (up ? 1 : -1) * S * sa - ih + th), M(HA + S * sa)]), ex, G.svg(360, 230, s)];
  }

  // 水準管靈敏度：距離、讀數差、氣泡移動格數隨機
  function bubble() {
    var Dm = pick([50, 60, 80, 100]), nd = pick([2, 3, 4, 5]), dmm = pick([5, 6, 8, 10, 12, 15]), th = dmm / 1000 / (nd * Dm) * 206265, gap = 2;
    var s = '<rect x="30" y="40" width="200" height="34" rx="17" class="thin"/>';
    for (var i = -6; i <= 6; i++) s += G.L(130 + i * 12, 40, 130 + i * 12, 48, 'thin');
    var off = nd * 12 / 2; s += '<ellipse cx="' + (130 + off) + '" cy="57" rx="38" ry="11" style="fill:var(--accent-soft);stroke:var(--accent)"/>' + G.A(130, 90, 130 + nd * 12, 90, 'acc') + G.T(130 + nd * 6, 106, '移動 ' + nd + ' 格', 'middle', 'small');
    s += G.Rc(300, 30, 14, 170, 'fill2 acc') + G.L(240, 120, 300, 120, 'thin dash') + G.L(240, 132, 300, 132, 'thin dash') + G.T(296, 118, 'R₁', 'end', 'small') + G.T(296, 146, 'R₂', 'end', 'small') + G.T(320, 128, '相差 ' + dmm + ' mm', 'start', 'small');
    s += G.dim(130, 307, 215, '視距 ' + Dm + ' m');
    var sec = function (x) { return D(x, 1) + '″'; };
    return ['如圖，測水準管靈敏度：標尺距儀器 ' + Dm + ' m，氣泡移動 ' + nd + ' 格時標尺讀數相差 ' + dmm + ' mm（ρ = 206265″），此水準管每格的角值（靈敏度）約為何？', O(sec(th), [sec(th * nd), sec(th / nd * (nd - 1) || th / 2), sec(dmm / 1000 / Dm * 206265), sec(th * 10)]),
      '每格角值 θ = 讀數差 / (格數 × 視距) × ρ = ' + dmm / 1000 + ' ÷ (' + nd + ' × ' + Dm + ') × 206265 = ' + sec(th) + '。\n角值越小（每格對應的角度越小）→ 越靈敏。（每格長度通常 ' + gap + ' mm）', G.svg(370, 235, s)];
  }

  // 土方斷面：挖方或填方，平均斷面法
  function section() {
    var cut = Math.random() < 0.5, bw = pick([4, 6, 8, 10]), m = pick([1, 1.5, 2]), h1 = pick([1, 1.5, 2, 2.5, 3]), h2 = pick([1, 2, 3, 4]), L = pick([10, 20, 25, 30]);
    var A = function (h) { return (bw + m * h) * h; }, A1 = A(h1), A2 = A(h2), V = (A1 + A2) / 2 * L, ask = pick(['A', 'V', 'V']);
    var sc = 14, cx = 180, gy = cut ? 60 : 190, s = '', topw = bw + 2 * m * h1, dir = cut ? 1 : -1;
    var P1 = [cx - topw / 2 * sc, gy], P2 = [cx - bw / 2 * sc, gy + dir * h1 * sc], P3 = [cx + bw / 2 * sc, gy + dir * h1 * sc], P4 = [cx + topw / 2 * sc, gy];
    s += G.hH(10, P1[0], gy) + G.hH(P4[0], 350, gy) + '<path d="M' + [P1, P2, P3, P4].map(function (p) { return G.r1(p[0]) + ',' + G.r1(p[1]); }).join(' L') + ' Z" style="fill:var(--accent-soft);stroke:var(--accent);stroke-width:2"/>';
    s += G.dim(P2[0], P3[0], P2[1] + dir * 16, '底寬 ' + bw + ' m') + G.dimV(P4[0] + 20, Math.min(gy, P3[1]), Math.max(gy, P3[1]), (cut ? '挖深 ' : '填高 ') + h1 + ' m', 1) + G.T(P4[0] - 10, (P3[1] + gy) / 2, '1 : ' + m, 'end', 'small');
    s += G.T(cx, cut ? 30 : 30, (cut ? '挖方' : '填方') + '斷面（邊坡 1 : ' + m + '）', 'middle', 'small');
    var m3 = U('m³'), m2 = U('m²'), fig = G.svg(360, 230, s);
    var ex = '梯形斷面面積 = (底寬 + 頂寬)/2 × 高，頂寬 = 底寬 + 2mh → A = (b + mh)h。\nA₁ = (' + bw + ' + ' + m + '×' + h1 + ')×' + h1 + ' = ' + D(A1, 2) + ' m²；A₂（' + (cut ? '挖深' : '填高') + ' ' + h2 + ' m）= ' + D(A2, 2) + ' m²。\n平均斷面法 V = (A₁ + A₂)/2 × L = ' + D(V, 2) + ' m³。';
    if (ask === 'A') return ['如圖之' + (cut ? '挖方' : '填方') + '路基橫斷面（兩側邊坡 1 : ' + m + '，即垂直 1、水平 ' + m + '），斷面積為何？', O(m2(A1), [m2(bw * h1), m2((bw + 2 * m * h1) * h1), m2((bw + m * h1 / 2) * h1), m2(A1 * 2)]), ex, fig];
    return ['如圖之' + (cut ? '挖方' : '填方') + '橫斷面（邊坡 1 : ' + m + '），此斷面' + (cut ? '挖深' : '填高') + ' ' + h1 + ' m，相距 ' + L + ' m 的下一斷面' + (cut ? '挖深' : '填高') + ' ' + h2 + ' m（底寬、邊坡相同），以平均斷面法求兩斷面間的土方量？', O(m3(V), [m3((A1 + A2) * L), m3(A((h1 + h2) / 2) * L), m3(A1 * L), m3(V / 2)]), ex, fig];
  }

  /* ================= 製圖 ================= */

  // 線條種類：畫出一種線型，問名稱或用途
  function lineType() {
    var T = [
      ['粗實線', '可見輪廓線', 'thick2', ''], ['細實線', '尺度線、尺度界線、剖面線', 'thin', ''], ['虛線（中線）', '隱藏線（看不見的輪廓）', 'thick', '8 4'],
      ['細一點鏈線', '中心線、節圓線', 'thin', '18 4 2 4'], ['粗一點鏈線', '割面線端部、表面特殊處理範圍', 'thick2', '18 4 2 4'], ['細二點鏈線', '假想線（移動位置、相鄰件）', 'thin', '18 4 2 4 2 4']
    ];
    var k = ri(0, T.length - 1), t = T[k], ask = pick(['use', 'name']), s = '';
    s += '<line x1="30" y1="40" x2="330" y2="40" class="' + t[2] + '"' + (t[3] ? ' style="stroke-dasharray:' + t[3] + '"' : '') + '/>';
    s += G.T(180, 75, '（圖示線條，粗細與間隔示意）', 'middle', 'small');
    var others = T.filter(function (_, i) { return i !== k; });
    if (ask === 'use') return ['如圖所示的線條（' + t[0] + '），在工程圖中主要用於何處？', O(t[1], shuffle(others).slice(0, 3).map(function (o) { return o[1]; })), t[0] + ' → ' + t[1] + '。\n' + T.map(function (o) { return o[0] + '：' + o[1]; }).join('；'), G.svg(360, 90, s)];
    return ['工程圖中「' + t[1] + '」應使用如圖哪一種線條？（圖為示意）', O(t[0], shuffle(others).slice(0, 3).map(function (o) { return o[0]; })), T.map(function (o) { return o[0] + '：' + o[1]; }).join('；'), G.svg(360, 90, s)];
  }

  // 正多邊形：邊數隨機，問內角、外角、內角和或對角線數
  function polygon() {
    var N = ri(5, 12), cx = 180, cy = 115, R = 90, pts = [], s = '';
    for (var i = 0; i < N; i++) { var a = 90 + i * 360 / N; pts.push([cx + R * Math.cos(rad(a)), cy - R * Math.sin(rad(a))]); }
    s += G.poly(pts.concat([pts[0]]), 'thick acc') + G.C(cx, cy, R, 'thin dash') + G.C(cx, cy, 2.5, 'dot');
    var inner = (N - 2) * 180 / N, ask = pick(['in', 'ex', 'sum', 'diag']), deg = function (x) { return D(x, 2) + '°'; };
    var ex = '正 ' + N + ' 邊形：內角和 = (n − 2) × 180° = ' + (N - 2) * 180 + '°；每個內角 = ' + deg(inner) + '；每個外角 = 360°/n = ' + deg(360 / N) + '；對角線 = n(n − 3)/2 = ' + N * (N - 3) / 2 + ' 條。';
    var q = '如圖之正多邊形（內接於圓），';
    if (ask === 'in') return [q + '每一個內角為多少度？', O(deg(inner), [deg(360 / N), deg((N - 1) * 180 / N), deg(180 - 360 / (N + 1)), deg(inner + 10)]), ex, G.svg(360, 230, s)];
    if (ask === 'ex') return [q + '每一個外角為多少度？', O(deg(360 / N), [deg(inner), deg(180 / N), deg(360 / (N - 1)), deg(360 / (N + 1))]), ex, G.svg(360, 230, s)];
    if (ask === 'sum') return [q + '內角和為多少度？', O((N - 2) * 180 + '°', [N * 180 + '°', (N - 1) * 180 + '°', (N - 3) * 180 + '°', '360°']), ex, G.svg(360, 230, s)];
    return [q + '共有幾條對角線？', O(N * (N - 3) / 2 + ' 條', [N * (N - 1) / 2 + ' 條', N * (N - 3) + ' 條', (N - 3) + ' 條', N * (N - 2) / 2 + ' 條']), ex, G.svg(360, 230, s)];
  }

  /* ================= 數學 ================= */

  // 絕對值函數圖形：y = a|x − h| + k
  function absGraph() {
    var a = pick([1, -1, 2, -2]), h = ri(-3, 3), k = ri(-3, 3), cs = 22, o = 140, s = '';
    for (var i = -5; i <= 5; i++) { s += G.L(o + i * cs, o - 5 * cs, o + i * cs, o + 5 * cs, 'thin') + G.L(o - 5 * cs, o + i * cs, o + 5 * cs, o + i * cs, 'thin'); if (i) s += G.T(o + i * cs, o + 13, n(i), 'middle', 'small') + G.T(o - 5, o - i * cs + 4, n(i), 'end', 'small'); }
    s += G.A(o - 116, o, o + 120, o, 'thick') + G.A(o, o + 116, o, o - 120, 'thick');
    var P = function (x, y) { return [o + x * cs, o - y * cs]; }, pts = [];
    for (var x = -5.6; x <= 5.6; x += 0.1) pts.push(P(x, a * Math.abs(x - h) + k));
    s += G.clip(30, 30, 220, 220, G.poly(pts, 'thick acc'));
    var v = P(h, k), w = P(h + 1, k + a); s += G.C(v[0], v[1], 3.5, 'dot') + G.C(w[0], w[1], 3.5, 'dot');
    var eq = function (A2, h2, k2) { var c = A2 === 1 ? '' : A2 === -1 ? '−' : n(A2); return 'y = ' + c + '|' + (h2 === 0 ? 'x' : H.lin(h2)) + '|' + (k2 > 0 ? ' + ' + k2 : k2 < 0 ? ' − ' + (-k2) : ''); };
    var ask = pick(['eq', 'eq', 'range']), rng = a > 0 ? 'y ≥ ' + n(k) : 'y ≤ ' + n(k), fig = G.svg(290, 290, s);
    var ex = '折點（頂點）(' + n(h) + ', ' + n(k) + ')；從頂點往右 1 格，y 變化 ' + n(a) + ' → 斜率 ' + n(a) + ' → ' + eq(a, h, k) + '。\n開口向' + (a > 0 ? '上，最小值 ' + k : '下，最大值 ' + k) + '，值域 ' + rng + '。';
    if (ask === 'eq') return ['如圖之折線圖形（標出頂點與另一點），其方程式為何？', O(eq(a, h, k), [eq(a, -h, k), eq(-a, h, k), eq(a, h, -k), eq(a * 2, h, k), eq(a, k, h)]), ex, fig];
    return ['如圖之函數 y = a|x − h| + k 的圖形，其值域為何？', O(rng, [a > 0 ? 'y ≤ ' + n(k) : 'y ≥ ' + n(k), 'y ≥ ' + n(h), '所有實數', 'y ≥ 0']), ex, fig];
  }

  var it = function (t, f) { return { t: t, g: function () { return f(); } }; };
  [addEasy, addHard, addTc].forEach(function (add) {
    add('mech', 2, [it('力偶矩（位置與角度變化）', couple)]);
    add('mech', 3, [it('梯子上有人（位置變化）', ladder), it('推箱子滑動或翻倒（施力高度變化）', boxTip)]);
    add('surv', 3, [it('三角高程（仰角俯角變化）', trigHeight)]);
    add('surv', 4, [it('水準管靈敏度（看圖）', bubble)]);
    add('surv', 6, [it('土方斷面與平均斷面法（看圖）', section)]);
    add('draw', 3, [it('線條種類與用途（看圖）', lineType)]);
    add('draw', 4, [it('正多邊形角度（看圖）', polygon)]);
    add('math', 0, [it('絕對值函數圖形（看圖）', absGraph)]);
  });
})();

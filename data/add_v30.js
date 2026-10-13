/* v3.0：專業科目再加一批題型（力學、材料、測量、製圖）。
 * 產生器題（數字、圖形隨機）掛在簡單版／困難版／統測區；觀念題只掛簡單版。
 * 用 GF（add_v24.js）；一律 addEasy／addHard／addTc 往後接，不插隊、不刪題。
 */
(function () {
  var G = GF, H = QH, D = H.dec, n = H.n, rad = G.rad;
  function O(ans, c, mf) { var r = H.opts(ans, c, mf); return r.length < 4 ? H.fill(r) : r; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function U(u, d) { return function (x) { return D(x, d === undefined ? 2 : d) + ' ' + u; }; }
  function more(f, ans) { return function (k) { return f(ans * (1 + (k % 2 ? 1 : -1) * 0.1 * Math.ceil(k / 2)) + (ans === 0 ? k : 0)); }; }
  var TG = { 30: [0.5, 0.866], 37: [0.6, 0.8], 45: [0.707, 0.707], 53: [0.8, 0.6], 60: [0.866, 0.5] };
  function sn(a) { return TG[a][0]; }
  function cs(a) { return TG[a][1]; }

  /* ================= 力學 ================= */

  // 兩繩懸吊重物（拉密定理）：兩繩角度隨機
  function hang2() {
    var a = pick([30, 37, 45, 53, 60]), b = pick([30, 37, 45, 53, 60]), W = pick([100, 200, 300, 500, 600, 1000]);
    var s = sn(a) * cs(b) + cs(a) * sn(b), T1 = W * cs(b) / s, T2 = W * cs(a) / s, ask = pick(['L', 'R']);
    var ky = 140, kx = 180, cy = 40, h = ky - cy, xl = kx - h / Math.tan(rad(a)), xr = kx + h / Math.tan(rad(b));
    var g = G.hH(Math.min(xl, 60) - 20, Math.max(xr, 300) + 20, cy, true) + G.L(xl, cy, kx, ky, 'thick acc') + G.L(xr, cy, kx, ky, 'thick acc');
    g += G.L(kx, ky, kx, ky + 30, 'thick') + G.Rc(kx - 22, ky + 30, 44, 34, 'fill2') + G.T(kx, ky + 52, 'W', 'middle', 'small') + G.C(kx, ky, 3, 'dot');
    g += G.arc(xl, cy, 26, 0, -a) + G.lab(xl, cy, 42, -a / 2, a + '°') + G.arc(xr, cy, 26, 180, 180 + b) + G.lab(xr, cy, 42, 180 + b / 2, b + '°') + QH.slope(xl, cy, 0, -a, a, 46, Math.min(46, h / sn(a) - 56)) + QH.slope(xr, cy, 180, 180 + b, b, 46, Math.min(46, h / sn(b) - 56));
    g += G.T(xl + (kx - xl) * 0.78 - 10, cy + h * 0.78 + 4, 'T₁', 'end') + G.T(xr + (kx - xr) * 0.78 + 10, cy + h * 0.78 + 4, 'T₂', 'start');
    var Nu = U('N'), ans = ask === 'L' ? T1 : T2, oth = ask === 'L' ? T2 : T1;
    return ['如圖，重 ' + W + ' N 的物體以兩繩懸吊，左繩與水平夾 ' + a + '°、右繩與水平夾 ' + b + '°，' + (ask === 'L' ? '左繩張力 T₁' : '右繩張力 T₂') + ' 為何？（sin' + a + '° = ' + sn(a) + '、cos' + a + '° = ' + cs(a) + (a === b ? '' : '；sin' + b + '° = ' + sn(b) + '、cos' + b + '° = ' + cs(b)) + '）',
      O(Nu(ans), [Nu(oth), Nu(W / 2), Nu(W * (ask === 'L' ? sn(a) : sn(b))), Nu(W / (2 * (ask === 'L' ? sn(a) : sn(b))))], more(Nu, ans)),
      '水平：T₁cos' + a + '° = T₂cos' + b + '°；垂直：T₁sin' + a + '° + T₂sin' + b + '° = ' + W + '。\n解得 T₁ = W cos' + b + '° / sin(' + a + '° + ' + b + '°) = ' + Nu(T1) + '，T₂ = W cos' + a + '° / sin(' + a + '° + ' + b + '°) = ' + Nu(T2) + '（也可用拉密定理）。', G.svg(360, 250, g)];
  }

  // 外伸梁支承反力：外伸長度、載重位置隨機
  function overhang() {
    var L = pick([4, 5, 6, 8]), c = pick([1, 2]), P = pick([10, 20, 30]), P2 = pick([0, 10, 20, 40]), x2 = ri(1, L - 1);
    var RB = (P2 * x2 + P * (L + c)) / L, RA = P2 + P - RB, ask = pick(['A', 'B', 'B']);
    var x0 = 50, sc = 250 / (L + c), X = function (m) { return x0 + m * sc; }, y = 110;
    var g = G.Rc(x0, y - 5, (L + c) * sc, 10, 'fill2') + G.pin(X(0), y + 5) + G.roller(X(L), y + 5);
    g += G.A(X(L + c), y - 55, X(L + c), y - 7, 'acc') + G.T(X(L + c), y - 60, P + ' kN', 'middle', 'small');
    if (P2) g += G.A(X(x2), y - 55, X(x2), y - 7, 'acc') + G.T(X(x2), y - 60, P2 + ' kN', 'middle', 'small');
    g += G.T(X(0), y + 48, 'A', 'middle') + G.T(X(L), y + 48, 'B', 'middle') + G.T(X(L + c) + 4, y + 22, 'C', 'start');
    if (P2) g += G.dim(X(0), X(x2), y + 62, x2 + ' m') + G.dim(X(x2), X(L), y + 62, (L - x2) + ' m'); else g += G.dim(X(0), X(L), y + 62, L + ' m');
    g += G.dim(X(L), X(L + c), y + 62, c + ' m');
    var dir = function (v) { return Math.abs(v) < 1e-9 ? '0 kN' : D(Math.abs(v), 2) + ' kN（' + (v > 0 ? '向上' : '向下') + '）'; };
    var ex = '對 A 取矩：R_B × ' + L + ' = ' + (P2 ? P2 + ' × ' + x2 + ' + ' : '') + P + ' × ' + (L + c) + ' → R_B = ' + D(RB, 2) + ' kN（向上）。\nΣFy = 0：R_A = ' + (P2 ? P2 + ' + ' : '') + P + ' − ' + D(RB, 2) + ' = ' + D(RA, 2) + ' kN' + (RA < 0 ? '，負號表示 A 點反力向下（外伸端載重把 A 端翹起來）' : '') + '。';
    var q = '如圖之外伸梁，A 為鉸支承、B 為滾支承，' + (ask === 'A' ? 'A 點的垂直反力為何？' : 'B 點的反力為何？');
    if (ask === 'A') return [q, O(dir(RA), [dir(-RA), dir(P2 + P - P * c / L), dir(P2 * (L - x2) / L), dir(RA + P)]), ex, G.svg(360, 200, g)];
    return [q, O(dir(RB), [dir(P2 * x2 / L + P * c / L), dir(P2 + P), dir(RB - P), dir(P * (L + c) / L)]), ex, G.svg(360, 200, g)];
  }

  // 水平懸臂桿＋斜拉索：載重位置、索角度隨機
  function boom() {
    var t = pick([[3, 4, 5], [4, 3, 5], [8, 6, 10], [6, 8, 10], [12, 5, 13]]), Lm = t[0], hm = t[1], cm = t[2], W = pick([100, 200, 300, 600, 1200]), d = pick([Lm, Lm, Lm / 2, Lm * 2 / 3]);
    var Tn = W * d * cm / (Lm * hm), Ax = Tn * Lm / cm, Ay = W - Tn * hm / cm, ask = pick(['T', 'T', 'Ax', 'Ay']);
    var wx = 50, sc = 230 / Math.max(Lm, hm * 1.3), by = 190, bx = wx + Lm * sc, cy = by - hm * sc, dx = wx + d * sc;
    var g = G.hV(wx, Math.min(cy, 40) - 10, by + 30, -1) + G.Rc(wx, by - 5, Lm * sc, 10, 'fill2') + G.L(wx, cy, bx, by - 5, 'thick acc') + G.C(wx + 5, by, 4, '') + G.C(bx, by - 5, 3, 'dot') + G.C(wx, cy, 3, 'dot');
    g += G.A(dx, by + 50, dx, by + 7, '') + G.T(dx + 6, by + 46, 'W = ' + W + ' N', 'start', 'small');
    g += G.T(wx - 12, by + 4, 'A', 'end') + G.T(wx - 12, cy + 4, 'C', 'end') + G.T(bx + 8, by - 8, 'B', 'start') + G.dimV(bx + 30, cy, by, hm + ' m', 1) + G.dim(wx, bx, by + 70, Lm + ' m');
    if (d !== Lm) g += G.T(dx, by - 14, '距 A ' + D(d, 2) + ' m', 'middle', 'small');
    var Nu = U('N'), fig = G.svg(360, 280, g);
    var ex = '索 BC 長 √(' + Lm + '² + ' + hm + '²) = ' + cm + ' m，sinθ = ' + hm + '/' + cm + '、cosθ = ' + Lm + '/' + cm + '。\n對 A 取矩：T × (' + hm + '/' + cm + ') × ' + Lm + ' = ' + W + ' × ' + D(d, 2) + ' → T = ' + Nu(Tn) + '。\nA 點：A_x = T cosθ = ' + Nu(Ax) + '（向右，桿受壓）；A_y = ' + W + ' − T sinθ = ' + Nu(Ay) + '。';
    var q = '如圖，水平桿 AB 以鉸接固定在牆上 A 點，B 端以鋼索拉到牆上 C 點，重 ' + W + ' N 的物體掛在距 A ' + D(d, 2) + ' m 處（桿重不計），';
    if (ask === 'T') return [q + '鋼索張力為何？', O(Nu(Tn), [Nu(W * d * Lm / (Lm * cm)), Nu(W * d / Lm), Nu(Tn * hm / cm), Nu(W * cm / hm)], more(Nu, Tn)), ex, fig];
    if (ask === 'Ax') return [q + 'A 點的水平反力為何？', O(Nu(Ax), [Nu(Tn), Nu(Tn * hm / cm), Nu(W * Lm / hm), Nu(Ay)], more(Nu, Ax)), ex, fig];
    return [q + 'A 點的垂直反力為何？', O(Nu(Ay), [Nu(W), Nu(W - Ay), Nu(Ax), Nu(W / 2 + 1)], more(Nu, Ay)), ex, fig];
  }

  // 空間力分量：力沿 A→B 方向，座標整數
  function spaceForce() {
    var t = pick([[2, 3, 6, 7], [1, 2, 2, 3], [2, 6, 9, 11], [3, 4, 12, 13], [4, 4, 7, 9], [6, 6, 7, 11], [2, 2, 1, 3]]);
    var ord = pick([[0, 1, 2], [1, 0, 2], [2, 1, 0], [0, 2, 1]]), v = ord.map(function (i) { return t[i] * pick([1, -1]); }), Lm = t[3], k = pick([1, 2, 5, 10, 20]), F = Lm * k;
    var A = [ri(-2, 2), ri(-2, 2), ri(0, 3)], B = [A[0] + v[0], A[1] + v[1], A[2] + v[2]], ax = pick([0, 1, 2]), nm = ['x', 'y', 'z'][ax];
    var comp = function (i) { return F * v[i] / Lm; }, Nu = U('kN'), ask = pick(['c', 'c', 'cos']);
    var ex = 'AB 向量 = (' + v.map(n).join(', ') + ')，長度 √(' + v.map(function (x) { return x * x; }).join(' + ') + ') = ' + Lm + ' m。\n單位向量 = (' + v.map(function (x) { return n(x) + '/' + Lm; }).join(', ') + ')；F = ' + F + ' kN → (F_x, F_y, F_z) = (' + [0, 1, 2].map(function (i) { return n(comp(i)); }).join(', ') + ') kN。';
    var q = '一力 F = ' + F + ' kN，作用線由 A' + H.pt(A[0], A[1], A[2]) + ' 指向 B' + H.pt(B[0], B[1], B[2]) + '（單位 m），';
    if (ask === 'c') return [q + '其 ' + nm + ' 方向分量 F_' + nm + ' 為何？', O(n(comp(ax)) + ' kN', [n(-comp(ax)) + ' kN', n(comp((ax + 1) % 3)) + ' kN', n(comp((ax + 2) % 3)) + ' kN', n(F * B[ax] / Lm) + ' kN']), ex];
    var fr = function (p) { return H.frac(p, Lm); };
    return [q + '其方向餘弦 cos θ_' + nm + ' 為何？', O(fr(v[ax]), [fr(-v[ax]), fr(v[(ax + 1) % 3]), fr(v[(ax + 2) % 3]), H.frac(v[ax], Lm + 1)]), ex];
  }

  // 三角形桁架節點法：頂點位置、載重隨機
  function triTruss() {
    var L = pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10]]), R = pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10]]);
    if (L[1] !== R[1]) R = L[1] === 4 ? [3, 4, 5] : L[1] === 3 ? [4, 3, 5] : L[1] === 8 ? [6, 8, 10] : [8, 6, 10];
    var a = L[0], h = L[1], AC = L[2], b = R[0], BC = R[2], s = a + b, P = pick([12, 24, 30, 60, 120]);
    var RA = P * b / s, RB = P * a / s, FAC = RA * AC / h, FAB = FAC * a / AC, FBC = RB * BC / h, ask = pick(['AC', 'AB', 'BC']);
    var x0 = 50, sc = 260 / s, gy = 190, X = function (m) { return x0 + m * sc; }, cy = gy - h * sc;
    var g = G.L(X(0), gy, X(s), gy, 'thick2') + G.L(X(0), gy, X(a), cy, 'thick2') + G.L(X(s), gy, X(a), cy, 'thick2') + G.pin(X(0), gy) + G.roller(X(s), gy);
    g += [[X(0), gy], [X(s), gy], [X(a), cy]].map(function (p) { return G.C(p[0], p[1], 3.5, 'dot'); }).join('') + G.A(X(a), cy - 45, X(a), cy - 5, 'acc') + G.T(X(a) + 6, cy - 34, P + ' kN', 'start', 'small');
    g += G.T(X(0) - 10, gy - 6, 'A', 'end') + G.T(X(s) + 10, gy - 6, 'B', 'start') + G.T(X(a) - 10, cy, 'C', 'end') + G.dim(X(0), X(a), gy + 40, a + ' m') + G.dim(X(a), X(s), gy + 40, b + ' m') + G.L(X(a), cy, X(a), gy, 'thin dash') + G.T(X(a) + 4, (cy + gy) / 2 + 4, h + ' m', 'start', 'small');
    var Nu = function (v, c) { return D(v, 2) + ' kN（' + c + '）'; };
    var ex = '反力：R_A = ' + P + ' × ' + b + '/' + s + ' = ' + D(RA, 2) + ' kN，R_B = ' + D(RB, 2) + ' kN。\n節點 A：F_AC × ' + h + '/' + AC + ' = R_A → F_AC = ' + D(FAC, 2) + ' kN（壓力）；F_AB = F_AC × ' + a + '/' + AC + ' = ' + D(FAB, 2) + ' kN（拉力）。\n節點 B：F_BC × ' + h + '/' + BC + ' = R_B → F_BC = ' + D(FBC, 2) + ' kN（壓力）。';
    var q = '如圖之三角形桁架，C 點受 ' + P + ' kN 垂直載重，';
    if (ask === 'AC') return [q + '桿件 AC 的內力為何？', O(Nu(FAC, '壓力'), [Nu(FAC, '拉力'), Nu(FAB, '壓力'), Nu(RA, '壓力'), Nu(P * AC / (2 * h), '壓力')]), ex, G.svg(360, 250, g)];
    if (ask === 'BC') return [q + '桿件 BC 的內力為何？', O(Nu(FBC, '壓力'), [Nu(FBC, '拉力'), Nu(RB, '壓力'), Nu(FAC, '壓力'), Nu(RB * b / h, '壓力')]), ex, G.svg(360, 250, g)];
    return [q + '桿件 AB 的內力為何？', O(Nu(FAB, '拉力'), [Nu(FAB, '壓力'), Nu(FAC, '拉力'), Nu(RA, '拉力'), Nu(RA * h / a, '拉力')]), ex, G.svg(360, 250, g)];
  }

  // 定滑輪連接兩物體：水平桌面或斜面上，判斷摩擦力
  function pulleyFric() {
    var incl = Math.random() < 0.5, WA = pick([100, 200, 300, 400, 500]), WB = pick([20, 30, 40, 60, 80, 100, 150, 200, 250]), th = pick([30, 37, 53]);
    var g = '', Nu = U('N');
    if (!incl) {
      var mu = WB / WA, ask = pick(['mu', 'f']);
      g = G.hH(30, 260, 150) + G.Rc(110, 110, 70, 40, 'fill2') + G.T(145, 135, 'A', 'middle') + G.L(180, 130, 262, 130, 'thick') + G.C(270, 140, 10, '') + G.L(280, 140, 280, 200, 'thick') + G.Rc(266, 200, 28, 28, 'fill2') + G.T(280, 219, 'B', 'middle', 'small') + G.L(260, 150, 270, 140, 'thin');
      var fig = G.svg(330, 250, g);
      if (ask === 'mu') return ['如圖，重 ' + WA + ' N 的物體 A 放在水平桌面上，以繩跨過光滑定滑輪吊著重 ' + WB + ' N 的物體 B，系統恰好靜止不動（將要滑動），A 與桌面的靜摩擦係數為何？', O(D(mu, 3), [D(WA / WB, 3), D(WB / (WA + WB), 3), D(mu / 2, 3), D(mu + 0.1, 3)]), '恰要滑動：f_max = μN = T = W_B → μ × ' + WA + ' = ' + WB + ' → μ = ' + D(mu, 3) + '。', fig];
      var m2 = pick([0.5, 0.6, 0.8]), fm = m2 * WA, still = WB <= fm;
      return ['如圖，重 ' + WA + ' N 的物體 A 放在水平桌面上（μs = ' + m2 + '），以繩跨過光滑定滑輪吊著重 ' + WB + ' N 的物體 B。下列何者正確？', O(still ? '靜止，摩擦力 = ' + Nu(WB) : '會滑動（W_B > 最大靜摩擦力 ' + Nu(fm) + '）', [still ? '靜止，摩擦力 = ' + Nu(fm) : '靜止，摩擦力 = ' + Nu(WB), still ? '會滑動（W_B > 最大靜摩擦力 ' + Nu(fm) + '）' : '靜止，摩擦力 = ' + Nu(fm), '靜止，摩擦力 = 0 N']),
        '最大靜摩擦力 = μsN = ' + m2 + ' × ' + WA + ' = ' + Nu(fm) + '。\n繩拉力 = W_B = ' + WB + ' N ' + (still ? '≤ ' : '> ') + Nu(fm) + (still ? ' → 靜止，靜摩擦力只需等於拉力 ' + WB + ' N（不是最大值）。' : ' → 會滑動。'), fig];
    }
    var par = WA * sn(th), f = WB - par, gx = 40, gy = 210, Lx = 220, ty = gy - Lx * Math.tan(rad(th)) * 0.75, tx = gx + Lx;
    var ang = Math.atan2(gy - ty, tx - gx), mx = gx + (tx - gx) * 0.55, my = gy + (ty - gy) * 0.55;
    g = G.L(gx, gy, tx, ty, 'thick') + G.L(gx, gy, tx + 60, gy, 'thick') + G.L(tx, ty, tx, gy, 'thick');
    g += '<g transform="translate(' + G.r1(mx) + ',' + G.r1(my) + ') rotate(' + G.r1(-ang * 180 / Math.PI) + ')">' + G.Rc(-25, -32, 50, 32, 'fill2') + G.T(0, -12, 'A', 'middle') + '</g>';
    g += G.L(mx + 25 * Math.cos(ang) + 16 * Math.sin(ang), my - 25 * Math.sin(ang) - 16 * Math.cos(ang), tx - 4, ty - 14, 'thick') + G.C(tx + 4, ty - 6, 9, '') + G.L(tx + 13, ty - 6, tx + 13, ty + 40, 'thick') + G.Rc(tx + 1, ty + 40, 24, 24, 'fill2') + G.T(tx + 13, ty + 57, 'B', 'middle', 'small');
    g += G.arc(gx, gy, 34, 0, ang * 180 / Math.PI) + G.lab(gx, gy, 50, ang * 90 / Math.PI, th + '°') + QH.slope(gx, gy, 0, ang * 180 / Math.PI, th, 60, 54);
    var res = Math.abs(f) < 1e-9 ? '0 N（不需摩擦力）' : Nu(Math.abs(f)) + '，沿斜面向' + (f > 0 ? '下' : '上');
    return ['如圖，重 ' + WA + ' N 的物體 A 靜止在傾角 ' + th + '° 的斜面上，以平行斜面的繩跨過光滑定滑輪吊著重 ' + WB + ' N 的物體 B。斜面作用在 A 的靜摩擦力為何？（sin' + th + '° = ' + sn(th) + '）',
      O(res, [Nu(Math.abs(f)) + '，沿斜面向' + (f > 0 ? '上' : '下'), Nu(WB) + '，沿斜面向上', Nu(WA * cs(th) - WB) + '，沿斜面向上', Nu(par) + '，沿斜面向下']),
      '重力沿斜面分量 = ' + WA + ' × sin' + th + '° = ' + Nu(par) + '（向下）；繩拉力 = ' + WB + ' N（向上）。\n' + (f > 0 ? '拉力較大 → A 有往上滑的趨勢，摩擦力向下 = ' + WB + ' − ' + D(par, 2) : f < 0 ? '重力分量較大 → A 有往下滑的趨勢，摩擦力向上 = ' + D(par, 2) + ' − ' + WB : '兩者相等 → 摩擦力為 0') + (f ? ' = ' + Nu(Math.abs(f)) + '。' : '。'), G.svg(340, 250, g)];
  }

  /* ================= 材料 ================= */

  // 混凝土配比：用水量、水灰比、水泥量
  function mixDesign() {
    var W = pick([160, 170, 175, 180, 185, 190, 200]), wc = pick([0.4, 0.45, 0.5, 0.55, 0.6]), C = W / wc, ask = pick(['C', 'C', 'wc', 'bag']), K = U('kg');
    if (ask === 'C') return ['某混凝土每立方公尺用水量 ' + W + ' kg，水灰比 ' + wc + '，則每立方公尺水泥用量為何？', O(K(C), [K(W * wc), K(C * 1.1), K(C / 2), K(W + C)], more(K, C)), '水灰比 = 水重 / 水泥重 → 水泥 = ' + W + ' ÷ ' + wc + ' = ' + K(C) + '。'];
    if (ask === 'wc') return ['某混凝土每立方公尺用水 ' + W + ' kg、水泥 ' + D(C, 1) + ' kg，其水灰比為何？', O(D(wc, 2), [D(1 / wc, 2), D(wc + 0.05, 2), D(wc - 0.05, 2), D(W / (W + C), 2)]), '水灰比 = 水 / 水泥 = ' + W + ' / ' + D(C, 1) + ' = ' + D(wc, 2) + '。水灰比越小，強度越高（Abrams 定律）。'];
    var V = pick([2, 3, 4, 5, 10]), bags = C * V / 50;
    return ['澆置 ' + V + ' m³ 混凝土，每立方公尺用水 ' + W + ' kg、水灰比 ' + wc + '，共需幾包 50 kg 裝的水泥？', O(D(bags, 1) + ' 包', [D(C / 50, 1) + ' 包', D(W * wc * V / 50, 1) + ' 包', D(bags * 2, 1) + ' 包', D(C * V / 40, 1) + ' 包']), '每立方公尺水泥 = ' + W + ' ÷ ' + wc + ' = ' + D(C, 1) + ' kg；共 ' + D(C, 1) + ' × ' + V + ' = ' + D(C * V, 1) + ' kg ÷ 50 = ' + D(bags, 1) + ' 包（實務無條件進位）。'];
  }

  // 材料單位重與孔隙率
  function porosity() {
    var V = pick([100, 200, 250, 500, 1000]), rho = pick([2.2, 2.25, 2.4, 2.5, 2.55]), Gs = pick([2.6, 2.65, 2.7, 2.75, 2.8]), M = rho * V, p = (1 - rho / Gs) * 100, ask = pick(['rho', 'p', 'p']);
    var ex = '單位重（視密度）= 乾重 / 總體積（含孔隙）= ' + D(M, 1) + ' / ' + V + ' = ' + D(rho, 3) + ' g/cm³。\n孔隙率 = (1 − 單位重/比重) × 100% = (1 − ' + D(rho, 3) + '/' + Gs + ') × 100% = ' + D(p, 2) + '%；密實度 = ' + D(100 - p, 2) + '%。';
    var q = '某石材試體烘乾重 ' + D(M, 1) + ' g、總體積（含孔隙）' + V + ' cm³，其真比重為 ' + Gs + '，';
    if (ask === 'rho') return [q + '單位重為何？', O(D(rho, 3) + ' g/cm³', [D(Gs, 3) + ' g/cm³', D(M / (V * 1.1), 3) + ' g/cm³', D(rho * Gs / 2.5, 3) + ' g/cm³', D(V / M, 3) + ' g/cm³']), ex];
    return [q + '孔隙率為何？', O(D(p, 2) + '%', [D(100 - p, 2) + '%', D((Gs / rho - 1) * 100, 2) + '%', D(p * 2, 2) + '%', D((Gs - rho) * 10, 2) + '%']), ex];
  }

  // 粒料含水狀態：烘乾、面乾內飽和、濕重
  function aggWater() {
    var Dg = pick([500, 1000, 2000]), ab = pick([0.8, 1, 1.2, 1.5, 2, 2.5, 3]), m = ab + pick([1, 1.5, 2, 2.5, 3, 4]), S = Dg * (1 + ab / 100), Wt = Dg * (1 + m / 100), sf = (Wt - S) / S * 100, ask = pick(['ab', 'm', 'sf']);
    var ex = '吸水率 = (面乾內飽和重 − 烘乾重) / 烘乾重 = (' + D(S, 1) + ' − ' + Dg + ') / ' + Dg + ' = ' + D(ab, 2) + '%。\n含水量 = (濕重 − 烘乾重) / 烘乾重 = ' + D(m, 2) + '%。\n表面含水率 = (濕重 − 面乾內飽和重) / 面乾內飽和重 = ' + D(sf, 2) + '%（混凝土拌和時要從用水量扣掉這部分）。';
    var q = '某細粒料烘乾重 ' + Dg + ' g、面乾內飽和重 ' + D(S, 1) + ' g、濕重 ' + D(Wt, 1) + ' g，';
    var P = function (v) { return D(v, 2) + '%'; };
    if (ask === 'ab') return [q + '吸水率為何？', O(P(ab), [P(m), P(m - ab), P(sf), P(ab * 2)]), ex];
    if (ask === 'm') return [q + '含水量為何？', O(P(m), [P(ab), P(m - ab), P((Wt - Dg) / Wt * 100), P(sf)]), ex];
    return [q + '表面含水率為何？', O(P(sf), [P(m), P(ab), P(m + ab), P((Wt - S) / Dg * 100 + 0.3)]), ex];
  }

  /* ================= 測量 ================= */

  // 誤差傳播：分段量距、加權平均、面積中誤差
  function errProp() {
    var k = pick(['seg', 'wt', 'area']), M = U('mm', 1);
    if (k === 'seg') {
      var nn = pick([4, 9, 16, 25]), m = pick([2, 3, 4, 5]), e = m * Math.sqrt(nn);
      return ['以 30 m 捲尺分 ' + nn + ' 段量一條直線，每段量距的中誤差為 ±' + m + ' mm，全長的中誤差為何？', O('±' + M(e), ['±' + M(m * nn), '±' + M(m), '±' + M(m / Math.sqrt(nn)), '±' + M(e * 2)]), '偶然誤差依平方和開根號累積：M = ±m√n = ±' + m + ' × √' + nn + ' = ±' + M(e) + '（與段數的平方根成正比）。'];
    }
    if (k === 'wt') {
      var base = pick([85, 120, 150, 236]), v = [ri(10, 40), ri(10, 40), ri(10, 40)], p = [pick([1, 2]), pick([2, 3]), pick([3, 4, 6])];
      var sp = p[0] + p[1] + p[2], mean = (v[0] * p[0] + v[1] * p[1] + v[2] * p[2]) / sp, L = function (mm) { return (base + mm / 1000).toFixed(3); };
      return ['同一距離由三組量測，結果與觀測次數為：' + L(v[0]) + ' m（' + p[0] + ' 次）、' + L(v[1]) + ' m（' + p[1] + ' 次）、' + L(v[2]) + ' m（' + p[2] + ' 次），其最或是值為何？', O(D(base + mean / 1000, 4) + ' m', [D(base + (v[0] + v[1] + v[2]) / 3000, 4) + ' m', D(base + (v[0] / p[0] + v[1] / p[1] + v[2] / p[2]) / (1 / p[0] + 1 / p[1] + 1 / p[2]) / 1000, 4) + ' m', L(v[2]) + ' m', D(base + mean / 1000 + 0.002, 4) + ' m']),
        '觀測次數越多可信度越高，權與次數成正比 → 加權平均。\n只看小數部分：(' + v[0] + '×' + p[0] + ' + ' + v[1] + '×' + p[1] + ' + ' + v[2] + '×' + p[2] + ') / ' + sp + ' = ' + D(mean, 2) + ' mm → ' + D(base + mean / 1000, 4) + ' m。'];
    }
    var t = pick([[30, 40], [40, 30], [60, 80], [50, 120], [120, 50], [80, 60]]), a = t[0], b = t[1], m2 = pick([0.01, 0.02, 0.05]), mA = Math.sqrt(Math.pow(b * m2, 2) + Math.pow(a * m2, 2));
    return ['矩形土地量得長 ' + a + ' m、寬 ' + b + ' m，兩邊的中誤差皆為 ±' + m2 + ' m，面積的中誤差為何？', O('±' + D(mA, 2) + ' m²', ['±' + D((a + b) * m2, 2) + ' m²', '±' + D(m2 * m2 * a * b, 4) + ' m²', '±' + D(Math.sqrt(2) * m2, 3) + ' m²', '±' + D(mA * 2, 2) + ' m²']),
      'A = ab，誤差傳播：m_A = ±√[(b·m_a)² + (a·m_b)²] = ±√[(' + b + '×' + m2 + ')² + (' + a + '×' + m2 + ')²] = ±' + D(mA, 2) + ' m²。'];
  }

  // 傾斜量距改正：給高差或傾角
  function slopeDist() {
    var S = ri(2000, 6000) / 100, useH = Math.random() < 0.6, M = U('m', 3), g = '';
    var x0 = 40, y0 = 190, x1 = 320, y1 = 90;
    g = G.L(x0, y0, x1, y1, 'thick acc') + G.L(x0, y0, x1, y0, 'thin dash') + G.L(x1, y1, x1, y0, 'thin dash') + G.C(x0, y0, 3.5, 'dot') + G.C(x1, y1, 3.5, 'dot') + G.T(x0 - 6, y0 + 4, 'A', 'end') + G.T(x1 + 6, y1, 'B', 'start');
    g += G.T((x0 + x1) / 2 - 10, (y0 + y1) / 2 - 10, '斜距 ' + S.toFixed(2) + ' m', 'middle', 'small') + G.T((x0 + x1) / 2, y0 + 18, '平距 = ?', 'middle', 'small');
    if (useH) {
      var hm = ri(10, 40) / 10, Hd = Math.sqrt(S * S - hm * hm), cr = hm * hm / (2 * S);
      g += G.T(x1 + 8, (y0 + y1) / 2 + 4, 'h = ' + hm.toFixed(1) + ' m', 'start', 'small');
      var ask = pick(['H', 'c']), fig = G.svg(400, 220, g), ex = '平距 = √(S² − h²) = √(' + S.toFixed(2) + '² − ' + hm.toFixed(1) + '²) = ' + M(Hd) + '。\n傾斜改正 C_h ≈ −h²/(2S) = −' + hm.toFixed(1) + '² / (2 × ' + S.toFixed(2) + ') = −' + M(cr) + '（恆為負）。';
      if (ask === 'H') return ['如圖，沿斜坡量得 AB 斜距 ' + S.toFixed(2) + ' m，兩點高差 ' + hm.toFixed(1) + ' m，AB 水平距離為何？', O(M(Hd), [M(S - hm), M(S + cr), M(Math.sqrt(S * S + hm * hm)), M(S - cr * 2)]), ex, fig];
      return ['如圖，沿斜坡量得 AB 斜距 ' + S.toFixed(2) + ' m，兩點高差 ' + hm.toFixed(1) + ' m，傾斜改正量約為何？', O('−' + M(cr), ['+' + M(cr), '−' + M(cr * 2), '−' + M(hm * hm / S / 10), '+' + M(cr * 2)]), ex, fig];
    }
    var a = pick([30, 37, 45, 53, 60]), Hd2 = S * cs(a);
    g += G.arc(x0, y0, 40, 0, 20) + G.lab(x0, y0, 58, 10, a + '°') + QH.slope(x0, y0, 0, 20, a, 60, 50);
    return ['如圖，沿斜坡量得 AB 斜距 ' + S.toFixed(2) + ' m，傾角 ' + a + '°（cos' + a + '° = ' + cs(a) + '），AB 水平距離為何？', O(M(Hd2), [M(S * sn(a)), M(S / cs(a)), M(S - S * sn(a)), M(S * cs(a) * 0.9)]), '平距 = 斜距 × cosθ = ' + S.toFixed(2) + ' × ' + cs(a) + ' = ' + M(Hd2) + '；高差 = 斜距 × sinθ = ' + M(S * sn(a)) + '。', G.svg(400, 220, g)];
  }

  // 閉合水準路線：閉合差依距離比例分配
  function levelLoop() {
    var H0 = ri(20000, 60000) / 1000, d = [ri(2, 8) * 100, ri(2, 8) * 100, ri(2, 8) * 100], tot = d[0] + d[1] + d[2];
    var dh1 = ri(-2500, 2500) / 1000, dh2 = ri(-2500, 2500) / 1000, e = pick([6, 9, 12, -6, -9, -12, 8, -8]) / 1000, dh3 = -(dh1 + dh2) + e;
    var c1 = -e * d[0] / tot, c2 = -e * (d[0] + d[1]) / tot, H1 = H0 + dh1 + c1, H2 = H0 + dh1 + dh2 + c2, ask = pick(['e', 'H1', 'H2']), M = U('m', 3);
    var sg = function (x) { return (x >= 0 ? '+' : '−') + Math.abs(x).toFixed(3); };
    var q = '由 BM（高程 ' + H0.toFixed(3) + ' m）出發施測閉合水準路線 BM → 1 → 2 → BM，各段高差依序為 ' + sg(dh1) + '、' + sg(dh2) + '、' + sg(dh3) + ' m，距離依序為 ' + d.join('、') + ' m，';
    var ex = '閉合差 = ΣΔh = ' + sg(dh1) + ' ' + sg(dh2) + ' ' + sg(dh3) + ' = ' + sg(e) + ' m（閉合路線理論上應為 0）。\n改正數與距離成正比、符號相反：點 1 改正 = −(' + sg(e) + ') × ' + d[0] + '/' + tot + ' = ' + sg(c1) + ' m；點 2 改正 = −(' + sg(e) + ') × ' + (d[0] + d[1]) + '/' + tot + ' = ' + sg(c2) + ' m。\nH₁ = ' + M(H1) + '；H₂ = ' + M(H2) + '。';
    if (ask === 'e') return [q + '閉合差為何？', O(sg(e) + ' m', [sg(-e) + ' m', sg(e * 2) + ' m', '0.000 m', sg(dh3) + ' m']), ex];
    if (ask === 'H1') return [q + '依距離比例改正後，點 1 的高程為何？', O(M(H1), [M(H0 + dh1), M(H0 + dh1 - c1), M(H0 + dh1 - e / 3), M(H0 + dh1 + c2)]), ex];
    return [q + '依距離比例改正後，點 2 的高程為何？', O(M(H2), [M(H0 + dh1 + dh2), M(H0 + dh1 + dh2 - c2), M(H0 + dh1 + dh2 + c1), M(H0 + dh1 + dh2 - e)]), ex];
  }

  // 方位角與距離求坐標（坐標正算）
  function coordFwd() {
    var base = pick([30, 37, 45, 53, 60]), q4 = ri(0, 3), az = base + q4 * 90, Dm = pick([50, 80, 100, 120, 150, 200, 250]);
    var sinA = [sn(base), cs(base), -sn(base), -cs(base)][q4], cosA = [cs(base), -sn(base), -cs(base), sn(base)][q4];
    var NA = ri(1000, 5000) + ri(0, 999) / 1000, EA = ri(1000, 5000) + ri(0, 999) / 1000, dN = Dm * cosA, dE = Dm * sinA, ask = pick(['N', 'E']), M = U('m', 3);
    var o = [120, 140], r = 90, bx = o[0] + r * sinA, by = o[1] - r * cosA;
    var g = G.A(o[0], o[1] + 20, o[0], 25, 'thin') + G.T(o[0], 18, 'N', 'middle', 'small') + G.L(o[0], o[1], bx, by, 'thick acc') + G.C(o[0], o[1], 3.5, 'dot') + G.C(bx, by, 3.5, 'dot');
    g += G.arc(o[0], o[1], 26, 90, 90 - az, 'thin') + G.lab(o[0], o[1], 42, 90 - Math.min(az, 330) / 2, az + '°') + (q4 ? QH.slope(o[0], o[1], 90 - 90 * q4, 90 - az, base, 30, 34) : QH.slope(o[0], o[1], 0, 90 - az, 90 - base, 30, 40, true)) + G.T(o[0] - 8, o[1] + 16, 'A', 'end') + G.T(bx + (sinA >= 0 ? 8 : -8), by + 4, 'B', sinA >= 0 ? 'start' : 'end');
    g += G.T(o[0] + (bx - o[0]) * 0.84 + (sinA >= 0 ? -10 : 10), o[1] + (by - o[1]) * 0.84 + 4, Dm + ' m', sinA >= 0 ? 'end' : 'start', 'small');
    var q = '如圖，已知 A 點坐標 N = ' + NA.toFixed(3) + ' m、E = ' + EA.toFixed(3) + ' m，AB 方位角 ' + az + '°、水平距離 ' + Dm + ' m，B 點的 ' + (ask === 'N' ? '縱坐標 N_B' : '橫坐標 E_B') + ' 為何？（sin' + base + '° = ' + sn(base) + '、cos' + base + '° = ' + cs(base) + '）';
    var ex = '縱距 ΔN = D cosφ = ' + Dm + ' × cos' + az + '° = ' + D(dN, 3) + ' m；橫距 ΔE = D sinφ = ' + Dm + ' × sin' + az + '° = ' + D(dE, 3) + ' m（第 ' + (q4 + 1) + ' 象限，' + ['N+、E+', 'N−、E+', 'N−、E−', 'N+、E−'][q4] + '）。\nN_B = ' + M(NA + dN) + '，E_B = ' + M(EA + dE) + '。';
    if (ask === 'N') return [q, O(M(NA + dN), [M(NA + dE), M(NA - dN), M(NA + Math.abs(dN)), M(NA - dE)]), ex, G.svg(260, 260, g)];
    return [q, O(M(EA + dE), [M(EA + dN), M(EA - dE), M(EA + Math.abs(dE)), M(EA - dN)]), ex, G.svg(260, 260, g)];
  }

  // 坐標法求面積（四邊形，點位隨機）
  function shoelace() {
    var P = [[ri(0, 15), ri(0, 15)], [ri(40, 60), ri(0, 15)], [ri(45, 70), ri(35, 60)], [ri(0, 20), ri(35, 55)]].map(function (p) { return [p[0] * 2, p[1] * 2]; });
    var s2 = 0; for (var i = 0; i < 4; i++) { var a = P[i], b = P[(i + 1) % 4]; s2 += a[0] * b[1] - b[0] * a[1]; }
    var A = Math.abs(s2) / 2, ox = 40, oy = 230, sc = 1.9, X = function (p) { return [ox + p[0] * sc, oy - p[1] * sc]; };
    var g = G.A(ox, oy, ox + 280, oy, 'thin') + G.A(ox, oy, ox, 10, 'thin') + G.T(ox + 284, oy + 4, 'E', 'start', 'small') + G.T(ox, 6, 'N', 'middle', 'small');
    g += G.poly(P.map(X).concat([X(P[0])]), 'thick acc fill2');
    P.forEach(function (p, i) { var q = X(p); g += G.C(q[0], q[1], 3.5, 'dot') + G.T(q[0] + (i === 1 || i === 2 ? 6 : -6), q[1] + (i < 2 ? 16 : -6), (i + 1) + '(' + p[1] + ', ' + p[0] + ')', i === 1 || i === 2 ? 'start' : 'end', 'small'); });
    var Mu = U('m²', 1);
    return ['如圖之四邊形土地，各點坐標標示為（N, E），單位 m，其面積為何？', O(Mu(A), [Mu(Math.abs(s2)), Mu(A * 0.9), Mu(A + 50), Mu((P[1][0] - P[0][0]) * (P[3][1] - P[0][1]))]),
      '坐標法（交叉相乘）：2A = |Σ(E_i × N_(i+1) − E_(i+1) × N_i)| = ' + Math.abs(s2) + ' → A = ' + Mu(A) + '。\n記得最後要除以 2，且點位要依順序（順時針或逆時針）排列。', G.svg(360, 260, g)];
  }

  /* ================= 製圖 ================= */

  // 比例尺與面積
  function areaScale() {
    var S = pick([100, 200, 300, 500, 1000]), A = pick([2, 4, 6, 8, 12, 20, 25, 36]), real = A * S * S / 10000, inv = Math.random() < 0.4, Mu = U('m²', 2);
    if (!inv) return ['在比例尺 1/' + S + ' 的圖上量得某區域面積 ' + A + ' cm²，實際面積為何？', O(Mu(real), [Mu(A * S / 10000), Mu(real * 10), Mu(real / 10), Mu(real * 4)]), '長度放大 ' + S + ' 倍 → 面積放大 ' + S + '² 倍。\n實際面積 = ' + A + ' × ' + S + '² cm² = ' + (A * S * S) + ' cm² = ' + Mu(real) + '（1 m² = 10000 cm²）。'];
    var C = U('cm²', 2);
    return ['實際面積 ' + D(real, 2) + ' m² 的基地，以 1/' + S + ' 繪製時，圖上面積為何？', O(C(A), [C(A * S / 100), C(A / 10), C(A * 10), C(A * 4)]), '圖上面積 = 實際面積 ÷ ' + S + '² = ' + D(real * 10000, 0) + ' cm² ÷ ' + (S * S) + ' = ' + C(A) + '。'];
  }

  // 正六邊形：對邊距、對角距、邊長
  function hexagon() {
    var a = pick([10, 12, 15, 20, 24, 30, 40]), ask = pick(['oc', 'side', 'fc']), r3 = 1.732, cx = 170, cy = 130, R = 85, pts = [];
    for (var i = 0; i <= 6; i++) pts.push([cx + R * Math.cos(rad(60 * i)), cy - R * Math.sin(rad(60 * i))]);
    var g = G.poly(pts, 'thick acc') + G.C(cx, cy, R, 'thin dash') + G.C(cx, cy, 2.5, 'dot');
    var M = U('mm', 2), q, ans, c, ex = '正六邊形可分成 6 個正三角形：邊長 a = 外接圓半徑；對角距 = 2a；對邊距 = a√3 ≈ ' + r3 + 'a。';
    if (ask === 'oc') { g += G.dim(pts[3][0], pts[0][0], cy + 105, '對角距 = ?') + G.T(cx, pts[1][1] - 10, '邊長 ' + a + ' mm', 'middle', 'small'); q = '如圖之正六邊形，邊長 ' + a + ' mm，其對角距為何？'; ans = M(2 * a); c = [M(a * r3), M(a), M(a * 3), M(a * r3 * 2)]; }
    else if (ask === 'side') { g += G.dimV(cx + R + 30, pts[1][1], pts[5][1], '對邊距 ' + D(a * r3, 2) + ' mm', 1); q = '如圖之正六邊形（例如六角螺帽），對邊距 ' + D(a * r3, 2) + ' mm（√3 ≈ ' + r3 + '），邊長為何？'; ans = M(a); c = [M(a * r3 / 2), M(a * 2), M(a * r3), M(a / 2)]; }
    else { g += G.dim(pts[3][0], pts[0][0], cy + 105, '外接圓直徑 ' + 2 * a + ' mm'); q = '如圖，以直徑 ' + 2 * a + ' mm 的外接圓作正六邊形，其對邊距為何？（√3 ≈ ' + r3 + '）'; ans = M(a * r3); c = [M(2 * a), M(a), M(a * r3 * 2), M(a * 1.5)]; }
    return [q, O(ans, c), ex + '\n用圓規以半徑在外接圓上連續截 6 次即可畫出。', G.svg(400, 260, g)];
  }

  var it = function (t, f) { return { t: t, g: function () { return f(); } }; };
  [addEasy, addHard, addTc].forEach(function (add) {
    add('mech', 1, [it('兩繩懸吊（角度變化）', hang2)]);
    add('mech', 2, [it('外伸梁支承反力（看圖）', overhang)]);
    add('mech', 3, [it('水平桿與斜拉索（看圖）', boom)]);
    add('mech', 4, [it('空間力分量與方向餘弦', spaceForce)]);
    add('mech', 5, [it('三角形桁架節點法（看圖）', triTruss)]);
    add('mech', 6, [it('定滑輪連接物體的摩擦（看圖）', pulleyFric)]);
    add('mat', 0, [it('單位重與孔隙率', porosity)]);
    add('mat', 2, [it('混凝土配比（水灰比與水泥量）', mixDesign), it('粒料吸水率與含水量', aggWater)]);
    add('surv', 0, [it('坐標正算（方位角與距離，看圖）', coordFwd)]);
    add('surv', 1, [it('誤差傳播與加權平均', errProp)]);
    add('surv', 2, [it('傾斜量距改正（看圖）', slopeDist)]);
    add('surv', 5, [it('閉合水準路線閉合差分配', levelLoop)]);
    add('surv', 6, [it('坐標法求面積（看圖）', shoelace)]);
    add('draw', 2, [it('比例尺與面積換算', areaScale)]);
    add('draw', 4, [it('正六邊形尺寸（看圖）', hexagon)]);
  });

  // 觀念題（只掛簡單版）
  addEasy('mech', 0, [
    ['剛體', '力學中將物體視為「剛體」，意思是？', ['受力後任兩點間的距離不變', '物體的質量非常大', '物體不受重力作用', '物體只能平移不能轉動'], '剛體是理想化模型：受力後形狀與大小都不改變。'],
    ['力的可傳性', '力的可傳性原理適用於下列哪一種情況？', ['剛體，討論外效應（運動與平衡）時', '變形體，討論內力時', '任何物體，討論應力時', '只適用於共點力系'], '力沿作用線移動，不改變對剛體的外效應；但會改變內效應（內力、變形）。']
  ]);
  addEasy('mech', 5, [
    ['桁架靜定判斷', '平面桁架有 m 根桿件、j 個節點、r 個支承反力，靜定的必要條件為？', ['m + r = 2j', 'm + r = 3j', 'm = 2j + 3', 'm + j = r'], '每個節點有 2 個平衡方程 → 共 2j 個方程，未知數為 m + r；m + r > 2j 為靜不定，< 2j 為不穩定。']
  ]);
  addEasy('mech', 6, [
    ['摩擦角', '摩擦角 φ 與靜摩擦係數 μs 的關係為？', ['tanφ = μs', 'sinφ = μs', 'cosφ = μs', 'φ = μs'], '最大靜摩擦力與正向力的合力和法線的夾角為摩擦角，tanφ = f_max / N = μs；物體在斜面上恰好下滑的靜止角等於摩擦角。']
  ]);
  addEasy('mat', 1, [
    ['水泥成分水化', '水泥成分中水化最快、放熱最多，需要加石膏控制急凝的是？', ['C3A（鋁酸三鈣）', 'C2S（矽酸二鈣）', 'C4AF（鋁鐵酸四鈣）', 'C3S（矽酸三鈣）'], 'C3A 水化最快、水化熱最大；C3S 主導早期強度；C2S 水化慢、主導長期強度。']
  ]);
  addEasy('mat', 2, [
    ['泌水', '混凝土澆置後，拌和水上升到表面的現象稱為？', ['泌水', '析離', '潛變', '乾縮'], '泌水會在表面形成浮水泥漿（乳沫）；析離是粗細粒料分離；潛變是長期載重下變形增加。'],
    ['混凝土養護', '有關混凝土養護，下列何者正確？', ['目的是維持適當溫度與濕度，讓水泥持續水化', '澆置後應曝曬以加速硬化', '養護越乾燥強度越高', '使用早強水泥就不需要養護'], '養護不足會使水泥水化中斷、強度降低並產生乾縮裂縫，一般至少濕治養護 7 天。']
  ]);
  addEasy('mat', 3, [
    ['強化玻璃', '強化玻璃破裂時的特性為何？', ['碎成細小鈍角顆粒，不易傷人', '碎片黏在中間膜上不掉落', '裂成大塊尖銳碎片', '受衝擊也不會破裂'], '強化玻璃加熱後急速冷卻，表面形成壓應力，強度約為普通玻璃 3～5 倍；碎片黏在中間膜上的是膠合玻璃。']
  ]);
  addEasy('surv', 3, [
    ['稜鏡常數', '全站儀測距需要做「稜鏡常數」改正，原因是？', ['稜鏡的等效反射中心與稜鏡桿（測點）中心不一致', '大氣溫度與氣壓改變', '地球曲率的影響', '儀器高與稜鏡高不同'], '光在稜鏡玻璃中走得較慢，等效反射點與測點不重合，需加減一固定常數（如 −30 mm）；溫度氣壓是氣象改正。']
  ]);
  addEasy('surv', 4, [
    ['視差消除', '水準儀觀測時眼睛上下移動，十字絲與標尺影像相對移動（視差），消除方法為？', ['先調目鏡使十字絲清晰，再調物鏡對光使影像清晰', '調整腳螺旋使氣泡居中', '重新整置儀器', '調整水準管校正螺旋'], '視差是標尺影像沒有落在十字絲平面上，依序調目鏡、物鏡對光即可消除。']
  ]);
  addEasy('surv', 5, [
    ['前後視距相等', '水準測量時保持前視與後視距離相等，可以消除哪些誤差？', ['視準軸誤差、地球曲率差與大氣折光差', '標尺零點誤差', '標尺傾斜誤差', '讀數錯誤'], '前後視距相等時這些誤差在前後視讀數中大小相同而抵消；標尺零點誤差要靠偶數站消除，標尺傾斜要扶直標尺。']
  ]);
  addEasy('draw', 0, [
    ['A0 面積', 'A0 圖紙的面積約為多少？', ['1 m²', '0.5 m²', '2 m²', '1.5 m²'], 'A0 = 841 × 1189 mm ≈ 1 m²；每小一號面積減半（A1 ≈ 0.5 m²）。']
  ]);
  addEasy('draw', 5, [
    ['投影分類', '投射線互相平行且垂直於投影面的投影法稱為？', ['正投影', '斜投影', '透視投影', '中心投影'], '平行投影分正投影（投射線垂直投影面）與斜投影（投射線傾斜）；透視投影的投射線集中於一點。']
  ]);
  addEasy('draw', 6, [
    ['第三角法視圖位置', '第三角法中，右側視圖應放在前視圖的哪一側？', ['右側', '左側', '上方', '下方'], '第三角法「看到哪邊就畫在哪邊」：右側視圖在前視圖右邊、俯視圖在上方；第一角法剛好相反。']
  ]);
})();

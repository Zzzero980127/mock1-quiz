/* v2.8：材料科的變化圖題型——試驗的圖（曲線形狀、試體、數據、問法）每次都換。
 * 材料與試驗：應力應變曲線、拉伸試驗前後試體、精密度／精準度靶圖、常態分佈
 * 水泥：維卡針凝結時間曲線、砂漿立方試體抗壓
 * 混凝土：篩分析長條圖（細度模數）、坍度試驗、水灰比–強度曲線、劈裂抗張、抗彎（三分點／中點載重）
 * 石材：乾重／飽和面乾重／水中重（吸水率、比重）
 * 用 GF（add_v24.js）；一律 addEasy／addHard／addTc 往後接，不插隊、不刪題。
 */
(function () {
  var G = GF, H = QH, D = H.dec, n = H.n;
  // 選項不足 4 個時，用正解的數字微調補干擾選項
  function O(ans, c, mf) { var r = H.opts(ans, c, mf); return r.length < 4 ? H.fill(r) : r; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function U(u) { return function (x) { return D(x, 2) + ' ' + u; }; }
  function more(f, ans) { return function (k) { return f(ans * (1 + (k % 2 ? 1 : -1) * 0.1 * Math.ceil(k / 2))); }; }
  function shade(pts) { return '<path d="M' + pts.map(function (p) { return G.r1(p[0]) + ',' + G.r1(p[1]); }).join(' L') + ' Z" style="fill:var(--accent);opacity:.35;stroke:none"/>'; }
  function axes(ox, oy, w, h, xl, yl) { return G.A(ox, oy, ox + w, oy, 'thin') + G.A(ox, oy, ox, oy - h, 'thin') + G.T(ox + w, oy + 30, xl, 'end', 'small') + G.T(ox + 6, oy - h + 4, yl, 'start', 'small'); }

  /* ================= 材料與試驗 ================= */

  // 應力–應變曲線：延性（有降伏平台）、無明顯降伏（偏移法）、脆性，點的字母隨機
  function stressStrain() {
    var kind = pick(['steel', 'steel', 'alu', 'brittle']), ox = 45, oy = 200, s = axes(ox, oy, 300, 180, '應變 ε', '應力 σ'), letters = shuffle(['A', 'B', 'C', 'D']);
    if (kind === 'steel') {
      var Pp = [ox + 28, oy - 110], Yp = [ox + 40, oy - 120], Up = [ox + 200, oy - 165], Fp = [ox + 270, oy - 128];
      s += G.P('M' + ox + ',' + oy + ' L' + Pp.join(',') + ' L' + Yp.join(',') + ' L' + (ox + 46) + ',' + (oy - 108) + ' L' + (ox + 100) + ',' + (oy - 110) + ' Q' + (ox + 150) + ',' + (oy - 170) + ' ' + Up.join(',') + ' Q' + (ox + 245) + ',' + (oy - 160) + ' ' + Fp.join(','), 'thick acc');
      var pts = [Pp, Yp, Up, Fp], nm = ['比例限度', '降伏點（上降伏點）', '極限強度', '斷裂點'];
      pts.forEach(function (p, i) { s += G.C(p[0], p[1], 3, 'dot') + G.T(p[0] + (i === 0 ? -8 : 6), p[1] - 7, letters[i], i === 0 ? 'end' : 'start'); });
      var ask = pick([0, 1, 2, 2, 3, 4]);
      if (ask === 4) {
        var E = pick([200, 200, 210, 70, 100]), sig = pick(E === 70 ? [140, 210, 280] : E === 100 ? [150, 200, 250] : [210, 240, 300, 420]), eps = sig / (E * 1000);
        s += G.L(ox, Pp[1], Pp[0], Pp[1], 'thin dash') + G.L(Pp[0], Pp[1], Pp[0], oy, 'thin dash') + G.T(ox - 4, Pp[1] + 4, sig + ' MPa', 'end', 'small') + G.T(Pp[0], oy + 14, String(+eps.toFixed(6)), 'middle', 'small');
        return ['如圖為某金屬的拉伸應力–應變曲線，' + letters[0] + ' 點為比例限度（應力 ' + sig + ' MPa、應變 ' + (+eps.toFixed(6)) + '），此材料的彈性係數 E 為何？', O(E + ' GPa', [E * 10 + ' GPa', E / 10 + ' GPa', E * 1000 + ' GPa', D(sig * eps, 4) + ' GPa']),
          '比例限度以內 σ 與 ε 成正比：E = σ/ε = ' + sig + ' MPa ÷ ' + (+eps.toFixed(6)) + ' = ' + E * 1000 + ' MPa = ' + E + ' GPa。', G.svg(360, 235, s)];
      }
      var good = letters[ask], ex = '延性材料（如低碳鋼）曲線依序：比例限度 → 降伏（平台） → 應變硬化到最高點（極限強度） → 頸縮後斷裂。\n本圖：' + letters.map(function (l, i) { return l + ' = ' + nm[i]; }).join('、') + '。';
      return ['如圖為低碳鋼的應力–應變曲線，代表「' + nm[ask].replace('（上降伏點）', '') + '」的是哪一點？', O(good + ' 點', letters.filter(function (l) { return l !== good; }).map(function (l) { return l + ' 點'; })), ex, G.svg(360, 235, s)];
    }
    if (kind === 'alu') {
      s += G.P('M' + ox + ',' + oy + ' L' + (ox + 40) + ',' + (oy - 120) + ' Q' + (ox + 90) + ',' + (oy - 165) + ' ' + (ox + 200) + ',' + (oy - 160) + ' L' + (ox + 240) + ',' + (oy - 150), 'thick acc');
      s += G.L(ox + 16, oy, ox + 66, oy - 150, 'thin dash') + G.T(ox + 16, oy + 14, '0.2%', 'middle', 'small');
      return ['如圖為鋁合金的應力–應變曲線，沒有明顯的降伏點，其降伏強度通常如何決定？', O('0.2% 偏移法：自應變 0.002 處畫平行於直線段的線，與曲線交點的應力', ['取曲線最高點的應力', '取斷裂時的應力', '取比例限度的應力的一半']),
        '無明顯降伏平台的材料（鋁、高強度鋼）用偏移法：在 ε = 0.2%（0.002）處畫一條平行於彈性直線段的線，交曲線處的應力定為降伏強度（圖中虛線）。', G.svg(360, 235, s)];
    }
    var fx = ox + pick([90, 120, 150]), fy = oy - pick([120, 140, 160]);
    s += G.P('M' + ox + ',' + oy + ' Q' + (ox + (fx - ox) * 0.6) + ',' + (oy - (oy - fy) * 0.75) + ' ' + fx + ',' + fy, 'thick acc') + G.L(fx - 5, fy - 5, fx + 5, fy + 5, 'thick') + G.L(fx - 5, fy + 5, fx + 5, fy - 5, 'thick') + G.T(fx + 8, fy - 6, '斷裂', 'start', 'small');
    return ['如圖的應力–應變曲線（× 為斷裂處），最可能是哪一類材料？', O('脆性材料，如鑄鐵、混凝土', ['延性材料，如低碳鋼', '彈性體，如橡膠', '有明顯降伏平台的鋼筋']),
      '曲線幾乎沒有塑性變形就突然斷裂、沒有降伏平台與頸縮 → 脆性材料（鑄鐵、混凝土、玻璃）。延性材料斷裂前會有很大的伸長。', G.svg(360, 235, s)];
  }

  // 拉伸試驗：斷裂前後的試體，求伸長率或斷面縮率
  function tensile() {
    var L0 = pick([50, 100, 200]), e = pick([0.12, 0.15, 0.18, 0.2, 0.24, 0.25, 0.3]), L1 = L0 * (1 + e), dp = pick([[10, 8, 36], [10, 7, 51], [10, 6, 64], [20, 16, 36], [20, 14, 51], [20, 12, 64], [10, 9, 19]]), ask = pick(['el', 'ra']);
    var s = '', y1 = 55, y2 = 150, x0 = 85, sc = 190 / L1, w0 = L0 * sc, w1 = L1 * sc, t = 22;
    s += G.Rc(x0 - 30, y1 - t / 2 - 6, 30, t + 12, 'fill') + G.Rc(x0, y1 - t / 2, w0, t, 'fill2 acc') + G.Rc(x0 + w0, y1 - t / 2 - 6, 30, t + 12, 'fill');
    s += G.dim(x0, x0 + w0, y1 + 26, 'L₀ = ' + L0 + ' mm') + G.T(x0 + w0 + 40, y1 + 4, 'd₀ = ' + dp[0] + ' mm', 'start', 'small') + G.T(x0 - 15, y1 - 22, '試驗前', 'middle', 'small');
    var mid = x0 + w1 * 0.55, nk = t * dp[1] / dp[0];
    s += G.Rc(x0 - 30, y2 - t / 2 - 6, 30, t + 12, 'fill') + G.P('M' + x0 + ',' + (y2 - t / 2) + ' L' + (mid - 14) + ',' + (y2 - t / 2) + ' Q' + (mid - 4) + ',' + (y2 - nk / 2) + ' ' + (mid - 2) + ',' + (y2 - nk / 2) + ' L' + (mid - 2) + ',' + (y2 + nk / 2) + ' Q' + (mid - 4) + ',' + (y2 + nk / 2) + ' ' + (mid - 14) + ',' + (y2 + t / 2) + ' L' + x0 + ',' + (y2 + t / 2) + ' Z', 'acc');
    s += G.P('M' + (x0 + w1) + ',' + (y2 - t / 2) + ' L' + (mid + 14) + ',' + (y2 - t / 2) + ' Q' + (mid + 4) + ',' + (y2 - nk / 2) + ' ' + (mid + 2) + ',' + (y2 - nk / 2) + ' L' + (mid + 2) + ',' + (y2 + nk / 2) + ' Q' + (mid + 4) + ',' + (y2 + nk / 2) + ' ' + (mid + 14) + ',' + (y2 + t / 2) + ' L' + (x0 + w1) + ',' + (y2 + t / 2) + ' Z', 'acc') + G.Rc(x0 + w1, y2 - t / 2 - 6, 30, t + 12, 'fill');
    s += G.dim(x0, x0 + w1, y2 + 26, 'L₁ = ' + D(L1, 1) + ' mm（斷後對接）') + G.T(mid, y2 - t / 2 - 10, 'd₁ = ' + dp[1] + ' mm', 'middle', 'small') + G.T(x0 - 15, y2 - 22, '斷裂後', 'middle', 'small');
    var fig = G.svg(360, 200, s), P = function (x) { return D(x, 1) + ' %'; };
    if (ask === 'el') return ['如圖為鋼棒拉伸試驗前後（斷裂後把兩段對接量測），其伸長率為何？', O(P(e * 100), [P(e / (1 + e) * 100), P(dp[2]), P((1 - dp[1] / dp[0]) * 100), P(e * 50)]),
      '伸長率 = (L₁ − L₀)/L₀ × 100% = (' + D(L1, 1) + ' − ' + L0 + ')/' + L0 + ' × 100% = ' + P(e * 100) + '。（分母是原長 L₀）', fig];
    return ['如圖為鋼棒拉伸試驗前後，斷裂處的斷面縮率為何？', O(P(dp[2]), [P((1 - dp[1] / dp[0]) * 100), P(e * 100), P(100 - dp[2])]),
      '斷面縮率 = (A₀ − A₁)/A₀ = 1 − (d₁/d₀)² = 1 − (' + dp[1] + '/' + dp[0] + ')² = ' + P(dp[2]) + '。（面積和直徑平方成正比，不能直接用直徑相減）', fig];
  }

  // 精密度與精準度：靶圖，點的集中程度與偏離方向隨機
  function target() {
    var prec = Math.random() < 0.5, acc = Math.random() < 0.5, cx = 180, cy = 110, s = '';
    [90, 60, 30].forEach(function (r) { s += G.C(cx, cy, r, 'thin'); }); s += G.C(cx, cy, 3, 'dot') + G.T(cx + 96, cy - 80, '中心 = 真值', 'start', 'small');
    var a = Math.random() * Math.PI * 2, off = acc ? 0 : 50, mx = cx + off * Math.cos(a), my = cy + off * Math.sin(a), spread = prec ? 9 : 45, k = ri(6, 9);
    for (var i = 0; i < k; i++) { var b = i / k * Math.PI * 2 + Math.random(), rr = spread * (0.4 + Math.random() * 0.6); s += G.C(mx + rr * Math.cos(b), my + rr * Math.sin(b), 4, 'dot'); }
    var lab = function (p, q) { return '精密度' + (p ? '佳' : '差') + '、精準度' + (q ? '佳' : '差'); };
    return ['如圖為重複試驗結果（黑點）與真值（靶心）的關係，下列描述何者正確？', O(lab(prec, acc), [lab(!prec, acc), lab(prec, !acc), lab(!prec, !acc)]),
      '精密度看各點「彼此」是否集中（偶然誤差小）；精準度看平均位置是否接近真值（系統誤差小）。\n本圖：點' + (prec ? '很集中' : '很分散') + '、平均位置' + (acc ? '在靶心' : '偏離靶心') + '。', G.svg(360, 235, s)];
  }

  // 常態分佈：陰影區間隨機（中間 ±kσ、右尾、左尾）
  function normal() {
    var k = pick([1, 2, 3]), type = pick(['mid', 'mid', 'right', 'left']), pc = { 1: 68.3, 2: 95.4, 3: 99.7 }[k], ox = 30, w = 300, base = 185;
    var X = function (z) { return ox + (z + 3.6) / 7.2 * w; }, Y = function (z) { return base - 140 * Math.exp(-z * z / 2); }, pts = [], z;
    for (z = -3.6; z <= 3.61; z += 0.1) pts.push([X(z), Y(z)]);
    var z1 = type === 'mid' ? -k : type === 'right' ? k : -3.6, z2 = type === 'mid' ? k : type === 'right' ? 3.6 : -k, sp = [[X(z1), base]];
    for (z = z1; z <= z2 + 1e-9; z += 0.05) sp.push([X(z), Y(z)]); sp.push([X(z2), base]);
    var s = shade(sp) + G.poly(pts, 'thick acc') + G.L(ox, base, ox + w, base, 'thin');
    for (var t = -3; t <= 3; t++) s += G.L(X(t), base, X(t), base + 5, 'thin') + G.T(X(t), base + 18, t === 0 ? 'μ' : 'μ' + (t > 0 ? '+' : '−') + (Math.abs(t) === 1 ? '' : Math.abs(t)) + 'σ', 'middle', 'small');
    var ans = type === 'mid' ? pc : (100 - pc) / 2, P = function (x) { return D(x, 2) + ' %'; };
    return ['試驗數據呈常態分佈，圖中陰影部分約占全部數據的多少？', O(P(ans), type === 'mid' ? [P((100 - pc) / 2), P({ 1: 95.4, 2: 99.7, 3: 68.3 }[k]), P(100 - pc)] : [P(pc), P(100 - pc), P((100 - { 1: 95.4, 2: 99.7, 3: 68.3 }[k]) / 2)]),
      'μ ± 1σ ≈ 68.3%、μ ± 2σ ≈ 95.4%、μ ± 3σ ≈ 99.7%，曲線左右對稱。' + (type === 'mid' ? '' : '\n單邊尾巴 = (100% − ' + pc + '%) ÷ 2 = ' + P(ans) + '。'), G.svg(360, 215, s)];
  }

  /* ================= 水泥 ================= */

  // 維卡針：貫入深度–時間曲線，內插求初凝
  function vicat() {
    var dt = pick([15, 30]), t0 = pick([60, 90, 120]), pr = pick([[30, 20], [35, 15], [31, 19], [28, 22], [33, 13], [27, 17]]), idx = ri(1, 2), pen = [];
    var hi = [40, 38, 36].slice(0, idx); pen = hi.concat([pr[0], pr[1]]); while (pen.length < 6) pen.push(Math.max(0, pen[pen.length - 1] - ri(6, 10)));
    var ts = pen.map(function (_, i) { return t0 + i * dt; }), i0 = idx, tin = ts[i0] + (pen[i0] - 25) / (pen[i0] - pen[i0 + 1]) * dt;
    var ox = 50, oy = 190, sx = 270 / (ts[5] - ts[0] + dt), sy = 3.6, X = function (t) { return ox + 15 + (t - ts[0]) * sx; }, Yv = function (p) { return oy - p * sy; };
    var s = axes(ox, oy, 300, 170, '時間（min）', '貫入深度（mm）') + G.L(ox, Yv(25), ox + 290, Yv(25), 'thin dash') + G.T(ox - 4, Yv(25) + 4, '25', 'end', 'small');
    s += G.poly(ts.map(function (t, i) { return [X(t), Yv(pen[i])]; }), 'thick acc');
    ts.forEach(function (t, i) { s += G.C(X(t), Yv(pen[i]), 3, 'dot') + G.T(X(t), Yv(pen[i]) - 8, pen[i], 'middle', 'small') + G.T(X(t), oy + 14, t, 'middle', 'small'); });
    var M = function (x) { return D(x, 1) + ' 分鐘'; };
    return ['如圖為水泥漿維卡針試驗的貫入深度紀錄（點上數字為貫入深度 mm），以直線內插求初凝時間約為何？', O(M(tin), [M(ts[i0]), M(ts[i0 + 1]), M(ts[i0] + dt / 2 === tin ? ts[i0] + dt / 4 : ts[i0] + dt / 2), M(ts[5])]),
      '維卡針貫入深度 25 mm 時為初凝。25 mm 落在 ' + ts[i0] + ' 分（' + pen[i0] + ' mm）與 ' + ts[i0 + 1] + ' 分（' + pen[i0 + 1] + ' mm）之間：\nt = ' + ts[i0] + ' + (' + pen[i0] + ' − 25)/(' + pen[i0] + ' − ' + pen[i0 + 1] + ') × ' + dt + ' = ' + M(tin) + '。\n終凝：針不再留下明顯痕跡。', G.svg(360, 228, s)];
  }

  // 砂漿立方試體抗壓：1 或 3 個試體
  function cube() {
    var nS = pick([1, 3]), Ps = [], fs = [];
    for (var i = 0; i < nS; i++) { var f = pick([20, 22, 24, 25, 26, 28, 30, 32, 35]); fs.push(f); Ps.push(f * 2.5); }
    var avg = fs.reduce(function (a, b) { return a + b; }, 0) / nS, s = '';
    Ps.forEach(function (P, i) {
      var x = 50 + i * 105 + (nS === 1 ? 105 : 0), y = 80, w = 60;
      s += G.Rc(x, y, w, w, 'fill2 acc') + G.P('M' + x + ',' + y + ' l14,-12 l' + w + ',0 l-14,12 Z M' + (x + w) + ',' + (y + w) + ' l14,-12 l0,-' + w, 'acc');
      s += G.A(x + w / 2 + 7, y - 52, x + w / 2 + 7, y - 14, 'acc') + G.A(x + w / 2, y + w + 40, x + w / 2, y + w + 2, 'acc') + G.T(x + w / 2 + 12, y - 40, P + ' kN', 'start', 'small');
      s += G.T(x + w / 2, y + w + 56, nS > 1 ? '試體 ' + (i + 1) : '5 cm × 5 cm × 5 cm', 'middle', 'small');
    });
    var MP = function (x) { return D(x, 2) + ' MPa'; }, sumP = Ps.reduce(function (a, b) { return a + b; }, 0);
    return ['如圖為邊長 5 cm 的水泥砂漿立方試體抗壓試驗，破壞載重如圖' + (nS > 1 ? '，三個試體的平均抗壓強度' : '，抗壓強度') + '為何？', O(MP(avg), [MP(avg * 10), MP(avg / 10), MP(sumP / 25), MP(avg * 2.5)]),
      '受壓面積 A = 50 × 50 = 2500 mm²。\n強度 = P / A：' + Ps.map(function (P, i) { return P + ' × 1000 ÷ 2500 = ' + fs[i] + ' MPa'; }).join('；') + (nS > 1 ? '\n平均 = ' + MP(avg) + '。' : '。'), G.svg(360, 235, s)];
  }

  /* ================= 混凝土 ================= */

  // 篩分析：各篩停留量長條圖，求細度模數或累積停留／通過百分率
  function sieve() {
    var names = ['No.4', 'No.8', 'No.16', 'No.30', 'No.50', 'No.100', '底盤'], pct;
    for (var t = 0; t < 100; t++) { pct = [ri(1, 4), ri(5, 9), ri(7, 12), ri(9, 14), ri(8, 13), ri(4, 8)].map(function (v) { return v * 2; }); var sm = pct.reduce(function (a, b) { return a + b; }, 0); if (sm < 98) { pct.push(100 - sm); break; } }
    var mass = pct.map(function (p) { return p * 5; }), cum = [], c = 0;
    pct.forEach(function (p, i) { if (i < 6) { c += p; cum.push(c); } });
    var FM = cum.reduce(function (a, b) { return a + b; }, 0) / 100, ox = 40, oy = 185, bw = 40, mx = Math.max.apply(null, mass), s = axes(ox, oy, 310, 165, '', '停留量 (g)');
    mass.forEach(function (m, i) { var h = m / mx * 130, x = ox + 8 + i * 43; s += G.Rc(x, oy - h, bw - 6, h, 'fill2 acc') + G.T(x + (bw - 6) / 2, oy - h - 5, m, 'middle', 'small') + G.T(x + (bw - 6) / 2, oy + 14, names[i], 'middle', 'small'); });
    s += G.T(ox + 300, 26, '試樣共 500 g', 'end', 'small');
    var ask = pick(['fm', 'fm', 'cum', 'pass']), j = ri(1, 4), P = function (x) { return D(x, 1) + ' %'; };
    var ex = '各篩停留百分率 = 停留量 ÷ 500：' + pct.slice(0, 6).map(function (p, i) { return names[i] + ' ' + p + '%'; }).join('、') + '\n累積停留：' + cum.map(function (v, i) { return names[i] + ' ' + v + '%'; }).join('、') + '\n細度模數 FM = 標準篩累積停留百分率總和 ÷ 100 = ' + cum.reduce(function (a, b) { return a + b; }, 0) + ' ÷ 100 = ' + D(FM, 2) + '（底盤不算）。';
    var fig = G.svg(360, 210, s);
    if (ask === 'fm') return ['如圖為 500 g 細粒料的篩分析結果（各篩停留量），其細度模數為何？', O(D(FM, 2), [D(FM + 1, 2), D((cum.reduce(function (a, b) { return a + b; }, 0) + 100) / 100, 2), D(pct.slice(0, 6).reduce(function (a, b) { return a + b; }, 0) / 100, 2), D(FM * 0.9, 2)], function (k) { return D(FM + 0.1 * k, 2); }), ex, fig];
    if (ask === 'cum') return ['如圖為 500 g 細粒料的篩分析結果，' + names[j] + ' 篩的累積停留百分率為何？', O(P(cum[j]), [P(pct[j]), P(100 - cum[j]), P(cum[j - 1]), P(cum[j] + pct[j + 1])]), ex, fig];
    return ['如圖為 500 g 細粒料的篩分析結果，通過 ' + names[j] + ' 篩的百分率為何？', O(P(100 - cum[j]), [P(cum[j]), P(100 - pct[j]), P(100 - cum[j - 1]), P(100 - cum[j + 1])]), ex + '\n通過百分率 = 100% − 累積停留 = ' + P(100 - cum[j]) + '。', fig];
  }

  // 坍度試驗：坍落後的形狀（正常／剪切／崩塌）與高度隨機
  function slump() {
    var type = pick(['true', 'true', 'true', 'shear', 'collapse']), sl = type === 'collapse' ? ri(22, 26) * 10 : ri(3, 20) * 10 + pick([0, 5]), hh = 300 - sl, sc = 0.55, gy = 195, cx1 = 125, cx2 = 265, s = G.hH(15, 385, gy);
    s += G.P('M' + (cx1 - 100 * sc) + ',' + gy + ' L' + (cx1 - 50 * sc) + ',' + (gy - 300 * sc) + ' L' + (cx1 + 50 * sc) + ',' + (gy - 300 * sc) + ' L' + (cx1 + 100 * sc) + ',' + gy, 'thick') + G.T(cx1, gy - 300 * sc - 8, '坍度筒（空）', 'middle', 'small');
    var top = gy - hh * sc, sh;
    if (type === 'true') sh = 'M' + (cx2 - 70) + ',' + gy + ' Q' + (cx2 - 62) + ',' + (top + 20) + ' ' + (cx2 - 30) + ',' + top + ' L' + (cx2 + 30) + ',' + top + ' Q' + (cx2 + 62) + ',' + (top + 20) + ' ' + (cx2 + 70) + ',' + gy + ' Z';
    else if (type === 'shear') sh = 'M' + (cx2 - 60) + ',' + gy + ' L' + (cx2 - 30) + ',' + (gy - 300 * sc) + ' L' + (cx2 + 5) + ',' + (gy - 300 * sc + 8) + ' L' + (cx2 + 75) + ',' + (gy - 70) + ' L' + (cx2 + 80) + ',' + gy + ' Z';
    else sh = 'M' + (cx2 - 95) + ',' + gy + ' Q' + (cx2 - 40) + ',' + top + ' ' + cx2 + ',' + top + ' Q' + (cx2 + 40) + ',' + top + ' ' + (cx2 + 95) + ',' + gy + ' Z';
    s += '<path d="' + sh + '" style="fill:var(--accent-soft)"/>' + G.P(sh, 'acc');
    if (type !== 'shear') s += G.L(cx1 + 50 * sc, gy - 300 * sc, cx2 + 60, gy - 300 * sc, 'thin dash') + G.dimV(cx2 + 90, gy - 300 * sc, top, '坍度 ?', 1) + G.dimV(cx1 - 75, gy - 300 * sc, gy, '300 mm', -1) + G.T(cx2, top - 6, '頂面高 ' + hh + ' mm', 'middle', 'small');
    var fig = G.svg(400, 215, s), mm = function (x) { return x + ' mm'; };
    if (type === 'shear') return ['如圖坍度試驗中，混凝土拔筒後一側沿斜面滑落（剪切破壞），應如何處理？', O('坍度無效，應另取試樣重做', ['照常量測最高點的坍度', '量測最低點作為坍度', '把兩側高度平均作為坍度']),
      '剪切坍落（一側滑落）表示缺乏黏聚性或操作不當，結果無效，需重新取樣試驗；若一再發生，表示混凝土不適合用坍度評估。', fig];
    if (type === 'collapse') return ['如圖坍度試驗，拔筒後混凝土幾乎攤平（頂面高 ' + hh + ' mm），下列敘述何者正確？', O('屬崩塌坍落，表示混凝土過稀（水量太多或為高流動性）', ['屬真坍度，工作性最佳', '屬剪切坍落，需重做', '坍度為 ' + hh + ' mm']),
      '崩塌坍落：混凝土完全攤開，坍度 = 300 − ' + hh + ' = ' + sl + ' mm，表示過稀或屬於自充填等高流動性混凝土（需改用坍流度評估）。', fig];
    return ['如圖坍度試驗（坍度筒高 300 mm），拔筒後混凝土頂面高 ' + hh + ' mm，坍度為何？', O(mm(sl), [mm(hh), mm(sl + 50), mm(Math.max(5, sl - 25)), mm(150)]),
      '坍度 = 坍度筒高 − 坍落後頂面高（量到頂面中心）= 300 − ' + hh + ' = ' + sl + ' mm。坍度越大表示越稀、工作性越高。', fig];
  }

  // 水灰比–強度曲線：讀圖得水灰比，再由用水量求水泥量
  function abrams() {
    var base = pick([[0.4, 45], [0.45, 40], [0.5, 35], [0.55, 30], [0.6, 26], [0.65, 22], [0.7, 19]]), shift = pick([-2, 0, 2]), pts = [[0.4, 45], [0.45, 40], [0.5, 35], [0.55, 30], [0.6, 26], [0.65, 22], [0.7, 19]].map(function (p) { return [p[0], p[1] + shift]; });
    var tgt = pick(pts.slice(0, 6)), W = pick([160, 170, 175, 180, 185, 190, 200]), Cm = W / tgt[0], ox = 50, oy = 190, X = function (w) { return ox + (w - 0.35) / 0.4 * 280; }, Y = function (f) { return oy - (f - 10) / 40 * 160; };
    var s = axes(ox, oy, 300, 175, '水灰比 W/C', '抗壓強度 (MPa)') + G.poly(pts.map(function (p) { return [X(p[0]), Y(p[1])]; }), 'thick acc');
    pts.forEach(function (p) { s += G.C(X(p[0]), Y(p[1]), 3, 'dot') + G.T(X(p[0]), oy + 14, p[0], 'middle', 'small') + G.T(X(p[0]) + 5, Y(p[1]) - 6, p[1], 'start', 'small'); });
    s += G.L(ox, Y(tgt[1]), X(tgt[0]), Y(tgt[1]), 'thin dash') + G.L(X(tgt[0]), Y(tgt[1]), X(tgt[0]), oy, 'thin dash');
    var ask = pick(['wc', 'c', 'c']), K = function (x) { return D(x, 1) + ' kg/m³'; };
    if (ask === 'wc') return ['如圖為某水泥的水灰比–強度關係（點旁數字為強度 MPa），要達到配比強度 ' + tgt[1] + ' MPa，水灰比應為多少？', O(String(tgt[0]), pts.filter(function (p) { return p[0] !== tgt[0]; }).slice(0, 4).map(function (p) { return String(p[0]); })),
      '由曲線讀出強度 ' + tgt[1] + ' MPa 對應 W/C = ' + tgt[0] + '。水灰比越小強度越高（亞伯蘭定律）。', G.svg(360, 228, s)];
    return ['如圖為水灰比–強度曲線（點旁數字為強度 MPa），配比強度要 ' + tgt[1] + ' MPa、每立方公尺用水量 ' + W + ' kg，所需水泥量約為何？', O(K(Cm), [K(W * tgt[0]), K(W / (tgt[0] + 0.05)), K(W / (tgt[0] - 0.05)), K(Cm * 1.1)]),
      '讀圖：' + tgt[1] + ' MPa → W/C = ' + tgt[0] + '。\n水泥量 C = W ÷ (W/C) = ' + W + ' ÷ ' + tgt[0] + ' = ' + K(Cm) + '。', G.svg(360, 228, s)];
  }

  // 劈裂抗張：圓柱橫放受壓
  function split() {
    var dims = pick([[150, 300], [100, 200]]), Dm = dims[0], Lm = dims[1], P = pick(Dm === 150 ? [180, 200, 220, 250, 280, 300] : [80, 90, 100, 120, 130]), T = 2 * P * 1000 / (Math.PI * Lm * Dm);
    var cx = 130, cy = 115, r = Dm === 150 ? 55 : 42, s = G.C(cx, cy, r, 'acc') + G.Rc(cx - 30, cy - r - 8, 60, 8, 'fill') + G.Rc(cx - 30, cy + r, 60, 8, 'fill') + G.A(cx, cy - r - 50, cx, cy - r - 10, 'acc') + G.A(cx, cy + r + 50, cx, cy + r + 10, 'acc') + G.T(cx + 8, cy - r - 36, 'P = ' + P + ' kN', 'start', 'small');
    s += G.L(cx, cy - r, cx, cy + r, 'thin dash') + G.dim(cx - r, cx + r, cy + r + 62, 'D = ' + Dm + ' mm') + G.T(cx, cy + 4, '斷面', 'middle', 'small');
    s += G.Rc(230, cy - r, 100 * Lm / 300, 2 * r, 'fill2 acc') + G.dim(230, 230 + 100 * Lm / 300, cy + r + 18, 'L = ' + Lm + ' mm') + G.T(230 + 50 * Lm / 300, cy - r - 8, '側面', 'middle', 'small');
    var MP = function (x) { return D(x, 2) + ' MPa'; };
    return ['如圖為混凝土圓柱試體的劈裂抗張試驗（試體橫放，沿直徑方向加壓），破壞載重 ' + P + ' kN，劈裂抗張強度為何？', O(MP(T), [MP(T / 2), MP(P * 1000 / (Math.PI * Dm * Dm / 4)), MP(P * 1000 / (Lm * Dm)), MP(T * 2)]),
      'T = 2P/(πLD) = 2 × ' + P + ' × 1000 ÷ (π × ' + Lm + ' × ' + Dm + ') = ' + MP(T) + '。\n劈裂抗張強度約為抗壓強度的 1/10 左右。', G.svg(360, 258, s)];
  }

  // 抗彎（破裂模數）：三分點載重或中點載重
  function flexure() {
    var sz = pick([[150, 450], [100, 300]]), b = sz[0], L = sz[1], third = Math.random() < 0.6, R = pick([3, 3.5, 4, 4.5, 5, 6]);
    var P = third ? R * b * b * b / L / 1000 : R * 2 * b * b * b / (3 * L) / 1000;
    var x0 = 50, x1 = 310, y = 110, s = G.Rc(x0 - 20, y, x1 - x0 + 40, 30, 'fill2 acc') + G.C(x0, y + 38, 7, '') + G.C(x1, y + 38, 7, '') + G.hH(x0 - 20, x0 + 20, y + 45) + G.hH(x1 - 20, x1 + 20, y + 45);
    var lx = third ? [x0 + (x1 - x0) / 3, x0 + 2 * (x1 - x0) / 3] : [(x0 + x1) / 2];
    lx.forEach(function (x) { s += G.A(x, y - 45, x, y - 2, 'acc'); });
    s += G.T((x0 + x1) / 2, y - 52, third ? 'P/2　　　　P/2（總載重 P = ' + D(P, 2) + ' kN）' : 'P = ' + D(P, 2) + ' kN', 'middle', 'small');
    if (third) s += G.dim(x0, lx[0], y + 70, 'L/3') + G.dim(lx[0], lx[1], y + 70, 'L/3') + G.dim(lx[1], x1, y + 70, 'L/3');
    s += G.dim(x0, x1, y + 95, '跨距 L = ' + L + ' mm') + G.T(x0 - 20, y - 12, '斷面 ' + b + '×' + b + ' mm', 'start', 'small');
    var MP = function (x) { return D(x, 2) + ' MPa'; }, Rt = 3 * P * 1000 * L / (2 * b * b * b);
    return ['如圖為 ' + b + '×' + b + ' mm 混凝土梁的抗彎試驗（' + (third ? '三分點載重' : '中點載重') + '），破壞時總載重 P = ' + D(P, 2) + ' kN，且斷裂發生在跨度中央部分，破裂模數為何？', O(MP(R), [MP(third ? Rt : R * 2 / 3), MP(R / 2), MP(R * 2), MP(third ? R * 1.5 : R * 1.5)]),
      (third ? '三分點載重：R = PL/(bd²) = ' + D(P, 2) + ' × 1000 × ' + L + ' ÷ (' + b + ' × ' + b + '²) = ' + MP(R) + '。' : '中點載重：R = 3PL/(2bd²) = 3 × ' + D(P, 2) + ' × 1000 × ' + L + ' ÷ (2 × ' + b + ' × ' + b + '²) = ' + MP(R) + '。') + '\n三分點載重時中間 1/3 是純彎矩區，結果較可靠。', G.svg(360, 225, s)];
  }

  /* ================= 石材 ================= */

  // 乾重／飽和面乾重／水中重：吸水率、比重
  function absorb() {
    var Wd = pick([400, 500, 800, 1000, 1200]), a = pick([0.5, 1, 1.5, 2, 2.5, 4, 5]), Ws = Wd * (1 + a / 100), G2 = pick([2.4, 2.5, 2.6, 2.65, 2.7, 2.75]), V = Wd / G2, Wsub = Ws - V;
    if (Math.abs(V - Math.round(V)) > 1e-6) { Wd = 1000; Ws = Wd * (1 + a / 100); G2 = pick([2.5, 2.6, 2.7]); V = Wd / G2; V = Math.round(V); G2 = Wd / V; Wsub = Ws - V; }
    var s = '', lab = [['烘乾重', Wd], ['飽和面乾重', Ws], ['水中重', Wsub]];
    lab.forEach(function (l, i) {
      var x = 30 + i * 112, y = 60;
      s += G.L(x + 10, y + 110, x + 90, y + 110, 'thick') + G.Rc(x + 20, y + 90, 60, 20, 'fill') + G.T(x + 50, y + 104, D(l[1], 1) + ' g', 'middle', 'small');
      if (i < 2) s += G.P('M' + (x + 30) + ',' + (y + 90) + ' l6,-26 l26,0 l8,26 Z', 'acc' + (i === 1 ? ' fill2' : ''));
      else s += G.L(x + 50, y + 90, x + 50, y + 30, 'thin') + G.Rc(x + 22, y + 30, 56, 55, 'thin') + G.P('M' + (x + 34) + ',' + (y + 72) + ' l6,-22 l20,0 l6,22 Z', 'acc fill2') + G.L(x + 22, y + 40, x + 78, y + 40, 'thin dash');
      s += G.T(x + 50, y + 132, l[0], 'middle', 'small');
    });
    var ask = pick(['abs', 'abs', 'bulk', 'ssd']), P = function (x) { return D(x, 2) + ' %'; };
    var ex = '吸水率 = (飽和面乾重 − 烘乾重)/烘乾重 × 100% = (' + D(Ws, 1) + ' − ' + Wd + ')/' + Wd + ' = ' + P(a) + '\n體積（排開水重）= 飽和面乾重 − 水中重 = ' + D(V, 1) + '\n容積比重（烘乾）= 烘乾重 ÷ 體積 = ' + D(Wd / V, 3) + '；面乾內飽和比重 = ' + D(Ws / V, 3) + '。';
    var fig = G.svg(360, 205, s);
    if (ask === 'abs') return ['如圖為某石材試體的三次稱重結果，其吸水率為何？', O(P(a), [P((Ws - Wd) / Ws * 100), P((Ws - Wsub) / Wd * 100), P(a * 10)]), ex, fig];
    if (ask === 'bulk') return ['如圖為某石材試體的三次稱重結果，其（烘乾）容積比重為何？', O(D(Wd / V, 3), [D(Ws / V, 3), D(Wd / Wsub, 3), D(Wd / (Wd - Wsub), 3)], function (k) { return D(Wd / V + 0.05 * k, 3); }), ex, fig];
    return ['如圖為某石材試體的三次稱重結果，其面乾內飽和比重為何？', O(D(Ws / V, 3), [D(Wd / V, 3), D(Ws / Wsub, 3), D(Wd / (Wd - Wsub), 3)], function (k) { return D(Ws / V + 0.05 * k, 3); }), ex, fig];
  }

  var it = function (t, f) { return { t: t, g: function () { return f(); } }; };
  [addEasy, addHard, addTc].forEach(function (add) {
    add('mat', 0, [it('應力應變曲線（看圖）', stressStrain), it('拉伸試驗伸長率／斷面縮率', tensile), it('精密度與精準度（靶圖）', target), it('常態分佈（看圖）', normal)]);
    add('mat', 1, [it('維卡針凝結時間（看圖）', vicat), it('砂漿立方試體抗壓（看圖）', cube)]);
    add('mat', 2, [it('篩分析與細度模數（看圖）', sieve), it('坍度試驗（看圖）', slump), it('水灰比強度曲線（看圖）', abrams), it('劈裂抗張（看圖）', split), it('抗彎破裂模數（看圖）', flexure)]);
    add('mat', 3, [it('石材吸水率與比重（看圖）', absorb)]);
  });
})();

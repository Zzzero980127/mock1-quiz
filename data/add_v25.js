/* v2.6：製圖的變化圖題型——立體由小方塊隨機堆成，每次形狀都不同。
 * 看立體圖選視圖、看俯視圖數字選前視圖、看三視圖選立體圖、判斷第一角／第三角法、比例尺看圖換算。
 * 用 GF（add_v24.js）的繪圖工具；一律 addEasy／addHard／addTc 往後接，不插隊、不刪題。
 */
(function () {
  var G = GF, H = QH, O = H.opts, D = H.dec;
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var LET = ['(A)', '(B)', '(C)', '(D)'];

  /* ---------- 方塊立體：h[r][c]，r = 由後往前，c = 由左往右 ---------- */
  function randSolid() {
    for (var t = 0; t < 200; t++) {
      var R = ri(2, 3), C = ri(2, 3), h = [], tot = 0;
      for (var r = 0; r < R; r++) { h.push([]); for (var c = 0; c < C; c++) { var v = Math.random() < 0.2 ? 0 : ri(1, 3); h[r].push(v); tot += v; } }
      var rowOk = h.every(function (row) { return row.some(function (v) { return v > 0; }); });
      var colOk = h[0].every(function (_, c) { return h.some(function (row) { return row[c] > 0; }); });
      if (rowOk && colOk && tot >= 4 && maxH(h) >= 2) return h;
    }
    return [[2, 1], [1, 0]];
  }
  function maxH(h) { var m = 0; h.forEach(function (row) { row.forEach(function (v) { if (v > m) m = v; }); }); return m; }
  function copy(h) { return h.map(function (row) { return row.slice(); }); }

  // 各視圖：回傳 grid[列][行]（列 0 在上），值相同代表同一平面，-1 為空白
  function view(h, kind) {
    var R = h.length, C = h[0].length, Hm = maxH(h), g = [], i, j, k;
    if (kind === 'top') return h.map(function (row) { return row.map(function (v) { return v > 0 ? v : -1; }); });
    var W = (kind === 'front' || kind === 'rear') ? C : R;
    for (i = 0; i < Hm; i++) {
      var z = Hm - 1 - i, line = [];
      for (j = 0; j < W; j++) {
        var best = -1;
        if (kind === 'front') { for (k = 0; k < R; k++) if (h[k][j] > z) best = k; }
        else if (kind === 'rear') { var c0 = C - 1 - j; for (k = R - 1; k >= 0; k--) if (h[k][c0] > z) best = R - k; }
        else if (kind === 'right') { var r0 = R - 1 - j; for (k = 0; k < C; k++) if (h[r0][k] > z) best = k; }
        else { var r1 = j; for (k = C - 1; k >= 0; k--) if (h[r1][k] > z) best = C - k; }
        line.push(best);
      }
      g.push(line);
    }
    return g;
  }
  // 視圖的線段（相鄰格不同平面就畫線）
  function segs(g) {
    var rows = g.length, cols = g[0].length, out = [], at = function (i, j) { return (i < 0 || j < 0 || i >= rows || j >= cols) ? -1 : g[i][j]; };
    for (var i = -1; i < rows; i++) for (var j = -1; j < cols; j++) {
      var a = at(i, j);
      if (i >= 0 && a !== at(i, j + 1)) out.push([j + 1, i, j + 1, i + 1]);
      if (j >= 0 && a !== at(i + 1, j)) out.push([j, i + 1, j + 1, i + 1]);
    }
    return out;
  }
  function key(g) { return g.length + 'x' + g[0].length + ':' + segs(g).map(function (s) { return s.join(','); }).sort().join(';'); }
  function drawView(g, x, y, cs, label) {
    var s = '';
    segs(g).forEach(function (q) { s += G.L(x + q[0] * cs, y + q[1] * cs, x + q[2] * cs, y + q[3] * cs, 'thick'); });
    if (label) s += G.T(x + g[0].length * cs / 2, y + g.length * cs + 15, label, 'middle', 'small');
    return s;
  }
  // 等角立體圖（畫家演算法，由遠到近畫每個小方塊）
  function drawIso(h, ox, oy, s, arrow) {
    var R = h.length, cubes = [], out = '';
    h.forEach(function (row, r) { row.forEach(function (v, c) { for (var z = 0; z < v; z++) cubes.push([c, r, z]); }); });
    cubes.sort(function (a, b) { return (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]) || a[2] - b[2]; });
    var P = function (u, v, z) { return [ox + (u - v) * 0.866 * s, oy + (u + v) * 0.5 * s - z * s]; };
    var face = function (pts, fill) { return '<path d="M' + pts.map(function (p) { return G.r1(p[0]) + ',' + G.r1(p[1]); }).join(' L') + ' Z" style="fill:' + fill + '"/>'; };
    cubes.forEach(function (q) {
      var u = q[0], v = q[1], z = q[2];
      out += face([P(u, v, z + 1), P(u + 1, v, z + 1), P(u + 1, v + 1, z + 1), P(u, v + 1, z + 1)], 'var(--accent-soft)');
      out += face([P(u, v + 1, z), P(u + 1, v + 1, z), P(u + 1, v + 1, z + 1), P(u, v + 1, z + 1)], 'var(--card)');
      out += face([P(u + 1, v, z), P(u + 1, v + 1, z), P(u + 1, v + 1, z + 1), P(u + 1, v, z + 1)], 'var(--line)');
    });
    if (arrow) { var C = h[0].length, a = P(C / 2, R + 1.6, 0), b = P(C / 2, R + 0.3, 0); out += G.A(a[0], a[1], b[0], b[1], 'acc') + G.T(a[0] - 8, a[1] + 4, '前', 'end', 'small'); }
    return out;
  }
  function isoSize(h, s) { var R = h.length, C = h[0].length; return { w: (R + C) * 0.866 * s, h: (R + C) * 0.5 * s + maxH(h) * s, left: R * 0.866 * s, top: maxH(h) * s }; }

  var NAME = { front: '前視圖', top: '俯視圖', right: '右側視圖' };

  // 1. 看立體圖，選前視／俯視／右側視圖
  function pickView() {
    for (var t = 0; t < 60; t++) {
      var h = randSolid(), ask = pick(['front', 'front', 'top', 'right']);
      var pool = ['front', 'top', 'right', 'left', 'rear'].filter(function (k) { return k !== ask; }), cand = [view(h, ask)], keys = [key(cand[0])];
      shuffle(pool).forEach(function (k) { if (cand.length < 4) { var g = view(h, k), kk = key(g); if (keys.indexOf(kk) < 0) { cand.push(g); keys.push(kk); } } });
      // 不夠就用「改一格」的立體做干擾
      for (var u = 0; cand.length < 4 && u < 40; u++) { var h2 = copy(h), r = ri(0, h.length - 1), c = ri(0, h[0].length - 1); h2[r][c] = Math.max(0, Math.min(3, h2[r][c] + pick([1, -1]))); var g2 = view(h2, ask), k2 = key(g2); if (maxH(h2) > 0 && keys.indexOf(k2) < 0) { cand.push(g2); keys.push(k2); } }
      if (cand.length < 4) continue;
      var order = shuffle([0, 1, 2, 3]), ansPos = order.indexOf(0), sz = isoSize(h, 24);
      var s = drawIso(h, 20 + sz.left, 30 + sz.top, 24, true), cs = 13;
      order.forEach(function (ci, p) { var x = 195 + (p % 2) * 85, y = 18 + Math.floor(p / 2) * 92; s += G.T(x - 4, y + 8, LET[p], 'end', 'small') + drawView(cand[ci], x + 4, y, cs); });
      return ['如圖左為由相同小方塊堆成的立體（箭頭為前方），它的' + NAME[ask] + '是右邊哪一個？', O(LET[ansPos], LET.filter(function (_, i) { return i !== ansPos; })),
        NAME[ask] + '：' + (ask === 'front' ? '從前方往後看，每一行取最高的方塊，前後不同深度的面之間會有一條線。' : ask === 'top' ? '從上往下看，每一格都看得到，高度不同的相鄰格之間有線。' : '從右邊往左看，前方在圖的左邊，每一列取最高的方塊。') + '\n其他選項是別的方向（左側、後視…）或是少／多一個方塊的圖。', G.svg(370, Math.max(200, 50 + sz.h), s)];
    }
    return pickView();
  }

  // 2. 俯視圖標數字（每格疊幾塊），選前視圖或右側視圖
  function numberedTop() {
    for (var t = 0; t < 60; t++) {
      var h = randSolid(), ask = pick(['front', 'right']), cand = [view(h, ask)], keys = [key(cand[0])];
      var alt = [view(h, ask === 'front' ? 'right' : 'front'), view(h, ask === 'front' ? 'rear' : 'left')];
      alt.forEach(function (g) { var k = key(g); if (keys.indexOf(k) < 0) { cand.push(g); keys.push(k); } });
      for (var u = 0; cand.length < 4 && u < 40; u++) { var h2 = copy(h), r = ri(0, h.length - 1), c = ri(0, h[0].length - 1); h2[r][c] = Math.max(0, Math.min(3, h2[r][c] + pick([1, -1, 2]))); var g2 = view(h2, ask), k2 = key(g2); if (maxH(h2) > 0 && keys.indexOf(k2) < 0) { cand.push(g2); keys.push(k2); } }
      if (cand.length < 4) continue;
      var cs = 26, s = '', R = h.length, C = h[0].length, tot = 0;
      h.forEach(function (row, r) { row.forEach(function (v, c) { tot += v; if (v) s += G.Rc(20 + c * cs, 40 + r * cs, cs, cs, 'thin') + G.T(20 + c * cs + cs / 2, 40 + r * cs + cs / 2 + 5, v); }); });
      s += G.T(20 + C * cs / 2, 30, '後', 'middle', 'small') + G.T(20 + C * cs / 2, 40 + R * cs + 16, '前', 'middle', 'small') + G.T(20 + C * cs / 2, 40 + R * cs + 34, '俯視圖', 'middle', 'small');
      var order = shuffle([0, 1, 2, 3]), ansPos = order.indexOf(0);
      order.forEach(function (ci, p) { var x = 150 + (p % 2) * 105, y = 18 + Math.floor(p / 2) * 92; s += G.T(x - 4, y + 8, LET[p], 'end', 'small') + drawView(cand[ci], x + 4, y, 15); });
      return ['左圖是方塊堆疊的俯視圖，格子裡的數字是該位置疊的方塊數。這個立體的' + NAME[ask] + '是哪一個？', O(LET[ansPos], LET.filter(function (_, i) { return i !== ansPos; })),
        (ask === 'front' ? '前視圖：每一「行」（左右位置）取最大的數字當高度，由左到右：' + h[0].map(function (_, c) { var m = 0; h.forEach(function (row) { m = Math.max(m, row[c]); }); return m; }).join('、') : '右側視圖：每一「列」（前後位置）取最大的數字當高度，從右邊看時「前」在左邊，由左到右：' + h.map(function (row) { return Math.max.apply(null, row); }).reverse().join('、')) + '。\n高度相同但前後深度不同的地方，中間要畫一條線。（全部共 ' + tot + ' 個方塊）', G.svg(370, 200, s)];
    }
    return numberedTop();
  }

  // 3. 看三視圖（第三角法排列），選立體圖
  function pickSolid() {
    for (var t = 0; t < 80; t++) {
      var h = randSolid(), vk = function (x) { return key(view(x, 'front')) + '|' + key(view(x, 'top')) + '|' + key(view(x, 'right')); }, base = vk(h), cand = [h], ks = [base];
      for (var u = 0; cand.length < 4 && u < 80; u++) {
        var h2 = copy(h), n = ri(1, 2);
        for (var m = 0; m < n; m++) { var r = ri(0, h.length - 1), c = ri(0, h[0].length - 1); h2[r][c] = Math.max(0, Math.min(3, h2[r][c] + pick([1, -1]))); }
        var k = vk(h2); if (maxH(h2) > 0 && ks.indexOf(k) < 0) { cand.push(h2); ks.push(k); }
      }
      if (cand.length < 4) continue;
      var cs = 13, Hm = maxH(h), R = h.length, C = h[0].length, s = '', fx = 20, fy = 20 + R * cs + 26;
      s += drawView(view(h, 'top'), fx, 20, cs, '俯視') + drawView(view(h, 'front'), fx, fy, cs, '前視') + drawView(view(h, 'right'), fx + C * cs + 22, fy, cs, '右側視');
      var order = shuffle([0, 1, 2, 3]), ansPos = order.indexOf(0), sc = 14;
      order.forEach(function (ci, p) { var hh = cand[ci], z = isoSize(hh, sc), x = 160 + (p % 2) * 105, y = 12 + Math.floor(p / 2) * 105; s += G.T(x, y + 10, LET[p], 'start', 'small') + drawIso(hh, x + 14 + z.left, y + 16 + z.top, sc, false); });
      return ['左圖為某方塊立體的三視圖（第三角法），它是右邊哪一個立體？（立體圖的左下面為前方）', O(LET[ansPos], LET.filter(function (_, i) { return i !== ansPos; })),
        '先用俯視圖確定哪些格子有方塊，再用前視圖（每行最高）與右側視圖（每列最高）核對高度。\n其他選項都只差一兩個方塊，總會有一個視圖對不上。', G.svg(370, 225, s)];
    }
    return pickSolid();
  }

  // 4. 視圖的排列位置判斷第一角法／第三角法
  function angleMethod() {
    var h = randSolid(), third = Math.random() < 0.5, side = pick(['right', 'left']), cs = 15, R = h.length, C = h[0].length, Hm = maxH(h);
    var fW = C * cs, sW = R * cs, gap = 34, fx = 130, fy = third ? 30 + R * cs + gap : 30, s = '';
    var ty = third ? 30 : fy + Hm * cs + gap, onRight = (side === 'right') === third, sx = onRight ? fx + fW + gap : fx - gap - sW;
    s += drawView(view(h, 'front'), fx, fy, cs, '前視圖') + drawView(view(h, 'top'), fx, ty, cs, '俯視圖') + drawView(view(h, side), sx, fy, cs, NAME[side] || '左側視圖');
    var ask = pick(['method', 'method', 'pos']);
    var ex = '第一角法：物體在觀察者與投影面之間，俯視圖在前視圖「下方」、右側視圖在前視圖「左方」（左側視圖在右方）。\n第三角法：投影面在觀察者與物體之間，俯視圖在前視圖「上方」、右側視圖在前視圖「右方」（左側視圖在左方）。';
    if (ask === 'method') return ['如圖三個視圖的排列方式，採用的是哪一種投影法？', O(third ? '第三角法' : '第一角法', [third ? '第一角法' : '第三角法', '第二角法', '透視投影法']), ex + '\n本圖俯視圖在前視圖' + (third ? '上方' : '下方') + '、' + (NAME[side] || '左側視圖') + '在' + (onRight ? '右方' : '左方') + ' → ' + (third ? '第三角法' : '第一角法') + '。', G.svg(370, 40 + (R + Hm) * cs + gap + 40, s)];
    return ['如圖的視圖排列（' + (third ? '第三角法' : '第一角法') + '），若要再加畫' + (side === 'right' ? '左側視圖' : '右側視圖') + '，應放在前視圖的哪一邊？', O(onRight ? '左方' : '右方', [onRight ? '右方' : '左方', '上方', '下方']), ex, G.svg(370, 40 + (R + Hm) * cs + gap + 40, s)];
  }

  // 5. 比例尺：圖上量得的長度換算實長（形狀與標註的邊都隨機）
  function scaleFig() {
    var scl = pick([20, 50, 100, 200, 250, 500]), L1 = ri(30, 80), W1 = ri(20, 50), Lshape = Math.random() < 0.5, cut = [ri(10, Math.floor(L1 / 2)), ri(8, Math.floor(W1 / 2))];
    var k = 2.6, x0 = 95, y0 = 30, s = '', pts;
    if (Lshape) pts = [[0, 0], [L1 - cut[0], 0], [L1 - cut[0], cut[1]], [L1, cut[1]], [L1, W1], [0, W1]];
    else pts = [[0, 0], [L1, 0], [L1, W1], [0, W1]];
    s += G.poly(pts.concat([pts[0]]).map(function (p) { return [x0 + p[0] * k, y0 + p[1] * k]; }), 'thick acc');
    var edges = [['a', L1, 'h'], ['b', W1, 'v']]; if (Lshape) edges.push(['c', cut[0], 'h2'], ['d', cut[1], 'v2']);
    var e = pick(edges), ask = pick(['real', 'real', 'scale']);
    s += G.dim(x0, x0 + L1 * k, y0 + W1 * k + 18, 'a = ' + L1 + ' mm') + G.dimV(x0 - 18, y0, y0 + W1 * k, 'b = ' + W1 + ' mm', -1);
    if (Lshape) s += G.dim(x0 + (L1 - cut[0]) * k, x0 + L1 * k, y0 - 12, 'c = ' + cut[0] + ' mm') + G.dimV(x0 + L1 * k + 16, y0, y0 + cut[1] * k, 'd = ' + cut[1] + ' mm', 1);
    if (ask === 'real') s += G.T(x0 + 4, y0 + W1 * k + 52, '比例 1：' + scl, 'start', 'small');
    var real = e[1] * scl / 1000, fig = G.svg(400, y0 + W1 * k + 62, s), M = function (x) { return D(x, 3) + ' m'; };
    if (ask === 'real') return ['如圖為以 1：' + scl + ' 繪製的平面圖，圖上量得的尺寸如圖（單位 mm），邊 ' + e[0] + ' 的實際長度為何？', O(M(real), [M(real * 10), M(real / 10), M(e[1] / scl), M(real * 100)]),
      '實長 = 圖上長 × 比例分母 = ' + e[1] + ' mm × ' + scl + ' = ' + e[1] * scl + ' mm = ' + M(real) + '。', fig];
    var rl = e[1] * scl / 1000;
    return ['某平面圖上邊 ' + e[0] + ' 量得 ' + e[1] + ' mm（如圖），已知該邊實際長 ' + D(rl, 3) + ' m，這張圖的比例為何？', O('1：' + scl, ['1：' + scl * 10, '1：' + scl / 10, scl + '：1']),
      '比例 = 圖上長 ÷ 實長 = ' + e[1] + ' mm ÷ ' + D(rl * 1000, 1) + ' mm = 1：' + scl + '。', fig];
  }

  var it = function (t, f) { return { t: t, g: function () { return f(); } }; };
  [addEasy, addHard, addTc].forEach(function (add) {
    add('draw', 2, [it('比例尺看圖換算', scaleFig)]);
    add('draw', 6, [it('看立體圖選視圖', pickView), it('俯視圖數字選視圖', numberedTop), it('看三視圖選立體', pickSolid), it('第一角法與第三角法（看圖）', angleMethod)]);
  });
})();

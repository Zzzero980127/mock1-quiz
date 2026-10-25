/* 二模新增（數學C）：第四～七單元 式的運算、直線與圓、數列與級數、排列組合。m:2 = 二模才出現。題型的數字每次隨機。 */
(function () {
  var S = (window.QUIZ_DATA || []).filter(function (x) { return x.id === 'math'; })[0];
  if (!S) return;
  S.desc2 = '第一～七單元';
  var H = window.QH, n = H.n;
  function O(ans, cands) { return H.fill([ans].concat(cands).map(function (x) { return typeof x === 'number' ? (Number.isInteger(x) ? x : H.dec(x, 2)) : x; })); }
  function sup(p) { return p === 1 ? '' : p === 2 ? '²' : p === 3 ? '³' : '^' + p; }
  // c 由高次到低次：poly([1,2,-3,4]) → x³ + 2x² − 3x + 4
  function poly(c) {
    var d = c.length - 1, s = '';
    c.forEach(function (a, i) {
      var p = d - i; if (a === 0) return;
      var ab = Math.abs(a), t = (ab === 1 && p > 0 ? '' : ab) + (p > 0 ? 'x' + sup(p) : '');
      s += s === '' ? (a < 0 ? '−' : '') + t : ' ' + (a < 0 ? '−' : '+') + ' ' + t;
    });
    return s || '0';
  }
  function lin2(m, c) { return poly([m, c]); }
  function fact(k) { var r = 1; for (var i = 2; i <= k; i++) r *= i; return r; }
  function P(a, b) { return fact(a) / fact(a - b); }
  function C(a, b) { return fact(a) / (fact(b) * fact(a - b)); }
  function tm(c, v, first) { var ab = Math.abs(c), body = (ab === 1 ? '' : ab) + v; return first ? (c < 0 ? '−' : '') + body : (c < 0 ? ' − ' : ' + ') + body; }
  function eqn(a, b, c) { return tm(a, 'x', true) + tm(b, 'y') + (c === 0 ? '' : (c < 0 ? ' − ' : ' + ') + Math.abs(c)) + ' = 0'; }
  function sq(v, h) { return h === 0 ? v + '²' : '(' + v + (h < 0 ? ' + ' + (-h) : ' − ' + h) + ')²'; }
  var PY = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17]];

  /* ---------------- 式的運算 ---------------- */
  var alg = [
    { t: '餘式定理', g: function (R) {
      var c = [1, R.nz(-4, 4), R.nz(-5, 5), R.nz(-6, 6)], a = R.nz(-3, 3), s = R.sign() > 0;
      var f = function (x) { return c[0] * x * x * x + c[1] * x * x + c[2] * x + c[3]; };
      var ans = f(a);
      return ['多項式 f(x) = ' + poly(c) + ' 除以 ' + lin2(1, -a) + ' 的餘式為何？', O(n(ans), [n(f(-a)), n(ans + a), n(ans - c[3]), n(-ans)]),
        '餘式定理：f(x) 除以 (x − a) 的餘式 = f(a)。f(' + n(a) + ') = ' + n(ans) + '。'];
    } },
    { t: '餘式定理', g: function (R) {
      var a = R.int(1, 3), b = R.int(2, 4), k = R.nz(-5, 5);
      // f(x) = x³ + kx² − 4x + 6，除以 (ax − b) 太雜，改用 (2x − 2a)：餘式 = f(a)
      var c = [1, k, -4, 6], f = function (x) { return x * x * x + k * x * x - 4 * x + 6; };
      var ans = f(a);
      return ['多項式 f(x) = ' + poly(c) + ' 除以 ' + lin2(2, -2 * a) + ' 的餘式為何？', O(n(ans), [n(f(2 * a)), n(f(-a)), n(2 * ans), n(ans + 2)]),
        '(2x − ' + 2 * a + ') = 2(x − ' + a + ')，除以 2(x − ' + a + ') 的餘式與除以 (x − ' + a + ') 相同，都是 f(' + a + ') = ' + n(ans) + '。'];
    } },
    { t: '因式定理', g: function (R) {
      var k = R.nz(-4, 4), p = R.nz(-6, 6), a = R.nz(-3, 3);
      var q = -(a * a * a + k * a * a + p * a);
      return ['已知 ' + lin2(1, -a) + ' 是 f(x) = x³ + kx²' + (p < 0 ? ' − ' : ' + ') + (Math.abs(p) === 1 ? '' : Math.abs(p)) + 'x' + (q === 0 ? '' : q < 0 ? ' − ' + Math.abs(q) : ' + ' + q) + ' 的因式，則 k = ？', O(n(k), [n(-k), n(k + 1), n(k - 1), n(a)]),
        '因式定理：f(' + n(a) + ') = 0。' + n(a * a * a) + ' + k·' + a * a + (p * a < 0 ? ' − ' : ' + ') + Math.abs(p * a) + (q === 0 ? '' : q < 0 ? ' − ' + Math.abs(q) : ' + ' + q) + ' = 0，解得 k = ' + n(k) + '。'];
    } },
    { t: '根與係數', g: function (R) {
      var a = R.nz(-5, 5), b = R.nz(-5, 5); if (a === b) b = a + 1 || 2;
      var bb = -(a + b), cc = a * b;
      return ['二次方程式 ' + poly([1, bb, cc]) + ' = 0 的兩根為 α、β，則 α² + β² = ？', O(a * a + b * b, [(a + b) * (a + b), a * a - b * b, bb * bb + 2 * cc, Math.abs(cc)]),
        'α + β = ' + n(-bb) + '，αβ = ' + n(cc) + '。α² + β² = (α + β)² − 2αβ = ' + (bb * bb) + ' − ' + (cc < 0 ? '(' + n(2 * cc) + ')' : n(2 * cc)) + ' = ' + (a * a + b * b) + '。'];
    } },
    { t: '根與係數', g: function (R) {
      var p = R.nz(-3, 3), q = R.nz(-3, 3), r = R.nz(-3, 3);
      var s1 = p + q + r, s2 = p * q + q * r + r * p, s3 = p * q * r;
      return ['三次方程式 ' + poly([1, -s1, s2, -s3]) + ' = 0 的三根為 α、β、γ，則 αβγ = ？', O(n(s3), [n(-s3), n(s1), n(s2)]),
        '三次方程式 x³ + bx² + cx + d = 0 的三根相乘 αβγ = −d。這裡 d = ' + n(-s3) + '，所以 αβγ = ' + n(s3) + '。'];
    } },
    { t: '虛根成對', g: function (R) {
      var m = R.nz(-4, 4), k = R.int(1, 4);
      var b = -2 * m, c = m * m + k * k;
      return ['實係數二次方程式 x² + bx + c = 0 有一根為 ' + n(m) + ' + ' + (k === 1 ? '' : k) + 'i，則 b + c = ？', O(n(b + c), [n(b - c), n(-b + c), n(c), n(2 * m + c)]),
        '實係數方程式虛根成對，另一根為 ' + n(m) + ' − ' + (k === 1 ? '' : k) + 'i。兩根和 = ' + n(2 * m) + '，積 = ' + c + '，所以 b = ' + n(b) + '，c = ' + c + '。'];
    } },
    { t: '複數運算', g: function (R) {
      var a = R.nz(-4, 4), b = R.nz(-4, 4), c = R.nz(-4, 4), d = R.nz(-4, 4);
      var re = a * c - b * d, im = a * d + b * c;
      var f = function (x, y) { return n(x) + (y < 0 ? ' − ' : ' + ') + (Math.abs(y) === 1 ? '' : Math.abs(y)) + 'i'; };
      return ['(' + f(a, b) + ')(' + f(c, d) + ') = ？', O(f(re, im), [f(a * c + b * d, im), f(re, -im), f(a * c - b * d, a * d - b * c)]),
        '(a + bi)(c + di) = (ac − bd) + (ad + bc)i，i² = −1。結果 ' + f(re, im) + '。'];
    } }
  ];

  var algHard = [
    { t: '除式為二次式', g: function (R) {
      var a = R.int(1, 3), b = a + R.int(1, 3), m = R.nz(-3, 3), d = R.nz(-5, 5);
      var r1 = m * a + d, r2 = m * b + d;
      return ['多項式 f(x) 除以 x − ' + a + ' 的餘式為 ' + n(r1) + '，除以 x − ' + b + ' 的餘式為 ' + n(r2) + '，則 f(x) 除以 (x − ' + a + ')(x − ' + b + ') 的餘式為何？',
        O(lin2(m, d), [lin2(-m, d), lin2(m, -d), lin2(d, m)]),
        '設餘式 ux + v（次數比除式低）。代入兩根：f(' + a + ') = ' + a + 'u + v = ' + n(r1) + '，f(' + b + ') = ' + b + 'u + v = ' + n(r2) + '，解得 u = ' + n(m) + '，v = ' + n(d) + '。'];
    } },
    { t: '根與係數', g: function (R) {
      var s = R.int(2, 9), p = R.pick([2, 3, 4, 5, 6]);
      return ['α、β 為方程式 x² − ' + s + 'x + ' + p + ' = 0 的兩根，則 1/α + 1/β = ？', O(H.frac(s, p), [H.frac(p, s), H.frac(s * s - 2 * p, p), H.frac(-s, p)]),
        '1/α + 1/β = (α + β) ÷ (αβ) = ' + s + ' ÷ ' + p + ' = ' + H.frac(s, p) + '。'];
    } },
    { t: '複數運算', g: function (R) {
      var len = R.int(5, 22);
      // i + i² + … + i^len：每 4 項和為 0，只剩 len % 4 項
      var rem = len % 4; var tab = { 0: '0', 1: 'i', 2: '−1 + i', 3: '−1' }, ans = tab[rem];
      return ['i = √(−1)，則 i + i² + i³ + … + i^' + len + ' = ？', O(ans, ['0', '1', '−1 − i', 'i', '−1', '−1 + i'].filter(function (x) { return x !== ans; }).slice(0, 3)),
        'i, i², i³, i⁴ 依序為 i、−1、−i、1，每 4 項的和為 0。' + len + ' 項 = ' + (len - rem) + ' 項（和為 0）再加最後 ' + rem + ' 項，所以結果是 ' + ans + '。'];
    } }
  ];

  var algTc = [
    ['餘式定理', '（仿統測）若多項式 f(x) 除以 x − 1 的餘式為 3，除以 x − 2 的餘式為 5，則 f(x) 除以 (x − 1)(x − 2) 的餘式為何？', ['2x + 1', 'x + 2', '2x − 1', '3x'], '設餘式 ux + v：u + v = 3、2u + v = 5，所以 u = 2、v = 1，餘式 2x + 1。'],
    ['方程式', '（仿統測）已知二次方程式 x² − 4x + k = 0 有兩個相等的實根，則 k = ？', ['4', '2', '−4', '16'], '兩相等實根 ⇔ 判別式 D = 16 − 4k = 0，k = 4。'],
    ['複數', '（仿統測）設 i = √(−1)，則 i + i² + i³ + … + i¹⁰ = ？', ['−1 + i', '0', 'i', '−1'], 'i 到 i⁸ 共 8 項，每 4 項和為 0；剩 i⁹ + i¹⁰ = i + (−1) = −1 + i。']
  ];

  /* ---------------- 直線與圓 ---------------- */
  var line = [
    { t: '斜率與直線', g: function (R) {
      var x1 = R.int(-4, 4), y1 = R.int(-5, 5), dx = R.nz(-4, 4), dy = R.nz(-6, 6);
      var m = H.frac(dy, dx);
      return ['通過 A' + H.pt(x1, y1) + '、B' + H.pt(x1 + dx, y1 + dy) + ' 兩點的直線，斜率為何？', O(m, [H.frac(dx, dy), H.frac(-dy, dx), H.frac(dy + 1, dx), H.frac(dy, dx + 1 === 0 ? 2 : dx + 1)]),
        '斜率 m = (y₂ − y₁) ÷ (x₂ − x₁) = ' + n(dy) + ' ÷ ' + n(dx) + ' = ' + m + '。'];
    } },
    { t: '平行與垂直', g: function (R) {
      var a = R.nz(-6, 6), b = R.nz(-6, 6), c = R.nz(-9, 9);
      return ['直線 L：' + eqn(a, b, c) + '。與 L 垂直的直線，斜率為何？', O(H.frac(b, a), [H.frac(-b, a), H.frac(a, b), H.frac(-a, b)]),
        'L 的斜率 = −a/b = ' + H.frac(-a, b) + '；垂直線斜率是它的負倒數，等於 ' + H.frac(b, a) + '。'];
    } },
    { t: '點到直線距離', g: function (R) {
      var t = R.pick(PY), a = t[0] * R.sign(), b = t[1] * R.sign(), r = t[2], x0 = R.int(-4, 4), y0 = R.int(-4, 4), d = R.int(1, 6), s = R.sign();
      var c = s * d * r - a * x0 - b * y0;
      var eq = eqn(a, b, c).replace(' = 0', '');
      return ['點 P' + H.pt(x0, y0) + ' 到直線 ' + eq + ' = 0 的距離為何？', O(d, [d * r, d + 1, Math.abs(a * x0 + b * y0), d + 2].filter(function (x) { return x !== d; })),
        'd = |ax₀ + by₀ + c| ÷ √(a² + b²) = |' + n(s * d * r) + '| ÷ √(' + a * a + ' + ' + b * b + ') = ' + d * r + ' ÷ ' + r + ' = ' + d + '。'];
    } },
    { t: '兩平行線距離', g: function (R) {
      var t = R.pick(PY), a = t[0], b = t[1], r = t[2], d = R.int(1, 5), c1 = R.int(-6, 6), c2 = c1 + d * r;
      var f = function (c) { return eqn(a, b, c); };
      return ['兩平行直線 ' + f(c1) + ' 與 ' + f(c2) + ' 的距離為何？', O(d, [d * r, d + 1, c2 - c1 === d ? d + 2 : c2 - c1]),
        '兩平行線距離 = |c₁ − c₂| ÷ √(a² + b²) = ' + d * r + ' ÷ ' + r + ' = ' + d + '。'];
    } },
    { t: '圓的圓心與半徑', g: function (R) {
      var h = R.int(-4, 4), k = R.int(-4, 4), r = R.int(2, 6);
      var dd = -2 * h, ee = -2 * k, ff = h * h + k * k - r * r;
      var sg = function (v) { return v === 0 ? '' : v < 0 ? ' − ' + Math.abs(v) : ' + ' + v; };
      var eq = 'x² + y²' + (dd === 0 ? '' : sg(dd) + 'x') + (ee === 0 ? '' : sg(ee) + 'y') + sg(ff) + ' = 0';
      return ['圓 ' + eq + ' 的圓心與半徑為何？', O('圓心 ' + H.pt(h, k) + '，半徑 ' + r, ['圓心 ' + H.pt(-h, -k) + '，半徑 ' + r, '圓心 ' + H.pt(h, k) + '，半徑 ' + r * r, '圓心 ' + H.pt(dd, ee) + '，半徑 ' + r]),
        '配方：圓心 (−d/2, −e/2) = ' + H.pt(h, k) + '，半徑 = √(h² + k² − f) = √(' + (h * h + k * k) + ' − ' + n(ff) + ') = ' + r + '。'];
    } },
    { t: '弦長', g: function (R) {
      var t = R.pick([[5, 3, 4], [5, 4, 3], [10, 6, 8], [13, 5, 12], [13, 12, 5], [10, 8, 6]]), h = R.int(-3, 3), k = R.int(-3, 3);
      return ['圓 ' + sq('x', h) + ' + ' + sq('y', k) + ' = ' + t[0] * t[0] + ' 被直線 x = ' + (h + t[1]) + ' 所截出的弦，長度為何？',
        O(2 * t[2], [t[2], t[0] + t[1], 2 * t[1], 2 * (t[0] - t[1])]),
        '圓心 ' + H.pt(h, k) + '，到直線 x = ' + (h + t[1]) + ' 的距離 d = ' + t[1] + '，半徑 r = ' + t[0] + '。弦長 = 2√(r² − d²) = 2√(' + t[0] * t[0] + ' − ' + t[1] * t[1] + ') = ' + 2 * t[2] + '。'];
    } },
    { t: '切線段長', g: function (R) {
      var c = R.pick([[3, 4, 5, 0], [3, 4, 3, 4], [3, 4, 4, 3], [5, 12, 13, 0], [5, 12, 5, 12], [5, 12, 12, 5], [6, 8, 10, 0], [6, 8, 6, 8], [6, 8, 8, 6]]);
      return ['圓 x² + y² = ' + c[0] * c[0] + '，圓外一點 P' + H.pt(c[2], c[3]) + '，則 P 到圓的切線段長為何？', O(c[1], [c[0], c[1] + 1, Math.round(Math.sqrt(c[2] * c[2] + c[3] * c[3])), c[1] - 1]),
        '切線段長 = √(PO² − r²) = √(' + (c[2] * c[2] + c[3] * c[3]) + ' − ' + c[0] * c[0] + ') = ' + c[1] + '。'];
    } },
    { t: '圓與直線距離', g: function (R) {
      var r = R.int(2, 6), d = r + R.int(2, 8);
      return ['圓心到直線的距離為 ' + d + '，圓的半徑為 ' + r + '，則圓上的點到此直線的最短距離為何？', O(d - r, [d + r, d, r, d - r + 1]),
        '直線在圓外，最短距離 = d − r = ' + (d - r) + '；最遠距離 = d + r = ' + (d + r) + '。'];
    } }
  ];

  var lineHard = [
    { t: '圓的切線', g: function (R) {
      var t = R.pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [6, 8, 10], [8, 6, 10]]), sx = R.sign(), sy = R.sign();
      var x0 = t[0] * sx, y0 = t[1] * sy, r2 = t[2] * t[2];
      var eq = function (a, b) { return (a < 0 ? '−' : '') + Math.abs(a) + 'x' + (b < 0 ? ' − ' : ' + ') + Math.abs(b) + 'y = ' + r2; };
      return ['過圓 x² + y² = ' + r2 + ' 上一點 ' + H.pt(x0, y0) + ' 的切線方程式為何？', O(eq(x0, y0), [eq(y0, x0), eq(-x0, y0), eq(x0, -y0)]),
        '圓上一點 (x₀, y₀) 的切線：x₀x + y₀y = r²，即 ' + eq(x0, y0) + '。'];
    } },
    { t: '兩圓位置', g: function (R) {
      var r1 = R.int(2, 6), r2 = R.int(2, 6), kind = R.pick(['外切', '內切', '相交', '外離', '內含']), D;
      if (kind === '外切') D = r1 + r2; else if (kind === '內切') { if (r1 === r2) r2 = r1 + 1; D = Math.abs(r1 - r2); }
      else if (kind === '相交') D = Math.abs(r1 - r2) + 1; else if (kind === '外離') D = r1 + r2 + 1;
      else { if (r1 === r2) r2 = r1 + 2; D = Math.abs(r1 - r2) - 1; if (D < 0) { D = 0; } }
      if (kind === '相交' && D >= r1 + r2) D = r1 + r2 - 1;
      var kinds = ['外切', '內切', '相交', '外離', '內含'];
      return ['兩圓半徑分別為 ' + r1 + '、' + r2 + '，圓心距為 ' + D + '，則兩圓的位置關係為？', O(kind, kinds.filter(function (k) { return k !== kind; }).slice(0, 3)),
        '比較圓心距 D 與 r₁ + r₂（' + (r1 + r2) + '）、|r₁ − r₂|（' + Math.abs(r1 - r2) + '）：D = r₁ + r₂ 外切；D = |r₁ − r₂| 內切；中間為相交；更大為外離；更小為內含。這題 D = ' + D + '，是「' + kind + '」。'];
    } },
    { t: '最遠最近距離', g: function (R) {
      var r = R.int(2, 6), t = R.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13]]), D = t[2];
      if (D <= r) r = 2;
      return ['圓 x² + y² = ' + r * r + '，點 P' + H.pt(t[0], t[1]) + ' 在圓外，則圓上的點到 P 的最遠距離為何？', O(D + r, [D - r, D, D + r + 1, r]),
        'PO = √(' + t[0] + '² + ' + t[1] + '²) = ' + D + '。圓上點到圓外一點：最近 = PO − r，最遠 = PO + r = ' + (D + r) + '。'];
    } }
  ];

  var lineTc = [
    ['點到直線距離', '（仿統測）點 (2, −1) 到直線 3x − 4y + 6 = 0 的距離為何？', ['16/5', '8/5', '4', '16/3'], 'd = |3·2 − 4·(−1) + 6| ÷ √(9 + 16) = 16 ÷ 5。'],
    ['圓的方程式', '（仿統測）圓 x² + y² − 6x + 8y + 9 = 0 的半徑為何？', ['4', '5', '16', '2'], '圓心 (3, −4)，r = √(9 + 16 − 9) = 4。'],
    ['兩平行線距離', '（仿統測）兩直線 x + y = 1 與 x + y = 5 的距離為何？', ['2√2', '4', '2', '√2'], '化成 x + y − 1 = 0 與 x + y − 5 = 0，距離 = |−1 − (−5)| ÷ √2 = 4/√2 = 2√2。']
  ];

  /* ---------------- 數列與級數 ---------------- */
  var seq = [
    { t: '等差數列', g: function (R) {
      var a = R.nz(-8, 10), d = R.nz(-5, 6), k = R.int(8, 20);
      return ['等差數列首項為 ' + n(a) + '，公差為 ' + n(d) + '，則第 ' + k + ' 項為何？', O(n(a + (k - 1) * d), [n(a + k * d), n(a + (k - 2) * d), n(a * (k - 1) + d), n(a - (k - 1) * d)]),
        'aₙ = a₁ + (n − 1)d = ' + n(a) + ' + ' + (k - 1) + ' × ' + n(d) + ' = ' + n(a + (k - 1) * d) + '。'];
    } },
    { t: '等差級數和', g: function (R) {
      var a = R.nz(-4, 8), d = R.nz(-3, 5), k = R.pick([10, 12, 15, 20]);
      var sn = k * (2 * a + (k - 1) * d) / 2;
      return ['等差數列首項 ' + n(a) + '、公差 ' + n(d) + '，前 ' + k + ' 項的和為何？', O(n(sn), [n(sn + k), n(sn - d * k), n(k * (a + (k - 1) * d)), n(k * a + d * k)]),
        'Sₙ = n[2a₁ + (n − 1)d] ÷ 2 = ' + k + ' × [' + n(2 * a) + ' + ' + (k - 1) + ' × ' + n(d) + '] ÷ 2 = ' + n(sn) + '。'];
    } },
    { t: '等差數列', g: function (R) {
      var a = R.nz(-6, 8), d = R.nz(-4, 5);
      var a3 = a + 2 * d, a7 = a + 6 * d;
      return ['等差數列中，第 3 項為 ' + n(a3) + '，第 7 項為 ' + n(a7) + '，則公差為何？', O(n(d), [n(-d), n(a7 - a3), n(d + 1), n(d * 2)]),
        '第 7 項 − 第 3 項 = 4d，所以 d = (' + n(a7) + ' − ' + n(a3) + ') ÷ 4 = ' + n(d) + '。'];
    } },
    { t: '等比數列', g: function (R) {
      var a = R.int(1, 5), r = R.pick([2, 3, -2]), k = R.int(4, 7);
      var v = a * Math.pow(r, k - 1);
      return ['等比數列首項為 ' + a + '，公比為 ' + n(r) + '，則第 ' + k + ' 項為何？', O(n(v), [n(a * Math.pow(r, k)), n(a * r * (k - 1)), n(-v), n(a * Math.pow(r, k - 2))]),
        'aₙ = a₁ · rⁿ⁻¹ = ' + a + ' × (' + n(r) + ')^' + (k - 1) + ' = ' + n(v) + '。'];
    } },
    { t: '無窮等比級數', g: function (R) {
      var o = R.pick([[8, 1, 2], [18, 1, 3], [9, 2, 3], [16, 3, 4], [12, 1, 2], [27, 2, 3], [32, 1, 2], [36, 1, 3]]);
      var a = o[0], p = o[1], q = o[2], s = a * q / (q - p);
      return ['無窮等比級數 ' + a + ' + ' + a * p / q + ' + ' + a * p * p / (q * q) + ' + … 的和為何？', O(n(s), [n(a * (q + p) / q), n(a), n(s + a), n(s - a)]),
        '公比 r = ' + H.frac(p, q) + '（|r| < 1），和 S = a₁ ÷ (1 − r) = ' + a + ' ÷ ' + H.frac(q - p, q) + ' = ' + n(s) + '。'];
    } },
    { t: 'Σ 公式', g: function (R) {
      var k = R.pick([5, 6, 8, 10, 12]), type = R.pick([1, 2, 3]);
      var v = type === 1 ? k * (k + 1) / 2 : type === 2 ? k * (k + 1) * (2 * k + 1) / 6 : Math.pow(k * (k + 1) / 2, 2);
      var wrong = [k * (k + 1), k * k * k, k * (k + 1) * (2 * k + 1) / 3, k * (k - 1) / 2, Math.pow(k * (k + 1) / 2, 2) - 1];
      return ['Σ(k=1 到 ' + k + ') k' + (type === 1 ? '' : type === 2 ? '²' : '³') + ' = ？', O(v, wrong.filter(function (x) { return x !== v; }).slice(0, 3)),
        type === 1 ? 'Σk = n(n + 1) ÷ 2 = ' + v + '。' : type === 2 ? 'Σk² = n(n + 1)(2n + 1) ÷ 6 = ' + v + '。' : 'Σk³ = [n(n + 1) ÷ 2]² = ' + v + '。'];
    } },
    { t: '等差中項與等比中項', g: function (R) {
      var a = R.int(1, 6), d = R.int(1, 5);
      return ['已知 ' + a + '、x、' + (a + 2 * d) + ' 成等差數列，則 x = ？', O(a + d, [a + 2 * d, a * (a + 2 * d), a + d + 1, 2 * d]),
        '成等差 ⇔ 中間項是前後兩項的平均：x = (' + a + ' + ' + (a + 2 * d) + ') ÷ 2 = ' + (a + d) + '。'];
    } },
    { t: '複利', g: function (R) {
      var o = R.pick([[10000, 5, 2], [10000, 10, 2], [10000, 10, 3], [10000, 20, 2], [10000, 20, 3], [5000, 10, 3], [20000, 10, 2]]);
      var v = o[0] * Math.pow(100 + o[1], o[2]) / Math.pow(100, o[2]);
      v = Math.round(v * 100) / 100;
      return ['本金 ' + o[0] + ' 元，年利率 ' + o[1] + '%，以複利計算，' + o[2] + ' 年後的本利和為何（元）？', O(String(v), [String(o[0] * (1 + o[1] * o[2] / 100)), String(Math.round(o[0] * Math.pow(1 + o[1] / 100, o[2] - 1) * 100) / 100), String(Math.round(o[0] * Math.pow(1 + o[1] / 100, o[2] + 1) * 100) / 100)]),
        '複利：本利和 = P(1 + r)ⁿ = ' + o[0] + ' × (1 + ' + o[1] / 100 + ')^' + o[2] + ' = ' + v + '。（單利才是 P(1 + rn)。）'];
    } }
  ];

  var seqHard = [
    { t: '等差級數和', g: function (R) {
      var s = R.pick([4, 6, 8, 10, 12, 14]);
      return ['等差數列 {aₙ} 中，a₂ + a₈ = ' + s + '，則前 9 項的和 S₉ = ？', O(String(9 * s / 2), [String(9 * s), String(s), String(s * 4), String(9 * s / 2 + 1)]),
        'a₂ + a₈ = a₁ + a₉ = ' + s + '。S₉ = 9(a₁ + a₉) ÷ 2 = 9 × ' + s + ' ÷ 2 = ' + 9 * s / 2 + '。'];
    } },
    { t: '無窮等比級數', g: function (R) {
      var t = R.pick([[4, 12], [3, 9], [5, 20], [2, 8], [6, 12]]);
      var a = t[0], s = t[1];
      return ['無窮等比級數的首項為 ' + a + '，和為 ' + s + '，則公比 r = ？', O(H.frac(s - a, s), [H.frac(a, s), H.frac(s, a), H.frac(a - s, s)]),
        'S = a₁ ÷ (1 − r) → ' + s + ' = ' + a + ' ÷ (1 − r)，1 − r = ' + H.frac(a, s) + '，r = ' + H.frac(s - a, s) + '。'];
    } },
    { t: 'Σ 公式', g: function (R) {
      var k = R.int(6, 15);
      return ['Σ(k=1 到 ' + k + ') (2k − 1) = ？', O(k * k, [k * (k + 1), k * k - 1, k * (2 * k - 1), 2 * k - 1]),
        'Σ(2k − 1) = 2Σk − k = 2 × ' + k * (k + 1) / 2 + ' − ' + k + ' = ' + k * k + '（前 n 個奇數的和是 n²）。'];
    } },
    { t: '零存整付', g: function (R) {
      var x = R.pick([10000, 20000, 5000]), y = R.pick([2, 3]);
      var sum = 0; for (var i = 1; i <= y; i++) sum += x * Math.pow(1.1, y - i);
      sum = Math.round(sum * 100) / 100;
      var wrong = Math.round(x * Math.pow(1.1, y) * 100) / 100;
      return ['每年年底存入 ' + x + ' 元，年利率 10%，複利計算，存滿 ' + y + ' 年後，本利和為何（元）？', O(String(sum), [String(wrong), String(x * y), String(Math.round(x * (Math.pow(1.1, y + 1) - 1) / 0.1 * 100) / 100)]),
        '每筆存款各自複利，加起來是等比級數：' + x + '·1.1^' + (y - 1) + ' + … + ' + x + ' = ' + sum + '。'];
    } }
  ];

  var seqTc = [
    ['等差數列', '（仿統測）等差數列 5、9、13、… 的第 20 項為何？', ['81', '77', '85', '76'], 'a₂₀ = 5 + 19 × 4 = 81。'],
    ['無窮等比級數', '（仿統測）無窮等比級數 8 + 4 + 2 + … 的和為何？', ['16', '12', '14', '8'], '首項 8、公比 1/2，和 = 8 ÷ (1 − 1/2) = 16。'],
    ['Σ 公式', '（仿統測）Σ(k=1 到 10) k² = ？', ['385', '55', '3025', '440'], 'Σk² = n(n + 1)(2n + 1) ÷ 6 = 10 × 11 × 21 ÷ 6 = 385。']
  ];

  /* ---------------- 排列組合 ---------------- */
  var cnt = [
    { t: '排列與組合', g: function (R) {
      var a = R.int(5, 9), b = R.int(2, 3);
      return ['從 ' + a + ' 個不同的人中選出 ' + b + ' 人排成一列（有順序），共有幾種排法？', O(P(a, b), [C(a, b), a * b, Math.pow(a, b), P(a, b) + a]),
        '排列 P(' + a + ', ' + b + ') = ' + a + '!/(' + a + ' − ' + b + ')! = ' + P(a, b) + '。（不排順序才是組合 C = ' + C(a, b) + '。）'];
    } },
    { t: '排列與組合', g: function (R) {
      var a = R.int(6, 10), b = R.int(2, 4);
      return ['從 ' + a + ' 個不同的人中選出 ' + b + ' 人組成小組（不分順序），共有幾種選法？', O(C(a, b), [P(a, b), a * b, C(a, b) + 1, C(a + 1, b)]),
        '組合 C(' + a + ', ' + b + ') = ' + a + '!/[' + b + '!(' + a + ' − ' + b + ')!] = ' + C(a, b) + '。'];
    } },
    { t: '相同物排列', g: function (R) {
      var w = R.pick([['BANANA', 60, '6!/(3!·2!)'], ['APPLE', 60, '5!/2!'], ['LETTER', 180, '6!/(2!·2!)'], ['BOOK', 12, '4!/2!'], ['SCHOOL', 360, '6!/2!'], ['MATH', 24, '4!']]);
      return ['「' + w[0] + '」的所有字母排成一列，共有幾種不同的排法？', O(w[1], [fact(w[0].length), w[1] * 2, w[1] / 2, fact(w[0].length) / 2].filter(function (x) { return x !== w[1]; }).slice(0, 3)),
        '有相同字母的排列：總數的階乘 ÷ 各相同字母個數的階乘 = ' + w[2] + ' = ' + w[1] + '。'];
    } },
    { t: '相鄰與不相鄰', g: function (R) {
      var k = R.int(5, 7);
      return [k + ' 個人排成一列，其中甲、乙兩人必須相鄰，共有幾種排法？', O(2 * fact(k - 1), [fact(k), fact(k - 1), 2 * fact(k - 2), fact(k) / 2]),
        '捆綁法：甲乙綁成一組，與其他 ' + (k - 2) + ' 人共 ' + (k - 1) + ' 組排列：' + (k - 1) + '!，組內甲乙可互換 ×2，共 ' + 2 * fact(k - 1) + '。'];
    } },
    { t: '相鄰與不相鄰', g: function (R) {
      var o = R.pick([[3, 2], [4, 2], [3, 3], [4, 3]]), m = o[0], f = o[1];
      return [m + ' 位男生與 ' + f + ' 位女生排成一列，女生彼此都不相鄰，共有幾種排法？', O(fact(m) * P(m + 1, f), [fact(m + f), fact(m) * fact(f), fact(m) * C(m + 1, f), fact(m + 1) * f]),
        '插空法：先排 ' + m + ' 位男生 ' + m + '!，產生 ' + (m + 1) + ' 個空隙，再選 ' + f + ' 個空隙排女生 P(' + (m + 1) + ', ' + f + ')：' + fact(m) + ' × ' + P(m + 1, f) + ' = ' + fact(m) * P(m + 1, f) + '。'];
    } },
    { t: '重複排列', g: function (R) {
      var k = R.int(3, 5), m = R.pick([2, 3, 4]);
      var q = Math.random() < 0.5;
      return q ? ['用 0～9 的數字（可重複）設定 ' + k + ' 位數密碼，共有幾種設定方法？', O(Math.pow(10, k), [P(10, k), C(10, k), 10 * k, Math.pow(9, k)]), '每個位置都有 10 種選擇，重複排列：10^' + k + ' = ' + Math.pow(10, k) + '。']
        : [m + ' 封不同的信投進 ' + k + ' 個不同的信箱（每個信箱可投多封），共有幾種投法？', O(Math.pow(k, m), [Math.pow(m, k), P(k, m), C(k, m) + 1, k * m]), '每封信都有 ' + k + ' 種選擇：' + k + '^' + m + ' = ' + Math.pow(k, m) + '。'];
    } },
    { t: '多邊形與比賽', g: function (R) {
      var k = R.int(7, 14), q = Math.random() < 0.5;
      return q ? ['正 ' + k + ' 邊形共有幾條對角線？', O(k * (k - 3) / 2, [C(k, 2), k * (k - 3), k * (k - 1) / 2 + 1, k * (k - 3) / 2 + k]), '對角線數 = n(n − 3) ÷ 2 = ' + k * (k - 3) / 2 + '（C(n, 2) − n）。']
        : [k + ' 支隊伍進行單淘汰賽，要選出冠軍共需比賽幾場？', O(k - 1, [k, k / 2, C(k, 2), k + 1]), '每場淘汰一隊，要淘汰 ' + (k - 1) + ' 隊，所以共 ' + (k - 1) + ' 場。'];
    } }
  ];

  var cntHard = [
    { t: '組合性質', g: function (R) {
      var m = R.pick([10, 12, 14]), a = R.int(2, m / 2 - 1);
      return ['若 C(' + m + ', x) = C(' + m + ', ' + a + ')，則 x 的所有可能值的和為何？', O(m, [a, m - a, 2 * a, m + a]),
        'C(n, x) = C(n, n − x)，所以 x = ' + a + ' 或 x = ' + (m - a) + '，和為 ' + m + '。'];
    } },
    { t: '條件排列', g: function (R) {
      var k = R.int(4, 6);
      return [k + ' 個不同的人排成一列，其中甲必須排在乙的左邊（不必相鄰），共有幾種排法？', O(fact(k) / 2, [fact(k), fact(k - 1), fact(k) / 2 + k, 2 * fact(k - 1)]),
        '甲在乙左或在乙右的機會相同，各占一半：' + k + '! ÷ 2 = ' + fact(k) / 2 + '。'];
    } },
    { t: '不相連選取', g: function (R) {
      var m = R.int(8, 12), k = R.int(2, 3);
      return ['從 1、2、…、' + m + ' 中取 ' + k + ' 個「兩兩不相連」的數，共有幾種取法？', O(C(m - k + 1, k), [C(m, k), C(m - k, k), C(m - k + 2, k), P(m - k + 1, k)]),
        '兩兩不相連：C(n − k + 1, k) = C(' + (m - k + 1) + ', ' + k + ') = ' + C(m - k + 1, k) + '。'];
    } },
    { t: '先贏幾場', g: function (R) {
      var j = R.pick([[0, 1], [1, 4], [2, 10], [3, 20]]);
      return ['甲、乙兩隊進行七戰四勝制比賽（先贏 4 場者勝），甲隊以 4 : ' + j[0] + ' 獲勝的比賽結果共有幾種？', O(j[1], [C(7, 4), C(4 + j[0], 4), j[1] + 1, j[1] * 2]),
        '最後一場一定是甲贏；前面 ' + (3 + j[0]) + ' 場中甲贏 3 場：C(' + (3 + j[0]) + ', 3) = ' + j[1] + '。'];
    } }
  ];

  var cntTc = [
    ['排列', '（仿統測）5 本不同的書排成一列，共有幾種排法？', ['120', '25', '60', '720'], '5! = 120。'],
    ['組合', '（仿統測）6 個人互相握手一次，共握手幾次？', ['15', '30', '36', '12'], '任選 2 人握一次手：C(6, 2) = 15。'],
    ['相鄰排列', '（仿統測）3 位男生與 2 位女生排成一列，2 位女生必須相鄰，共有幾種排法？', ['48', '120', '24', '12'], '女生綁成一組，與 3 位男生共 4 組：4! = 24，女生內部可互換 ×2，共 48。']
  ];

  S.units.push({ name: '式的運算', m: 2, qs: alg, hard: algHard, tc: algTc });
  S.units.push({ name: '直線與圓', m: 2, qs: line, hard: lineHard, tc: lineTc });
  S.units.push({ name: '數列與級數', m: 2, qs: seq, hard: seqHard, tc: seqTc });
  S.units.push({ name: '排列組合', m: 2, qs: cnt, hard: cntHard, tc: cntTc });
})();

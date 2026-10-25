/* 二模新增題型（第二批）：數學C 第四～七單元。依 110～114 學年度二模歷屆的出題方式補齊，數字每次隨機。 */
(function () {
  var Q = window.QUIZ_DATA || [];
  var H = window.QH, n = H.n;
  function O(ans, cands) { return H.fill([ans].concat(cands).map(function (x) { return typeof x === 'number' ? (Number.isInteger(x) ? x : H.dec(x, 2)) : x; })); }
  function find(fn, ok) { var v; for (var i = 0; i < 500; i++) { v = fn(); if (ok(v)) return v; } return v; }
  function d1(x) { return H.dec(x, 2); }
  function unit(name) { var s = Q.filter(function (x) { return x.id === 'math'; })[0]; return s && s.units.filter(function (u) { return u.name === name; })[0]; }
  function ext(u, k, items) { if (u) u[k] = (u[k] || []).concat(items); }
  function fact(k) { var r = 1; for (var i = 2; i <= k; i++) r *= i; return r; }
  function C(a, b) { return fact(a) / (fact(b) * fact(a - b)); }
  function P(a, b) { return fact(a) / fact(a - b); }
  function sg(v) { return v === 0 ? '' : v < 0 ? ' − ' + Math.abs(v) : ' + ' + v; }
  function tm(c, v, first) { var ab = Math.abs(c), body = (ab === 1 ? '' : ab) + v; return first ? (c < 0 ? '−' : '') + body : (c < 0 ? ' − ' : ' + ') + body; }
  function eqn(a, b, c) { return tm(a, 'x', true) + tm(b, 'y') + (c === 0 ? '' : (c < 0 ? ' − ' : ' + ') + Math.abs(c)) + ' = 0'; }
  var PY = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17]];

  /* ===== 式的運算 ===== */
  var alg = unit('式的運算');
  ext(alg, 'qs', [
    { t: '乘法公式', g: function (R) {
      var s = R.int(3, 9), p = R.int(1, 12), kind = R.pick(['sq', 'diff', 'cube']);
      if (s * s < 4 * p) p = Math.floor(s * s / 4);
      return kind === 'sq' ? ['已知 a + b = ' + s + '，ab = ' + p + '，則 a² + b² = ？', O(s * s - 2 * p, [s * s, s * s + 2 * p, s * s - p, 2 * s * p]), 'a² + b² = (a + b)² − 2ab = ' + s * s + ' − ' + 2 * p + ' = ' + (s * s - 2 * p) + '。']
        : kind === 'diff' ? ['已知 a + b = ' + s + '，ab = ' + p + '，則 (a − b)² = ？', O(s * s - 4 * p, [s * s - 2 * p, s * s + 4 * p, s * s - p, (s - p) * (s - p)]), '(a − b)² = (a + b)² − 4ab = ' + s * s + ' − ' + 4 * p + ' = ' + (s * s - 4 * p) + '。']
          : ['已知 a + b = ' + s + '，ab = ' + p + '，則 a³ + b³ = ？', O(s * s * s - 3 * s * p, [s * s * s - 3 * p, s * s * s + 3 * s * p, s * s * s, (s * s - 2 * p) * s]), 'a³ + b³ = (a + b)³ − 3ab(a + b) = ' + s * s * s + ' − ' + 3 * s * p + ' = ' + (s * s * s - 3 * s * p) + '。'];
    } },
    { t: '除以二次式的餘式', g: function (R) {
      var a = R.pick([1, 2, 3]), p = R.nz(-4, 4), q = R.nz(-5, 5), r0 = R.nz(-6, 6); if (a * a + q === 0) q += 1;
      // f(x) = x³ + p x² + q x + r0 除以 x² − a²：餘式 (a²+q)x + (p a² + r0)
      var u = a * a + q, v = p * a * a + r0;
      var poly = 'x³' + (p === 0 ? '' : tm(p, 'x²')) + tm(q, 'x') + sg(r0);
      return ['多項式 f(x) = ' + poly + ' 除以 x² − ' + a * a + ' 的餘式為何？', O(tm(u, 'x', true) + sg(v), [tm(u, 'x', true) + sg(-v), tm(-u, 'x', true) + sg(v), tm(q, 'x', true) + sg(r0), tm(u + 1, 'x', true) + sg(v)]),
        '因 x² ≡ ' + a * a + '，x³ ≡ ' + a * a + 'x。所以 f(x) ≡ (' + a * a + ' + ' + n(q) + ')x + (' + n(p) + '×' + a * a + ' + ' + n(r0) + ') = ' + tm(u, 'x', true) + sg(v) + '。'];
    } },
    { t: '複數的次方', g: function (R) {
      var k = R.int(5, 100), r = k % 4;
      var map = { 0: '1', 1: 'i', 2: '−1', 3: '−i' };
      return ['設 i = √(−1)，則 i^' + k + ' = ？', O(map[r], ['1', 'i', '−1', '−i'].filter(function (x) { return x !== map[r]; })), 'i¹ = i、i² = −1、i³ = −i、i⁴ = 1，每 4 次一循環。' + k + ' ÷ 4 餘 ' + r + '，所以 i^' + k + ' = ' + map[r] + '。'];
    } },
    { t: '判別式與根的種類', g: function (R) {
      var m = R.pick([1, 4, 9, 16, 25]), sk = Math.sqrt(m);
      return ['二次方程式 x² − kx + ' + m + ' = 0（k > 0）有兩個相等的實根，則 k = ？', O(2 * sk, [sk, m, 2 * m, 4 * sk]), '兩相等實根 ⇔ D = k² − 4 × ' + m + ' = 0，k = 2√' + m + ' = ' + 2 * sk + '（k > 0）。'];
    } },
    { t: '三次方程式的根', g: function (R) {
      var r1 = R.nz(-3, 3), r2 = R.nz(-3, 3), r3 = R.nz(-3, 3);
      var s1 = r1 + r2 + r3, s2 = r1 * r2 + r2 * r3 + r3 * r1, s3 = r1 * r2 * r3;
      var poly = 'x³' + (s1 === 0 ? '' : tm(-s1, 'x²')) + (s2 === 0 ? '' : tm(s2, 'x')) + sg(-s3);
      return ['三次方程式 ' + poly + ' = 0 的一根為 ' + n(r1) + '，則另外兩根的和為何？', O(n(r2 + r3), [n(r1), n(-r2 - r3), n(s1), n(s2)]),
        '三根和 = ' + n(s1) + '（x² 係數的相反數），已知一根 ' + n(r1) + '，所以另外兩根的和 = ' + n(s1) + ' − (' + n(r1) + ') = ' + n(r2 + r3) + '。'];
    } },
    { t: '部分分式', g: function (R) {
      var p = R.nz(-3, 3), q = R.nz(-3, 3); if (p === q) q = p === 3 ? 2 : p + 1; if (q === 0) q = 4;
      var A = R.nz(-3, 3), B = R.nz(-3, 3); if (A + B === 0) B = A + 1 === 0 ? 2 : A + 1;
      var c1 = A + B, c0 = -(A * q + B * p);
      var den = '(x' + sg(-p) + ')(x' + sg(-q) + ')';
      return ['若 (' + tm(c1, 'x', true) + sg(c0) + ') ÷ [' + den + '] = A ÷ (x' + sg(-p) + ') + B ÷ (x' + sg(-q) + ')（A、B 為實數），則 A + B = ？', O(n(A + B), [n(A - B), n(A * B), n(-A - B), n(c0)]),
        '通分後比較分子：A(x' + sg(-q) + ') + B(x' + sg(-p) + ') = ' + tm(c1, 'x', true) + sg(c0) + '。x 的係數：A + B = ' + n(c1) + '。'];
    } }
  ]);
  ext(alg, 'hard', [
    { t: '因式定理與另一因式', g: function (R) {
      var k = R.nz(-5, 5);
      return ['已知 x − 1 是 f(x) = x³' + tm(k, 'x') + sg(-(1 + k)) + ' 的因式，則 f(x) 另一個二次因式為何？', O('x² + x' + sg(1 + k), ['x² − x' + sg(1 + k), 'x² + x' + sg(-(1 + k)), 'x² + x' + sg(k), 'x² + ' + (1 + k) + 'x + 1'].filter(function (x2, i, a2) { return a2.indexOf(x2) === i; })),
        '用綜合除法除以 x − 1：商式 x² + x' + sg(1 + k) + '，餘式 0，所以另一因式為 x² + x' + sg(1 + k) + '。'];
    } },
    { t: '分式方程式驗根', g: function (R) {
      var a = R.pick([1, 2, 3]), b = R.pick([2, 3, 4]);
      // x/(x−a) = a/(x−a) + b → x = a 是增根；x − a = b(x−a) 化簡後解 x…
      return ['解分式方程式 x ÷ (x − ' + a + ') = ' + a + ' ÷ (x − ' + a + ') + ' + b + '，下列敘述何者正確？', O('x = ' + a + ' 為增根，原方程式無解', ['x = ' + a + ' 是方程式的解', 'x = 0 是方程式的解', '方程式有兩個解', 'x = ' + (a + b) + ' 是方程式的解']),
        '兩邊同乘 (x − ' + a + ')：x = ' + a + ' + ' + b + '(x − ' + a + ') 化簡後只得 x = ' + a + '，代回原式分母為 0，是增根，所以原方程式無解。（分式方程式解完一定要驗根。）'];
    } },
    { t: '除式為二次式', g: function (R) {
      var u = R.nz(-3, 3), v = R.nz(-6, 6), a = R.int(1, 3), b = a + R.int(1, 3);
      return ['多項式 f(x) 除以 (x − ' + a + ') 的餘式為 ' + n(u * a + v) + '，除以 (x − ' + b + ') 的餘式為 ' + n(u * b + v) + '，則 f(x) 除以 (x − ' + a + ')(x − ' + b + ') 的餘式在 x = 0 時的值為何？', O(n(v), [n(u), n(u + v), n(-v), n(u * a + v)]),
        '餘式為 ux + v，代入兩根得 u = ' + n(u) + '、v = ' + n(v) + '，在 x = 0 時值為 v = ' + n(v) + '。'];
    } }
  ]);
  ext(alg, 'tc', [
    ['式的運算', '（仿統測）已知 a + b = 5，ab = 3，則 a² + b² = ？', ['19', '25', '31', '16'], 'a² + b² = (a + b)² − 2ab = 25 − 6 = 19。'],
    ['式的運算', '（仿統測）多項式 f(x) = x³ − 2x + 4 除以 x + 2 的餘式為？', ['0', '4', '−4', '8'], 'f(−2) = −8 + 4 + 4 = 0。'],
    ['式的運算', '（仿統測）設 i = √(−1)，則 i^2025 = ？', ['i', '1', '−1', '−i'], '2025 ÷ 4 餘 1，所以 i^2025 = i。']
  ]);

  /* ===== 直線與圓 ===== */
  var ln = unit('直線與圓');
  ext(ln, 'qs', [
    { t: '兩直線交點', g: function (R) {
      var x0 = R.nz(-4, 4), y0 = R.nz(-4, 4), a1 = R.nz(-4, 4), b1 = R.nz(-4, 4), a2, b2;
      do { a2 = R.nz(-4, 4); b2 = R.nz(-4, 4); } while (a1 * b2 - a2 * b1 === 0);
      var c1 = -(a1 * x0 + b1 * y0), c2 = -(a2 * x0 + b2 * y0);
      return ['兩直線 ' + eqn(a1, b1, c1) + ' 與 ' + eqn(a2, b2, c2) + ' 的交點坐標為何？', O(H.pt(x0, y0), [H.pt(y0, x0), H.pt(-x0, y0), H.pt(x0, -y0)]),
        '解聯立方程式得 x = ' + n(x0) + '，y = ' + n(y0) + '（代回兩式驗算：' + n(a1 * x0 + b1 * y0) + sg(c1) + ' = 0）。'];
    } },
    { t: '三角形面積', g: function (R) {
      var v = find(function () { return { x: [R.int(-5, 5), R.int(-5, 5), R.int(-5, 5)], y: [R.int(-5, 5), R.int(-5, 5), R.int(-5, 5)] }; },
        function (v) { var d = (v.x[1] - v.x[0]) * (v.y[2] - v.y[0]) - (v.x[2] - v.x[0]) * (v.y[1] - v.y[0]); return d !== 0 && d % 2 === 0; });
      var d = Math.abs((v.x[1] - v.x[0]) * (v.y[2] - v.y[0]) - (v.x[2] - v.x[0]) * (v.y[1] - v.y[0])), area = d / 2;
      return ['坐標平面上三點 A' + H.pt(v.x[0], v.y[0]) + '、B' + H.pt(v.x[1], v.y[1]) + '、C' + H.pt(v.x[2], v.y[2]) + '，則 △ABC 的面積為何？', O(area, [d, area + 1, area * 2 + 1, Math.abs(area - 2)]),
        '△ABC 面積 = ½|(x₂ − x₁)(y₃ − y₁) − (x₃ − x₁)(y₂ − y₁)| = ½ × ' + d + ' = ' + area + '。'];
    } },
    { t: '與兩軸圍成的面積', g: function (R) {
      var o = R.pick([[3, 4, 12], [3, 4, 24], [2, 3, 6], [5, 12, 60], [4, 6, 12], [2, 4, 8]]);
      var area = o[2] * o[2] / (2 * o[0] * o[1]);
      return ['直線 ' + o[0] + 'x + ' + o[1] + 'y = ' + o[2] + ' 與 x 軸、y 軸所圍成的三角形面積為何？', O(d1(area), [d1(area * 2), d1(area / 2), d1(o[2]), d1(o[0] * o[1] / 2)]),
        'x 截距 = ' + o[2] + '/' + o[0] + '，y 截距 = ' + o[2] + '/' + o[1] + '，面積 = ½ × ' + d1(o[2] / o[0]) + ' × ' + d1(o[2] / o[1]) + ' = ' + d1(area) + '。'];
    } },
    { t: '直徑端點的圓方程式', g: function (R) {
      var h = R.int(-3, 3), k = R.int(-3, 3), t = R.pick([[3, 4, 5], [6, 8, 10]]), sx = R.sign(), sy = R.sign();
      var A = [h - sx * t[0] / 2, k - sy * t[1] / 2], B = [h + sx * t[0] / 2, k + sy * t[1] / 2];
      if (!(Number.isInteger(A[0]) && Number.isInteger(A[1]))) { A = [h - sx * t[0], k - sy * t[1]]; B = [h + sx * t[0], k + sy * t[1]]; var r = t[2]; }
      else r = t[2] / 2;
      var cp = function (v, c) { return c === 0 ? v + '²' : '(' + v + (c < 0 ? ' + ' + (-c) : ' − ' + c) + ')²'; };
      var rr = r * r;
      return ['A' + H.pt(A[0], A[1]) + '、B' + H.pt(B[0], B[1]) + ' 為圓的直徑兩端點，則圓的方程式為何？', O(cp('x', h) + ' + ' + cp('y', k) + ' = ' + rr, [cp('x', -h) + ' + ' + cp('y', -k) + ' = ' + rr, cp('x', h) + ' + ' + cp('y', k) + ' = ' + r, cp('x', h) + ' + ' + cp('y', k) + ' = ' + rr * 2]),
        '圓心 = AB 中點 ' + H.pt(h, k) + '，半徑 = AB ÷ 2 = ' + r + '，方程式 ' + cp('x', h) + ' + ' + cp('y', k) + ' = ' + rr + '。'];
    } },
    { t: '圓上的點到直線的距離', g: function (R) {
      var t = R.pick(PY), a = t[0], b = t[1], r0 = t[2], h = R.int(-3, 3), k = R.int(-3, 3), rad = R.int(1, 4), dd = R.int(rad + 1, rad + 5), s = R.sign();
      var c = s * dd * r0 - a * h - b * k;
      return ['圓心 ' + H.pt(h, k) + '、半徑 ' + rad + ' 的圓，與直線 ' + eqn(a, b, c) + '（直線在圓外）。圓上的點到此直線的「最遠距離」為何？', O(dd + rad, [dd - rad, dd, dd * 2 + rad, dd + 2 * rad]),
        '圓心到直線距離 d = |' + a + '×' + n(h) + ' + ' + b + '×' + n(k) + sg(c) + '| ÷ ' + r0 + ' = ' + dd + '。最遠 = d + r = ' + (dd + rad) + '，最近 = d − r = ' + (dd - rad) + '。'];
    } },
    { t: '垂直平分線', g: function (R) {
      var v = find(function () { return { x1: R.int(-4, 4), y1: R.int(-4, 4), x2: R.int(-4, 4), y2: R.int(-4, 4) }; },
        function (v) { var rhs = v.x2 * v.x2 + v.y2 * v.y2 - v.x1 * v.x1 - v.y1 * v.y1; return rhs % 2 === 0 && (v.x1 !== v.x2 || v.y1 !== v.y2) && v.x2 !== v.x1 && v.y2 !== v.y1; });
      var a = v.x2 - v.x1, b = v.y2 - v.y1, c = (v.x2 * v.x2 + v.y2 * v.y2 - v.x1 * v.x1 - v.y1 * v.y1) / 2;
      var f = function (a, b, c) { return tm(a, 'x', true) + tm(b, 'y') + ' = ' + c; };
      return ['A' + H.pt(v.x1, v.y1) + '、B' + H.pt(v.x2, v.y2) + '，線段 AB 的垂直平分線方程式為何？', O(f(a, b, c), [f(b, -a, c), f(a, b, -c), f(-a, b, c), f(a, b, c + 2)]),
        '垂直平分線上的點到 A、B 等距：(x − ' + n(v.x1) + ')² + (y − ' + n(v.y1) + ')² = (x − ' + n(v.x2) + ')² + (y − ' + n(v.y2) + ')²，化簡得 ' + f(a, b, n(c)) + '。'];
    } }
  ]);
  ext(ln, 'hard', [
    { t: '圓與兩軸相切', g: function (R) {
      var r = R.int(1, 6);
      return ['圓與 x 軸、y 軸都相切，圓心在第一象限且半徑為 ' + r + '，則圓的方程式為何？', O('(x − ' + r + ')² + (y − ' + r + ')² = ' + r * r, ['(x + ' + r + ')² + (y + ' + r + ')² = ' + r * r, '(x − ' + r + ')² + (y − ' + r + ')² = ' + r, 'x² + y² = ' + r * r, '(x − ' + r * r + ')² + (y − ' + r * r + ')² = ' + r * r]),
        '與兩軸都相切，圓心到兩軸的距離都等於半徑，圓心 (' + r + ', ' + r + ')，方程式 (x − ' + r + ')² + (y − ' + r + ')² = ' + r * r + '。'];
    } },
    { t: '直線與圓的位置', g: function (R) {
      var t = R.pick(PY), a = t[0], b = t[1], r0 = t[2], rad = R.int(2, 6), dd = R.int(1, 8);
      var pos = dd < rad ? '相割（兩個交點）' : dd === rad ? '相切' : '不相交';
      var c = dd * r0;
      return ['圓 x² + y² = ' + rad * rad + ' 與直線 ' + eqn(a, b, -c) + ' 的位置關係為何？', O(pos, ['相割（兩個交點）', '相切', '不相交'].filter(function (x) { return x !== pos; }).concat(['重合'])),
        '圓心 (0, 0) 到直線的距離 d = |' + n(-c) + '| ÷ ' + r0 + ' = ' + dd + '；半徑 r = ' + rad + '。d < r 相割、d = r 相切、d > r 不相交，所以是「' + pos + '」。'];
    } },
    { t: '切線方程式', g: function (R) {
      var h = R.int(-3, 3), k = R.int(-3, 3), t = R.pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13]]), sx = R.sign(), sy = R.sign();
      var px = h + sx * t[0], py = k + sy * t[1], r2 = t[2] * t[2];
      var a = px - h, b = py - k, c = -(a * px + b * py) + a * h * 0; // a(x − h) + b(y − k) = r² → a x + b y = r² + a h + b k
      var rhs = r2 + a * h + b * k;
      var f = function (aa, bb, cc) { return tm(aa, 'x', true) + tm(bb, 'y') + ' = ' + cc; };
      return ['圓心 ' + H.pt(h, k) + '、半徑 ' + t[2] + ' 的圓上一點 ' + H.pt(px, py) + '，過此點的圓切線方程式為何？', O(f(a, b, rhs), [f(b, -a, rhs), f(a, b, -rhs), f(a, -b, rhs), f(a, b, rhs + 2)]),
        '切線：(x₀ − h)(x − h) + (y₀ − k)(y − k) = r²，即 ' + n(a) + '(x' + sg(-h) + ') + ' + n(b) + '(y' + sg(-k) + ') = ' + r2 + '，整理得 ' + f(a, b, rhs) + '。'];
    } }
  ]);
  ext(ln, 'tc', [
    ['直線與圓', '（仿統測）圓 (x − 2)² + (y + 1)² = 9 的圓心與半徑為？', ['圓心 (2, −1)，半徑 3', '圓心 (−2, 1)，半徑 3', '圓心 (2, −1)，半徑 9', '圓心 (−2, 1)，半徑 9'], '標準式 (x − h)² + (y − k)² = r²，圓心 (2, −1)，r = 3。'],
    ['直線與圓', '（仿統測）點 (1, 2) 到直線 3x + 4y − 3 = 0 的距離為？', ['8/5', '2', '4/5', '8'], 'd = |3 + 8 − 3| ÷ 5 = 8/5。'],
    ['直線與圓', '（仿統測）兩直線 y = 2x + 1 與 y = ax + 5 垂直，則 a = ？', ['−1/2', '2', '1/2', '−2'], '垂直：斜率相乘 = −1，2a = −1，a = −1/2。']
  ]);

  /* ===== 數列與級數 ===== */
  var sq = unit('數列與級數');
  ext(sq, 'qs', [
    { t: '等比級數的項數', g: function (R) {
      var lim = R.pick([100, 500, 1000, 2000, 5000]);
      var n0 = 1, s = 1; while (s <= lim) { n0++; s += Math.pow(2, n0 - 1); }
      return ['等比級數 1 + 2 + 4 + 8 + … 的前 n 項和 Sₙ，使 Sₙ > ' + lim + ' 的最小正整數 n 為何？', O(n0, [n0 - 1, n0 + 1, n0 + 2, Math.round(lim / 100)]),
        'Sₙ = 2ⁿ − 1。2^' + (n0 - 1) + ' − 1 = ' + (Math.pow(2, n0 - 1) - 1) + ' ≤ ' + lim + '，2^' + n0 + ' − 1 = ' + (Math.pow(2, n0) - 1) + ' > ' + lim + '，所以 n = ' + n0 + '。'];
    } },
    { t: '奇偶項和', g: function (R) {
      var r = R.pick([2, 3, 4]), a = R.int(1, 3), m = R.int(2, 3);
      var so = a * (Math.pow(r, 2 * m) - 1) / (r * r - 1), se = r * so;
      return ['等比數列共 ' + 2 * m + ' 項，奇數項的和為 ' + so + '，偶數項的和為 ' + se + '，則公比為何？', O(r, [r + 1, r * r, Math.round(se - so), so / a]),
        '偶數項 = 奇數項 × 公比，所以公比 = 偶數項和 ÷ 奇數項和 = ' + se + ' ÷ ' + so + ' = ' + r + '。'];
    } },
    { t: 'Σ 公式的應用', g: function (R) {
      var k = R.int(4, 12);
      var v = k * (k + 1) * (k + 2) / 3;
      return ['Σ(j=1 到 ' + k + ') j(j + 1) = ？', O(v, [k * (k + 1) / 2 + k * (k + 1) * (2 * k + 1) / 6 + 1, k * (k + 1) * (k + 2) / 6, k * k * (k + 1), v + k]),
        'j(j + 1) = j² + j，Σ = k(k + 1)(2k + 1)/6 + k(k + 1)/2 = k(k + 1)(k + 2)/3 = ' + k + '×' + (k + 1) + '×' + (k + 2) + ' ÷ 3 = ' + v + '。'];
    } },
    { t: '複利（每年年初存入）', g: function (R) {
      var x = R.pick([10000, 20000, 5000]), yrs = R.pick([2, 3]);
      var s = 0; for (var i = 1; i <= yrs; i++) s += x * Math.pow(1.1, i);
      s = Math.round(s * 100) / 100;
      return ['每年年初存入 ' + x + ' 元，年利率 10%，複利計算，第 ' + yrs + ' 年年底的本利和為何（元）？', O(String(s), [String(Math.round(x * (Math.pow(1.1, yrs) - 1) / 0.1 * 100) / 100), String(x * yrs), String(Math.round(x * Math.pow(1.1, yrs) * 100) / 100)]),
        '年初存入，第 1 筆存滿 ' + yrs + ' 年、…最後一筆存 1 年：' + x + '(1.1 + 1.1² + … + 1.1^' + yrs + ') = ' + s + '。（年底才存入的話是 1.1⁰ 到 1.1^' + (yrs - 1) + '）'];
    } },
    { t: '每天增加百分比', g: function (R) {
      var a = R.pick([500, 1000, 2000]), days = R.pick([3, 4]);
      var s = 0; for (var i = 0; i < days; i++) s += a * Math.pow(1.1, i);
      s = Math.round(s * 100) / 100;
      return ['某園區開幕第一天有 ' + a + ' 名遊客，之後每天都比前一天多 10%，則開幕後 ' + days + ' 天的遊客總數為多少？', O(String(s), [String(a * days), String(Math.round(a * Math.pow(1.1, days) * 100) / 100), String(Math.round(a * (Math.pow(1.1, days + 1) - 1) / 0.1 * 100) / 100)]),
        '公比 1.1 的等比級數，Sₙ = a(rⁿ − 1) ÷ (r − 1) = ' + a + ' × (1.1^' + days + ' − 1) ÷ 0.1 = ' + s + '。'];
    } },
    { t: '等差數列的第幾項', g: function (R) {
      var a = R.int(1, 8), d = R.int(2, 6), k = R.int(8, 25);
      var an = a + (k - 1) * d;
      return ['等差數列首項 ' + a + '、公差 ' + d + '，則 ' + an + ' 是第幾項？', O(k, [k - 1, k + 1, Math.round(an / d), an - a]),
        'aₙ = a₁ + (n − 1)d → ' + an + ' = ' + a + ' + (n − 1) × ' + d + '，n = ' + k + '。'];
    } }
  ]);
  ext(sq, 'hard', [
    { t: '成等比再成等差', g: function (R) {
      var q = R.pick([2, 3]), a = R.int(1, 3);
      // 三數 a, aq, aq²；全部減 x 後成等差：2(aq − x) = (a − x) + (aq² − x) → 2aq = a + aq²…（與 x 無關），改成問：三數成等比，和為，積為
      var s = a + a * q + a * q * q, p = a * a * a * q * q * q;
      return ['三正數成等比數列，其積為 ' + p + '，和為 ' + s + '，則此數列的公比為何？（公比 > 1）', O(q, [q + 1, 1 / q, q * q, a]),
        '設三數為 m/q、m、mq，積 = m³ = ' + p + '，所以 m = ' + a * q + '。和 = m(1/q + 1 + q) = ' + s + '，解得公比為 ' + q + '（或其倒數，取 > 1）。'];
    } },
    { t: '無窮等比級數的應用', g: function (R) {
      var h = R.pick([8, 16, 24, 32]), rr = R.pick([[1, 2], [2, 3]]);
      var total = h + 2 * h * rr[0] / (rr[1] - rr[0]);
      return ['一球從 ' + h + ' m 高處落下，每次彈起的高度是前一次落下高度的 ' + H.frac(rr[0], rr[1]) + '。若一直彈到停止，球所經過的總路程為多少 m？', O(d1(total), [d1(h * rr[1] / (rr[1] - rr[0])), d1(2 * h), d1(h * 2 * rr[1] / (rr[1] - rr[0])), d1(total + h)]),
        '總路程 = 落下 ' + h + ' + 2 × (彈起各次高度之和) = ' + h + ' + 2 × ' + h + ' × ' + H.frac(rr[0], rr[1]) + ' ÷ (1 − ' + H.frac(rr[0], rr[1]) + ') = ' + d1(total) + ' m。'];
    } },
    ['數列與級數', '關於等差數列與等比數列，下列敘述何者「錯誤」？', ['a、b、c 成等比 ⇔ 2b = a + c', 'a、b、c 成等差 ⇔ 2b = a + c', 'a、b、c 成等比（皆不為 0）⇔ b² = ac', '無窮等比級數 |r| < 1 時和為 a₁ ÷ (1 − r)'], '成等比是 b² = ac；2b = a + c 是成等差。']
  ]);
  ext(sq, 'tc', [
    ['數列與級數', '（仿統測）等差數列首項 3、公差 4，前 10 項的和為？', ['210', '120', '195', '300'], 'S₁₀ = 10 × [2×3 + 9×4] ÷ 2 = 5 × 42 = 210。'],
    ['數列與級數', '（仿統測）等比數列首項 2、公比 3，第 5 項為？', ['162', '486', '54', '243'], 'a₅ = 2 × 3⁴ = 162。'],
    ['數列與級數', '（仿統測）無窮等比級數 6 + 2 + 2/3 + … 的和為？', ['9', '12', '8', '18'], '首項 6、公比 1/3，和 = 6 ÷ (1 − 1/3) = 9。']
  ]);

  /* ===== 排列組合 ===== */
  var cb = unit('排列組合');
  ext(cb, 'qs', [
    { t: '正因數個數', g: function (R) {
      var o = R.pick([[2, 1, 1, 30], [3, 1, 0, 60], [2, 2, 1, 180], [3, 2, 1, 360], [4, 2, 1, 720], [2, 1, 2, 150]]);
      var N = Math.pow(2, o[0]) * Math.pow(3, o[1]) * Math.pow(5, o[2]);
      var cnt = (o[0] + 1) * (o[1] + 1) * (o[2] + 1);
      return [N + ' 的正因數共有幾個？', O(cnt, [cnt + 2, N / 2, o[0] + o[1] + o[2], cnt * 2]), N + ' = 2^' + o[0] + ' × 3^' + o[1] + ' × 5^' + o[2] + '，正因數個數 = (' + (o[0] + 1) + ')(' + (o[1] + 1) + ')(' + (o[2] + 1) + ') = ' + cnt + '。'];
    } },
    { t: '格子路徑', g: function (R) {
      var a = R.int(2, 6), b = R.int(2, 5);
      return ['由 (0, 0) 走到 (' + a + ', ' + b + ')，每步只能向右或向上走 1 單位，共有幾條不同的路徑？', O(C(a + b, a), [P(a + b, a), a * b, C(a + b, a) + a, Math.pow(2, a + b)]),
        '共走 ' + (a + b) + ' 步，其中 ' + a + ' 步向右：C(' + (a + b) + ', ' + a + ') = ' + C(a + b, a) + '。'];
    } },
    { t: '對戰組合', g: function (R) {
      var a = R.int(3, 7), b = R.int(3, 7), c = R.int(3, 7);
      var all = a + b + c;
      return ['三個聯盟分別有 ' + a + '、' + b + '、' + c + ' 支球隊，若全部球隊在同一場錦標賽中兩兩對戰一次，共有幾種對戰組合？', O(C(all, 2), [C(a, 2) + C(b, 2) + C(c, 2), P(all, 2), C(all, 2) + a, all * (all - 1) / 4]),
        '共 ' + all + ' 隊兩兩對戰：C(' + all + ', 2) = ' + C(all, 2) + '（不是只算同聯盟內的）。'];
    } },
    { t: '分組', g: function (R) {
      var k = R.pick([2, 3, 4]);
      var ans = fact(2 * k) / (Math.pow(2, k) * fact(k));
      return [2 * k + ' 個人平均分成 ' + k + ' 組（每組 2 人，組別不分順序），共有幾種分法？', O(ans, [fact(2 * k) / Math.pow(2, k), C(2 * k, 2), ans * fact(k), ans + 2]),
        '先分成有順序的組：' + fact(2 * k) + ' ÷ ' + Math.pow(2, k) + ' = ' + fact(2 * k) / Math.pow(2, k) + '，因各組沒有順序再 ÷ ' + k + '! = ' + fact(k) + '，共 ' + ans + ' 種。'];
    } },
    { t: '選取（男女）', g: function (R) {
      var m = R.int(4, 7), f = R.int(3, 6), a = R.int(1, 3), b = R.int(1, 3);
      return ['有 ' + m + ' 位男生、' + f + ' 位女生，要選出 ' + a + ' 位男生與 ' + b + ' 位女生組成代表隊，共有幾種選法？', O(C(m, a) * C(f, b), [C(m + f, a + b), P(m, a) * P(f, b), C(m, a) + C(f, b), C(m, a) * C(f, b) * 2]),
        '分步驟（乘法原理）：C(' + m + ', ' + a + ') × C(' + f + ', ' + b + ') = ' + C(m, a) + ' × ' + C(f, b) + ' = ' + C(m, a) * C(f, b) + '。'];
    } }
  ]);
  ext(cb, 'hard', [
    { t: '指定位置與限制', g: function (R) {
      var m = R.pick([4, 6, 8]); // 共 m+1 個項目（奇數個才有正中間），A 固定中間 → 剩 m 個位置排列，B 不在第一、C 不在最後
      var ans = fact(m) - 2 * fact(m - 1) + fact(m - 2);
      return [(m + 1) + ' 個人排成一列，甲必須站在正中間，乙不可站在最前面，丙不可站在最後面，共有幾種排法？', O(ans, [fact(m), fact(m) - fact(m - 1), fact(m) - 2 * fact(m - 1), ans + fact(m - 2)]),
        '甲固定在正中間，其餘 ' + m + ' 人排在剩下 ' + m + ' 個位置：全部 ' + m + '! = ' + fact(m) + '。扣掉乙在最前 ' + (m - 1) + '!、丙在最後 ' + (m - 1) + '!，再加回兩者同時發生 ' + (m - 2) + '!：' + fact(m) + ' − ' + 2 * fact(m - 1) + ' + ' + fact(m - 2) + ' = ' + ans + '。'];
    } },
    { t: '組合與排列綜合', g: function (R) {
      var a = R.int(5, 8), b = R.int(2, 4);
      return ['從 ' + a + ' 本不同的書中選出 ' + b + ' 本，分給甲、乙、丙等 ' + b + ' 人各 1 本，共有幾種分法？', O(P(a, b), [C(a, b), Math.pow(a, b), a * b, P(a, b) + C(a, b)]),
        '選出的書要分給不同的人（有順序），所以是排列 P(' + a + ', ' + b + ') = ' + P(a, b) + '。'];
    } },
    { t: '不重複選取', g: function (R) {
      var k = R.int(3, 5);
      return ['由數字 1～9 取 ' + k + ' 個不同數字（不重複）組成 ' + k + ' 位數，其中 1 一定要出現且在首位，共有幾種？', O(P(8, k - 1), [P(9, k), C(8, k - 1), 8 * (k - 1), P(8, k)]),
        '首位固定為 1，其餘 ' + (k - 1) + ' 位由剩下 8 個數字取排：P(8, ' + (k - 1) + ') = ' + P(8, k - 1) + '。'];
    } }
  ]);
  ext(cb, 'tc', [
    ['排列組合', '（仿統測）「APPLE」五個字母全部排成一列，共有幾種排法？', ['60', '120', '30', '24'], '5! ÷ 2! = 60（P 重複 2 次）。'],
    ['排列組合', '（仿統測）從 8 位同學中選 3 位擔任幹部（不分職務），共有幾種選法？', ['56', '336', '24', '512'], 'C(8, 3) = 56。'],
    ['排列組合', '（仿統測）用 1、2、3、4 組成不重複的三位數，共有幾個？', ['24', '12', '64', '4'], 'P(4, 3) = 24。']
  ]);
})();

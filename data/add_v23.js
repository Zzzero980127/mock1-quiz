/* v2.3：摩擦力題型變化（疊放：有繩／無繩／斜繩、拉上層／中層／下層、斜拉力；斜面：水平推力、斜拉繩）
 * 圖形用 VF 自繪 SVG，每種變化畫出不同的圖，數字跟著類題換。
 * 一律用 addEasy／addHard／addTc 往後接，不插隊、不刪題。
 */
(function () {
  var H = QH, O = H.opts, D = H.dec;
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  var TRIG = { 30: [0.5, 0.866], 37: [0.6, 0.8], 53: [0.8, 0.6] };

  /* ---------- 示意圖 ---------- */
  var VF = (function () {
    function r1(x) { return Math.round(x * 10) / 10; }
    function svg(w, h, body) {
      return '<svg viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" role="img" class="qfig">' +
        '<defs><marker id="vfa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>' + body + '</svg>';
    }
    function L(x1, y1, x2, y2, c) { return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" class="' + (c || '') + '"/>'; }
    function A(x1, y1, x2, y2, c) { return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" class="' + (c || '') + '" marker-end="url(#vfa)"/>'; }
    function T(x, y, s, an, c) { return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (an || 'middle') + '" class="' + (c || '') + '">' + String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</text>'; }
    function Rc(x, y, w, h, c) { return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(w) + '" height="' + r1(h) + '" class="' + (c || '') + '"/>'; }
    function P(d, c) { return '<path d="' + d + '" class="' + (c || '') + '"/>'; }
    function hH(x1, x2, y) { var s = L(x1, y, x2, y, 'thick'); for (var x = x1; x < x2; x += 12) s += L(x, y, x - 8, y + 8, 'thin'); return s; }
    function hV(x, y1, y2) { var s = L(x, y1, x, y2, 'thick'); for (var y = y1; y < y2; y += 12) s += L(x, y, x - 8, y + 8, 'thin'); return s; }
    function rad(d) { return d * Math.PI / 180; }
    function arc(cx, cy, r, a1, a2) { // 角度：數學方向（逆時針為正），SVG y 軸向下
      var x1 = cx + r * Math.cos(rad(a1)), y1 = cy - r * Math.sin(rad(a1)), x2 = cx + r * Math.cos(rad(a2)), y2 = cy - r * Math.sin(rad(a2));
      return P('M' + r1(x1) + ',' + r1(y1) + ' A' + r + ',' + r + ' 0 0,' + (a2 > a1 ? 0 : 1) + ' ' + r1(x2) + ',' + r1(y2), 'thin');
    }
    return {
      /* 疊放：o = { W:[由上到下], mu:[各接觸面由上到下，最後一個是地面], rope:'none'|'h'|'up', ang, pull:受拉的塊（0 = 最上層）, pAng }
       * 名稱由上到下 A、B、C；牆在左邊，繩子綁最上層 */
      stack: function (o) {
        var n = o.W.length, g = 210, nm = ['A', 'B', 'C'];
        var geo = n === 3 ? [[130, 110, 32], [95, 180, 36], [70, 230, 40]] : [[110, 120, 40], [75, 200, 48]];
        var s = hH(15, 370, g);
        var y = g, box = [];
        for (var i = n - 1; i >= 0; i--) { var b = geo[i]; y -= b[2]; box[i] = [b[0], y, b[1], b[2]]; s += Rc(b[0], y, b[1], b[2], 'fill2 acc') + T(b[0] + b[1] / 2, y + b[2] / 2 + 4, nm[i] + '  ' + o.W[i] + ' N'); }
        var a = box[0], ay = a[1] + a[3] / 2, wx = 25;
        // 斜繩太陡時牆往右移，繩子才不會超出圖框
        if (o.rope === 'up') wx = Math.max(25, a[0] - (ay - 22) / Math.tan(rad(o.ang)));
        if (o.rope !== 'none') s += hV(wx, 15, g);
        if (o.rope === 'h') s += L(wx, ay, a[0], ay);
        if (o.rope === 'up') {
          var wy = ay - (a[0] - wx) * Math.tan(rad(o.ang));
          s += L(wx, wy, a[0], ay) + L(a[0], ay, a[0] - 45, ay, 'thin dash') + arc(a[0], ay, 30, 180, 180 - o.ang) + T(a[0] - 40, ay - 6, o.ang + '°', 'end', 'small');
          s += QH.slope(a[0], ay, 180, 180 - o.ang, o.ang, 44, Math.min(44, Math.sqrt((a[0] - wx) * (a[0] - wx) + (ay - wy) * (ay - wy)) - 50));
        }
        var p = box[o.pull], px = p[0] + p[2], py = p[1] + p[3] / 2, pa = o.pAng || 0, len = pa ? 72 : 50;
        s += A(px, py, px + len * Math.cos(rad(pa)), py - len * Math.sin(rad(pa)), 'acc') + T(px + len * Math.cos(rad(pa)) + 2, py - len * Math.sin(rad(pa)) - 8, 'P', 'start');
        if (pa) s += L(px, py, px + 42, py, 'thin dash') + arc(px, py, 26, 0, pa) + T(px + 30, py + 14, pa + '°', 'start', 'small') + QH.slope(px, py, 90, pa, 90 - pa, 10, 42);
        // 右上角列出各接觸面的 μs
        var lbl = [];
        for (var k = 0; k < n; k++) lbl.push((k < n - 1 ? nm[k] + '–' + nm[k + 1] : nm[k] + '–地面') + '：μs = ' + o.mu[k]);
        lbl.forEach(function (t, k) { s += T(368, 18 + k * 15, t, 'end', 'small'); });
        return svg(380, 225, s);
      },
      /* 斜面：o = { th, W, mu, kind:'hp'（水平推力）|'rope'（與斜面夾 al 的拉繩） , al } */
      incline: function (o) {
        var th = o.th, g = 215, Lh = 270, bx = Lh * Math.cos(rad(th)), hy = Lh * Math.sin(rad(th)), x0 = 40;
        var s = hH(10, x0 + bx + 30, g) + P('M' + x0 + ',' + g + ' L' + r1(x0 + bx) + ',' + r1(g - hy) + ' L' + r1(x0 + bx) + ',' + g, 'thick');
        s += arc(x0, g, 34, 0, th) + T(x0 + 40, g - 8, th + '°', 'start', 'small') + QH.slope(x0, g, 0, th, th, 58, 56);
        var t = 0.55, px = x0 + t * bx, py = g - t * hy, ux = Math.cos(rad(th)), uy = -Math.sin(rad(th)), nx = -Math.sin(rad(th)), ny = -Math.cos(rad(th));
        s += '<g transform="translate(' + r1(px) + ',' + r1(py) + ') rotate(' + (-th) + ')">' + Rc(-26, -34, 52, 34, 'fill2 acc') + '</g>';
        var cx = px + nx * 17, cy = py + ny * 17;
        s += T(cx + nx * 40, cy + ny * 40, 'W = ' + o.W + ' N') + T(x0 + bx + 6, g - hy - 8, 'μs = ' + o.mu, 'end', 'small');
        if (o.kind === 'hp') {
          s += A(cx - 95, cy, cx - 28, cy, 'acc') + T(cx - 100, cy + 4, 'P', 'end');
        } else {
          var sx = cx + ux * 26, sy = cy + uy * 26, d = th + o.al, Lt = Math.max(56, Math.min(92, (sy - 18) / Math.max(0.2, Math.sin(rad(d))), Math.cos(rad(d)) > 0 ? (340 - sx) / Math.cos(rad(d)) : 92));
          s += A(sx, sy, sx + Lt * Math.cos(rad(d)), sy - Lt * Math.sin(rad(d)), 'acc') + T(sx + (Lt + 4) * Math.cos(rad(d)), sy - (Lt + 4) * Math.sin(rad(d)) - 4, 'T', 'start');
          s += L(sx, sy, sx + ux * 55, sy + uy * 55, 'thin dash') + arc(sx, sy, 34, th, d) + T(sx + 40 * Math.cos(rad(th + o.al / 2)) + 4, sy - 40 * Math.sin(rad(th + o.al / 2)) + 4, o.al + '°', 'start', 'small') + QH.slope(sx, sy, th + 90, d, 90 - o.al, 22, Lt - 36);
        }
        return svg(360, 230, s);
      }
    };
  })();

  function N(x) { return D(x, 2) + ' N'; }
  function more(ans) { return function (k) { return N(ans * (1 + 0.15 * k)); }; }
  function muT(o) { return o.mu.map(function (m, k) { return (k < o.W.length - 1 ? 'ABC'[k] + '、' + 'ABC'[k + 1] + ' 間' : 'ABC'[k] + ' 與地面') + ' μs = ' + m; }).join('，'); }
  function wT(o) { return o.W.map(function (w, k) { return 'ABC'[k] + ' 重 ' + w + ' N'; }).join('、'); }

  /* 兩塊疊放：繩子有／無／水平／斜向上 */
  function twoRope(easy) {
    var WA = pick([10, 20, 30, 40]), WB = pick([20, 30, 40, 50]), m1 = pick([0.2, 0.25, 0.5]), m2 = pick([0.3, 0.4, 0.5]);
    var rope = easy ? pick(['h', 'none']) : pick(['h', 'none', 'up', 'up']), ang = pick([37, 53]), o = { W: [WA, WB], mu: [m1, m2], rope: rope, ang: ang, pull: 1 };
    var f1 = m1 * WA, base = '如圖，A 疊在 B 上，' + wT(o) + '，' + muT(o) + '。';
    if (rope === 'none') {
      var P0 = m2 * (WA + WB);
      return [base + 'A 沒有綁繩子，以水平力 P 拉 B，要使 B 開始移動，P 最小為何？', O(N(P0), [N(f1 + P0), N(f1), N(m2 * WB)], more(P0)),
        'A 沒被繩子拉住，B 剛要動時 A 會跟著 B 一起動（A、B 間不必出現滑動）。\n把 A、B 當一體：P = μ(B–地面) × (WA + WB) = ' + m2 + ' × ' + (WA + WB) + ' = ' + N(P0) + '。\n常見錯誤：多加了 A、B 間的摩擦 ' + N(f1) + '，那是 A 被綁住時才有。', VF.stack(o)];
    }
    if (rope === 'h') {
      var P1 = f1 + m2 * (WA + WB);
      return [base + 'A 以水平繩綁在牆上，以水平力 P 拉 B，要使 B 開始移動，P 最小為何？', O(N(P1), [N(m2 * (WA + WB)), N(f1 + m2 * WB), N(f1)], more(P1)),
        'A 被繩拉住不動，B 上下兩面都受摩擦（都向左）。\n上面：' + m1 + ' × ' + WA + ' = ' + N(f1) + '；下面：' + m2 + ' × (' + WA + ' + ' + WB + ') = ' + N(m2 * (WA + WB)) + '。\nP = ' + N(P1) + '。', VF.stack(o)];
    }
    var tr = TRIG[ang], Tn = m1 * WA / (tr[1] + m1 * tr[0]), N1 = WA - Tn * tr[0], P2 = m1 * N1 + m2 * (N1 + WB), askT = Math.random() < 0.4;
    var expl = 'A 受繩張力 T（斜向上 ' + ang + '°）、重力、B 給的正壓力 N₁ 與摩擦（B 往右動 → A 受的摩擦向右）。\n水平：T cos' + ang + '° = μ N₁；鉛直：N₁ + T sin' + ang + '° = ' + WA + '。\n→ T = μWA / (cos' + ang + '° + μ sin' + ang + '°) = ' + m1 + '×' + WA + ' / (' + tr[1] + ' + ' + m1 + '×' + tr[0] + ') = ' + N(Tn) + '，N₁ = ' + WA + ' − ' + D(Tn, 2) + '×' + tr[0] + ' = ' + N(N1) + '。';
    var q = base + 'A 以一條與水平夾 ' + ang + '° 的斜繩綁在牆上（sin' + ang + '° = ' + tr[0] + '、cos' + ang + '° = ' + tr[1] + '），以水平力 P 拉 B 使 B 恰要向右移動，';
    if (askT) return [q + '此時繩子張力 T 為何？', O(N(Tn), [N(f1), N(f1 / tr[1]), N(m1 * WA / (tr[1] - m1 * tr[0]))], more(Tn)), expl + '\n斜繩會把 A 往上提，正壓力變小，所以 T 不是單純 μWA / cos' + ang + '°。', VF.stack(o)];
    return [q + 'P 最小為何？', O(N(P2), [N(f1 + m2 * (WA + WB)), N(m1 * N1 + m2 * (WA + WB)), N(m2 * (WA + WB))], more(P2)),
      expl + '\nB：P = μ₁N₁ + μ₂(N₁ + WB) = ' + m1 + '×' + D(N1, 2) + ' + ' + m2 + '×(' + D(N1, 2) + ' + ' + WB + ') = ' + N(P2) + '。\n斜繩讓 N₁ 變小，所以 B 上下兩面的摩擦都變小。', VF.stack(o)];
  }

  /* 兩塊疊放：拉上層 A（沒有繩子） */
  function twoPullTop() {
    var WA = pick([10, 20, 30]), WB = pick([30, 40, 50]), m1 = pick([0.2, 0.3]), m2 = pick([0.3, 0.4]), o = { W: [WA, WB], mu: [m1, m2], rope: 'none', pull: 0 };
    return ['如圖，A 疊在 B 上，' + wT(o) + '，' + muT(o) + '。以水平力 P 拉上面的 A，要使 A 開始移動，P 最小為何？', O(N(m1 * WA), [N(m2 * (WA + WB)), N(m1 * WA + m2 * (WA + WB)), N(m2 * WA)], more(m1 * WA)),
      'A 要在 B 上滑動需 P = μ₁WA = ' + m1 + '×' + WA + ' = ' + N(m1 * WA) + '。\nB 受 A 給的摩擦最多 ' + N(m1 * WA) + '，小於地面最大摩擦 ' + m2 + '×' + (WA + WB) + ' = ' + N(m2 * (WA + WB)) + '，所以 B 不動，只有 A 滑動。', VF.stack(o)];
  }

  /* 兩塊疊放：A 綁水平繩，P 斜向上拉 B */
  function twoAngledP() {
    var WA = pick([10, 20, 30]), WB = pick([30, 40, 50, 60]), m1 = pick([0.2, 0.25]), m2 = pick([0.25, 0.5]), pa = pick([37, 53]), tr = TRIG[pa];
    var o = { W: [WA, WB], mu: [m1, m2], rope: 'h', pull: 1, pAng: pa };
    var Pn = (m1 * WA + m2 * (WA + WB)) / (tr[1] + m2 * tr[0]);
    return ['如圖，A 以水平繩綁在牆上，' + wT(o) + '，' + muT(o) + '。以與水平夾 ' + pa + '° 斜向上的力 P 拉 B（sin' + pa + '° = ' + tr[0] + '、cos' + pa + '° = ' + tr[1] + '），要使 B 開始移動，P 最小為何？',
      O(N(Pn), [N(m1 * WA + m2 * (WA + WB)), N((m1 * WA + m2 * (WA + WB)) / tr[1]), N((m1 * WA + m2 * (WA + WB)) / (tr[1] - m2 * tr[0]))], more(Pn)),
      'P 的鉛直分量把 B 往上提：地面正壓力 = ' + (WA + WB) + ' − P sin' + pa + '°。\n水平：P cos' + pa + '° = μ₁WA + μ₂(' + (WA + WB) + ' − P sin' + pa + '°)\n→ P = (' + D(m1 * WA, 2) + ' + ' + D(m2 * (WA + WB), 2) + ') / (' + tr[1] + ' + ' + m2 + '×' + tr[0] + ') = ' + N(Pn) + '。', VF.stack(o)];
  }

  /* 三塊疊放：拉中層或下層、繩子水平或斜向上 */
  function three() {
    var WA = pick([10, 20, 30]), WB = pick([20, 30, 40]), WC = pick([40, 50, 60]), m1 = pick([0.1, 0.2, 0.5]), m2 = pick([0.2, 0.3]), m3 = pick([0.3, 0.4]);
    var pull = pick([1, 2]), rope = pick(['h', 'up']), ang = pick([37, 53]), tr = TRIG[ang], o = { W: [WA, WB, WC], mu: [m1, m2, m3], rope: rope, ang: ang, pull: pull };
    var N1 = WA, Tn = 0, pre = '';
    if (rope === 'up') { Tn = m1 * WA / (tr[1] + m1 * tr[0]); N1 = WA - Tn * tr[0]; pre = '斜繩：T cos' + ang + '° = μ₁N₁、N₁ + T sin' + ang + '° = ' + WA + ' → T = ' + N(Tn) + '、N₁ = ' + N(N1) + '（比 WA 小）。\n'; }
    var q = '如圖，三塊疊放，' + wT(o) + '，' + muT(o) + '。A 以' + (rope === 'h' ? '水平繩' : '與水平夾 ' + ang + '° 的斜繩（sin' + ang + '° = ' + tr[0] + '、cos' + ang + '° = ' + tr[1] + '）') + '綁在牆上，以水平力 P 拉' + (pull === 1 ? '中間的 B' : '最下面的 C') + '，要使它開始移動，P 最小為何？';
    var f1 = m1 * N1, Ptot;
    if (pull === 1) {
      Ptot = f1 + m2 * (N1 + WB);
      return [q, O(N(Ptot), [N(f1 + m3 * (N1 + WB + WC)), N(m2 * (N1 + WB)), N(f1 + m2 * WB)], more(Ptot)),
        pre + 'B 上面受 A 的摩擦 μ₁N₁ = ' + N(f1) + '，下面受 C 的摩擦 μ₂(N₁ + WB) = ' + N(m2 * (N1 + WB)) + '。\nC 與地面最大摩擦 ' + m3 + '×' + D(N1 + WB + WC, 2) + ' = ' + N(m3 * (N1 + WB + WC)) + ' 比 ' + N(m2 * (N1 + WB)) + ' 大，C 不動。\nP = ' + N(Ptot) + '。', VF.stack(o)];
    }
    if (f1 >= m2 * (N1 + WB)) return three();
    Ptot = f1 + m3 * (N1 + WB + WC);
    return [q, O(N(Ptot), [N(m2 * (N1 + WB) + m3 * (N1 + WB + WC)), N(m3 * (N1 + WB + WC)), N(f1 + m2 * (N1 + WB) + m3 * (N1 + WB + WC))], more(Ptot)),
      pre + '拉 C 時，B 夾在中間：C 能帶動 B 的摩擦最多 ' + N(m2 * (N1 + WB)) + '，A 拉住 B 的摩擦最多 ' + N(f1) + '，前者較大 → B 跟著 C 一起動，B、C 間不滑。\n所以只有 A–B 面和地面在滑：P = μ₁N₁ + μ₃(N₁ + WB + WC) = ' + N(f1) + ' + ' + N(m3 * (N1 + WB + WC)) + ' = ' + N(Ptot) + '。', VF.stack(o)];
  }

  /* 斜面：水平推力 P 的範圍 */
  function inclineHP() {
    var th = pick([30, 37, 53]), tr = TRIG[th], W = pick([50, 80, 100, 160, 200]), mu = pick([0.1, 0.2, 0.25, 0.5]);
    var lo = W * (tr[0] - mu * tr[1]) / (tr[1] + mu * tr[0]), hi = W * (tr[0] + mu * tr[1]) / (tr[1] - mu * tr[0]);
    return ['如圖，重 ' + W + ' N 的物體放在 ' + th + '° 斜面上（μs = ' + mu + '），以水平推力 P 使物體保持靜止，P 的範圍為何？（sin' + th + '° = ' + tr[0] + '、cos' + th + '° = ' + tr[1] + '）',
      O(D(lo, 2) + ' N ≤ P ≤ ' + D(hi, 2) + ' N', [D(W * (tr[0] - mu * tr[1]), 2) + ' N ≤ P ≤ ' + D(W * (tr[0] + mu * tr[1]), 2) + ' N', D(lo, 2) + ' N ≤ P ≤ ' + D(W * (tr[0] + mu * tr[1]) / tr[1], 2) + ' N', '0 ≤ P ≤ ' + D(hi, 2) + ' N']),
      '水平推力有兩個分量：沿斜面 P cosθ、壓向斜面 P sinθ，所以正壓力 N = W cosθ + P sinθ。\n快上滑（摩擦向下）：P cosθ = W sinθ + μ(W cosθ + P sinθ) → P = W(sinθ + μcosθ)/(cosθ − μsinθ) = ' + N(hi) + '。\n快下滑（摩擦向上）：P = W(sinθ − μcosθ)/(cosθ + μsinθ) = ' + N(lo) + '。', VF.incline({ th: th, W: W, mu: mu, kind: 'hp' })];
  }

  /* 斜面：斜拉繩（與斜面夾 α）拉上坡 */
  function inclineRope() {
    var c = pick([[30, 37], [37, 30], [37, 53], [53, 37]]), th = c[0], al = c[1], t1 = TRIG[th], t2 = TRIG[al], W = pick([50, 100, 200]), mu = pick([0.2, 0.25, 0.5]);
    var Tn = W * (t1[0] + mu * t1[1]) / (t2[1] + mu * t2[0]);
    return ['如圖，重 ' + W + ' N 的物體放在 ' + th + '° 斜面上（μs = ' + mu + '），以一條與斜面夾 ' + al + '° 的繩子往上坡拉，使物體恰要向上滑，繩子張力 T 為何？（sin' + th + '° = ' + t1[0] + '、cos' + th + '° = ' + t1[1] + '；sin' + al + '° = ' + t2[0] + '、cos' + al + '° = ' + t2[1] + '）',
      O(N(Tn), [N(W * (t1[0] + mu * t1[1])), N(W * (t1[0] + mu * t1[1]) / t2[1]), N(W * (t1[0] + mu * t1[1]) / (t2[1] - mu * t2[0]))], more(Tn)),
      '繩子往上提，正壓力 N = W cosθ − T sinα。\n沿斜面：T cosα = W sinθ + μ(W cosθ − T sinα)\n→ T = W(sinθ + μcosθ)/(cosα + μsinα) = ' + W + '×(' + t1[0] + ' + ' + mu + '×' + t1[1] + ')/(' + t2[1] + ' + ' + mu + '×' + t2[0] + ') = ' + N(Tn) + '。', VF.incline({ th: th, W: W, mu: mu, kind: 'rope', al: al })];
  }

  addEasy('mech', 6, [
    { t: '疊放摩擦（繩子有無）', g: function () { return twoRope(true); } },
    { t: '疊放摩擦（拉上層）', g: twoPullTop }
  ]);
  addHard('mech', 6, [
    { t: '疊放摩擦（繩子變化）', g: function () { return twoRope(false); } },
    { t: '疊放摩擦（斜拉力）', g: twoAngledP },
    { t: '三塊疊放（拉不同塊）', g: three },
    { t: '斜面水平推力', g: inclineHP },
    { t: '斜面斜拉繩', g: inclineRope }
  ]);
  addTc('mech', 6, [
    { t: '疊放摩擦（繩子變化）', g: function () { return twoRope(false); } },
    { t: '三塊疊放（拉不同塊）', g: three },
    { t: '疊放摩擦（拉上層）', g: twoPullTop },
    { t: '疊放摩擦（斜拉力）', g: twoAngledP },
    { t: '斜面水平推力', g: inclineHP },
    { t: '斜面斜拉繩', g: inclineRope }
  ]);
})();

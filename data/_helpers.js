/* 出題用的小工具（給 data/*.js 的類題產生器用） */

// 困難版題目掛到既有單元上：addHard('math', 0, [...])。只能往後加，不要插隊或刪題（id 依順序）。
window.addHard = function (subjId, unitIndex, items) {
  var s = (window.QUIZ_DATA || []).filter(function (x) { return x.id === subjId; })[0];
  if (!s || !s.units[unitIndex]) return;
  var u = s.units[unitIndex];
  u.hard = (u.hard || []).concat(items);
};
// 簡單版題目追加到既有單元最後：addEasy('mech', 0, [...])。同樣只能往後加（id = 科目-單元-題號）。
window.addEasy = function (subjId, unitIndex, items) {
  var s = (window.QUIZ_DATA || []).filter(function (x) { return x.id === subjId; })[0];
  if (!s || !s.units[unitIndex]) return;
  var u = s.units[unitIndex];
  u.qs = (u.qs || []).concat(items);
};
// 統測區題目掛到既有單元上：addTc('mech', 0, [...])。id = 科目-單元-t序號，同樣只能往後加。
window.addTc = function (subjId, unitIndex, items) {
  var s = (window.QUIZ_DATA || []).filter(function (x) { return x.id === subjId; })[0];
  if (!s || !s.units[unitIndex]) return;
  var u = s.units[unitIndex];
  u.tc = (u.tc || []).concat(items);
};
window.QH = (function () {
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
  // 負號用全形「−」比較好讀
  function n(x) { return x < 0 ? '−' + Math.abs(x) : String(x); }
  function frac(p, q) {
    if (q < 0) { p = -p; q = -q; }
    var g = gcd(p, q); p /= g; q /= g;
    return q === 1 ? n(p) : (p < 0 ? '−' : '') + Math.abs(p) + '/' + q;
  }
  // π 的係數：piFrac(2,3) → 2π/3
  function piFrac(p, q) {
    var g = gcd(p, q); p /= g; q /= g;
    var s = p < 0 ? '−' : ''; p = Math.abs(p);
    if (p === 0) return '0';
    return s + (p === 1 ? '' : p) + 'π' + (q === 1 ? '' : '/' + q);
  }
  // √n 化簡 → k√m
  function sqrtS(x) {
    if (x === 0) return '0';
    var k = 1, m = x;
    for (var i = Math.floor(Math.sqrt(x)); i > 1; i--) { if (x % (i * i) === 0) { k = i; m = x / (i * i); break; } }
    if (m === 1) return String(k);
    return (k === 1 ? '' : k) + '√' + m;
  }
  // x − a 的寫法
  function lin(a, v) { v = v || 'x'; return a === 0 ? v : (a > 0 ? v + ' − ' + a : v + ' + ' + (-a)); }
  function pt(x, y, z) { return '(' + n(x) + ', ' + n(y) + (z === undefined ? '' : ', ' + n(z)) + ')'; }
  // 數字取到 d 位小數，去掉多餘的 0
  function dec(x, d) { var p = Math.pow(10, d === undefined ? 2 : d); var v = Math.round(x * p) / p; if (Object.is(v, -0)) v = 0; return n(v); }
  // 組選項：第一個是正解，其餘去重複；不夠時用 more() 補
  function opts(ans, cands, more) {
    var out = [String(ans)], seen = {}; seen[String(ans)] = 1;
    cands.forEach(function (c) { c = String(c); if (!seen[c] && out.length < 4) { seen[c] = 1; out.push(c); } });
    var guard = 0;
    while (out.length < 4 && more && guard++ < 50) { var c = String(more(guard)); if (!seen[c]) { seen[c] = 1; out.push(c); } }
    return out;
  }
  // 浮點數誤差（220.00000000000003、0.30000000000000004）四捨五入到 4 位小數
  function clean(s) {
    // 只處理「小數中段連續 6 個以上 0 或 9、後面還有數字」的誤差，像 0.0000116 這種正常數值不動
    return s.replace(/\d+\.\d*?[1-9]?(?:0{6,}|9{6,})\d+/g, function (x) {
      var dec = (x.split('.')[1].match(/^\d*?(?=0{6,}|9{6,})/) || [''])[0].length;
      return String(parseFloat(parseFloat(x).toFixed(dec)));
    });
  }
  // 選項去重複；不足 4 個時，把正解裡的數字微調做出干擾選項
  function fill(list) {
    var out = [], seen = {};
    list.forEach(function (o) { o = clean(String(o)).replace(/(^|[\s(,])-(?=\d)/g, '$1−'); if (!seen[o]) { seen[o] = 1; out.push(o); } });
    var deltas = [1, -1, 2, -2, 3, -3, 5, -5, 10, -10];
    for (var s = 0; s < out.length && out.length < 4; s++) {
      var src = out[s], m = src.match(/\d+(\.\d+)?/);
      if (!m) continue;
      var d = (m[1] || '').length - (m[1] ? 1 : 0), unit = d ? Math.pow(10, -d) : 1;
      for (var i = 0; i < deltas.length && out.length < 4; i++) {
        var v = parseFloat(m[0]) + deltas[i] * unit; if (v < 0) continue;
        var c = src.slice(0, m.index) + v.toFixed(d) + src.slice(m.index + m[0].length);
        if (!seen[c]) { seen[c] = 1; out.push(c); }
      }
    }
    return out;
  }
  /* 特殊角在圖上加畫邊長比三角形（斜邊貼在那條線上，兩股分別沿基準線與垂直方向）：
   * 37°/53° → 3-4-5、28°/62° → 8-15-17、23°/67° → 5-12-13、16°/74° → 7-24-25。
   * vx,vy 角的頂點；ref、line 為基準線與斜線的方向（數學角度，逆時針為正）；ang 題目給的角度；
   * s0 三角形從頂點沿斜線多遠開始；d 斜邊長（px）；hin = true 時斜邊的數字寫在三角形裡面（斜邊外側有東西時用）。不是特殊角回傳空字串。 */
  var SLOPE = { 37: [4, 3, 5], 53: [3, 4, 5], 28: [15, 8, 17], 62: [8, 15, 17], 23: [12, 5, 13], 67: [5, 12, 13], 16: [24, 7, 25], 74: [7, 24, 25] };
  function slope(vx, vy, ref, line, ang, s0, d, hin) {
    var k = SLOPE[ang]; if (!k || !(d >= 18)) return '';
    var R = Math.PI / 180, ux = Math.cos(line * R), uy = -Math.sin(line * R), rx = Math.cos(ref * R), ry = -Math.sin(ref * R);
    var a = d * (ux * rx + uy * ry);
    var x1 = vx + s0 * ux, y1 = vy + s0 * uy, x2 = x1 + d * ux, y2 = y1 + d * uy, qx = x1 + a * rx, qy = y1 + a * ry;
    var gx = (x1 + x2 + qx) / 3, gy = (y1 + y2 + qy) / 3;
    function f(v) { return Math.round(v * 10) / 10; }
    function ln(ax, ay, bx, by) { return '<line x1="' + f(ax) + '" y1="' + f(ay) + '" x2="' + f(bx) + '" y2="' + f(by) + '" class="slope"/>'; }
    function lb(ax, ay, bx, by, t) {
      var mx = (ax + bx) / 2, my = (ay + by) / 2, ox = mx - gx, oy = my - gy, l = Math.sqrt(ox * ox + oy * oy) || 1, o = String(t).length > 1 ? 11 : 9;
      return '<text x="' + f(mx + ox / l * o) + '" y="' + f(my + oy / l * o + 4) + '" text-anchor="middle" class="small slope">' + t + '</text>';
    }
    var e1x = x1 - qx, e1y = y1 - qy, e2x = x2 - qx, e2y = y2 - qy, l1 = Math.sqrt(e1x * e1x + e1y * e1y) || 1, l2 = Math.sqrt(e2x * e2x + e2y * e2y) || 1, m = 5;
    e1x = e1x / l1 * m; e1y = e1y / l1 * m; e2x = e2x / l2 * m; e2y = e2y / l2 * m;
    return '<g class="slopetri">' + ln(x1, y1, qx, qy) + ln(qx, qy, x2, y2) + ln(x1, y1, x2, y2) +
      '<path d="M' + f(qx + e1x) + ',' + f(qy + e1y) + ' L' + f(qx + e1x + e2x) + ',' + f(qy + e1y + e2y) + ' L' + f(qx + e2x) + ',' + f(qy + e2y) + '" class="slope"/>' +
      lb(x1, y1, qx, qy, k[0]) + lb(qx, qy, x2, y2, k[1]) + (hin ? '<text x="' + f(gx) + '" y="' + f(gy + 4) + '" text-anchor="middle" class="small slope">' + k[2] + '</text>' : lb(x1, y1, x2, y2, k[2])) + '</g>';
  }
  return { gcd: gcd, n: n, frac: frac, piFrac: piFrac, sqrtS: sqrtS, lin: lin, pt: pt, dec: dec, opts: opts, fill: fill, clean: clean, slope: slope };
})();

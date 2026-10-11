/* 測量 困難版：仿歷屆一模（多步驟計算、綜合判斷） */
(function () {
  var H = QH, n = H.n, O = H.opts, D = H.dec;
  function f3(x) { return (Math.round(x * 1000) / 1000).toFixed(3); }

  addHard('surv', 0, [
    ['坐標系統綜合', '有關臺灣的大地基準與高程基準，下列敘述何者錯誤？', ['TWVD2001 的水準原點主點為地面點位 K996', 'TWD97 採用 GRS80 橢球體', 'TWD97 本島 TM2° 投影中央經線為 121°E，尺度比 0.9999', 'TWVD2001 以基隆驗潮站 18.6 年平均海水面為基準'], '主點 K997（地下點位），副點 K996（地面點位），常被對調。'],
    { t: '高程換算綜合', g: function (R) {
      var Hh = R.int(500, 3000) / 10, N = R.int(150, 260) / 10, h = Hh + N;
      return ['以 GPS 測得某點橢球高 ' + D(h, 1) + ' m，以水準測量測得正高 ' + D(Hh, 1) + ' m，該處的大地起伏為何？', O(D(N, 1) + ' m', [D(-N, 1) + ' m', D(h + Hh, 1) + ' m', D(Hh / h, 3) + ' m']), 'N = h − H = ' + D(h, 1) + ' − ' + D(Hh, 1) + ' = ' + D(N, 1) + ' m。水準儀測正高，GPS 測橢球高（幾何高）。'];
    } }
  ]);

  addHard('surv', 1, [
    { t: '中誤差綜合', g: function (R) {
      var s = R.pick([1, 2, 3]), v = [3, -1, -1, -1].map(function (x) { return x * s; });
      var base = R.int(50, 200) + R.int(100, 900) / 1000;
      var obs = v.map(function (x) { return f3(base - x / 1000); });
      var vv = v.reduce(function (a, b) { return a + b * b; }, 0), m = Math.sqrt(vv / 3), M = m / 2, N = Math.round(base / (M / 1000));
      return ['同一距離觀測 4 次：' + obs.join('、') + ' m，則最或是值與其中誤差、相對精度約為何？', O(f3(base) + ' m ± ' + D(M, 1) + ' mm，約 1/' + N, [f3(base) + ' m ± ' + D(m, 1) + ' mm，約 1/' + Math.round(base / (m / 1000)), f3(base) + ' m ± ' + D(Math.sqrt(vv / 4), 2) + ' mm，約 1/' + Math.round(base / (Math.sqrt(vv / 4) / 1000)), f3(base + v[0] / 1000) + ' m ± ' + D(M, 1) + ' mm，約 1/' + N]),
        '平均 = ' + f3(base) + ' m；[vv] = ' + vv + ' mm²；m = ±√(' + vv + '/3) = ±' + D(m, 1) + ' mm；M = m/√4 = ±' + D(M, 1) + ' mm；相對精度 = M ÷ 距離。'];
    } },
    ['誤差綜合', '下列哪一種誤差可以「用公式改正」？', ['捲尺因溫度高於檢定溫度而伸長', '讀尺時估讀不一致', '水準氣泡沒有完全居中', '記錄員把 1.53 寫成 1.35'], '溫度造成的是系統誤差，可用 C_t = α(t − t0)L 改正；讀數不一致、氣泡偏移是偶然誤差；寫錯是錯誤（粗差）要重測。']
  ]);

  addHard('surv', 2, [
    { t: '捲尺綜合改正', g: function (R) {
      var dl = R.pick([0.003, 0.005, 0.006, -0.004, -0.006]), Lm = R.int(40, 90), h = R.int(1, 4);
      var c1 = Lm * dl / 30, c2 = -h * h / (2 * Lm), Lt = Lm + c1 + c2;
      return ['以名義 30 m、實際長 ' + (30 + dl).toFixed(3) + ' m 的捲尺沿斜坡量得 ' + Lm + '.000 m，兩端高程差 ' + h + ' m。經尺長與傾斜改正後的水平距離約為何？', O(f3(Lt) + ' m', [f3(Lm - c1 + c2) + ' m', f3(Lm + c1 - c2) + ' m', f3(Lm + c1) + ' m']),
        '尺長改正 = ' + Lm + ' × (' + n(dl) + ' ÷ 30) = ' + D(c1, 4) + ' m；傾斜改正 = −' + h * h + ' ÷ (2 × ' + Lm + ') = ' + D(c2, 4) + ' m（恆為負）。水平距 = ' + f3(Lt) + ' m。'];
    } },
    ['捲尺改正綜合', '使用鋼捲尺量距，下列各種情況與「改正數」正負的組合，何者正確？', ['量測時溫度高於檢定溫度 → 正；尺懸空下垂 → 負', '拉力大於檢定拉力 → 負；傾斜量距 → 正', '點位高於平均海水面 → 正；尺比標準長 → 負', '溫度低於檢定溫度 → 正；懸垂 → 正'], '溫度高 → 尺伸長 → 量得偏小 → 改正為正；拉力大同理為正；傾斜、懸垂恆為負；高於海平面歸化為負；尺比標準長 → 量得偏小 → 改正為正。']
  ]);

  addHard('surv', 3, [
    { t: '測距誤差綜合', g: function (R) {
      var a = R.int(2, 5), b = R.int(2, 5), Dm = R.pick([800, 1200, 1500, 2000, 2500]), err = a + b * Dm / 1000, N = Math.round(Dm * 1000 / err);
      return ['全站儀標稱精度 ±(' + a + ' mm + ' + b + ' ppm·D)，測距 ' + Dm + ' m，則測距誤差與相對精度約為何？', O('±' + D(err, 1) + ' mm，約 1/' + N, ['±' + (a + b) + ' mm，約 1/' + Math.round(Dm * 1000 / (a + b)), '±' + D(a + b * Dm, 0) + ' mm，約 1/' + Math.round(1000 / (a + b * Dm) * Dm), '±' + D(err, 1) + ' mm，約 1/' + Math.round(N / 10)]),
        b + ' ppm × ' + Dm + ' m = ' + D(b * Dm / 1000, 1) + ' mm；總誤差 ' + D(err, 1) + ' mm；相對精度 = ' + D(err, 1) + ' mm ÷ ' + Dm + ' m ≈ 1/' + N + '。'];
    } },
    ['測距儀綜合', '有關電子測距儀，下列敘述何者錯誤？', ['紅外線測距儀不需要稜鏡即可測距', '微波測距儀需兩部主機互相收發，最易受濕度影響', '換用不同稜鏡時要考慮稜鏡常數', '全站儀由電子經緯儀與測距儀組成'], '紅外線需要稜鏡反射；雷射測距儀才可免稜鏡。']
  ]);

  addHard('surv', 4, [
    { t: '氣泡偏移改正', g: function (R) {
      var th = R.pick([10, 20, 30]), nn = R.int(1, 3), Dm = R.pick([50, 60, 80, 100]), read = R.int(1200, 2500) / 1000, obj = Math.random() < 0.5;
      var d = nn * th * Dm / 206265, cor = obj ? read - d : read + d;
      return ['水準管靈敏度 ' + th + '"/格，觀測距離 ' + Dm + ' m 的標尺時讀得 ' + f3(read) + ' m，事後發現氣泡偏向' + (obj ? '物鏡' : '目鏡') + ' ' + nn + ' 格，正確讀數約為何？', O(f3(cor) + ' m', [f3(obj ? read + d : read - d) + ' m', f3(read) + ' m', f3(obj ? read - d * 10 : read + d * 10) + ' m']),
        'Δ = ' + nn + ' × ' + th + '" × ' + Dm + ' ÷ 206265 = ' + D(d * 1000, 1) + ' mm。偏物鏡 → 視線上揚 → 讀數偏大 → 減；偏目鏡 → 讀數偏小 → 加。'];
    } },
    { t: '定樁法校正', g: function (R) {
      var a1 = R.int(1300, 1700) / 1000, h = R.int(-300, 300) / 1000, e = R.pick([1, 2, 3, -1, -2]) / 10000;
      var Da = R.pick([5, 6, 8]), Db = R.pick([45, 50, 55]);
      var a2 = R.int(1200, 1800) / 1000 + e * Da, b2 = a2 - e * Da + e * Db - h;
      var b1 = a1 - h;
      return ['定樁法：儀器在 A、B 中點讀得 a1 = ' + f3(a1) + '、b1 = ' + f3(b1) + '；移到 A 附近（距 A ' + Da + ' m、距 B ' + Db + ' m）讀得 a2 = ' + f3(a2) + '、b2 = ' + f3(b2) + '。視準軸每公尺誤差約為何？（視線偏上為正）', O(D(e * 1000, 1) + ' mm/m', [D(-e * 1000, 1) + ' mm/m', D(e * 10000, 0) + ' mm/m', D((b2 - (a2 - h)) * 1000, 1) + ' mm/m']),
        '正確高差 h = a1 − b1 = ' + f3(h) + '。第二站：(a2 − εDa) − (b2 − εDb) = h → ε(Db − Da) = h − a2 + b2 → ε = ' + D(e * 1000, 1) + ' mm/m。'];
    } }
  ]);

  addHard('surv', 5, [
    { t: '水準路線計算', g: function (R) {
      var BM = R.int(20000, 80000) / 1000, bs = [], fs = [], H0 = BM, rows = [];
      for (var i = 0; i < 3; i++) { bs.push(R.int(800, 2800) / 1000); fs.push(R.int(800, 2800) / 1000); H0 += bs[i] - fs[i]; }
      var sb = bs.reduce(function (a, b) { return a + b; }, 0), sf = fs.reduce(function (a, b) { return a + b; }, 0);
      for (i = 0; i < 3; i++) rows.push('第' + (i + 1) + '站 後視 ' + f3(bs[i]) + '、前視 ' + f3(fs[i]));
      return ['由 BM（高程 ' + f3(BM) + ' m）經兩個轉點測到 P 點：' + rows.join('；') + '。P 點高程為何？', O(f3(H0) + ' m', [f3(BM - sb + sf) + ' m', f3(BM + sb + sf) + ' m', f3(BM + bs[0] - fs[2]) + ' m']),
        'ΣBS = ' + f3(sb) + '、ΣFS = ' + f3(sf) + '，高程差 = ΣBS − ΣFS = ' + f3(sb - sf) + ' m，H_P = ' + f3(H0) + ' m。'];
    } },
    { t: '閉合差分配', g: function (R) {
      var HA = R.int(20000, 60000) / 1000, L = R.pick([4, 5, 6, 8]), d = R.int(1, L - 1), W = R.nz(-10, 10) * 2, Hp = HA + R.int(-3000, 3000) / 1000, cor = -W * d / L;
      return ['閉合水準路線總長 ' + L + ' km，閉合差 W = ' + n(W) + ' mm（依距離比例分配）。P 點距起點 ' + d + ' km，觀測高程 ' + f3(Hp) + ' m，改正後高程為何？', O(f3(Hp + cor / 1000) + ' m', [f3(Hp - cor / 1000) + ' m', f3(Hp - W / 1000) + ' m', f3(Hp) + ' m']),
        '改正數 = −W × ' + d + '/' + L + ' = ' + D(cor, 1) + ' mm；改正後 = ' + f3(Hp) + ' + (' + D(cor / 1000, 4) + ') = ' + f3(Hp + cor / 1000) + ' m。'];
    } },
    { t: '容許閉合差判斷', g: function (R) {
      var C = R.pick([5, 10, 20]), K = R.pick([4, 9, 16, 25]), allow = C * Math.sqrt(K), W = R.int(Math.max(1, allow - 8), allow + 8), ok = W <= allow;
      return ['某水準路線總長 ' + K + ' km，閉合差 ' + W + ' mm，規定容許閉合差 ' + C + '√K mm，下列何者正確？', O(ok ? '容許 ' + allow + ' mm，閉合差在容許範圍內，可平差' : '容許 ' + allow + ' mm，閉合差超過容許值，需重測', [ok ? '容許 ' + allow + ' mm，閉合差超過容許值，需重測' : '容許 ' + allow + ' mm，閉合差在容許範圍內，可平差', '容許 ' + C * K + ' mm，閉合差在容許範圍內', '容許 ' + C + ' mm，閉合差超過容許值']),
        '容許閉合差 = ' + C + ' × √' + K + ' = ' + allow + ' mm；閉合差 ' + W + ' mm ' + (ok ? '≤' : '>') + ' 容許值。'];
    } }
  ]);

  addHard('surv', 6, [
    { t: '方格土方進階', g: function (R) {
      var a = R.pick([5, 10, 20]), A = a * a, h = [];
      for (var i = 0; i < 9; i++) h.push(R.int(2, 8) / 2);
      // 2×2 方格：四角用 1 次，四邊中點用 2 次，中心用 4 次
      var s1 = h[0] + h[2] + h[6] + h[8], s2 = h[1] + h[3] + h[5] + h[7], s4 = h[4], V = A / 4 * (s1 + 2 * s2 + 4 * s4);
      return ['2 × 2 共四個 ' + a + ' m × ' + a + ' m 的方格，九個格點挖深（由上而下、由左而右）為：' + h.slice(0, 3).join('、') + '／' + h.slice(3, 6).join('、') + '／' + h.slice(6).join('、') + ' m，挖方體積為何？', O(D(V, 1) + ' m³', [D(A / 4 * (s1 + s2 + s4), 1) + ' m³', D(A / 4 * (s1 + 2 * s2 + 2 * s4), 1) + ' m³', D(A * (s1 + s2 + s4) / 9 * 4, 1) + ' m³']),
        'V = (A/4)(ΣH1 + 2ΣH2 + 4ΣH4)：四角 ΣH1 = ' + s1 + '，邊中點 ΣH2 = ' + s2 + '，中心 H4 = ' + s4 + ' → V = ' + A / 4 + ' × ' + (s1 + 2 * s2 + 4 * s4) + ' = ' + D(V, 1) + ' m³。', QF.grid3(h, a)];
    } },
    { t: '坐標法面積進階', g: function (R) {
      var P = [[0, 0], [R.int(4, 10) * 5, R.int(0, 2) * 5], [R.int(5, 12) * 5, R.int(4, 9) * 5], [R.int(0, 3) * 5, R.int(5, 10) * 5]];
      var s = 0; for (var i = 0; i < 4; i++) { var j = (i + 1) % 4; s += P[i][0] * P[j][1] - P[j][0] * P[i][1]; }
      var A = Math.abs(s) / 2;
      return ['依序連接 A' + H.pt(P[0][0], P[0][1]) + '、B' + H.pt(P[1][0], P[1][1]) + '、C' + H.pt(P[2][0], P[2][1]) + '、D' + H.pt(P[3][0], P[3][1]) + '（單位 m，(E, N)），四邊形面積約為多少坪？（1 m² = 0.3025 坪）', O(D(A * 0.3025, 1) + ' 坪', [D(A, 1) + ' 坪', D(Math.abs(s) * 0.3025, 1) + ' 坪', D(A / 0.3025, 1) + ' 坪']),
        '坐標法：2A = |Σ(Ei·Ni+1 − Ei+1·Ni)| = ' + Math.abs(s) + ' → A = ' + D(A, 1) + ' m² = ' + D(A * 0.3025, 1) + ' 坪。', QF.poly(P)];
    } },
    { t: '開挖放樣', g: function (R) {
      var BM = R.int(20000, 60000) / 1000, BS = R.int(1000, 2000) / 1000, dep = R.int(100, 300) / 100, ground = BM + R.int(-500, 500) / 1000, finish = ground - dep;
      var read = BM + BS - finish;
      return ['BM 高程 ' + f3(BM) + ' m，後視 ' + f3(BS) + ' m。某處地面高程 ' + f3(ground) + ' m，要開挖 ' + D(dep, 2) + ' m 深，開挖完成面上標尺應讀多少？', O(f3(read) + ' m', [f3(BM + BS - ground) + ' m', f3(read - 2 * dep) + ' m', f3(BS + dep) + ' m']),
        'HI = ' + f3(BM + BS) + '；完成面高程 = ' + f3(ground) + ' − ' + D(dep, 2) + ' = ' + f3(finish) + '；應讀數 = HI − 完成面高程 = ' + f3(read) + ' m（讀數比地面多 ' + D(dep, 2) + ' m）。'];
    } }
  ]);
})();

/* ===== v1.7 追加（只能接在後面） ===== */
(function () {
  var H = QH, n = H.n, O = H.opts, D = H.dec;
  function f3(x) { return (Math.round(x * 1000) / 1000).toFixed(3); }
  addHard('surv', 0, [
    { t: '地球曲率影響', g: function (R) {
      var S = R.int(2, 8), c = S * S * 1e5 / (2 * 6370);
      return ['水準測量時，若視線長 ' + S + ' km 且不考慮折光，地球曲率造成的讀數誤差約為多少？（R = 6370 km）', O(D(c, 1) + ' cm', [D(c / S, 1) + ' cm', D(c * 2, 1) + ' cm', D(c / 10, 2) + ' cm']),
        '曲率差 = S² ÷ (2R) = ' + S * S + ' ÷ 12740 km ≈ ' + D(c, 1) + ' cm；與距離平方成正比，前後視等距可以消除。'];
    } }
  ]);
  addHard('surv', 1, [
    { t: '加權平均高程', g: function (R) {
      var Ls = [R.int(1, 4), R.int(1, 4), R.int(1, 4)], base = R.int(20000, 60000) / 1000, Hs = Ls.map(function () { return base + R.int(-12, 12) / 1000; });
      var w = Ls.map(function (l) { return 1 / l; }), sw = w[0] + w[1] + w[2], Hp = (Hs[0] * w[0] + Hs[1] * w[1] + Hs[2] * w[2]) / sw;
      var mean = (Hs[0] + Hs[1] + Hs[2]) / 3;
      return ['由三條水準路線測 P 點高程：路線 1 長 ' + Ls[0] + ' km 得 ' + f3(Hs[0]) + ' m；路線 2 長 ' + Ls[1] + ' km 得 ' + f3(Hs[1]) + ' m；路線 3 長 ' + Ls[2] + ' km 得 ' + f3(Hs[2]) + ' m。P 點最或是高程約為何？', O(f3(Hp) + ' m', [f3(mean) === f3(Hp) ? f3(Hp + 0.002) + ' m' : f3(mean) + ' m', f3((Hs[0] * Ls[0] + Hs[1] * Ls[1] + Hs[2] * Ls[2]) / (Ls[0] + Ls[1] + Ls[2])) === f3(Hp) ? f3(Hp - 0.002) + ' m' : f3((Hs[0] * Ls[0] + Hs[1] * Ls[1] + Hs[2] * Ls[2]) / (Ls[0] + Ls[1] + Ls[2])) + ' m', f3(Math.max.apply(null, Hs)) + ' m']),
        '權與路線長成反比：P = 1/L。最或是值 = Σ(P·H) ÷ ΣP = ' + f3(Hp) + ' m。'];
    } },
    ['誤差綜合', '下列有關觀測誤差與精度的敘述，何者正確？', ['偶然誤差可以藉由增加觀測次數、取平均來減小', '系統誤差呈常態分布，正負機率相等', '錯誤（粗差）可用平差方法消除', '最或是值中誤差會隨觀測次數增加而變大'], '系統誤差有方向性；粗差要重測；M = m/√n，n 越大 M 越小。']
  ]);
  addHard('surv', 3, [
    { t: '相位法測距', g: function (R) {
      var lam = R.pick([10, 20, 40]), nn = R.int(5, 40), ph = R.pick([45, 90, 135, 180, 270]), Dm = (nn * lam + ph / 360 * lam) / 2;
      return ['相位式測距儀調制波長 λ = ' + lam + ' m，測得往返路徑包含 ' + nn + ' 個整波長，剩餘相位差 ' + ph + '°，測站到稜鏡的距離為何？', O(D(Dm, 2) + ' m', [D(Dm * 2, 2) + ' m', D(nn * lam / 2, 2) + ' m', D((nn * lam + ph / 360) / 2, 2) + ' m']),
        'D = (n·λ + (Δφ/360°)·λ) ÷ 2 = (' + nn + '×' + lam + ' + ' + ph + '/360×' + lam + ') ÷ 2 = ' + D(Dm, 2) + ' m（除以 2 是因為往返）。'];
    } }
  ]);
  addHard('surv', 5, [
    { t: '中間點高程', g: function (R) {
      var BM = R.int(20000, 60000) / 1000, BS = R.int(1000, 2500) / 1000, i1 = R.int(500, 3000) / 1000, i2 = R.int(500, 3000) / 1000, HI = BM + BS;
      return ['儀器架設一次：BM（' + f3(BM) + ' m）後視 ' + f3(BS) + ' m，中間點 1、2 的讀數分別為 ' + f3(i1) + '、' + f3(i2) + ' m，則兩點高程差（點 1 − 點 2）為何？', O(f3(i2 - i1) + ' m', [f3(i1 - i2) + ' m', f3(HI - i1) + ' m', f3(i1 + i2) + ' m']),
        'HI = ' + f3(HI) + '；H1 = HI − ' + f3(i1) + ' = ' + f3(HI - i1) + '、H2 = HI − ' + f3(i2) + ' = ' + f3(HI - i2) + '；H1 − H2 = ' + f3(i2 - i1) + ' m（讀數小的點比較高）。'];
    } },
    { t: '容許閉合差換算', g: function (R) {
      var pairs = [[4, 9], [9, 16], [16, 25], [4, 16], [9, 25], [1, 4], [4, 25]], p = R.pick(pairs), a1 = R.pick([6, 10, 12, 15, 20]);
      var a2 = a1 * Math.sqrt(p[1] / p[0]);
      return ['同一精度等級的水準測量，路線長 ' + p[0] + ' km 時容許閉合差為 ' + a1 + ' mm，則路線長 ' + p[1] + ' km 時容許閉合差為何？', O(D(a2, 1) + ' mm', [D(a1 * p[1] / p[0], 1) + ' mm', D(a1, 1) + ' mm', D(a1 * Math.sqrt(p[0] / p[1]), 1) + ' mm']),
        '容許閉合差 = C√K，與 √K 成正比：' + a1 + ' × √(' + p[1] + '/' + p[0] + ') = ' + D(a2, 1) + ' mm。'];
    } }
  ]);
  addHard('surv', 6, [
    { t: '坡度放樣', g: function (R) {
      var H0 = R.int(20000, 50000) / 1000, g = R.pick([-3, -2, -1.5, 1, 1.5, 2, 2.5]), x = R.pick([20, 40, 50, 60, 80, 100]), des = H0 + g / 100 * x, ground = des + R.int(-1500, 1500) / 1000;
      var cut = ground - des;
      return ['道路起點設計高程 ' + f3(H0) + ' m，設計坡度 ' + (g > 0 ? '+' : '') + g + '%。距起點 ' + x + ' m 的樁地面高程 ' + f3(ground) + ' m，該樁應挖或填多少？', O((cut >= 0 ? '挖 ' : '填 ') + f3(Math.abs(cut)) + ' m', [(cut >= 0 ? '填 ' : '挖 ') + f3(Math.abs(cut)) + ' m', (cut >= 0 ? '挖 ' : '填 ') + f3(Math.abs(ground - H0)) + ' m', (cut >= 0 ? '挖 ' : '填 ') + f3(Math.abs(ground - H0 + g / 100 * x)) + ' m']),
        '設計高 = ' + f3(H0) + ' + (' + g + '%) × ' + x + ' = ' + f3(des) + ' m；現地 − 設計 = ' + f3(cut) + '（正為挖、負為填）。'];
    } },
    { t: '面積單位換算', g: function (R) {
      var ha = R.int(2, 30) / 10;
      return [D(ha, 1) + ' 公頃約等於多少坪？又約為多少甲？（1 m² = 0.3025 坪，1 甲 ≈ 0.9699 公頃）', O(D(ha * 10000 * 0.3025, 0) + ' 坪，約 ' + D(ha / 0.9699, 2) + ' 甲', [D(ha * 1000 * 0.3025, 0) + ' 坪，約 ' + D(ha / 0.9699, 2) + ' 甲', D(ha * 10000 * 0.3025, 0) + ' 坪，約 ' + D(ha * 0.9699, 2) + ' 甲', D(ha * 10000 / 0.3025, 0) + ' 坪，約 ' + D(ha / 0.9699, 2) + ' 甲']),
        '1 公頃 = 10,000 m² = 3025 坪；甲數 = 公頃 ÷ 0.9699。'];
    } }
  ]);
})();

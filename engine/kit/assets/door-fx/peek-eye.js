// door-fx/peek-eye — aralıktan bakan göz: at anında aralık genişler, göz 0.3 sn'de açılır;
// boşta göz 3-5 sn'de bir 0.12 sn kırpır, bebek hafifçe gezinir.
// NOT: canvas y-aşağıdır; taban (0,0), yukarı NEGATİF y'dir.
export default {
  name: 'peek-eye',
  category: 'door-fx',
  desc: 'Aralıktan bakan göz: aralık genişleyip göz açılır, boşta kırpma ve bakış gezinmesi',
  tags: ['kapı', 'göz', 'bakmak', 'aralık', 'gizlenmek', 'merak', 'door', 'eye', 'peek', 'spy', 'blink'],
  box: [-150, -230, 150, 12],
  bleed: 40,
  anchor: 'taban (0,0): kapı kasasının alt merkezi',
  points: { eye: [56, -130], handle: [-60, -108] },
  params: {
    at: { type: 'time', default: null, desc: 'gözün belirme anı (aralık genişler, göz 0.3 sn\'de açılır)' },
    color: { type: 'color', default: 'dim', desc: 'kapı kanadı rengi' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55), inkC = k.rgba('ink');
    const dark = (name, f = 0.88) => {
      const c = k.col(name);
      return `rgb(${c.map(v => Math.max(0, Math.round(v * f))).join(',')})`;
    };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const shine = (x, y, rx, ry, rot = -0.4) => {
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, k.TAU); ctx.fill();
    };
    const d = p.at == null ? -1 : t - p.at;

    // ---- belirme: aralık 10→48 genişler, göz 0.3 sn'de açılır ----
    let rev = 0;
    if (d >= 0) rev = k.E.outExpo(k.prog(d, 0, 0.3));
    const gapW = 12 + rev * 52;
    const gx = 88 - gapW;                              // aralık sağda

    // ---- 1) kasa ----
    ctx.fillStyle = dark('panel2'); ctx.fillRect(-95, -213, 200, 220);
    ctx.fillStyle = k.rgba('panel2'); ctx.fillRect(-100, -220, 200, 220);
    ctx.strokeStyle = line; ctx.lineWidth = LW; ctx.strokeRect(-100, -220, 200, 220);

    // ---- 2) aralık (karanlık iç) ----
    ctx.fillStyle = k.rgba('bg'); ctx.fillRect(gx, -208, gapW, 208);
    ctx.fillStyle = k.rgba('ink', 0.3); ctx.fillRect(gx, -208, 3, 208); // iç kenar çizgisi

    // ---- 3) kanat (aralığın solu) ----
    ctx.fillStyle = dark(p.color); ctx.fillRect(-83, -201, gx + 88, 208);
    ctx.fillStyle = k.rgba(p.color); ctx.fillRect(-88, -208, gx + 88, 208);
    ctx.strokeStyle = line; ctx.lineWidth = LW; ctx.strokeRect(-88, -208, gx + 88, 208);
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.strokeRect(-66, -184, Math.max(gx - 22, 4), 76);
    ctx.strokeRect(-66, -96, Math.max(gx - 22, 4), 76);
    shine(-56, -192, 28, 13);
    // tokmak (kanatta)
    ctx.fillStyle = dark('panel2'); ctx.beginPath(); ctx.ellipse(-57, -104, 11, 11, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(-60, -108, 13, 13, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2'); ctx.beginPath(); ctx.ellipse(-60, -108, 10, 10, 0, 0, k.TAU); ctx.fill();

    // ---- 4) göz: belirme + kırpma + bakış ----
    if (rev > 0.01) {
      const blink = ((t + 1.3) % 4.2) < 0.12 ? 0.15 : 1;   // 3-5 sn'de bir 0.12 sn kırpma
      const ex = gx + gapW / 2, ey = -130;
      const rx = 24 * rev, ry = 18 * rev * blink;
      const look = k.noise1(t * 0.7) * 5 * rev;             // bakış gezinmesi
      ctx.fillStyle = dark('panel'); ctx.beginPath(); ctx.ellipse(ex + 2, ey + 3, rx, ry, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(ex, ey, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('panel'); ctx.beginPath(); ctx.ellipse(ex, ey, rx, ry, 0, 0, k.TAU); ctx.fill();
      if (ry > 3) {
        const ir = 9 * rev * blink;
        ctx.fillStyle = dark('accent'); ctx.beginPath(); ctx.arc(ex + look + 1, ey + 1, ir, 0, k.TAU); ctx.fill();
        ctx.fillStyle = k.rgba('accent'); ctx.beginPath(); ctx.arc(ex + look, ey, ir, 0, k.TAU); ctx.fill();
        ctx.fillStyle = inkC; ctx.beginPath(); ctx.arc(ex + look, ey, ir * 0.45, 0, k.TAU); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.beginPath(); ctx.arc(ex + look - ir * 0.3, ey - ir * 0.3, ir * 0.28, 0, k.TAU); ctx.fill();
      }
    }
  },
};

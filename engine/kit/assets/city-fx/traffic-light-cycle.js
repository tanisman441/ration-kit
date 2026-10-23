// city-fx/traffic-light-cycle — direkli trafik lambası; kırmızı→sarı→yeşil döngüsü.
// ANIMASYON: `cycle` (sn) süreli tam döngü — kırmızı → kırmızı+sarı → yeşil → sarı;
// aktif lamba parlama (glow) + hafif nabızla yanar. Idle'da direk sabit, lambalar döner.
// Tek vurgu: aktif lambanın kendi rengi. Contract: engine/kit/ASSETS.md
export default {
  name: 'traffic-light-cycle',
  category: 'city-fx',
  desc: 'Direkli trafik lambası; kırmızı→sarı→yeşil döngüsü LED parlamayla dönüyor',
  tags: ['trafik', 'lamba', 'sinyal', 'trafik lambası', 'trafik ışığı', 'kırmızı ışık', 'yeşil ışık', 'şehir', 'traffic', 'traffic light', 'stoplight', 'signal', 'city'],
  box: [-48, -152, 48, 152],
  bleed: 34,
  anchor: 'direk tabanı (0,152)',
  points: { top: [0, -146] },
  params: {
    cycle: { type: 'number', default: 4.5, desc: 'tam döngü süresi (sn): kırmızı→sarı→yeşil' },
    color: { type: 'color', default: 'ink' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const cyc = Math.max(p.cycle, 2);
    const ph = (((t % cyc) + cyc) % cyc) / cyc; // 0..1 döngü fazı
    // faz dilimleri: 0–.42 kırmızı | .42–.5 kırmızı+sarı | .5–.88 yeşil | .88–1 sarı
    const inPh = (a, b) => ph >= a && ph < b;
    const redOn = inPh(0, 0.42) || inPh(0.42, 0.5);
    const yelOn = inPh(0.42, 0.5) || inPh(0.88, 1);
    const grnOn = inPh(0.5, 0.88);
    const pulse = 0.8 + 0.2 * Math.sin(t * 3.2); // aktif lambada nabız

    const LW = 5;
    const body = k.rgba(p.color);
    const dark = k.rgba('bg', 0.88);
    const line = k.rgba('bg', 0.55);
    const plate = (x, y, w, h, r) => {
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); k.rrect(x + 6, y + 6, w, h, r); ctx.fill();
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = body;
      ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // --- direk + taban + bağlantı kolu ---
    plate(-9, 14, 18, 128, 8);
    plate(-30, 126, 60, 22, 9);
    plate(-7, -30, 14, 48, 6);

    // --- sinyal kafası ---
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-32 + 6, -142 + 6, 64, 118, 16); ctx.fill();
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-32 - LW / 2, -142 - LW / 2, 64 + LW, 118 + LW, 16 + LW / 2); ctx.fill();
    ctx.fillStyle = dark;
    ctx.beginPath(); k.rrect(-32, -142, 64, 118, 16); ctx.fill();

    // --- lambalar ---
    const lamps = [
      { y: -112, c: 'red', on: redOn },
      { y: -83, c: 'yellow', on: yelOn },
      { y: -54, c: 'green', on: grnOn },
    ];
    for (const L of lamps) {
      // vizör (siperlik)
      ctx.fillStyle = k.rgba('bg', 0.55);
      ctx.beginPath(); k.rrect(-22, L.y - 24, 44, 14, 7); ctx.fill();
      if (L.on) {
        k.glow(0, L.y, 30, L.c, 0.5 * pulse);
        ctx.fillStyle = k.rgba(L.c, 0.98);
        ctx.beginPath(); ctx.arc(0, L.y, 16, 0, k.TAU); ctx.fill();
        ctx.fillStyle = k.rgba('#ffffff', 0.35 * pulse);
        ctx.beginPath(); ctx.arc(-5, L.y - 6, 5.5, 0, k.TAU); ctx.fill();
      } else {
        ctx.fillStyle = k.rgba(L.c, 0.22);
        ctx.beginPath(); ctx.arc(0, L.y, 16, 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore();
  },
};

// school-fx-2/flag-raise — bayrak direği:
// raise 0..1 bayrağın direk üzerindeki yüksekliğini verir; at verilirse
// bayrak 1.4 snde otomatik çekilir. Bayrak kumaşı sürekli dalgalanır (idle).
// canvas y-aşağı; (0,0) direk tabanı.
export default {
  name: 'flag-raise', category: 'school-fx-2',
  desc: 'Bayrak direği: raise ile bayrak yükselir, kumaş sürekli dalgalanır',
  tags: ['bayrak', 'direk', 'gönder', 'flag', 'flagpole', 'raise', 'tören', 'okul', 'dalgalanma', 'istiklal'],
  box: [-60, -135, 168, 135],
  bleed: 16,
  anchor: 'direk tabanı',
  points: { top: [0, -114], base: [0, 110] },
  params: {
    at: { type: 'time', default: null, desc: 'bayrağı otomatik çek (0 → 1, 1.4 sn)' },
    raise: { type: 'number', default: 0.5, desc: 'bayrak yüksekliği: 0 = altta, 1 = tepede' },
    color: { type: 'color', default: 'red', desc: 'bayrak rengi' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.at == null ? -1 : t - p.at;
    const raising = p.at != null && d >= 0 && d < 1.4;
    const r = p.at == null ? k.clamp(p.raise ?? 0.5, 0, 1) : (d < 0 ? 0 : k.prog(d, 0, 1.4));

    const fy = k.lerp(-38, -104, r);   // bayrak üst kenarı
    const FH = 62, FW = 102, N = 8;
    const amp = 1 + (raising ? 0.45 : 0);
    const wob = i => Math.sin(t * 3.2 + i * 0.75 + r * 1.5) * (2 + i * 1.7) * amp;
    const top = i => [2 + (i * FW) / N, fy + wob(i)];
    const bot = i => [2 + (i * FW) / N, fy + FH + wob(i) * 1.25];

    // taban
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-20, 110, 52, 16, 6); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-32, 100, 52, 16, 6); ctx.fill();
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.beginPath(); k.rrect(-26, 104, 52, 16, 6); ctx.fill();

    // direk
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-8.5, -112, 17, 222, 8); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.beginPath(); k.rrect(-4.5, -108, 9, 218, 4); ctx.fill();
    // alem topu
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); ctx.arc(0, -114, 10, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 1);
    ctx.beginPath(); ctx.arc(0, -114, 7.5, 0, k.TAU); ctx.fill();

    // bayrak kumaşı (dalgalı)
    ctx.beginPath();
    let q = top(0); ctx.moveTo(q[0], q[1]);
    for (let i = 1; i <= N; i++) { q = top(i); ctx.lineTo(q[0], q[1]); }
    for (let i = N; i >= 0; i--) { q = bot(i); ctx.lineTo(q[0], q[1]); }
    ctx.closePath();
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.save(); ctx.translate(6, 7); ctx.fill(); ctx.restore();
    ctx.fillStyle = k.rgba(p.color, 1); ctx.fill();
    ctx.lineWidth = 5; ctx.strokeStyle = k.rgba('bg', 0.55); ctx.stroke();
    // premium parlama (sol üst, gönder dibi)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(20, fy + 13, 13, 7, -0.2, 0, k.TAU); ctx.fill();
    // kumaş kıvrım çizgileri
    ctx.strokeStyle = k.rgba('ink', 0.3); ctx.lineWidth = 3; ctx.lineCap = 'round';
    for (const i of [3, 6]) {
      const a0 = top(i), b0 = bot(i);
      ctx.beginPath();
      ctx.moveTo(a0[0], a0[1] + 6);
      ctx.quadraticCurveTo(a0[0] + 4, (a0[1] + b0[1]) / 2, b0[0], b0[1] - 6);
      ctx.stroke();
    }
    ctx.restore();
  },
};

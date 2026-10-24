// elevator-fx/button-press — asansör kat düğmesi; `at` anında basılır, halka yanar.
// ANIMASYON: `at` anında düğme 0.15 sn'de içeri gömülür, 0.5 sn'de geri çıkar; basılınca
// halka yeşil yanar ve genişleyen bir halka yayılır. Idle'da düğme ışığı yumuşak nabız.
// Tek vurgu: düğme ışığı (green). Contract: engine/kit/ASSETS.md
export default {
  name: 'button-press',
  category: 'elevator-fx',
  desc: 'Asansör kat düğmesi; at anında basılır, halka yeşil yanar ve yayılır',
  tags: ['asansör', 'düğme', 'kat', 'basma', 'panel', 'çağırma', 'elevator', 'button', 'press', 'floor', 'panel', 'call'],
  box: [-100, -140, 100, 140],
  bleed: 36,
  anchor: 'panel merkezi (0,0)',
  points: { button: [0, -18], top: [0, -140] },
  params: {
    at: { type: 'time', default: null, desc: 'düğmeye basılma anı (gömülme 0.15 sn, geri çıkış 0.5 sn)' },
    floor: { type: 'number', default: 5, desc: 'düğmedeki kat numarası (0-9)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.at == null ? -1 : t - p.at;
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const pressed = d >= 0;
    // basma: 0.15 sn gömül, 0.5 sn'de geri çık (0→1→0)
    const press = d < 0 ? 0
      : k.prog(d, 0, 0.15) - k.prog(d, 0.15, 0.65);
    // halka yayılımı
    const ring = d < 0 ? 0 : k.prog(d, 0.05, 0.8);
    const idle = 0.3 + 0.12 * Math.sin(t * 2.4);

    const plate = (x, y, w, h, r, c) => {
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); k.rrect(x + 6, y + 6, w, h, r); ctx.fill();
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c;
      ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // --- panel gövdesi ---
    plate(-72, -122, 144, 244, 18, k.rgba('dim'));
    // parlama (sol üst)
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(-44, -100, 18, 10, -0.3, 0, k.TAU); ctx.fill();

    // --- yukarı ok (üstte, ince) ---
    ctx.fillStyle = k.rgba('ink', 0.55);
    ctx.beginPath();
    ctx.moveTo(0, -104); ctx.lineTo(12, -88); ctx.lineTo(5, -88);
    ctx.lineTo(5, -80); ctx.lineTo(-5, -80); ctx.lineTo(-5, -88); ctx.lineTo(-12, -88);
    ctx.closePath(); ctx.fill();

    // --- düğme halkası (basılınca yeşil) ---
    const glowA = pressed ? 0.9 : idle;
    if (pressed) k.glow(0, -18, 40, 'green', 0.5 * Math.max(0.35, 1 - d / 0.8));
    ctx.fillStyle = k.rgba('green', pressed ? 0.85 : 0.18);
    ctx.beginPath(); ctx.arc(0, -18, 42, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.85);
    ctx.beginPath(); ctx.arc(0, -18, 36, 0, k.TAU); ctx.fill();

    // --- düğme (gömülür) ---
    const sink = press * 7;
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, -18 + sink, 32, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.arc(0, -18 + sink, 27, 0, k.TAU); ctx.fill();
    // düğme parlama (sol üst)
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(-10, -28 + sink, 10, 6, -0.4, 0, k.TAU); ctx.fill();
    // kat numarası
    const n = Math.round(k.clamp(p.floor ?? 5, 0, 9));
    ctx.fillStyle = k.rgba('ink', 0.85);
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String(n), 0, -16 + sink);

    // --- genişleyen halka ---
    if (ring > 0 && ring < 1) {
      ctx.strokeStyle = k.rgba('green', 0.65 * (1 - ring));
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(0, -18, 44 + ring * 36, 0, k.TAU); ctx.stroke();
    }

    // --- alt küçük ışık (durum) ---
    ctx.fillStyle = k.rgba('green', pressed ? 0.9 : idle);
    ctx.beginPath(); ctx.arc(0, 78, 8, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 78, 11, 0, k.TAU); ctx.stroke();
    // alt etiket çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-30, 104); ctx.lineTo(30, 104); ctx.stroke();
    ctx.restore();
  },
};

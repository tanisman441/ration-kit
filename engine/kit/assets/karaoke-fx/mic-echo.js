// karaoke-fx/mic-echo — el mikrofonu; at anında yankı halkaları yayılır (0.2–1.5 sn).
// Contract: engine/kit/ASSETS.md — NOT: canvas y-aşağıdır; (0,0) mikrofon merkezidir.
export default {
  name: 'mic-echo', category: 'karaoke-fx',
  desc: 'El mikrofonu; at anında başından genişleyen yankı halkaları yayılır, boşta hafif sallanır',
  tags: ['mikrofon', 'yankı', 'echo', 'karaoke', 'şarkı', 'ses', 'halka', 'microphone', 'singing', 'sound', 'ring'],
  box: [-150, -150, 150, 150],
  bleed: 60,
  anchor: 'mikrofon merkezi (0,0); baş yukarıda',
  points: { head: [0, -72], base: [0, 112] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'mikrofon gövde rengi' },
    accent: { type: 'color', default: 'accent', desc: 'yankı halkalarının rengi' },
    at: { type: 'time', default: null, desc: 'yankı anı: halkalar 0.2–1.5 sn içinde yayılıp söner' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const d = p.at == null ? -1 : t - p.at;
    const line = k.rgba('bg', 0.55);
    const inkC = k.rgba('ink', 0.8);
    const body = k.rgba(p.color);
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.8))).join(',')})`;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // boşta hafif sallanma
    const sway = Math.sin(t * 1.4) * 0.06;
    const bob = Math.sin(t * 1.4) * 3;
    ctx.translate(0, bob);
    ctx.rotate(sway);

    // yankı halkaları: at anında 3 halka, kademeli başlar, genişleyip solar
    if (d >= 0 && d < 1.6) {
      for (let i = 0; i < 3; i++) {
        const start = i * 0.28;
        const dd = d - start;
        if (dd < 0) continue;
        const pr = k.clamp(dd / 1.2, 0, 1);
        const r = 52 + pr * 80;
        const a = (1 - pr) * 0.85;
        ctx.strokeStyle = k.rgba(p.accent, a);
        ctx.lineWidth = 7 * (1 - pr * 0.6);
        ctx.beginPath(); ctx.arc(0, -72, r, 0, k.TAU); ctx.stroke();
      }
      // baş parlaması: ilk 0.25 sn
      if (d < 0.25) {
        const f = 1 - d / 0.25;
        k.glow(0, -72, 90 * f, p.accent, 0.5 * f);
      }
    } else {
      // boşta başın hafif nabzı
      const pulse = 0.22 + 0.1 * Math.sin(t * 2.2);
      k.glow(0, -72, 70, p.accent, pulse);
    }

    // sap (rrect)
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-26 - LW / 2, -30 - LW / 2, 52 + LW, 142 + LW, 16); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); k.rrect(-26, -30, 52, 142, 16); ctx.fill();
    // sağ alt gölge: %12 koyultma
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(2, 30, 22, 80, 11); ctx.fill();
    // premium parlama: sol üst, alfa 0.10
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); k.rrect(-19, -22, 9, 110, 4); ctx.fill();
    // sap halkası (anahtar/düğme)
    ctx.fillStyle = dark;
    ctx.beginPath(); k.rrect(-26, 62, 52, 10, 5); ctx.fill();

    // mikrofon başı: daire + ızgara çizgileri
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, -72, 52 + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.arc(0, -72, 52, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-18, -90, 17, 12, -0.5, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = inkC;
    ctx.lineWidth = 3.5;
    for (let i = -2; i <= 2; i++) {
      const y = -72 + i * 16;
      const half = Math.sqrt(Math.max(0, 52 * 52 - (y + 72) * (y + 72))) * 0.82;
      ctx.beginPath(); ctx.moveTo(-half, y); ctx.lineTo(half, y); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(0, -124); ctx.lineTo(0, -20); ctx.stroke();
    ctx.restore();
  },
};

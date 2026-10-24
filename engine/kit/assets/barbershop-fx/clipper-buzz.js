// barbershop-fx/clipper-buzz — dik duran tıraş makinesi, sürekli titreşir; `at` anında güçlü bir tıraş darbesi yapar. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) makine gövdesinin merkezi.
export default {
  name: 'clipper-buzz', category: 'barbershop-fx',
  desc: 'Dik duran tıraş makinesi; sürekli hafif titreşir, tıraş anında güçlenip saç kırıntıları saçar',
  tags: ['tıraş makinesi', 'berber', 'titreşim', 'saç kesimi', 'clipper', 'trimmer', 'buzz', 'barber', 'haircut', 'shaver'],
  box: [-130, -110, 130, 110],
  bleed: 40,
  anchor: 'makine gövdesinin merkezi (0,0); boy ~190 birim',
  points: { blade: [-32, -86], grip: [0, 0], cord: [4, 100] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'tıraş darbesi anı — titreşim güçlenir, saç kırıntıları uçar (0.8 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const burst = d >= 0 && d < 0.8;
    const env = burst ? Math.sin(Math.min(d / 0.8, 1) * Math.PI) : 0;
    // titreşim: hızlı, küçük; darbe anında 3 kat güçlü
    const amp = 1.6 + env * 3.2;
    const vx = k.noise1(t * 28) * amp;
    const vy = k.noise1(t * 28 + 11) * amp * 0.6;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // kablo: gövdeden aşağı sarkar (serbest çizgi = ink)
    ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(6, 62); ctx.quadraticCurveTo(-14, 84, 4, 102); ctx.stroke();

    ctx.save();
    ctx.translate(vx, vy);
    ctx.rotate(-0.35);

    // gövde
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); k.rrect(-28, -58, 68, 124, 22); ctx.fill();
    blob(-34, -64, 68, 124, 20, body);
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-18, -40, 10, 22, 0.15, 0, k.TAU); ctx.fill();

    // güç düğmesi
    blob(-8, -18, 16, 30, 8, k.rgba('panel2'));
    ctx.fillStyle = k.rgba('green', 0.9 + env * 0.1);
    ctx.beginPath(); ctx.ellipse(0, -3, 4, 4, 0, 0, k.TAU); ctx.fill();

    // metal bıçak başlığı
    blob(-38, -96, 76, 36, 8, k.rgba('panel2'));
    // bıçak dişleri
    ctx.fillStyle = line;
    for (let i = 0; i < 7; i++) {
      const x = -32 + i * 10;
      ctx.beginPath(); k.rrect(x - 2.5, -102, 7, 10, 2); ctx.fill();
    }
    ctx.fillStyle = k.rgba('ink');
    for (let i = 0; i < 7; i++) {
      const x = -32 + i * 10;
      ctx.beginPath(); k.rrect(x - 2, -101, 5, 8, 1.5); ctx.fill();
    }
    // bıçak ayrım çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-34, -62); ctx.lineTo(34, -62); ctx.stroke();

    // tıraş çizgileri (buzz): bıçak ucunda yanıp söner
    const buzzA = 0.35 + 0.4 * Math.abs(Math.sin(t * k.TAU * 6)) + env * 0.4;
    ctx.strokeStyle = k.rgba('yellow', Math.min(buzzA, 1)); ctx.lineWidth = 4;
    for (const [bx, by, len] of [[-30, -112, 12], [0, -116, 16], [30, -112, 12]]) {
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by - len); ctx.stroke();
    }
    ctx.restore();

    // saç kırıntıları (darbe anı, 0.8 sn)
    if (burst) {
      for (let i = 0; i < 10; i++) {
        const prog = k.clamp((d - k.hash(i) * 0.2) / 0.5, 0, 1);
        if (prog <= 0) continue;
        const dx = -32 + k.hash(i + 20) * 64 + (k.hash(i + 40) - 0.5) * 50 * prog;
        const dy = -100 - prog * 55 + prog * prog * 40;
        ctx.strokeStyle = k.rgba('ink', 0.85 * (1 - prog * 0.6)); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(dx, dy); ctx.lineTo(dx + 6, dy + 5); ctx.stroke();
      }
    }
  },
};

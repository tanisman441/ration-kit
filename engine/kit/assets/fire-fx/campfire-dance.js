// fire-fx/campfire-dance — kamp ateşi: odunların üstünde titreyen üç katman alev, yükselen kıvılcımlar.
// NOT: canvas y-aşağıdır; (0,0) ateşin tabanı (odunların merkezi)dir.
export default {
  name: 'campfire-dance',
  category: 'fire-fx',
  desc: 'Kamp ateşi: odunların üstünde titreyen alevler, kor nabzı ve yükselen kıvılcımlar',
  tags: ['kamp', 'ateş', 'kamp ateşi', 'alev', 'odun', 'kıvılcım', 'campfire', 'fire', 'flame', 'bonfire'],
  box: [-130, -180, 130, 50],
  bleed: 45,
  anchor: 'ateş tabanı (0,0)',
  points: { base: [0, 0], top: [0, -150] },
  params: {
    burn: { type: 'number', default: 0.8, desc: '0–1: yanma şiddeti (alev boyu + kıvılcım)' },
    color: { type: 'color', default: 'red', desc: 'dış alev tonu' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: ateş büyüklüğü' },
  },
  draw(ctx, t, p, k) {
    const B = k.clamp(p.burn, 0, 1);
    const S = k.clamp(p.size, 0.5, 1.5);
    ctx.save();

    // --- odunlar: üç çapraz kütük (rrect) ---
    const logW = 150 * S, logH = 26 * S;
    const logs = [[0.35, 0], [-0.35, 1], [0, 2]];
    for (let i = 0; i < 3; i++) {
      const [tilt, seed] = logs[i];
      const ly = (14 + seed * 4) * S;
      ctx.fillStyle = k.rgba('dim', 0.12);
      ctx.beginPath(); k.rrect(-logW / 2 + 6, ly - logH / 2 + 7, logW, logH, 12 * S); ctx.fill(); // sağ alt gölge
      ctx.save();
      ctx.translate(0, ly); ctx.rotate(tilt * 0.5);
      ctx.fillStyle = k.rgba('dim', 1);
      ctx.beginPath(); k.rrect(-logW / 2, -logH / 2, logW, logH, 12 * S); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5 * S;
      ctx.beginPath(); k.rrect(-logW / 2, -logH / 2, logW, logH, 12 * S); ctx.stroke();
      // sol üst parlama (premium finish, alfa 0.10)
      ctx.fillStyle = k.rgba('bg', 0.10);
      ctx.beginPath(); ctx.ellipse(-logW * 0.22, -logH * 0.22, logW * 0.24, logH * 0.24, -0.4, 0, k.TAU); ctx.fill();
      // yıllık halka detayları
      ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 2.4 * S;
      for (let rI = 0; rI < 3; rI++) {
        const rx = -logW / 2 + 18 + rI * 16 * S;
        ctx.beginPath(); ctx.arc(rx, 0, 7 * S, 0.6, k.TAU - 0.6); ctx.stroke();
      }
      ctx.restore();
    }

    // --- kor nabzı: odun aralarında parlayan közler ---
    const pulse = 0.5 + 0.5 * Math.sin(t * 4.2);
    k.glow(0, -6 * S, 60 * S * B + 20, k.col('red'), 0.3 * B * (0.6 + 0.4 * pulse));
    for (let i = 0; i < 5; i++) {
      const hx = k.hash(i * 41 + 6);
      ctx.fillStyle = k.rgba('red', 0.6 * B * (0.5 + 0.5 * k.hash(i * 3 + Math.floor(t * 4.2) % 7)));
      ctx.beginPath(); ctx.arc((hx - 0.5) * 90 * S, -4 * S, 6 * S * B + 2, 0, k.TAU); ctx.fill();
    }

    // --- üç katman alev: her biri farklı hızda dans eder ---
    const layers = [
      { col: 'red', w: 62, h: 120, sp: 7, sd: 0, a: 0.92 },
      { col: 'red', w: 46, h: 96, sp: 9, sd: 40, a: 0.95 },
      { col: 'yellow', w: 30, h: 68, sp: 12, sd: 80, a: 0.98 },
    ];
    for (let l = 0; l < 3; l++) {
      const L = layers[l];
      const flick = 1 + 0.16 * k.noise1(t * L.sp + L.sd);
      const fh = L.h * S * (0.35 + 0.65 * B) * flick;
      const fw = L.w * S * (0.5 + 0.5 * B);
      const lean = k.noise1(t * 3 + L.sd + 200) * 22 * S; // yana dalgalanma
      ctx.fillStyle = k.rgba(L.col, L.a * (0.4 + 0.6 * B));
      ctx.beginPath();
      ctx.moveTo(-fw / 2, 0);
      ctx.bezierCurveTo(-fw / 2 - 10 * S, -fh * 0.4, -fw * 0.2 + lean * 0.4, -fh * 0.7, lean, -fh);
      ctx.bezierCurveTo(fw * 0.2 + lean * 0.6, -fh * 0.65, fw / 2 + 8 * S, -fh * 0.35, fw / 2, 0);
      ctx.closePath(); ctx.fill();
      // sol üst parlama (premium finish, alfa 0.10)
      ctx.fillStyle = k.rgba('bg', 0.10 * B);
      ctx.beginPath(); ctx.ellipse(-fw * 0.22, -fh * 0.35, fw * 0.2, fh * 0.14, -0.5, 0, k.TAU); ctx.fill();
    }
    // sağ alt gölge: alevin karanlık yüzü
    ctx.fillStyle = k.rgba('red', 0.12 * B);
    ctx.beginPath(); ctx.ellipse(30 * S * B, -46 * S * B, 22 * S * B, 44 * S * B, 0.45, 0, k.TAU); ctx.fill();

    // --- yükselen kıvılcımlar: döngülü, hızlı titrer ---
    const N = Math.round(6 * B);
    for (let i = 0; i < N; i++) {
      const cyc = 1.6 + k.hash(i * 61 + 3) * 1.2;
      const ph = ((t / cyc) + k.hash(i * 71 + 9)) % 1;
      const x = k.noise1(t * 6 + i * 23) * 36 * S * ph;
      const y = -ph * (120 + 60 * k.hash(i * 83 + 5)) * S;
      ctx.fillStyle = k.rgba(k.hash(i * 97 + 1) > 0.5 ? 'yellow' : 'red', 0.85 * (1 - ph));
      ctx.beginPath(); ctx.arc(x, y, 3.2 * S * (1 - ph) + 1, 0, k.TAU); ctx.fill();
    }

    ctx.restore();
  },
};

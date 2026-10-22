// camping-fx/campfire-sparks — taş halkalı kamp ateşi: titreyen alevler, kor nabzı ve sürekli yükselen kıvılcımlar.
// NOT: canvas y-aşağıdır; (0,0) ateşin tabanı (taş halkanın merkezi)dir.
export default {
  name: 'campfire-sparks',
  category: 'camping-fx',
  desc: 'Kamp ateşi: taş halka içinde titreyen alevler, kor nabzı ve sürekli yükselen kıvılcımlar',
  tags: ['kamp', 'ateş', 'kamp ateşi', 'alev', 'kıvılcım', 'odun', 'taş halka', 'campfire', 'fire', 'flame', 'sparks', 'bonfire'],
  box: [-125, -215, 125, 48],
  bleed: 45,
  anchor: 'ateş tabanı (0,0)',
  points: { base: [0, 0], top: [0, -185] },
  params: {
    color: { type: 'color', default: 'red', desc: 'dış alev tonu' },
    intensity: { type: 'number', default: 0.75, desc: '0–1: alev boyu ve kıvılcım yoğunluğu' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: ateş büyüklüğü' },
  },
  draw(ctx, t, p, k) {
    const S = k.clamp(p.size, 0.5, 1.5);
    const I = k.clamp(p.intensity, 0, 1);
    const fc = p.color;
    ctx.save();

    // --- taş halka: ön yay boyunca 7 taş ---
    for (let i = 0; i < 7; i++) {
      const a = Math.PI * (0.14 + 0.72 * (i / 6));
      const sx = 102 * S * Math.cos(a), sy = 14 * S + 26 * S * Math.sin(a);
      const sr = (12 + 5 * k.hash(i * 13 + 2)) * S;
      ctx.fillStyle = k.rgba('dim', 0.12);
      ctx.beginPath(); ctx.ellipse(sx + 4 * S, sy + 5 * S, sr, sr * 0.8, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('panel2', 1);
      ctx.beginPath(); ctx.ellipse(sx, sy, sr, sr * 0.8, 0, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4 * S;
      ctx.beginPath(); ctx.ellipse(sx, sy, sr, sr * 0.8, 0, 0, k.TAU); ctx.stroke();
      ctx.fillStyle = k.rgba('bg', 0.10);
      ctx.beginPath(); ctx.ellipse(sx - sr * 0.3, sy - sr * 0.32, sr * 0.42, sr * 0.3, -0.5, 0, k.TAU); ctx.fill();
    }

    // --- çapraz odunlar ---
    const logW = 128 * S, logH = 22 * S;
    for (let li = 0; li < 2; li++) {
      const tilt = li === 0 ? 0.30 : -0.30;
      const ly = (6 + li * 9) * S;
      ctx.fillStyle = k.rgba('dim', 0.12);
      ctx.beginPath(); k.rrect(-logW / 2 + 6 * S, ly - logH / 2 + 7 * S, logW, logH, 10 * S); ctx.fill();
      ctx.save();
      ctx.translate(0, ly); ctx.rotate(tilt);
      ctx.fillStyle = k.rgba('dim', 1);
      ctx.beginPath(); k.rrect(-logW / 2, -logH / 2, logW, logH, 10 * S); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4.5 * S;
      ctx.beginPath(); k.rrect(-logW / 2, -logH / 2, logW, logH, 10 * S); ctx.stroke();
      ctx.fillStyle = k.rgba('bg', 0.10);
      ctx.beginPath(); ctx.ellipse(-logW * 0.22, -logH * 0.22, logW * 0.24, logH * 0.24, -0.4, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 2.2 * S;
      for (let ri = 0; ri < 2; ri++) {
        ctx.beginPath(); ctx.arc(-logW / 2 + (22 + ri * 20) * S, 0, 6 * S, 0.6, k.TAU - 0.6); ctx.stroke();
      }
      ctx.restore();
    }

    // --- kor nabzı: odun aralarında parlayan közler ---
    const pulse = 0.5 + 0.5 * Math.sin(t * 4.4);
    k.glow(0, -50 * S, 85 * S, k.col(fc), 0.22 * (0.6 + 0.4 * pulse) * (0.3 + 0.7 * I));
    for (let i = 0; i < 5; i++) {
      const ex = (k.hash(i * 41 + 6) - 0.5) * 80 * S;
      ctx.fillStyle = k.rgba(fc, (0.45 + 0.35 * pulse * k.hash(i * 5 + 1)) * I);
      ctx.beginPath(); ctx.arc(ex, 2 * S, (4 + 3 * k.hash(i * 17)) * S, 0, k.TAU); ctx.fill();
    }

    // --- üç katman alev: farklı hızlarda titrer ---
    const layers = [
      { col: fc, w: 74, h: 132, sp: 6.5, sd: 0, a: 0.90 },
      { col: fc, w: 56, h: 106, sp: 8.5, sd: 40, a: 0.93 },
      { col: 'yellow', w: 34, h: 72, sp: 11, sd: 80, a: 0.97 },
    ];
    for (let l = 0; l < 3; l++) {
      const L = layers[l];
      const flick = 1 + 0.16 * k.noise1(t * L.sp + L.sd);
      const fh = L.h * S * (0.35 + 0.65 * I) * flick;
      const fw = L.w * S * (0.5 + 0.5 * I);
      const lean = k.noise1(t * 3 + L.sd + 200) * 20 * S;
      ctx.fillStyle = k.rgba(L.col, L.a * (0.35 + 0.65 * I));
      ctx.beginPath();
      ctx.moveTo(-fw / 2, 0);
      ctx.bezierCurveTo(-fw / 2 - 10 * S, -fh * 0.4, -fw * 0.2 + lean * 0.4, -fh * 0.7, lean, -fh);
      ctx.bezierCurveTo(fw * 0.2 + lean * 0.6, -fh * 0.65, fw / 2 + 8 * S, -fh * 0.35, fw / 2, 0);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = k.rgba('bg', 0.10 * I);
      ctx.beginPath(); ctx.ellipse(-fw * 0.22, -fh * 0.35, fw * 0.2, fh * 0.14, -0.5, 0, k.TAU); ctx.fill();
    }
    ctx.fillStyle = k.rgba(fc, 0.12 * I);
    ctx.beginPath(); ctx.ellipse(32 * S * I, -48 * S * I, 20 * S, 44 * S * I, 0.45, 0, k.TAU); ctx.fill();

    // --- yükselen kıvılcımlar: döngülü, yana savrulur ---
    const N = Math.round(6 + 6 * I);
    for (let i = 0; i < N; i++) {
      const cyc = 1.5 + k.hash(i * 61 + 3) * 1.5;
      const ph = ((t / cyc) + k.hash(i * 71 + 9)) % 1;
      const x = k.noise1(t * 5 + i * 31) * 44 * S * ph;
      const y = -(10 + ph * (150 + 70 * k.hash(i * 83 + 5))) * S;
      const sc = k.hash(i * 97 + 1) > 0.45 ? 'yellow' : fc;
      ctx.fillStyle = k.rgba(sc, 0.9 * (1 - ph) * (0.3 + 0.7 * I));
      ctx.beginPath(); ctx.arc(x, y, (3.4 * (1 - ph) + 1.2) * S, 0, k.TAU); ctx.fill();
    }

    // --- ince duman şeritleri ---
    for (let i = 0; i < 2; i++) {
      const ph = ((t / 3.4) + k.hash(i * 7 + 60)) % 1;
      const x = k.noise1(t * 1.6 + i * 77) * 34 * S;
      const y = -(110 + ph * 120) * S;
      ctx.fillStyle = k.rgba('dim', 0.16 * (1 - ph) * (0.4 + 0.6 * I));
      ctx.beginPath(); ctx.arc(x, y, (9 + ph * 20) * S, 0, k.TAU); ctx.fill();
    }

    ctx.restore();
  },
};

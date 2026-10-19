// nature-fx/waterfall — uçurumdan dökülen şelale; akan su çizgileri döngüsel, tabanda köpük.
// NOT: canvas y-aşağıdır; su yukarıdan (+y yönüne) aşağı akar.
export default {
  name: 'waterfall',
  category: 'nature-fx',
  desc: 'Uçurumdan dökülen şelale; döngüsel akan su çizgileri ve tabanda kabaran köpük',
  tags: ['şelale', 'su', 'akıntı', 'uçurum', 'köpük', 'waterfall', 'cascade', 'water', 'foam', 'falls'],
  box: [-150, -150, 150, 180],
  bleed: 26,
  anchor: 'kaya kenarı (0,-95); su y=150 civarında köpürür',
  points: { top: [0, -120], bottom: [0, 165] },
  params: {
    color: { type: 'color', default: 'dim' },
    water: { type: 'color', default: 'cyan' },
    flow: { type: 'number', default: 0.8, desc: 'akış şiddeti 0–1: çizgi yoğunluğu ve hız' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const flow = k.clamp(p.flow, 0, 1);
    if (flow <= 0.01) return;

    // kaya kenarı: önce gölge (sağ alta 5 birim ofset, %12 koyu), sonra gövde
    ctx.fillStyle = line;
    k.rrect(-142 + 5, -148 + 6, 284, 62, 18); ctx.fill();
    ctx.fillStyle = darker(p.color);
    k.rrect(-142 + 5, -148 + 6, 284, 62, 18); ctx.fill();
    ctx.fillStyle = line;
    k.rrect(-142, -148, 284, 62, 18); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    k.rrect(-142, -148, 284, 62, 18); ctx.fill();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-70, -128, 72, 12, -0.25, 0, k.TAU); ctx.fill();

    // su perdesi: x=-52..52, y=-92..132 (döngüsel düşen çizgiler)
    const topY = -92, botY = 132, fallH = botY - topY;
    ctx.fillStyle = k.rgba(p.water, 0.16 * flow);
    ctx.beginPath();
    ctx.moveTo(-52, topY);
    ctx.lineTo(52, topY);
    ctx.lineTo(52, botY - 8);
    ctx.quadraticCurveTo(0, botY + 14, -52, botY - 8);
    ctx.closePath(); ctx.fill();
    // perde sol üst parlaması
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-34, topY + 46, 12, 40, 0.1, 0, k.TAU); ctx.fill();
    const NW = 16;
    for (let i = 0; i < NW; i++) {
      if (k.hash(i * 13.7 + 1) > flow) continue;
      const x0 = -52 + k.hash(i * 3.1 + 1) * 104;
      const speed = (150 + k.hash(i * 7.7 + 1) * 130) * (0.6 + flow * 0.4);
      const yy = topY + ((t * speed + k.hash(i * 9.3 + 1) * fallH) % fallH);
      const wob = k.noise1(t * 2.2 + i * 5.1) * 4;
      ctx.strokeStyle = k.rgba(p.water, 0.35 + 0.5 * flow);
      ctx.lineWidth = 5 + k.hash(i * 11.3 + 1) * 4;
      ctx.beginPath();
      ctx.moveTo(x0 + wob, yy);
      ctx.lineTo(x0 + wob + k.noise1(t * 2.2 + i * 5.1 + 3) * 3, yy + 30);
      ctx.stroke();
    }

    // taban köpüğü: dalgalanan köpük şeridi
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(-78, botY + 8);
    for (let x = -78; x <= 78; x += 12) {
      const y = botY + 8 + Math.sin(x * 0.14 + t * 4.2) * 7 + k.noise1(t * 3 + x * 0.05) * 5;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(78, botY + 34); ctx.lineTo(-78, botY + 34); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba(p.water, 0.85);
    ctx.beginPath();
    ctx.moveTo(-72, botY + 10);
    for (let x = -72; x <= 72; x += 12) {
      const y = botY + 10 + Math.sin(x * 0.14 + t * 4.2) * 7 + k.noise1(t * 3 + x * 0.05) * 5;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(72, botY + 32); ctx.lineTo(-72, botY + 32); ctx.closePath(); ctx.fill();
    // köpük baloncukları: döngüsel yükselen, sönümlenen
    const NB = 9;
    for (let i = 0; i < NB; i++) {
      if (k.hash(i * 4.4 + 7) > flow) continue;
      const cyc = 1.6;
      const ph = ((t * (0.8 + k.hash(i * 2.2 + 7) * 0.5) + k.hash(i * 6.6 + 7) * cyc) % cyc) / cyc;
      const bx = (k.hash(i * 8.8 + 7) - 0.5) * 130 + k.noise1(t * 2 + i * 3) * 6;
      const by = botY + 26 - ph * 46;
      ctx.fillStyle = k.rgba(p.water, 0.7 * (1 - ph));
      ctx.beginPath(); ctx.arc(bx, by, 2 + (1 - ph) * 4.5, 0, k.TAU); ctx.fill();
    }
    // köpük parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-44, botY + 16, 26, 8, -0.2, 0, k.TAU); ctx.fill();
  },
};

// liquid-fx/pour-stream — ağızdan dökülen döngüsel sıvı akışı; tabanda köpürür.
// NOT: canvas y-aşağıdır; su yukarıdan (+y yönüne) aşağı akar.
export default {
  name: 'pour-stream',
  category: 'liquid-fx',
  desc: 'Üstten dökülen, döngüsel akan sıvı sütunu; altta yüzeyde köpürme',
  tags: ['dökme', 'akış', 'su akışı', 'sıvı', 'şelale mini', 'pour', 'stream', 'flowing water', 'liquid flow', 'waterfall'],
  box: [-80, -20, 80, 190],
  bleed: 26,
  anchor: 'akış kaynağı (0,-10); su y=160 civarında yüzeye çarpar',
  points: { source: [0, -10], surface: [0, 168] },
  params: {
    flow: { type: 'number', default: 0.8, desc: 'akış şiddeti 0–1: kalınlık, hız, köpük' },
    color: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const flow = k.clamp(p.flow, 0, 1);
    if (flow <= 0.02) return;
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };
    const topY = 0, botY = 158, fallH = botY - topY;

    // döküm ağzı (küçük oluk)
    ctx.fillStyle = line;
    k.rrect(-40 + 5, -20 + 5, 80, 26, 12); ctx.fill();
    ctx.fillStyle = darker('dim');
    k.rrect(-40 + 5, -20 + 5, 80, 26, 12); ctx.fill();
    ctx.fillStyle = line;
    k.rrect(-40, -20, 80, 26, 12); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    k.rrect(-40, -20, 80, 26, 12); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-16, -11, 20, 5, -0.2, 0, k.TAU); ctx.fill();

    // akış sütunu: kıpırdayan kenarlı dikey şerit
    const w = 9 + 20 * flow;
    const column = (half, style) => {
      ctx.fillStyle = style;
      ctx.beginPath();
      for (let y = topY; y <= botY; y += 8) {
        const x = -half + k.noise1(y * 0.05 + t * 5.2) * 3;
        if (y === topY) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      for (let y = botY; y >= topY; y -= 8) {
        const x = half + k.noise1(y * 0.05 + 7 + t * 5.2) * 3;
        ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.fill();
    };
    column(w + 6, line);
    column(w, k.rgba(p.color, 0.55 + 0.25 * flow));
    // sol üst parlama şeridi
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-w * 0.3, 76, w * 0.14, 58, 0.12, 0, k.TAU); ctx.fill();

    // düşen çizgiler: döngüsel
    const N = Math.round(7 + 11 * flow);
    const speed = 240 + 220 * flow;
    for (let i = 0; i < N; i++) {
      if (k.hash(i * 13.7 + 1) > flow + 0.08) continue;
      const x0 = (k.hash(i * 3.1 + 1) - 0.5) * 2 * w * 0.7;
      const yy = topY + ((t * speed + k.hash(i * 9.3 + 1) * fallH) % fallH);
      const fade = 1 - k.prog(yy, botY - 34, botY);
      ctx.strokeStyle = k.rgba(p.color, (0.35 + 0.45 * flow) * fade);
      ctx.lineWidth = 4 + 3 * flow;
      const wob = k.noise1(t * 5.2 + i * 5.1) * 3;
      ctx.beginPath();
      ctx.moveTo(x0 + wob, yy);
      ctx.lineTo(x0 + wob * 0.5, yy + 26);
      ctx.stroke();
    }

    // taban: çarpma yüzeyi + köpük
    ctx.strokeStyle = k.rgba(p.color, 0.55);
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.ellipse(0, botY + 6, 38 + 30 * flow, 9, 0, 0, k.TAU); ctx.stroke();
    const NB = Math.round(5 + 6 * flow);
    for (let i = 0; i < NB; i++) {
      const cyc = 0.9;
      const ph = ((t * (0.9 + k.hash(i * 2.2 + 7) * 0.4) + k.hash(i * 6.6 + 7) * cyc) % cyc) / cyc;
      const bx = (k.hash(i * 8.8 + 7) - 0.5) * (60 + 44 * flow) + k.noise1(t * 2 + i * 3) * 5;
      const by = botY + 4 - ph * 34;
      ctx.fillStyle = k.rgba(p.color, 0.75 * (1 - ph));
      ctx.beginPath(); ctx.arc(bx, by, 2 + (1 - ph) * 4.5, 0, k.TAU); ctx.fill();
    }
  },
};

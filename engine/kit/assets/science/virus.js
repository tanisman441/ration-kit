// science/virus — dikenli virüs; wobble ile titrer, spike uçları vurgulu.
// NOT: canvas y-aşağıdır; (0,0) gövde merkezidir.
export default {
  name: 'virus',
  category: 'science',
  desc: 'Dikenli virüs modeli; wobble parametresiyle titrer, spike proteinleri belirgin',
  tags: ['virüs', 'virus', 'mikrop', 'germ', 'mikrobiyoloji', 'microbiology', 'pandemi', 'pandemic', 'spike', 'hastalık', 'disease'],
  box: [-100, -100, 100, 100],
  bleed: 15,
  anchor: 'gövde merkezi (0,0)',
  points: { center: [0, 0] },
  params: {
    color: { type: 'color', default: 'purple', desc: 'virüs gövde rengi' },
    wobble: { type: 'number', default: 0.5, desc: 'titreme şiddeti 0–1' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round';
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const w = k.clamp(p.wobble, 0, 1);

    // titreme: hafif dönme + nabız
    ctx.rotate(Math.sin(t * 1.8) * 0.12 * w);
    const s = 1 + 0.03 * w * Math.sin(t * 3.1);
    ctx.scale(s, s);

    const R = 58, N = 14;
    // spikeler
    for (let i = 0; i < N; i++) {
      const a = (i / N) * k.TAU + (k.hash(i * 3 + 1) - 0.5) * 0.25;
      const bx = Math.cos(a) * (R - 6), by = Math.sin(a) * (R - 6);
      const tx = Math.cos(a) * (R + 22), ty = Math.sin(a) * (R + 22);
      ctx.strokeStyle = line; ctx.lineWidth = 9 + LW;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(tx, ty); ctx.stroke();
      ctx.strokeStyle = body; ctx.lineWidth = 9;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(tx, ty); ctx.stroke();
      // spike ucu (topuz)
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.arc(tx, ty, 10 + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.arc(tx, ty, 10, 0, k.TAU); ctx.fill();
    }

    // gövde: dış hat + gövde
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 0, R + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.fill();

    // iç noktalar (nükleokapsit)
    for (let i = 0; i < 6; i++) {
      const a = k.hash(i * 5 + 2) * k.TAU, r = 8 + k.hash(i * 7 + 3) * 30;
      ctx.fillStyle = k.rgba('bg', 0.4);
      ctx.beginPath(); ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 6, 0, k.TAU); ctx.fill();
    }

    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-18, -22, 16, 11, -0.4, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};

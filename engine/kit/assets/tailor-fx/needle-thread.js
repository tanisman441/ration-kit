// tailor-fx/needle-thread — iğne ipliği gözden geçirir; `at` anında iplik geçer, gözde parıltı belirir. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) iğne gözü (iğnenin sol-üst ucu), iğne sağ alta uzanır.
export default {
  name: 'needle-thread', category: 'tailor-fx',
  desc: 'Çapraz duran dikiş iğnesi; iplik gözden geçer, geçiş anında göz parlar, iplik ucu salınır',
  tags: ['terzi', 'iğne', 'iplik', 'dikiş', 'dikmek', 'tailor', 'needle', 'thread', 'sew', 'sewing', 'stitch'],
  box: [-130, -100, 130, 100],
  bleed: 30,
  anchor: 'iğne gözü (0,0); iğne sağ alta, iplik sol üstten gelir',
  points: { eye: [0, 0], tip: [95, 45], thread: [-70, -70] },
  params: {
    color: { type: 'color', default: 'ink' },
    at: { type: 'time', default: null, desc: 'iğne ipliği geçirir — iplik gözden geçer, parıltı (0.8 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // iğne: gözden (0,0) uca (95,45) uzanan çapraz gövde; boştayken hafif salınım
    const sway = Math.sin(t * k.TAU / 2.6) * 0.03;
    ctx.save();
    ctx.translate(0, 0);
    ctx.rotate(Math.atan2(45, 95) + sway);
    // dış hat + gövde
    ctx.strokeStyle = line; ctx.lineWidth = 11;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(106, 0); ctx.stroke();
    ctx.strokeStyle = k.rgba('panel2'); ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(2, 0); ctx.lineTo(100, 0); ctx.stroke();
    // uç (sivri)
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.moveTo(98, -4); ctx.lineTo(112, 0); ctx.lineTo(98, 4); ctx.closePath(); ctx.fill();
    // premium parlama (sol üst)
    ctx.strokeStyle = 'rgba(255,255,255,0.10)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(14, -2); ctx.lineTo(70, -2); ctx.stroke();
    ctx.restore();

    // iğne gözü: delik (gövde rengi üstüne koyu elips)
    ctx.save();
    ctx.translate(0, 0); ctx.rotate(Math.atan2(45, 95) + sway);
    ctx.fillStyle = k.rgba('bg', 0.8);
    ctx.beginPath(); ctx.ellipse(-2, 0, 7, 4, 0, 0, k.TAU); ctx.fill();
    ctx.restore();

    // sağ alt gölge (iğne altına)
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(48, 30, 46, 5, Math.atan2(45, 95), 0, k.TAU); ctx.fill();

    // iplik: gözden geçen kırmızı vurgu ipliği
    const thread = k.rgba('accent');
    const wag = k.noise1(t * 1.3) * 5;
    if (d < 0) {
      // yaklaşma: iplik ucu gözün sol üstünde salınır, `at` yaklaştıkça göze yaklaşır
      const a = p.at == null ? 0.35 : k.clamp(1 + d / 0.9, 0, 1);
      const tipX = k.lerp(-95, -6, a) + k.noise1(t * 1.7) * 4;
      const tipY = k.lerp(-82, -6, a) + Math.sin(t * k.TAU / 1.9) * 3;
      ctx.strokeStyle = thread; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(-118, -92);
      ctx.quadraticCurveTo(-70, -78 + wag, tipX, tipY); ctx.stroke();
      // iplik ucu düğümü
      ctx.fillStyle = thread;
      ctx.beginPath(); ctx.arc(tipX, tipY, 4, 0, k.TAU); ctx.fill();
    } else {
      // geçti: iplik gözden sol alta sarkar, kuyruk uzar
      const grow = k.clamp(d / 0.5, 0, 1);
      const tailX = -58 - grow * 8 + wag;
      const tailY = 30 + grow * 42;
      ctx.strokeStyle = thread; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-34, 34 + wag * 0.5, tailX, tailY); ctx.stroke();
      // kuyruk ucu düğümü
      ctx.fillStyle = thread;
      ctx.beginPath(); ctx.arc(tailX, tailY, 4, 0, k.TAU); ctx.fill();
      // üstte kalan kısa iplik ucu
      ctx.strokeStyle = thread; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-18, -26, -30, -44 + Math.sin(t * k.TAU / 1.7) * 3); ctx.stroke();
    }

    // geçiş parıltısı (0.8 sn)
    if (d >= 0 && d < 0.8) {
      const env = Math.sin(Math.min(d / 0.8, 1) * Math.PI);
      k.glow(0, 0, 26 + env * 14, 'accent', 0.5 * env);
      for (let i = 0; i < 4; i++) {
        const a = k.hash(i + 11) * k.TAU;
        const r0 = 8 + env * 10, r1 = r0 + 8 + k.hash(i + 21) * 8;
        ctx.strokeStyle = k.rgba('accent', 0.9 * env);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r0, Math.sin(a) * r0);
        ctx.lineTo(Math.cos(a) * r1, Math.sin(a) * r1);
        ctx.stroke();
      }
    }
  },
};

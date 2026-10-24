// shop-display-fx/gift-wrap — hediye kutusu; `at` anında kurdele bağlanır, fiyonk patlar.
// NOT: canvas y-aşağıdır. Idle: fiyonk hafifçe sallanır; at olayı ~1.4 sn sürer.
export default {
  name: 'gift-wrap', category: 'shop-display-fx',
  desc: 'Hediye kutusu; paketleme anında kurdele sarılır ve fiyonk belirir',
  tags: ['hediye', 'paket', 'kurdele', 'fiyonk', 'kutu', 'sürpriz', 'gift', 'wrap', 'ribbon', 'bow', 'present', 'box'],
  box: [-120, -110, 120, 110],
  bleed: 60,
  anchor: 'kutunun tabanı (0, 95)',
  points: { bow: [0, -88], lid: [0, -55], base: [0, 95] },
  params: {
    color: { type: 'color', default: 'red' },
    at: { type: 'time', default: null, desc: 'paketleme anı: kurdele sarılır (0.8 sn) + fiyonk patlar (1.4 sn)' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55);
    ctx.save();
    ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;
    const wrap = d < 0 ? 0 : k.E.inOutCubic(k.prog(d, 0, 0.8));
    const bowPop = d < 0.8 ? 0 : k.E.outBack(k.prog(d, 0.8, 1.15), 2.2);
    const sway = 0.06 * Math.sin(t * k.TAU / 2.2);
    // kutu gövdesi
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-86, -54, 172, 150, 16); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-78, -46, 156, 142, 12); ctx.fill();
    // sağ alt gölge tonu
    ctx.fillStyle = 'rgba(0,0,0,0.10)';
    ctx.beginPath(); k.rrect(38, -46, 40, 142, 12); ctx.fill();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-44, -30, 34, 9, -0.3, 0, k.TAU); ctx.fill();
    // kapak
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-94, -78, 188, 34, 14); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 0.95);
    ctx.beginPath(); k.rrect(-86, -70, 172, 28, 10); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-50, -62, 32, 6, -0.25, 0, k.TAU); ctx.fill();
    // kurdele: dikey şerit kapak + gövdede aşağı iner (wrap ilerledikçe uzar)
    if (wrap > 0.02) {
      const rh = 10 + wrap * 150;
      ctx.fillStyle = k.rgba('yellow', 0.95);
      ctx.fillRect(-13, -70, 26, rh);
      ctx.fillStyle = k.rgba('ink', 0.35);
      ctx.fillRect(-13, -70, 26, 6);
      // yatay şerit kapak üstünde belirir
      ctx.fillStyle = k.rgba('yellow', 0.95 * k.prog(wrap, 0.3, 0.7));
      ctx.fillRect(-86, -70, 172, 28);
    }
    // fiyonk (at sonrası, sallanarak)
    if (bowPop > 0.02) {
      ctx.save();
      ctx.translate(0, -78);
      ctx.rotate(sway);
      ctx.scale(bowPop, bowPop);
      for (const sx of [-1, 1]) {
        ctx.fillStyle = line;
        ctx.beginPath(); ctx.ellipse(sx * 30, -6, 34, 20, sx * 0.5, 0, k.TAU); ctx.fill();
        ctx.fillStyle = k.rgba('yellow', 0.95);
        ctx.beginPath(); ctx.ellipse(sx * 28, -6, 28, 15, sx * 0.5, 0, k.TAU); ctx.fill();
        ctx.fillStyle = k.rgba('ink', 0.3);
        ctx.beginPath(); ctx.ellipse(sx * 14, -6, 10, 8, sx * 0.5, 0, k.TAU); ctx.fill();
      }
      ctx.fillStyle = k.rgba('yellow');
      ctx.beginPath(); ctx.arc(0, -4, 11, 0, k.TAU); ctx.fill();
      // fiyonk kuyrukları
      ctx.strokeStyle = k.rgba('yellow', 0.9); ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(-8, 4); ctx.lineTo(-20, 22); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(8, 4); ctx.lineTo(20, 22); ctx.stroke();
      ctx.restore();
    }
    // paketleme parıltıları (fiyonk patlarken)
    if (d >= 0.8 && d < 1.6) {
      for (let i = 0; i < 5; i++) {
        const pr = k.prog(d, 0.8 + i * 0.08, 1.6);
        if (pr <= 0 || pr >= 1) continue;
        const a = -0.6 + i * 0.3;
        const sx = Math.cos(a) * (60 + pr * 40), sy = -80 + Math.sin(a) * 30 - pr * 20;
        ctx.fillStyle = k.rgba('yellow', 0.9 * (1 - pr));
        ctx.beginPath(); ctx.arc(sx, sy, (1 - pr) * 7 + 2, 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore();
  },
};

// cyber-fx/firewall-block — altıgen bloklardan güvenlik duvarı + kırmızı kalkan engeli.
// ANIMASYON: `at` anında kalkan belirir (0.2 sn pop) + çarpma dalgası (0.5 sn halka);
// idle'da tarama çizgisi duvarı süzer (3 sn döngü). Tek vurgu: red.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'firewall-block', category: 'cyber-fx',
  desc: 'Altıgen bloklardan güvenlik duvarı; at anında kırmızı kalkan belirip çarpma dalgası yayar',
  tags: ['güvenlik', 'duvar', 'kalkan', 'firewall', 'engel', 'koruma', 'siber', 'savunma', 'firewall', 'shield', 'block', 'security', 'defense', 'cyber'],
  box: [-130, -90, 130, 90],
  bleed: 40,
  anchor: 'duvar merkezi (0,0)',
  points: { gate: [0, 0], top: [0, -45] },
  params: {
    at: { type: 'time', default: null, desc: 'engel anı: kırmızı kalkan belirir + 0.5 sn çarpma dalgası' },
    color: { type: 'color', default: 'red' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const firing = d >= 0 && d < 0.6;
    ctx.save();
    ctx.lineCap = 'round';

    // --- duvar: 2 sıra altıgen blok ---
    const hexR = 30;
    const rows = [-hexR * 0.9, hexR * 0.9];
    const shake = firing ? k.noise1(t * 45) * 4 * (1 - k.prog(d, 0, 0.25)) : 0;
    ctx.save(); ctx.translate(shake, 0);
    for (let r = 0; r < 2; r++) {
      const y = rows[r];
      for (let i = -3; i <= 3; i++) {
        const x = i * hexR * 1.75 + (r === 1 ? hexR * 0.87 : 0);
        if (Math.abs(x) > 118) continue;
        // gölge
        ctx.fillStyle = k.rgba('bg', 0.12);
        ctx.beginPath();
        for (let v = 0; v < 6; v++) {
          const a = (v / 6) * k.TAU + Math.PI / 6;
          const px = x + 6 + Math.cos(a) * hexR * 0.9, py = y + 6 + Math.sin(a) * hexR * 0.9;
          v === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath(); ctx.fill();
        // blok gövdesi
        ctx.fillStyle = k.rgba('panel2');
        ctx.beginPath();
        for (let v = 0; v < 6; v++) {
          const a = (v / 6) * k.TAU + Math.PI / 6;
          const px = x + Math.cos(a) * hexR * 0.9, py = y + Math.sin(a) * hexR * 0.9;
          v === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4; ctx.stroke();
        // üst yüze parlama (sol üst)
        ctx.fillStyle = 'rgba(255,255,255,0.10)';
        ctx.beginPath(); ctx.ellipse(x - hexR * 0.3, y - hexR * 0.35, 9, 6, -0.5, 0, k.TAU); ctx.fill();
        // kilit simgesi: küçük daire
        ctx.fillStyle = k.rgba('ink', 0.5);
        ctx.beginPath(); ctx.arc(x, y, 6, 0, k.TAU); ctx.fill();
      }
    }
    // idle tarama çizgisi: 3 sn döngüyle duvarı süzer
    const scanPh = (t / 3) % 1;
    const scanY = k.lerp(-58, 58, scanPh);
    ctx.fillStyle = k.rgba(p.color, 0.18 * Math.sin(scanPh * Math.PI) + 0.06);
    ctx.fillRect(-118, scanY - 4, 236, 8);
    ctx.restore();

    // --- at anında kalkan: 0.2 sn pop ---
    if (firing) {
      const pop = k.E.outBack(k.prog(d, 0, 0.2));
      const fl = 1 - k.prog(d, 0, 0.14);
      if (fl > 0) k.glow(0, 0, 90, p.color, 0.55 * fl);
      ctx.save();
      ctx.scale(Math.max(pop, 0.01), Math.max(pop, 0.01));
      // kalkan formu
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath();
      ctx.moveTo(6, -40); ctx.quadraticCurveTo(36, -32, 33, -2); ctx.quadraticCurveTo(30, 20, 6, 40);
      ctx.quadraticCurveTo(-18, 20, -21, -2); ctx.quadraticCurveTo(-24, -32, 6, -40);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = k.rgba(p.color);
      ctx.beginPath();
      ctx.moveTo(0, -40); ctx.quadraticCurveTo(30, -32, 27, -2); ctx.quadraticCurveTo(24, 20, 0, 40);
      ctx.quadraticCurveTo(-24, 20, -27, -2); ctx.quadraticCurveTo(-30, -32, 0, -40);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-10, -24, 11, 15, 0.3, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, -40); ctx.quadraticCurveTo(30, -32, 27, -2); ctx.quadraticCurveTo(24, 20, 0, 40);
      ctx.quadraticCurveTo(-24, 20, -27, -2); ctx.quadraticCurveTo(-30, -32, 0, -40);
      ctx.closePath(); ctx.stroke();
      // onay işareti (bg rengi, iki temada da okunur)
      ctx.strokeStyle = k.rgba('bg'); ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(-12, -2); ctx.lineTo(-2, 10); ctx.lineTo(14, -12); ctx.stroke();
      ctx.restore();

      // çarpma dalgası: 0.5 sn genişleyen halka
      const wr = 30 + k.prog(d, 0, 0.5) * 105;
      const wa = 0.7 * (1 - k.prog(d, 0, 0.5));
      if (wa > 0.01) {
        k.glow(0, 0, wr, p.color, 0.4 * wa);
        ctx.strokeStyle = k.rgba(p.color, wa);
        ctx.lineWidth = 8;
        ctx.beginPath(); ctx.arc(0, 0, wr, 0, k.TAU); ctx.stroke();
      }
    }
    ctx.restore();
  },
};

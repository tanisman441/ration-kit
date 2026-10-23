// health-fx-2/xray-scan — röntgen filmi; `at` anında tarama çizgisi süpürür, kemikler belirir.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'xray-scan', category: 'health-fx-2',
  desc: 'Göğüs röntgeni filmi; at anında cyan tarama çizgisi süpürür, kemikler netleşir',
  tags: ['röntgen', 'tarama', 'kemik', 'iskelet', 'film', 'xray', 'scan', 'bone', 'skeleton', 'medical', 'göğüs'],
  box: [-100, -100, 100, 100],
  bleed: 14,
  anchor: 'film merkezi',
  points: { chest: [0, -8] },
  params: {
    color: { type: 'color', default: 'ink' },
    at: { type: 'time', default: null, desc: 'tarama anı: çizgi 0.9 sn\'de yukarıdan aşağı süpürür' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55);
    ctx.save();
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;
    const active = d >= 0 && d <= 1.4;
    const sp = active ? k.prog(d, 0, 0.9) : 1;
    const sy = -62 + 124 * sp;

    // film + sağ alt gölge
    ctx.fillStyle = k.rgba('bg', 0.12);
    k.rrect(-78 + 7, -68 + 7, 156, 136, 10); ctx.fill();
    ctx.fillStyle = k.rgba('panel');
    ctx.strokeStyle = line; ctx.lineWidth = 6;
    k.rrect(-78, -68, 156, 136, 10); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = k.rgba('dim', 0.6); ctx.lineWidth = 3;
    k.rrect(-66, -56, 132, 112, 6); ctx.stroke();
    // film köşe çentikleri
    ctx.fillStyle = k.rgba('dim', 0.7);
    k.rrect(-74, -64, 8, 8, 2); ctx.fill();
    k.rrect(66, -64, 8, 8, 2); ctx.fill();
    // hafif film titremesi (canlı idle)
    ctx.fillStyle = k.rgba('ink', 0.02 + 0.02 * (0.5 + 0.5 * k.noise1(t * 2)));
    k.rrect(-66, -56, 132, 112, 6); ctx.fill();

    // kemikler: omurga + kaburgalar + köprücük
    const bones = () => {
      ctx.strokeStyle = k.rgba(p.color); ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, -48); ctx.lineTo(0, 48);
      for (let i = 0; i < 4; i++) {
        const y = -34 + i * 17;
        ctx.moveTo(0, y); ctx.quadraticCurveTo(-22, y + 2, -44, y + 16);
        ctx.moveTo(0, y); ctx.quadraticCurveTo(22, y + 2, 44, y + 16);
      }
      ctx.moveTo(-6, -46); ctx.lineTo(-34, -52);
      ctx.moveTo(6, -46); ctx.lineTo(34, -52);
      ctx.stroke();
      ctx.lineWidth = 3;
      for (let i = 0; i < 6; i++) {
        const y = -40 + i * 15;
        ctx.beginPath(); ctx.moveTo(-7, y); ctx.lineTo(7, y); ctx.stroke();
      }
    };
    ctx.save();
    ctx.globalAlpha = 0.30; bones(); ctx.restore();
    if (active) {
      // taranan bölge net
      ctx.save();
      ctx.beginPath(); ctx.rect(-66, -56, 132, sy + 56); ctx.clip();
      ctx.globalAlpha = 1; bones(); ctx.restore();
      // tarama çizgisi + ışıma
      k.glow(0, sy, 52, 'cyan', 0.35);
      ctx.fillStyle = k.rgba('cyan', 0.10);
      ctx.fillRect(-66, sy - 16, 132, 14);
      ctx.fillStyle = k.rgba('cyan', 0.95);
      k.rrect(-66, sy - 2, 132, 4, 2); ctx.fill();
    } else {
      ctx.globalAlpha = 0.85; bones(); ctx.globalAlpha = 1;
    }

    ctx.restore();
  },
};

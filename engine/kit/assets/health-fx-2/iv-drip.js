// health-fx-2/iv-drip — serum standı; `drip` anında damla düşer, odacıkta halka oluşur.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'iv-drip', category: 'health-fx-2',
  desc: 'Askıda serum torbası; drip anında damla düşer, damla odacığında halka yayılır',
  tags: ['serum', 'damla', 'iv', 'infüzyon', 'hastane', 'drip', 'intravenous', 'hospital', 'medical', 'serum damlası'],
  box: [-100, -100, 100, 100],
  bleed: 16,
  anchor: 'serum torbası merkezi',
  points: { nozzle: [10, 42], chamber: [10, 62] },
  params: {
    color: { type: 'color', default: 'cyan' },
    drip: { type: 'time', default: null, desc: 'damla düşme anı: 0.38 sn düşüş + 0.5 sn halka' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55);
    const inkLine = k.rgba('ink', 0.8);
    ctx.save();
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const dd = p.drip == null ? -1 : t - p.drip;

    // stand: direk + ayak + askı (serbest çizgiler ink)
    ctx.strokeStyle = k.rgba('ink'); ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(-60, -70); ctx.lineTo(-60, 90); ctx.stroke();
    ctx.fillStyle = k.rgba('dim');
    k.rrect(-86, 88, 52, 12, 6); ctx.fill();
    ctx.strokeStyle = inkLine; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-60, -70); ctx.quadraticCurveTo(-30, -84, 10, -82); ctx.stroke();
    ctx.beginPath(); ctx.arc(10, -78, 5, 0, k.TAU); ctx.stroke();

    // torba + sağ alt gölge
    ctx.fillStyle = k.rgba('bg', 0.12);
    k.rrect(-32 + 6, -82 + 6, 84, 118, 18); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.strokeStyle = line; ctx.lineWidth = 6;
    k.rrect(-32, -82, 84, 118, 18); ctx.fill(); ctx.stroke();
    // premium: sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-12, -60, 22, 10, -0.5, 0, k.TAU); ctx.fill();

    // sıvı (çalkantılı yüzey — canlı idle)
    ctx.save();
    k.rrect(-26, -76, 72, 106, 14); ctx.clip();
    const yLiq = -12 + k.noise1(t * 1.6) * 3;
    ctx.fillStyle = k.rgba(p.color, 0.32);
    ctx.fillRect(-26, yLiq, 72, 30 - yLiq);
    ctx.strokeStyle = k.rgba(p.color, 0.8); ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = -26; x <= 46; x += 6) {
      const y = yLiq + Math.sin(x * 0.25 + t * 3) * 2;
      x <= -26 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
    // ölçü çizgileri
    ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-26, -52 + i * 22); ctx.lineTo(-14, -52 + i * 22); ctx.stroke(); }

    // meme + damla odacığı
    ctx.fillStyle = k.rgba('dim');
    k.rrect(5, 36, 10, 12, 3); ctx.fill();
    ctx.fillStyle = k.rgba('panel');
    ctx.strokeStyle = line; ctx.lineWidth = 4;
    k.rrect(1, 48, 18, 32, 6); ctx.fill(); ctx.stroke();
    const menY = 62 + k.noise1(t * 2.2) * 1.5;
    ctx.fillStyle = k.rgba(p.color, 0.45);
    ctx.fillRect(4, menY, 12, 77 - menY);

    // damla: düşüş (0.38 sn)
    if (dd >= 0 && dd < 0.38) {
      const f = dd / 0.38, y = 50 + 15 * f * f;
      ctx.fillStyle = k.rgba(p.color, 0.95);
      ctx.beginPath(); ctx.arc(10, y, 4, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(10 - 3, y - 2); ctx.lineTo(10, y - 9); ctx.lineTo(10 + 3, y - 2); ctx.closePath(); ctx.fill();
    }
    // halka: odacıkta yayılma (0.38–0.9 sn)
    if (dd >= 0.38 && dd < 0.9) {
      const e = k.E.outCubic((dd - 0.38) / 0.52);
      ctx.strokeStyle = k.rgba(p.color, 0.8 * (1 - e)); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(10, 66, 2 + e * 7, 1.5 + e * 3, 0, 0, k.TAU); ctx.stroke();
    }
    // odacık içi yükselen baloncuk (canlı idle)
    const by = 76 - ((t * 9) % 13);
    ctx.fillStyle = k.rgba(p.color, 0.5);
    ctx.beginPath(); ctx.arc(10, by, 2.4, 0, k.TAU); ctx.fill();

    // hortum (serbest çizgi, hafif salınım)
    const sway = k.noise1(t * 1.2) * 4;
    ctx.strokeStyle = inkLine; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(10, 80); ctx.quadraticCurveTo(12, 94, 42 + sway, 98); ctx.stroke();

    ctx.restore();
  },
};

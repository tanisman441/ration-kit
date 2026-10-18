// food/pizza — yandan eğik pizza dilimi; cheese-pull anında peynir uzar ve geri döner
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır; (0,0) dilimin merkezidir.
export default {
  name: 'pizza', category: 'food',
  desc: 'Yandan eğik pizza dilimi; cheese-pull anında peynir iplikleri uzar ve geri çekilir',
  tags: ['pizza', 'dilim', 'slice', 'peynir', 'cheese', 'yemek', 'italyan'],
  box: [-80, -85, 80, 85],
  bleed: 45,
  anchor: 'dilim merkezi (0,0)',
  points: { top: [0, -52] },
  params: {
    'cheese-pull': { type: 'time', default: null, desc: 'peynir uzama anı (iplikler uzar ve geri döner)' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const cheese = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const d = p['cheese-pull'] == null ? -1 : t - p['cheese-pull'];

    // peynir uzama: 0→0.9 sn'de uzar, 0.9→1.5'te geri döner
    let pull = 0;
    if (d >= 0 && d < 1.5) pull = d < 0.9 ? d / 0.9 : 1 - (d - 0.9) / 0.6;

    const sway = Math.sin(t * 1.4) * 0.03; // hafif salınım (idle)
    // buhar: her zaman hafif, cheese-pull'da güçlenir
    const steamAmp = 0.5 + 0.5 * Math.min(Math.max(pull, 0), 1);

    ctx.save();
    ctx.rotate(-0.18 + sway);

    const tri = (dy) => {
      ctx.beginPath();
      ctx.moveTo(-62, -34 + dy); ctx.lineTo(62, -34 + dy); ctx.lineTo(0, 58 + dy);
      ctx.closePath();
    };

    // sağ alt gölge
    ctx.save(); ctx.translate(7, 7); tri(0); ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fill(); ctx.restore();

    // hamur tabanı
    tri(0); ctx.fillStyle = k.rgba('panel2'); ctx.fill();
    // peynir yüzeyi
    ctx.beginPath();
    ctx.moveTo(-52, -28); ctx.lineTo(52, -28); ctx.lineTo(0, 50);
    ctx.closePath();
    ctx.fillStyle = cheese; ctx.fill();
    // kenar (kabuk)
    ctx.strokeStyle = k.rgba('panel2'); ctx.lineWidth = 12; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-62, -34); ctx.lineTo(62, -34); ctx.stroke();
    ctx.strokeStyle = line; ctx.lineWidth = LW;
    tri(0); ctx.stroke();
    // sucuk dilimleri
    ctx.fillStyle = k.rgba('red', 0.9);
    const peps = [[-28, -12, 11], [26, -12, 11], [0, 12, 12]];
    for (const [px, py, pr] of peps) { ctx.beginPath(); ctx.arc(px, py, pr, 0, k.TAU); ctx.fill(); }
    ctx.fillStyle = k.rgba('red');
    for (const [px, py, pr] of peps) { ctx.beginPath(); ctx.arc(px, py, pr * 0.55, 0, k.TAU); ctx.fill(); }
    // fesleğen
    ctx.fillStyle = k.rgba('green');
    ctx.beginPath(); ctx.ellipse(-6, -20, 7, 4.5, 0.6, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(14, 2, 7, 4.5, -0.5, 0, k.TAU); ctx.fill();
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-34, -24, 18, 8, -0.3, 0, k.TAU); ctx.fill();

    ctx.restore();

    // peynir iplikleri: uçtan aşağı sarkar
    if (pull > 0.02) {
      const tipX = -0.18 * 58, tipY = 58;
      ctx.strokeStyle = cheese; ctx.lineCap = 'round';
      for (let i = 0; i < 4; i++) {
        const sx = tipX - 24 + i * 16 + k.noise1(i * 7.3) * 4;
        const len = (34 + i * 9) * pull;
        const wob = Math.sin(t * 9 + i * 2.1) * 5 * pull;
        ctx.lineWidth = 5 - i * 0.6;
        ctx.beginPath();
        ctx.moveTo(sx, tipY - 4);
        ctx.quadraticCurveTo(sx + wob, tipY + len * 0.6, sx + wob * 0.4, tipY + len);
        ctx.stroke();
        // damla ucu
        ctx.fillStyle = cheese;
        ctx.beginPath(); ctx.arc(sx + wob * 0.4, tipY + len, 4.5, 0, k.TAU); ctx.fill();
      }
    }

    // buhar (idle: hafif; pull'da yoğun)
    ctx.strokeStyle = k.rgba('dim', 0.4); ctx.lineWidth = 4; ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const cyc = 2.4 / steamAmp;                    // döngü süresi
      const ph = ((t + i * cyc / 3) % cyc) / cyc;    // 0→1
      const sy = -50 - ph * 44;
      const sx = -30 + i * 30 + Math.sin(t * 2.2 + i * 2.4) * 6;
      ctx.globalAlpha = Math.min(0.5, 0.5 * (1 - ph) * steamAmp);
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(sx + 8, sy - 9, sx + Math.sin(t * 3 + i) * 5, sy - 18);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  },
};

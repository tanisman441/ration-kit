// health-fx-2/heartbeat-monitor — EKG ekranlı hasta monitörü; `beat` anında ekran nabzı atar.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'heartbeat-monitor', category: 'health-fx-2',
  desc: 'EKG ekranlı hasta monitörü; beat anında iz sıçrar, kalp simgesi nabızlanır',
  tags: ['kalp atışı', 'ekg', 'monitör', 'nabız', 'kalp', 'heartbeat', 'ecg', 'monitor', 'pulse', 'heart', 'medical'],
  box: [-100, -100, 100, 100],
  bleed: 12,
  anchor: 'gövde merkezi',
  points: { screen: [-5, -8], heart: [66, -30] },
  params: {
    color: { type: 'color', default: 'ink' },
    beat: { type: 'time', default: null, desc: 'nabız atışı anı: EKG sıçrar, kalp büyür, ekran parlar (0.9 sn)' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55), lw = 6;
    ctx.save();
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const bd = p.beat == null ? -1 : t - p.beat;
    const boost = bd >= 0 && bd < 0.9 ? 1 + 0.35 * Math.exp(-bd * 5) : 1;
    const heartPulse = bd >= 0 && bd < 0.9 ? 0.5 * Math.exp(-bd * 5) : 0;
    const idlePulse = 0.10 * Math.pow(Math.max(0, Math.sin(t * 3.1)), 8);

    // sehpa
    ctx.fillStyle = k.rgba('dim');
    k.rrect(-10, 24, 20, 58, 6); ctx.fill();
    k.rrect(-36, 78, 72, 16, 7); ctx.fill();

    // gövde + sağ alt gölge
    ctx.fillStyle = k.rgba('bg', 0.12);
    k.rrect(-88 + 7, -72 + 7, 176, 144, 22); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.strokeStyle = line; ctx.lineWidth = lw;
    k.rrect(-88, -72, 176, 144, 22); ctx.fill(); ctx.stroke();
    // premium: sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-52, -46, 36, 16, -0.5, 0, k.TAU); ctx.fill();

    // ekran
    ctx.fillStyle = k.rgba('ink');
    k.rrect(-68, -54, 128, 92, 10); ctx.fill();
    // beat anında ekran parlaması
    if (bd >= 0 && bd < 0.6) k.glow(-5, -8, 62, 'green', 0.35 * (1 - bd / 0.6));

    ctx.save();
    k.rrect(-68, -54, 128, 92, 10); ctx.clip();
    // ızgara
    ctx.strokeStyle = k.rgba('bg', 0.10); ctx.lineWidth = 2;
    for (let gy = -44; gy <= 28; gy += 18) { ctx.beginPath(); ctx.moveTo(-68, gy); ctx.lineTo(60, gy); ctx.stroke(); }
    // EKG izi
    const ecg = ph => {
      if (ph < 0.40 || ph > 0.75) return 0;
      const q = (ph - 0.40) / 0.35;
      if (q < 0.14) return -5 * (q / 0.14);
      if (q < 0.30) return -5 + 33 * ((q - 0.14) / 0.16);
      if (q < 0.46) return 28 - 38 * ((q - 0.30) / 0.16);
      if (q < 0.62) return -10 + 10 * ((q - 0.46) / 0.16);
      return 0;
    };
    ctx.strokeStyle = k.rgba('green'); ctx.lineWidth = 5;
    ctx.beginPath();
    for (let x = -66; x <= 58; x += 3) {
      const ph = ((((x + t * 60) % 90) + 90) % 90) / 90;
      const y = -8 - ecg(ph) * boost;
      x <= -66 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();

    // kalp simgesi (nabızlanır)
    const hs = 1 + heartPulse + idlePulse;
    ctx.save(); ctx.translate(66, -30); ctx.scale(hs, hs);
    ctx.fillStyle = k.rgba('green');
    ctx.beginPath();
    ctx.arc(-4.5, -2, 6, 0, k.TAU); ctx.arc(4.5, -2, 6, 0, k.TAU);
    ctx.moveTo(-9.8, 0.5); ctx.lineTo(0, 10); ctx.lineTo(9.8, 0.5); ctx.closePath();
    ctx.fill(); ctx.restore();

    // LED (yanıp söner) + düğmeler
    const ledA = 0.35 + 0.65 * Math.pow(Math.max(0, Math.sin(t * 4)), 2);
    ctx.fillStyle = k.rgba('green', ledA);
    ctx.beginPath(); ctx.arc(66, 44, 5, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    k.rrect(-68, 48, 26, 12, 5); ctx.fill();
    k.rrect(-36, 48, 26, 12, 5); ctx.fill();

    ctx.restore();
  },
};

// medical-emergency/code-blue-alarm — duvara monte mavi kod alarm lambası; döngülü flaş + tepe anında halka dalgası.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'code-blue-alarm', category: 'medical-emergency',
  desc: 'Duvara monte döner alarm lambası; döngülü mavi flaş, at anında ışık hüzmeleri ve yayılan halka',
  tags: ['mavi kod', 'alarm', 'acil', 'hastane', 'siren', 'lamba', 'code blue', 'alarm', 'beacon', 'siren', 'emergency', 'hospital', 'medical'],
  box: [-110, -100, 110, 100],
  bleed: 46,
  anchor: 'duvar bağlantısı',
  points: { dome: [0, -30], wallLeft: [-70, -10], base: [0, 10], burst: [0, -64] },
  params: {
    color: { type: 'color', default: 'cyan' },
    at: { type: 'time', default: null, desc: 'alarm tepe anı: 0.6 sn hüzme patlaması + yayılan halka (0.2–1.5 sn arası)' },
    speed: { type: 'number', default: 1, desc: 'flaş hızı çarpanı' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55), lw = 6;
    ctx.save();
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;
    const burst = d >= 0 && d < 0.6 ? 1 - d / 0.6 : 0;
    // döngülü flaş (1.4 sn periyot)
    const flash = Math.pow(Math.max(0, Math.sin(t * k.TAU / 1.4 * p.speed)), 3);

    // duvar plakası + sağ alt gölge
    ctx.fillStyle = k.rgba('bg', 0.12);
    k.rrect(-74 + 6, -52 + 6, 28, 84, 10); ctx.fill();
    ctx.fillStyle = k.rgba('panel');
    ctx.strokeStyle = line; ctx.lineWidth = lw;
    k.rrect(-74, -52, 28, 84, 10); ctx.fill(); ctx.stroke();
    // premium: sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-66, -38, 8, 5, -0.5, 0, k.TAU); ctx.fill();

    // kol + kaide
    ctx.strokeStyle = line; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.moveTo(-46, -10); ctx.lineTo(-20, -10); ctx.stroke();
    ctx.fillStyle = k.rgba('panel2');
    ctx.strokeStyle = line; ctx.lineWidth = lw;
    k.rrect(-34, 2, 68, 18, 8); ctx.fill(); ctx.stroke();

    // kubbe (lamba): flaşla parlar
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.arc(6, -30 + 6, 34, Math.PI, 0); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 0.45 + 0.55 * Math.max(flash, burst));
    ctx.strokeStyle = line; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.arc(0, -30, 34, Math.PI, 0); ctx.fill(); ctx.stroke();
    // kubbe içi parlama (asla bilgi yüzeyi değil, kubbe formu)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-14, -46, 12, 6, -0.5, 0, k.TAU); ctx.fill();
    // glow
    const glowA = 0.15 + 0.35 * Math.max(flash, burst);
    k.glow(0, -30, 60 + 30 * burst, p.color, glowA);

    // dönen hüzmeler (flaş zarfıyla)
    const beamA = 0.25 * flash + 0.65 * burst;
    if (beamA > 0.03) {
      ctx.strokeStyle = k.rgba(p.color, Math.min(0.9, beamA)); ctx.lineWidth = 5;
      const rot = t * 2.2 * p.speed;
      for (let i = 0; i < 8; i++) {
        const a = rot + i * k.TAU / 8;
        const r1 = 44, r2 = 62 + 26 * burst;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r1, -30 + Math.sin(a) * r1);
        ctx.lineTo(Math.cos(a) * r2, -30 + Math.sin(a) * r2);
        ctx.stroke();
      }
    }

    // yayılan halka (at anında)
    if (burst > 0) {
      const rq = (1 - burst); // 0→1
      ctx.strokeStyle = k.rgba(p.color, 0.8 * burst); ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(0, -30, 40 + 60 * rq, 0, k.TAU); ctx.stroke();
      ctx.strokeStyle = k.rgba(p.color, 0.4 * burst); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, -30, 40 + 60 * Math.max(0, rq - 0.25), 0, k.TAU); ctx.stroke();
    }

    // mavi kod göstergesi (gövde üstü LED)
    const ledA = 0.3 + 0.7 * Math.max(flash, burst);
    ctx.fillStyle = k.rgba(p.color, ledA);
    ctx.beginPath(); ctx.arc(0, 11, 6, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};

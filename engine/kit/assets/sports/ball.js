// sports/ball — sade desenli futbol topu: merkez beşgen + çevre yama deseni
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır; (0,0) topun merkezidir.
export default {
  name: 'ball', category: 'sports',
  desc: 'Sade desenli futbol topu; bounce anında zıplar ve hafif yassılaşır',
  tags: ['futbol', 'top', 'ball', 'soccer', 'football', 'zıpla', 'bounce', 'spor'],
  box: [-70, -160, 70, 70],
  bleed: 12,
  anchor: 'topun merkezi (0,0)',
  points: { top: [0, -55] },
  params: {
    bounce: { type: 'time', default: null, desc: 'zıplama anı (yükselme + squash)' },
  },
  draw(ctx, t, p, k) {
    const R = 55;
    const LW = 5;
    const body = k.rgba('panel2'), line = k.rgba('bg', 0.55);

    // zıplama: bounce sonrası 0.9 sn'lik yay, tepe 95 birim yukarıda; çarpma anında squash
    const d = p.bounce == null ? -1 : t - p.bounce;
    let dy = 0, squash = 1;
    if (d >= 0 && d < 0.9) dy = -95 * Math.sin(Math.PI * d / 0.9);
    if (d >= 0 && d < 0.12) squash = 1 - 0.28 * Math.pow(Math.cos(Math.PI * d / 0.24), 2);
    dy += Math.sin(t * 1.9) * 2; // hafif idle yüzerliği

    // zemin gölgesi (havadayken soluklaşır)
    const air = Math.min(Math.abs(dy) / 95, 1);
    ctx.fillStyle = 'rgba(0,0,0,0.10)';
    ctx.beginPath(); ctx.ellipse(6, R + 14, R * (1 - air * 0.25), 8 * (1 - air * 0.4), 0, 0, k.TAU); ctx.fill();

    ctx.save();
    ctx.translate(0, dy);
    ctx.scale(1 + (1 - squash) * 0.7, squash);

    const pent = (cx, cy, r, rot, fill) => {
      ctx.fillStyle = fill; ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = rot + i * k.TAU / 5;
        const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.closePath(); ctx.fill();
    };

    // sağ alt gölge (%12 koyultma)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.arc(6, 6, R, 0, k.TAU); ctx.fill();
    // dış hat + ana gövde
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 0, R + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.fill();
    // merkez beşgen
    pent(0, 0, 17, -Math.PI / 2, k.rgba('ink', 0.75));
    // çevrede 5 yama
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + i * k.TAU / 5;
      pent(Math.cos(a) * R * 0.96, Math.sin(a) * R * 0.96, 15, a, k.rgba('ink', 0.5));
    }
    // iç bağlantı çizgileri (ince, ink 0.35)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + i * k.TAU / 5;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 14, Math.sin(a) * 14);
      ctx.lineTo(Math.cos(a) * 44, Math.sin(a) * 44);
      ctx.stroke();
    }
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-20, -24, 19, 12, -0.4, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};

// superhero-fx/web-shot — bilekten fırlayan ağ ipi: at anında hedefe eğri çizilerek uzar.
// NOT: canvas y-aşağıdır; (0,0) bilek/ağ fırlatıcı.
export default {
  name: 'web-shot', category: 'superhero-fx',
  desc: 'Bilekten fırlayan ağ ipi: at anında hedefe doğru eğri çizilerek uzayan ağ atışı',
  tags: ['ağ', 'ip', 'örümcek', 'fırlatma', 'kahraman', 'web', 'shot', 'spider', 'line'],
  box: [-85, -115, 215, 115],
  bleed: 40,
  anchor: 'bilek / ağ fırlatıcı (0,0)',
  points: { wrist: [0, 0], target: [150, -60] },
  params: {
    at: { type: 'time', default: null, desc: 'ağ atışı anı (ip eğri çizilerek uzar, 0.5 sn)' },
    color: { type: 'color', default: 'ink' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const firing = d >= 0 && d <= 1.2;
    const sway = Math.sin(t * 2.1) * 2.5;      // idle salınım
    const T = [150, -60];                        // hedef
    ctx.save();

    // bilek + fırlatıcı
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-70, -24 + sway * 0.4, 84, 48, 20); ctx.fill();
    // premium: sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-44, -12 + sway * 0.4, 16, 8, -0.4, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 6;
    ctx.beginPath(); k.rrect(-70, -24 + sway * 0.4, 84, 48, 20); ctx.stroke();
    // fırlatıcı ağzı
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.arc(18, sway * 0.4, 12, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(18, sway * 0.4, 12, 0, k.TAU); ctx.stroke();

    // atıştan ÖNCE: sarkan gevşek ip (idle salınım)
    if (!firing) {
      const hang = 14 + 4 * Math.sin(t * 2.1 + 1);
      ctx.strokeStyle = k.rgba('ink', 0.6);
      ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(18, 12 + sway * 0.4);
      ctx.quadraticCurveTo(26 + sway, 30 + sway * 0.4, 20 + sway * 1.6, 12 + hang + sway * 0.4);
      ctx.stroke();
    }

    // ---- ağ atışı olayı: at anı (0.5 sn uzama) ----
    if (firing) {
      const prog = k.E.outCubic(k.prog(d, 0, 0.5));
      const fade = d > 1.0 ? 1 - (d - 1.0) / 0.2 : 1;
      const P0 = [24, sway * 0.4];
      const PC = [95, -18 + k.noise1(t * 1.8) * 5];   // eğri kontrol noktası (hafif canlı)
      // bezier noktası
      const bz = (f) => {
        const a = (1 - f) * (1 - f), b = 2 * (1 - f) * f, c = f * f;
        return [a * P0[0] + b * PC[0] + c * T[0], a * P0[1] + b * PC[1] + c * T[1]];
      };
      // ip: serbest ince çizgi ink rengiyle
      ctx.strokeStyle = k.rgba('ink', 0.85 * fade);
      ctx.lineWidth = 5; ctx.lineCap = 'round';
      ctx.beginPath();
      const STEPS = 24, end = Math.max(prog, 0.02);
      for (let i = 0; i <= STEPS; i++) {
        const pt = bz(end * i / STEPS);
        if (i === 0) ctx.moveTo(pt[0], pt[1]); else ctx.lineTo(pt[0], pt[1]);
      }
      ctx.stroke();
      // ip ucunda topak
      const tip = bz(end);
      ctx.fillStyle = k.rgba('ink', 0.9 * fade);
      ctx.beginPath(); ctx.arc(tip[0], tip[1], 6, 0, k.TAU); ctx.fill();

      // hedefe vardıysa: yapışma yıldızı (ağ tutamacı)
      if (prog >= 1) {
        const g2 = k.prog(d, 0.5, 0.75);
        ctx.strokeStyle = k.rgba('ink', 0.7 * (1 - g2 * 0.3) * fade);
        ctx.lineWidth = 4; ctx.lineCap = 'round';
        for (let i = 0; i < 5; i++) {
          const a = -0.5 + i * 0.5 + k.hash(i + 93) * 0.3;
          const len = 26 * k.E.outBack(g2);
          ctx.beginPath();
          ctx.moveTo(T[0], T[1]);
          ctx.lineTo(T[0] + Math.cos(a) * len, T[1] + Math.sin(a) * len * 0.8);
          ctx.stroke();
        }
        k.glow(T[0], T[1], 22, 'dim', 0.4 * fade);
      }
    }
    ctx.restore();
  },
};

// food/cake — tabakta dilim pasta + mum; candle anında alev söner ve duman yükselir
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır; (0,0) dilimin merkezidir.
export default {
  name: 'cake', category: 'food',
  desc: 'Tabakta dilim pasta ve mum; candle anında alev söner, duman yükselir',
  tags: ['pasta', 'cake', 'dilim', 'slice', 'mum', 'candle', 'doğum günü', 'birthday', 'tatlı'],
  box: [-85, -100, 85, 100],
  bleed: 45,
  anchor: 'dilim merkezi (0,0)',
  points: { top: [0, -78] },
  params: {
    candle: { type: 'time', default: null, desc: 'mum üfleme anı (alev söner + duman yükselir, 1.4 sn)' },
    color: { type: 'color', default: 'accent' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const sponge = k.rgba('panel2'), cream = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const d = p.candle == null ? -1 : t - p.candle;

    // alev: üflemeden önce titrer, 0→0.25 sn'de söner
    const lit = d < 0 ? 1 : Math.max(0, 1 - d / 0.25);
    // duman: 0.1→1.4 sn'de fitilden yükselir
    const smoke = d < 0.1 ? -1 : (d - 0.1) / 1.3;
    const flick = k.noise1(Math.floor(t * 18) * 3.7) * 2.5; // alev titremesi (idle)

    ctx.save();

    // tabak
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(7, 62, 74, 17, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel');
    ctx.beginPath(); ctx.ellipse(0, 56, 74, 17, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = LW;
    ctx.beginPath(); ctx.ellipse(0, 56, 74, 17, 0, 0, k.TAU); ctx.stroke();

    // dilim (yan görünüm: kama — arkası kalın, ucu sivri)
    const tri = (dy) => {
      ctx.beginPath();
      ctx.moveTo(-48, 2 + dy); ctx.lineTo(48, 2 + dy); ctx.lineTo(-48, 58 + dy);
      ctx.closePath();
    };
    ctx.save(); ctx.translate(7, 6); tri(0); ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fill(); ctx.restore();
    // alt katman (sünger)
    tri(0); ctx.fillStyle = sponge; ctx.fill();
    // krema ara katman
    ctx.beginPath();
    ctx.moveTo(-48, 20); ctx.lineTo(20, 20); ctx.lineTo(-48, 38);
    ctx.closePath(); ctx.fillStyle = cream; ctx.fill();
    // üst krema kaplama
    ctx.beginPath();
    ctx.moveTo(-48, 2); ctx.lineTo(48, 2); ctx.lineTo(48, -6); ctx.lineTo(-48, -6);
    ctx.closePath(); ctx.fillStyle = cream; ctx.fill();
    // krema damlaları (üst kenardan sarkan)
    ctx.fillStyle = cream;
    for (let i = 0; i < 4; i++) {
      const dx = -30 + i * 22;
      ctx.beginPath(); ctx.arc(dx, 2, 5.5, 0, Math.PI); ctx.fill();
      ctx.fillRect(dx - 5.5, -4, 11, 6);
    }
    tri(0); ctx.strokeStyle = line; ctx.lineWidth = LW; ctx.stroke();
    // kiraz (üstte)
    ctx.fillStyle = k.rgba('red');
    ctx.beginPath(); ctx.arc(20, -16, 10, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(20, -16, 10, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath(); ctx.arc(17, -19, 3, 0, k.TAU); ctx.fill();

    // mum (dilimin üstünde)
    const cx = -20, cTop = -44;
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    k.rrect(cx - 5 + 3, -38, 10, 40, 5); ctx.fill();
    ctx.fillStyle = k.rgba('panel');
    k.rrect(cx - 5, -40, 10, 42, 5); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 4;
    k.rrect(cx - 5, -40, 10, 42, 5); ctx.stroke();
    // mum şeritleri
    ctx.strokeStyle = k.rgba(p.color, 0.8); ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath(); ctx.moveTo(cx - 5, -30 + i * 12); ctx.lineTo(cx + 5, -26 + i * 12); ctx.stroke();
    }
    // fitil
    ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(cx, -40); ctx.lineTo(cx, cTop); ctx.stroke();

    // alev
    if (lit > 0.01) {
      const fh = 26 * lit, fw = 10 * lit;
      ctx.save();
      ctx.translate(cx + flick * lit, cTop - fh / 2 + 2);
      ctx.globalAlpha = lit;
      k.glow(0, 0, 26 * lit, 'yellow', 0.4 * lit);
      ctx.fillStyle = k.rgba('yellow');
      ctx.beginPath(); ctx.ellipse(0, 0, fw, fh / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('red', 0.85);
      ctx.beginPath(); ctx.ellipse(0, fh * 0.14, fw * 0.5, fh * 0.28, 0, 0, k.TAU); ctx.fill();
      ctx.restore();
    }

    // premium parlama (sol üst, krema üzerinde)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-34, -2, 16, 6, -0.2, 0, k.TAU); ctx.fill();

    ctx.restore();

    // duman (fitilden yükselir, dağılır)
    if (smoke >= 0 && smoke < 1) {
      ctx.strokeStyle = k.rgba('dim', 0.65); ctx.lineCap = 'round';
      for (let i = 0; i < 3; i++) {
        const ph = Math.min(Math.max((smoke * 1.5 - i * 0.22), 0), 1);
        if (ph <= 0 || ph >= 1) continue;
        const sy = cTop - 4 - ph * 70;
        const sx = cx + Math.sin(ph * 5 + i * 2.2) * 11 * ph;
        ctx.globalAlpha = 0.65 * (1 - ph);
        ctx.lineWidth = 4 + ph * 5;
        ctx.beginPath();
        ctx.moveTo(cx, cTop - 4);
        ctx.quadraticCurveTo(cx + 7, cTop - 4 - ph * 34, sx, sy);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
  },
};

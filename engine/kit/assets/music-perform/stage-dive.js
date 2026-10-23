// music-perform/stage-dive — sahneden kalabalığın üstüne atlayan şarkıcı; at anında yay çizer, kalabalık kollarıyla tutar.
// NOT: canvas y-aşağıdır; zemin (0,0), her şey negatif y yönünde yukarı uzar.
export default {
  name: 'stage-dive', category: 'music-perform',
  desc: 'Sahneden atlayıp kalabalığın kollarına düşen şarkıcı; at anında yay çizgisi ve toz bulutu',
  tags: ['stage dive', 'sahne', 'atlayış', 'kalabalık', 'konser', 'rock', 'stage', 'dive', 'crowd', 'concert', 'rock'],
  box: [-290, -340, 290, 14],
  bleed: 80,
  anchor: 'zemin (0,0); sahne ile kalabalığın ortası',
  points: { stage: [-205, -80], crowd: [70, -170] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'atlayış anı: şarkıcı yayı çizer, kalabalık tutar (~1.1 sn olay)' },
  },
  draw(ctx, t, p, k) {
    const LW = 4;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const inkC = k.rgba('ink', 0.8);
    const body = k.rgba(p.color);
    const acc = k.rgba('yellow');
    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };

    const d = p.at == null ? -1 : t - p.at;
    const diving = d >= 0 && d < 1.1;
    const landed = d >= 1.1;
    const a = diving ? k.clamp(d / 1.1, 0, 1) : (landed ? 1 : 0);
    const ease = a * a * (3 - 2 * a);

    // zemin
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(40, -2, 210, 10, 0, 0, k.TAU); ctx.fill();

    // ---- sahne (solda) ----
    blob(-270, -80, 132, 80, 8, k.rgba('panel2'));
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); k.rrect(-262, -72, 18, 60, 6); ctx.fill();
    blob(-262, -118, 46, 38, 8, body);                 // hoparlör
    disc(-250, -108, 10, 10, k.rgba('panel'));
    disc(-222, -108, 10, 10, k.rgba('panel'));

    // ---- kalabalık (sağda, 4 figür, kollar havada) ----
    const crowdX = [-20, 40, 100, 160];
    const armBend = landed ? 0.5 : (diving && d > 0.55 ? Math.min(1, (d - 0.55) / 0.3) * 0.5 : 0);
    const crowdBob = diving && d > 0.7 ? Math.sin((d - 0.7) * 20) * 6 * (1 - (d - 0.7) / 0.4) : (landed ? Math.sin(t * 4) * 2 : 0);
    for (let i = 0; i < crowdX.length; i++) {
      const cx = crowdX[i], s = 0.8;
      const sway = Math.sin(t * 2 + i * 1.7) * 4;
      const yy = crowdBob;
      blob(cx - 12 * s, -84 * s + yy, 24 * s, 84 * s, 10 * s, body);
      disc(cx, -96 * s + yy, 17 * s, 16 * s, body);
      ctx.fillStyle = inkC;
      ctx.beginPath(); ctx.ellipse(cx - 6, -98 * s + yy, 2.6, 2.6, 0, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + 6, -98 * s + yy, 2.6, 2.6, 0, 0, k.TAU); ctx.fill();
      for (const sd of [-1, 1]) {
        const hX = cx + sd * (14 + sway * 0.4), hY = -190 * s + yy - armBend * 26;
        const eX = cx + sd * 12, eY = -150 * s + yy + armBend * 8;
        limb(cx + sd * 10 * s, -74 * s + yy, eX, eY, 9 * s, body);
        limb(eX, eY, hX, hY, 8 * s, body);
        disc(hX, hY, 6.5 * s, 6.5 * s, body);
      }
    }

    // ---- şarkıcı ----
    const drawDiver = (bx, by, rot, crouch, mood) => {
      ctx.save(); ctx.translate(bx, by); ctx.rotate(rot);
      const sc = crouch ? 0.88 : 1;
      ctx.scale(1, sc);
      // ayaklar zemin/by'da, figür yukarı uzar (negatif y)
      limb(-8, 0, -16, -76 * sc, 12, body);
      limb(8, 0, 18, -76 * sc, 12, body);
      blob(-30, -13, 22, 13, 6, body);
      blob(10, -13, 22, 13, 6, body);
      blob(-15, -184, 30, 104, 13, body);
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-7, -168, 7, 14, 0.15, 0, k.TAU); ctx.fill();
      // kollar açık (atlayış pozu)
      limb(-10, -166, -52, -196, 11, body);
      limb(-52, -196, -78, -182, 9, body);
      disc(-78, -182, 8, 8, body);
      limb(10, -166, 52, -196, 11, body);
      limb(52, -196, 78, -182, 9, body);
      disc(78, -182, 8, 8, body);
      disc(8, -210, 20, 19, body);
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(1, -217, 6.5, 4.5, -0.4, 0, k.TAU); ctx.fill();
      ctx.fillStyle = inkC;
      ctx.beginPath(); ctx.ellipse(-1, -212, 3, 3, 0, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(17, -212, 3, 3, 0, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = inkC; ctx.lineWidth = 3;
      if (mood === 'happy') { ctx.beginPath(); ctx.arc(8, -204, 7, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
      else { ctx.beginPath(); ctx.moveTo(2, -200); ctx.lineTo(14, -200); ctx.stroke(); }
      ctx.restore();
    };

    if (!diving && !landed) {
      // sahnede bekler: dizler bükük, hafif zıplar (heyecan)
      const bob = Math.abs(Math.sin(t * 3.4)) * -10;
      drawDiver(-190, -80 + bob, 0, true, 'neutral');
      // mikrofon sol elde
      const mhX = -190 - 78, mhY = -80 + bob - 160;
      limb(mhX, mhY, mhX - 18, mhY + 22, 7, k.rgba('panel2'));
      disc(mhX - 20, mhY + 26, 7, 7, acc);
    } else if (diving) {
      const bx = -190 + 250 * ease;                                   // -190 → 60
      const by = -80 - 40 * ease - 130 * Math.sin(a * Math.PI);        // yay: -80 → zirve -230 → iniş -120
      drawDiver(bx - 100 * ease, by, 1.25 * ease, false, 'happy');     // giderek baş-öne eğilir
      // yay çizgisi (hız izi)
      ctx.strokeStyle = k.rgba('yellow', 0.5 * (1 - a * 0.5)); ctx.lineWidth = 4;
      ctx.beginPath();
      for (let i = 0; i <= 16; i++) {
        const aa = a * i / 16;
        const e2 = aa * aa * (3 - 2 * aa);
        const xx = -190 + 250 * e2 - 100 * e2;
        const yy2 = -80 - 40 * e2 - 130 * Math.sin(aa * Math.PI);
        if (i === 0) ctx.moveTo(xx, yy2); else ctx.lineTo(xx, yy2);
      }
      ctx.stroke();
    } else {
      // kalabalığın kollarında yatıyor, hafif zıplatılıyor
      const bob = Math.sin(t * 4) * 5;
      drawDiver(-40, -120 + bob, 1.25, false, 'happy');
    }

    // iniş tozu + flaş: atlayışın son 0.3 sn'si
    if (diving && d > 0.8) {
      const g = (d - 0.8) / 0.3;
      k.glow(60, -200, 60 * g, 'yellow', 0.35 * (1 - g));
      ctx.fillStyle = k.rgba('dim', 0.5 * (1 - g));
      for (let i = 0; i < 8; i++) {
        const h1 = k.hash(i * 3 + 9);
        const px = 60 + (h1 - 0.5) * (80 + g * 90);
        const py = -190 - k.hash(i * 7) * 40 * g;
        ctx.beginPath(); ctx.ellipse(px, py, 9, 6, 0, 0, k.TAU); ctx.fill();
      }
    }
  },
};

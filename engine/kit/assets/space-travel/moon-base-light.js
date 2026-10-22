// space-travel/moon-base-light — gece sahnesi hissi veren ay üssü kubbesi:
// pencerelerde ışık yanıp sönmesi, anten sinyali, kubbe üstü parlama (canlı idle).
// NOT: canvas y-aşağıdır; (0,0) zemin çizgisindedir (üs tabanı).
export default {
  name: 'moon-base-light', category: 'space-travel',
  desc: 'Gece ışıklı ay üssü kubbesi: yanıp sönen pencereler, anten sinyali ve kubbe parlaması',
  tags: ['ay üssü', 'kubbe', 'ay', 'üs', 'koloni', 'uzay', 'gece', 'moon base', 'dome', 'lunar', 'colony', 'uzay üssü', 'ışık'],
  box: [-210, -190, 210, 60],
  bleed: 40,
  anchor: 'zemin çizgisi (0,0): üs tabanı',
  points: { door: [165, -28], antenna: [0, -162], dome: [0, -60] },
  params: {
    color: { type: 'color', default: 'panel2' },
  },
  draw(ctx, t, p, k) {
    const LW = 8;
    const domeC = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const R = 118;                                  // kubbe yarıçapı
    ctx.save();

    // yıldızlar (havada serbest ince noktalar: ink rengi)
    for (let i = 0; i < 10; i++) {
      const sx = -190 + k.hash(i * 3.3) * 380;
      const sy = -180 + k.hash(i * 9.7) * 110;
      const tw = 0.35 + 0.65 * (0.5 + 0.5 * k.noise1(t * 2 + i * 4.4));
      ctx.fillStyle = k.rgba('ink', 0.55 * tw);
      ctx.beginPath(); ctx.arc(sx, sy, 1.6 + k.hash(i * 5.1) * 1.6, 0, k.TAU); ctx.fill();
    }

    // zemin: regolit şeridi + kraterler
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-204, -LW / 2, 408 + LW, 52 + LW, 14); ctx.fill();
    ctx.fillStyle = k.rgba('dim'); ctx.beginPath(); k.rrect(-204, 0, 408, 52, 14); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 3;
    for (const [cx, cw] of [[-150, 44], [96, 60], [160, 30]]) {
      ctx.beginPath(); ctx.ellipse(cx, 6, cw / 2, 9, 0, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
    }

    // kubbe: yarım daire gövde
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 0, R + LW / 2, Math.PI, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = domeC;
    ctx.beginPath(); ctx.arc(0, 0, R, Math.PI, 0); ctx.closePath(); ctx.fill();
    // kubbe kaburgaları (iç ayrım: ink, alfa 0.35)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3.5;
    for (const a of [0.3, 0.65, 1.0, 1.35, 1.7].map(v => Math.PI + v * (Math.PI / 2.35))) {
      ctx.beginPath(); ctx.moveTo(Math.cos(a) * 20, Math.sin(a) * 20);
      ctx.lineTo(Math.cos(a) * (R - 8), Math.sin(a) * (R - 8)); ctx.stroke();
    }
    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-52, -82, 34, 14, -0.5, 0, k.TAU); ctx.fill();

    // pencereler: yanıp sönen ışıklar (canlı idle)
    const winA = [0.42, 0.72, 1.02, 1.32, 1.62].map(v => Math.PI + v * (Math.PI / 2.35));
    winA.forEach((a, i) => {
      const wx = Math.cos(a) * (R - 30), wy = Math.sin(a) * (R - 30);
      const on = 0.5 + 0.5 * Math.sin(t * 0.9 + k.hash(i * 17.3) * 9) > 0.3;
      const flick = on ? 0.65 + 0.35 * k.noise1(t * 5 + i * 8) : 0.12;
      if (on) k.glow(wx, wy, 26, 'yellow', 0.45 * flick);
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(wx - 13, wy - 17, 26, 34, 9); ctx.fill();
      ctx.fillStyle = k.rgba('yellow', flick);
      ctx.beginPath(); k.rrect(wx - 13 + LW / 2, wy - 17 + LW / 2, 26 - LW, 34 - LW, 7); ctx.fill();
    });

    // hava kilidi kapısı (sağda)
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(112 - LW / 2, -58 - LW / 2, 62 + LW, 58 + LW, 12); ctx.fill();
    ctx.fillStyle = k.rgba('dim'); ctx.beginPath(); k.rrect(112, -58, 62, 58, 12); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(143, -50); ctx.lineTo(143, -8); ctx.stroke();
    // kapı üstü lamba (nabız)
    const dl = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 2.8 + 1));
    k.glow(143, -66, 18, 'yellow', 0.4 * dl);
    ctx.fillStyle = k.rgba('yellow', dl);
    ctx.beginPath(); ctx.arc(143, -66, 5.5, 0, k.TAU); ctx.fill();

    // anten: direk + sinyal halkaları (canlı idle)
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, -R + 4); ctx.lineTo(0, -158); ctx.stroke();
    ctx.fillStyle = k.rgba('ink'); ctx.beginPath(); ctx.arc(0, -158, 6, 0, k.TAU); ctx.fill();
    for (let r = 0; r < 2; r++) {
      const cyc = ((t * 0.7) + r * 0.5) % 1;
      const rr = 10 + cyc * 44;
      ctx.strokeStyle = k.rgba('yellow', 0.55 * (1 - cyc));
      ctx.lineWidth = 4 * (1 - cyc) + 1.5;
      ctx.beginPath(); ctx.arc(0, -158, rr, 0, k.TAU); ctx.stroke();
    }
    // kubbe üstü parlama: anten tabanında yumuşak ışık (canlı idle nabız)
    const tp = 0.5 + 0.5 * Math.sin(t * 3.1);
    k.glow(0, -R, 60, 'yellow', 0.18 + 0.14 * tp);

    ctx.restore();
  },
};

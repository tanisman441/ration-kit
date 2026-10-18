// music/guitar — önden görünen akustik gitar: çift bombeli gövde, ses deliği,
// sap + burgular; strum anında teller titreşir, rozet parlar.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) gövdenin merkezidir.
export default {
  name: 'guitar', category: 'music',
  desc: 'Akustik gitar; strum anında teller titreşir ve ses deliği rozeti parlar',
  tags: ['gitar', 'akustik gitar', 'müzik', 'çalgı', 'guitar', 'acoustic', 'music', 'instrument', 'tel'],
  box: [-200, -135, 200, 135],
  bleed: 30,
  anchor: 'gövdenin merkezi (0,0)',
  points: { hole: [-47, 12], head: [148, -108], bridge: [-45, 74], body: [-47, 45] },
  params: {
    color: { type: 'color', default: 'panel2' },
    strum: { type: 'time', default: null, desc: 'telleri çalma anı: tel titreşimi + rozet parlaması (0.8 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55), acc = k.rgba('red', 0.95);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    ctx.save();
    // hafif süzülme
    ctx.rotate(Math.sin(t * 1.2) * 0.015);

    const d = p.strum == null ? -1 : t - p.strum;
    const strumming = d >= 0 && d < 0.8;

    // ---- gövde: iki üst üste elips (alt + üst bombe)
    const bodyEll = (cx, cy, rx, ry) => {
      // gölge (sağ alt)
      ctx.fillStyle = k.rgba(p.color);
      ctx.beginPath(); ctx.ellipse(cx + 6, cy + 6, rx, ry, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('ink', 0.12);
      ctx.beginPath(); ctx.ellipse(cx + 6, cy + 6, rx, ry, 0, 0, k.TAU); ctx.fill();
      // kontur + gövde
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.ellipse(cx, cy, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    bodyEll(-40, 45, 62, 55);   // alt bombe
    bodyEll(-55, -35, 48, 42);  // üst bombe

    // sol üst parlama (alt bombe)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-72, 18, 26, 14, -0.5, 0, k.TAU); ctx.fill();

    // ---- ses deliği + rozet
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(-47, 12, 23, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.85); ctx.beginPath(); ctx.arc(-47, 12, 20, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = acc; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(-47, 12, 27, 0, k.TAU); ctx.stroke();
    if (strumming) k.glow(-47, 12, 52, 'red', 0.5 * (1 - d / 0.8));

    // ---- köprü (bridge) + eşik pimleri
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-66, 68, 46, 16, 8); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.8); ctx.beginPath(); k.rrect(-62, 71, 38, 10, 5); ctx.fill();

    // ---- sap: gövdeden sağ üste uzanan döndürülmüş dikdörtgen
    const N0 = [-28, -58], N1 = [148, -108];
    const ang = Math.atan2(N1[1] - N0[1], N1[0] - N0[0]);
    const len = Math.hypot(N1[0] - N0[0], N1[1] - N0[1]);
    ctx.save();
    ctx.translate(N0[0], N0[1]); ctx.rotate(ang);
    // gölge + kontur + gövde
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(6, -13 + 6, len, 26, 10); ctx.fill();
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-LW / 2, -13 - LW / 2, len + LW, 26 + LW, 10); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.75);
    ctx.beginPath(); k.rrect(0, -13, len, 26, 8); ctx.fill();
    // perdeler (iç ayrım çizgileri)
    ctx.strokeStyle = k.rgba('bg', 0.35); ctx.lineWidth = 2.5;
    for (let i = 1; i < 7; i++) {
      const x = (i / 7) * len;
      ctx.beginPath(); ctx.moveTo(x, -13); ctx.lineTo(x, 13); ctx.stroke();
    }
    // burgu (head): sapın ucunda genişleyen blok
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(len - 4, -30, 58, 60, 10); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); k.rrect(len - 1, -27, 52, 54, 8); ctx.fill();
    // burgu pimleri (iki yana)
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 5;
    for (let i = 0; i < 3; i++) {
      const x = len + 8 + i * 14;
      ctx.beginPath(); ctx.moveTo(x, -30); ctx.lineTo(x, -42); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, 30); ctx.lineTo(x, 42); ctx.stroke();
      ctx.fillStyle = k.rgba('ink', 0.7);
      ctx.beginPath(); ctx.arc(x, -44, 4, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(x, 44, 4, 0, k.TAU); ctx.fill();
    }
    ctx.restore();

    // ---- teller: köprüden burguya, 6 paralel ince çizgi (ink rengi)
    const perpX = -(N1[1] - N0[1]), perpY = N1[0] - N0[0];
    const pl = Math.hypot(perpX, perpY);
    const ux = perpX / pl, uy = perpY / pl;
    const bridge = [-43, 74];
    const headEnd = [N1[0] + Math.cos(ang) * 46, N1[1] + Math.sin(ang) * 46];
    for (let i = 0; i < 6; i++) {
      const o = (i - 2.5) * 4.4;
      const bx = bridge[0] + ux * o * 0.6, by = bridge[1] + uy * o * 0.6;
      const hx = headEnd[0] + ux * o, hy = headEnd[1] + uy * o;
      const mx = (bx + hx) / 2, my = (by + hy) / 2;
      // strum: orta nokta sönümlü salınır
      let vx = 0, vy = 0;
      if (strumming) {
        const amp = (1 - d / 0.8) * 9 * Math.sin(d * 34 + i * 0.9);
        vx = ux * amp; vy = uy * amp;
      }
      ctx.strokeStyle = k.rgba('ink', 0.65); ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.quadraticCurveTo(mx + vx, my + vy, hx, hy);
      ctx.stroke();
    }

    ctx.restore();
  },
};

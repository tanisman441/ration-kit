// sports-action/home-run — beyzbol home-run vuruşu. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) vurucunun ayakları, top sağdan gelir ve sağ üste fırlar.
export default {
  name: 'home-run',
  category: 'sports-action',
  desc: 'Topa savrulan sopasıyla home-run vuran beyzbolcu; time-param at anında vuruş ve topun fırlayışı',
  tags: ['home run', 'homerun', 'beyzbol', 'sopa', 'vuruş', 'baseball', 'home run', 'bat', 'batter', 'swing', 'hit'],
  box: [-175, -235, 175, 24],
  bleed: 60,
  anchor: 'vurucunun ayakları (0,0); top sağdan gelir, sağ üste fırlar',
  points: { bat: [-58, -176] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'vuruş anı: sopa savrulur, top fırlatılır' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const easeOut = x => 1 - Math.pow(1 - x, 3);

    const olimb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const oblob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const odisc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };

    const d = p.at == null ? -1 : t - p.at;

    // --- zemin ---
    ctx.fillStyle = k.rgba('bg', 0.3);
    ctx.beginPath(); ctx.ellipse(-50, -5, 56, 9, 0, 0, k.TAU); ctx.fill();
    // vurucu kutusu (home plate çizgisi)
    ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-110, -2); ctx.lineTo(30, -2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-40, -2); ctx.lineTo(-22, -16); ctx.lineTo(-4, -2); ctx.closePath(); ctx.stroke();

    // --- vurucu ---
    const bob = 2 * Math.sin((k.TAU * t) / 2.4);
    const px = -50;
    // bacaklar (geniş duruş)
    olimb(px - 6, -128, px - 30, -10, 20, body);
    oblob(px - 44, -16, 30, 13, 6, body);
    olimb(px + 6, -128, px + 30, -10, 20, body);
    oblob(px + 16, -16, 30, 13, 6, body);
    // gövde (vuruşa hazır, hafif çömelmiş)
    oblob(px - 31, -236 + bob, 62, 110, 28, body);
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(px + 16, -156 + bob, 12, 38, 0.1, 0, k.TAU); ctx.fill();
    // baş
    const hbx = px + 4, hby = -244 + bob;
    odisc(hbx, hby, 36, 34, body);
    const blink = (t % 4.6) < 0.12 ? 0.2 : 1;
    ctx.fillStyle = inkC;
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(s * 10 + hbx, hby - 2, 4, 4 * blink, 0, 0, k.TAU); ctx.fill(); }
    ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(hbx, hby + 10, 9, Math.PI * 0.2, Math.PI * 0.8); ctx.stroke();
    // kask (vurucu kaskı — yarım kubbe, vurgu değil gövde rengi koyusu)
    ctx.fillStyle = k.rgba('bg', 0.18);
    ctx.beginPath(); ctx.ellipse(hbx, hby - 14, 37, 22, 0, Math.PI, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(hbx - 13, hby - 12, 13, 9, -0.4, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(px - 16, -210 + bob, 9, 26, 0.12, 0, k.TAU); ctx.fill();

    // --- sopa ---
    // savrulma: -2.3 rad (omuzda bekleyiş) → +0.95 rad (ileri), 0.3 sn
    const swingP = d < 0 ? 0 : easeOut(k.clamp(d / 0.3, 0, 1));
    const batA = k.lerp(-2.3, 0.95, swingP);
    const gripX = px + 26, gripY = -176 + bob;
    const batLen = 96;
    const tipX = gripX + batLen * Math.sin(batA), tipY = gripY + batLen * Math.cos(batA);
    // sopa (kalın uç, ince sap)
    ctx.strokeStyle = line; ctx.lineWidth = 13 + LW;
    ctx.beginPath(); ctx.moveTo(gripX, gripY); ctx.lineTo(tipX, tipY); ctx.stroke();
    ctx.strokeStyle = k.rgba('panel'); ctx.lineWidth = 13;
    ctx.beginPath(); ctx.moveTo(gripX, gripY); ctx.lineTo(tipX, tipY); ctx.stroke();
    odisc(tipX, tipY, 11, 11, k.rgba('panel'));   // sopa ucu topuzu
    // kollar (sopayı tutan)
    olimb(px + 18, -196 + bob, gripX, gripY, 17, body);
    olimb(px + 14, -188 + bob, gripX - 8, gripY + 10, 17, body);
    odisc(gripX, gripY, 10, 10, body);

    // --- top ---
    // geliş: at-1.1 → at arası sağdan süzülür; vuruşta sağ üste fırlar
    let bx = 170, by = -118, flying = false;
    if (d < -1.1) { bx = 190; by = -112; }
    else if (d < 0) {
      const q = k.clamp((d + 1.1) / 1.1, 0, 1);
      bx = k.lerp(190, -8, q); by = k.lerp(-112, -120, q) - 14 * Math.sin(Math.PI * q);
    } else {
      const dt = d;
      bx = -8 + 300 * dt; by = -120 - 235 * dt + 420 * dt * dt;   // fırlayış fiziği
      flying = dt < 0.85;
    }
    if (flying) k.glow(bx, by, 30, 'accent', 0.4 * (1 - d / 0.85));
    // hız çizgileri (fırlayışta)
    if (flying) {
      ctx.strokeStyle = k.rgba('ink', 0.45 * (1 - d / 0.85)); ctx.lineWidth = 4;
      for (let i = 0; i < 5; i++) {
        const a = -0.66 + (i - 2) * 0.09;   // fırlayış yönünün tersi
        const x1 = bx - 70 * Math.cos(a), y1 = by - 70 * Math.sin(a) + (i - 2) * 4;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(bx - 18, by + (i - 2) * 4); ctx.stroke();
      }
    }
    // vuruş anı flaşı + halka
    if (d >= 0 && d < 0.2) {
      k.glow(-8, -120, 56, 'yellow', 0.6 * (1 - d / 0.2));
      ctx.strokeStyle = k.rgba('yellow', 0.7 * (1 - d / 0.2)); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.ellipse(-8, -120, 20 + d * 260, 16 + d * 180, 0, 0, k.TAU); ctx.stroke();
    }
    odisc(bx, by, 11, 11, k.rgba('panel'));
    ctx.strokeStyle = inkC; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(bx - 4, by, 7, -1.1, 1.1); ctx.stroke();   // beyzbol dikişi
    ctx.beginPath(); ctx.arc(bx + 4, by, 7, Math.PI - 1.1, Math.PI + 1.1); ctx.stroke();
  },
};

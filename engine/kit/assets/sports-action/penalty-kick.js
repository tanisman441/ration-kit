// sports-action/penalty-kick — penaltı vuruşu anı. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) penaltı noktası, kale +x yönünde sağdadır.
export default {
  name: 'penalty-kick',
  category: 'sports-action',
  desc: 'Penaltı vuran futbolcu figürü ve kale; time-param at anında bacak savrulur, top filelere fırlar',
  tags: ['penaltı', 'penalti', 'şut', 'vuruş', 'futbol', 'kale', 'gol', 'penalty', 'penalty kick', 'shoot', 'football', 'soccer', 'goal'],
  box: [-180, -292, 200, 24],
  bleed: 45,
  anchor: 'penaltı noktası (0,0); kale +x yönünde sağda, figürün ayakları zeminde',
  points: { ball: [-28, -14] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'vuruş anı: bacak savrulur, top kaleye fırlar' },
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

    // --- kale ---
    const GX0 = 80, GW = 92, GTOP = -172;
    // file (arka ağ)
    ctx.strokeStyle = k.rgba('ink', 0.28); ctx.lineWidth = 2;
    for (let i = 0; i <= 5; i++) {
      const nx = GX0 + (GW * i) / 5;
      ctx.beginPath(); ctx.moveTo(nx, GTOP); ctx.lineTo(nx, -4); ctx.stroke();
    }
    for (let j = 0; j <= 5; j++) {
      const ny = GTOP + ((0 - GTOP) * j) / 5;
      ctx.beginPath(); ctx.moveTo(GX0, ny); ctx.lineTo(GX0 + GW, ny); ctx.stroke();
    }
    // file dalgalanması (top girince)
    const FLY = 0.55;
    const bulge = d > FLY ? Math.min(1, (d - FLY) / 0.35) * 12 : 0;
    if (bulge > 0) {
      ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(GX0 + GW - 24, -60); ctx.quadraticCurveTo(GX0 + GW + bulge, -95, GX0 + GW - 24, -130); ctx.stroke();
    }
    // direkler (panel: iki temada da açık ton)
    oblob(GX0, GTOP, 13, -GTOP - 4, 6, k.rgba('panel'));
    oblob(GX0 + GW - 13, GTOP, 13, -GTOP - 4, 6, k.rgba('panel'));
    oblob(GX0, GTOP, GW, 13, 6, k.rgba('panel'));

    // --- zemin gölgesi ---
    ctx.fillStyle = k.rgba('bg', 0.3);
    ctx.beginPath(); ctx.ellipse(-70, -5, 52, 9, 0, 0, k.TAU); ctx.fill();

    // --- futbolcu ---
    const bob = 2 * Math.sin((k.TAU * t) / 2.4);      // nefes
    const swing = d < 0 ? 0 : easeOut(k.clamp(d / 0.25, 0, 1));   // vuruş salınımı
    const legA = k.lerp(-0.55, 1.05, swing);          // bacak açısı (geriden ileriye)
    const px = -70;
    // duran bacak
    olimb(px - 8, -128, px - 14, -10, 19, body);
    oblob(px - 28, -16, 30, 13, 6, body);             // ayak
    // vuran bacak (diz bükük, salınım)
    const hx = px + 8, hy = -128 + bob * 0.4;
    const kx = hx + 58 * Math.sin(legA), ky = hy + 58 * Math.cos(legA);
    const bend = 0.5 - 0.35 * swing;
    const fx = kx + 54 * Math.sin(legA - bend), fy = ky + 54 * Math.cos(legA - bend);
    olimb(hx, hy, kx, ky, 19, body);
    olimb(kx, ky, fx, fy, 16, body);
    oblob(fx - 15, fy - 13, 30, 13, 6, body);
    // gövde (vuruşta öne eğilme)
    const lean = 0.08 + 0.22 * swing;
    const leanX = Math.tan(lean) * 70;
    oblob(-31 + px + leanX * 0.3, -238 + bob, 62, 112, 28, body);
    ctx.fillStyle = k.rgba('bg', 0.12);               // sağ alt gölge
    ctx.beginPath(); ctx.ellipse(px + 16 + leanX * 0.3, -158 + bob, 12, 40, 0.1, 0, k.TAU); ctx.fill();
    // kollar (denge)
    olimb(px + 24, -200 + bob, px + 66, -168 + bob - 20 * swing, 17, body);
    odisc(px + 66, -168 + bob - 20 * swing, 10, 10, body);
    olimb(px + 22, -200 + bob, px - 24, -160 + bob, 17, body);
    odisc(px - 24, -160 + bob, 10, 10, body);
    // baş
    const hbx = px + 8, hby = -246 + bob;
    odisc(hbx, hby, 36, 34, body);
    const ey = hby - 2, ex = 10;
    const blink = (t % 4.3) < 0.12 ? 0.2 : 1;
    ctx.fillStyle = inkC;
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(s * ex + hbx, ey, 4, 4 * blink, 0, 0, k.TAU); ctx.fill(); }
    ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(hbx, hby + 8, 10, Math.PI * 0.2, Math.PI * 0.8); ctx.stroke(); // odaklı ağız
    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(hbx - 13, hby - 12, 13, 9, -0.4, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(px - 14 + leanX * 0.3, -212 + bob, 9, 26, 0.12, 0, k.TAU); ctx.fill();

    // --- top ---
    let bx = -28, by = -14;
    let flying = false, fp = 0;
    if (d >= 0) {
      fp = k.clamp(d / FLY, 0, 1);
      const e = easeOut(fp);
      bx = k.lerp(-28, GX0 + GW / 2 - 8, e);
      by = k.lerp(-14, -98, e) - 26 * Math.sin(Math.PI * fp);   // kavisli fırlayış
      flying = d < 0.9;
    }
    if (flying) k.glow(bx, by, 30, 'accent', 0.35 * (1 - fp));
    // hız çizgileri
    if (flying) {
      ctx.strokeStyle = k.rgba('ink', 0.4 * (1 - fp)); ctx.lineWidth = 4;
      for (let i = 0; i < 4; i++) {
        const ly = by - 12 + i * 9 + k.noise1(t * 9 + i * 5) * 3;
        ctx.beginPath(); ctx.moveTo(bx - 62 - i * 8, ly); ctx.lineTo(bx - 20, ly); ctx.stroke();
      }
    }
    // vuruş flaşı
    if (d >= 0 && d < 0.14) k.glow(-28, -16, 44, 'yellow', 0.5 * (1 - d / 0.14));
    // top (zemin teması gölgesi)
    if (!flying && d < 0) {
      ctx.fillStyle = k.rgba('bg', 0.35);
      ctx.beginPath(); ctx.ellipse(bx, -3, 18, 5, 0, 0, k.TAU); ctx.fill();
    }
    odisc(bx, by, 13, 13, k.rgba('panel'));
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.arc(bx, by, 3.5, 0, k.TAU); ctx.fill();
    for (let i = 0; i < 4; i++) {
      const a2 = (k.TAU * i) / 4 + 0.5;
      ctx.beginPath(); ctx.arc(bx + 8 * Math.cos(a2), by + 8 * Math.sin(a2), 2, 0, k.TAU); ctx.fill();
    }
  },
};

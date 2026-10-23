// music-perform/drum-solo — solo atan baterist: vuruş anında çubuklar iner, davul derisi titrer.
// NOT: canvas y-aşağıdır; zemin (0,0), her şey negatif y yönünde yukarı uzar.
export default {
  name: 'drum-solo', category: 'music-perform',
  desc: 'Solo atan baterist; hit anında çubuklar vurur, davullar titrer',
  tags: ['bateri', 'davul', 'baterist', 'davulcu', 'konser', 'müzik', 'drums', 'drummer', 'drum solo', 'concert', 'music'],
  box: [-200, -270, 200, 14],
  bleed: 60,
  anchor: 'zemin (0,0); setin ortası',
  points: { head: [0, -232], cymbal: [118, -208] },
  params: {
    color: { type: 'color', default: 'dim' },
    hit: { type: 'time', default: null, desc: 'vuruş anı: çubuklar iner, deriler titrer (~0.4 sn olay)' },
  },
  draw(ctx, t, p, k) {
    const LW = 4;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const inkC = k.rgba('ink', 0.8);
    const body = k.rgba(p.color);
    const acc = k.rgba('red');
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

    const d = p.hit == null ? -1 : t - p.hit;
    const hitOn = d >= 0 && d < 0.4;
    const br = Math.sin(t * k.TAU / 2.4) * 1.6;          // nefes
    const blink = (((t + 2.2) % 4.4) < 0.12);

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -2, 130, 11, 0, 0, k.TAU); ctx.fill();

    // ---- davul seti ----
    const wob = hitOn ? Math.sin(d * 60) * 3 * (1 - d / 0.4) : 0;   // deri titremesi
    // bas davul
    disc(0, -58, 54, 46, body);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-18, -72, 15, 10, -0.4, 0, k.TAU); ctx.fill();
    disc(0, -58, 40, 32, k.rgba('panel2'));
    // üst deri nabzı
    if (hitOn) { ctx.fillStyle = k.rgba('red', 0.25 * (1 - d / 0.4)); ctx.beginPath(); ctx.ellipse(0, -58, 40 + wob, 32 + wob, 0, 0, k.TAU); ctx.fill(); }
    // tomlar
    disc(-88, -104 + wob * 0.4, 30, 26, body);
    disc(-88, -104 + wob * 0.4, 22, 18, k.rgba('panel2'));
    disc(88, -104 - wob * 0.4, 30, 26, body);
    disc(88, -104 - wob * 0.4, 22, 18, k.rgba('panel2'));
    limb(-88, -80, -88, -10, 8, k.rgba('panel2'));
    limb(88, -80, 88, -10, 8, k.rgba('panel2'));
    // zil (sağda)
    const cymW = hitOn ? Math.sin(d * 55) * 5 * (1 - d / 0.4) : Math.sin(t * 2.1) * 1.2;
    ctx.save(); ctx.translate(118, -208); ctx.rotate(cymW * 0.012);
    limb(0, 0, 0, 208, 8, k.rgba('panel2'));
    ctx.beginPath(); ctx.ellipse(0, 0, 44, 10, 0, 0, k.TAU); ctx.fillStyle = line; ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, -2, 42, 9, 0, 0, k.TAU); ctx.fillStyle = acc; ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-13, -4, 10, 3, -0.1, 0, k.TAU); ctx.fill();
    ctx.restore();

    // ---- baterist ----
    const hipX = 0, hipY = -96;
    // bacaklar (pedalda)
    limb(hipX - 10, hipY, -30, -12, 12, body);
    limb(hipX + 10, hipY, 30, -12, 12, body);
    blob(-40, -13, 22, 13, 6, body);
    blob(20, -13, 22, 13, 6, body);
    // gövde
    const ty = -200 - br * 0.4;
    blob(-15, ty, 30, 104, 13, body);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-7, ty + 16, 7, 14, 0.15, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(-15 + 20, ty + 104 - 26, 12, 22, 6); ctx.fill();
    // baş
    const hxx = 0, hyy = -232 - br * 0.5;
    disc(hxx, hyy, 20, 19, body);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(hxx - 7, hyy - 7, 6.5, 4.5, -0.4, 0, k.TAU); ctx.fill();
    ctx.fillStyle = inkC;
    const ey = blink ? 0.8 : 3;
    ctx.beginPath(); ctx.ellipse(hxx - 9, hyy - 2, 3, ey, 0, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hxx + 9, hyy - 2, 3, ey, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = inkC; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(hxx, hyy + 5, 7, Math.PI * 0.2, Math.PI * 0.8); ctx.stroke();

    // kollar + çubuklar: vuruşta hızlı iner
    const swing = hitOn ? Math.sin((d / 0.4) * Math.PI) : 0;
    for (const s of [-1, 1]) {
      const shoX = s * 12, shoY = -180 - br * 0.4;
      const bobY = hitOn ? 0 : Math.sin(t * 5 + s) * 3;
      const elX = s * 30, elY = -150 + bobY - swing * 26;
      const handX = s * 52, handY = -128 + bobY - swing * 52;
      limb(shoX, shoY, elX, elY, 11, body);
      limb(elX, elY, handX, handY, 9, body);
      disc(handX, handY, 8, 8, body);
      // çubuk
      const stickA = -0.9 + (hitOn ? swing * 1.3 : Math.sin(t * 5 + s * 2) * 0.08);
      const tx = handX + Math.cos(stickA) * 46, tyy = handY + Math.sin(stickA) * 46;
      ctx.strokeStyle = line; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(handX, handY); ctx.lineTo(tx, tyy); ctx.stroke();
      ctx.strokeStyle = k.rgba('panel'); ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(handX, handY); ctx.lineTo(tx, tyy); ctx.stroke();
      // vuruş çakması
      if (hitOn && swing > 0.75) {
        const cx2 = s < 0 ? -88 : 88;
        k.glow(cx2, -126, 26, 'red', 0.55 * (1 - d / 0.4));
        ctx.strokeStyle = k.rgba('red', 0.8 * (1 - d / 0.4)); ctx.lineWidth = 3;
        const rr = 12 + d * 90;
        ctx.beginPath(); ctx.arc(cx2, -126, rr, 0, k.TAU); ctx.stroke();
        ctx.fillStyle = k.rgba('yellow', 0.9 * (1 - d / 0.4));
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * k.TAU + k.hash(i) * 0.5;
          ctx.beginPath(); ctx.arc(cx2 + Math.cos(a) * rr, -126 + Math.sin(a) * rr * 0.6, 3, 0, k.TAU); ctx.fill();
        }
      }
    }
  },
};

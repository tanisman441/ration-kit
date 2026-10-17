// environment/wall — alçak beton duvar/siper; hit anında toz + parça + çatlak.
// NOT: canvas y-aşağıdır; zemin (0,0), duvar negatif y yönünde yukarı uzar.
export default {
  name: 'wall',
  category: 'environment',
  desc: 'Alçak beton duvar/siper; vurulma anında toz bulutu ve parça çıkarır',
  tags: ['duvar', 'siper', 'beton', 'korunak', 'wall', 'cover', 'concrete', 'barrier'],
  box: [-170, -120, 170, 12],
  bleed: 30,
  anchor: 'zemin (0,0); duvar yukarı uzar, boy ~110 birim',
  points: { top: [0, -110] },
  params: {
    color: { type: 'color', default: 'dim' },
    hit: { type: 'time', default: null, desc: 'vurulma anı: toz + parça + çatlak' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const conc = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    const d = p.hit == null ? -1 : t - p.hit;
    const HX = 0, HY = -104; // vuruş noktası (üst kenar ortası)

    // vuruşta hafif sarsıntı
    const shake = d >= 0 && d < 0.12 ? Math.sin(d * 160) * 2 : 0;
    ctx.save();
    ctx.translate(shake, 0);

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -5, 168, 10, 0, 0, k.TAU); ctx.fill();

    // gövde
    blob(-160, -108, 320, 104, 10, conc);

    // üst kenar yongaları (koyu çentikler)
    ctx.fillStyle = k.rgba('bg', 0.4);
    for (let i = 0; i < 4; i++) {
      const cx = -120 + i * 78 + (k.hash(i * 11 + 3) - 0.5) * 30;
      const cw = 14 + k.hash(i * 17 + 5) * 16;
      ctx.beginPath(); k.rrect(cx, -110, cw, 9, 4); ctx.fill();
    }

    // beton derz çizgileri (iç ayrım)
    ctx.strokeStyle = k.rgba('bg', 0.35); ctx.lineWidth = 3;
    for (const sx of [-80, 80]) {
      ctx.beginPath(); ctx.moveTo(sx, -100); ctx.lineTo(sx, -12); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(-152, -56); ctx.lineTo(152, -56); ctx.stroke();

    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); k.rrect(-150, -102, 110, 12, 6); ctx.fill();

    ctx.restore();

    if (d < 0) return;

    // vuruş flaşı
    if (d < 0.12) k.glow(HX, HY, 46, 'yellow', 0.5 * (1 - d / 0.12));

    // çatlak (kalıcı, 0.15 sn'de belirir)
    const ca = k.clamp(d / 0.15, 0, 1);
    if (ca > 0) {
      ctx.strokeStyle = k.rgba('bg', 0.8 * ca); ctx.lineWidth = 4;
      for (let i = 0; i < 3; i++) {
        const a = (0.5 + k.hash(i * 23 + 7)) * Math.PI; // aşağı-yönlü açılar
        const len = 34 + k.hash(i * 31 + 1) * 26;
        ctx.beginPath(); ctx.moveTo(HX, HY);
        ctx.lineTo(HX + Math.cos(a) * len * 0.6, HY - Math.abs(Math.sin(a)) * len * 0.4);
        ctx.lineTo(HX + Math.cos(a) * len, HY - Math.abs(Math.sin(a)) * len);
        ctx.stroke();
      }
    }

    // toz bulutları
    for (let i = 0; i < 4; i++) {
      const dt = d - i * 0.07;
      if (dt < 0 || dt > 0.8) continue;
      const q = dt / 0.8;
      const px = HX + (k.hash(i * 13 + 2) - 0.5) * 60 - q * 20;
      const py = HY - q * 70;
      ctx.fillStyle = k.rgba('dim', 0.45 * (1 - q));
      ctx.beginPath(); ctx.arc(px, py, 10 + q * 22, 0, k.TAU); ctx.fill();
    }

    // uçan parçalar
    for (let i = 0; i < 4; i++) {
      const dt = d - i * 0.03;
      if (dt < 0 || dt > 0.6) continue;
      const q = dt / 0.6;
      const vx = (k.hash(i * 41 + 4) - 0.3) * 260;
      const vy = -(120 + k.hash(i * 47 + 8) * 160);
      const px = HX + vx * dt, py = HY + vy * dt + 320 * dt * dt;
      ctx.save();
      ctx.translate(px, py); ctx.rotate(k.hash(i * 53 + 9) * k.TAU + dt * 9);
      ctx.fillStyle = k.rgba(p.color, 1 - q);
      const s = 7 - q * 3;
      ctx.fillRect(-s / 2, -s / 2, s, s * 0.7);
      ctx.restore();
    }
  },
};

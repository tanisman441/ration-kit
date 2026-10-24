// zoo-fx/keeper-feed — bakıcı, besleme anında kovadan yem saçar. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) ayaklar, gövde negatif y yönünde yukarı uzar. Characters ailesi oranları.
export default {
  name: 'keeper-feed', category: 'zoo-fx',
  desc: 'Şapkalı hayvanat bahçesi bakıcısı; besleme anında kolunu savurup yem tanelerini kaba saçar',
  tags: ['bakıcı', 'besleme', 'hayvanat bahçesi', 'yem', 'kova', 'keeper', 'feed', 'zookeeper', 'zoo', 'feeding', 'bucket'],
  box: [-145, -225, 165, 10],
  bleed: 70,
  anchor: 'ayaklar (0,0); boy ~215 birim',
  points: { head: [0, -188], hand: [58, -108], bowl: [118, -12] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'besleme anı — kol savrulur, yem taneleri kaba uçar (1.0 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const skinC = k.rgba('panel2'), feedC = k.rgba('yellow');
    const d = p.at == null ? -1 : t - p.at;
    const feeding = d >= 0 && d < 1.0;
    const env = feeding ? Math.sin(Math.min(d / 1.0, 1) * Math.PI) : 0;
    const br = Math.sin(t * k.TAU / 2.4) * 2; // nefes
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(30, -4, 95, 11, 0, 0, k.TAU); ctx.fill();

    // yem kabı (sağda, yerde)
    blob(88, -22, 62, 20, 9, body);
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); ctx.ellipse(119, -22, 30, 7, 0, 0, k.TAU); ctx.fill();
    // kapta birikmiş yem (beslemeden sonra görünür)
    const inBowl = feeding ? Math.min(d / 0.8, 1) : (d >= 1.0 ? 1 : 0);
    if (inBowl > 0) {
      for (let i = 0; i < 6; i++) {
        const fx = 100 + k.hash(i) * 38, fy = -24 - k.hash(i + 30) * 5 * inBowl;
        ctx.fillStyle = feedC;
        ctx.beginPath(); ctx.ellipse(fx, fy, 4, 3, 0, 0, k.TAU); ctx.fill();
      }
    }

    // bacaklar + ayaklar
    limb(-16, -84, -18, -14, 15, body);
    limb(16, -84, 18, -14, 15, body);
    blob(-30, -16, 26, 15, 7, body);
    blob(6, -16, 26, 15, 7, body);

    // gövde (üniforma) + sağ alt gölge (premium)
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); k.rrect(-32 + 6, -164 + 6 + br * 0.4, 64, 84, 26); ctx.fill();
    blob(-32, -164 + br * 0.4, 64, 84, 26, body);
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-16, -140, 10, 18, -0.2, 0, k.TAU); ctx.fill();

    // sol kol: kovayı tutar
    limb(-24, -140, -44, -96, 13, body);
    disc(-46, -92, 9, 9, skinC);
    // kova (sol elde)
    blob(-72, -108, 34, 30, 8, body);
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); ctx.ellipse(-55, -108, 17, 5, 0, 0, k.TAU); ctx.fill();
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = feedC;
      ctx.beginPath(); ctx.ellipse(-64 + i * 9, -110, 3.5, 3, 0, 0, k.TAU); ctx.fill();
    }

    // sağ kol: besleme anında savrulur
    const armAng = -0.2 - env * 0.9;
    const hx2 = 24, hy2 = -140 + br * 0.4;
    ctx.save();
    ctx.translate(hx2, hy2);
    ctx.rotate(armAng);
    limb(0, 0, 34, 22, 13, body);
    disc(36, 24, 9, 9, skinC);
    ctx.restore();
    const handX = hx2 + Math.cos(armAng) * 36;
    const handY = hy2 + Math.sin(armAng) * 36;

    // uçan yem taneleri (besleme anı, 1.0 sn)
    if (feeding) {
      for (let i = 0; i < 10; i++) {
        const prog = k.clamp((d - k.hash(i) * 0.2) / 0.7, 0, 1);
        if (prog <= 0) continue;
        const px = handX + prog * (118 - handX) + (k.hash(i + 50) - 0.5) * 16;
        const py = handY + prog * (-24 - handY) - Math.sin(prog * Math.PI) * 26;
        ctx.fillStyle = k.rgba('yellow', 1 - prog * 0.3);
        ctx.beginPath(); ctx.ellipse(px, py, 4.5, 3.5, 0, 0, k.TAU); ctx.fill();
      }
    }

    // baş + şapka
    const hx = 0, hy = -188 - br * 0.5;
    disc(hx, hy, 28, 26, skinC);
    // şapka (bakıcı şapkası)
    blob(hx - 30, hy - 34, 60, 12, 6, body);
    blob(hx - 20, hy - 52, 40, 22, 10, body);
    // gözler
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.ellipse(hx - 10, hy - 2, 4, 4, 0, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hx + 10, hy - 2, 4, 4, 0, 0, k.TAU); ctx.fill();
    // ağız: beslerken gülümseme
    ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(hx, hy + 8, feeding ? 10 : 8, 0.3, Math.PI - 0.3); ctx.stroke();
    // premium parlama (baş sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(hx - 12, hy - 12, 9, 7, -0.4, 0, k.TAU); ctx.fill();

    // göz kırpma
    const tb = t % 4.2;
    if (tb < 0.12 && !feeding) {
      ctx.fillStyle = skinC;
      ctx.beginPath(); ctx.ellipse(hx - 10, hy - 2, 8, 3, 0, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(hx + 10, hy - 2, 8, 3, 0, 0, k.TAU); ctx.fill();
    }
  },
};

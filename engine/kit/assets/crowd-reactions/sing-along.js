// crowd-reactions/sing-along — telefon ışıklarıyla sallanan, birlikte şarkı söyleyen kalabalık.
// Contract: engine/kit/ASSETS.md — NOT: canvas y-aşağıdır; zemin (0,0), figürler negatif y yönünde yukarı uzar.
export default {
  name: 'sing-along',
  category: 'crowd-reactions',
  desc: 'kaldırılmış telefon ışıklarıyla ritmik sallanan, şarkı söyleyen kalabalık; canlı idle salınım',
  tags: ['kalabalık', 'şarkı', 'sing along', 'telefon ışığı', 'konser', 'sallanma', 'concert', 'crowd', 'phone light', 'singing', 'fans', 'glow'],
  box: [-260, -320, 260, 12],
  bleed: 50,
  anchor: 'zemin (0,0); grubun ortası',
  points: { top: [0, -270] },
  params: {
    color: { type: 'color', default: 'dim' },
    count: { type: 'number', default: 6, desc: 'kişi sayısı 5–8' },
    sway: { type: 'number', default: 0.6, desc: 'salınım genişliği 0–1' },
  },
  draw(ctx, t, p, k) {
    const LW = 4;
    const line = k.rgba('bg', 0.55);
    const inkC = k.rgba('ink', 0.8);
    const body = k.rgba(p.color);
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.8))).join(',')})`;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const face = (cx, hy) => {                            // şarkı söyleyen ağız: açık oval
      ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.2;
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(cx + s * 10, hy + 2, 5.5, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
      ctx.beginPath(); ctx.ellipse(cx, hy + 12, 5.5, 8, 0, 0, k.TAU); ctx.fill();
    };

    const n = Math.max(5, Math.min(8, Math.round(p.count)));
    const swayAmt = Math.max(0, Math.min(1, p.sway));

    const fig = (cx, baseY, s, seed) => {
      const ph = t * k.TAU / 3.2 + seed * 1.3;             // salınım fazı
      const sw = Math.sin(ph) * 10 * swayAmt;             // yanal salınım
      const yy = baseY + Math.abs(Math.sin(ph * 0.5)) * 2.5;
      const xx = cx + sw;
      const tone = k.hash(seed * 31) < 0.35 ? dark : body;
      ctx.fillStyle = k.rgba('bg', 0.3);
      ctx.beginPath(); ctx.ellipse(cx, baseY + 2, 30 * s, 8 * s, 0, 0, k.TAU); ctx.fill();
      blob(xx - 13 * s, yy - 78 * s, 26 * s, 78 * s, 10 * s, tone);
      blob(xx - 20 * s, yy - 140 * s, 40 * s, 66 * s, 16 * s, tone);
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); ctx.ellipse(xx + 12 * s, yy - 110 * s, 7 * s, 22 * s, 0.1, 0, k.TAU); ctx.fill();
      const hy = yy - 158 * s;
      // sağ kol: telefon yukarıda; sol kol yanda
      const sxR = xx + 17 * s, syR = yy - 128 * s;
      const handX = xx + 30 * s + sw * 0.3, handY = yy - 216 * s;
      const exR = (sxR + handX) / 2 + 8 * s, eyR = (syR + handY) / 2;
      limb(sxR, syR, exR, eyR, 16 * s, tone);
      limb(exR, eyR, handX, handY, 13 * s, tone);
      disc(handX, handY, 8.5 * s, 8.5 * s, tone);
      limb(xx - 17 * s, yy - 128 * s, xx - 24 * s, yy - 66 * s, 16 * s, tone);
      limb(xx - 24 * s, yy - 66 * s, xx - 22 * s, yy - 26 * s, 13 * s, tone);
      disc(xx - 22 * s, yy - 22 * s, 8.5 * s, 8.5 * s, tone);
      // telefon: küçük dikdörtgen + nabız gibi atan ışık
      const tw = 15 * s, th = 26 * s, trot = -0.12 + Math.sin(ph * 0.5) * 0.1;
      ctx.save(); ctx.translate(handX, handY - 20 * s); ctx.rotate(trot);
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(-tw / 2 - LW / 2, -th / 2 - LW / 2, tw + LW, th + LW, 5 * s); ctx.fill();
      ctx.fillStyle = k.rgba('ink'); ctx.beginPath(); k.rrect(-tw / 2, -th / 2, tw, th, 5 * s); ctx.fill();
      ctx.restore();
      const pulse = 0.35 + 0.15 * Math.sin(t * 3 + seed * 2);   // telefon ışığı nabzı
      k.glow(handX, handY - 34 * s, 46 * s, 'yellow', pulse);
      ctx.fillStyle = k.rgba('yellow', 0.75);
      ctx.beginPath(); ctx.ellipse(handX, handY - 34 * s, 6 * s, 8 * s, 0, 0, k.TAU); ctx.fill();
      disc(xx, hy, 21 * s, 20 * s, tone);
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(xx - 7 * s, hy - 7 * s, 7 * s, 5 * s, -0.4, 0, k.TAU); ctx.fill();
      face(xx, hy);
    };

    const rows = n <= 4 ? [[n, 0, 1]] : [[Math.ceil(n / 2), -46, 0.84], [Math.floor(n / 2), 0, 1]];
    let seed = 1;
    for (const [cnt, baseY, s] of rows) {
      const w = Math.min(460, cnt * 72);
      for (let i = 0; i < cnt; i++) {
        const cx = cnt === 1 ? 0 : -w / 2 + (w * i) / (cnt - 1) + (k.hash(seed * 13) - 0.5) * 16;
        fig(cx, baseY, s * (0.92 + k.hash(seed * 29) * 0.16), seed);
        seed++;
      }
    }
  },
};

// airport-fx/checkin-scan — biniş kartı taranır; tarama çizgisi kartı süpürür, yeşil onay belirir. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) biniş kartının merkezidir.
export default {
  name: 'checkin-scan', category: 'airport-fx',
  desc: 'Biniş kartı taranır: ışık çizgisi kartı yukarıdan aşağıya süpürür, tarama bitince yeşil onay rozeti belirir',
  tags: ['check-in', 'biniş kartı', 'tarama', 'barkod', 'onay', 'havalimanı', 'checkin', 'boarding pass', 'scan', 'barcode', 'airport', 'approved'],
  box: [-140, -95, 140, 95],
  bleed: 30,
  anchor: 'biniş kartının merkezi (0,0); onay rozeti kartın sağ üst köşesindedir',
  points: { card: [0, 0], barcode: [85, 18], check: [96, -48] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'tarama anı: ışık çizgisi kartı süpürür, ardından onay belirir' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // biniş kartı
    blob(-115, -62, 230, 124, 14, k.rgba('panel2'));
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-88, -48, 28, 8, 0, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(58, 44, 52, 12, 6); ctx.fill();

    // üst şerit (renk paramı)
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-115, -62, 230, 26, 14); ctx.fill();
    ctx.fillRect(-115, -48, 230, 12);
    // şerit üstünde küçük uçak işareti (basit siluet)
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.moveTo(-98, -56); ctx.lineTo(-78, -49); ctx.lineTo(-98, -42); ctx.lineTo(-94, -49); ctx.closePath(); ctx.fill();

    // metin satırları (sol)
    ctx.fillStyle = k.rgba('ink', 0.75);
    ctx.beginPath(); k.rrect(-100, -18, 120, 7, 3.5); ctx.fill();
    ctx.beginPath(); k.rrect(-100, 0, 88, 7, 3.5); ctx.fill();
    ctx.beginPath(); k.rrect(-100, 18, 104, 7, 3.5); ctx.fill();
    // küçük koltuk bilgisi
    ctx.fillStyle = k.rgba('ink', 0.5);
    ctx.beginPath(); k.rrect(-100, 36, 44, 7, 3.5); ctx.fill();

    // barkod (sağ)
    ctx.fillStyle = k.rgba('ink', 0.8);
    let bx = 66;
    for (let i = 0; i < 12; i++) {
      const w = 2 + k.hash(i * 7 + 3) * 4;
      ctx.fillRect(bx, -14, w, 46);
      bx += w + 2 + k.hash(i * 7 + 5) * 3;
    }

    // tarama olayı
    const d = p.at == null ? -1 : t - p.at;
    // idle: köşede yanıp sönen hazır LED'i
    const idleBlink = 0.35 + 0.3 * Math.sin(t * k.TAU / 2.2);
    ctx.fillStyle = k.rgba('cyan', idleBlink * (d >= 0 ? 0 : 1));
    ctx.beginPath(); ctx.arc(-104, -49, 4, 0, k.TAU); ctx.fill();

    if (d >= 0) {
      // ışık çizgisi kartı süpürür (0.9 sn)
      const sp = k.clamp(d / 0.9, 0, 1);
      const by = -62 + sp * 124;
      if (sp < 1) {
        ctx.fillStyle = k.rgba('cyan', 0.22);
        ctx.fillRect(-115, by - 9, 230, 18);
        ctx.fillStyle = k.rgba('cyan', 0.95);
        ctx.fillRect(-115, by - 2, 230, 4);
        k.glow(0, by, 30, 'cyan', 0.35);
      }
      // onay rozeti: tarama yarıya gelince belirir
      const cp = k.clamp((d - 0.5) / 0.3, 0, 1);
      if (cp > 0) {
        const s = k.E.outBack(cp, 2);
        ctx.save();
        ctx.translate(96, -48); ctx.scale(s, s);
        ctx.fillStyle = line; ctx.beginPath(); ctx.arc(0, 0, 23, 0, k.TAU); ctx.fill();
        ctx.fillStyle = k.rgba('green'); ctx.beginPath(); ctx.arc(0, 0, 20, 0, k.TAU); ctx.fill();
        k.glow(0, 0, 26, 'green', 0.4 * cp);
        ctx.strokeStyle = 'rgba(255,255,255,0.95)'; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(-9, 0); ctx.lineTo(-3, 7); ctx.lineTo(10, -7); ctx.stroke();
        ctx.restore();
      }
    }
    ctx.restore();
  },
};

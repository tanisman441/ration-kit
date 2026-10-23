// office-fx/email-send — at anında zarf eğik fırlayıp hız çizgileriyle uçar:
// 0.8 sn'lik uçuş (yukarı-sağa, eğim), arkasında 6 hız çizgisi; uçuş sonunda zarf
// solar (gönderildi). idle'da zarf hafifçe yüzer. canvas y-aşağı; (0,0) zarf merkezi.
export default {
  name: 'email-send', category: 'office-fx',
  desc: 'at anında zarf hız çizgileriyle yukarı-sağa fırlar ve solar',
  tags: ['e-posta', 'mail', 'zarf', 'gönder', 'mektup', 'email', 'send', 'letter', 'envelope', 'ofis', 'office'],
  box: [-150, -140, 150, 120],
  bleed: 46,
  anchor: 'zarf merkezi',
  points: { mouth: [0, 0], tail: [-128, 96] },
  params: {
    color: { type: 'color', default: 'accent', desc: 'zarf rengi' },
    at: { type: 'time', default: null, desc: 'gönder anı: 0.8 sn eğik uçuş + hız çizgileri' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.at == null ? -1 : t - p.at;
    const W = 124, H = 86, LW = 9;

    let x = 0, y = 3 * Math.sin(t * 2.2), rot = 0, alpha = 1;
    let fly = -1;   // uçuş ilerlemesi (0..1)
    if (d >= 0) {
      const g = k.prog(d, 0, 0.8);
      const e = g * g * (3 - 2 * g);          // smoothstep
      x = 130 * e; y = -118 * e + 3 * Math.sin(t * 2.2) * (1 - e);
      rot = -0.45 * e;
      fly = g;
      if (d > 0.8) alpha = Math.max(0, 1 - (d - 0.8) / 0.3);  // gönderildi: solar
    }

    // hız çizgileri: uçuş yönünün tersine, geride kalan 6 çizgi
    if (fly >= 0 && fly < 1) {
      const la = 0.55 * Math.sin(Math.PI * Math.min(1, fly * 1.15));
      const dx = 0.74, dy = -0.67;            // uçuş yönü (normalize ~)
      ctx.strokeStyle = k.rgba('ink', 0.5);
      ctx.lineCap = 'round';
      for (let i = 0; i < 6; i++) {
        const back = 44 + i * 24 + 12 * k.hash(i * 3 + 1);
        const side = (k.hash(i * 7 + 2) - 0.5) * 110;
        const px = -dy * side, py = dx * side;         // dikey ofset
        const len = 42 + 34 * k.hash(i * 11 + 3);
        ctx.lineWidth = 5;
        ctx.globalAlpha = la * (0.5 + 0.5 * k.hash(i * 5 + 4));
        ctx.beginPath();
        ctx.moveTo(x - dx * back + px, y - dy * back + py);
        ctx.lineTo(x - dx * (back + len) + px, y - dy * (back + len) + py);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    if (alpha > 0) {
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.rotate(rot);
      // gölge (sağ alt)
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); k.rrect(-W / 2 + 7, -H / 2 + 8, W, H, 12); ctx.fill();
      // gövde
      ctx.fillStyle = k.rgba('bg', 0.55);
      ctx.beginPath(); k.rrect(-W / 2 - 2, -H / 2 - 2, W + 4, H + 4, 12); ctx.fill();
      ctx.fillStyle = k.rgba(p.color, 1);
      ctx.beginPath(); k.rrect(-W / 2, -H / 2, W, H, 10); ctx.fill();
      // premium parlama (sol üst)
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-W / 2 + 26, -H / 2 + 20, 22, 12, -0.3, 0, k.TAU); ctx.fill();
      // kapak çizgileri (iç ayrım, ink)
      ctx.strokeStyle = k.rgba('ink', 0.55); ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-W / 2 + 6, -H / 2 + 8); ctx.lineTo(0, 12); ctx.lineTo(W / 2 - 6, -H / 2 + 8);
      ctx.stroke();
      // pul
      ctx.fillStyle = k.rgba('bg', 0.55);
      ctx.beginPath(); k.rrect(W / 2 - 34, -H / 2 + 8, 24, 28, 4); ctx.fill();
      ctx.fillStyle = k.rgba('dim', 1);
      ctx.beginPath(); k.rrect(W / 2 - 32, -H / 2 + 10, 20, 24, 3); ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  },
};

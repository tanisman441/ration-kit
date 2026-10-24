// barbershop-fx/scissors-snip — çapraz berber makası; `at` anında bıçaklar kapanır, kesilen saç teli düşer. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) makasın pivotu, bıçaklar sağa bakar.
export default {
  name: 'scissors-snip', category: 'barbershop-fx',
  desc: 'Çapraz berber makası; kesim anında bıçaklar kapanır, kesilen saç teli düşer',
  tags: ['makas', 'kesim', 'berber', 'saç', 'scissors', 'snip', 'barber', 'cut', 'hair', 'salon'],
  box: [-130, -85, 135, 85],
  bleed: 45,
  anchor: 'makasın pivotu (0,0); bıçaklar sağa bakar',
  points: { pivot: [0, 0], tips: [108, 0], handles: [-108, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'kesim anı — bıçaklar kapanır, saç teli düşer (0.7 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const metal = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const snipping = d >= 0 && d < 0.7;
    // bıçak açıklığı: boşta hafif açık (±0.26 rad salınır), kesimde 0.12 sn'de kapanır
    const idleOpen = 0.26 + Math.sin(t * k.TAU / 2.4) * 0.05;
    let open = idleOpen;
    if (snipping) {
      const cd = d / 0.12;
      open = cd < 1 ? idleOpen * (1 - cd) : 0;
      if (d > 0.3) open = idleOpen * k.clamp((d - 0.3) / 0.25, 0, 1);
    }
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blade = (angle, up) => {
      ctx.save();
      ctx.translate(0, 0);
      ctx.rotate(up ? -angle : angle);
      // bıçak gövdesi (metal, uca doğru incelir)
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.moveTo(2, -7); ctx.lineTo(112, -2.5); ctx.lineTo(112, 2.5); ctx.lineTo(2, 7); ctx.closePath(); ctx.fill();
      ctx.fillStyle = metal;
      ctx.beginPath(); ctx.moveTo(2, -5); ctx.lineTo(108, -1.5); ctx.lineTo(108, 1.5); ctx.lineTo(2, 5); ctx.closePath(); ctx.fill();
      // keskin kenar çizgisi
      ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(6, up ? -4 : 4); ctx.lineTo(106, up ? -1.5 : 1.5); ctx.stroke();
      ctx.restore();
    };
    const ring = (cx, cy, r) => {
      ctx.strokeStyle = line; ctx.lineWidth = 9;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, k.TAU); ctx.stroke();
      ctx.strokeStyle = metal; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, k.TAU); ctx.stroke();
    };

    // saplar: pivotun solunda, bıçak açısına ters yönde
    const hAngle = open * 0.9;
    ctx.save();
    ctx.rotate(hAngle);
    ring(-78, -16, 13);
    ctx.strokeStyle = line; ctx.lineWidth = 11;
    ctx.beginPath(); ctx.moveTo(-66, -12); ctx.lineTo(-6, -4); ctx.stroke();
    ctx.strokeStyle = metal; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(-66, -12); ctx.lineTo(-6, -4); ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.rotate(-hAngle);
    ring(-78, 16, 13);
    ctx.strokeStyle = line; ctx.lineWidth = 11;
    ctx.beginPath(); ctx.moveTo(-66, 12); ctx.lineTo(-6, 4); ctx.stroke();
    ctx.strokeStyle = metal; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(-66, 12); ctx.lineTo(-6, 4); ctx.stroke();
    ctx.restore();

    // bıçaklar (üst ve alt)
    blade(open, true);
    blade(open, false);

    // kesilecek saç teli: bıçaklar arasında dikey durur
    const strandCut = snipping && d >= 0.12;
    if (!strandCut) {
      ctx.strokeStyle = k.rgba('ink', 0.9); ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.moveTo(62, -26); ctx.lineTo(62, 26); ctx.stroke();
    } else {
      // kesilen parça düşer + sönümlenir
      const fp = k.clamp((d - 0.12) / 0.5, 0, 1);
      const fy = 26 + fp * fp * 46;
      ctx.strokeStyle = k.rgba('ink', 0.9 * (1 - fp * 0.6)); ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.moveTo(62, -26); ctx.lineTo(62, -2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(62 + fp * 6, fy - 22); ctx.lineTo(62 + fp * 6, fy); ctx.stroke();
      // kesim kıvılcımı (anlık yıldız)
      if (d < 0.3) {
        const sa = 1 - (d - 0.12) / 0.18;
        ctx.fillStyle = k.rgba('yellow', 0.9 * sa);
        const r = 5 + sa * 9;
        ctx.beginPath();
        ctx.moveTo(62, -2 - r); ctx.quadraticCurveTo(62 + r * 0.2, -2 - r * 0.2, 62 + r, -2);
        ctx.quadraticCurveTo(62 + r * 0.2, -2 + r * 0.2, 62, -2 + r);
        ctx.quadraticCurveTo(62 - r * 0.2, -2 + r * 0.2, 62 - r, -2);
        ctx.quadraticCurveTo(62 - r * 0.2, -2 - r * 0.2, 62, -2 - r);
        ctx.fill();
      }
    }

    // pivot vidası
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(0, 0, 10, 10, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.ellipse(0, 0, 7, 7, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.ellipse(0, 0, 2.5, 2.5, 0, 0, k.TAU); ctx.fill();
  },
};

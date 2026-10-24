// fishing-fx/net-scoop — balık ağı suya dalar, balığı kepçeyle yakalar.
// at anında (0.8 sn) ağ aşağı suya dalar ve balıkla birlikte yukarı kalkar;
// idle: ağ hafifçe salınır, su dalgalanır, yakalanan balık kuyruk çırpar.
// NOT: canvas y-aşağıdır; (0,0) sahne merkezidir, su yüzeyi y=70'tir.
export default {
  name: 'net-scoop', category: 'fishing-fx',
  desc: 'Balık ağı suya dalar, balığı kepçeyle yakalayıp yukarı kaldırır',
  tags: ['ağ', 'kepçe', 'balık', 'yakalama', 'olta', 'net', 'scoop', 'fishing', 'catch', 'fish'],
  box: [-140, -110, 140, 110],
  bleed: 30,
  anchor: 'sahne merkezi (0,0); sap sol altta, ağ halkası sağ üstte',
  points: { hoop: [35, -55], handle_end: [-120, 95] },
  params: {
    at: { type: 'time', default: null, desc: 'kepçe anı (0.8 sn, ağ suya dalar balıkla kalkar)' },
    color: { type: 'color', default: 'cyan', desc: 'ağ halkası rengi' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;

    // su yüzeyi
    ctx.strokeStyle = k.rgba('cyan', 0.55); ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = -140; x <= 140; x += 8) {
      const wy = 70 + Math.sin(x * 0.07 + t * 1.5) * 2;
      if (x === -140) ctx.moveTo(x, wy); else ctx.lineTo(x, wy);
    }
    ctx.stroke();
    ctx.strokeStyle = k.rgba('cyan', 0.3); ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = -130; x <= 130; x += 8) {
      const wy = 82 + Math.sin(x * 0.05 + t * 1.1 + 1) * 2;
      if (x === -130) ctx.moveTo(x, wy); else ctx.lineTo(x, wy);
    }
    ctx.stroke();

    // kepçe hareketi: 0.8 sn'lik sinüs (aşağı dal, yukarı kalk)
    let dipY = 0, dipX = 0, dipRot = 0;
    if (d >= 0 && d < 0.8) {
      const s = Math.sin((d / 0.8) * Math.PI);
      dipY = s * 100; dipX = s * 22; dipRot = s * 0.45;
    }
    const sway = Math.sin(t * k.TAU / 3.0) * 3;
    const hx = 35 + dipX + sway, hy = -55 + dipY;
    const rot = -0.3 + dipRot + k.noise1(t * 0.5) * 0.03;

    // sap: sol alttan halkaya
    ctx.strokeStyle = k.rgba('ink', 0.95); ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(-120, 95); ctx.lineTo(hx - 38, hy + 14); ctx.stroke();
    // sap parlama
    ctx.strokeStyle = 'rgba(255,255,255,0.10)'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-116, 90); ctx.lineTo(hx - 40, hy + 10); ctx.stroke();

    // ağ halkası (elips, eğik)
    ctx.save();
    ctx.translate(hx, hy);
    ctx.rotate(rot);
    ctx.strokeStyle = k.rgba(p.color, 0.95); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.ellipse(0, 0, 55, 26, 0, 0, k.TAU); ctx.stroke();
    // ağ filesi: elips içine kırpılmış çapraz çizgiler
    ctx.save();
    ctx.beginPath(); ctx.ellipse(0, 0, 50, 21, 0, 0, k.TAU); ctx.clip();
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 2;
    for (let i = -5; i <= 5; i++) {
      ctx.beginPath(); ctx.moveTo(i * 11 - 30, -26); ctx.lineTo(i * 11 + 30, 26); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(i * 11 - 30, 26); ctx.lineTo(i * 11 + 30, -26); ctx.stroke();
    }
    ctx.restore();
    // parlama sol üst
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-24, -12, 14, 5, -0.3, 0, k.TAU); ctx.fill();

    // yakalanan balık (kepçeden sonra ağın içinde kuyruk çırpar)
    if (d >= 0.8) {
      const wag = Math.sin(t * 10) * 0.15;
      ctx.save();
      ctx.translate(0, 4);
      ctx.rotate(wag);
      ctx.fillStyle = k.rgba('yellow', 0.95);
      ctx.beginPath(); ctx.ellipse(0, 0, 20, 9, 0, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.ellipse(0, 0, 20, 9, 0, 0, k.TAU); ctx.stroke();
      ctx.fillStyle = k.rgba('yellow', 0.95);
      ctx.beginPath();
      ctx.moveTo(-18, 0);
      ctx.lineTo(-28, -7 + Math.sin(t * 10) * 3);
      ctx.lineTo(-28, 7 + Math.sin(t * 10) * 3);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = k.rgba('bg', 0.85);
      ctx.beginPath(); ctx.arc(9, -2, 2, 0, k.TAU); ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    // suya dalış sıçraması ve halkalar
    if (d >= 0.1 && d < 0.6) {
      const u = (d - 0.1) / 0.5;
      for (let i = 0; i < 6; i++) {
        const h = k.hash(i * 61.1);
        const ang = -Math.PI * (0.15 + h * 0.7);
        const dist = u * (14 + h * 18);
        ctx.fillStyle = k.rgba('cyan', (1 - u) * 0.8);
        ctx.beginPath(); ctx.arc(57 + Math.cos(ang) * dist, 68 + Math.sin(ang) * dist, 2 + h * 2, 0, k.TAU); ctx.fill();
      }
      ctx.strokeStyle = k.rgba('cyan', (1 - u) * 0.6); ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.ellipse(57, 72, 8 + u * 30, 3 + u * 8, 0, 0, k.TAU); ctx.stroke();
    }

    ctx.restore();
  },
};

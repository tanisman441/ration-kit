// transport/plane — yandan görünüm yolcu uçağı (sağa bakar); flying anında burun kaldırıp yükselir.
// NOT: canvas y-aşağıdır; (0,0) gövde merkezidir.
export default {
  name: 'plane',
  category: 'transport',
  desc: 'Yandan görünüm yolcu uçağı; flying anında burun kaldırır, yükselir ve iz bırakır',
  tags: ['uçak', 'plane', 'airplane', 'jet', 'havayolu', 'uçuş', 'flight', 'seyahat', 'travel'],
  box: [-140, -75, 140, 60],
  bleed: 70,
  anchor: 'gövde merkezi (0,0)',
  points: { nose: [112, 0], tail: [-112, 0], wing: [10, 42] },
  params: {
    color: { type: 'color', default: 'dim' },
    flying: { type: 'time', default: null, desc: 'kalkış/yükselme anı' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const glass = k.rgba('bg', 0.9);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    const d = p.flying == null ? -1 : t - p.flying;
    const climb = d < 0 ? 0 : k.E.outCubic(Math.min(1, d / 1.4));
    const bob = k.noise1(t * 1.2) * 2;

    ctx.save();
    ctx.translate(0, bob - climb * 55);
    ctx.rotate(-climb * 0.22);

    // kuyruk kanadı (arka, yatay)
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(-118, -2); ctx.lineTo(-88, -2); ctx.lineTo(-80, -16); ctx.lineTo(-104, -16);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath();
    ctx.moveTo(-114, -4); ctx.lineTo(-90, -4); ctx.lineTo(-83, -14); ctx.lineTo(-103, -14);
    ctx.closePath(); ctx.fill();

    // dikey kuyruk (yukarı)
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(-108, -10); ctx.lineTo(-78, -10); ctx.lineTo(-88, -62); ctx.lineTo(-112, -62);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath();
    ctx.moveTo(-104, -12); ctx.lineTo(-81, -12); ctx.lineTo(-90, -58); ctx.lineTo(-108, -58);
    ctx.closePath(); ctx.fill();
    // kuyruk vurgu şeridi (tek vurgu rengi: cyan)
    ctx.fillStyle = k.rgba('cyan', 0.85);
    ctx.beginPath();
    ctx.moveTo(-104, -46); ctx.lineTo(-85, -46); ctx.lineTo(-88, -58); ctx.lineTo(-106, -58);
    ctx.closePath(); ctx.fill();

    // ana kanat (aşağı-süpürmeli)
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(-8, 6); ctx.lineTo(34, 6); ctx.lineTo(10, 52); ctx.lineTo(-28, 52);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath();
    ctx.moveTo(-5, 8); ctx.lineTo(31, 8); ctx.lineTo(9, 49); ctx.lineTo(-25, 49);
    ctx.closePath(); ctx.fill();
    // motor (kanat altında)
    blob(-2, 34, 30, 16, 8, k.rgba('panel2'));

    // gövde
    blob(-112, -16, 222, 34, 17, k.rgba(p.color));
    // burun
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(108, 1, 17 + LW / 2, -Math.PI / 2, Math.PI / 2); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); ctx.arc(108, 1, 17, -Math.PI / 2, Math.PI / 2); ctx.fill();
    // kokpit camı
    ctx.fillStyle = glass;
    ctx.beginPath();
    ctx.moveTo(72, -14); ctx.lineTo(96, -14); ctx.lineTo(88, 0); ctx.lineTo(72, 0);
    ctx.closePath(); ctx.fill();
    // yolcu pencereleri
    ctx.fillStyle = glass;
    for (let x = -70; x < 55; x += 22) {
      ctx.beginPath(); ctx.arc(x, -4, 5, 0, k.TAU); ctx.fill();
    }
    // gövde şeridi (cyan vurgu)
    ctx.strokeStyle = k.rgba('cyan', 0.7); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-95, 10); ctx.lineTo(85, 10); ctx.stroke();

    // premium parlama (gövde sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-60, -10, 42, 6, -0.1, 0, k.TAU); ctx.fill();

    ctx.restore();

    // kalkış izi (flying sonrası 1.5 sn)
    if (d >= 0 && d < 1.6) {
      const a = 1 - d / 1.6;
      ctx.strokeStyle = k.rgba('ink', 0.3 * a); ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(-140, 30 + bob); ctx.lineTo(-95, 12 + bob); ctx.stroke();
      ctx.strokeStyle = k.rgba('ink', 0.18 * a); ctx.lineWidth = 14;
      ctx.beginPath(); ctx.moveTo(-140, 44 + bob); ctx.lineTo(-105, 26 + bob); ctx.stroke();
    }
  },
};

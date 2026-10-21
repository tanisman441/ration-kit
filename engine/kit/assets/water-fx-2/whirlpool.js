// water-fx-2/whirlpool — dönen girdap: 3 spiral kol sürekli döner, köpük benekleri
// içe doğru sürüklenir. spin anında dönüş hızlanır ve köpük artar (1.2 sn).
// NOT: canvas y-aşağıdır; (0,0) girdap merkezidir.
export default {
  name: 'whirlpool', category: 'water-fx-2',
  desc: 'Yukarıdan görülen dönen girdap: spiral kollar ve içe sürüklenen köpük',
  tags: ['girdap', 'whirlpool', 'dönme', 'su', 'spiraller', 'vortex', 'swirl', 'spin', 'su girdabı'],
  box: [-150, -115, 150, 115],
  bleed: 40,
  anchor: 'girdap merkezi (0,0)',
  points: { center: [0, 0], edge: [128, 0] },
  params: {
    spin: { type: 'time', default: null, desc: 'dönüşün hızlandığı an (1.2 sn sürer)' },
    color: { type: 'color', default: 'cyan', desc: 'su rengi' },
  },
  draw(ctx, t, p, k) {
    const d = p.spin == null ? -1 : t - p.spin;
    ctx.save();
    ctx.lineCap = 'round';

    // Dönüş hızı: idle'da sabit tur, spin anında hızlanma (1.2 sn)
    const boost = d < 0 ? 0 : k.prog(d, 0, 0.25) * (1 - k.prog(d, 0.75, 1.2));
    const ang = t * (1.4 + boost * 5.2);
    const acc = p.color;

    // Su tabanı: yuvarlak girdap diski
    ctx.fillStyle = k.rgba(acc, 0.3);
    ctx.beginPath(); ctx.ellipse(0, 0, 132, 132, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.ellipse(0, 0, 132, 132, 0, 0, k.TAU); ctx.stroke();
    // premium finish: sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-52, -58, 56, 30, -0.5, 0, k.TAU); ctx.fill();

    // 3 spiral kol: logaritmik spiral üzerinde kalınlığı azalan parçalar
    const ARMS = 3, SEG = 26;
    for (let a = 0; a < ARMS; a++) {
      const base = ang + a * (k.TAU / ARMS);
      let px = 0, py = 0;
      for (let i = 0; i <= SEG; i++) {
        const s = i / SEG;
        const r = 122 - 104 * Math.pow(s, 1.35);
        const th = base + s * 4.4;
        const x = Math.cos(th) * r, y = Math.sin(th) * r;
        if (i > 0) {
          const w = 3 + 15 * (1 - s) * (1 - s);
          ctx.strokeStyle = k.rgba(acc, 0.35 + 0.5 * (1 - s));
          ctx.lineWidth = w;
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke();
        }
        px = x; py = y;
      }
    }

    // Köpük benekleri: spiral boyunca içe sürüklenir
    const NFOAM = 16;
    for (let i = 0; i < NFOAM; i++) {
      const seed = i * 37 + 9;
      const ph = (t * (0.35 + k.hash(seed + 1) * 0.4) + k.hash(seed)) % 1;
      const a = i * 2.4 + ang * (0.5 + ph * 0.6);
      const r = 118 - ph * 100;
      const fx = Math.cos(a) * r, fy = Math.sin(a) * r;
      const sz = 2.5 + k.hash(seed + 2) * 4.5 * (1 - ph * 0.5);
      ctx.fillStyle = 'rgba(255,255,255,' + (0.25 + 0.55 * ph + boost * 0.3).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(fx, fy, sz, 0, k.TAU); ctx.fill();
    }

    // Merkez deliği: koyu iç, kenarında köpük halkası
    ctx.fillStyle = k.rgba('ink', 0.42);
    ctx.beginPath(); ctx.ellipse(0, 0, 17, 17, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,' + (0.55 + boost * 0.35).toFixed(3) + ')';
    ctx.lineWidth = 4 + boost * 3;
    ctx.beginPath(); ctx.ellipse(0, 0, 21 + boost * 6, 21 + boost * 6, 0, 0, k.TAU); ctx.stroke();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(64, 66, 52, 26, 0.5, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};

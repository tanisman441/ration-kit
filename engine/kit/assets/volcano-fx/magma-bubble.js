// volcano-fx/magma-bubble — magma gölü: yüzen katılaşmış kabuklar + döngüsel
// kabarcıklar; at anında ortada büyük patlama (kubbe + sıçrama + flaş).
// NOT: canvas y-aşağıdır; (0,0) = göl yüzey merkezi.
export default {
  name: 'magma-bubble',
  category: 'volcano-fx',
  desc: 'Kaynayan magma gölü: katılaşmış kabuk parçaları arasında şişip patlayan kabarcıklar, at ile büyük sıçrama',
  tags: ['magma', 'kabarcık', 'bubble', 'lava gölü', 'kaynama', 'lav havuzu', 'volcano'],
  box: [-140, -110, 140, 110],
  bleed: 90,
  anchor: 'göl yüzeyi merkezi (0,0)',
  points: { surface: [0, -20] },
  params: {
    at: { type: 'time', default: null, desc: 'büyük kabarcık patlaması anı' },
    size: { type: 'number', default: 1, desc: 'büyüklük çarpanı' },
  },
  draw(ctx, t, p, k) {
    const s = Math.max(0.3, p.size);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // 1) magma tabanı (kırmızı, sıcak)
    ctx.fillStyle = k.rgba('red', 0.85);
    ctx.beginPath(); k.rrect(-140 * s, -40 * s, 280 * s, 110 * s, 18); ctx.fill();
    k.glow(0, 0, 150 * s, 'red', 0.28);

    // 2) sıcak çekirdek parlaması (sarı, nabız)
    const pulse = 0.55 + 0.45 * Math.sin(t * (k.TAU / 2.8));
    ctx.fillStyle = k.rgba('yellow', 0.5 * pulse);
    ctx.beginPath();
    ctx.ellipse(0, 10 * s, 100 * s, 32 * s, 0, 0, k.TAU); ctx.fill();

    // 3) yüzen katılaşmış kabuk parçaları (dim) — yüzeyde hafif salınım
    for (let i = 0; i < 6; i++) {
      const cx = -105 * s + k.hash(i * 3 + 1) * 210 * s;
      const cy = -18 * s + k.hash(i * 5 + 2) * 44 * s + k.noise1(i * 7 + t * 1.1) * 4 * s;
      const w = (26 + k.hash(i * 11 + 3) * 34) * s, h = (14 + k.hash(i * 13 + 4) * 16) * s;
      ctx.fillStyle = k.rgba('dim', 1);
      ctx.save(); ctx.translate(cx, cy); ctx.rotate((k.hash(i * 17 + 5) - 0.5) * 0.7 + k.noise1(i * 19 + t * 0.7) * 0.06);
      ctx.beginPath(); k.rrect(-w / 2, -h / 2, w, h, 10); ctx.fill();
      ctx.restore();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4 * s;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate((k.hash(i * 17 + 5) - 0.5) * 0.7);
      ctx.beginPath(); k.rrect(-w / 2, -h / 2, w, h, 10); ctx.stroke();
      ctx.restore();
    }
    // kabuklara premium finish: sol üst parlama
    ctx.fillStyle = k.rgba('ink', 0.10);
    ctx.beginPath(); ctx.ellipse(-95 * s, -30 * s, 42 * s, 13 * s, -0.2, 0, k.TAU); ctx.fill();

    // 4) döngüsel kabarcıklar — şişer (dome), patlar, mini sıçrama
    for (let i = 0; i < 5; i++) {
      const cyc = 1.8 + k.hash(i * 23 + 6) * 1.8;
      const ph = ((t + k.hash(i * 29 + 7) * cyc) % cyc) / cyc;
      const bx = -95 * s + k.hash(i * 31 + 8) * 190 * s;
      const by = -20 * s + k.hash(i * 37 + 9) * 50 * s;
      if (ph < 0.6) {
        const g = k.E.outExpo(ph / 0.6);
        const r = (6 + g * 13) * s, dome = g * 11 * s;
        ctx.fillStyle = k.rgba('red', 0.9);
        ctx.beginPath(); ctx.arc(bx, by - dome, r, 0, k.TAU); ctx.fill();
        ctx.fillStyle = k.rgba('yellow', 0.85);
        ctx.beginPath(); ctx.arc(bx, by - dome, r * 0.5, 0, k.TAU); ctx.fill();
        ctx.fillStyle = k.rgba('ink', 0.12);                 // kubbe parlaması
        ctx.beginPath(); ctx.ellipse(bx - r * 0.3, by - dome - r * 0.4, r * 0.42, r * 0.26, -0.5, 0, k.TAU); ctx.fill();
      } else if (ph < 0.78) {
        const g = (ph - 0.6) / 0.18;                        // patlama: sıçrama taneleri
        ctx.fillStyle = k.rgba('yellow', 0.85 * (1 - g));
        for (let j = 0; j < 6; j++) {
          const a = -Math.PI / 2 + (j - 2.5) * 0.55;
          const dd = 16 * g * s;
          const px = bx + Math.cos(a) * dd, py = by + Math.sin(a) * dd - g * g * 12 * s;
          ctx.beginPath(); ctx.arc(px, py, 3 * (1 - g * 0.6) * s, 0, k.TAU); ctx.fill();
        }
        ctx.fillStyle = k.rgba('dim', 0.4 * (1 - g));        // mini duman halkası
        ctx.beginPath(); ctx.arc(bx, by - 10 * s, (8 + g * 14) * s, 0, k.TAU); ctx.fill();
      }
    }

    // 5) büyük patlama olayı (at)
    const d = p.at == null ? -1 : t - p.at;
    if (d >= 0 && d <= 1.2) {
      // flaş
      if (d < 0.14) {
        const f = 1 - d / 0.14;
        k.glow(0, -20 * s, 120 * s, 'yellow', 0.5 * f);
        ctx.fillStyle = k.rgba('yellow', 0.9 * f);
        ctx.beginPath(); ctx.arc(0, -20 * s, 20 * f * s, 0, k.TAU); ctx.fill();
      }
      // büyük kubbe şişer — 0–0.45 sn
      if (d < 0.45) {
        const g = k.E.outExpo(k.prog(d, 0, 0.45));
        const r = (20 + g * 30) * s, dome = g * 30 * s;
        ctx.fillStyle = k.rgba('red', 0.9);
        ctx.beginPath(); ctx.arc(0, -20 * s - dome, r, 0, k.TAU); ctx.fill();
        ctx.fillStyle = k.rgba('yellow', 0.85);
        ctx.beginPath(); ctx.arc(0, -20 * s - dome, r * 0.55, 0, k.TAU); ctx.fill();
        ctx.fillStyle = k.rgba('ink', 0.12);
        ctx.beginPath(); ctx.ellipse(-r * 0.3, -20 * s - dome - r * 0.4, r * 0.42, r * 0.26, -0.5, 0, k.TAU); ctx.fill();
      }
      // sıçrama — 0.45–1.0 sn: lav taneleri havaya, yerçekimiyle geri
      if (d >= 0.45 && d < 1.05) {
        const dd = k.prog(d, 0.45, 1.05), al = 1 - dd;
        for (let i = 0; i < 18; i++) {
          const a = -Math.PI / 2 + (k.hash(i * 41 + 10) - 0.5) * 1.9;
          const spd = (90 + k.hash(i * 43 + 11) * 130) * s;
          const e = 1 - Math.pow(1 - dd, 2);
          const px = Math.cos(a) * spd * e;
          const py = -50 * s + Math.sin(a) * spd * e + dd * dd * 150 * s;
          ctx.fillStyle = k.hash(i * 47 + 12) > 0.4 ? k.rgba('red', al) : k.rgba('yellow', al);
          ctx.beginPath(); ctx.arc(px, py, (2.5 + k.hash(i * 53 + 13) * 3.5) * s, 0, k.TAU); ctx.fill();
        }
      }
    }
  },
};

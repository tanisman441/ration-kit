// volcano-fx/eruption-burst — yanardağ konisi + kraterde patlama anı.
// NOT: canvas y-aşağıdır; (0,0) = koni taban merkezi.
export default {
  name: 'eruption-burst',
  category: 'volcano-fx',
  desc: 'Yanardağ konisi; at anında kraterde flaş, alev topu, kaya parçacıkları ve kül sütunu yükselir',
  tags: ['yanardağ', 'patlama', 'erüpsiyon', 'volcano', 'eruption', 'burst', 'lava', 'kül'],
  box: [-140, -170, 140, 140],
  bleed: 100,
  anchor: 'koni taban merkezi (0,0)',
  points: { crater: [0, -120] },
  params: {
    at: { type: 'time', default: null, desc: 'patlama anı' },
    size: { type: 'number', default: 1, desc: 'büyüklük çarpanı' },
  },
  draw(ctx, t, p, k) {
    const s = Math.max(0.3, p.size);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const breathe = 0.6 + 0.4 * Math.sin(t * (k.TAU / 2.6));

    // 1) koni — her zaman çizilir (dim kaya, premium finish)
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.beginPath();
    ctx.moveTo(-110 * s, 60 * s);
    ctx.lineTo(-34 * s, -118 * s);
    ctx.lineTo(34 * s, -118 * s);
    ctx.lineTo(110 * s, 60 * s);
    ctx.closePath(); ctx.fill();
    // sol üst parlama + sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.10);
    ctx.beginPath();
    ctx.ellipse(-58 * s, -60 * s, 44 * s, 26 * s, -0.6, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath();
    ctx.ellipse(60 * s, 34 * s, 46 * s, 30 * s, 0.6, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 6 * s;
    ctx.beginPath();
    ctx.moveTo(-110 * s, 60 * s);
    ctx.lineTo(-34 * s, -118 * s);
    ctx.lineTo(34 * s, -118 * s);
    ctx.lineTo(110 * s, 60 * s);
    ctx.stroke();

    // 2) krater içi — bekleyen magma (sürekli ısı nabzı)
    const kraterGlow = 0.25 + 0.2 * breathe;
    k.glow(0, -118 * s, 46 * s, 'red', kraterGlow);
    ctx.fillStyle = k.rgba('red', 0.55 + 0.25 * breathe);
    ctx.beginPath();
    ctx.ellipse(0, -116 * s, 30 * s, 9 * s, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('yellow', 0.7 * breathe);
    ctx.beginPath();
    ctx.ellipse(0, -116 * s, 16 * s, 5 * s, 0, 0, k.TAU); ctx.fill();

    // 3) kraterden yükselen ince duman (sürekli idle)
    for (let i = 0; i < 4; i++) {
      const cyc = 3.2, ph = (t / cyc + k.hash(i * 7 + 1)) % 1;
      const px = (k.hash(i * 11 + 2) - 0.5) * 40 * s + k.noise1(i * 5 + t * 1.4) * 12 * s;
      const py = -128 * s - ph * 90 * s;
      const r = (8 + ph * 16) * s;
      ctx.fillStyle = k.rgba('dim', 0.32 * (1 - ph));
      ctx.beginPath(); ctx.arc(px, py, r, 0, k.TAU); ctx.fill();
    }

    // 4) patlama olayı
    const d = p.at == null ? -1 : t - p.at;
    if (d >= 0 && d <= 1.4) {
      // 4a) flaş — ilk 0.16 sn
      if (d < 0.16) {
        const f = 1 - d / 0.16;
        k.glow(0, -118 * s, 130 * s, 'yellow', 0.5 * f);
        ctx.fillStyle = k.rgba('yellow', 0.85 * f);
        ctx.beginPath(); ctx.arc(0, -118 * s, (12 + 22 * f) * s, 0, k.TAU); ctx.fill();
      }
      // 4b) alev topu — 0–0.55 sn: büyür solar (kırmızı → sarı çekirdek)
      if (d < 0.55) {
        const g = k.prog(d, 0, 0.55), a = 1 - g * g;
        const wob = (rr, seed, amp, col, al) => {
          ctx.fillStyle = k.rgba(col, al * a);
          ctx.beginPath();
          for (let i = 0; i <= 22; i++) {
            const an = (i / 22) * k.TAU;
            const q = rr * (1 + k.noise1(seed + i * 0.8 + t * 8) * amp);
            const x = Math.cos(an) * q, y = Math.sin(an) * q - 130 * s;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.closePath(); ctx.fill();
        };
        const r = (16 + 62 * k.E.outExpo(g)) * s;
        wob(r, 2.1, 0.13, 'red', 0.8);
        wob(r * 0.6, 5.4, 0.15, 'yellow', 0.85);
      }
      // 4c) kaya parçacıkları — 0–0.9 sn: saçılır, yerçekimiyle düşer, söner
      if (d < 0.9) {
        const dd = Math.min(d, 0.9), al = 1 - dd / 0.9;
        for (let i = 0; i < 14; i++) {
          const a = -Math.PI / 2 + (k.hash(i * 3 + 3) - 0.5) * 2.2;
          const sp = (150 + k.hash(i * 5 + 4) * 160) * s;
          const e = 1 - Math.pow(1 - dd / 0.9, 2);
          const x = Math.cos(a) * sp * e;
          const y = -118 * s + Math.sin(a) * sp * e + dd * dd * 190 * s;
          const sz = (5 + k.hash(i * 7 + 5) * 9) * s;
          ctx.fillStyle = k.hash(i * 13 + 6) > 0.45 ? k.rgba('red', al) : k.rgba('dim', al);
          ctx.save(); ctx.translate(x, y); ctx.rotate(a + d * 7);
          ctx.fillRect(-sz / 2, -sz / 3, sz, sz * 0.66);
          ctx.restore();
        }
      }
      // 4d) kül sütunu — 0.15–1.4 sn: yükselir, genişler, solar
      if (d > 0.15) {
        const g = k.prog(d, 0.15, 1.4);
        for (let i = 0; i < 7; i++) {
          const px = (k.hash(i * 17 + 7) - 0.5) * 70 * s + k.noise1(i * 9 + t * 2) * 14;
          const py = -130 * s - g * (110 + k.hash(i * 19 + 8) * 130) * s;
          const r = (13 + g * 30 + k.hash(i * 23 + 9) * 9) * s;
          ctx.fillStyle = k.rgba('dim', 0.5 * (1 - g));
          ctx.beginPath(); ctx.arc(px, py, r, 0, k.TAU); ctx.fill();
        }
      }
    }
  },
};

// fx/explosion — çizgi film patlaması: flaş, ateş topu, duman halkası, parçalar, yükselen duman.
// NOT: canvas y-aşağıdır; merkez (0,0).
export default {
  name: 'explosion',
  category: 'fx',
  desc: 'Çizgi film patlaması: beyaz flaş, büyüyen ateş topu, genişleyen duman halkası, saçılan parçalar',
  tags: ['patlama', 'infılak', 'ateş topu', 'explosion', 'blast', 'fireball', 'boom'],
  box: [-110, -110, 110, 110],
  bleed: 120,
  anchor: 'merkez (0,0)',
  points: {},
  params: {
    at: { type: 'time', default: null, desc: 'patlama anı' },
    size: { type: 'number', default: 1, desc: 'büyüklük çarpanı' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    if (d < 0 || d > 1.4) return;
    const s = Math.max(0.2, p.size);
    ctx.lineCap = 'round';

    // 1) flaş — ilk 0.18 sn: yıldız ışınlar + parlama
    if (d < 0.18) {
      const f = 1 - d / 0.18;
      k.glow(0, 0, 120 * s, 'yellow', 0.5 * f);
      ctx.fillStyle = k.rgba('yellow', 0.85 * f);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * k.TAU + 0.2, r1 = 30 * s, r2 = (60 + 40 * f) * s;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a - 0.12) * r1, Math.sin(a - 0.12) * r1);
        ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
        ctx.lineTo(Math.cos(a + 0.12) * r1, Math.sin(a + 0.12) * r1);
        ctx.closePath(); ctx.fill();
      }
      ctx.fillStyle = k.rgba('yellow', 0.9 * f);
      ctx.beginPath(); ctx.arc(0, 0, (10 + 18 * f) * s, 0, k.TAU); ctx.fill();
    }

    // 2) ateş topu — 0–0.55 sn: büyür, solar (kırmızı → sarı → parlak çekirdek)
    if (d < 0.55) {
      const g = k.prog(d, 0, 0.5);
      const r = (20 + 70 * k.E.outExpo(g)) * s;
      const a = 1 - g * g;
      // noise ile titreyen organik kenar
      const wob = (rr, seed, amp) => {
        ctx.beginPath();
        for (let i = 0; i <= 24; i++) {
          const an = (i / 24) * k.TAU;
          const q = rr * (1 + k.noise1(seed + i * 0.7 + t * 7) * amp);
          const x = Math.cos(an) * q, y = Math.sin(an) * q;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath(); ctx.fill();
      };
      k.glow(0, 0, r * 1.7, 'red', 0.4 * a);
      ctx.fillStyle = k.rgba('red', 0.75 * a);
      wob(r, 1.7, 0.12);
      ctx.fillStyle = k.rgba('yellow', 0.8 * a);
      wob(r * 0.62, 4.2, 0.14);
      ctx.fillStyle = k.rgba('yellow', 0.9 * a);
      wob(r * 0.3, 8.9, 0.16);
    }

    // 3) duman halkası — 0.1–0.9 sn: genişler, incelir, solar
    if (d > 0.1 && d < 0.9) {
      const g = k.prog(d, 0.1, 0.9);
      ctx.strokeStyle = k.rgba('dim', 0.55 * (1 - g));
      ctx.lineWidth = 14 * s * (1 - g * 0.5);
      ctx.beginPath(); ctx.arc(0, 0, (30 + 95 * g) * s, 0, k.TAU); ctx.stroke();
    }

    // 4) parçalar — 0–1.0 sn: dışa saçılır, hafif yerçekimi
    if (d < 1.0) {
      const dd = Math.min(d, 1), al = 1 - dd;
      for (let i = 0; i < 12; i++) {
        const a = k.hash(i * 3 + 1) * k.TAU;
        const sp = (90 + k.hash(i * 5 + 2) * 110) * s;
        const dist = sp * (1 - Math.pow(1 - dd, 2));
        const x = Math.cos(a) * dist, y = Math.sin(a) * dist * 0.9 + dd * dd * 55 * s;
        const sz = (5 + k.hash(i * 7 + 3) * 7) * s;
        ctx.fillStyle = i % 3 === 0 ? k.rgba('yellow', al) : k.rgba('dim', al);
        ctx.save(); ctx.translate(x, y); ctx.rotate(a + d * 6);
        ctx.fillRect(-sz / 2, -sz / 3, sz, sz * 0.66);
        ctx.restore();
      }
    }

    // 5) yükselen duman — 0.2–1.4 sn
    if (d > 0.2) {
      const g = k.prog(d, 0.2, 1.4);
      for (let i = 0; i < 6; i++) {
        const px = (k.hash(i * 11 + 4) - 0.5) * 110 * s;
        const py = -20 * s - g * (60 + k.hash(i * 13 + 5) * 65) * s + k.noise1(i * 3 + t * 2) * 8;
        const r = (14 + g * 24 + k.hash(i * 17 + 6) * 8) * s;
        ctx.fillStyle = k.rgba('dim', 0.4 * (1 - g));
        ctx.beginPath(); ctx.arc(px, py, r, 0, k.TAU); ctx.fill();
      }
    }
  },
};

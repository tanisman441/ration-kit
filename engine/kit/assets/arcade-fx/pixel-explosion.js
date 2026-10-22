// arcade-fx/pixel-explosion — retro piksel patlaması: at anında (0.8 sn) 14 piksel
// kare merkezden dışa uçar, küçülüp solar. Boşta merkez piksel küp nabız atar,
// 3 küçük piksel yörüngede döner.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) patlama merkezidir.
export default {
  name: 'pixel-explosion', category: 'arcade-fx',
  desc: 'Merkezden dışa uçan retro piksel karelerden patlama efekti',
  tags: ['patlama', 'piksel', 'retro', 'efekt', 'arcade', 'explosion', 'pixel', 'burst', 'retro', 'blast'],
  box: [-160, -160, 160, 160],
  bleed: 30,
  anchor: 'patlama merkezi (0,0)',
  points: { centre: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'patlama anı (0.8 sn, 14 piksel)' },
    color: { type: 'color', default: 'yellow', desc: 'ana piksel rengi' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? 1e9 : t - p.at;
    const pal = [p.color, 'yellow', 'red', 'cyan'];
    ctx.save();

    // merkez piksel küp: boşta nabız
    const pulse = 1 + 0.08 * Math.sin(t * k.TAU / 2.4);
    const burst = d >= 0 && d < 0.8 ? Math.sin((d / 0.8) * Math.PI) : 0;
    const cs = 44 * pulse * (1 + burst * 0.35);
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-cs / 2, -cs / 2, cs, cs, 8); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); k.rrect(-cs / 2, -cs / 2, cs, cs, 8); ctx.stroke();
    // piksel çentikler
    ctx.fillStyle = k.rgba('bg', 0.45);
    const n = cs / 4;
    ctx.fillRect(-n / 2, -cs / 2, n, 7); ctx.fillRect(-n / 2, cs / 2 - 7, n, 7);
    ctx.fillRect(-cs / 2, -n / 2, 7, n); ctx.fillRect(cs / 2 - 7, -n / 2, 7, n);
    // parlama (alfa 0.10) + gölge
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-cs * 0.25, -cs * 0.3, cs * 0.22, cs * 0.14, -0.4, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(cs * 0.12, cs * 0.12, cs * 0.38, cs * 0.38, 6); ctx.fill();
    if (burst > 0) k.glow(0, 0, 70 * burst + 20, p.color, 0.35 * burst);

    // === OLAY: 14 piksel dışa uçar ===
    if (d >= 0 && d < 0.8) {
      const q = k.E.outCubic(d / 0.8);
      for (let i = 0; i < 14; i++) {
        const ang = k.hash(i * 1.7 + 0.3) * k.TAU;
        const dist = (46 + k.hash(i * 3.1) * 105) * q;
        const sz = (7 + k.hash(i * 7.7) * 11) * (1 - q * 0.75);
        const x = Math.cos(ang) * dist, y = Math.sin(ang) * dist;
        ctx.save(); ctx.translate(x, y); ctx.rotate(k.hash(i) * 1.2 - 0.6 + d * 3 * (i % 2 ? 1 : -1));
        ctx.fillStyle = k.rgba(pal[i % 4], 1 - q * 0.85);
        ctx.fillRect(-sz / 2, -sz / 2, sz, sz);
        ctx.restore();
      }
      // ilk flaş
      if (d < 0.2) {
        ctx.fillStyle = `rgba(255,255,255,${(1 - d / 0.2) * 0.5})`;
        ctx.beginPath(); ctx.arc(0, 0, 30 + d * 120, 0, k.TAU); ctx.fill();
      }
    } else {
      // boşta: 3 küçük piksel yörüngede döner
      for (let i = 0; i < 3; i++) {
        const ang = t * k.TAU / 3 + i * k.TAU / 3;
        const x = Math.cos(ang) * 62, y = Math.sin(ang) * 62;
        ctx.fillStyle = k.rgba(pal[(i + 1) % 4], 0.75);
        ctx.fillRect(x - 5, y - 5, 10, 10);
      }
    }

    ctx.restore();
  },
};

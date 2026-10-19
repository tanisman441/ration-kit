// liquid-fx/wave-crash — yükselen dalga tepesi; at anında kırılır, köpürür.
// NOT: canvas y-aşağıdır; dalga tabanı (0,10), tepe at öncesi yükselir.
export default {
  name: 'wave-crash',
  category: 'liquid-fx',
  desc: 'Yükselip kıvrılan dalga tepesi; at anında kırılıp köpük ve serpinti saçar',
  tags: ['dalga', 'kırılma', 'köpük', 'serpinti', 'deniz', 'wave', 'crash', 'breaker', 'foam', 'spray', 'sea'],
  box: [-180, -140, 180, 40],
  bleed: 36,
  anchor: 'dalga tabanı (0,10); tepe at öncesi yükselir',
  points: { base: [0, 10], crest: [0, -100] },
  params: {
    at: { type: 'time', default: null, desc: 'dalganın kırılma anı' },
    color: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };
    const d = p.at == null ? null : t - p.at;

    // şişme: at'ten 1.2 sn önce başlar
    let swell;
    if (d == null) swell = 0.55 + Math.sin(t * 1.2) * 0.08;
    else if (d < 0) swell = k.clamp(-d / 1.2, 0, 1);
    else swell = 1;
    const crestY = -28 - 72 * swell + (d == null ? Math.sin(t * 1.4) * 4 : 0);
    const curl = 26 * swell;

    const wavePath = () => {
      ctx.beginPath();
      ctx.moveTo(-170, 28);
      ctx.bezierCurveTo(-140, crestY + 46, -92, crestY + 12, -42, crestY + 4);
      ctx.bezierCurveTo(-4, crestY - 12, 34, crestY + 8, 58, crestY + 30 + curl);
      ctx.quadraticCurveTo(96, crestY + 64, 170, 28);
      ctx.closePath();
    };

    // taban deniz şeridi
    ctx.fillStyle = line;
    k.rrect(-170 + 5, -14 + 6, 340, 50, 14); ctx.fill();
    ctx.fillStyle = darker(p.color);
    k.rrect(-170 + 5, -14 + 6, 340, 50, 14); ctx.fill();
    ctx.fillStyle = line;
    k.rrect(-170, -14, 340, 50, 14); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 0.5);
    k.rrect(-170, -14, 340, 50, 14); ctx.fill();

    if (d == null || d < 0) {
      // yükselen dalga
      ctx.save();
      ctx.translate(6, 6);
      wavePath(); ctx.fillStyle = darker(p.color); ctx.fill();
      ctx.restore();
      ctx.strokeStyle = line; ctx.lineWidth = 8;
      wavePath(); ctx.stroke();
      ctx.fillStyle = k.rgba(p.color, 0.8);
      wavePath(); ctx.fill();
      // sol üst parlama
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-84, crestY + 26, 44, 12, -0.35, 0, k.TAU); ctx.fill();
      // tepe köpük çizgisi (kıvrım ucunda)
      if (swell > 0.55) {
        const f = (swell - 0.55) / 0.45;
        ctx.strokeStyle = k.rgba(p.color, 0.7 * f);
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(20, crestY + 16);
        ctx.quadraticCurveTo(44, crestY + 22 + curl * 0.5, 60, crestY + 32 + curl);
        ctx.stroke();
      }
      return;
    }

    // kırılma: tepe çökerken köpük patlar (geçiş yumuşak, ani kaybolma yok)
    if (d < 0.55) {
      const cg = k.prog(d, 0, 0.55);
      const ccY = crestY * (1 - cg) + (-14) * cg; // -100 → -14: çöken tepe
      const cpath = () => {
        ctx.beginPath();
        ctx.moveTo(-170, 28);
        ctx.bezierCurveTo(-140, ccY + 46, -92, ccY + 12, -42, ccY + 4);
        ctx.bezierCurveTo(-4, ccY - 12, 34, ccY + 8, 58, ccY + 30 + curl * (1 - cg));
        ctx.quadraticCurveTo(96, ccY + 64, 170, 28);
        ctx.closePath();
      };
      ctx.strokeStyle = line; ctx.lineWidth = 8;
      cpath(); ctx.stroke();
      ctx.fillStyle = k.rgba(p.color, 0.8 * (1 - cg * 0.5));
      cpath(); ctx.fill();
    }
    // çöken gövde: kırılma sonrası yayılan su kütlesi
    const settleIn = k.prog(d, 0.2, 0.8);
    const settle = k.prog(d, 0, 1.1);
    if (settleIn > 0) {
      ctx.fillStyle = k.rgba(p.color, 0.55 * settleIn * (1 - settle * 0.6));
      ctx.beginPath();
      ctx.moveTo(-170, 28);
      ctx.quadraticCurveTo(-60, -20 - 20 * settle, 60, 6 - 10 * settle);
      ctx.quadraticCurveTo(120, 16, 170, 28);
      ctx.closePath(); ctx.fill();
    }

    // köpük patlaması: büyüyerek doğar, sonra söner
    const grow = 0.3 + 0.7 * k.prog(d, 0, 0.35);
    const bf = 1 - k.prog(d, 0, 1.0);
    for (let i = 0; i < 12; i++) {
      const h1 = k.hash(i * 3.7 + 2), h2 = k.hash(i * 6.1 + 8);
      const x = 10 + (h1 - 0.4) * 130 - d * 30;
      const y = crestY + 10 - d * 60 + (h2 - 0.5) * 44;
      const r = (7 + h1 * 13) * grow;
      ctx.fillStyle = k.rgba(p.color, 0.85 * bf);
      ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
      ctx.fillStyle = `rgba(255,255,255,${0.35 * bf})`;
      ctx.beginPath(); ctx.arc(x - r * 0.25, y - r * 0.3, r * 0.35, 0, k.TAU); ctx.fill();
    }
    // serpinti damlaları
    const sf = 1 - k.prog(d, 0.1, 0.9);
    for (let i = 0; i < 10; i++) {
      const h1 = k.hash(i * 5.3 + 14), h2 = k.hash(i * 8.9 + 21);
      const x = 30 + (h1 - 0.5) * 150;
      const y = crestY - 10 - h2 * 60 * Math.max(0, 1 - d) + 240 * d * d;
      if (y > 30) continue;
      const sz = 3 + h2 * 4;
      ctx.fillStyle = k.rgba(p.color, 0.8 * sf);
      ctx.beginPath(); ctx.ellipse(x, y, sz * 0.8, sz * 1.3, 0, 0, k.TAU); ctx.fill();
    }
    // taban köpük bandı: yayılır, söner
    const pf = k.prog(d, 0, 0.25) * (1 - k.prog(d, 0.4, 1.6));
    if (pf > 0) {
      ctx.fillStyle = k.rgba(p.color, 0.6 * pf);
      ctx.beginPath(); ctx.ellipse(0, 14, 70 + 100 * settle, 8 + 6 * settle, 0, 0, k.TAU); ctx.fill();
      for (let i = 0; i < 8; i++) {
        const h = k.hash(i * 7.7 + 30);
        ctx.fillStyle = `rgba(255,255,255,${0.4 * pf})`;
        ctx.beginPath(); ctx.arc((h - 0.5) * 220, 12 + (h - 0.5) * 10, 3 + h * 3, 0, k.TAU); ctx.fill();
      }
    }
  },
};

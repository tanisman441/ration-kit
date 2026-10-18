// nature/snow — kar yağışı; gust anında rüzgâr taneleri savurur, normalde taneler süzülür.
// NOT: canvas y-aşağıdır; taneler üstten alta süzülür.
export default {
  name: 'snow',
  category: 'nature',
  desc: 'Kar yağışı; gust anında rüzgâr taneleri yana savurur, normalde taneler süzülerek düşer',
  tags: ['kar', 'kar tanesi', 'kış', 'hava', 'yağış', 'snow', 'snowflake', 'winter', 'weather', 'blizzard'],
  box: [-150, -170, 150, 170],
  bleed: 40,
  anchor: 'merkez (0,0); kar alanı',
  points: {},
  params: {
    color: { type: 'color', default: 'dim' },
    gust: { type: 'time', default: null, desc: 'rüzgâr olayı anı (~1.4 sn savrulma)' },
    density: { type: 'number', default: 0.7, desc: 'tane yoğunluğu 0–1' },
  },
  draw(ctx, t, p, k) {
    const LW = 4;
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round';

    const dens = k.clamp(p.density, 0, 1);

    // gust olayı: 1.4 sn'lik yandan savrulma
    const d = p.gust == null ? -1 : t - p.gust;
    const genv = d < 0 || d > 1.4 ? 0 : Math.sin(k.clamp(d / 1.4, 0, 1) * Math.PI);
    const gustX = genv * 150;

    // rüzgâr çizgileri (olay sırasında)
    if (genv > 0.02) {
      ctx.strokeStyle = k.rgba(p.color, 0.65 * genv);
      ctx.lineWidth = 5;
      for (let i = 0; i < 4; i++) {
        const y = -110 + i * 65 + k.hash(i * 5.1) * 30;
        const x0 = -170 + k.hash(i * 3.3) * 40;
        ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + 110 + genv * 100, y - 10); ctx.stroke();
      }
    }

    // kar taneleri: 6 kollu yıldız, hash ile sabit dağılım
    const NF = 24;
    const topY = -175, fallH = 350;
    const flake = (x, y, r, rot) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      ctx.strokeStyle = line; ctx.lineWidth = r * 0.34 + LW;
      for (let a = 0; a < 3; a++) {
        ctx.beginPath();
        ctx.moveTo(-r, 0); ctx.lineTo(r, 0);
        ctx.stroke();
        ctx.rotate(Math.PI / 3);
      }
      ctx.strokeStyle = k.rgba(p.color); ctx.lineWidth = r * 0.34;
      for (let a = 0; a < 3; a++) {
        ctx.beginPath();
        ctx.moveTo(-r, 0); ctx.lineTo(r, 0);
        ctx.stroke();
        ctx.rotate(Math.PI / 3);
      }
      // premium parlama: sol üst kola küçük ışıltı
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.arc(-r * 0.55, -r * 0.3, r * 0.28, 0, k.TAU); ctx.fill();
      ctx.restore();
    };

    for (let i = 0; i < NF; i++) {
      if (k.hash(i * 11.3 + 4) > dens) continue;
      const x0 = -140 + k.hash(i * 3.7) * 280;
      const speed = 34 + k.hash(i * 6.1) * 46;
      const yy = topY + ((t * speed + k.hash(i * 8.9) * fallH) % fallH);
      // idle: süzülme salınımı + gust savrulması (x sarmalanır, kutu dışına taşmaz)
      const sway = Math.sin(t * 0.9 + k.hash(i * 2.2) * k.TAU) * 14;
      const xx = -150 + (((x0 + sway + gustX + 150) % 300) + 300) % 300;
      const r = 8 + k.hash(i * 5.5) * 9;
      const rot = t * 0.25 * (k.hash(i * 7.7) - 0.5) * 2 + gustX * 0.004;
      flake(xx, yy, r, rot);
    }
  },
};

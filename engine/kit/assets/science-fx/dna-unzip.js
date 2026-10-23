// science-fx/dna-unzip — DNA sarmalı; `at` anında fermuar gibi yukarıdan aşağıya açılır.
// NOT: canvas y-aşağıdır; merkez (0,0).
export default {
  name: 'dna-unzip',
  category: 'science-fx',
  desc: 'Dikey DNA sarmalı: at anında üstten alta fermuar gibi açılır, baz çiftleri ayrılır',
  tags: ['dna', 'gen', 'genetik', 'fermuar', 'açılma', 'sarmal', 'baz çifti', 'dna unzip', 'genetics', 'helix'],
  box: [-115, -155, 115, 155],
  bleed: 30,
  anchor: 'merkez (0,0)',
  points: { top: [0, -155] },
  params: {
    at: { type: 'time', default: null, desc: 'fermuarın açılmaya başlama anı (üstten alta ~1.2 sn)' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const acc = 'cyan';
    const topY = -140, botY = 140;
    ctx.save();
    ctx.lineCap = 'round';

    // açılma ilerlemesi 0–1 (1.2 sn), fermuar çizgisi üstten alta iner
    const g = d < 0 ? 0 : k.prog(d, 0, 1.2);
    const zipY = topY + 26 + g * (botY - topY - 52);
    const spin = t * 0.9;
    const sway = Math.sin(t * 1.3) * 2;

    // tek sarmal kolunun (y)deki x konumu
    const strandX = (y, s) => {
      const sgn = s === 0 ? 1 : -1;
      const ph = ((y - topY) / (botY - topY)) * Math.PI * 5 + spin;
      const open = k.clamp((zipY - y) / 48, 0, 1); // zipY'nin üstü açılmış
      const amp = 34 * (1 - open * 0.85);
      const splay = open * 58;
      return Math.sin(ph + s * Math.PI) * amp + sgn * splay + sway;
    };

    // kollar — önce dış hat (bg), sonra renkli
    const N = 64;
    for (const pass of [0, 1]) {
      for (let s = 0; s < 2; s++) {
        ctx.beginPath();
        for (let i = 0; i <= N; i++) {
          const y = topY + (botY - topY) * (i / N);
          const x = strandX(y, s);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        if (pass === 0) { ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 11; }
        else { ctx.strokeStyle = k.rgba(acc, 0.95); ctx.lineWidth = 6; }
        ctx.stroke();
      }
    }

    // baz çiftleri — kapalı bölgede tam basamak, açık bölgede ayrılmış yarılar
    for (let y = topY + 14; y < botY - 8; y += 24) {
      const x0 = strandX(y, 0), x1 = strandX(y, 1);
      const open = k.clamp((zipY - y) / 48, 0, 1);
      ctx.lineWidth = 5;
      if (open < 0.5) {
        ctx.strokeStyle = k.rgba(acc, 0.6 * (1 - open));
        ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
      } else {
        // ayrılmış yarılar — her biri kendi koluna bağlı, ucu yukarı kıvrık
        ctx.strokeStyle = k.rgba(acc, 0.45);
        const mid = (x0 + x1) / 2;
        ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(mid - 8, y - 7); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(mid + 8, y - 7); ctx.stroke();
      }
    }

    // fermuar sürgüsü — açılma çizgisinde parlak halka
    if (d >= 0 && d < 1.4) {
      const pulse = 1 + Math.sin(d * 25) * 0.12;
      k.glow(0, zipY, 26, acc, 0.4);
      ctx.fillStyle = k.rgba('bg', 0.55);
      ctx.beginPath(); ctx.arc(0, zipY, 11 * pulse, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(acc, 1);
      ctx.beginPath(); ctx.arc(0, zipY, 8 * pulse, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.beginPath(); ctx.arc(-2.5, zipY - 2.5, 2.6, 0, k.TAU); ctx.fill();
      // ayrılma kıvılcımları
      for (let i = 0; i < 7; i++) {
        const a = k.hash(i * 31 + 7) * k.TAU;
        const r = (d * 130) % 46;
        const px = Math.cos(a) * r, py = zipY + Math.sin(a) * r * 0.6;
        ctx.fillStyle = k.rgba(acc, 0.8 * (1 - r / 46));
        ctx.beginPath(); ctx.arc(px, py, 3, 0, k.TAU); ctx.fill();
      }
    } else {
      // açılma yokken üstte küçük kapak halkası
      ctx.fillStyle = k.rgba(acc, 0.9);
      ctx.beginPath(); ctx.arc(0, topY, 7, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath(); ctx.arc(-2, topY - 2, 2.2, 0, k.TAU); ctx.fill();
    }

    // premium parlama (sol üst, açık kolların üstünde)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-52, -96, 22, 40, 0.3, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};

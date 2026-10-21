// electric-fx/fuse-blow — cam gövdeli sigorta; blow anında patlar.
// ANIMASYON: `blow` zamanında 0.2 sn flaş + cam çatlakları + yükselen duman (1.2 sn);
// idle'da yeşil durum LED'i yanıp söner. Tek vurgu: yellow (flaş).
// Contract: engine/kit/ASSETS.md
export default {
  name: 'fuse-blow',
  category: 'electric-fx',
  desc: 'Cam gövdeli sigorta; blow anında flaşla patlar, camı çatlar, dumanı yükselir',
  tags: ['sigorta', 'patlama', 'arıza', 'elektrik', 'devre', 'duman', 'fuse', 'blow', 'explosion', 'fault', 'electric', 'smoke'],
  box: [-90, -85, 90, 85],
  bleed: 70,
  anchor: 'sigorta gövde merkezi (0,0)',
  points: { left: [-62, 0], right: [62, 0], top: [0, -34] },
  params: {
    blow: { type: 'time', default: null, desc: 'patlama anı: 0.2 sn flaş, 1.2 sn duman' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    const d = p.blow == null ? -1 : t - p.blow;
    const blown = d >= 0;
    const exploding = d >= 0 && d < 0.25;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // --- metal uçlar ---
    for (const sx of [-1, 1]) {
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); k.rrect(sx * 52 - 14 + 5, -11 + 5, 28, 22, 8); ctx.fill();
      ctx.fillStyle = k.rgba('dim');
      ctx.beginPath(); k.rrect(sx * 52 - 14, -11, 28, 22, 8); ctx.fill();
      ctx.fillStyle = k.rgba('#ffffff', 0.10);
      ctx.beginPath(); ctx.ellipse(sx * 52 - 7, -4, 5, 7, 0.4, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4.5;
      ctx.beginPath(); k.rrect(sx * 52 - 14, -11, 28, 22, 8); ctx.stroke();
    }

    // --- cam gövde ---
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-52 + 6, -28 + 6, 104, 56, 16); ctx.fill();
    ctx.fillStyle = k.rgba('panel', 0.55);
    ctx.beginPath(); k.rrect(-52, -28, 104, 56, 16); ctx.fill();
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(-32, -16, 14, 8, -0.4, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); k.rrect(-52, -28, 104, 56, 16); ctx.stroke();

    // --- iç tel: sağlamken düz, patlayınca iki kırık uç ---
    if (!blown) {
      const hum = 1 + 0.08 * k.noise1(t * 5);             // telde hafif akım titremesi
      ctx.strokeStyle = k.rgba(p.color, 0.85 * hum);
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(-48, 0); ctx.lineTo(48, 0); ctx.stroke();
      k.glow(0, 0, 18, p.color, 0.22 * hum);
      // durum LED'i: 2 sn'de bir 0.25 sn yanar (idle)
      const led = (t % 2) < 0.25 ? 1 : 0.12;
      k.glow(0, -42, 10, 'green', 0.5 * led);
      ctx.fillStyle = k.rgba('green', led);
      ctx.beginPath(); ctx.arc(0, -42, 4.5, 0, k.TAU); ctx.fill();
    } else {
      // kırık tel uçları
      // kurum kararması: patlama sonrası cam kararır
      const soot = k.prog(d, 0.05, 0.5);
      if (soot > 0) {
        ctx.fillStyle = k.rgba('bg', 0.18 * soot);
        ctx.beginPath(); k.rrect(-52, -28, 104, 56, 16); ctx.fill();
      }
      for (const sx of [-1, 1]) {
        ctx.strokeStyle = k.rgba('ink', 0.7);
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(sx * 48, 0);
        ctx.quadraticCurveTo(sx * 30, -6, sx * 22, sx > 0 ? 8 : -9);
        ctx.stroke();
      }
      // LED söndü
      ctx.fillStyle = k.rgba('dim', 0.5);
      ctx.beginPath(); ctx.arc(0, -42, 4.5, 0, k.TAU); ctx.fill();

      // cam çatlakları: patlamadan sonra kalıcı
      ctx.strokeStyle = k.rgba('ink', 0.5);
      ctx.lineWidth = 2.5;
      for (let i = 0; i < 5; i++) {
        const a = k.hash(i * 3 + 5) * k.TAU;
        const x2 = Math.cos(a) * 44, y2 = Math.sin(a) * 24;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(x2, y2); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 + (k.hash(i * 11) - 0.5) * 22, y2 + (k.hash(i * 17) - 0.5) * 14);
        ctx.stroke();
      }
    }

    // --- patlama flaşı ---
    if (exploding) {
      const env = 1 - k.prog(d, 0, 0.22);
      k.glow(0, 0, 64, p.color, 0.5 * env);
      ctx.fillStyle = k.rgba('#ffffff', 0.75 * env);
      ctx.beginPath(); k.rrect(-52, -28, 104, 56, 16); ctx.fill();
    }

    // --- duman: 1.2 sn yükselir ---
    if (d >= 0 && d < 1.2) {
      for (let i = 0; i < 4; i++) {
        const start = i * 0.12;
        const ph = k.prog(d, start, start + 0.9);
        if (ph <= 0 || ph >= 1) continue;
        const y = k.lerp(10, -72, ph);
        const x = Math.sin(ph * 6 + i * 2.4) * 14;
        const alpha = 0.45 * Math.sin(ph * Math.PI) * (1 - k.prog(d, 0.8, 1.2));
        ctx.fillStyle = k.rgba('dim', Math.max(0, alpha));
        ctx.beginPath(); ctx.arc(x, y, 8 + ph * 14, 0, k.TAU); ctx.fill();
      }
    }
  },
};

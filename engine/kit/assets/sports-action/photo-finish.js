// sports-action/photo-finish — bitiş çizgisi foto-finish anı. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; bitiş çizgisi x=0 dikeyindedir, zemin y=0'dır.
export default {
  name: 'photo-finish',
  category: 'sports-action',
  desc: 'Bitiş çizgisinde iki koşucu silueti; döngüsel titreme + time-param at anında kamera flaşı',
  tags: ['foto finish', 'bitiş', 'finish', 'photo finish', 'çizgi', 'koşu', 'yarış', 'kamera', 'flash', 'flaş', 'race', 'sprint'],
  box: [-195, -245, 195, 24],
  bleed: 50,
  anchor: 'bitiş çizgisi x=0 dikeyinde; zemin y=0',
  points: { line: [0, -130] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'deklanşör anı: kamera flaşı patlar' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const d = p.at == null ? -1 : t - p.at;

    // --- bitiş çizgisi (dama desenli dikey şerit) ---
    const LW2 = 7; // şerit genişliği
    for (let j = 0; j < 9; j++) {
      const y0 = -232 + j * 26;
      for (let i = 0; i < 2; i++) {
        ctx.fillStyle = ((i + j) % 2 === 0) ? k.rgba('ink') : k.rgba('bg', 0.75);
        ctx.fillRect(-LW2 / 2 + i * (LW2 / 2), y0, LW2 / 2, 26);
      }
    }
    ctx.fillStyle = line;  // şerit kenar çizgileri
    ctx.fillRect(-LW2 / 2 - 2, -232, 2, 232); ctx.fillRect(LW2 / 2, -232, 2, 232);
    // zemin çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-190, 0); ctx.lineTo(190, 0); ctx.stroke();

    // --- koşucu figürü (parametreli: pozisyon, eğim yönü, renk) ---
    const runner = (rx, leanDir, c, seed) => {
      const trem = k.noise1(t * 7 + seed) * 1.6;      // döngüsel titreme
      const tremY = k.noise1(t * 6.2 + seed * 2) * 1.2;
      ctx.save();
      ctx.translate(rx + trem, tremY);
      // gölge
      ctx.fillStyle = k.rgba('bg', 0.3);
      ctx.beginPath(); ctx.ellipse(0, -4, 46, 8, 0, 0, k.TAU); ctx.fill();
      // bacaklar (depar pozu: biri önde biri arkada)
      const leg = (x1, y1, x2, y2, w) => {
        ctx.strokeStyle = line; ctx.lineWidth = w + LW;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        ctx.strokeStyle = c; ctx.lineWidth = w;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      };
      leg(-6, -128, -52 + leanDir * 14, -8, 19);
      leg(6, -128, 52 + leanDir * 14, -10, 19);
      ctx.fillStyle = line; ctx.fillStyle = c;
      // ayaklar
      const foot = (fx2) => { ctx.fillStyle = line; ctx.beginPath(); k.rrect(fx2 - 16, -17, 34, 15, 6); ctx.fill(); ctx.fillStyle = c; ctx.beginPath(); k.rrect(fx2 - 13, -14, 28, 12, 6); ctx.fill(); };
      foot(-52 + leanDir * 14); foot(52 + leanDir * 14);
      // gövde (çizgiye eğik)
      const tilt = leanDir * 0.22;
      ctx.save(); ctx.translate(0, -180); ctx.rotate(tilt); ctx.translate(0, 180);
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(-36, -242, 72, 116, 26); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(-31, -237, 62, 106, 24); ctx.fill();
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); ctx.ellipse(14, -170, 11, 38, 0.1, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-16, -214, 9, 24, 0.12, 0, k.TAU); ctx.fill();
      ctx.restore();
      // kollar (depar salınımı)
      leg(-20, -200, -58 + leanDir * 10, -150, 16);
      leg(20, -200, 54 + leanDir * 10, -250, 16);
      // baş
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(leanDir * 12, -248, 38, 36, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(leanDir * 12, -248, 36, 34, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = inkC;
      ctx.beginPath(); ctx.ellipse(leanDir * 12 - 10, -250, 4, 4, 0, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(leanDir * 12 + 10, -250, 4, 4, 0, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.ellipse(leanDir * 12, -234, 5, 7, 0, 0, k.TAU); ctx.stroke();  // efor ağzı
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(leanDir * 12 - 13, -260, 13, 9, -0.4, 0, k.TAU); ctx.fill();
      ctx.restore();
    };

    // iki koşucu: biri soldan sağa eğik, diğeri sağdan sola (bitişe aynı anda)
    runner(-78, 1, body, 3);
    runner(84, -1, k.rgba('panel2'), 11);

    // --- kamera flaşı (at anında) ---
    if (d >= 0 && d < 0.3) {
      const f = 1 - d / 0.3;
      // flaş parlaması
      const grad = ctx.createRadialGradient(0, -150, 8, 0, -150, 150);
      grad.addColorStop(0, `rgba(255,255,255,${0.85 * f})`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(0, -150, 150, 0, k.TAU); ctx.fill();
      // flaş ışınları
      ctx.strokeStyle = `rgba(255,255,255,${0.7 * f})`; ctx.lineWidth = 4;
      for (let i = 0; i < 8; i++) {
        const a = (k.TAU * i) / 8 + 0.3;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 56, -150 + Math.sin(a) * 56);
        ctx.lineTo(Math.cos(a) * 92, -150 + Math.sin(a) * 92);
        ctx.stroke();
      }
      // kıvılcım yıldızları
      for (let i = 0; i < 5; i++) {
        const sx = (k.hash(i * 7 + 1) - 0.5) * 220, sy = -150 + (k.hash(i * 13 + 5) - 0.5) * 160;
        const sr = 4 + 8 * f;
        ctx.strokeStyle = `rgba(255,255,200,${0.8 * f})`; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(sx - sr, sy); ctx.lineTo(sx + sr, sy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(sx, sy - sr); ctx.lineTo(sx, sy + sr); ctx.stroke();
      }
    }
    // flaş öncesi hazır ışığı (hafif nabız — idle canlılık)
    if (d < 0) {
      const pulse = 0.5 + 0.5 * Math.sin((k.TAU * t) / 1.4);
      k.glow(120, -210, 20 + 6 * pulse, 'yellow', 0.12 + 0.1 * pulse);  // kamera hazır ışığı
      // kamera gövdesi (sağ üstte küçük)
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(96, -228, 48, 36, 8); ctx.fill();
      ctx.fillStyle = k.rgba('panel2'); ctx.beginPath(); k.rrect(98, -226, 44, 32, 7); ctx.fill();
      ctx.fillStyle = inkC; ctx.beginPath(); ctx.ellipse(120, -210, 10, 10, 0, 0, k.TAU); ctx.fill();
    }
  },
};

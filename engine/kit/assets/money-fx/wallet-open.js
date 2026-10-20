// money-fx/wallet-open — açılan cüzdan: at anında ön kapak menteşeden
// yukarı kalkar; içinden kartlar ve coinler yükselir, açılış parıltısı atar.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) cüzdan merkezidir.
export default {
  name: 'wallet-open', category: 'money-fx',
  desc: 'Açılan cüzdan: at anında kapak kalkar, içinden kartlar ve coinler yükselir',
  tags: ['cüzdan', 'para', 'kart', 'açılma', 'wallet', 'money', 'open', 'card', 'coin'],
  box: [-110, -90, 110, 90],
  bleed: 30,
  anchor: 'cüzdan merkezi (0,0) — açıklık y=-58 çizgisinde',
  points: { opening: [0, -58], center: [0, 0] },
  params: {
    color: { type: 'color', default: 'panel2' },
    at: { type: 'time', default: null, desc: 'açılma anı (0.6 sn kapak kalkışı)' },
  },
  draw(ctx, t, p, k) {
    const BW = 180, BH = 116, HX = 0, HY = -58; // menteşe (üst kenar)
    const d = p.at == null ? 1e9 : t - p.at;
    const open = d < 0 ? 0 : Math.min(d / 0.6, 1);
    const eo = 1 - Math.pow(1 - open, 3); // easeOutCubic
    const breathe = Math.sin(t * 2.2) * 2;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    ctx.save(); ctx.translate(0, breathe);

    // açılış parıltısı (ilk 0.5 sn)
    if (d >= 0 && d < 0.5) {
      const f = 1 - d / 0.5;
      k.glow(0, -60, 70 * f, 'yellow', 0.45 * f);
    }

    // cüzdan gövdesi (arka)
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-BW / 2 - 3.5, HY - 3.5, BW + 7, BH + 7, 22); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-BW / 2, HY, BW, BH, 18); ctx.fill();
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-BW / 2 + 26, HY + 20, 24, 10, -0.35, 0, k.TAU); ctx.fill();

    // ön cep detayı (alt yarı): dikişli cep çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.25); ctx.lineWidth = 2.5; ctx.setLineDash([8, 7]);
    ctx.beginPath(); k.rrect(-BW / 2 + 12, 2, BW - 24, 48, 12); ctx.stroke();
    ctx.setLineDash([]);
    // cep ağzı (koyu çizgi) — içerik buradan yükselir
    ctx.fillStyle = k.rgba('bg', 0.9);
    ctx.beginPath(); k.rrect(-80, HY + 6, 160, 18, 9); ctx.fill();

    // iç cep: yükselen kartlar + coinler (açıldıkça belirir)
    if (eo > 0.01) {
      const rev = k.prog(open, 0.25, 0.85); // içerik yükselme ilerlemesi
      // kartlar
      const cards = [
        { x: -38, col: 'yellow', rise: 46 },
        { x: 6, col: 'ink', rise: 58 },
        { x: 48, col: 'yellow', rise: 40 },
      ];
      cards.forEach((c, i) => {
        const cy = HY + 30 - c.rise * rev + Math.sin(t * 2.4 + i * 2.1) * 1.5;
        ctx.save(); ctx.translate(c.x, cy); ctx.rotate((i - 1) * 0.06);
        ctx.fillStyle = k.rgba('bg', 0.55 * rev);
        ctx.beginPath(); k.rrect(-23, -35, 46, 66, 9); ctx.fill();
        ctx.fillStyle = k.rgba(c.col, rev);
        ctx.beginPath(); k.rrect(-21, -33, 42, 62, 8); ctx.fill();
        // kart parıltısı (atımlı)
        const gl = 0.10 + 0.08 * Math.sin(t * 3.2 + i * 1.7);
        ctx.fillStyle = 'rgba(255,255,255,' + (gl * rev).toFixed(3) + ')';
        ctx.beginPath(); k.rrect(-21, -33, 42, 8, 4); ctx.fill();
        ctx.restore();
      });
      // coinler
      [-62, 72].forEach((cx, i) => {
        const cy = HY + 34 - (30 + i * 10) * rev + Math.abs(Math.sin(t * 3 + i * 3)) * 3;
        ctx.fillStyle = k.rgba('bg', 0.55 * rev);
        ctx.beginPath(); ctx.arc(cx, cy, 15, 0, k.TAU); ctx.fill();
        ctx.fillStyle = k.rgba('yellow', rev);
        ctx.beginPath(); ctx.arc(cx, cy, 13, 0, k.TAU); ctx.fill();
        ctx.strokeStyle = k.rgba('ink', 0.4 * rev); ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(cx, cy, 8, 0, k.TAU); ctx.stroke();
      });
      // kıvılcımlar (açılış sonrası kısa süre)
      if (d >= 0.15 && d < 1.0) {
        const sa = 1 - k.prog(d, 0.15, 1.0);
        for (let i = 0; i < 3; i++) {
          const a = k.hash(i * 7 + 743) * k.TAU;
          const sx = Math.cos(a) * (26 + i * 14), sy = HY - 12 - Math.abs(Math.sin(a)) * 26;
          ctx.strokeStyle = k.rgba('yellow', sa * 0.8); ctx.lineWidth = 3;
          const s = 6;
          ctx.beginPath();
          ctx.moveTo(sx - s, sy); ctx.lineTo(sx + s, sy);
          ctx.moveTo(sx, sy - s); ctx.lineTo(sx, sy + s);
          ctx.stroke();
        }
      }
    }

    // ön kapak: kapalıyken cebi örter, açılınca menteşeden yukarı kalkar
    const flapH = 52;
    const flap = (sy, hh, al) => {
      ctx.fillStyle = k.rgba('bg', 0.55 * al);
      ctx.beginPath(); k.rrect(-BW / 2 - 3.5 + 4, sy - 3.5, BW - 8 + 7, hh + 7, 16); ctx.fill();
      ctx.fillStyle = k.rgba(p.color, al);
      ctx.beginPath(); k.rrect(-BW / 2 + 4, sy, BW - 8, hh, 14); ctx.fill();
      // dikiş çizgisi
      ctx.strokeStyle = k.rgba('ink', 0.3 * al); ctx.lineWidth = 2.5; ctx.setLineDash([8, 7]);
      ctx.beginPath(); k.rrect(-BW / 2 + 12, sy + 8, BW - 24, hh - 16, 10); ctx.stroke();
      ctx.setLineDash([]);
    };
    if (eo < 0.99) {
      // kapalı/yükselen kapak: menteşede ezilir
      ctx.save(); ctx.translate(HX, HY); ctx.scale(1, Math.max(1 - eo, 0.02));
      flap(2, flapH, 1 - eo * 0.4);
      // çıtçıt düğme
      if (eo < 0.6) {
        const ba = 1 - eo / 0.6;
        ctx.fillStyle = k.rgba('yellow', ba);
        ctx.beginPath(); ctx.arc(0, 24, 10, 0, k.TAU); ctx.fill();
        ctx.strokeStyle = k.rgba('ink', 0.5 * ba); ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(0, 24, 10, 0, k.TAU); ctx.stroke();
      }
      ctx.restore();
    }
    // açılan kapak: menteşenin üstünde dikilir (pseudo-perspektif)
    if (eo > 0.01) {
      ctx.save(); ctx.translate(HX, HY); ctx.scale(1, Math.max(eo, 0.02));
      ctx.translate(0, -flapH + 4);
      flap(0, flapH, eo);
      ctx.restore();
    }
    ctx.restore();
  },
};

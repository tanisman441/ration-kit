// tailor-fx/iron-steam — ütü kumaşın üstünde; `at` anında buhar püskürtür, ütü hafifçe bastırır. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) ütü tabanı ortası, kumaş y ~45..95.
export default {
  name: 'iron-steam', category: 'tailor-fx',
  desc: 'Kumaş üstünde duran ütü; buhar anında ütü bastırır, tabandan buhar bulutları yükselir',
  tags: ['terzi', 'ütü', 'buhar', 'ütülemek', 'kumaş', 'tailor', 'iron', 'steam', 'ironing', 'press', 'cloth'],
  box: [-130, -110, 130, 110],
  bleed: 60,
  anchor: 'ütü tabanı ortası (0,42); kumaş üst kenarı y ~45',
  points: { iron: [0, 15], steam: [0, -70], fabric: [0, 70] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'ütü buhar püskürtür — buhar bulutları yükselir, ütü bastırır (1.0 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const steaming = d >= 0 && d < 1.0;
    // bastırma: buhar anında ütü 6 birim iner, sonra geri döner
    const press = steaming ? Math.sin(Math.min(d / 1.0, 1) * Math.PI) * 6 : 0;
    const bob = Math.sin(t * k.TAU / 2.6) * 2;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // kumaş (ütü masası üstü): ütü tabanının altında
    blob(-115, 45, 230, 50, 10, body);
    // kat izi çizgileri; buhar sonrası kırışık çizgisi silinir
    const creaseA = steaming ? 0.35 * (1 - k.clamp(d / 0.8, 0, 1)) + 0.05 : 0.35;
    ctx.strokeStyle = k.rgba('ink', creaseA); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-100, 62); ctx.lineTo(100, 62); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-100, 80); ctx.lineTo(100, 80); ctx.stroke();
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-88, 52, 18, 5, 0, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(-100, 97, 200, 8, 4); ctx.fill();

    // ütü gövdesi: sivri burun sağda, taban y=0..8; +40 kaydırma ile taban kumaşa oturur
    ctx.save();
    ctx.translate(0, press + bob + 40);
    // dış hat + gövde (üçgenimsi ütü silueti)
    ctx.beginPath();
    ctx.moveTo(-72, 0); ctx.lineTo(58, 0); ctx.lineTo(88, -16); ctx.lineTo(74, -34);
    ctx.quadraticCurveTo(30, -52, -30, -52); ctx.quadraticCurveTo(-66, -52, -72, -34);
    ctx.closePath();
    ctx.fillStyle = line; ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-68, -2); ctx.lineTo(56, -2); ctx.lineTo(82, -16); ctx.lineTo(70, -32);
    ctx.quadraticCurveTo(28, -48, -30, -48); ctx.quadraticCurveTo(-62, -48, -68, -32);
    ctx.closePath();
    ctx.fillStyle = body; ctx.fill();
    // taban plakası
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-70, -4, 140, 10, 5); ctx.fill();
    // buhar delikleri
    ctx.fillStyle = k.rgba('bg', 0.7);
    for (let i = 0; i < 5; i++) {
      ctx.beginPath(); ctx.arc(-52 + i * 26, 1, 2.5, 0, k.TAU); ctx.fill();
    }
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-44, -40, 18, 6, -0.2, 0, k.TAU); ctx.fill();
    // sap: üstte kavisli tutamak
    ctx.strokeStyle = line; ctx.lineWidth = 12;
    ctx.beginPath(); ctx.moveTo(-46, -48); ctx.quadraticCurveTo(-10, -78, 34, -62); ctx.stroke();
    ctx.strokeStyle = k.rgba('panel2'); ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(-46, -48); ctx.quadraticCurveTo(-10, -78, 34, -62); ctx.stroke();
    // düğme (ısı ayarı)
    ctx.fillStyle = k.rgba('accent');
    ctx.beginPath(); ctx.arc(8, -50, 7, 0, k.TAU); ctx.fill();
    ctx.restore();

    // buhar: 5 bulut, taban kenarlarından yükselir, büyür, solar
    const puff = (i, prog, baseA) => {
      const side = i % 2 === 0 ? -1 : 1;
      const px = side * (64 + k.hash(i + 5) * 22) + k.noise1(t * 1.1 + i * 3) * 8;
      const py = 38 - prog * 108;
      const r = 9 + prog * (17 + k.hash(i + 25) * 10);
      const a = baseA * (1 - prog) * (0.5 + 0.5 * Math.sin(prog * Math.PI));
      // buhar iki temada da açık okunmalı: sabit açık gri (parlama konvansiyonu gibi)
      ctx.fillStyle = `rgba(255,255,255,${(a * 0.6).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(px, py, r, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('bg', a * 0.3);
      ctx.beginPath(); ctx.arc(px, py, r * 0.7, 0, k.TAU); ctx.fill();
    };
    if (steaming) {
      for (let i = 0; i < 5; i++) {
        const prog = k.clamp((d - k.hash(i + 35) * 0.25) / 0.75, 0, 1);
        puff(i, prog, 0.85);
      }
      k.glow(0, -30, 40, 'panel2', 0.25);
    } else {
      // boştayken ara ara ince buhar teli
      const cyc = (t % 3) / 3;
      if (cyc < 0.3) puff(1, cyc / 0.3, 0.35);
    }
  },
};

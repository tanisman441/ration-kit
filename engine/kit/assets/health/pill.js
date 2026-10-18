// health/pill — hafif sola yatık iki renkli kapsül; boştayken süzülür, toss anında havaya sıçrayıp tam tur döner.
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır; (0,0) kapsülün merkezidir.
export default {
  name: 'pill', category: 'health',
  desc: 'İki renkli kapsül hap; boştayken hafifçe süzülür, toss anında sıçrayıp döner ve squaş ile düşer',
  tags: ['hap', 'ilaç', 'kapsül', 'pill', 'capsule', 'medicine', 'drug', 'eczane', 'tedavi'],
  box: [-95, -70, 95, 70],
  bleed: 80,
  anchor: 'kapsülün merkezi (0,0)',
  points: { left: [-66, 0], right: [66, 0] },
  params: {
    color: { type: 'color', default: 'red', desc: 'kapsülün sol yarısının rengi' },
    toss: { type: 'time', default: null, desc: 'fırlatma anı: havaya sıçrar, tam tur döner, squaş ile düşer (0.6 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const d = p.toss == null ? -1 : t - p.toss;

    // dönüş ve konum
    let rot = -0.5 + Math.sin(t * 1.3) * 0.04;   // idle salınım
    let y = Math.sin(t * 1.8) * 3;               // idle süzülme
    let sx = 1, sy = 1;
    const g = d < 0 ? 0 : k.prog(d, 0, 0.6);
    if (g > 0) {
      if (g < 0.72) {                            // havada: sıçrama + tam tur
        const u = g / 0.72;
        y = -Math.sin(u * Math.PI) * 80;
        rot = -0.5 + u * k.TAU;
      } else {                                   // iniş: squaş
        const v = (g - 0.72) / 0.28;
        sy = 1 - 0.16 * Math.sin(v * Math.PI);
        sx = 1 + 0.12 * Math.sin(v * Math.PI);
      }
    }

    const cap = () => { ctx.beginPath(); k.rrect(-66, -27, 132, 54, 27); };

    ctx.save();
    ctx.translate(0, y);
    ctx.rotate(rot);
    ctx.scale(sx, sy);

    // gölge (sağ alt %12 koyultma)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.save(); ctx.translate(7, 6); cap(); ctx.fill(); ctx.restore();
    // dış hat
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-66 - LW / 2, -27 - LW / 2, 132 + LW, 54 + LW, 27 + LW / 2); ctx.fill();
    // iki yarı (klipli)
    ctx.save(); cap(); ctx.clip();
    ctx.fillStyle = k.rgba(p.color); ctx.fillRect(-66, -27, 66, 54);
    ctx.fillStyle = k.rgba('dim', 0.95); ctx.fillRect(0, -27, 66, 54);
    // orta ayrım çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, -27); ctx.lineTo(0, 27); ctx.stroke();
    ctx.restore();

    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-36, -13, 26, 9, -0.25, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};

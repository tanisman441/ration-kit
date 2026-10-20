// music-fx/speaker-thump — bas vuran hoparlör: koni ileri-geri hareket eder.
// thump anında koni dışa fırlar + hava dalgası (0.5 sn); boşta düşük genlikte titreşim.
export default {
  name: 'speaker-thump', category: 'music-fx',
  desc: 'Bass speaker whose cone punches outward on each thump, pushing an air shockwave',
  tags: ['hoparlör', 'bas', 'speaker', 'bass', 'koni', 'thump', 'vuruş', 'subwoofer', 'gümbürtü'],
  box: [-140, -115, 140, 115],
  bleed: 45,
  anchor: '(0,0) koni merkezi',
  points: { cone: [0, 0], cabinet: [-120, -95], edge: [120, 0] },
  params: {
    thump: { type: 'time', default: null, desc: 'bas vuruşu: koni dışa fırlar + hava dalgası (0.5 sn)' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.thump == null ? -1 : t - p.thump;

    // 1) vuruş zarfı: 0.12 sn'de tepe, 0.5 sn'de sönüm
    let pop = 0;
    if (d >= 0 && d <= 0.5) {
      const e = (d - 0.12) / 0.09;
      pop = Math.exp(-e * e);
    }
    const shake = 3 * pop * Math.sin(d * 50);

    ctx.save();
    ctx.translate(shake, 0);

    // 2) kabin
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    k.rrect(-120 + 6, -95 + 6, 240, 190, 20); ctx.fill();
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 9;
    ctx.beginPath(); k.rrect(-120, -95, 240, 190, 20); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-72, -62, 40, 20, -0.5, 0, k.TAU); ctx.fill();

    // 3) kenarlık (surround) — sabit halka
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 7;
    ctx.beginPath(); ctx.arc(0, 0, 76, 0, k.TAU); ctx.fill(); ctx.stroke();

    // 4) koni — vuruşta dışa fırlar (büyür), boşta titrer
    const coneR = 60 * (1 + 0.28 * pop) + 2.5 * Math.sin(t * 11);
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(0, 0, coneR, 0, k.TAU); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-coneR * 0.3, -coneR * 0.35, coneR * 0.32, coneR * 0.2, -0.5, 0, k.TAU); ctx.fill();
    // toz kapağı
    const capR = 18 * (1 + 0.28 * pop);
    ctx.fillStyle = k.rgba('ink', 1);
    ctx.beginPath(); ctx.arc(0, 0, capR, 0, k.TAU); ctx.fill();
    if (pop > 0.02) k.glow(0, 0, 80, p.color, 0.5 * pop);
    ctx.restore();

    // 5) hava dalgası: koniden yayılan halka (0.5 sn)
    if (d >= 0 && d <= 0.5) {
      const g = k.prog(d, 0, 0.5);
      const pr = 70 + 85 * k.E.outExpo(g);
      ctx.strokeStyle = k.rgba(p.color, 0.7 * (1 - g));
      ctx.lineWidth = 8 * (1 - g) + 2;
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(0, 0, pr, 0, k.TAU); ctx.stroke();
      // iç ikinci halka
      const g2 = k.prog(d - 0.06, 0, 0.44);
      if (g2 > 0) {
        ctx.strokeStyle = k.rgba('ink', 0.4 * (1 - g2));
        ctx.lineWidth = 4 * (1 - g2) + 1.5;
        ctx.beginPath(); ctx.arc(0, 0, 55 + 80 * k.E.outExpo(g2), 0, k.TAU); ctx.stroke();
      }
    }
    ctx.restore();
  },
};

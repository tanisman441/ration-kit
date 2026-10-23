// vehicle-arrival/bus-arrive — şehir otobüsü, yandan: at anında soldan kayarak
// girer (yavaşlayarak), durunca fren tozu kalkar + süspansiyon esner.
// Boşta: hafif gövde salınımı, far ışığı nabzı. (0,0) = zemin, otobüs tabanı.
// Contract: engine/kit/ASSETS.md — canvas y-aşağı, saf draw.
export default {
  name: 'bus-arrive', category: 'vehicle-arrival',
  desc: 'Yandan şehir otobüsü; at anında soldan kayarak girip durur, fren tozu + esneme',
  tags: ['otobüs', 'varış', 'durak', 'şehir', 'ulaşım', 'fren', 'bus', 'arrival', 'city bus', 'transport', 'stop'],
  box: [-260, -140, 260, 30],
  bleed: 110,
  anchor: 'zemin (0,0); otobüs tabanı',
  points: { door: [95, -62], front: [170, -72], roof: [0, -122] },
  params: {
    at: { type: 'time', default: null, desc: 'varış anı (0.9 sn kayarak giriş + fren tozu)' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const body = k.rgba(p.color, 1), line = k.rgba('bg', 0.55), dark = k.rgba('ink', 0.85);
    const d = p.at == null ? -1 : t - p.at;
    const running = d >= -0.9 && d < 0;
    // giriş: soldan yavaşlayarak (ease-out), tekerlek dönüşü kat edilen yola bağlı
    let bx = 0, wheelA = 0;
    if (running) {
      const g = k.prog(d, -0.9, 0);
      const e = 1 - Math.pow(1 - g, 3);
      bx = -620 * (1 - e);
      wheelA = bx / 26;
    }
    // süspansiyon esnemesi: duruşta öne dalma + sönüm
    let dip = 0, dipRot = 0;
    if (d >= 0 && d < 0.9) {
      dip = -8 * Math.sin(d * 9) * Math.exp(-3.5 * d);
      dipRot = 0.012 * Math.sin(d * 9) * Math.exp(-3 * d);
    }
    const idleRock = k.noise1(t * 1.3) * 1.6;

    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.save();
    ctx.beginPath(); ctx.rect(-370, -250, 740, 310); ctx.clip(); // box+bleed

    // zemin şeridi (otobüsle birlikte kaymaz)
    ctx.fillStyle = k.rgba('bg', 0.25);
    ctx.beginPath(); k.rrect(-370, -8, 740, 22, 6); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 3;
    ctx.setLineDash([26, 20]);
    ctx.beginPath(); ctx.moveTo(-370, 2); ctx.lineTo(370, 2); ctx.stroke();
    ctx.setLineDash([]);

    ctx.save();
    ctx.translate(bx, dip + idleRock);
    ctx.rotate(dipRot);

    // gövde
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-170 - LW / 2, -122 - LW / 2, 340 + LW, 98 + LW, 22); ctx.fill();
    ctx.fillStyle = body; ctx.beginPath(); k.rrect(-170, -122, 340, 98, 22); ctx.fill();
    // sağ alt gölge + sol üst parlama
    ctx.save();
    ctx.beginPath(); k.rrect(-170, -122, 340, 98, 22); ctx.clip();
    ctx.fillStyle = k.rgba('bg', 0.12); ctx.fillRect(30, -122, 140, 98);
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-120, -104, 52, 16, -0.35, 0, k.TAU); ctx.fill();
    ctx.restore();
    // vurgu şeridi (tek vurgu: accent)
    ctx.fillStyle = k.rgba('accent', 0.95);
    ctx.beginPath(); k.rrect(-170, -52, 340, 16, 8); ctx.fill();
    // cam bandı
    ctx.fillStyle = k.rgba('ink', 0.72);
    ctx.beginPath(); k.rrect(-158, -112, 236, 44, 10); ctx.fill();
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = k.rgba('bg', 0.5);
      ctx.fillRect(-120 + i * 58, -112, 5, 44);
    }
    // cam parlaması (ince beyaz çizgi)
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-146, -72); ctx.lineTo(-60, -106); ctx.stroke();
    // ön cam (sağ, hafif eğik)
    ctx.fillStyle = k.rgba('ink', 0.72);
    ctx.beginPath();
    ctx.moveTo(96, -112); ctx.lineTo(158, -112); ctx.lineTo(158, -62); ctx.lineTo(96, -62);
    ctx.closePath(); ctx.fill();
    // kapı (ön, çift kanat çizgisi)
    ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(112, -62); ctx.lineTo(112, -24); ctx.stroke();
    ctx.fillStyle = k.rgba('ink', 0.35);
    ctx.beginPath(); k.rrect(98, -70, 30, 46, 6); ctx.fill();
    // far + sinyal
    const beam = 0.55 + 0.2 * Math.sin(t * 2.2);
    ctx.fillStyle = k.rgba('yellow', beam);
    ctx.beginPath(); ctx.arc(164, -44, 8, 0, k.TAU); ctx.fill();
    k.glow(164, -44, 26, 'yellow', 0.35 + 0.1 * Math.sin(t * 2.2));
    ctx.fillStyle = k.rgba('red', 0.9);
    ctx.beginPath(); ctx.arc(-164, -44, 7, 0, k.TAU); ctx.fill();
    // tavan tabelası
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(60 - LW / 2, -140 - LW / 2, 76 + LW, 22 + LW, 7); ctx.fill();
    ctx.fillStyle = k.rgba('panel', 1); ctx.beginPath(); k.rrect(60, -140, 76, 22, 7); ctx.fill();

    // tekerlekler (dönüş: yaklaşmada hızlı, durunca durur)
    for (const wx of [-105, 105]) {
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(wx, -26, 28 + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = dark; ctx.beginPath(); ctx.arc(wx, -26, 28, 0, k.TAU); ctx.fill();
      ctx.save();
      ctx.translate(wx, -26); ctx.rotate(wheelA);
      ctx.strokeStyle = k.rgba('panel2', 1); ctx.lineWidth = 7;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath(); ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(i * k.TAU / 3) * 19, Math.sin(i * k.TAU / 3) * 19); ctx.stroke();
      }
      ctx.restore();
      ctx.fillStyle = k.rgba('panel2', 1); ctx.beginPath(); ctx.arc(wx, -26, 7, 0, k.TAU); ctx.fill();
    }
    ctx.restore(); // otobüs

    // fren tozu: duruş anında tekerleklerden geriye (sola) savrulur
    if (d >= 0 && d < 0.8) {
      const g = k.prog(d, 0, 0.8), al = 1 - g;
      for (let i = 0; i < 10; i++) {
        const h1 = k.hash(i * 13 + 5), h2 = k.hash(i * 29 + 11);
        const wx = (i % 2 ? 105 : -105);
        const px = wx - 20 - h1 * 90 * g - g * 60;
        const py = -18 - h2 * 34 - g * 26;
        ctx.fillStyle = k.rgba('dim', 0.55 * al);
        ctx.beginPath(); ctx.arc(px, py, 8 + g * 16 + h1 * 6, 0, k.TAU); ctx.fill();
      }
    }

    ctx.restore();
  },
};

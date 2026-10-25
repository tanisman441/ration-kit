// detective-fx/clue-pin — ipucu notu mantar panoya `at` anında kırmızı iğneyle tutturulur. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) notun merkezidir.
export default {
  name: 'clue-pin', category: 'detective-fx',
  desc: 'Mantar panoda sallanan ipucu notu; `at` anında kırmızı iğne yukarıdan düşüp notu panoya tutturur',
  tags: ['ipucu', 'iğne', 'pano', 'not', 'dedektif', 'soruşturma', 'clue', 'pin', 'board', 'note', 'detective', 'investigation'],
  box: [-140, -110, 140, 110],
  bleed: 40,
  anchor: 'ipucu notunun merkezi (0,0); pano y ~-95..95',
  points: { pin: [0, -38], note: [0, 10], board: [0, -80] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'iğneleme anı — iğne düşer, not sabitlenir, halka nabzı (0.8 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // mantar pano
    blob(-130, -95, 260, 190, 12, k.rgba('panel2'));
    // pano dokusu: noktalar
    ctx.fillStyle = k.rgba('ink', 0.18);
    for (let i = 0; i < 24; i++) {
      const px = -115 + k.hash(i * 2 + 1) * 230, py = -82 + k.hash(i * 2 + 2) * 164;
      if (Math.abs(px) < 60 && py > -50 && py < 70) continue;
      ctx.beginPath(); ctx.arc(px, py, 2, 0, k.TAU); ctx.fill();
    }
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-100, -78, 28, 8, 0, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(70, 72, 54, 12, 6); ctx.fill();

    // iğne durumu: at'tan önce yukarıda süzülür, at..at+0.3 düşer (sekmeli), sonra saplı
    const pinned = d >= 0.3;
    let pinY, pinScale = 1;
    if (d < 0) {
      pinY = -105 + Math.sin(t * k.TAU / 1.6) * 6;
    } else if (d < 0.3) {
      const s = d / 0.3;
      pinY = k.lerp(-105, -38, 1 - Math.pow(1 - s, 3));
    } else {
      const bounce = Math.sin(Math.min((d - 0.3) / 0.4, 1) * Math.PI) * 5;
      pinY = -38 - bounce;
      pinScale = 1 + 0.15 * Math.sin(Math.min((d - 0.3) / 0.4, 1) * Math.PI);
    }

    // not: at'tan önce hafifçe sallanır, iğnelendikten sonra sabitlenir (hafif eğik)
    const sway = pinned ? 0.015 : 0.05 * Math.sin(t * k.TAU / 2.2);
    ctx.save();
    ctx.translate(0, 10);
    ctx.rotate(sway);
    // not kâğıdı
    blob(-52, -42, 104, 84, 8, k.rgba('panel'));
    // yazı çizgileri
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(-38, -24); ctx.lineTo(30, -24); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-38, -10); ctx.lineTo(38, -10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-38, 4); ctx.lineTo(18, 4); ctx.stroke();
    // altı çizili önemli satır (kırmızı vurgu)
    ctx.strokeStyle = k.rgba('red', 0.85); ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(-38, 20); ctx.lineTo(6, 20); ctx.stroke();
    // küçük soru işareti çizimi (el yazısı hissi)
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(28, 16, 6, -0.4, 3.6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(26, 25); ctx.lineTo(22, 30); ctx.stroke();
    ctx.beginPath(); ctx.arc(21, 33, 1.8, 0, k.TAU); ctx.fill();
    ctx.restore();

    // iğne: baş + sap
    ctx.save();
    ctx.translate(0, pinY);
    ctx.scale(pinScale, pinScale);
    // sap gölgesi
    ctx.strokeStyle = k.rgba('ink', 0.3); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0, 4); ctx.lineTo(0, 16); ctx.stroke();
    // kırmızı iğne başı
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(0, 0, 11, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('red', 0.95); ctx.beginPath(); ctx.arc(0, 0, 8.5, 0, k.TAU); ctx.fill();
    // parlama
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath(); ctx.arc(-3, -3, 2.5, 0, k.TAU); ctx.fill();
    ctx.restore();

    // iğneleme anında halka nabzı
    if (d >= 0.3 && d < 1.1) {
      const prog = (d - 0.3) / 0.8;
      ctx.strokeStyle = k.rgba('red', 0.7 * (1 - prog)); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, -38, 12 + prog * 26, 0, k.TAU); ctx.stroke();
      k.glow(0, -38, 18, 'red', 0.3 * (1 - prog));
    }
    // boştayken iğne başı hafifçe parlar
    if (d < 0) {
      const pulse = 0.5 + 0.5 * Math.sin(t * k.TAU / 1.5);
      k.glow(0, pinY, 14 + pulse * 4, 'red', 0.15 + 0.15 * pulse);
    }
  },
};

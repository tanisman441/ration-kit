// vehicle-arrival/cable-car-sway — teleferik, önden-yandan: kabin kabloda
// ileri-geri giderken sarkaç gibi salınır (canlı idle döngü). İki direk arası
// kablo, askı kolu ink rengi. (0,0) = kablo hattı ortası. Contract: engine/kit/ASSETS.md.
export default {
  name: 'cable-car-sway', category: 'vehicle-arrival',
  desc: 'Teleferik kabini; kablo üzerinde gidip gelirken sarkaç gibi salınır',
  tags: ['teleferik', 'kabin', 'kablo', 'dağ', 'ulaşım', 'salınım', 'cable car', 'gondola', 'sway', 'transport'],
  box: [-350, -180, 350, 60],
  bleed: 80,
  anchor: 'kablo hattı (0,-120)',
  points: { cable: [0, -120] },
  params: {
    speed: { type: 'number', default: 1, desc: 'ilerleme hızı çarpanı' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const cab = k.rgba(p.color, 1), line = k.rgba('bg', 0.55), dark = k.rgba('ink', 0.85);
    const CY = -120; // kablo yüksekliği
    // kabin konumu: kabloda gidip-gelme (yumuşak sinüzoid)
    const gx = 250 * Math.sin(t * 0.32 * p.speed);
    // sarkaç salınımı: hareketle faz kaymalı
    const sway = Math.sin(t * 2.1 * p.speed - 0.9) * 0.10 + Math.sin(t * 0.32 * p.speed) * 0.02;

    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.save();
    ctx.beginPath(); ctx.rect(-430, -260, 860, 400); ctx.clip(); // box+bleed

    // zemin çizgisi (uzak tepe silueti)
    ctx.fillStyle = k.rgba('bg', 0.2);
    ctx.beginPath();
    ctx.moveTo(-430, 60);
    ctx.quadraticCurveTo(-200, -30, 0, 10);
    ctx.quadraticCurveTo(200, 50, 430, -20);
    ctx.lineTo(430, 60); ctx.lineTo(-430, 60);
    ctx.closePath(); ctx.fill();

    // direkler (A kafa)
    for (const tx of [-300, 300]) {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(tx - 14 - LW / 2, CY - 14 - LW / 2, 28 + LW, 150 + LW, 8); ctx.fill();
      ctx.fillStyle = k.rgba('panel2', 1); ctx.beginPath(); k.rrect(tx - 14, CY - 14, 28, 150, 8); ctx.fill();
      // makara tekeri (kablo üstünden geçer)
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(tx, CY, 13 + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = dark; ctx.beginPath(); ctx.arc(tx, CY, 13, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('panel2', 1); ctx.beginPath(); ctx.arc(tx, CY, 5, 0, k.TAU); ctx.fill();
    }
    // kablo (havada ince ink çizgi, hafif sarkma)
    ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-430, CY - 6);
    ctx.quadraticCurveTo(0, CY + 16, 430, CY - 6);
    ctx.stroke();
    const cableY = (x) => CY - 6 + (16 * (1 - Math.pow(x / 430, 2))); // sarkma eğrisi

    // taşıyıcı + askı kolu (kablo üzerinde)
    const cy = cableY(gx);
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(gx - 16 - LW / 2, cy - 12 - LW / 2, 32 + LW, 22 + LW, 8); ctx.fill();
    ctx.fillStyle = dark; ctx.beginPath(); k.rrect(gx - 16, cy - 12, 32, 22, 8); ctx.fill();
    // tekerlekler kabloda
    for (const wx of [-9, 9]) {
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(gx + wx, cy - 8, 8 + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('panel2', 1); ctx.beginPath(); ctx.arc(gx + wx, cy - 8, 8, 0, k.TAU); ctx.fill();
    }
    // askı kolu (ink serbest çizgi)
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(gx, cy + 10); ctx.lineTo(gx, cy + 34); ctx.stroke();

    // kabin: askı noktasından sarkaç salınımı
    ctx.save();
    ctx.translate(gx, cy + 34);
    ctx.rotate(sway);
    // gövde
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-66 - LW / 2, 0 - LW / 2, 132 + LW, 96 + LW, 20); ctx.fill();
    ctx.fillStyle = cab; ctx.beginPath(); k.rrect(-66, 0, 132, 96, 20); ctx.fill();
    ctx.save();
    ctx.beginPath(); k.rrect(-66, 0, 132, 96, 20); ctx.clip();
    ctx.fillStyle = k.rgba('bg', 0.12); ctx.fillRect(-6, 0, 72, 96);
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-40, 18, 24, 11, -0.4, 0, k.TAU); ctx.fill();
    ctx.restore();
    // cam bandı (ön yüz)
    ctx.fillStyle = k.rgba('ink', 0.72);
    ctx.beginPath(); k.rrect(-56, 12, 112, 40, 10); ctx.fill();
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = k.rgba('bg', 0.5);
      ctx.fillRect(-24 + i * 36, 12, 5, 40);
    }
    // cam parlaması
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-46, 46); ctx.lineTo(-16, 20); ctx.stroke();
    // kapı çizgisi + basamak
    ctx.strokeStyle = k.rgba('ink', 0.45); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(20, 52); ctx.lineTo(20, 96); ctx.stroke();
    // vurgu şeridi (tek vurgu: accent) — çatı
    ctx.fillStyle = k.rgba('accent', 0.95);
    ctx.beginPath(); k.rrect(-66, 0, 132, 12, 8); ctx.fill();
    // alt tampon
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-56 - LW / 2, 92 - LW / 2, 112 + LW, 14 + LW, 7); ctx.fill();
    ctx.fillStyle = dark; ctx.beginPath(); k.rrect(-56, 92, 112, 14, 7); ctx.fill();
    ctx.restore(); // kabin

    ctx.restore();
  },
};

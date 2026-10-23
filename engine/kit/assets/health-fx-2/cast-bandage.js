// health-fx-2/cast-bandage — alçılı kol; `at` anında sargı 1 sn'de sarılır, rulo kayar.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'cast-bandage', category: 'health-fx-2',
  desc: 'Alçılı önkol; at anında 6 tur sargı şeridi belirir, sargı rulosu kayar',
  tags: ['alçı', 'bandaj', 'sargı', 'kırık', 'kol', 'cast', 'bandage', 'wrap', 'fracture', 'arm', 'medical'],
  box: [-100, -100, 100, 100],
  bleed: 20,
  anchor: 'bilek',
  points: { elbow: [-85, 0], wrist: [85, 0], cast: [35, 0] },
  params: {
    color: { type: 'color', default: 'accent' },
    at: { type: 'time', default: null, desc: 'sarma anı: 1 sn\'de 6 şerit belirir, rulo sağa kayar' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55);
    ctx.save();
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;
    const e = d < 0 ? 0 : k.E.inOutCubic(k.prog(d, 0, 1.0));

    // önkol + el + sağ alt gölge
    ctx.fillStyle = k.rgba('bg', 0.12);
    k.rrect(-88 + 6, -20 + 6, 150, 40, 20); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.strokeStyle = line; ctx.lineWidth = 6;
    k.rrect(-88, -20, 150, 40, 20); ctx.fill(); ctx.stroke();
    k.rrect(56, -15, 32, 30, 12); ctx.fill(); ctx.stroke();
    // premium: sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-58, -8, 26, 9, -0.3, 0, k.TAU); ctx.fill();

    // alçı
    ctx.fillStyle = k.rgba('bg', 0.12);
    k.rrect(-18 + 6, -32 + 6, 100, 64, 16); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.strokeStyle = line; ctx.lineWidth = 6;
    k.rrect(-18, -32, 100, 64, 16); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(8, -18, 24, 9, -0.4, 0, k.TAU); ctx.fill();

    // sargı şeritleri (sarım ilerledikçe belirir)
    for (let i = 0; i < 6; i++) {
      if (e < (i + 0.9) / 6) continue;
      const bx = -10 + i * 15;
      ctx.fillStyle = k.rgba('bg', 0.22);
      ctx.beginPath();
      ctx.moveTo(bx, -34); ctx.lineTo(bx + 9, -34);
      ctx.lineTo(bx + 9 + 12, 34); ctx.lineTo(bx + 12, 34);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = k.rgba('ink', 0.20); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(bx, -34); ctx.lineTo(bx + 12, 34); ctx.stroke();
    }

    // sargı rulosu (sarım boyunca kayar; beklerken hafif sallanır)
    const rx = -14 + e * 88;
    const bob = e === 0 ? Math.sin(t * 2) * 2 : 0;
    ctx.fillStyle = k.rgba(p.color);
    ctx.strokeStyle = line; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(rx, -52 + bob, 15, 0, k.TAU); ctx.fill(); ctx.stroke();
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.arc(rx, -52 + bob, 6, 0, k.TAU); ctx.fill();
    // gevşek sargı ucu: rulodan son şeride
    const tailX = -10 + Math.min(5, Math.floor(e * 6 - 0.4)) * 15 + 4;
    ctx.strokeStyle = k.rgba(p.color, 0.6); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(rx, -38 + bob);
    ctx.quadraticCurveTo((rx + tailX) / 2, -30 + k.noise1(t * 3) * 3, tailX, -34);
    ctx.stroke();

    ctx.restore();
  },
};

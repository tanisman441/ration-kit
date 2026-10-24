// pirate-fx/anchor-drop — Gemi çapası: at anında yukarıdan düşer, dibe vurunca su halkası yayılır;
// boşta hafifçe sallanır.
// NOT: canvas y-aşağıdır; (0,0) çapa kollarının dibe değdiği noktadır.
export default {
  name: 'anchor-drop', category: 'pirate-fx',
  desc: 'Gemi çapası: at anında yukarıdan düşer, dibe vuruşta su halkası ve toz yayılır; boşta hafif sallanır',
  tags: ['çapa', 'gemi', 'demir', 'düşme', 'korsan', 'deniz', 'anchor', 'drop', 'ship', 'pirate', 'sea', 'splash'],
  box: [-120, -230, 120, 110],
  bleed: 60,
  anchor: 'çapa tacı (dibe değen orta nokta)',
  points: { top: [0, -88], bottom: [0, 78] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'çapa demiri rengi' },
    at: { type: 'time', default: null, desc: 'düşüş anı: 0–0.2 sn düşer, 0.2–1.0 sn su halkası' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const LW = 6;
    const line = k.rgba('bg', 0.55);
    // düşüş: at öncesi asılı (-120), 0–0.2 sn'de dibe (0), sonra hafif zıplama
    let yOff, sway;
    if (d < 0) {
      yOff = -100;
      sway = 0.045 * Math.sin(t * 2.2);
    } else if (d < 0.2) {
      yOff = -100 * (1 - k.E.inCubic(k.prog(d, 0, 0.2)));
      sway = 0;
    } else {
      const bd = d - 0.2;
      yOff = -7 * Math.sin(bd * 22) * Math.exp(-bd * 5);
      sway = 0.015 * Math.sin(t * 1.6);
    }
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.translate(0, yOff);
    ctx.rotate(sway);

    // zincir baklaları (üstte)
    for (let i = 0; i < 3; i++) {
      const ly = -122 - i * 26;
      ctx.strokeStyle = line; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.ellipse(0, ly, 10, 13, 0, 0, k.TAU); ctx.stroke();
    }
    // mapa (halka)
    ctx.strokeStyle = line; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.arc(0, -88, 16, 0, k.TAU); ctx.stroke();
    ctx.strokeStyle = k.rgba(p.color); ctx.lineWidth = 7;
    ctx.beginPath(); ctx.arc(0, -88, 16, 0, k.TAU); ctx.stroke();

    // şaft
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-11 - LW / 2, -76 - LW / 2, 22 + LW, 124 + LW, 9); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-11, -76, 22, 124, 9); ctx.fill();
    // premium parlama: sol üst
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); k.rrect(-8, -70, 6, 110, 3); ctx.fill();

    // cunda (yatay kol)
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-70 - LW / 2, -66 - LW / 2, 140 + LW, 20 + LW, 10); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-70, -66, 140, 20, 10); ctx.fill();
    ctx.fillStyle = k.rgba('ink');
    for (const sx of [-64, 64]) {
      ctx.beginPath(); ctx.arc(sx, -56, 6, 0, k.TAU); ctx.fill();
    }

    // kollar: taçtan iki yana kıvrılan palamarlar
    for (const s of [-1, 1]) {
      ctx.strokeStyle = line; ctx.lineWidth = 24;
      ctx.beginPath();
      ctx.moveTo(0, 34);
      ctx.quadraticCurveTo(s * 34, 66, s * 60, 74);
      ctx.stroke();
      ctx.strokeStyle = k.rgba(p.color); ctx.lineWidth = 18;
      ctx.beginPath();
      ctx.moveTo(0, 34);
      ctx.quadraticCurveTo(s * 34, 66, s * 60, 74);
      ctx.stroke();
      // pala ucu (ok)
      ctx.save();
      ctx.translate(s * 60, 74); ctx.rotate(s * 0.9);
      ctx.fillStyle = line;
      ctx.beginPath();
      ctx.moveTo(-14, -10); ctx.lineTo(14, 0); ctx.lineTo(-14, 10); ctx.closePath();
      ctx.fill();
      ctx.fillStyle = k.rgba(p.color);
      ctx.beginPath();
      ctx.moveTo(-10, -6); ctx.lineTo(8, 0); ctx.lineTo(-10, 6); ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    // taç (orta düğüm)
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 40, 16, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); ctx.arc(0, 40, 12, 0, k.TAU); ctx.fill();
    ctx.restore();

    // dibe vuruş: su halkaları + toz (dünya koordinatında, çapa yer değiştirmişken)
    if (d >= 0.2 && d < 1.1) {
      const ip = k.prog(d, 0.2, 1.1);
      for (let r = 0; r < 3; r++) {
        const rp = k.clamp((ip - r * 0.18) / (1 - 0.36), 0, 1);
        if (rp <= 0) continue;
        ctx.strokeStyle = k.rgba('dim', 0.6 * (1 - rp));
        ctx.lineWidth = 6 * (1 - rp) + 1.5;
        ctx.beginPath();
        ctx.ellipse(0, 80, 30 + rp * 95, (30 + rp * 95) * 0.26, 0, 0, k.TAU);
        ctx.stroke();
      }
      // toz topakları
      for (let i = 0; i < 8; i++) {
        const h1 = k.hash(i * 11 + 5), h2 = k.hash(i * 23 + 71);
        const dd = d - 0.2 - h1 * 0.25;
        if (dd < 0) continue;
        const fade = 1 - k.prog(dd, 0, 0.7);
        if (fade <= 0) continue;
        const x = (h1 - 0.5) * 2 * (20 + dd * 90);
        const y = 78 - dd * 34 - h2 * 14;
        ctx.fillStyle = k.rgba('dim', 0.55 * fade);
        ctx.beginPath(); ctx.arc(x, y, 5 + dd * 9, 0, k.TAU); ctx.fill();
      }
    }
  },
};

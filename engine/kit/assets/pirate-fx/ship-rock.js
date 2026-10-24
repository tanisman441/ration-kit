// pirate-fx/ship-rock — Korsan yelkenlisi yan görünüm: dalgalar üzerinde sürekli salınır
// (rot + y, ~3.4 sn periyot); yelkenler hafifçe kabarır.
// NOT: canvas y-aşağıdır; (0,0) su hattıdır, gemi bunun üstünde durur.
export default {
  name: 'ship-rock', category: 'pirate-fx',
  desc: 'Korsan yelkenlisi: dalgalar üzerinde sürekli salınıyor (rot + y), yelkenler hafif kabarıyor, dalgalar akıyor',
  tags: ['gemi', 'korsan gemisi', 'yelkenli', 'dalga', 'yelken', 'deniz', 'salınım', 'ship', 'pirate', 'sail', 'wave', 'sea', 'galleon', 'rocking'],
  box: [-185, -205, 185, 70],
  bleed: 40,
  anchor: 'su hattı (0,0)',
  points: { mast: [20, -190], bow: [118, -58], keel: [0, 48] },
  params: {
    color: { type: 'color', default: 'panel2', desc: 'gövde rengi (ahşap)' },
    sail: { type: 'color', default: 'dim', desc: 'yelken kumaşı' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const line = k.rgba('bg', 0.55);
    const TAU = k.TAU;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // --- dalgalar (gemi sallanmaz, su akar) ---
    for (const [wy, wcol, wline, walpha] of [[8, 'dim', 6, 0.7], [26, 'panel2', 4, 0.5]]) {
      ctx.strokeStyle = k.rgba(wcol, walpha);
      ctx.lineWidth = wline;
      ctx.beginPath();
      for (let x = -185; x <= 185; x += 6) {
        const y = wy + Math.sin(x * 0.055 - t * 1.9 + (wy > 10 ? 2.1 : 0)) * 7;
        if (x === -185) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    // köpük noktaları
    for (let i = 0; i < 10; i++) {
      const h1 = k.hash(i * 17 + 901), h2 = k.hash(i * 29 + 917);
      const x = -175 + ((h1 * 350 + t * 22) % 350);
      const y = 10 + h2 * 20 + Math.sin(x * 0.055 - t * 1.9) * 7;
      ctx.fillStyle = k.rgba('panel2', 0.5 * (0.6 + 0.4 * Math.sin(t * 3 + h2 * 9)));
      ctx.beginPath(); ctx.arc(x, y, 3 + h1 * 3, 0, TAU); ctx.fill();
    }

    // --- gemi (salınım grubu) ---
    const ph = (t * TAU) / 3.4;
    ctx.save();
    ctx.translate(0, 7 * Math.sin(ph + 0.8));
    ctx.rotate(0.06 * Math.sin(ph));

    // yer gölgesi (su üstünde hafif)
    ctx.fillStyle = 'rgba(0,0,0,0.10)';
    ctx.beginPath(); ctx.ellipse(0, 40, 105, 9, 0, 0, TAU); ctx.fill();

    // gövde: güverte geniş, omurga dar
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(-118, -58); ctx.lineTo(118, -58); ctx.lineTo(88, 34); ctx.lineTo(60, 48);
    ctx.lineTo(-60, 48); ctx.lineTo(-88, 34); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath();
    ctx.moveTo(-118, -52); ctx.lineTo(118, -52); ctx.lineTo(88, 30); ctx.lineTo(60, 42);
    ctx.lineTo(-60, 42); ctx.lineTo(-88, 30); ctx.closePath(); ctx.fill();
    // tahta çizgileri
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    for (const py of [-30, -8, 14]) {
      ctx.beginPath(); ctx.moveTo(-112, py); ctx.lineTo(112, py); ctx.stroke();
    }
    // lumbuzlar (sarı ışıklı — tek vurgu)
    for (const lx of [-72, -36, 0, 36, 72]) {
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.arc(lx, -18, 9, 0, TAU); ctx.fill();
      ctx.fillStyle = k.rgba('yellow', 0.85 + 0.15 * Math.sin(t * 2.2 + lx));
      ctx.beginPath(); ctx.arc(lx, -18, 6, 0, TAU); ctx.fill();
    }
    // premium parlama: sol üst
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-80, -40, 26, 8, -0.15, 0, TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.moveTo(40, 30); ctx.lineTo(88, 30); ctx.lineTo(60, 42); ctx.lineTo(20, 42); ctx.closePath(); ctx.fill();

    // kıç kasteli
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-124 - LW / 2, -102 - LW / 2, 44 + LW, 48 + LW, 9); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-124, -102, 44, 48, 9); ctx.fill();
    ctx.fillStyle = k.rgba('yellow', 0.85);
    ctx.beginPath(); k.rrect(-114, -92, 24, 18, 5); ctx.fill();

    // pruva sırığı
    ctx.strokeStyle = line; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(112, -52); ctx.lineTo(172, -78); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink'); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(112, -52); ctx.lineTo(172, -78); ctx.stroke();

    // arma: halatlar (serbest çizgi → ink)
    ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(20, -188); ctx.lineTo(118, -58); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(20, -188); ctx.lineTo(-118, -70); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-62, -158); ctx.lineTo(118, -58); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-62, -158); ctx.lineTo(-118, -70); ctx.stroke();

    // direkler
    for (const [mx, mtop] of [[20, -190], [-62, -160]]) {
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(mx - 6 - LW / 2, mtop - LW / 2, 12 + LW, (-54 - mtop) + LW, 6); ctx.fill();
      ctx.fillStyle = k.rgba('ink');
      ctx.beginPath(); k.rrect(mx - 6, mtop, 12, -54 - mtop, 6); ctx.fill();
    }
    // flama (ana direk tepesi)
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath();
    ctx.moveTo(26, -190); ctx.lineTo(64, -184); ctx.lineTo(26, -176); ctx.closePath(); ctx.fill();

    // yelkenler: rüzgarda kabarık (kontrol noktası hafif salınır)
    const billow = 4 * Math.sin(t * 2.2);
    const sail = (x0, x1, yTop, depth, bulge) => {
      ctx.fillStyle = line;
      ctx.beginPath();
      ctx.moveTo(x0, yTop); ctx.lineTo(x1, yTop);
      ctx.quadraticCurveTo((x0 + x1) / 2, yTop + depth + bulge + 8, x0 + 6, yTop + depth);
      ctx.lineTo(x0, yTop); ctx.closePath(); ctx.fill();
      ctx.fillStyle = k.rgba(p.sail);
      ctx.beginPath();
      ctx.moveTo(x0 + 4, yTop + 4); ctx.lineTo(x1 - 4, yTop + 4);
      ctx.quadraticCurveTo((x0 + x1) / 2, yTop + depth + bulge, x0 + 10, yTop + depth - 4);
      ctx.lineTo(x0 + 4, yTop + 4); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 2.5;
      for (const f of [0.35, 0.65]) {
        const sx = x0 + (x1 - x0) * f;
        ctx.beginPath(); ctx.moveTo(sx, yTop + 6); ctx.quadraticCurveTo(sx, yTop + depth * 0.6 + bulge * 0.6, sx - 2, yTop + depth - 6); ctx.stroke();
      }
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath();
      ctx.moveTo(x0 + 8, yTop + 8); ctx.lineTo(x0 + 26, yTop + 8);
      ctx.quadraticCurveTo(x0 + 24, yTop + depth * 0.5, x0 + 12, yTop + depth - 10);
      ctx.closePath(); ctx.fill();
    };
    // serenler
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-34 - LW / 2, -176 - LW / 2, 108 + LW, 12 + LW, 6); ctx.fill();
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); k.rrect(-34, -176, 108, 12, 6); ctx.fill();
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-100 - LW / 2, -146 - LW / 2, 76 + LW, 11 + LW, 5); ctx.fill();
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); k.rrect(-100, -146, 76, 11, 5); ctx.fill();
    sail(-28, 68, -164, 92, 26 + billow);       // ana yelken
    sail(-94, -30, -135, 62, 18 + billow * 0.7); // ön yelken
    ctx.restore();
    ctx.restore();
  },
};

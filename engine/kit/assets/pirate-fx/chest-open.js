// pirate-fx/chest-open — Hazine sandığı: at anında kapak açılır, içinden altın ışık yükselir;
// boşta kilit hafifçe parlar.
// NOT: canvas y-aşağıdır; (0,0) taban merkezidir, kilit [0,30]'dadır.
export default {
  name: 'chest-open', category: 'pirate-fx',
  desc: 'Hazine sandığı: at anında kapak yana açılır, altın ışık ve parıltılar yükselir; kilit boşta parlar',
  tags: ['sandık', 'hazine', 'altın', 'korsan', 'ganimet', 'kilit', 'chest', 'treasure', 'gold', 'pirate', 'loot', 'lock'],
  box: [-140, -170, 140, 100],
  bleed: 60,
  anchor: 'taban merkezi',
  points: { lock: [0, 30], inside: [0, -30], lid: [-85, -50] },
  params: {
    color: { type: 'color', default: 'panel2', desc: 'sandık gövdesi (ahşap)' },
    at: { type: 'time', default: null, desc: 'kapak açılma anı: 0–0.5 sn açılır, altın ışık yükselir' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const LW = 6;
    const line = k.rgba('bg', 0.55);
    const open = d < 0 ? 0 : k.clamp(k.E.outBack(k.prog(d, 0, 0.5), 1.2), 0, 1);
    const ang = -100 * open * Math.PI / 180;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // yer gölgesi
    ctx.fillStyle = 'rgba(0,0,0,0.14)';
    ctx.beginPath(); ctx.ellipse(0, 74, 92, 10, 0, 0, k.TAU); ctx.fill();

    // gövde
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-85 - LW / 2, -20 - LW / 2, 170 + LW, 90 + LW, 10); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-85, -20, 170, 90, 10); ctx.fill();
    // tahta çizgileri
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    for (const py of [6, 30, 54]) {
      ctx.beginPath(); ctx.moveTo(-78, py); ctx.lineTo(78, py); ctx.stroke();
    }
    // metal kuşaklar
    for (const bx of [-56, 56]) {
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(bx - 11 - LW / 2, -20 - LW / 2, 22 + LW, 90 + LW, 6); ctx.fill();
      ctx.fillStyle = k.rgba('dim');
      ctx.beginPath(); k.rrect(bx - 11, -20, 22, 90, 6); ctx.fill();
      ctx.fillStyle = k.rgba('ink', 0.6);
      ctx.beginPath(); ctx.arc(bx, -2, 4, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(bx, 52, 4, 0, k.TAU); ctx.fill();
    }
    // premium parlama: sol üst
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); k.rrect(-77, -12, 15, 72, 7); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(44, 22, 34, 46, 9); ctx.fill();

    // iç karanlık (kapak açılınca görünür)
    ctx.fillStyle = 'rgba(0,0,0,0.62)';
    ctx.beginPath(); k.rrect(-72, -34, 144, 18, 8); ctx.fill();

    // altın yığını: kapak açılınca belirir
    if (open > 0.15) {
      const o = k.clamp((open - 0.15) / 0.85, 0, 1);
      ctx.fillStyle = k.rgba('yellow', 0.95 * o);
      ctx.beginPath(); ctx.ellipse(0, -30, 58, 16, 0, 0, k.TAU); ctx.fill();
      for (let i = 0; i < 12; i++) {
        const h1 = k.hash(i * 13 + 7), h2 = k.hash(i * 29 + 101);
        ctx.fillStyle = k.rgba('yellow', (0.7 + 0.3 * h2) * o);
        ctx.beginPath(); ctx.arc(-48 + h1 * 96, -36 - h2 * 10, 7 + h1 * 4, 0, k.TAU); ctx.fill();
      }
      // yükselen ışık sütunu
      const beam = o * (0.75 + 0.25 * Math.sin(t * 5));
      const g = ctx.createLinearGradient(0, -40, 0, -160);
      g.addColorStop(0, 'rgba(255,215,90,' + (0.55 * beam).toFixed(3) + ')');
      g.addColorStop(1, 'rgba(255,215,90,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); k.rrect(-46, -160, 92, 122, 30); ctx.fill();
      k.glow(0, -60, 70, 'yellow', 0.4 * beam);
      // yükselen parıltılar (döngülü)
      for (let i = 0; i < 10; i++) {
        const h1 = k.hash(i * 7 + 301), h2 = k.hash(i * 19 + 313);
        const yy = -44 - ((t * 46 + h1 * 150) % 130);
        const fade = 1 - (-44 - yy) / 130;
        ctx.fillStyle = k.rgba('yellow', 0.85 * fade * o);
        const sx = -40 + h2 * 80;
        ctx.beginPath();
        ctx.moveTo(sx, yy - 7); ctx.lineTo(sx + 2.6, yy); ctx.lineTo(sx, yy + 7); ctx.lineTo(sx - 2.6, yy);
        ctx.closePath(); ctx.fill();
      }
    }

    // kilit: altın plaka + anahtar deliği
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-17 - LW / 2, 12 - LW / 2, 34 + LW, 38 + LW, 7); ctx.fill();
    ctx.fillStyle = k.rgba('yellow');
    ctx.beginPath(); k.rrect(-17, 12, 34, 38, 7); ctx.fill();
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); ctx.arc(0, 27, 5.5, 0, k.TAU); ctx.fill();
    ctx.fillRect(-2.5, 27, 5, 13);
    // boşta kilit parlaması: 3.4 sn'de bir süpürme
    const cyc = t % 3.4;
    if (cyc < 0.28) {
      const sx = -17 + 34 * (cyc / 0.28);
      ctx.fillStyle = 'rgba(255,255,255,' + (0.55 * (1 - cyc / 0.28)).toFixed(3) + ')';
      ctx.beginPath();
      ctx.moveTo(sx - 8, 12); ctx.lineTo(sx - 2, 12); ctx.lineTo(sx - 8, 50); ctx.lineTo(sx - 14, 50);
      ctx.closePath(); ctx.fill();
    }

    // kapak: sol arka menteşeden döner (kapalı: yuvarlak üst)
    const hx = -78, hy = -22;
    ctx.save();
    ctx.translate(hx, hy); ctx.rotate(ang); ctx.translate(-hx, -hy);
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-85 - LW / 2, -80 - LW / 2, 170 + LW, 60 + LW, 22); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-85, -80, 170, 60, 22); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-78, -46); ctx.lineTo(78, -46); ctx.stroke();
    // kapak metal bandı
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-11, -80, 22, 60, 8); ctx.fill();
    // premium parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); k.rrect(-77, -72, 14, 44, 7); ctx.fill();
    ctx.restore();

    ctx.restore();
  },
};

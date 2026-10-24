// gym-fx/towel-throw — önden görünen figür havlusunu fırlatır; havlu dalgalanarak uçar. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; ayaklar (0,0), gövde negatif y yönünde yukarı uzar.
export default {
  name: 'towel-throw',
  category: 'gym-fx',
  desc: 'Havlusunu fırlatan insan figürü (önden); at anında havlu dalgalanarak sağa uçar',
  tags: ['havlu', 'fırlatma', 'havlu atma', 'towel', 'towel throw', 'spor salonu', 'gym', 'fitness', 'duş'],
  box: [-160, -330, 200, 16],
  bleed: 50,
  anchor: 'ayaklar (0,0); boy ~290 birim, havlu uçuşu sağa ~180 birim',
  points: { head: [0, -250], handR: [70, -190], towel: [140, -200], feet: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'happy' },
    at: { type: 'time', default: null, desc: 'fırlatma anı — 1.6 sn içinde kol savrulur, havlu dalgalanarak uçar; null ise havlu elde bekler' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55), acc = k.rgba('accent');
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const sstep = (a, b, x) => { const s = k.clamp((x - a) / (b - a), 0, 1); return s * s * (3 - 2 * s); };
    const br = Math.sin(t * k.TAU / 2.4) * 2;              // nefes
    const blink = (t % 4.2) < 0.12 ? 0.2 : 1;              // göz kırpma

    const d = p.at == null ? -1 : t - p.at;
    // Zamanlama check örneklemesine göre ayarlı: savrulma 0–0.2 sn, uçuş 0.2–1.6 sn
    // (check at+0.25 ve at+1.50 karelerinde uçuş net görünür), 1.6 sn sonrası elde bekler.
    const throwing = d >= 0 && d <= 1.6;
    let swing = 0;
    if (throwing) swing = sstep(0, 0.2, d) * (1 - sstep(1.4, 1.6, d));
    // havlu uçuşu: 0.2 snde elden çıkar, 1.6 snde sağ üstte süzülür
    const fl = throwing ? k.clamp((d - 0.2) / 1.4, 0, 1) : 0;
    const fly = fl * fl * (3 - 2 * fl);

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -6, 56, 10, 0, 0, k.TAU); ctx.fill();

    const hipY = -130, shoY = -206 - br * 0.5;
    for (const s of [-1, 1]) {
      limb(s * 13, hipY, s * 16, -16, 20, body);
      blob(s * 16 - 12, -13, 24, 13, 6, body);
    }

    // gövde
    blob(-31, -240 - br * 0.4, 62, 112, 28, body);
    ctx.fillStyle = k.rgba('bg', 0.12);                    // sağ alt gölge
    ctx.beginPath(); ctx.ellipse(17, -196, 12, 40, 0.1, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';              // sol üst parlama
    ctx.beginPath(); ctx.ellipse(-15, -214, 9, 24, 0.12, 0, k.TAU); ctx.fill();

    // sol kol yanda, sağ kol savrulur
    limb(-29, shoY, -44, -158, 18, body);
    disc(-44, -158, 10, 10, body);
    const rHandX = 44 + swing * 30, rHandY = -158 - swing * 62;
    limb(29, shoY, 44 + swing * 12, -180 - swing * 30, 18, body);
    limb(44 + swing * 12, -180 - swing * 30, rHandX, rHandY, 15, body);
    disc(rHandX, rHandY, 10, 10, body);

    // havlu: dalgalı kumaş (uçuşta döner + dalgalanır, eldeyken sarkar)
    const towel = (cx, cy, rot, flap) => {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(-38, -19, 76, 38, 10); ctx.fill();
      ctx.fillStyle = acc; ctx.beginPath();
      ctx.moveTo(-34, -15);
      for (let x = -34; x <= 34; x += 4) ctx.lineTo(x, -15 + Math.sin((x / 34) * Math.PI * 2 + flap) * 4);
      ctx.lineTo(34, 15);
      for (let x = 34; x >= -34; x -= 4) ctx.lineTo(x, 15 + Math.sin((x / 34) * Math.PI * 2 + flap + 1) * 4);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-18, -8, 10, 5, -0.3, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-20, -15); ctx.lineTo(-20, 15); ctx.stroke();
      ctx.restore();
    };
    if (throwing && fl > 0) {
      const tx = rHandX + fly * 130, ty = rHandY - fly * 30 - Math.sin(fly * Math.PI) * 26;
      // uçuş izi
      ctx.strokeStyle = k.rgba('ink', 0.2); ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(rHandX, rHandY);
      ctx.quadraticCurveTo(rHandX + 65, rHandY - 40, tx, ty);
      ctx.stroke();
      towel(tx, ty, -0.25 + fly * 0.4, t * 14);
    } else {
      // elde: sağ elden sarkan havlu
      towel(rHandX + 8, rHandY + 22, 0.15, t * 2);
    }

    // baş
    const hy = -250 - br * 0.6;
    disc(0, hy, 36, 34, body);
    const ey = hy - 2, ex = 10;
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    for (const s of [-1, 1]) {
      if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(s * ex, ey + 4, 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
      else { const r = p.mood === 'surprised' ? 5 : 4; ctx.beginPath(); ctx.ellipse(s * ex, ey, r, r * blink, 0, 0, k.TAU); ctx.fill(); }
    }
    if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(0, hy + 14, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
    else if (p.mood === 'sad') { ctx.beginPath(); ctx.arc(0, hy + 20, 10, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    else if (p.mood === 'surprised') { ctx.beginPath(); ctx.ellipse(0, hy + 12, 6, 8, 0, 0, k.TAU); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(-8, hy + 12); ctx.lineTo(8, hy + 12); ctx.stroke(); }
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-13, hy - 12, 13, 9, -0.4, 0, k.TAU); ctx.fill();
  },
};

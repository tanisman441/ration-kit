// character-emote/anger-vein — öfke damarı beliren insan figürü. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; ayaklar (0,0), gövde negatif y yönünde yukarı uzar.
export default {
  name: 'anger-vein',
  category: 'character-emote',
  desc: 'Öfkelenen insan figürü; alında belirip nabız gibi atan öfke damarı',
  tags: ['öfke', 'kızgın', 'sinir', 'kızgınlık', 'angry', 'anger', 'rage', 'furious', 'vein'],
  box: [-110, -310, 110, 14],
  bleed: 15,
  anchor: 'ayaklar (0,0); boy ~310 birim',
  points: { head: [0, -276], chest: [0, -184], feet: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'neutral' },
    at: { type: 'time', default: null, desc: 'öfke anı; damarı belirip nabız gibi atar' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
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

    const d = p.at == null ? -1 : t - p.at;
    // damar: 0–0.15 belirir, 1.2 sn nabız atışı, sonra söner
    const veinIn = d >= 0 ? sstep(0, 0.15, d) * (1 - sstep(1.0, 1.4, d)) : 0;
    const pulse = veinIn > 0 ? 1 + 0.22 * Math.sin(d * k.TAU / 0.45) * Math.sin(d * Math.PI / 1.2) : 1;

    // idle: sinirli titreme
    const tremor = k.noise1(t * 5.2) * 1.6;
    const tremorY = k.noise1(t * 4.1 + 9) * 1.2;
    const br = Math.sin(t * k.TAU / 2.4) * 2;
    const blink = (t % 4.2) < 0.12 ? 0.2 : 1;

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(tremor * 0.4, -6, 54, 10, 0, 0, k.TAU); ctx.fill();

    const hipY = -130 + tremorY * 0.4, shoY = -206 - br * 0.5;

    // bacaklar (güç duruşu)
    for (const s of [-1, 1]) {
      limb(tremor + s * 15, hipY, tremor + s * 19, -68, 20, body);
      limb(tremor + s * 19, -68, tremor + s * 22, -16, 17, body);
      blob(tremor + s * 22 - 12, -13, 24, 13, 6, body);
    }

    // gövde
    blob(tremor - 31, -240 - br * 0.4, 62, 112, 28, body);
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(tremor + 17, -152, 12, 42, 0.1, 0, k.TAU); ctx.fill();

    // kollar: yumruklar sıkılı, yanda
    for (const s of [-1, 1]) {
      const hx = tremor + s * 38, hy2 = -124;
      limb(tremor + s * 29, shoY, tremor + s * 36, (shoY + hy2) / 2, 18, body);
      limb(tremor + s * 36, (shoY + hy2) / 2, hx, hy2, 16, body);
      disc(hx, hy2, 12, 11, body);   // sıkılı yumruk
    }

    // baş
    const hy = -250 - br * 0.6 + tremorY;
    disc(tremor, hy, 36, 34, body);

    // öfke damarı (alında; red vurgu)
    if (veinIn > 0.01) {
      const vx = tremor + 17, vy = hy - 20;
      ctx.save();
      ctx.translate(vx, vy);
      ctx.scale(pulse * veinIn, pulse * veinIn);
      ctx.strokeStyle = k.rgba('red', 0.95); ctx.lineWidth = 5;
      // klasik öfke damarı: çapraz artı işareti
      ctx.beginPath(); ctx.moveTo(0, -13); ctx.quadraticCurveTo(2, 0, 0, 13); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-11, -5); ctx.quadraticCurveTo(0, -3, 11, -5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-8, 9); ctx.quadraticCurveTo(0, 11, 8, 9); ctx.stroke();
      ctx.restore();
    }

    // yüz: damar varken kızgın kaşlar + somurtma
    const angry = veinIn > 0.25;
    const ey = hy - 2, ex = 10;
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    for (const s of [-1, 1]) {
      if (p.mood === 'happy' && !angry) {
        ctx.beginPath(); ctx.arc(tremor + s * ex, ey + 4, 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      } else {
        const r = p.mood === 'surprised' && !angry ? 5 : 4;
        ctx.beginPath(); ctx.ellipse(tremor + s * ex, ey, r, r * blink, 0, 0, k.TAU); ctx.fill();
      }
    }
    if (angry) {
      // kızgın kaşlar (içe-aşağı)
      ctx.lineWidth = 4;
      for (const s of [-1, 1]) {
        ctx.beginPath(); ctx.moveTo(tremor + s * (ex - 9), ey - 12); ctx.lineTo(tremor + s * (ex + 7), ey - 6); ctx.stroke();
      }
      // somurtan ağız
      ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.moveTo(tremor - 9, hy + 16); ctx.lineTo(tremor + 9, hy + 16); ctx.stroke();
    } else if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(tremor, hy + 14, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
    else if (p.mood === 'sad') { ctx.beginPath(); ctx.arc(tremor, hy + 20, 10, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    else if (p.mood === 'surprised') { ctx.beginPath(); ctx.ellipse(tremor, hy + 12, 6, 8, 0, 0, k.TAU); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(tremor - 8, hy + 12); ctx.lineTo(tremor + 8, hy + 12); ctx.stroke(); }

    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(tremor - 13, hy - 12, 13, 9, -0.4, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(tremor - 15, -214, 9, 24, 0.12, 0, k.TAU); ctx.fill();
  },
};

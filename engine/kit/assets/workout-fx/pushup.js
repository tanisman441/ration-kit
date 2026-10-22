// workout-fx/pushup — şınav çeken insan figürü, yandan görünüm. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; yer (0,0), baş solda, ayaklar sağda.
export default {
  name: 'pushup',
  category: 'workout-fx',
  desc: 'Şınav çeken insan figürü (yandan); tekrarla gövde alçalıp yükselir, dirsekler bükülür',
  tags: ['şınav', 'şınav çekme', 'pushup', 'push-up', 'press-up', 'egzersiz', 'workout', 'fitness', 'kol gücü'],
  box: [-150, -155, 155, 16],
  bleed: 40,
  anchor: 'yer (0,0); baş solda (~-95), ayaklar sağda (~138)',
  points: { head: [-95, -72], chest: [-10, -90], hand: [-45, -12], foot: [138, -8] },
  params: {
    color: { type: 'color', default: 'dim' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'neutral' },
    rep: { type: 'time', default: null, desc: 'tekrarın başlangıcı — bir tam şınav döngüsü (1.2 sn); null ise dinlenme' },
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
    const br = Math.sin(t * k.TAU / 2.4) * 2;              // nefes
    const blink = (t % 4.2) < 0.12 ? 0.2 : 1;              // göz kırpma

    // tekrar fazı: alçal (0–0.5) → yüksel (0.5–1.05) → toparlan
    const d = p.rep == null ? -1 : t - p.rep;
    let bend = 0;                                          // 0: düz plank, 1: tam alçalma
    if (d >= 0 && d <= 1.2) bend = sstep(0, 0.5, d) - sstep(0.5, 1.05, d);
    else if (d > -0.25 && d < 0) bend = sstep(-0.25, 0, d) * 0.12;   // hafif hazırlık
    const drop = bend * 30;

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(4, -6, 96, 10, 0, 0, k.TAU); ctx.fill();

    // bacaklar (ayak sabit, diz alçalmayla bükülür)
    const hip = [64, -90 + drop], knee = [100, -58 + drop * 0.6], foot = [138, -10];
    limb(hip[0], hip[1], knee[0], knee[1], 20, body);
    limb(knee[0], knee[1], foot[0], foot[1] - 4, 17, body);
    blob(foot[0] - 12, foot[1] - 13, 26, 13, 6, body);

    // gövde (yatay plank)
    blob(-58, -114 + drop, 128, 48, 24, body);
    ctx.fillStyle = k.rgba('bg', 0.12);                    // sağ alt gölge bandı
    ctx.beginPath(); ctx.ellipse(24, -78 + drop, 34, 10, 0.06, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';              // sol üst parlama
    ctx.beginPath(); ctx.ellipse(-32, -104 + drop, 11, 17, 0.12, 0, k.TAU); ctx.fill();

    // kollar (el yerde sabit, dirsek alçalmayla dışa bükülür)
    const sho = [-45, -92 + drop], hand = [-45, -12];
    const elb = [sho[0] - 28 * bend, -52 + 4 * bend];
    limb(sho[0], sho[1], elb[0], elb[1], 18, body);
    limb(elb[0], elb[1], hand[0], hand[1], 15, body);
    disc(hand[0], hand[1], 10, 10, body);

    // baş (alçalırken baş biraz yukarıda kalır)
    const hy = -72 + drop - 12 * bend - br * 0.4;
    disc(-95, hy, 36, 34, body);
    const ey = hy - 2, ex = 10;
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    for (const s of [-1, 1]) {
      if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(-95 + s * ex, ey + 4, 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
      else { const r = p.mood === 'surprised' ? 5 : 4; ctx.beginPath(); ctx.ellipse(-95 + s * ex, ey, r, r * blink, 0, 0, k.TAU); ctx.fill(); }
    }
    if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(-95, hy + 14, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
    else if (p.mood === 'sad') { ctx.beginPath(); ctx.arc(-95, hy + 20, 10, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    else if (p.mood === 'surprised') { ctx.beginPath(); ctx.ellipse(-95, hy + 12, 6, 8, 0, 0, k.TAU); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(-103, hy + 12); ctx.lineTo(-87, hy + 12); ctx.stroke(); }
    ctx.fillStyle = 'rgba(255,255,255,0.10)';              // baş parlaması
    ctx.beginPath(); ctx.ellipse(-108, hy - 12, 13, 9, -0.4, 0, k.TAU); ctx.fill();

    // efor: ter damlaları + efor çizgileri (tepe anında)
    const eff = d > 0.35 && d < 1.0 ? Math.sin((d - 0.35) / 0.65 * Math.PI) : 0;
    if (eff > 0) {
      for (let i = 0; i < 3; i++) {
        const h1 = k.hash(i * 7 + 3), h2 = k.hash(i * 13 + 9);
        const px = -70 + h1 * 60, py = -120 - h2 * 40 + drop - (1 - eff) * 20;
        ctx.fillStyle = k.rgba('cyan', 0.75 * eff);
        ctx.beginPath(); ctx.ellipse(px, py, 4.5, 7, 0.2, 0, k.TAU); ctx.fill();
      }
      ctx.strokeStyle = k.rgba('ink', 0.35 * eff); ctx.lineWidth = 4;
      for (let i = 0; i < 3; i++) {
        const a = -0.9 + i * 0.5;
        ctx.beginPath();
        ctx.moveTo(-20 + Math.cos(a) * 46, -90 + drop + Math.sin(a) * 30);
        ctx.lineTo(-20 + Math.cos(a) * 62, -90 + drop + Math.sin(a) * 42);
        ctx.stroke();
      }
    }
  },
};

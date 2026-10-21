// mechanics-fx/valve-steam — boru hattı üzerindeki vana: open (zaman) anında
// çark çeyrek tur döner ve baca borusundan yoğun buhar fışkırır (0.3–1.7 sn).
// open verilmezse bacadan ince bir buhar incecik yükselir (canlı idle).
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) vana gövde merkezidir.
export default {
  name: 'valve-steam', category: 'mechanics-fx',
  desc: 'Buhar vanası; open anında çark döner ve bacadan buhar fışkırır',
  tags: ['vana', 'buhar', 'boru', 'basınç', 'makine', 'valve', 'steam', 'pipe', 'pressure', 'machine'],
  box: [-110, -124, 110, 120],
  bleed: 80,
  anchor: 'vana gövde merkezi (0,0)',
  points: { vent: [0, -112], wheel: [0, -48], pipe_left: [-104, 66], pipe_right: [104, 66] },
  params: {
    color: { type: 'color', default: 'ink' },
    open: { type: 'time', default: null, desc: 'vananın açılma anı; buhar fışkırır' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    const d = p.open == null ? -1 : t - p.open;
    const opening = d >= 0 && d < 0.5;                // çark dönüş penceresi
    const wheelA = opening ? (Math.PI / 2) * k.E.outCubic(k.clamp(d / 0.5, 0, 1)) : 0;

    // yatay ana boru
    blob(-104, 52, 208, 30, 12, k.rgba('panel2'));
    // flanşlar
    [-72, 72].forEach(x => blob(x - 9, 48, 18, 38, 6, body));

    // vana gövdesi (boru ortasında küre)
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 40, 34 + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.arc(0, 40, 34, 0, k.TAU); ctx.fill();
    // gölge (sağ alt)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.arc(5, 45, 30, 0.6, 2.2); ctx.fill();

    // baca borusu (yukarı)
    blob(-14, -112, 28, 110, 8, k.rgba('dim'));
    // baca ağzı
    blob(-22, -120, 44, 16, 7, body);

    // mil + vana çarkı
    ctx.lineWidth = 12; ctx.strokeStyle = line;
    ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(0, -40); ctx.stroke();
    ctx.save();
    ctx.translate(0, -48); ctx.rotate(wheelA);
    // çark: 3 kollu gemi dümeni
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 0, 30 + LW / 2, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = body; ctx.lineWidth = 22;
    ctx.beginPath(); ctx.arc(0, 0, 30, 0, k.TAU); ctx.stroke();
    ctx.strokeStyle = k.rgba('red'); ctx.lineWidth = 9;
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * k.TAU;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(34 * Math.cos(a), 34 * Math.sin(a)); ctx.stroke();
    }
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 0, 9 + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel');
    ctx.beginPath(); ctx.arc(0, 0, 9, 0, k.TAU); ctx.fill();
    ctx.restore();

    // --- buhar ---
    const puff = (x, y, r, alpha) => {
      ctx.fillStyle = k.rgba('dim', alpha);
      ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
    };
    if (d < 0) {
      // idle: ince buhar (3 sn döngü)
      const cyc = (t % 3) / 3;
      const wispY = -128 - cyc * 36;
      puff(k.noise1(t * 2) * 10, wispY, 6 + cyc * 10, 0.28 * (1 - cyc));
    } else if (d > 0.1 && d < 2.2) {
      // büyük buhar fışkırması (open'dan hemen sonra başlar, ~2 sn sürer)
      for (let i = 0; i < 11; i++) {
        const h = k.hash(i * 13 + 1);
        const life = 0.9 + h * 0.9;
        const lt = (d - 0.1 - h * 0.15) / life;      // parçacık yaşı (0-1)
        if (lt <= 0 || lt >= 1) continue;
        const e = k.E.outCubic(Math.min(lt * 1.6, 1));
        const x = (h - 0.5) * 44 + k.noise1(i * 5 + t * 4) * 24 * e;
        const y = -124 - e * (16 + h * 30);
        puff(x, y, 12 + e * 18, 0.55 * (1 - lt));
      }
    }

    // premium parlama (sol üst, vana gövdesi)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-20, 22, 18, 10, -0.5, 0, k.TAU); ctx.fill();
  },
};

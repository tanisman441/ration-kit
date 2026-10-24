// gym-fx/bench-press — yandan görünen bench press: sehpadaki figür halteri göğüsten yukarı iter. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; zemin (0,0), figür sehpa üstünde yatar, sağa bakar.
export default {
  name: 'bench-press',
  category: 'gym-fx',
  desc: 'Sehpada yatarak halter iten insan figürü (yandan); rep anında halter göğüsten yukarı kalkar',
  tags: ['bench press', 'göğüs', 'halter', 'bench', 'sehpa', 'ağırlık', 'spor salonu', 'gym', 'fitness'],
  box: [-170, -330, 170, 16],
  bleed: 40,
  anchor: 'zemin (0,0); sehpa üstü y=-95, halter göğüs üstünde dikey hareket eder',
  points: { head: [-95, -130], barbell: [0, -260], hand: [0, -260], feet: [115, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'neutral' },
    rep: { type: 'time', default: null, desc: 'tekrarın başlangıcı — halter 1.2 sn içinde göğüsten yukarı itilip geri indirilir; null ise halter kollar gergin bekler' },
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
    const br = Math.sin(t * k.TAU / 2.4) * 2;              // nefes (göğüs kalkar)
    const blink = (t % 4.2) < 0.12 ? 0.2 : 1;              // göz kırpma

    const d = p.rep == null ? -1 : t - p.rep;
    let press = 1;                                        // 1: kollar gergin (halter yukarıda), 0: göğüste
    if (d >= 0 && d <= 1.2) press = 1 - sstep(0, 0.5, d) + sstep(0.65, 1.15, d);
    if (d > 1.2) press = 1;

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -6, 90, 10, 0, 0, k.TAU); ctx.fill();

    // sehpa + ayaklık direği
    blob(-140, -110, 260, 15, 7, k.rgba('panel2'));
    blob(-120, -95, 14, 95, 6, k.rgba('panel2'));
    blob(90, -95, 14, 95, 6, k.rgba('panel2'));
    blob(-70, -300, 12, 190, 6, k.rgba('panel2'));          // halter askı direği

    // bacaklar: diz bükülü, ayaklar zeminde
    const hipX = 55, hipY = -122 - br * 0.3;
    limb(hipX, hipY, 105, -150, 20, body);
    limb(105, -150, 118, -14, 17, body);
    limb(hipX - 8, hipY, 97, -150, 18, k.rgba('panel2'));
    limb(97, -150, 108, -14, 15, k.rgba('panel2'));
    blob(118 - 12, -13, 26, 13, 6, body);
    blob(108 - 12, -13, 26, 13, 6, k.rgba('panel2'));

    // gövde: sehpa üstünde yatay
    blob(-75, -152 - br * 0.4, 132, 34, 16, body);
    ctx.fillStyle = k.rgba('bg', 0.12);                    // sağ alt gölge
    ctx.beginPath(); ctx.ellipse(20, -128, 40, 10, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';              // sol üst parlama
    ctx.beginPath(); ctx.ellipse(-50, -144, 22, 8, 0, 0, k.TAU); ctx.fill();

    // halter: göğüs üstünde dikey hareket (yandan plaka diski görünür)
    const barY = -168 - br * 0.4 - press * 96;
    const shoX = -10, shoY = -136 - br * 0.4;
    limb(shoX, shoY, -2, barY + 40, 18, body);             // kol (omuz → el)
    limb(-2, barY + 40, 0, barY, 15, body);
    disc(0, barY, 10, 10, body);
    ctx.save();
    ctx.translate(0, barY);
    disc(0, 0, 32, 32, acc);                               // plaka (yandan disk)
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.ellipse(0, 0, 12, 12, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-11, -11, 9, 7, -0.4, 0, k.TAU); ctx.fill();
    ctx.restore();
    // barın yatay uzantısı (derinlik hissi)
    ctx.strokeStyle = line; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(0, barY); ctx.lineTo(52, barY - 12); ctx.stroke();
    ctx.strokeStyle = k.rgba('panel2'); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(0, barY); ctx.lineTo(52, barY - 12); ctx.stroke();

    // baş (sehpada, sola dönük profil)
    const hy = -132 - br * 0.3;
    disc(-98, hy, 34, 32, body);
    const ey = hy - 2;
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(-102, ey + 4, 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    else { const r = p.mood === 'surprised' ? 5 : 4; ctx.beginPath(); ctx.ellipse(-102, ey, r, r * blink, 0, 0, k.TAU); ctx.fill(); }
    if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(-104, hy + 14, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
    else if (p.mood === 'sad') { ctx.beginPath(); ctx.arc(-104, hy + 20, 10, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    else if (p.mood === 'surprised') { ctx.beginPath(); ctx.ellipse(-104, hy + 12, 6, 8, 0, 0, k.TAU); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(-112, hy + 12); ctx.lineTo(-96, hy + 12); ctx.stroke(); }
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-111, hy - 12, 13, 9, -0.4, 0, k.TAU); ctx.fill();

    // efor: itiş anında hız çizgileri
    const eff = d > 0.6 && d < 1.15 ? Math.sin((d - 0.6) / 0.55 * Math.PI) : 0;
    if (eff > 0) {
      ctx.strokeStyle = k.rgba('ink', 0.3 * eff); ctx.lineWidth = 4;
      for (const dx of [-52, -40]) {
        ctx.beginPath(); ctx.moveTo(dx, barY - 44); ctx.lineTo(dx, barY - 24); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-dx, barY - 44); ctx.lineTo(-dx, barY - 24); ctx.stroke();
      }
    }
  },
};

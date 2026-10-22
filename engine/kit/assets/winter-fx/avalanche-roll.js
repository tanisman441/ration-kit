// winter-fx/avalanche-roll — yokuş aşağı yuvarlanıp büyüyen çığ topu; at anında 1.1 sn yuvarlanma + kar bulutu.
// NOT: canvas y-aşağıdır; top soldan sağa, aşağı doğru yuvarlanır; (0,0) sahne merkezidir.
export default {
  name: 'avalanche-roll', category: 'winter-fx',
  desc: 'Yokuş aşağı yuvarlanıp büyüyen kar topu; at anında 1.1 sn yuvarlanma, arkasında kar bulutu ve bitişte patlama halkası',
  tags: ['çığ', 'kar topu', 'yuvarlanma', 'kış', 'kar', 'avalanche', 'snowball', 'roll', 'snow', 'winter', 'downhill'],
  box: [-185, -135, 185, 135],
  bleed: 60,
  anchor: 'sahne merkezi (0,0); yokuş sol üstten sağ alta iner',
  points: { centre: [0, 0], start: [-130, -62], finish: [98, 57] },
  params: {
    at: { type: 'time', default: null, desc: 'yuvarlanma başlangıcı (1.1 sn: top büyür, kar bulutu arkasında sürüklenir)' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const LW = 9;
    const snow = k.rgba(p.color), line = k.rgba('bg', 0.55), inkC = k.rgba('ink');
    const d = p.at == null ? -1 : t - p.at;
    const DUR = 1.1;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // --- yokuş geometrisi: temas çizgisi S0→S1, n = yukarı normal ---
    const S0x = -145, S0y = -70, S1x = 145, S1y = 80;
    const dx = S1x - S0x, dy = S1y - S0y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / len, uy = dy / len;        // yokuş yönü
    const nx = uy, ny = -ux;                    // yukarı normal (y-aşağıda negatif y = yukarı)
    const R0 = 20, R1 = 46, E0 = 0.05, E1 = 0.82;
    const rad = e => R0 + (R1 - R0) * e;
    const pos = e => {
      const ee = E0 + (E1 - E0) * e;
      const kx = S0x + dx * ee, ky = S0y + dy * ee, r = rad(e);
      return [kx + nx * r, ky + ny * r, r];
    };

    const disc = (x, y, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(x, y, r + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
    };

    // --- yokuş kar bandı ---
    const slope = (ox, oy, w, c, a) => {
      ctx.strokeStyle = c; ctx.lineWidth = w; ctx.globalAlpha = a;
      ctx.beginPath();
      ctx.moveTo(S0x + ux * -18 + ox, S0y + uy * -18 + oy);
      ctx.lineTo(S0x + ux * (len + 18) + ox, S0y + uy * (len + 18) + oy);
      ctx.stroke(); ctx.globalAlpha = 1;
    };
    slope(0, 0, 30, snow, 0.55);                       // kar bandı
    slope(nx * 13, ny * 13, 6, 'rgba(255,255,255,0.12)', 1); // üst kenar kar parlaması

    // --- top çizimi (dönüşle birlikte yüzeydeki çentikler döner) ---
    const ball = (x, y, r, rot, squash) => {
      ctx.save(); ctx.translate(x, y); ctx.scale(1, squash);
      disc(0, 0, r, snow);
      // yüzey çentikleri (dönüşle taşınır)
      ctx.strokeStyle = k.rgba('ink', 0.30); ctx.lineWidth = 3;
      for (let i = 0; i < 5; i++) {
        const h = k.hash(i * 7 + 2), a = rot + h * k.TAU;
        const rr = r * (0.55 + 0.25 * k.hash(i * 13 + 5));
        ctx.beginPath();
        ctx.arc(Math.cos(a) * rr * 0.6, Math.sin(a) * rr * 0.6, r * 0.16, a, a + 2.2);
        ctx.stroke();
      }
      // premium parlama (sol üst, alfa 0.10)
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-r * 0.38, -r * 0.42, r * 0.30, r * 0.18, -0.5, 0, k.TAU); ctx.fill();
      // sağ alt gölge
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.beginPath(); ctx.ellipse(r * 0.34, r * 0.40, r * 0.32, r * 0.20, -0.5, 0, k.TAU); ctx.fill();
      ctx.restore();
    };

    // --- kar spreyi: yuvarlanma boyunca topun arkasından kopan taneler ---
    const spray = (e, strength) => {
      for (let i = 0; i < 14; i++) {
        const h1 = k.hash(i * 31 + 11), h2 = k.hash(i * 57 + 23);
        const behind = (i / 14) * 0.55 + h1 * 0.08;   // topun ne kadar gerisinden koptu
        const se = e - behind;
        if (se < 0 || se > 0.85 || strength <= 0) continue;
        const pr = se / 0.85;
        const [sx, sy, sr] = pos(k.clamp(se, 0, 1));
        const ox = -ux * (26 + 46 * h1) * (0.4 + 0.6 * strength) + nx * (-sr * 0.9 - 14 * h2);
        const oy = -uy * (26 + 46 * h1) * (0.4 + 0.6 * strength) + ny * (-sr * 0.9 - 14 * h2) * 0.4;
        const x = sx + ox + (h1 - 0.5) * 30 * pr;
        const y = sy + oy - 46 * pr * pr;              // yukarı savrulup sönümlenir
        ctx.fillStyle = k.rgba('ink', 0.75 * (1 - pr) * strength);
        ctx.beginPath(); ctx.arc(x, y, (2.5 + 4.5 * h2) * (1 - pr * 0.5), 0, k.TAU); ctx.fill();
      }
    };

    if (d < 0) {
      // bekleme: yokuş başında küçük top, hafif sallanır
      const [x, y, r] = pos(0);
      const wob = Math.sin(t * k.TAU / 1.6) * 0.09;
      ctx.save(); ctx.translate(x, y); ctx.rotate(wob);
      ball(0, 0, r, t * 0.4, 1);
      ctx.restore();
    } else if (d < DUR) {
      // yuvarlanma: ivmelenen ilerleme + büyüme
      const e = Math.pow(k.clamp(d / DUR, 0, 1), 1.6);
      const [x, y, r] = pos(e);
      const squash = 1 - 0.05 * Math.sin(e * 12);       // yuvarlanma zıplaması
      ball(x, y, r, e * 8, squash);
      spray(e, 0.4 + 0.6 * e);
      // hız çizgileri (topun gerisinde)
      ctx.strokeStyle = inkC; ctx.globalAlpha = 0.30 * e;
      ctx.lineWidth = 3.5;
      for (let i = 0; i < 3; i++) {
        const yy = (i - 1) * 26;
        ctx.beginPath();
        ctx.moveTo(x - ux * (r + 90) - uy * yy, y - uy * (r + 90) + ux * yy);
        ctx.lineTo(x - ux * (r + 30) - uy * yy, y - uy * (r + 30) + ux * yy);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    } else {
      // bitiş: büyük top yerleşir, tek seferlik çökme + nefes
      const [x, y, r] = pos(1);
      const sd = d - DUR;
      const settle = sd < 0.45 ? 1 - 0.16 * Math.sin(k.clamp(sd / 0.45, 0, 1) * Math.PI) : 1;
      const breathe = 1 + Math.sin(t * k.TAU / 2.4) * 0.008;
      ball(x, y, r, 8.2, settle * breathe);
      if (sd < 0.6) {
        // bitiş patlama halkası
        const pr = k.clamp(sd / 0.6, 0, 1);
        ctx.strokeStyle = k.rgba('cyan', 0.55 * (1 - pr));
        ctx.lineWidth = 5 * (1 - pr) + 1;
        ctx.beginPath(); ctx.arc(x, y, r + 8 + pr * 46, 0, k.TAU); ctx.stroke();
        // son kar tozu
        for (let i = 0; i < 8; i++) {
          const h = k.hash(i * 41 + 7), a = h * k.TAU;
          ctx.fillStyle = k.rgba('ink', 0.5 * (1 - pr));
          ctx.beginPath();
          ctx.arc(x + Math.cos(a) * (r + 10 + pr * 55), y + Math.sin(a) * (r + 10 + pr * 55) - 20 * pr, 3 + 3 * h, 0, k.TAU);
          ctx.fill();
        }
      }
    }

    ctx.restore();
  },
};

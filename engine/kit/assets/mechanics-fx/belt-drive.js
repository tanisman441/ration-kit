// mechanics-fx/belt-drive — iki kasnak arasında akan kayış: büyük kasnak yavaş,
// küçük kasnak hızlı döner; kayış üzerindeki kesik çizgi hareketi gösterir.
// speed (0-1) sistem hızını belirler; 0 iken bile kayış ağır ağır akar (canlı idle).
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) iki kasnağın ortasıdır.
export default {
  name: 'belt-drive', category: 'mechanics-fx',
  desc: 'İki kasnak arasında akan kayış; speed kasnak dönüş hızını ayarlar',
  tags: ['kayış', 'kasnak', 'makaralı sistem', 'mekanik', 'belt', 'pulley', 'drive', 'machine', 'mechanism'],
  box: [-140, -85, 140, 85],
  bleed: 12,
  anchor: 'iki kasnağın ortası (0,0)',
  points: { left_axle: [-75, 0], right_axle: [75, 0], belt_top: [0, -48] },
  params: {
    color: { type: 'color', default: 'ink' },
    speed: { type: 'number', default: 0.5, desc: 'sistem hızı (0-1); 0 = en yavaş idle' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const C1 = [-75, 0], R1 = 48;      // büyük kasnak (sol)
    const C2 = [75, 0], R2 = 30;       // küçük kasnak (sağ)
    const D = C2[0] - C1[0];
    const phi = Math.asin((R1 - R2) / D);   // teğet eğim açısı
    const spd = k.clamp(p.speed, 0, 1);
    const a1 = -t * (0.5 + 2.4 * spd);      // büyük kasnak açısı
    const a2 = a1 * (R1 / R2);              // küçük kasnak (kayış hızı aynı)

    // --- kayış (dış teğet yolu) ---
    const tTop = [-Math.PI / 2 + phi], tBot = [Math.PI / 2 + phi];
    const P = (cx, cy, r, th) => [cx + r * Math.cos(th), cy + r * Math.sin(th)];
    ctx.save();
    ctx.beginPath();
    const [x1t, y1t] = P(C1[0], C1[1], R1, tTop[0]), [x2t, y2t] = P(C2[0], C2[1], R2, tTop[0]);
    const [x1b, y1b] = P(C1[0], C1[1], R1, tBot[0]), [x2b, y2b] = P(C2[0], C2[1], R2, tBot[0]);
    ctx.moveTo(x1t, y1t);
    ctx.lineTo(x2t, y2t);
    ctx.arc(C2[0], C2[1], R2, tTop[0], tBot[0], false);
    ctx.lineTo(x1b, y1b);
    ctx.arc(C1[0], C1[1], R1, tBot[0], tTop[0], true);
    ctx.closePath();
    ctx.lineWidth = 16; ctx.strokeStyle = line; ctx.stroke();
    ctx.lineWidth = 11; ctx.strokeStyle = k.rgba('dim'); ctx.stroke();
    // akış hissi: kayış üzerinde hareket eden kesik çizgi
    ctx.setLineDash([16, 12]);
    ctx.lineDashOffset = -((t * (18 + 70 * spd)) % 28);
    ctx.lineWidth = 3; ctx.strokeStyle = k.rgba('ink', 0.6); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // --- kasnaklar ---
    const pulley = (cx, cy, r, ang, spokes) => {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang);
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.arc(0, 0, r + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, k.TAU); ctx.fill();
      // jant iç oyuğu
      ctx.fillStyle = k.rgba('panel2');
      ctx.beginPath(); ctx.arc(0, 0, r - 14, 0, k.TAU); ctx.fill();
      // kollar
      ctx.lineWidth = 9; ctx.strokeStyle = k.rgba('dim');
      for (let i = 0; i < spokes; i++) {
        const a = (i / spokes) * k.TAU;
        ctx.beginPath();
        ctx.moveTo(12 * Math.cos(a), 12 * Math.sin(a));
        ctx.lineTo((r - 16) * Math.cos(a), (r - 16) * Math.sin(a));
        ctx.stroke();
      }
      ctx.restore();
      // mil (dönmez)
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.arc(cx, cy, 10 + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('yellow');
      ctx.beginPath(); ctx.arc(cx, cy, 10, 0, k.TAU); ctx.fill();
    };
    pulley(C1[0], C1[1], R1, a1, 5);
    pulley(C2[0], C2[1], R2, a2, 4);

    // --- yatak kaideleri (sabit) ---
    const mount = (cx) => {
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(cx - 22, 52, 44, 20, 6); ctx.fill();
      ctx.fillStyle = k.rgba('panel2');
      ctx.beginPath(); k.rrect(cx - 22 + LW / 2, 52 + LW / 2, 44 - LW, 20 - LW, 4); ctx.fill();
      ctx.lineWidth = 10; ctx.strokeStyle = line;
      ctx.beginPath(); ctx.moveTo(cx, 10); ctx.lineTo(cx, 56); ctx.stroke();
      ctx.lineWidth = 6; ctx.strokeStyle = k.rgba('dim');
      ctx.beginPath(); ctx.moveTo(cx, 10); ctx.lineTo(cx, 56); ctx.stroke();
    };
    mount(C1[0]); mount(C2[0]);

    // premium parlama (sol üst, büyük kasnak)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(C1[0] - 22, C1[1] - 28, 20, 11, -0.5, 0, k.TAU); ctx.fill();
  },
};

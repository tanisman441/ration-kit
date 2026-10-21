// travel-fx/luggage-roll — tekerlekli bavul: roll hızıyla tekerlekler döner, gövde sallanır, hız çizgileri akar.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) bavul gövdesinin ortasıdır.
export default {
  name: 'luggage-roll', category: 'travel-fx',
  desc: 'Teleskop saplı tekerlekli bavul; roll hızlandıkça tekerlekler döner, gövde sallanır, hız çizgileri belirir',
  tags: ['bavul', 'valiz', 'tekerlek', 'seyahat', 'yolculuk', 'havaalanı', 'luggage', 'suitcase', 'wheel', 'travel', 'trolley', 'airport'],
  box: [-155, -100, 155, 90],
  bleed: 15,
  anchor: 'bavul gövdesinin ortası (0,0)',
  points: { handle: [40, -98], wheel_front: [48, 64], wheel_back: [-48, 64] },
  params: {
    color: { type: 'color', default: 'ink' },
    roll: { type: 'number', default: 0.5, desc: 'yuvarlanma hızı (0-1); tekerlek dönüşü + sallanma + hız çizgisi' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55), inkLine = k.rgba('ink', 0.75);
    const shade = (c, f) => { const [r, g, b] = k.col(c); return `rgba(${r * f | 0},${g * f | 0},${b * f | 0},1)`; };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const spd = k.clamp(p.roll, 0, 1);
    const ang = -t * (1.2 + 7 * spd);                        // tekerlek açısı (sürekli dönüş)
    const rock = Math.sin(t * (1.4 + 3.5 * spd)) * (1.2 + 3.2 * spd); // gövde sallanması

    // --- hız çizgileri (arkada, serbest çizgi = ink) ---
    ctx.save();
    const nLines = 1 + Math.floor(spd * 3);
    for (let i = 0; i < 4; i++) {
      const y = -38 + i * 26, on = i < nLines;
      const a = on ? 0.35 + 0.4 * spd : 0.12;
      ctx.strokeStyle = k.rgba('ink', a);
      ctx.lineWidth = 4;
      ctx.setLineDash([18, 14]);
      ctx.lineDashOffset = -((t * (30 + 120 * spd)) % 32);
      ctx.beginPath(); ctx.moveTo(-155, y); ctx.lineTo(-95, y); ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.restore();

    ctx.save(); ctx.rotate(rock * 0.012);

    // --- teleskop sap (serbest çizgiler: ink, alfa 0.7) ---
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(22, -52); ctx.lineTo(22, -92); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(58, -52); ctx.lineTo(58, -92); ctx.stroke();
    // tutamak
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(12, -104, 56, 18, 8); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(12 + LW / 2, -104 + LW / 2, 56 - LW, 18 - LW, 5); ctx.fill();

    // --- gövde ---
    ctx.fillStyle = shade('dim', 0.88);                       // gölge (sağ alt)
    ctx.beginPath(); k.rrect(-74 + 6, -54 + 6, 148, 108, 18); ctx.fill();
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-74, -54, 148, 108, 18); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); k.rrect(-74 + LW / 2, -54 + LW / 2, 148 - LW, 108 - LW, 14); ctx.fill();
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-44, -32, 26, 12, -0.45, 0, k.TAU); ctx.fill();
    // kayışlar (dikey bantlar)
    ctx.fillStyle = k.rgba('panel2');
    ctx.fillRect(-38, -54 + LW / 2, 16, 108 - LW);
    ctx.fillRect(22, -54 + LW / 2, 16, 108 - LW);
    ctx.lineWidth = 3; ctx.strokeStyle = inkLine;
    ctx.beginPath(); ctx.moveTo(-30, -48); ctx.lineTo(-30, 48); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(30, -48); ctx.lineTo(30, 48); ctx.stroke();
    // köşe koruyucular
    for (const [cx, cy] of [[-74, -54], [74, -54], [-74, 54], [74, 54]]) {
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.arc(cx, cy, 11, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('yellow');
      ctx.beginPath(); ctx.arc(cx, cy, 11 - LW / 2, 0, k.TAU); ctx.fill();
    }

    // --- tekerlekler (döner kollu) ---
    const wheel = (wx) => {
      ctx.save(); ctx.translate(wx, 64);
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.arc(0, 0, 20, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('dim');
      ctx.beginPath(); ctx.arc(0, 0, 20 - LW / 2, 0, k.TAU); ctx.fill();
      // dönen kollar
      ctx.save(); ctx.rotate(ang);
      ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 5;
      for (let i = 0; i < 3; i++) {
        const a = i * k.TAU / 3;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(12 * Math.cos(a), 12 * Math.sin(a)); ctx.stroke();
      }
      ctx.restore();
      ctx.fillStyle = k.rgba('yellow');
      ctx.beginPath(); ctx.arc(0, 0, 5, 0, k.TAU); ctx.fill();
      ctx.restore();
    };
    wheel(-48); wheel(48);
    ctx.restore();
  },
};

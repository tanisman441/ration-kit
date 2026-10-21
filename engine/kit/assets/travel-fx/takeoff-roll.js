// travel-fx/takeoff-roll — yandan uçak: roll 0→1 ilerledikçe hızlanır, burun kalkar, tekerlekler yerden kesilir.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) gövdenin ortasıdır (pist y=58 çizgisindedir).
export default {
  name: 'takeoff-roll', category: 'travel-fx',
  desc: 'Pistteki uçak roll ilerledikçe hız çizgileri uzar, titrer, burun kalkar ve tekerlekler yerden kesilir',
  tags: ['uçak', 'kalkış', 'pist', 'havalanma', 'uçuş', 'havaalanı', 'airplane', 'takeoff', 'runway', 'flight', 'departure', 'airport'],
  box: [-175, -85, 175, 85],
  bleed: 20,
  anchor: 'gövdenin ortası (0,0); pist y=58 çizgisi',
  points: { nose: [115, 0], tail_fin: [-100, -38], wheels: [30, 50] },
  params: {
    color: { type: 'color', default: 'ink' },
    roll: { type: 'number', default: 0.5, desc: 'kalkış ilerlemesi (0 = pistte duruyor, 1 = havada tırmanıyor)' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55), inkLine = k.rgba('ink', 0.75);
    const shade = (c, f) => { const [r, g, b] = k.col(c); return `rgba(${r * f | 0},${g * f | 0},${b * f | 0},1)`; };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const r = k.clamp(p.roll, 0, 1);
    const climb = k.E.outCubic(k.clamp((r - 0.55) / 0.45, 0, 1));   // 0.55 sonrası havalanma
    const pitch = -0.24 * climb;                                    // burun yukarı (y-aşağı: negatif = yukarı)
    const planeY = -62 * climb;
    const vib = k.noise1(t * 26) * 2.2 * r;                         // hız titremesi
    const bob = Math.sin(t * 1.6) * 1.4 * (1 - r * 0.5);

    // --- pist ---
    ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-175, 58); ctx.lineTo(175, 58); ctx.stroke();
    ctx.setLineDash([22, 18]);
    ctx.lineWidth = 3; ctx.strokeStyle = k.rgba('ink', 0.35);
    ctx.beginPath(); ctx.moveTo(-175, 70); ctx.lineTo(175, 70); ctx.stroke();
    ctx.setLineDash([]);

    // --- hız çizgileri (uçağın arkasında, serbest çizgi = ink) ---
    const nS = Math.floor(r * 6);
    for (let i = 0; i < 6; i++) {
      if (i >= nS) break;
      const y = -28 + i * 13 + k.hash(i * 11) * 6;
      const len = 16 + 34 * r * (0.6 + 0.4 * k.hash(i * 5));
      const x0 = -112 - i * 6;
      ctx.strokeStyle = k.rgba('ink', 0.25 + 0.45 * r);
      ctx.lineWidth = 4;
      ctx.setLineDash([len * 0.55, 26]);
      ctx.lineDashOffset = -((t * (60 + 260 * r)) % (len * 0.55 + 26));
      ctx.beginPath(); ctx.moveTo(x0, y + planeY * 0.4); ctx.lineTo(x0 - len, y + planeY * 0.4); ctx.stroke();
    }
    ctx.setLineDash([]);

    // --- uçak ---
    ctx.save(); ctx.translate(0, planeY + vib + bob); ctx.rotate(pitch);

    // kuyruk kanadı
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(-108, -8); ctx.lineTo(-86, -44); ctx.lineTo(-70, -44); ctx.lineTo(-84, -8);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.moveTo(-104, -10); ctx.lineTo(-85, -40); ctx.lineTo(-73, -40); ctx.lineTo(-84, -10);
    ctx.closePath(); ctx.fill();

    // gövde
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-112, -16, 218, 34, 17); ctx.fill();
    // burun (sağa sivrileşen)
    ctx.beginPath();
    ctx.moveTo(80, -16); ctx.lineTo(118, 0); ctx.lineTo(80, 18);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); k.rrect(-112 + LW / 2, -16 + LW / 2, 218 - LW, 34 - LW, 13); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(82, -13); ctx.lineTo(112, 0); ctx.lineTo(82, 15);
    ctx.closePath(); ctx.fill();
    // premium parlama (sol üst, gövde)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-60, -8, 40, 8, -0.2, 0, k.TAU); ctx.fill();
    // kokpit + pencereler
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); ctx.ellipse(88, -4, 12, 6, -0.15, 0, k.TAU); ctx.fill();
    ctx.fillStyle = inkLine;
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(-40 + i * 20, 2, 4, 0, k.TAU); ctx.fill(); }

    // kanat (üstte, geriye açılı; kökü gövdeye gömülü)
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(-20, -4); ctx.lineTo(38, -52); ctx.lineTo(52, -52); ctx.lineTo(16, -4);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = shade('dim', 0.9);
    ctx.beginPath();
    ctx.moveTo(-16, -5); ctx.lineTo(38, -48); ctx.lineTo(48, -48); ctx.lineTo(14, -5);
    ctx.closePath(); ctx.fill();
    // motor (kanat altında, gövdeye oturur)
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(18, -32, 40, 18, 8); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(18 + LW / 2, -32 + LW / 2, 40 - LW, 18 - LW, 5); ctx.fill();
    // motor parlaması (hızlanınca)
    if (r > 0.15) k.glow(22, -23, 16 + 14 * r, 'yellow', 0.35 * r);

    // --- tekerlekler (havalanınca toplanır) ---
    const gear = 1 - k.E.inCubic(climb);                            // 1 = açık, 0 = toplanmış
    if (gear > 0.02) {
      ctx.save(); ctx.scale(1, gear);
      const wheel = (wx) => {
        ctx.strokeStyle = line; ctx.lineWidth = 10;
        ctx.beginPath(); ctx.moveTo(wx, 16); ctx.lineTo(wx, 38); ctx.stroke();
        ctx.strokeStyle = k.rgba('dim'); ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(wx, 16); ctx.lineTo(wx, 38); ctx.stroke();
        ctx.fillStyle = line;
        ctx.beginPath(); ctx.arc(wx, 48, 12, 0, k.TAU); ctx.fill();
        ctx.fillStyle = k.rgba('dim');
        ctx.beginPath(); ctx.arc(wx, 48, 12 - LW / 2, 0, k.TAU); ctx.fill();
      };
      wheel(-40); wheel(45);
      ctx.restore();
    }
    ctx.restore();
  },
};

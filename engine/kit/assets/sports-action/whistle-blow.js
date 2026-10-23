// sports-action/whistle-blow — düdük çalan hakem başı. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) baş merkezidir, düdük ağzın sağındadır.
export default {
  name: 'whistle-blow',
  category: 'sports-action',
  desc: 'Düdük çalan hakem başı; time-param at anında yanaklar şişer, ses dalgaları yayılır',
  tags: ['düdük', 'hakem', 'referee', 'whistle', 'whistle blow', 'üfleme', 'ses', 'maç', 'sound', 'blow', 'ref'],
  box: [-150, -150, 150, 150],
  bleed: 45,
  anchor: 'baş merkezi (0,0); düdük ağzın sağında',
  points: { mouth: [40, 22] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'düdük çalma anı: yanak şişmesi + ses dalgaları' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const easeOut = x => 1 - Math.pow(1 - x, 3);

    const oblob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const odisc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };

    const d = p.at == null ? -1 : t - p.at;
    // üfleme: 0–0.9 sn yoğun, sonra sönümlenir
    const blow = d < 0 ? 0 : (d < 0.9 ? easeOut(k.clamp(d / 0.15, 0, 1)) : Math.max(0, 1 - (d - 0.9) / 0.4));
    const idleBob = 2 * Math.sin((k.TAU * t) / 2.4);

    // --- hakem forması yakası (altta) ---
    oblob(-44, 52, 88, 40, 10, k.rgba('panel2'));
    ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 3;  // forma çizgileri
    ctx.beginPath(); ctx.moveTo(-14, 56); ctx.lineTo(-14, 88); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(14, 56); ctx.lineTo(14, 88); ctx.stroke();

    // --- baş ---
    const hbx = 0, hby = -8 + idleBob * 0.5;
    odisc(hbx, hby, 44, 42, body);
    // sağ alt gölge (%12)
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(hbx + 18, hby + 16, 14, 20, 0.25, 0, k.TAU); ctx.fill();
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(hbx - 16, hby - 15, 16, 11, -0.4, 0, k.TAU); ctx.fill();

    // gözler (üflemede kısılır)
    const eyeH = 1 - 0.65 * blow;
    const blink = (t % 4.2) < 0.12 ? 0.2 : 1;
    ctx.fillStyle = inkC;
    for (const s of [-1, 1]) {
      ctx.beginPath(); ctx.ellipse(s * 15 + hbx, hby - 8, 4.5, 4.5 * eyeH * blink, 0, 0, k.TAU); ctx.fill();
    }
    // kaşlar (üflemede çatık)
    ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    for (const s of [-1, 1]) {
      const tilt = blow * 0.35;
      ctx.beginPath(); ctx.moveTo(s * 15 + hbx - 9, hby - 24 + s * tilt * 6); ctx.lineTo(s * 15 + hbx + 9, hby - 22 - s * tilt * 6); ctx.stroke();
    }

    // --- yanaklar (üflemede şişer) ---
    const puff = 7 * blow;
    odisc(hbx - 24, hby + 18, 10 + puff, 9 + puff * 0.8, body);
    odisc(hbx + 18, hby + 18, 10 + puff, 9 + puff * 0.8, body);

    // --- düdük ---
    const vib = blow * 1.6 * Math.sin(d * 55);   // düdük titremesi
    const wx = 40, wy = hby + 22 + vib;
    // düdük ipi (serbest çizgi → ink, alfa 0.65)
    ctx.strokeStyle = k.rgba('ink', 0.65); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(wx + 8, wy + 8); ctx.quadraticCurveTo(wx + 34, wy + 44, wx + 22, wy + 78); ctx.stroke();
    // ağızlık (ağıza giren kısım)
    ctx.strokeStyle = line; ctx.lineWidth = 10 + LW;
    ctx.beginPath(); ctx.moveTo(hbx + 24, hby + 20); ctx.lineTo(wx - 4, wy); ctx.stroke();
    ctx.strokeStyle = k.rgba('panel'); ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(hbx + 24, hby + 20); ctx.lineTo(wx - 4, wy); ctx.stroke();
    // düdük gövdesi
    oblob(wx - 6, wy - 11, 30, 22, 8, k.rgba('accent'));
    // düdük deliği
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.ellipse(wx + 9, wy - 2, 4, 3, 0, 0, k.TAU); ctx.fill();

    // ağız (üflemede O, normalde kısa çizgi)
    if (blow > 0.3) {
      ctx.beginPath(); ctx.ellipse(hbx + 26, hby + 20, 5, 7, 0, 0, k.TAU); ctx.fill();
    } else {
      ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.moveTo(hbx + 18, hby + 22); ctx.lineTo(hbx + 34, hby + 22); ctx.stroke();
    }

    // --- ses dalgaları ---
    if (d >= 0 && d < 1.3) {
      for (let i = 0; i < 3; i++) {
        const ph = ((d * 1.6 - i * 0.33) % 1 + 1) % 1;
        const r = 34 + ph * 58;
        const a = 0.65 * (1 - ph) * blow;
        if (a <= 0.01) continue;
        ctx.strokeStyle = k.rgba('accent', a); ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(wx + 16, wy, r, -0.7, 0.7); ctx.stroke();
      }
      // ses çizgileri (kısa titreşimler)
      ctx.strokeStyle = k.rgba('ink', 0.5 * blow); ctx.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        const sy = wy - 26 + i * 26 + k.noise1(t * 12 + i * 9) * 4;
        ctx.beginPath(); ctx.moveTo(wx + 58, sy); ctx.lineTo(wx + 76 + k.hash(i + 2) * 14, sy); ctx.stroke();
      }
    }
  },
};

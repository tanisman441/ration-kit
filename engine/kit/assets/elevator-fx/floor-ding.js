// elevator-fx/floor-ding — kat göstergesi ve zili; `at` anında zil çalar, ışık yanıp söner.
// ANIMASYON: `at` anında zil 0.9 sn salınır (sallanma), halka genişleyip söner, gösterge
// ışığı 0.4 sn parlar; zil sesi çizgileri dışa yayılır. Idle'da gösterge ışığı yumuşak nabız.
// Tek vurgu: zil ışığı (yellow). Contract: engine/kit/ASSETS.md
export default {
  name: 'floor-ding',
  category: 'elevator-fx',
  desc: 'Kat göstergesi ve zili; at anında zil sallanır, halka yayılır, ışık parlar',
  tags: ['asansör', 'kat', 'zil', 'gösterge', 'ding', 'bina', 'elevator', 'floor indicator', 'bell', 'ding', 'building'],
  box: [-110, -130, 110, 130],
  bleed: 40,
  anchor: 'gösterge merkezi (0,0)',
  points: { bell: [0, -58], light: [0, 82], centre: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'zilin çalma anı (salınım 0.9 sn, halka 0.8 sn)' },
    floor: { type: 'number', default: 3, desc: 'gösterilen kat numarası (0-9)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.at == null ? -1 : t - p.at;
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const ringing = d >= 0 && d < 1.2;
    // zil salınımı: sönümlü sinüs
    const swing = ringing ? Math.sin(d * 22) * (1 - d / 1.2) * 0.28 : 0;
    // genişleyen halka: 0→1, 0.8 sn
    const ring = d < 0 ? 0 : k.prog(d, 0, 0.8);
    // ışık parlaması
    const flash = d < 0 ? 0 : Math.max(0, 1 - d / 0.5);
    const idle = 0.35 + 0.12 * Math.sin(t * 2.0);

    const plate = (x, y, w, h, r, c) => {
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); k.rrect(x + 6, y + 6, w, h, r); ctx.fill();
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c;
      ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // --- gövde paneli ---
    plate(-92, -110, 184, 220, 18, k.rgba('dim'));
    // parlama (sol üst)
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(-62, -88, 22, 12, -0.3, 0, k.TAU); ctx.fill();

    // --- zil (üstte, salınır) ---
    ctx.save();
    ctx.translate(0, -58);
    ctx.rotate(swing);
    // zil askısı
    ctx.strokeStyle = k.rgba('ink', 0.55); ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, -26); ctx.lineTo(0, -14); ctx.stroke();
    // zil kubbesi
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 2, 26, Math.PI, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.arc(0, 2, 21, Math.PI, 0); ctx.closePath(); ctx.fill();
    // zil tokmağı
    ctx.fillStyle = k.rgba('ink', 0.7);
    ctx.beginPath(); ctx.arc(0, 16, 6, 0, k.TAU); ctx.fill();
    ctx.restore();

    // --- ses halkaları (zil çalarken dışa yayılır) ---
    if (ringing) {
      for (let i = 0; i < 2; i++) {
        const rr = k.prog(d - i * 0.25, 0, 0.8);
        if (rr > 0 && rr < 1) {
          ctx.strokeStyle = k.rgba('yellow', 0.7 * (1 - rr));
          ctx.lineWidth = 4;
          ctx.beginPath(); ctx.arc(0, -58, 34 + rr * 44, -0.9, 0.9); ctx.stroke();
          ctx.beginPath(); ctx.arc(0, -58, 34 + rr * 44, Math.PI - 0.9, Math.PI + 0.9); ctx.stroke();
        }
      }
    }
    // genişleyen tek halka (gösterge çevresi)
    if (ring > 0 && ring < 1) {
      ctx.strokeStyle = k.rgba('yellow', 0.6 * (1 - ring));
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(0, 38, 30 + ring * 34, 0, k.TAU); ctx.stroke();
    }

    // --- kat numarası ekranı ---
    plate(-52, -8, 104, 62, 10, k.rgba('ink'));
    const n = Math.round(k.clamp(p.floor ?? 3, 0, 9));
    ctx.fillStyle = k.rgba('yellow', ringing || flash > 0 ? 0.95 : 0.75);
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String(n), 0, 25);

    // --- alt gösterge ışığı ---
    if (flash > 0 || ringing) k.glow(0, 82, 16, 'yellow', 0.5 * Math.max(flash, 0.4));
    ctx.fillStyle = k.rgba('yellow', ringing ? 0.9 : Math.max(flash, idle));
    ctx.beginPath(); ctx.arc(0, 82, 9, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 82, 12, 0, k.TAU); ctx.stroke();
    ctx.restore();
  },
};

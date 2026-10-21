// mechanics-fx/spring-bounce — üstten sabit brakete asılı helezon yay + alt ağırlık.
// pull (zaman): çekme anı; 0.3 sn çekilir sonra sönümlü salınım başlar.
// pull verilmezse yay hafifçe sallanır (canlı idle).
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) braket ile ağırlık arası yay merkezidir.
export default {
  name: 'spring-bounce', category: 'mechanics-fx',
  desc: 'Üst brakete asılı helezon yay; pull anında çekilip sönümlü salınır',
  tags: ['yay', 'helezon', 'salınım', 'sönümlü', 'esneklik', 'spring', 'coil', 'bounce', 'oscillation', 'mechanism'],
  box: [-90, -110, 90, 110],
  bleed: 36,
  anchor: 'yay merkezi (0,0)',
  points: { top_mount: [0, -104], weight: [0, 90] },
  params: {
    color: { type: 'color', default: 'ink' },
    pull: { type: 'time', default: null, desc: 'çekme anı; ardından sönümlü salınım' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // uzama miktarı (idle: hafif sallanma; pull: çekme + sönümlü salınım)
    const d = p.pull == null ? -1 : t - p.pull;
    let ext;
    if (d < 0) {
      ext = 6 * Math.sin(k.TAU * t / 2.4);              // idle sallanma
    } else if (d < 0.3) {
      ext = 56 * k.E.outCubic(d / 0.3);                  // çekme anı
    } else {
      const dd = d - 0.3;
      ext = 56 * Math.cos(k.TAU * 3 * dd) * Math.exp(-2.4 * dd);  // sönümlü salınım
    }

    const yTop = -96, rest = 150;
    const yBot = yTop + rest + ext;                      // yayın alt ucu (y-aşağı)
    const turns = 7, amp = 34;

    // üst braket (sabit)
    blob(-44, -110, 88, 22, 8, k.rgba('panel2'));
    [-30, 30].forEach(x => {
      ctx.fillStyle = k.rgba('dim');
      ctx.beginPath(); ctx.arc(x, -99, 5, 0, k.TAU); ctx.fill();
    });

    // helezon yay (zigzag)
    const coil = () => {
      ctx.beginPath();
      ctx.moveTo(0, yTop);
      const step = (yBot - yTop) / turns;
      for (let i = 0; i < turns; i++) {
        const y0 = yTop + i * step, y1 = y0 + step / 2, y2 = y0 + step;
        const x = i % 2 === 0 ? amp : -amp;
        ctx.lineTo(x, y1);
        ctx.lineTo(0, y2);
      }
    };
    ctx.lineWidth = 11; ctx.strokeStyle = line;
    coil(); ctx.stroke();
    ctx.lineWidth = 7; ctx.strokeStyle = body;
    coil(); ctx.stroke();
    // yay parlaması (sol üst sargı)
    ctx.lineWidth = 2.5; ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath();
    ctx.moveTo(-amp + 6, yTop + (yBot - yTop) / turns * 0.7);
    ctx.lineTo(-amp + 18, yTop + (yBot - yTop) / turns * 1.1);
    ctx.stroke();

    // alt ağırlık plakası
    blob(-40, yBot + 2, 80, 26, 9, k.rgba('dim'));
    // ağırlık gölgesi (sağ alt)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(-36, yBot + 7, 76, 24, 9); ctx.fill();
    // plaka çizgisi
    ctx.lineWidth = 3; ctx.strokeStyle = k.rgba('ink', 0.4);
    ctx.beginPath(); ctx.moveTo(-28, yBot + 15); ctx.lineTo(28, yBot + 15); ctx.stroke();

    // çekme anında hız çizgileri (efekt)
    if (d >= 0 && d < 0.6) {
      const q = 1 - d / 0.6;
      ctx.lineWidth = 3; ctx.strokeStyle = k.rgba('ink', 0.5 * q);
      [-52, 52].forEach(x => {
        ctx.beginPath(); ctx.moveTo(x, yBot - 34 * q); ctx.lineTo(x, yBot - 8 * q); ctx.stroke();
      });
    }
  },
};

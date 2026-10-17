// ui/style-sheet — stil rehberi referans tahtası: oran, renk paleti, çizgi,
// yüz ifadeleri ve ışık yönü tek panoda. Contract: engine/kit/ASSETS.md
export default {
  name: 'style-sheet',
  category: 'ui',
  desc: 'Stil rehberi referans tahtası: oran, renk paleti, çizgi kalınlığı, yüzler, ışık yönü',
  tags: ['stil', 'rehber', 'referans', 'tahta', 'palet', 'renk', 'style', 'guide', 'reference', 'palette', 'board'],
  box: [-460, -320, 460, 320],
  bleed: 0,
  anchor: 'pano merkezi (0,0)',
  points: {},
  params: {},
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55), inkC = k.rgba('ink'), dimC = k.rgba('dim');
    const panelC = k.rgba('panel');
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const label = (s, x, y, size = 20, c = null, align = 'left') => {
      ctx.fillStyle = c || inkC;
      ctx.font = `700 ${size}px 'JetBrains Mono', monospace`;
      ctx.textAlign = align; ctx.textBaseline = 'alphabetic';
      ctx.fillText(s, x, y);
    };
    const section = (title, x, y) => {
      label(title, x, y, 24, k.rgba('accent'));
      ctx.strokeStyle = k.rgba('bg', 0.35); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x, y + 10); ctx.lineTo(x + 190, y + 10); ctx.stroke();
    };

    // pano
    blob(-450, -310, 900, 620, 24, panelC);

    // başlık
    label('RATION KIT · STİL REHBERİ', -420, -256, 36);
    label('referans tahtası', -420, -224, 20, dimC);
    ctx.strokeStyle = k.rgba('bg', 0.35); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-420, -204); ctx.lineTo(420, -204); ctx.stroke();

    // ── ORAN (sol sütun üst)
    section('ORAN', -420, -158);
    // mini figür: baş r28 (yükseklik 56), gövde 146 = 56 × 2.6
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(-330, -88, 28 + LW / 2, 28 + LW / 2, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); ctx.ellipse(-330, -88, 28, 28, 0, 0, k.TAU); ctx.fill();
    blob(-358, -60, 56, 146, 20, k.rgba('dim'));
    // ölçüm çubuğu
    ctx.strokeStyle = dimC; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-288, -116); ctx.lineTo(-288, 86); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-294, -116); ctx.lineTo(-282, -116); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-294, -60); ctx.lineTo(-282, -60); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-294, 86); ctx.lineTo(-282, 86); ctx.stroke();
    label('1', -272, -80, 18, dimC);
    label('2.6', -272, 30, 18, dimC);
    label('baş : gövde', -420, 128, 20);
    label('= 1 : 2.6', -420, 154, 20, dimC);

    // ── ÇİZGİ (sol sütun alt)
    section('ÇİZGİ', -420, 196);
    const lwRows = [[3, 'iç ayrım'], [5, 'dış hat'], [9, 'kalın']];
    lwRows.forEach(([w, name], i) => {
      const y = 232 + i * 30;
      ctx.strokeStyle = line; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(-420, y); ctx.lineTo(-260, y); ctx.stroke();
      label(`${w} · ${name}`, -244, y + 7, 18, dimC);
    });

    // ── RENK (orta sütun)
    section('RENK', -140, -158);
    const nightCols = ['ink', 'dim', 'bg', 'panel', 'panel2'];
    const swName = (x, y, name) => label(name, x + 26, y, 15, dimC, 'center');
    nightCols.forEach((cn, i) => {
      const x = -140 + i * 64;
      blob(x, -136, 52, 40, 10, k.rgba(cn));
      swName(x, -136 + 40 + 22, cn);
    });
    label('gece', 192, -104, 18, dimC);
    // gündüz (paper) — sabit değerler (film.js THEMES.paper)
    const PAPER = { ink: 'rgb(22,22,26)', dim: 'rgb(112,106,98)', bg: 'rgb(241,236,226)', panel: 'rgb(255,252,245)', panel2: 'rgb(225,218,204)' };
    nightCols.forEach((cn, i) => {
      const x = -140 + i * 64;
      blob(x, -52, 52, 40, 10, PAPER[cn]);
      swName(x, -52 + 40 + 22, cn);
    });
    label('gündüz', 192, -20, 18, dimC);
    label('VURGU (çizim başına 1)', -140, 56, 20);
    ['red', 'cyan', 'yellow', 'green', 'purple'].forEach((cn, i) => {
      const x = -140 + i * 64;
      blob(x, 72, 52, 40, 10, k.rgba(cn));
      swName(x, 72 + 40 + 22, cn);
    });

    // ── YÜZLER (sağ sütun üst)
    section('YÜZLER', 220, -158);
    const moods = ['happy', 'neutral', 'sad', 'surprised'];
    const faceXY = [[258, -92], [358, -92], [258, 8], [358, 8]];
    moods.forEach((mood, i) => {
      const [fx, fy] = faceXY[i];
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.ellipse(fx, fy, 32 + LW / 2, 32 + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('dim');
      ctx.beginPath(); ctx.ellipse(fx, fy, 32, 32, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3;
      const ex = 11, ey = fy - 3;
      for (const s of [-1, 1]) {
        if (mood === 'happy') { ctx.beginPath(); ctx.arc(fx + s * ex, ey + 3, 5, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
        else { const r = mood === 'surprised' ? 5 : 4; ctx.beginPath(); ctx.ellipse(fx + s * ex, ey, r, r, 0, 0, k.TAU); ctx.fill(); }
      }
      if (mood === 'happy') { ctx.beginPath(); ctx.arc(fx, fy + 10, 9, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
      else if (mood === 'sad') { ctx.beginPath(); ctx.arc(fx, fy + 16, 9, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
      else if (mood === 'surprised') { ctx.beginPath(); ctx.ellipse(fx, fy + 12, 5, 7, 0, 0, k.TAU); ctx.fill(); }
      else { ctx.beginPath(); ctx.moveTo(fx - 8, fy + 12); ctx.lineTo(fx + 8, fy + 12); ctx.stroke(); }
      label(mood, fx, fy + 58, 17, dimC, 'center');
    });

    // ── IŞIK (sağ sütun alt)
    section('IŞIK', 220, 118);
    // gölge (sağ alt, %12 koyu) + form + parlama (sol üst, %10)
    const dx = 310, dy = 196;
    const base = k.col('dim'), dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`;
    ctx.fillStyle = dark;
    ctx.beginPath(); ctx.ellipse(dx + 9, dy + 9, 40, 40, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(dx, dy, 40 + LW / 2, 40 + LW / 2, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); ctx.ellipse(dx, dy, 40, 40, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(dx - 14, dy - 14, 15, 10, -0.4, 0, k.TAU); ctx.fill();
    // ışık oku (sol üstten)
    ctx.strokeStyle = k.rgba('yellow', 0.9); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(232, 128); ctx.lineTo(272, 162); ctx.stroke();
    ctx.fillStyle = k.rgba('yellow', 0.9);
    ctx.beginPath(); ctx.moveTo(272, 162); ctx.lineTo(260, 158); ctx.lineTo(268, 150); ctx.closePath(); ctx.fill();
    label('ışık', 220, 128, 18, dimC);
    label('parlama %10 sol üst', 220, 262, 18, dimC);
    label('gölge %12 sağ alt', 220, 288, 18, dimC);
  },
};

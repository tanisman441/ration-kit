// zoo-fx/lion-roar — yandan aslan, kükreme anında ağzı açılır ve ses dalgaları yayılır. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) patilerdir, gövde negatif y yönünde yukarı uzar.
export default {
  name: 'lion-roar', category: 'zoo-fx',
  desc: 'Yandan duran aslan; kükreme anında başını geriye atar, ağzını açar, ses dalgaları yayılır',
  tags: ['aslan', 'kükreme', 'hayvanat bahçesi', 'vahşi', 'kral', 'lion', 'roar', 'zoo', 'wild', 'king', 'safari'],
  box: [-175, -215, 195, 10],
  bleed: 90,
  anchor: 'patiler (0,0); boy ~200 birim',
  points: { head: [108, -158], mouth: [168, -138], tail: [-138, -90] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'kükreme anı — ağız açılır, baş geriye atılır, ses dalgaları yayılır (1.0 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const maneC = k.rgba('yellow'), mouthC = k.rgba('red');
    const d = p.at == null ? -1 : t - p.at;
    const roaring = d >= 0 && d < 1.0;
    const env = roaring ? Math.sin(Math.min(d / 1.0, 1) * Math.PI) : 0;
    const br = Math.sin(t * k.TAU / 2.4) * 2; // nefes
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const rope = (x1, y1, cx, cy, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(cx, cy, x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(cx, cy, x2, y2); ctx.stroke();
    };

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -4, 92, 11, 0, 0, k.TAU); ctx.fill();

    // kuyruk: yumuşak sallanma (canlı idle)
    const sway = k.noise1(t * 0.9) * 14;
    rope(-108, -92, -150, -90 + sway, -142 + sway, -40, 13, body);
    disc(-142 + sway, -36, 12, 14, maneC);

    // bacaklar + patiler
    limb(-72, -100, -74, -14, 17, body);
    limb(-34, -100, -32, -14, 17, body);
    limb(52, -100, 54, -14, 17, body);
    limb(88, -100, 86, -14, 17, body);
    for (const px of [-74, -32, 54, 86]) blob(px - 12, -16, 26, 16, 8, body);

    // gövde + sağ alt gölge (premium)
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); k.rrect(-104 + 6, -168 + 6 + br * 0.4, 200, 74, 34); ctx.fill();
    blob(-104, -168 + br * 0.4, 200, 74, 34, body);
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-70, -150, 26, 12, -0.3, 0, k.TAU); ctx.fill();

    // baş grubu (kükrerken geriye atılır)
    const hx = 108, hy = -158 - br * 0.5 - env * 14;
    ctx.save();
    ctx.translate(hx, hy);
    ctx.rotate(-env * 0.22);
    // yele (sarı vurgu)
    disc(0, 0, 58, 56, maneC);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-22, -26, 18, 12, -0.4, 0, k.TAU); ctx.fill();
    // kulak
    disc(-18, -46, 12, 11, body);
    // yüz
    disc(14, 2, 34, 32, body);
    // burun
    disc(44, -4, 7, 6, inkC);
    // göz (kükrerken kısılır)
    ctx.fillStyle = inkC;
    if (roaring) { ctx.fillRect(16, -14, 14, 4); }
    else { ctx.beginPath(); ctx.ellipse(22, -12, 5, 5, 0, 0, k.TAU); ctx.fill(); }
    // ağız: kapalıyken yay, kükrerken geniş açık çene
    if (roaring) {
      const open = 8 + env * 22;
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(42, 18 + open * 0.5, 26, open + 4, 0.15, 0, k.TAU); ctx.fill();
      ctx.fillStyle = mouthC; ctx.beginPath(); ctx.ellipse(42, 18 + open * 0.5, 23, open, 0.15, 0, k.TAU); ctx.fill();
    } else {
      ctx.strokeStyle = inkC; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(38, 14, 10, 0.3, Math.PI - 0.3); ctx.stroke();
    }
    ctx.restore();

    // ses dalgaları (kükreme anı, 1.0 sn)
    if (roaring) {
      for (let i = 0; i < 3; i++) {
        const prog = k.clamp((d - i * 0.12) / 0.7, 0, 1);
        if (prog <= 0) continue;
        const r = 18 + prog * 58;
        ctx.strokeStyle = k.rgba('ink', 0.7 * (1 - prog));
        ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(hx + 62, hy + 6, r, -0.7, 0.7); ctx.stroke();
      }
    }

    // göz kırpma
    const tb = t % 4.3;
    if (tb < 0.12 && !roaring) {
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.ellipse(hx + 22, hy - 12, 9, 3, 0, 0, k.TAU); ctx.fill();
    }
  },
};

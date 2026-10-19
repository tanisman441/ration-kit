// character-actions/run-cycle — koşu döngüsündeki insan figürü. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; ayaklar (0,0), gövde negatif y yönünde yukarı uzar.
export default {
  name: 'run-cycle',
  category: 'character-actions',
  desc: 'Koşu döngüsündeki insan figürü; döngüsel bacak-kol salınımı ve ayak tozu efekti',
  tags: ['koşu', 'koşmak', 'koşan', 'sprint', 'depar', 'run', 'running', 'runner', 'sprint'],
  box: [-150, -300, 150, 24],
  bleed: 30,
  anchor: 'ayaklar (0,0); koşu yönü +x (sağa)',
  points: { head: [26, -252], chest: [12, -180], foot: [30, -16] },
  params: {
    color: { type: 'color', default: 'dim' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'happy' },
    cycle: { type: 'time', default: null, desc: 'koşu döngüsü başlangıç anı; null ise t=0\'dan başlar' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
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

    const P = 0.7; // bir adım döngüsü (sn)
    const d = t - (p.cycle ?? 0);
    const ph = ((d / P) % 1 + 1) % 1;
    const w2 = 2 * Math.PI * ph;

    // gövde zıplaması (uçuş fazı) ve öne eğilme
    const bob = -9 * (0.5 - 0.5 * Math.cos(2 * w2));
    const lean = 0.16 + 0.03 * Math.sin(2 * w2);

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -6, 58, 10, 0, 0, k.TAU); ctx.fill();

    // hız çizgileri (sol tarafta, hafif titrek)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 4;
    for (let i = 0; i < 3; i++) {
      const yy = -120 - i * 42 + k.noise1(t * 3 + i * 7) * 4;
      const xx = -118 + k.noise1(t * 2 + i * 13) * 10 - i * 8;
      const len = 34 + k.hash(i * 5 + 1) * 26;
      ctx.beginPath(); ctx.moveTo(xx - len / 2, yy); ctx.lineTo(xx + len / 2, yy); ctx.stroke();
    }

    const hipY = -132, L1 = 62, L2 = 60;

    // bacaklar (iki segmentli: uyluk + kaval)
    for (const s of [-1, 1]) {
      const legPh = ph + (s < 0 ? 0 : 0.5);
      const lw = 2 * Math.PI * legPh;
      const a = 0.85 * Math.sin(lw);                                  // uyluk salınımı
      const bend = 0.35 + 1.55 * Math.pow(Math.max(0, -Math.sin(lw + 0.7)), 1.15); // diz bükülmesi
      const hx = s * 12, hy = hipY;
      const kx = hx + L1 * Math.sin(a), ky = hy + L1 * Math.cos(a);
      const fx = kx + L2 * Math.sin(a - bend), fy = ky + L2 * Math.cos(a - bend);
      limb(hx, hy, kx, ky, 20, body);
      limb(kx, ky, fx, fy - 4, 17, body);
      blob(fx - 13, fy - 13, 26, 13, 6, body);                        // ayak
    }

    // ayak vuruşu tozu (döngüde iki kez)
    for (let i = 0; i < 2; i++) {
      const strike = (ph - i * 0.5 + 1) % 1;
      if (strike < 0.14) {
        const g = strike / 0.14;
        for (let j = 0; j < 3; j++) {
          const h1 = k.hash(i * 11 + j * 3 + 2), h2 = k.hash(i * 7 + j * 5 + 4);
          const px = 34 + (h1 - 0.3) * 60 * g, py = -10 - g * (14 + h2 * 22);
          ctx.fillStyle = k.rgba('dim', 0.5 * (1 - g));
          ctx.beginPath(); ctx.ellipse(px, py, 5 + g * 7, 4 + g * 5, 0, 0, k.TAU); ctx.fill();
        }
      }
    }

    // gövde (öne eğik)
    const leanX = Math.tan(lean) * 80;
    blob(-31 + leanX * 0.35, -242 + bob, 62, 114, 28, body);
    // sağ alt gölge (%12 koyultma)
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(16 + leanX * 0.35, -150 + bob, 13, 44, 0.1, 0, k.TAU); ctx.fill();

    // kollar (bacakların tersi fazda, dirsek bükük)
    for (const s of [-1, 1]) {
      const armPh = ph + (s < 0 ? 0.5 : 0);
      const aw = 2 * Math.PI * armPh;
      const c = 0.75 * Math.sin(aw);
      const e = 1.15 + 0.25 * Math.sin(2 * aw);                       // dirsek bükülmesi
      const sx = 22 + s * -6, sy = -206 + bob;
      const ex = sx + 48 * Math.sin(c), ey = sy + 48 * Math.cos(c);
      const hx2 = ex + 44 * Math.sin(c + e), hy2 = ey + 44 * Math.cos(c + e);
      limb(sx, sy, ex, ey, 18, body);
      limb(ex, ey, hx2, hy2, 15, body);
      disc(hx2, hy2, 10, 10, body);
    }

    // baş
    const hbx = 26, hby = -248 + bob;
    disc(hbx, hby, 36, 34, body);

    // yüz
    const ey = hby - 2, ex = 10;
    const blink = (t % 4.2) < 0.12 ? 0.2 : 1;
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    for (const s of [-1, 1]) {
      if (p.mood === 'happy') {
        ctx.beginPath(); ctx.arc(s * ex + hbx, ey + 4, 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      } else {
        const r = p.mood === 'surprised' ? 5 : 4;
        ctx.beginPath(); ctx.ellipse(s * ex + hbx, ey, r, r * blink, 0, 0, k.TAU); ctx.fill();
      }
    }
    if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(hbx, hby + 14, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
    else if (p.mood === 'sad') { ctx.beginPath(); ctx.arc(hbx, hby + 20, 10, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    else if (p.mood === 'surprised') { ctx.beginPath(); ctx.ellipse(hbx, hby + 12, 6, 8, 0, 0, k.TAU); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(hbx - 8, hby + 12); ctx.lineTo(hbx + 8, hby + 12); ctx.stroke(); }

    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(hbx - 13, hby - 12, 13, 9, -0.4, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(leanX * 0.35 - 16, -216 + bob, 9, 26, 0.12, 0, k.TAU); ctx.fill();
  },
};

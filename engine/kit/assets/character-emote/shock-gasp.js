// character-emote/shock-gasp — şaşkınlık anındaki insan figürü. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; ayaklar (0,0), gövde negatif y yönünde yukarı uzar.
export default {
  name: 'shock-gasp',
  category: 'character-emote',
  desc: 'Şaşkınlık anındaki insan figürü; büyüyen gözler, O ağız ve şok çizgileri',
  tags: ['şaşkınlık', 'şok', 'şaşırmak', 'hayret', 'surprise', 'shock', 'gasp', 'surprised', 'wow'],
  box: [-150, -340, 150, 14],
  bleed: 30,
  anchor: 'ayaklar (0,0); boy ~330 birim',
  points: { head: [0, -276], chest: [0, -184], feet: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'neutral' },
    at: { type: 'time', default: null, desc: 'şaşırma anı; gözler büyür, ağız O olur, şok çizgileri belirir' },
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
    const sstep = (a, b, x) => { const s = k.clamp((x - a) / (b - a), 0, 1); return s * s * (3 - 2 * s); };

    const d = p.at == null ? -1 : t - p.at;
    const shock = d >= 0 && d < 0.9 ? 1 - d / 0.9 : 0;          // şok şiddeti
    const jolt = shock > 0 ? Math.sin(shock * Math.PI) : 0;    // baş geriye sarsılır

    const br = Math.sin(t * k.TAU / 2.4) * 2;                   // nefes
    const blink = (t % 4.2) < 0.12 ? 0.2 : 1;

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -6, 54, 10, 0, 0, k.TAU); ctx.fill();

    const hipY = -130, shoY = -206 - br * 0.5;

    // bacaklar (şaşırınca dizler hafif bükülür, geriye adım hissi)
    const bend = jolt * 8;
    for (const s of [-1, 1]) {
      limb(s * 13, hipY, s * 16 + s * bend * 0.3, -68, 20, body);
      limb(s * 16 + s * bend * 0.3, -68, s * 21 + s * bend * 0.6, -16, 17, body);
      blob(s * 21 + s * bend * 0.6 - 12, -13, 24, 13, 6, body);
    }

    // gövde (şokta hafif geriye eğilme)
    const lean = jolt * 4;
    blob(-31 - lean, -240 - br * 0.4, 62, 112, 28, body);
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(17 - lean, -152, 12, 42, 0.1, 0, k.TAU); ctx.fill();

    // kollar: şaşkınlıkta eller yukarı/hafif açık
    const handRaise = jolt * 34;
    for (const s of [-1, 1]) {
      const hx = s * (37 + handRaise * 0.4), hy2 = -134 - handRaise;
      limb(s * 29, shoY, (s * 29 + hx) / 2 + s * 6, (shoY + hy2) / 2 + 8, 18, body);
      limb((s * 29 + hx) / 2 + s * 6, (shoY + hy2) / 2 + 8, hx, hy2, 15, body);
      disc(hx, hy2, 10, 10, body);
    }

    // baş (sarsıntıyla geriye)
    const hy = -250 - br * 0.6 - jolt * 8;
    disc(0, hy, 36, 34, body);

    // şok çizgileri (serbest çizgi: ink rengi)
    if (shock > 0) {
      const g = Math.sin(shock * Math.PI);
      ctx.strokeStyle = k.rgba('ink', 0.75 * g); ctx.lineWidth = 4;
      const rays = [
        [-62, -24, -96, -40], [62, -24, 96, -40],
        [-58, 12, -92, 18], [58, 12, 92, 18],
        [-24, -52, -34, -88], [24, -52, 34, -88],
      ];
      for (const [x1, y1, x2, y2] of rays) {
        ctx.beginPath(); ctx.moveTo(x1, hy + y1); ctx.lineTo(x2, hy + y2); ctx.stroke();
      }
    }

    // yüz: şok anında surprised yüzü zorla
    const shockedFace = shock > 0.25;
    const mood = shockedFace ? 'surprised' : p.mood;
    const ey = hy - 2, ex = 10;
    const eyeGrow = shock * 3.5;                                // gözler büyür
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    for (const s of [-1, 1]) {
      if (mood === 'happy') {
        ctx.beginPath(); ctx.arc(s * ex, ey + 4, 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      } else {
        const r = (mood === 'surprised' ? 5 : 4) + eyeGrow;
        ctx.beginPath(); ctx.ellipse(s * ex, ey, r, r * blink, 0, 0, k.TAU); ctx.fill();
      }
    }
    if (mood === 'happy') { ctx.beginPath(); ctx.arc(0, hy + 14, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
    else if (mood === 'sad') { ctx.beginPath(); ctx.arc(0, hy + 20, 10, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    else if (mood === 'surprised') {
      ctx.beginPath(); ctx.ellipse(0, hy + 12, 6 + shock * 2, 8 + shock * 4, 0, 0, k.TAU); ctx.fill();
    }
    else { ctx.beginPath(); ctx.moveTo(-8, hy + 12); ctx.lineTo(8, hy + 12); ctx.stroke(); }

    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-13, hy - 12, 13, 9, -0.4, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-15 - lean, -214, 9, 24, 0.12, 0, k.TAU); ctx.fill();
  },
};

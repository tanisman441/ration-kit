// door-fx/creak-open — aralık açılan kapı: at anında kanat 0.75 sn'de yavaşça aralanır,
// aralıktan sarı ışık sızar (glow alfa ≤ 0.5); boşta ışıkta hafif titreme.
// NOT: canvas y-aşağıdır; taban (0,0), yukarı NEGATİF y'dir.
export default {
  name: 'creak-open',
  category: 'door-fx',
  desc: 'Aralık açılan kapı: kanat yavaşça aralanır, aralıktan ışık sızar, ışık titrer',
  tags: ['kapı', 'aralık', 'açılmak', 'gıcırdamak', 'ışık', 'sızma', 'door', 'ajar', 'creak', 'open', 'light'],
  box: [-150, -230, 170, 12],
  bleed: 70,
  anchor: 'taban (0,0): kapı kasasının alt merkezi',
  points: { handle: [62, -108], gap: [10, -110] },
  params: {
    at: { type: 'time', default: null, desc: 'aralığın açılmaya başladığı an (0.75 sn yavaş açılış)' },
    color: { type: 'color', default: 'dim', desc: 'kapı kanadı rengi' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const dark = (name, f = 0.88) => {
      const c = k.col(name);
      return `rgb(${c.map(v => Math.max(0, Math.round(v * f))).join(',')})`;
    };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const shine = (x, y, rx, ry, rot = -0.4) => {
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, k.TAU); ctx.fill();
    };
    const d = p.at == null ? -1 : t - p.at;

    // ---- açılma: 0.75 sn yavaş, hafif gıcırtı salınımı ----
    let open = 0;
    if (d >= 0) {
      open = k.E.inOutCubic(k.prog(d, 0, 0.75));
      open += Math.sin(d * 22) * 0.018 * (1 - open);   // gıcırtı titremesi
      open = k.clamp(open, 0, 1);
    }

    // ---- 1) kasa + karanlık iç ----
    ctx.fillStyle = dark('panel2'); ctx.fillRect(-95, -213, 200, 220);
    ctx.fillStyle = k.rgba('panel2'); ctx.fillRect(-100, -220, 200, 220);
    ctx.strokeStyle = line; ctx.lineWidth = LW; ctx.strokeRect(-100, -220, 200, 220);
    ctx.fillStyle = k.rgba('bg'); ctx.fillRect(-88, -208, 176, 208);

    // ---- 2) ışık: aralık genişledikçe sızar, boşta titrer ----
    const flick = 0.9 + 0.1 * k.noise1(t * 4);
    const glowA = Math.min(0.5, open * 0.55) * flick;
    const xR = -88 + 176 * (1 - 0.55 * open);          // kanat sağ kenarı
    if (open > 0.01) {
      ctx.fillStyle = k.rgba('yellow', 0.28 * open * flick);
      ctx.fillRect(xR, -208, 88 - xR, 208);            // aralıktaki ışık şeridi
      k.glow(xR + 20, -110, 70 * open + 10, 'yellow', glowA);
      // ışık huzmeleri (sağa taşar)
      ctx.fillStyle = k.rgba('yellow', 0.12 * open * flick);
      ctx.beginPath();
      ctx.moveTo(xR + 10, -180); ctx.lineTo(xR + 120, -140); ctx.lineTo(xR + 120, -100); ctx.lineTo(xR + 10, -140);
      ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(xR + 10, -80); ctx.lineTo(xR + 100, -40); ctx.lineTo(xR + 100, -10); ctx.lineTo(xR + 10, -40);
      ctx.closePath(); ctx.fill();
    }

    // ---- 3) kanat (menteşe solda) ----
    const A = [-88, -208], B = [xR, -208], C = [xR, 0], D = [-88, 0];
    const q = (u, v) => [A[0] + (B[0] - A[0]) * u + (D[0] - A[0]) * v,
                         A[1] + (B[1] - A[1]) * u + (D[1] - A[1]) * v];
    const quad = (p1, p2, p3, p4, fill, stroke, lw) => {
      ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.lineTo(p3[0], p3[1]); ctx.lineTo(p4[0], p4[1]);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    };
    quad([A[0] + 5, A[1] + 7], [B[0] + 5, B[1] + 7], [C[0] + 5, C[1] + 7], [D[0] + 5, D[1] + 7], dark(p.color), dark(p.color), 1);
    quad(A, B, C, D, k.rgba(p.color), line, LW);
    if (open < 0.9) {
      quad(q(0.14, 0.12), q(0.86, 0.12), q(0.86, 0.44), q(0.14, 0.44), dark(p.color, 0.93), k.rgba('ink', 0.35), 3);
      quad(q(0.14, 0.56), q(0.86, 0.56), q(0.86, 0.88), q(0.14, 0.88), dark(p.color, 0.93), k.rgba('ink', 0.35), 3);
    }
    {
      const hp = q(0.84, 0.5);
      ctx.fillStyle = dark('panel2'); ctx.beginPath(); ctx.ellipse(hp[0] + 3, hp[1] + 4, 10, 10, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(hp[0], hp[1], 12, 12, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('panel2'); ctx.beginPath(); ctx.ellipse(hp[0], hp[1], 9, 9, 0, 0, k.TAU); ctx.fill();
    }
    const sp = q(0.18, 0.12);
    shine(sp[0], sp[1], 22 * (1 - 0.4 * open), 12);
  },
};

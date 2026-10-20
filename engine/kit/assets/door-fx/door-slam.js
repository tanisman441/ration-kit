// door-fx/door-slam — çarpan kapı: at anında aralık kanat kasaya kapanır,
// 0.15 sn sarsıntı + toz bulutu ve darbe çizgileri çıkar.
// NOT: canvas y-aşağıdır; taban (0,0), yukarı NEGATİF y'dir.
export default {
  name: 'door-slam',
  category: 'door-fx',
  desc: 'Çarpan kapı: at anında aralık kanat kasaya kapanır, sarsıntı + toz ve darbe çizgileri',
  tags: ['kapı', 'çarpmak', 'kapatmak', 'sarsıntı', 'toz', 'güm', 'door', 'slam', 'shut', 'bang'],
  box: [-150, -230, 150, 12],
  bleed: 60,
  anchor: 'taban (0,0): kapı kasasının alt merkezi',
  points: { handle: [60, -108], hinge: [-100, -165] },
  params: {
    at: { type: 'time', default: null, desc: 'kapının kapandığı an (0.18 sn kapanış + 0.15 sn sarsıntı)' },
    color: { type: 'color', default: 'dim', desc: 'kapı kanadı rengi' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55), inkC = k.rgba('ink');
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

    // ---- kanat durumu: at'ten önce aralık, 0.18 sn'de kapanır ----
    let open = 1;
    if (d >= -0.18 && d < 0) open = 1 + d / 0.18;
    else if (d >= 0) open = 0;
    let shake = 0;
    if (d >= 0 && d < 0.15) shake = k.noise1(d * 60) * 7 * (1 - d / 0.15); // 0.15 sn sarsıntı

    // ---- 1) kasa (statik) ----
    ctx.fillStyle = dark('panel2'); ctx.fillRect(-95, -213, 200, 220);       // sağ alt gölge
    ctx.fillStyle = k.rgba('panel2'); ctx.fillRect(-100, -220, 200, 220);
    ctx.strokeStyle = line; ctx.lineWidth = LW; ctx.strokeRect(-100, -220, 200, 220);
    ctx.fillStyle = k.rgba('bg'); ctx.fillRect(-88, -208, 176, 208);         // karanlık iç (kanat aralıyken görünür)
    shine(-62, -196, 26, 14);

    // ---- 2) kanat (menteşe solda, perspektifli dörtgen) ----
    const xR = -88 + 176 * (1 - 0.5 * open);
    const A = [-88 + shake, -208], B = [xR + shake, -208 + 12 * open];
    const C = [xR + shake, -10 * open], D = [-88 + shake, 0];
    const q = (u, v) => [A[0] + (B[0] - A[0]) * u + (D[0] - A[0]) * v,
                         A[1] + (B[1] - A[1]) * u + (D[1] - A[1]) * v];
    const quad = (p1, p2, p3, p4, fill, stroke, lw) => {
      ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.lineTo(p3[0], p3[1]); ctx.lineTo(p4[0], p4[1]);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    };
    quad([A[0] + 5, A[1] + 7], [B[0] + 5, B[1] + 7], [C[0] + 5, C[1] + 7], [D[0] + 5, D[1] + 7], dark(p.color), dark(p.color), 1); // gölge
    quad(A, B, C, D, k.rgba(p.color), line, LW);                                // kanat gövdesi
    // iç paneller
    quad(q(0.14, 0.12), q(0.86, 0.12), q(0.86, 0.44), q(0.14, 0.44), dark(p.color, 0.93), k.rgba('ink', 0.35), 3);
    quad(q(0.14, 0.56), q(0.86, 0.56), q(0.86, 0.88), q(0.14, 0.88), dark(p.color, 0.93), k.rgba('ink', 0.35), 3);
    // tokmak (kanatla birlikte hareket eder)
    const hp = q(0.84, 0.5);
    ctx.fillStyle = dark('panel2'); ctx.beginPath(); ctx.ellipse(hp[0] + 3, hp[1] + 4, 11, 11, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(hp[0], hp[1], 13, 13, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2'); ctx.beginPath(); ctx.ellipse(hp[0], hp[1], 10, 10, 0, 0, k.TAU); ctx.fill();
    const sp = q(0.2, 0.12);
    shine(sp[0], sp[1], 24 * (1 - 0.4 * open), 13);

    // ---- 3) çarpma efektleri ----
    if (d >= 0) {
      if (d < 0.15) {
        // darbe çizgileri: serbest çizgiler ink rengi
        const anchors = [[-100, -220], [100, -220], [-100, 0], [100, 0], [-100, -110], [100, -110], [0, -220], [0, 0]];
        const f = 1 - d / 0.15;
        ctx.strokeStyle = k.rgba('ink', 0.75 * f); ctx.lineWidth = 4;
        for (let i = 0; i < anchors.length; i++) {
          const [ax, ay] = anchors[i];
          const len = Math.hypot(ax, ay + 110) || 1;
          const nx = ax / len, ny = (ay + 110) / len, L = 16 + 14 * f;
          ctx.beginPath(); ctx.moveTo(ax + nx * 8, ay + ny * 8); ctx.lineTo(ax + nx * (8 + L), ay + ny * (8 + L)); ctx.stroke();
        }
        k.glow(0, -110, 60 * f, 'yellow', 0.4 * f);
      }
      if (d < 0.8) {
        // toz bulutu
        for (let i = 0; i < 12; i++) {
          const h1 = k.hash(i * 7 + 3), h2 = k.hash(i * 11 + 5), h3 = k.hash(i * 13 + 9);
          const dd = d - h3 * 0.25;
          if (dd < 0 || dd > 0.8) continue;
          const x = -80 + h1 * 160 + k.noise1(i * 3 + dd * 6) * 14;
          const y = -6 - dd * 30 + dd * dd * 60;
          ctx.fillStyle = k.rgba('dim', 0.55 * (1 - dd / 0.8));
          ctx.beginPath(); ctx.ellipse(x, y, 5 + h2 * 7, 4 + h2 * 5, 0, 0, k.TAU); ctx.fill();
        }
      }
    }
  },
};

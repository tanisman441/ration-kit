// bakery-fx/icing-drip — pastanın kreması kenardan damlar; `at` anında damla düşer ve yayılır. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) pastanın merkezidir.
export default {
  name: 'icing-drip', category: 'bakery-fx',
  desc: 'Kremalı pasta; `at` anında kenardaki krema damlası düşer ve pasta üzerinde yayılır',
  tags: ['pasta', 'krema', 'damla', 'pastane', 'tatlı', 'süsleme', 'cake', 'icing', 'drip', 'frosting', 'dessert', 'bakery'],
  box: [-130, -90, 130, 90],
  bleed: 20,
  anchor: 'pastanın merkezi (0,0); tabak altta, krema üsttedir',
  points: { drip: [40, 20], cake: [0, 30], top: [0, -45] },
  params: {
    color: { type: 'color', default: 'purple' },
    at: { type: 'time', default: null, desc: 'krema damlasının düşme anı' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const d = p.at == null ? -1 : t - p.at;

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // tabak
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(0, 80, 112, 12, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.ellipse(0, 78, 108, 10, 0, 0, k.TAU); ctx.fill();

    // pasta alt kat
    blob(-95, 8, 190, 68, 10, k.rgba('panel2'));
    // pasta üst kat
    blob(-70, -38, 140, 48, 10, k.rgba('dim'));
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-58, -30, 26, 7, 0, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(52, 60, 40, 9, 5); ctx.fill();
    // kat ayrım çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-92, 40); ctx.lineTo(92, 40); ctx.stroke();

    // krema üstü
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-72, -50, 144, 18, 9); ctx.fill();
    ctx.fillStyle = body; ctx.beginPath(); k.rrect(-69, -47, 138, 15, 8); ctx.fill();
    // krema üstü parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-40, -43, 24, 4, 0, 0, k.TAU); ctx.fill();
    // süsleme noktaları (krema üstünde)
    ctx.fillStyle = k.rgba('ink', 0.55);
    for (let i = 0; i < 5; i++) {
      ctx.beginPath(); ctx.arc(-52 + i * 26, -40, 2.5, 0, k.TAU); ctx.fill();
    }
    // kenardan sarkan statik krema damlaları
    for (const [dx, dl] of [[-58, 12], [-12, 18], [22, 10]]) {
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.ellipse(dx, -32 + dl / 2, 6, dl / 2 + 4, 0, 0, k.TAU); ctx.fill();
    }

    // ANA DAMLA: x=40 kenarında
    const DX = 40;
    if (d < 0) {
      // olay öncesi: damla kenarda büyür, hafif sallanır
      const wob = 1.5 * Math.sin(t * 2.4);
      const r = 5 + 1.5 * Math.sin(t * 1.8);
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.arc(DX + wob, -30, r, 0, k.TAU); ctx.fill();
    } else if (d < 0.6) {
      // düşüş: hızlanarak iner
      const prog = k.E.inCubic(d / 0.6);
      const dy = -30 + 96 * prog;
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.arc(DX, dy, 6, 0, k.TAU); ctx.fill();
      // iz çizgisi
      ctx.strokeStyle = k.rgba(p.color, 0.6); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(DX, -30); ctx.lineTo(DX, dy - 4); ctx.stroke();
    } else {
      // yayılma: pasta üzerinde leke büyür (alt katın yüzünde)
      const s = Math.min(1, (d - 0.6) / 0.5);
      const fade = d > 1.6 ? Math.max(0.55, 1 - (d - 1.6) * 0.4) : 1;
      ctx.fillStyle = k.rgba(p.color, 0.9 * fade);
      ctx.beginPath(); ctx.ellipse(DX, 56, 8 + 26 * s, 4 + 4 * s, 0, 0, k.TAU); ctx.fill();
      // damla izi (kenardan aşağı ince çizgi)
      ctx.strokeStyle = k.rgba(p.color, 0.5 * fade); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(DX, -30); ctx.lineTo(DX, 50); ctx.stroke();
      // küçük sıçrama damlacıkları
      ctx.fillStyle = k.rgba(p.color, 0.8 * fade);
      for (let i = 0; i < 3; i++) {
        const sx = DX - 26 + i * 26;
        ctx.beginPath(); ctx.arc(sx, 54 + k.hash(i + 5) * 4, 2.5, 0, k.TAU); ctx.fill();
      }
    }
  },
};

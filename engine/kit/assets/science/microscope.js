// science/microscope — yandan görünüm mikroskop; tüp, objektif, tabla, odak düğmesi.
// NOT: canvas y-aşağıdır; (0,0) tabandır.
export default {
  name: 'microscope',
  category: 'science',
  desc: 'Yandan görünüm mikroskop; mercek tüpü, objektif, numune tablası ve odak düğmeli',
  tags: ['mikroskop', 'microscope', 'laboratuvar', 'lab', 'bilim', 'science', 'lens', 'objektif', 'objective', 'inceleme'],
  box: [-115, -220, 90, 15],
  bleed: 10,
  anchor: 'taban (0,0)',
  points: { eyepiece: [10, -196], lens: [10, -98], stage: [-5, -96] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'gövde rengi' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);

    const part = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // taban
    part(-100, -30, 170, 30, 10, body);
    // gölge (sağ alt)
    ctx.fillStyle = k.rgba('bg', 0.25);
    ctx.beginPath(); k.rrect(-94, -12, 164, 12, 8); ctx.fill();

    // kol (dikey)
    ctx.strokeStyle = line; ctx.lineWidth = 26 + LW;
    ctx.beginPath(); ctx.moveTo(53, -40); ctx.lineTo(53, -140); ctx.stroke();
    ctx.strokeStyle = body; ctx.lineWidth = 26;
    ctx.beginPath(); ctx.moveTo(53, -40); ctx.lineTo(53, -140); ctx.stroke();

    // tüp tutucu (yatay)
    ctx.strokeStyle = line; ctx.lineWidth = 20 + LW;
    ctx.beginPath(); ctx.moveTo(53, -150); ctx.lineTo(12, -150); ctx.stroke();
    ctx.strokeStyle = body; ctx.lineWidth = 20;
    ctx.beginPath(); ctx.moveTo(53, -150); ctx.lineTo(12, -150); ctx.stroke();

    // mercek tüpü (dikey)
    part(-7, -190, 34, 70, 8, body);
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(2, -176, 7, 16, 0.1, 0, k.TAU); ctx.fill();

    // göz merceği
    part(-2, -206, 24, 18, 6, k.rgba('ink', 0.9));

    // objektif
    part(-1, -120, 22, 24, 5, k.rgba('dim', 1));
    // objektif camı (vurgu)
    const pulse = 0.3 + 0.12 * Math.sin(t * 2);
    k.glow(10, -96, 18, 'cyan', pulse);
    ctx.fillStyle = k.rgba('cyan', 0.9);
    ctx.beginPath(); ctx.arc(10, -96, 6, 0, k.TAU); ctx.fill();

    // tabla
    part(-60, -96, 110, 15, 6, body);
    // lam (numune camı)
    part(-35, -104, 45, 8, 3, k.rgba('panel2', 1));

    // ışık kaynağı (tabla altı, nefes alır)
    k.glow(10, -81, 16, 'yellow', 0.25 + 0.1 * Math.sin(t * 2));
    ctx.fillStyle = k.rgba('yellow', 0.85);
    ctx.beginPath(); ctx.arc(10, -81, 7, 0, k.TAU); ctx.fill();

    // odak düğmesi
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(70, -60, 15.5, 0, k.TAU); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.arc(70, -60, 13, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.8);
    ctx.beginPath(); ctx.arc(70, -60, 4, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};

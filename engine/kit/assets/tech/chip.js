// tech/chip — üstten görünüm işlemci yongası: kare gövde, 4 kenarda pinler,
// ortada die + devre izleri. activity arttıkça pin LED'leri ve izler canlanır.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) gövde merkezidir.
export default {
  name: 'chip', category: 'tech',
  desc: 'Üstten görünüm işlemci yongası; activity arttıkça pin ışıkları ve devre izleri canlanır',
  tags: ['işlemci', 'yong', 'chip', 'cpu', 'processor', 'donanım', 'hardware', 'mikroçip'],
  box: [-105, -105, 105, 105],
  bleed: 12,
  anchor: 'gövde merkezi (0,0)',
  points: { die: [0, 0] },
  params: {
    color: { type: 'color', default: 'ink' },
    activity: { type: 'number', default: 0.4, desc: 'pin ışıkları ve devre izi yoğunluğu (0-1)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const dot = (x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill(); };

    // pinler (her kenarda 8)
    const act = k.clamp(p.activity, 0, 1);
    const litTotal = Math.round(act * 32);
    let li = 0;
    const pin = (x, y, w, h) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, 3); ctx.fill();
      let cc = k.rgba('dim', 0.8);
      if (li < litTotal) {
        const tw = 0.6 + 0.4 * Math.sin(t * 4 + k.hash(li * 5 + 1) * k.TAU);
        cc = k.rgba('cyan', tw);
        if (k.hash(li * 3 + 7) > 0.5) k.glow(x + w / 2, y + h / 2, 12, 'cyan', 0.3);
      }
      ctx.fillStyle = cc; ctx.beginPath(); k.rrect(x, y, w, h, 3); ctx.fill();
      li++;
    };
    for (let i = 0; i < 8; i++) {
      const o = -70 + i * 20;
      pin(o - 5, -98, 10, 22);   // üst
      pin(o - 5, 76, 10, 22);    // alt
      pin(-98, o - 5, 22, 10);   // sol
      pin(76, o - 5, 22, 10);    // sağ
    }

    // gövde
    blob(-76, -76, 152, 152, 14, body);
    // pin-1 işareti (köşe noktası)
    dot(-58, -58, 5, k.rgba('bg', 0.6));

    // die (iç kare)
    blob(-46, -46, 92, 92, 8, k.rgba('panel'));
    // devre izleri: die'dan kenarlara ince çizgiler
    ctx.lineWidth = 3;
    const traces = [
      [-46, -30, -66, -30, -66, -52], [-46, 10, -64, 10], [46, -20, 66, -20, 66, -46],
      [-30, 46, -30, 66], [20, 46, 20, 66, 44, 66], [46, 30, 64, 30],
    ];
    traces.forEach((tr, i) => {
      const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 3 + k.hash(i * 11 + 3) * k.TAU));
      ctx.strokeStyle = k.rgba('cyan', act > 0.05 ? tw * (0.3 + act * 0.7) : 0);
      ctx.beginPath(); ctx.moveTo(tr[0], tr[1]);
      for (let j = 2; j < tr.length; j += 2) ctx.lineTo(tr[j], tr[j + 1]);
      ctx.stroke();
    });

    // die çekirdeği
    blob(-22, -22, 44, 44, 8, k.rgba('bg', 0.85));
    const coreA = 0.5 + act * 0.5;
    dot(0, 0, 9, k.rgba('cyan', coreA));
    if (act > 0.15) k.glow(0, 0, 26, 'cyan', 0.35 * act + 0.1);

    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-44, -52, 26, 14, -0.5, 0, k.TAU); ctx.fill();
  },
};

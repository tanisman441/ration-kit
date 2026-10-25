// orchestra-fx/baton-wave — şef batonu döngüsel sallanır; hayalet izler sallanma yörüngesini gösterir. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) elin (bileğin) merkezidir.
export default {
  name: 'baton-wave', category: 'orchestra-fx',
  desc: 'Şefin eli ince batonu döngüsel olarak sallar; geride kalan hayalet izler ve uçtaki parıltı sallanma ritmini gösterir',
  tags: ['şef', 'baton', 'orkestra', 'sallama', 'ritim', 'müzik', 'conductor', 'baton', 'orchestra', 'wave', 'tempo', 'music'],
  box: [-110, -110, 110, 110],
  bleed: 20,
  anchor: 'şefin elinin (bilek) merkezi (0,0); baton elden yukarı uzanır',
  points: { hand: [0, 45], tip: [48, -62], pivot: [0, 28] },
  params: {
    color: { type: 'color', default: 'ink' },
    speed: { type: 'number', default: 1, desc: 'sallanma hızı çarpanı (1 = ~1.8 sn bir gidiş-geliş)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const sp = p.speed || 1;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.save();

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // sallanma açısı: dikeyden sağa sola, ~1.8 sn periyot
    const ang = (tt) => -0.15 + 0.65 * Math.sin(tt * k.TAU / 1.8 * sp);
    const PX = 0, PY = 28, LEN = 104;
    const tipAt = (a) => [PX + Math.sin(a) * LEN, PY - Math.cos(a) * LEN];

    // sallanma yörüngesi: sol üstte ince yay (hareket hissi) — batonun gerçek salınım aralığı
    ctx.strokeStyle = k.rgba('ink', 0.18); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(PX, PY, LEN, -0.85, 0.55); ctx.stroke();

    // hayalet izler: önceki iki faz, soluk baton
    for (let g = 1; g <= 2; g++) {
      const a = ang(t - 0.09 * g);
      const [tx, ty] = tipAt(a);
      ctx.strokeStyle = k.rgba('ink', 0.22 - 0.07 * g); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(PX, PY); ctx.lineTo(tx, ty); ctx.stroke();
    }

    // süzülen notalar (ritme göre hafifçe yükselir)
    const note = (x, y, s, a) => {
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = a;
      ctx.fillStyle = k.rgba('accent');
      ctx.beginPath(); ctx.ellipse(0, 0, 6, 4.5, -0.3, 0, k.TAU); ctx.fill();
      ctx.fillRect(4.5, -16, 2.6, 16);
      ctx.beginPath(); ctx.moveTo(7, -16); ctx.quadraticCurveTo(15, -13, 13, -6); ctx.lineTo(7, -9); ctx.closePath(); ctx.fill();
      ctx.restore();
    };
    note(-72, -58 + 4 * Math.sin(t * k.TAU / 1.8 * sp), 1, 0.85);
    note(78, -72 - 4 * Math.sin(t * k.TAU / 1.8 * sp + 1), 0.8, 0.7);

    // el: yumruk (yuvarlak rrect) + bilek manşeti
    blob(-16, 32, 32, 30, 12, k.rgba('panel2'));
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-8, 38, 7, 4, -0.4, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(4, 52, 14, 6, 3); ctx.fill();
    // parmak çizgileri
    ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-8, 40); ctx.lineTo(8, 40); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-8, 48); ctx.lineTo(8, 48); ctx.stroke();
    // manşet (kol)
    blob(-14, 62, 28, 26, 8, body);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-6, 68, 6, 3, -0.3, 0, k.TAU); ctx.fill();

    // baton: elden çıkan ince çubuk + uç topu
    const a = ang(t);
    const [tx, ty] = tipAt(a);
    ctx.strokeStyle = line; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(PX, PY); ctx.lineTo(tx, ty); ctx.stroke();
    ctx.strokeStyle = k.rgba('panel2'); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(PX, PY); ctx.lineTo(tx, ty); ctx.stroke();
    // uç parıltısı: nabız gibi yanıp söner
    const pulse = 0.5 + 0.5 * Math.sin(t * k.TAU / 1.8 * sp);
    k.glow(tx, ty, 12 + 6 * pulse, 'yellow', 0.35);
    ctx.fillStyle = k.rgba('yellow', 0.9);
    ctx.beginPath(); ctx.arc(tx, ty, 5, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};

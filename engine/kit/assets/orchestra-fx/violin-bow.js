// orchestra-fx/violin-bow — keman yayı teller üzerinde döngüsel çekilir; yay ileri geri giderken tel titreşir. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) keman gövdesinin merkezidir.
export default {
  name: 'violin-bow', category: 'orchestra-fx',
  desc: 'Yatay duran kemanın telleri üzerinde yay döngüsel olarak ileri geri çekilir; köprü yakınında titreşim halkaları belirir',
  tags: ['keman', 'yay', 'teller', 'orkestra', 'çello', 'müzik', 'violin', 'bow', 'strings', 'orchestra', 'music', 'fiddle'],
  box: [-150, -95, 150, 95],
  bleed: 15,
  anchor: 'keman gövdesinin merkezi (0,0); sap sağa uzanır',
  points: { bridge: [-45, 0], scroll: [138, -10], bowTip: [55, -42], tailpiece: [-105, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
    speed: { type: 'number', default: 1, desc: 'yay çekme hızı çarpanı (1 = ~1.4 sn bir gidiş-geliş)' },
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

    // keman gövdesi: iki oval (alt bout büyük, üst bout küçük)
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(-72, 8, 46, 40, 0, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-58, -28, 34, 30, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.ellipse(-72, 8, 43, 37, 0, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-58, -28, 31, 27, 0, 0, k.TAU); ctx.fill();
    // premium parlama (sol üst, alt bout)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-92, -12, 18, 8, -0.5, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(-48, 32, 18, 7, -0.3, 0, k.TAU); ctx.fill();

    // f delikleri: iki küçük yay
    ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(-48, 2, 12, 0.6, 2.4); ctx.stroke();
    ctx.beginPath(); ctx.arc(-48, -6, 12, 3.7, 5.5); ctx.stroke();

    // sap + klavye + burgu kutusu
    ctx.strokeStyle = line; ctx.lineWidth = 13;
    ctx.beginPath(); ctx.moveTo(-28, -18); ctx.lineTo(118, -14); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink'); ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(-28, -18); ctx.lineTo(118, -14); ctx.stroke();
    // burgu (scroll): spiral uç
    ctx.strokeStyle = line; ctx.lineWidth = 11;
    ctx.beginPath(); ctx.arc(128, -16, 10, 0, k.TAU); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink'); ctx.lineWidth = 7;
    ctx.beginPath(); ctx.arc(128, -16, 10, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.arc(128, -16, 5, 0, k.TAU); ctx.fill();

    // köprü: küçük kemer
    ctx.strokeStyle = line; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(-52, 6); ctx.lineTo(-38, 6); ctx.stroke();
    ctx.strokeStyle = k.rgba('panel2'); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-52, 6); ctx.lineTo(-38, 6); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-45, 6); ctx.lineTo(-45, -4); ctx.stroke();

    // teller: kuyruktan burguya 4 ince çizgi (ink, serbest çizgi kuralı)
    // yay çekilirken ortası hafifçe titreşir
    const bowX = 42 * Math.sin(t * k.TAU / 1.4 * sp);
    const vib = 2.2 * Math.sin(t * k.TAU / 0.35 * sp);
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 1.8;
    for (let i = 0; i < 4; i++) {
      const y0 = -8 + i * 5;
      ctx.beginPath();
      ctx.moveTo(-108, y0);
      ctx.quadraticCurveTo(-45 + bowX * 0.4, y0 + vib * (i % 2 === 0 ? 1 : -1), 124, -12 + i * 2);
      ctx.stroke();
    }

    // titreşim halkaları: köprü yakınında, yay hızıyla nabız atar
    const ringA = 0.25 + 0.2 * Math.abs(Math.sin(t * k.TAU / 1.4 * sp));
    ctx.strokeStyle = k.rgba('accent', ringA); ctx.lineWidth = 2.5;
    for (let r = 8; r <= 20; r += 6) {
      ctx.beginPath(); ctx.arc(-45, 0, r, -0.9, 0.9); ctx.stroke();
      ctx.beginPath(); ctx.arc(-45, 0, r, Math.PI - 0.9, Math.PI + 0.9); ctx.stroke();
    }

    // yay: köprü üzerinde çapraz durur, teller boyunca ileri geri kayar
    const bx = -45 + bowX;
    ctx.strokeStyle = line; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(bx - 58, -52); ctx.lineTo(bx + 58, 34); ctx.stroke();
    ctx.strokeStyle = k.rgba('panel2'); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(bx - 58, -52); ctx.lineTo(bx + 58, 34); ctx.stroke();
    // yay kılı (ince, ink)
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(bx - 52, -44); ctx.lineTo(bx + 52, 40); ctx.stroke();
    // yay ucu + kurbağa (frog)
    ctx.fillStyle = k.rgba('accent', 0.9);
    ctx.beginPath(); ctx.arc(bx + 58, 34, 5, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.9);
    ctx.beginPath(); ctx.arc(bx - 58, -52, 5, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};

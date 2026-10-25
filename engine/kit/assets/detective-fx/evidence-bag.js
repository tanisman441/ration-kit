// detective-fx/evidence-bag — delil poşeti; `at` anında fermuar kapanır ve kırmızı mühür basılır. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) poşetin merkezidir.
export default {
  name: 'evidence-bag', category: 'detective-fx',
  desc: 'Şeffaf delil poşeti içinde anahtar; `at` anında fermuar kayar, kırmızı mühür halkası basılır',
  tags: ['delil', 'poşet', 'mühür', 'kanıt', 'dedektif', 'fermuar', 'evidence', 'bag', 'seal', 'proof', 'detective', 'zip'],
  box: [-110, -110, 110, 110],
  bleed: 30,
  anchor: 'poşet merkezi (0,0); poşet tabanı y ~85',
  points: { seal: [0, -45], item: [0, 25], zip: [0, -78] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'mühürleme anı — fermuar kapanır (0.4 sn), mühür basılır (0.6 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // poşet hafifçe sallanır (idle)
    const sway = 0.02 * Math.sin(t * k.TAU / 2.6);
    ctx.save();
    ctx.translate(0, -70);
    ctx.rotate(sway);
    ctx.translate(0, 70);

    // poşet gövdesi (yarı şeffaf)
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-80, -82, 160, 172, 12); ctx.fill();
    ctx.fillStyle = k.rgba('panel2', 0.55); ctx.beginPath(); k.rrect(-77, -79, 154, 166, 10); ctx.fill();
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-55, -62, 22, 7, 0, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(30, 66, 44, 10, 5); ctx.fill();
    // poşet kıvrım çizgileri
    ctx.strokeStyle = k.rgba('ink', 0.25); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-70, -30); ctx.quadraticCurveTo(-50, 0, -66, 40); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(64, -50); ctx.quadraticCurveTo(48, -10, 60, 30); ctx.stroke();

    // içindeki delil: anahtar
    const glint = 0.5 + 0.5 * Math.sin(t * k.TAU / 1.9);
    ctx.save();
    ctx.translate(0, 25);
    ctx.rotate(-0.35);
    // anahtar başı (halka)
    ctx.strokeStyle = line; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.arc(-14, 0, 13, 0, k.TAU); ctx.stroke();
    ctx.strokeStyle = k.rgba('yellow', 0.9); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(-14, 0, 13, 0, k.TAU); ctx.stroke();
    // anahtar gövdesi
    ctx.strokeStyle = line; ctx.lineWidth = 11;
    ctx.beginPath(); ctx.moveTo(-2, 0); ctx.lineTo(30, 0); ctx.stroke();
    ctx.strokeStyle = k.rgba('yellow', 0.9); ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(-2, 0); ctx.lineTo(30, 0); ctx.stroke();
    // dişler
    ctx.strokeStyle = k.rgba('yellow', 0.9); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(20, 0); ctx.lineTo(20, 9); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(28, 0); ctx.lineTo(28, 7); ctx.stroke();
    // parıltı
    ctx.fillStyle = `rgba(255,255,255,${0.35 + 0.35 * glint})`;
    ctx.beginPath(); ctx.arc(-18, -5, 3, 0, k.TAU); ctx.fill();
    ctx.restore();

    // fermuar şeridi (üstte)
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-80, -82, 160, 14, 7); ctx.fill();
    ctx.fillStyle = k.rgba('panel2'); ctx.beginPath(); k.rrect(-77, -79, 154, 11, 6); ctx.fill();
    // fermuar dişleri
    ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 2;
    for (let x = -72; x <= 72; x += 8) {
      ctx.beginPath(); ctx.moveTo(x, -78); ctx.lineTo(x, -70); ctx.stroke();
    }
    // fermuar sürgüsü: at'tan önce solda, at..at+0.4 sağa kayar
    let zx;
    if (d < 0) zx = -68;
    else if (d < 0.4) zx = k.lerp(-68, 68, 1 - Math.pow(1 - d / 0.4, 2));
    else zx = 68;
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(zx - 7, -84, 14, 18, 4); ctx.fill();
    ctx.fillStyle = body; ctx.beginPath(); k.rrect(zx - 5, -82, 10, 14, 3); ctx.fill();
    ctx.fillStyle = k.rgba('red', 0.9); ctx.beginPath(); ctx.arc(zx, -75, 2.5, 0, k.TAU); ctx.fill();

    // mühür: fermuar kapandıktan sonra basılır (d 0.4..1.0 arası büyür, sonra kalır)
    if (d >= 0.4) {
      const sp = k.clamp((d - 0.4) / 0.5, 0, 1);
      const over = sp < 1 ? 1 + 0.25 * Math.sin(sp * Math.PI) : 1;
      const sa = k.clamp(sp * 1.4, 0, 1);
      ctx.save();
      ctx.translate(0, -45);
      ctx.scale(over, over);
      ctx.rotate(-0.12);
      ctx.strokeStyle = k.rgba('red', 0.95 * sa); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(0, 0, 22, 0, k.TAU); ctx.stroke();
      ctx.strokeStyle = k.rgba('red', 0.7 * sa); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, 17, 0, k.TAU); ctx.stroke();
      // mühür ortasında onay işareti
      ctx.strokeStyle = k.rgba('red', 0.95 * sa); ctx.lineWidth = 4.5;
      ctx.beginPath(); ctx.moveTo(-9, 0); ctx.lineTo(-3, 7); ctx.lineTo(10, -7); ctx.stroke();
      ctx.restore();
      // basılma anında halka nabzı
      if (d < 1.2) {
        const prog = (d - 0.4) / 0.8;
        ctx.strokeStyle = k.rgba('red', 0.6 * (1 - prog)); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(0, -45, 24 + prog * 22, 0, k.TAU); ctx.stroke();
      }
    }
    ctx.restore();

    // boştayken poşet üstünde "mühür bekleniyor" nabzı: fermuar sürgüsü hafifçe titrer
    if (d < 0) {
      ctx.fillStyle = k.rgba('cyan', 0.4 + 0.3 * Math.sin(t * k.TAU / 1.5));
      ctx.beginPath(); ctx.arc(-68, -75, 3.5, 0, k.TAU); ctx.fill();
    }
  },
};

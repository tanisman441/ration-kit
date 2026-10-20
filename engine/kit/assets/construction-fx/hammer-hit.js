// construction-fx/hammer-hit — çekiç çiviye vurur; at anında yıldız çakma + halka şoku.
// NOT: canvas y-aşağıdır; (0,0) çivi başı.
export default {
  name: 'hammer-hit', category: 'construction-fx',
  desc: 'Hammer striking a nail into wood, with an impact star flash and shockwave when at hits',
  tags: ['çekiç', 'çivi', 'vuruş', 'çarpma', 'inşaat', 'hammer', 'nail', 'strike', 'impact'],
  box: [-110, -140, 110, 120],
  bleed: 70,
  anchor: 'çivi başı (0,8)',
  points: { impact: [0, 8], top: [104, -92] },
  params: {
    at: { type: 'time', default: null, desc: 'çekicin çiviye vurduğu an (çakma + şok halkası)' },
    color: { type: 'color', default: 'ink' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const ol = k.rgba('bg', 0.55), OW = 6;

    function rbody(x, y, w, h, r, fill) {
      ctx.fillStyle = k.rgba('ink', 0.12);
      ctx.beginPath(); k.rrect(x + 6, y + 6, w, h, r); ctx.fill();
      ctx.fillStyle = fill;
      ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
      ctx.fillStyle = k.rgba('bg', 0.10);
      ctx.beginPath(); ctx.ellipse(x + w * 0.3, y + h * 0.28, w * 0.22, h * 0.16, -0.4, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = ol; ctx.lineWidth = OW;
      ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.stroke();
    }

    // 1) tahta blok
    rbody(-80, 70, 160, 42, 10, k.rgba('dim', 1));
    // 2) tahta damarları (iç detay)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    for (let i = 0; i < 2; i++) {
      ctx.beginPath(); ctx.moveTo(-62, 84 + i * 14); ctx.lineTo(62, 84 + i * 14); ctx.stroke();
    }
    // 3) çivi — baş + gövde
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(-9 + 6, 8 + 6, 18, 10, 4); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath(); k.rrect(-9, 8, 18, 10, 4); ctx.fill();
    ctx.strokeStyle = ol; ctx.lineWidth = 4;
    ctx.beginPath(); k.rrect(-9, 8, 18, 10, 4); ctx.stroke();
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath(); k.rrect(-4, 18, 8, 54, 3); ctx.fill();

    // 4-5) çekiç — vuruş animasyonu: geri çekilme, çarpma, geri tepme
    let lift;
    if (d < 0) lift = 26 * (1 - k.clamp(-d / 0.35, 0, 1));
    else if (d < 0.12) lift = 26 * (1 - d / 0.12);
    else if (d < 0.6) lift = 8 * Math.sin((d - 0.12) / 0.48 * Math.PI);
    else lift = 0;
    lift += k.noise1(t * 2) * 1.2; // boşta hafif sallantı
    ctx.save(); ctx.translate(0, lift);
    rbody(10, -18, 62, 36, 10, k.rgba('ink', 1));           // çekiç başı
    ctx.fillStyle = k.rgba('panel2', 1);                     // vuruş yüzeyi
    ctx.beginPath(); k.rrect(10, -18, 16, 36, 6); ctx.fill();
    ctx.strokeStyle = ol; ctx.lineWidth = 4;
    ctx.beginPath(); k.rrect(10, -18, 16, 36, 6); ctx.stroke();
    ctx.strokeStyle = k.rgba('dim', 1); ctx.lineWidth = 15;  // sap
    ctx.beginPath(); ctx.moveTo(72, 0); ctx.lineTo(104, -92); ctx.stroke();
    ctx.strokeStyle = ol; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(72, 0); ctx.lineTo(104, -92); ctx.stroke();
    ctx.restore();

    // 6) çarpma çakması — yıldız + halka + kıvılcımlar (0–0.5 sn)
    if (d >= 0 && d < 0.5) {
      const f = 1 - d / 0.5;
      k.glow(0, 8, 64 * f + 10, 'yellow', 0.45 * f);
      ctx.fillStyle = k.rgba('yellow', 0.9 * f);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * k.TAU + 0.2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a - 0.14) * 8, 8 + Math.sin(a - 0.14) * 8);
        ctx.lineTo(Math.cos(a) * (34 + 22 * f), 8 + Math.sin(a) * (34 + 22 * f));
        ctx.lineTo(Math.cos(a + 0.14) * 8, 8 + Math.sin(a + 0.14) * 8);
        ctx.closePath(); ctx.fill();
      }
      const g = k.prog(d, 0, 0.45);
      ctx.strokeStyle = k.rgba('yellow', 0.6 * (1 - g)); ctx.lineWidth = 6 * (1 - g) + 1.5;
      ctx.beginPath(); ctx.arc(0, 8, 16 + 60 * k.E.outExpo(g), 0, k.TAU); ctx.stroke();
      for (let i = 0; i < 6; i++) {
        const a = k.hash(i * 5 + 3) * k.TAU, dist = (26 + k.hash(i * 9 + 4) * 44) * k.E.outCubic(g);
        ctx.fillStyle = k.rgba('dim', 0.7 * (1 - g));
        ctx.beginPath(); ctx.arc(Math.cos(a) * dist, 8 + Math.sin(a) * dist - g * 22, 2.5 + k.hash(i * 7 + 6) * 3, 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore();
  },
};

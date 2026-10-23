// police-fx/evidence-tag — delil etiketi: at anında yukarıdan düşer, ipe takılıp sallanır (sönümlü sarkaç); boşta hafif salınım.
// NOT: canvas y-aşağıdır; (0,0) ipin üst ucu. Orijinal tasarım.
export default {
  name: 'evidence-tag',
  category: 'police-fx',
  desc: 'Delil etiketi: at anında düşer, ipe takılıp sarkaç gibi sallanır',
  tags: ['delil', 'etiket', 'polis', 'suç', 'kanıt', 'soruşturma', 'evidence', 'tag', 'police', 'crime', 'investigation'],
  box: [-110, -110, 110, 110],
  bleed: 45,
  anchor: 'ipin üst ucu (0,0)',
  points: { hole: [0, -52], bottom: [0, 52] },
  params: {
    at: { type: 'time', default: null, desc: 'etiket düşme anı (0.5 sn düşüş + sönümlü sallanma)' },
    text: { type: 'text', default: 'A-17', desc: 'etiketteki yazı' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const O = k.rgba('bg', 0.55);
    const LW = 5;
    const col = k.rgba(p.color, 1);
    const ink = k.rgba('ink', 1);

    const d = p.at == null ? -1 : t - p.at;
    // düşüş: at sonrası 0.5 sn'de 90 birim yukarıdan iner (ease-in, ipin üstüne takılır)
    let drop;
    if (d < 0) drop = -90;
    else if (d < 0.5) drop = k.lerp(-90, 0, k.E.inCubic(d / 0.5));
    else drop = 0;
    // sallanma: düşüşten sonra sönümlü sarkaç (1.2 sn), + idle hafif salınım
    const swing = d >= 0 && d < 2.2 ? Math.sin(d * 9) * 0.22 * Math.exp(-d * 2.2) : 0;
    const idle = Math.sin(t * 1.4) * 0.03;

    // ip (ink serbest çizgi kuralı)
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(0, -110); ctx.lineTo(0, -52 + drop); ctx.stroke();

    ctx.save();
    ctx.translate(0, drop);
    ctx.rotate(swing + idle);

    // etiket kartı
    const W = 120, H = 110;
    ctx.fillStyle = O; k.rrect(-W / 2 - LW / 2, -52 - LW / 2, W + LW, H + LW, 14); ctx.fill();
    ctx.fillStyle = col; k.rrect(-W / 2, -52, W, H, 14); ctx.fill();
    // delik (metal halka)
    ctx.fillStyle = O; ctx.beginPath(); ctx.arc(0, -52 + 18, 12, 0, k.TAU); ctx.fill();
    ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(0, -52 + 18, 9, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color === 'yellow' ? 'bg' : 'yellow', 1);
    ctx.beginPath(); ctx.arc(0, -52 + 18, 4.5, 0, k.TAU); ctx.fill();
    // başlık çizgisi
    ctx.strokeStyle = k.rgba('bg', 0.35); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-W / 2 + 14, -52 + 38); ctx.lineTo(W / 2 - 14, -52 + 38); ctx.stroke();
    // yazı (bilgi yüzeyi — parlama yok)
    ctx.fillStyle = ink;
    ctx.font = "700 26px 'Barlow Condensed', sans-serif";
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String(p.text ?? 'A-17').slice(0, 8), 0, -52 + 66);
    // alt satır: küçük ikon (mühür)
    ctx.strokeStyle = ink; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, -52 + 92, 9, 0, k.TAU); ctx.stroke();

    // premium parlama: kart sol üst (metin yüzeyinden uzak)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-W / 2 + 22, -52 + 14, 22, 8, -0.4, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('bg', 0.12);
    k.rrect(-W / 2 + 6, -52 + H - 18, W - 12, 12, 6); ctx.fill();

    ctx.restore();
    ctx.restore();
  },
};

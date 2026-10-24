// library-fx/book-fall — rafta duran kitap düşer, yere yatık düşüp toz kaldırır.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) = sahne merkezi.
export default {
  name: 'book-fall', category: 'library-fx',
  desc: 'Rafta duran kitap at anında düşer, dönerek yere yatık konar ve toz kaldırır',
  tags: ['kitap', 'kütüphane', 'düşme', 'raf', 'book', 'library', 'fall', 'drop', 'shelf'],
  box: [-170, -240, 170, 170],
  bleed: 50,
  anchor: 'sahne merkezi (raf ile zemin arası)',
  points: { shelf: [-140, -120], floor: [0, 140], book: [0, -210] },
  params: {
    color: { type: 'color', default: 'red' },
    at: { type: 'time', default: null, desc: 'kitabın düşme anı (0.9 sn: düşüş + sekme + toz)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const falling = d >= 0 && d < 0.9;
    const done = d >= 0.9;
    const g = falling ? k.prog(d, 0, 0.9) : (done ? 1 : 0);
    // Düşüş: hızlanan y + sonlarda 2 küçük sekme; dönüş: dikeyden yatay konuma.
    let by = -165, rot = 0;
    if (p.at != null && d >= 0) {
      const fall = Math.min(1, d / 0.62);
      const ease = fall * fall;
      by = k.lerp(-165, 126, ease);
      rot = -Math.PI / 2 * ease;
      if (d >= 0.62 && d < 0.9) {
        const b = (d - 0.62) / 0.28;
        by -= Math.sin(b * Math.PI * 2) * 10 * (1 - b);
        rot += Math.sin(b * Math.PI * 2) * 0.08 * (1 - b);
      }
    } else if (p.at == null) {
      rot = k.noise1(t * 0.8) * 0.03; // rafta hafif salınım (idle)
    }
    ctx.lineCap = 'round';
    ctx.save();

    // Zemin
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-164, 140, 328, 18, 8); ctx.fill();
    ctx.fillStyle = k.rgba('panel2', 1); ctx.beginPath(); k.rrect(-160, 140, 320, 14, 8); ctx.fill();
    // Raf (üstte, kitap öncesi konumu)
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-164, -124, 328, 18, 8); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 1); ctx.beginPath(); k.rrect(-160, -124, 320, 14, 8); ctx.fill();
    // Raf desteği (ink ince çizgiler)
    ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-140, -106); ctx.lineTo(-140, -70); ctx.moveTo(140, -106); ctx.lineTo(140, -70); ctx.stroke();
    // Rafta duran diğer kitaplar (sabit, solda)
    const others = [[-140, 'dim'], [-108, 'panel2'], [100, 'dim'], [132, 'panel2']];
    for (let i = 0; i < others.length; i++) {
      const ox = others[i][0];
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(ox - 14, -214, 28, 90, 6); ctx.fill();
      ctx.fillStyle = k.rgba(others[i][1], 1); ctx.beginPath(); k.rrect(ox - 12, -212, 24, 86, 6); ctx.fill();
    }

    // Düşen kitap
    ctx.save();
    ctx.translate(0, by); ctx.rotate(rot);
    // Gölge formu (sağ alt offset, kitap gövdesi kadar)
    ctx.fillStyle = k.rgba('ink', 0.12); ctx.beginPath(); k.rrect(-32, -39, 70, 90, 8); ctx.fill();
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-38, -45, 76, 90, 8); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1); ctx.beginPath(); k.rrect(-35, -42, 70, 84, 8); ctx.fill();
    // Sayfa kenarı (sağda açık renk)
    ctx.fillStyle = k.rgba('panel2', 1); ctx.beginPath(); k.rrect(22, -38, 10, 76, 4); ctx.fill();
    // Sırt çizgisi + başlık çizgileri (ink ince)
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-24, -30); ctx.lineTo(14, -30); ctx.moveTo(-24, -14); ctx.lineTo(14, -14); ctx.moveTo(-24, 2); ctx.lineTo(14, 2); ctx.stroke();
    // Sol üst parlama (premium finish, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-18, -30, 14, 8, -0.4, 0, k.TAU); ctx.fill();
    ctx.restore();

    // Konma tozu (0.62–0.9 sn arası, sonra söner)
    if (p.at != null && d >= 0.62 && d < 1.4) {
      const pg = k.prog(d - 0.62, 0, 0.78);
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI + (k.hash(i * 13 + 1) * Math.PI);
        const sp = (20 + k.hash(i * 17 + 2) * 70) * pg;
        ctx.fillStyle = k.rgba('dim', 0.7 * (1 - pg));
        ctx.beginPath(); ctx.arc(Math.cos(a) * sp, 132 + Math.sin(a) * sp * 0.35, 3 + k.hash(i * 19 + 3) * 4 * (1 - pg * 0.5), 0, k.TAU); ctx.fill();
      }
    }
    // Düşüş izi (havadayken ince çizgiler)
    if (falling && d < 0.62) {
      ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        const yy = by - 60 - i * 28;
        ctx.beginPath(); ctx.moveTo(-14 + i * 14, yy); ctx.lineTo(14 - i * 10, yy); ctx.stroke();
      }
    }
    ctx.restore();
  },
};

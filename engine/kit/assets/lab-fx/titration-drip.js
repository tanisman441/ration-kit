// lab-fx/titration-drip — damla damlatan büret: üstten kıskaçla tutulan mezürlü
// cam tüp, altındaki musluk ve uç. drop anında damla kopup düşer, altta
// küçük bir dalga halkası bırakır; damla öncesinde uçta büyüyen tomurcuk (idle).
// NOT: canvas y-aşağıdır; (0,0) büret üst ucundadır (kıskaç noktası).
export default {
  name: 'titration-drip', category: 'lab-fx',
  desc: 'Damla damlatan büret: mezürlü cam tüp, musluk ve uçtan düşen damla',
  tags: ['büret', 'damla', 'damlama', 'titrasyon', 'deney', 'burette', 'drop', 'drip', 'titration', 'lab'],
  box: [-55, -15, 55, 185],
  bleed: 25,
  anchor: 'üst merkez (0,0) — kıskaç/üst uç',
  points: { tip: [0, 128], valve: [34, 92], scale: [0, 40] },
  params: {
    drop: { type: 'time', default: null, desc: 'damla düşme anı (damla kopar, düşer, halka olur)' },
    color: { type: 'color', default: 'cyan', desc: 'sıvı rengi' },
  },
  draw(ctx, t, p, k) {
    const d = p.drop == null ? -1 : t - p.drop;
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    // ölçü: tüp x∈[-20,20], üst y=0, alt y=100, uç 100→128
    const tw = 20, topY = 0, botY = 100, tipY = 128;

    // cam tüp gövde (sıvı içi ayrı çizilir)
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-tw - 5, topY - 4, (tw + 5) * 2, botY - topY + 10, 10); ctx.fill();
    ctx.fillStyle = k.rgba(acc, 0.62);
    ctx.beginPath(); k.rrect(-tw + 4, topY + 8, (tw - 4) * 2, botY - topY - 12, 6); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 5;
    ctx.beginPath(); k.rrect(-tw, topY, tw * 2, botY - topY, 8); ctx.stroke();

    // mezür çizgileri (sol üst premium parlamayı bozmayacak, ince)
    ctx.strokeStyle = k.rgba('ink', 0.45);
    ctx.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
      const y = topY + 20 + i * 12;
      const len = i % 2 === 0 ? 12 : 7;
      ctx.beginPath(); ctx.moveTo(-tw, y); ctx.lineTo(-tw + len, y); ctx.stroke();
    }
    // üst kapak
    ctx.fillStyle = k.rgba('dim', 0.9);
    ctx.beginPath(); k.rrect(-tw - 7, topY - 12, (tw + 7) * 2, 16, 8); ctx.fill();

    // cam parlaması sol üst
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-11, 34, 5, 26, 0.15, 0, k.TAU); ctx.fill();

    // sağ alt gölge
    ctx.strokeStyle = k.rgba('ink', 0.12);
    ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(tw - 3, botY - 24); ctx.lineTo(tw - 3, botY - 3); ctx.stroke();

    // musluk — tüpün sağında yatay kol
    const vy = 88;
    ctx.strokeStyle = k.rgba('ink', 0.7);
    ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(0, vy); ctx.lineTo(30, vy); ctx.stroke();
    ctx.fillStyle = k.rgba('red', 0.95);
    ctx.beginPath(); k.rrect(24, vy - 9, 20, 18, 8); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 3;
    ctx.beginPath(); k.rrect(24, vy - 9, 20, 18, 8); ctx.stroke();
    // musluk üstü parlama
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(31, vy - 3, 4, 2.5, -0.3, 0, k.TAU); ctx.fill();

    // alt uç — daralan boru
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath();
    ctx.moveTo(-tw + 8, botY); ctx.lineTo(-6, tipY - 8);
    ctx.lineTo(6, tipY - 8); ctx.lineTo(tw - 8, botY);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.55);
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-tw + 8, botY); ctx.lineTo(-6, tipY - 8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(tw - 8, botY); ctx.lineTo(6, tipY - 8); ctx.stroke();

    // tomurcuk — uçta büyüyen damla (drop'tan önce ve sonra 4 sn döngülü idle)
    const idle = p.drop == null ? t : (d < 0 ? t : (d > 1.3 ? t - (p.drop + 1.3) + 0 : t));
    const cyc = (idle / 4 + 0.3) % 1;
    const growing = p.drop == null ? true : (d < 0 || d > 1.3);
    if (growing) {
      const g = k.prog(cyc, 0, 0.9);
      const br = 2 + 6 * g;
      ctx.fillStyle = k.rgba(acc, 0.95);
      ctx.beginPath(); ctx.arc(0, tipY - 4, br, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55);
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(0, tipY - 4, br, 0, k.TAU); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.beginPath(); ctx.arc(-br * 0.3, tipY - 4 - br * 0.35, br * 0.22, 0, k.TAU); ctx.fill();
    }

    // düşen damla — drop anında kopar (0.65 sn'de yere iner)
    if (d >= 0 && d < 0.65) {
      const g = k.prog(d, 0, 0.65);
      const yy = tipY + 6 + g * g * 46;
      const dr = 5.5 * (1 - g * 0.25);
      ctx.fillStyle = k.rgba(acc, 0.95);
      ctx.beginPath();
      ctx.ellipse(0, yy, dr, dr * 1.35, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.beginPath(); ctx.ellipse(-dr * 0.3, yy - dr * 0.4, dr * 0.25, dr * 0.18, 0, 0, k.TAU); ctx.fill();
      // kuyruk damlası
      if (g < 0.3) {
        ctx.fillStyle = k.rgba(acc, 0.7 * (1 - g / 0.3));
        ctx.beginPath(); ctx.arc(0, tipY - 4, 4 * (1 - g / 0.3), 0, k.TAU); ctx.fill();
      }
    }

    // iniş halkası — damla yere değince genişleyen halka (0.5 sn)
    if (d >= 0.55 && d < 1.15) {
      const g = k.prog(d, 0.55, 1.15);
      ctx.strokeStyle = k.rgba(acc, 0.8 * (1 - g));
      ctx.lineWidth = 3 * (1 - g) + 1;
      ctx.beginPath(); ctx.ellipse(0, tipY + 52, 6 + g * 26, 2.5 + g * 5, 0, 0, k.TAU); ctx.stroke();
      // sıçrama tanecikleri
      for (let i = 0; i < 5; i++) {
        const a = -Math.PI / 2 + (k.hash(i * 31 + 3) - 0.5) * 2;
        const dist = g * (10 + k.hash(i * 17 + 5) * 16);
        const px = Math.cos(a) * dist, py = tipY + 52 - Math.abs(Math.sin(a)) * dist * 0.5;
        ctx.fillStyle = k.rgba(acc, 0.9 * (1 - g));
        ctx.beginPath(); ctx.arc(px, py, 2.4 * (1 - g) + 0.8, 0, k.TAU); ctx.fill();
      }
    }

    ctx.restore();
  },
};

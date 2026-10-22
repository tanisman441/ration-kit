// circus-fx/juggling — 3 topu havada döngüsel yörüngede çeviren jonglör.
// throw anında toplar daha yükseğe fırlar (0.6 sn) ve hız çizgileri çıkar;
// boşta toplar sürekli elips yörüngede döner, jonglör nefes alır.
// NOT: canvas y-aşağıdır; (0,0) jonglörün ayaklarıdır.
export default {
  name: 'juggling', category: 'circus-fx',
  desc: 'Top çeviren jonglör: 3 top elips yörüngede döner, throw anında yükselir',
  tags: ['jonglör', 'top çevirme', 'sirk', 'juggler', 'juggling', 'balls', 'circus', 'atış'],
  box: [-180, -480, 180, 45],
  bleed: 25,
  anchor: 'jonglörün ayakları (0,0)',
  points: { handL: [-70, -250], handR: [70, -250], head: [0, -225], apex: [0, -450] },
  params: {
    throw: { type: 'time', default: null, desc: 'atış anı: toplar 0.6 sn yükselir, hız çizgileri' },
    color: { type: 'color', default: 'accent', desc: 'jonglör kostümü + top rengi' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    // zemin gölgesi
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(0, 6, 70, 12, 0, 0, k.TAU); ctx.fill();

    // nefese göre gövde salınımı + göz kırpma
    const br = Math.sin(t * k.TAU / 2.4) * 2;
    const blink = (t % 4.2) < 0.12;

    // bacaklar (ayaklarda)
    ctx.strokeStyle = k.rgba(acc, 0.85); ctx.lineWidth = 15;
    ctx.beginPath(); ctx.moveTo(-14, -105); ctx.lineTo(-18, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(14, -105); ctx.lineTo(18, 0); ctx.stroke();
    // ayaklar
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.fillRect(-34, -8, 34, 12); ctx.fillRect(2, -8, 34, 12);

    // gövde (rrect)
    ctx.fillStyle = k.rgba(acc, 0.9);
    k.rrect(-26, -198 + br * 0.4, 52, 100, 16); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    k.rrect(-26, -198 + br * 0.4, 52, 100, 16); ctx.stroke();
    // premium parlama: sol üst beyaz elips
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-12, -182, 12, 22, -0.4, 0, k.TAU); ctx.fill();

    // kollar: yukarı-açık, eller ±70,-250
    ctx.strokeStyle = k.rgba(acc, 0.9); ctx.lineWidth = 14;
    ctx.beginPath(); ctx.moveTo(-20, -170 + br * 0.4); ctx.quadraticCurveTo(-55, -200, -70, -250); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(20, -170 + br * 0.4); ctx.quadraticCurveTo(55, -200, 70, -250); ctx.stroke();

    // kafa
    const hy = -228 + br * 0.6;
    ctx.fillStyle = k.rgba('dim', 0.95);
    ctx.beginPath(); ctx.arc(0, hy, 31, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(0, hy, 31, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-11, hy - 11, 10, 7, -0.5, 0, k.TAU); ctx.fill();
    // şapka (jonglör şapkası)
    ctx.fillStyle = k.rgba(acc, 0.95);
    ctx.beginPath(); ctx.ellipse(0, hy - 30, 26, 9, 0, 0, k.TAU); ctx.fill();
    k.rrect(-16, hy - 62, 32, 34, 6); ctx.fill();
    // yüz: mutlu
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 3;
    if (blink) {
      ctx.beginPath(); ctx.moveTo(-13, hy - 6); ctx.lineTo(-5, hy - 6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(5, hy - 6); ctx.lineTo(13, hy - 6); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.arc(-9, hy - 6, 3.4, 0, k.TAU); ctx.stroke();
      ctx.beginPath(); ctx.arc(9, hy - 6, 3.4, 0, k.TAU); ctx.stroke();
    }
    ctx.beginPath(); ctx.arc(0, hy + 6, 10, 0.3, Math.PI - 0.3); ctx.stroke();

    // toplar: elips yörünge, 3 top 120° faz farkı
    const td = p.throw == null ? -1 : t - p.throw;
    const boosting = td >= 0 && td < 0.6;
    const cyc = 1.8, RX = 115, RY = 72, CY = -308;
    for (let i = 0; i < 3; i++) {
      const a = t * k.TAU / cyc + i * k.TAU / 3;
      let x = RX * Math.cos(a);
      let y = CY + RY * Math.sin(a);
      // throw: toplar sırayla yükselir
      if (boosting) {
        const lag = i * 0.1;
        const bd = k.clamp((td - lag) / 0.45, 0, 1);
        const lift = Math.sin(bd * Math.PI) * 70;
        y -= lift;
      }
      const r = 15;
      // hız çizgisi (throw anında)
      if (boosting) {
        ctx.strokeStyle = k.rgba(acc, 0.5 * (1 - td / 0.6)); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(x, y + r + 4); ctx.lineTo(x, y + r + 26); ctx.stroke();
      }
      ctx.fillStyle = k.rgba(acc, 0.95);
      ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(x - 5, y - 6, 5, 3.5, -0.5, 0, k.TAU); ctx.fill();
    }

    ctx.restore();
  },
};

// kitchen-fx-2/soda-fizz — köpüren gazoz bardağı: kabarcıklar sürekli yükselir; shake anında çalkalanıp taşar.
// NOT: canvas y-aşağıdır; bardak tabanı y≈95, kabarcıklar ve köpük yukarı (+y'nin tersine) hareket eder.
export default {
  name: 'soda-fizz', category: 'kitchen-fx-2',
  desc: 'Köpüren gazoz bardağı: kabarcıklar sürekli yükselir; shake anında bardak çalkalanır ve köpük taşar',
  tags: ['gazoz', 'soda', 'köpük', 'bardak', 'kabarcık', 'fizz', 'soda glass', 'bubbles', 'foam', 'carbonated'],
  box: [-100, -195, 100, 125],
  bleed: 50,
  anchor: 'bardak tabanının merkezi (0,95)',
  points: { glass: [0, 85], soda: [0, -20], foam: [0, -70], overflow: [72, 40] },
  params: {
    shake: { type: 'time', default: null, desc: 'çalkalanıp taşma anı (1.0 sn): bardak sallanır, köpük fırlar ve kenardan akar' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const d = p.shake == null ? -1 : t - p.shake;
    const shaking = d >= 0 && d <= 1.0;
    const g = shaking ? k.prog(d, 0, 1.0) : -1;

    // shake sarsıntısı (tüm bardak)
    const shk = shaking ? Math.sin(d * 44) * 8 * (1 - g * 0.5) : 0;
    ctx.save(); ctx.translate(shk, 0);

    const glassPath = () => {
      ctx.beginPath();
      ctx.moveTo(-72, -72); ctx.lineTo(72, -72);
      ctx.lineTo(52, 95); ctx.lineTo(-52, 95); ctx.closePath();
    };

    // --- 1) iç dolgu (kırpılmış): gazoz + kabarcıklar
    ctx.save();
    glassPath(); ctx.clip();
    // gazoz gövdesi (yüzey dalgalı)
    const surfBase = -38 + (shaking ? Math.sin(d * 34) * 6 * (1 - g) : Math.sin(t * 3) * 2.5);
    ctx.fillStyle = k.rgba('cyan', 1);
    ctx.beginPath();
    ctx.moveTo(-80, 100); ctx.lineTo(-80, surfBase);
    for (let x = -80; x <= 80; x += 8) ctx.lineTo(x, surfBase + Math.sin(x * 0.2 + t * 6) * 3);
    ctx.lineTo(80, 100); ctx.closePath(); ctx.fill();
    // gazoz iç parlaması (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.14)';
    ctx.beginPath(); ctx.ellipse(-40, 20, 12, 44, 0.2, 0, k.TAU); ctx.fill();
    // sürekli yükselen kabarcıklar (12 adet, 2.2 sn döngü)
    for (let i = 0; i < 12; i++) {
      const cyc = 2.2, ph = ((t * 1.4 + k.hash(i * 7 + 3) * cyc) % cyc) / cyc;
      const bx = -56 + k.hash(i * 7 + 5) * 112;
      const br = 2.5 + k.hash(i * 7 + 9) * 4;
      const speedUp = shaking ? 1.8 : 1;
      const by2 = 88 - (((t * 1.4 * speedUp) + k.hash(i * 7 + 3) * cyc) % cyc) / cyc * 126;
      ctx.fillStyle = k.rgba('bg', 0.55 * (1 - ph * 0.4));
      ctx.beginPath(); ctx.arc(bx, by2, br, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.beginPath(); ctx.arc(bx - br * 0.3, by2 - br * 0.3, br * 0.4, 0, k.TAU); ctx.fill();
    }
    // bardak dibi kalınlığı
    ctx.fillStyle = k.rgba('bg', 0.3);
    k.rrect(-56, 76, 112, 20, 8); ctx.fill();
    ctx.restore();

    // --- 2) cam dış hat + gölge
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.save(); ctx.translate(6, 6); glassPath(); ctx.fill(); ctx.restore();
    ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 7;
    glassPath(); ctx.stroke();

    // --- 3) köpük tacı (beyaz kabarcıklar, hafif bob)
    const foamBlobs = [[-40, -62, 15], [-14, -72, 18], [14, -68, 16], [40, -60, 14], [0, -56, 13]];
    for (let i = 0; i < foamBlobs.length; i++) {
      const [fx, fy, fr] = foamBlobs[i];
      const bob = shaking ? Math.sin(d * 40 + i) * 5 * (1 - g) : Math.sin(t * 2.8 + i * 1.9) * 2.5;
      ctx.fillStyle = k.rgba('bg', 0.15);
      ctx.beginPath(); ctx.arc(fx + 6, fy + bob + 6, fr, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.beginPath(); ctx.arc(fx, fy + bob, fr, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('ink', 0.55); ctx.lineWidth = 3.5; ctx.stroke();
    }
    // yüzeyde cızırtı çizgileri (idle)
    if (!shaking) {
      for (let i = 0; i < 5; i++) {
        const fx = -50 + i * 25;
        const flick = 0.3 + 0.7 * Math.abs(k.noise1(t * 8 + i * 13));
        ctx.strokeStyle = k.rgba('ink', 0.6 * flick);
        ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.moveTo(fx, -78); ctx.lineTo(fx, -88 - flick * 8); ctx.stroke();
      }
    }
    ctx.restore();

    // --- 4) shake olayı: köpük fışkırması + kenardan taşma (1.0 sn)
    if (shaking) {
      // fışkıran köpükler (0–0.6 parabola)
      for (let i = 0; i < 7; i++) {
        const eg = k.prog(d - k.hash(i * 5 + 1) * 0.15, 0, 0.55);
        if (eg > 0) {
          const ang = -Math.PI / 2 + (k.hash(i * 5 + 3) - 0.5) * 1.6;
          const dist = (90 + k.hash(i * 5 + 5) * 80) * k.E.outCubic(eg);
          const fall = 200 * Math.pow(eg, 2);
          const px = shk + Math.cos(ang) * dist;
          const py = -60 + Math.sin(ang) * dist + fall * 0.5;
          ctx.fillStyle = `rgba(255,255,255,${0.92 * (1 - eg * 0.6)})`;
          ctx.beginPath(); ctx.arc(px, py, 8 + k.hash(i * 5 + 7) * 7, 0, k.TAU); ctx.fill();
          ctx.strokeStyle = k.rgba('ink', 0.5 * (1 - eg * 0.5)); ctx.lineWidth = 3; ctx.stroke();
          // gazoz damlacıkları
          if (i % 2 === 0) {
            ctx.fillStyle = k.rgba('cyan', 0.85 * (1 - eg));
            ctx.beginPath(); ctx.arc(px + 12, py + 18, 4, 0, k.TAU); ctx.fill();
          }
        }
      }
      // sağ kenardan taşan köpük akıntısı (0.3–1.0)
      const og = k.prog(d, 0.3, 1.0);
      if (og > 0) {
        const dripLen = 74 * k.E.outCubic(og);
        ctx.fillStyle = 'rgba(255,255,255,0.92)';
        k.rrect(58, -60, 15, dripLen, 7); ctx.fill();
        ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 3; ctx.stroke();
        ctx.fillStyle = k.rgba('cyan', 0.8);
        ctx.beginPath(); ctx.arc(65, -60 + dripLen + 8, 7, 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore();
  },
};

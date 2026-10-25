// tailor-fx/button-sew — iğne düğmeyi döngüsel diker; 2.4 sn'lik döngüde delikten geçer, iplik döngüsü oluşur. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) düğme merkezi; iğne düğmenin üstünde dolanır.
export default {
  name: 'button-sew', category: 'tailor-fx',
  desc: 'Dört delikli düğme; iğne döngüsel olarak deliklerden geçer, iplik çapraz dikiş atar',
  tags: ['terzi', 'düğme', 'dikiş', 'dikmek', 'iğne', 'iplik', 'tailor', 'button', 'sew', 'sewing', 'stitch', 'needle'],
  box: [-120, -110, 120, 110],
  bleed: 40,
  anchor: 'düğme merkezi (0,0); iğne üstte dolanır',
  points: { button: [0, 0], needle: [0, -70] },
  params: {
    color: { type: 'color', default: 'ink' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const CYCLE = 2.4;
    const ph = (t % CYCLE) / CYCLE; // 0..1 döngü fazı
    const breathe = 1 + Math.sin(t * k.TAU / 2.4) * 0.012;

    // iğne konumu: 4 faz — sol üst delikten dal, alttan çık, sağ alt delikten yukarı, üstten yay çizerek geri dön
    let nx, ny, nang;
    if (ph < 0.3) { // sol üst deliğe dalış
      const s = ph / 0.3;
      nx = -18; ny = k.lerp(-95, -14, s * s); nang = 0.12;
    } else if (ph < 0.5) { // düğme altında (gizli), sağ alta geçiş
      const s = (ph - 0.3) / 0.2;
      nx = k.lerp(-18, 18, s); ny = k.lerp(-14, 14, s); nang = 0.5;
    } else if (ph < 0.7) { // sağ alt delikten çıkış
      const s = (ph - 0.5) / 0.2;
      nx = 18; ny = k.lerp(14, -80, s * (2 - s)); nang = -0.15;
    } else { // üstten yay çizerek sol üste dönüş
      const s = (ph - 0.7) / 0.3;
      const a = Math.PI * s;
      nx = k.lerp(18, -18, s);
      ny = -80 - Math.sin(a) * 22;
      nang = k.lerp(-0.15, 0.12, s) - Math.cos(a) * 0.25;
    }

    // iplik: iğne kuyruğundan son deliğe uzanan gevşek yay (faz ilerledikçe gerilir)
    const tailX = nx - Math.sin(nang) * 46, tailY = ny - Math.cos(nang) * 46;
    const slack = ph < 0.5 ? 26 : 26 - (ph - 0.5) / 0.5 * 18;
    ctx.strokeStyle = k.rgba('accent'); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(tailX, tailY);
    ctx.quadraticCurveTo((tailX - 18) / 2, Math.min(tailY, -18) - slack, -18, -18); ctx.stroke();

    // iğne (düğmenin üstünde çizilir; alt fazdayken düğme iğneyi kapatır)
    const needleUnder = ph >= 0.3 && ph < 0.5;
    const drawNeedle = () => {
      ctx.save();
      ctx.translate(nx, ny);
      ctx.rotate(nang);
      ctx.strokeStyle = line; ctx.lineWidth = 10;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -52); ctx.stroke();
      ctx.strokeStyle = k.rgba('panel2'); ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -50); ctx.stroke();
      // uç
      ctx.fillStyle = k.rgba('panel2');
      ctx.beginPath(); ctx.moveTo(-3, 0); ctx.lineTo(3, 0); ctx.lineTo(0, 10); ctx.closePath(); ctx.fill();
      // göz
      ctx.fillStyle = k.rgba('bg', 0.8);
      ctx.beginPath(); ctx.ellipse(0, -44, 2.5, 4, 0, 0, k.TAU); ctx.fill();
      ctx.restore();
    };
    if (!needleUnder) drawNeedle();

    // düğme: nefes alan gövde
    ctx.save();
    ctx.translate(0, 0); ctx.scale(breathe, breathe);
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); ctx.arc(0, 0, 56, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.arc(0, 0, 52, 0, k.TAU); ctx.fill();
    // dış hat
    ctx.strokeStyle = line; ctx.lineWidth = LW;
    ctx.beginPath(); ctx.arc(0, 0, 52, 0, k.TAU); ctx.stroke();
    // kenar oluğu
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, 42, 0, k.TAU); ctx.stroke();
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-26, -30, 16, 7, -0.5, 0, k.TAU); ctx.fill();
    // delikler
    const holes = [[-18, -18], [18, -18], [-18, 18], [18, 18]];
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = k.rgba('bg', 0.85);
      ctx.beginPath(); ctx.arc(holes[i][0], holes[i][1], 7, 0, k.TAU); ctx.fill();
    }
    // çapraz dikiş iplikleri (fazla nabız gibi belirginleşir)
    const stitchA = 0.45 + 0.3 * Math.sin(t * k.TAU / CYCLE);
    ctx.strokeStyle = k.rgba('accent', stitchA); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-18, -18); ctx.lineTo(18, 18); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(18, -18); ctx.lineTo(-18, 18); ctx.stroke();
    ctx.restore();

    // alttaki iğne ucunu düğme kenarında göster (alt fazda küçük ipucu)
    if (needleUnder) {
      ctx.fillStyle = k.rgba('panel2');
      ctx.beginPath(); ctx.moveTo(nx - 3, ny); ctx.lineTo(nx + 3, ny); ctx.lineTo(nx, ny + 10); ctx.closePath(); ctx.fill();
    }

    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(18, 56, 40, 6, 0, 0, k.TAU); ctx.fill();
  },
};

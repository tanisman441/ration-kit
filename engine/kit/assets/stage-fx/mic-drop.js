// stage-fx/mic-drop — standdaki mikrofonun düşüşü.
// at anında mikrofon standdan kurtulur: 0.45 sn'de yere çakılır, iki kez
// seker (0.75 sn'de küçük ikinci sekme), 0.9 sn'de yere yatar. Her çarpışmada
// şok dalgası + toz bulutu. Boşta stand hafifçe sallanır.
// NOT: canvas y-aşağıdır; (0,0) zeminin merkezidir.
export default {
  name: 'mic-drop', category: 'stage-fx',
  desc: 'Mikrofon standdan düşer, iki kez sekip yere yatar; çarpışmalarda şok dalgası',
  tags: ['mikrofon', 'düşme', 'sahne', 'konser', 'mic', 'drop', 'microphone', 'stage', 'concert'],
  box: [-170, -300, 170, 40],
  bleed: 45,
  anchor: 'zemin merkezi (0,0)',
  points: { head: [44, -22], stand: [-52, -270], impact: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'düşüş anı (0.45 sn çarpma, 0.9 sn yatma)' },
    color: { type: 'color', default: 'accent', desc: 'mikrofon halka + detay rengi' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    const d = p.at == null ? -1 : t - p.at;
    const falling = d >= 0;

    // ---- zemin gölgesi ----
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(0, 8, 110, 12, 0, 0, k.TAU); ctx.fill();

    // ---- mikrofon standı (mikrofon düşünce hafifçe sallanır) ----
    const wob = falling ? Math.sin((d) * 14) * Math.exp(-d * 3) * 10 : Math.sin(t * k.TAU / 4) * 2;
    ctx.save();
    ctx.translate(-52, 0); ctx.rotate(wob * 0.002 - 0.02 + (falling ? wob * 0.0004 : 0));
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -236); ctx.stroke();
    ctx.lineWidth = 7;
    for (const fa of [-0.5, 0, 0.5]) {        // tripod ayaklar
      ctx.beginPath(); ctx.moveTo(0, -6);
      ctx.lineTo(Math.sin(fa) * 46, -6 + Math.cos(fa) * 20); ctx.stroke();
    }
    // stand başlığı (mikrofonun oturduğu klips)
    ctx.fillStyle = k.rgba('dim', 0.95);
    ctx.beginPath(); ctx.arc(0, -244, 12, 0, k.TAU); ctx.fill();
    ctx.restore();

    // ---- mikrofon konumu + dönüşü ----
    // standdayken: (-52,-258), hafif eğik. Yerde: (8,-16), yatay.
    let mx = -52, my = -258, rot = -0.28;
    if (falling) {
      const e1 = k.prog(d, 0, 0.45);                       // düşüş
      const fallE = e1 * e1;                            // hızlanarak
      mx = k.lerp(-52, 8, fallE);
      my = k.lerp(-258, -30, fallE);
      rot = k.lerp(-0.28, 1.30, k.prog(d, 0, 0.7));
      if (d > 0.45 && d <= 0.75) {                      // birinci sekme
        const b = Math.sin((d - 0.45) / 0.3 * Math.PI);
        my -= b * 52; rot -= b * 0.18;
      } else if (d > 0.75 && d <= 0.95) {               // ikinci küçük sekme
        const b = Math.sin((d - 0.75) / 0.2 * Math.PI);
        my -= b * 18; rot -= b * 0.08;
      }
      if (d > 0.95) { my = -16; rot = 1.35; }           // son: yerde yatık
    } else {
      rot += Math.sin(t * k.TAU / 4) * 0.03;            // boşta hafif salınım
    }

    // ---- çarpışma efektleri ----
    for (const ti of [0.45, 0.78]) {
      if (!falling || d < ti) continue;
      const ee = (d - ti) / 0.35;
      if (ee > 1) continue;
      // şok dalgası halkası
      ctx.strokeStyle = k.rgba('dim', (1 - ee) * 0.75);
      ctx.lineWidth = 5 * (1 - ee) + 1;
      ctx.beginPath();
      ctx.ellipse(8, 2, 24 + ee * 95, 8 + ee * 22, 0, 0, k.TAU); ctx.stroke();
      // toz bulutları
      for (let i = 0; i < 4; i++) {
        const hx = k.hash(ti * 10 + i);
        const px2 = 8 + (hx - 0.5) * 160 * ee;
        const py2 = -6 - ee * (30 + hx * 40);
        ctx.fillStyle = k.rgba('dim', (1 - ee) * 0.5);
        ctx.beginPath(); ctx.arc(px2, py2, 6 + ee * 14, 0, k.TAU); ctx.fill();
      }
    }

    // ---- mikrofon gövdesi ----
    ctx.save();
    ctx.translate(mx, my); ctx.rotate(rot);
    // sap
    ctx.fillStyle = k.rgba('dim', 0.95);
    k.rrect(-12, -14, 24, 92, 10); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    k.rrect(-12, -14, 24, 92, 10); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-5, 20, 4.5, 26, -0.2, 0, k.TAU); ctx.fill();
    // vurgu halka
    ctx.fillStyle = k.rgba(acc, 0.9);
    ctx.fillRect(-12, -22, 24, 10);
    // kafa (ızgara küre)
    ctx.fillStyle = k.rgba('panel2', 0.95);
    ctx.beginPath(); ctx.arc(0, -46, 30, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(0, -46, 30, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-10, -56, 9, 6.5, -0.5, 0, k.TAU); ctx.fill();
    // ızgara çizgileri
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 2.5;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath(); ctx.arc(0, -46, 30, -0.5 + i * 0.28, 0.5 + i * 0.28); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-26, -46 + i * 10); ctx.lineTo(26, -46 + i * 10); ctx.stroke();
    }
    ctx.restore();

    ctx.restore();
  },
};

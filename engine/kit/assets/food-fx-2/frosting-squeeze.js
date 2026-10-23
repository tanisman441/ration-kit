// food-fx-2/frosting-squeeze — krema torbası: idle'da hafif sallanır, arada damla düşer; squeeze anında torba sıkışır, spiral krema büyür.
// NOT: canvas y-aşağıdır; torba üstte (y≈-160..-60), cupcake altta (y≈50..120). Krema aşağı (artı y yönüne) akar.
export default {
  name: 'frosting-squeeze', category: 'food-fx-2',
  desc: 'Krema sıkma: idle\'da sallanan torbadan damla düşer; squeeze anında torba sıkışır, cupcake üstünde spiral krema büyür',
  tags: ['krema', 'sıkma torbası', 'cupcake', 'pasta süsleme', 'spiral', 'frosting', 'piping bag', 'cupcake', 'cream swirl', 'baking'],
  box: [-120, -195, 120, 150],
  bleed: 40,
  anchor: 'tabak merkezi (0,118)',
  points: { nozzle: [0, -62], swirl: [0, 30], cupcake: [0, 85] },
  params: {
    squeeze: { type: 'time', default: null, desc: 'sıkma anı (1.2 sn): torba sıkışır, krema spiral halinde büyür' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const d = p.squeeze == null ? -1 : t - p.squeeze;
    const squeezing = d >= 0 && d <= 1.2;
    const g = squeezing ? k.prog(d, 0, 1.2) : (d > 1.2 ? 1 : 0);

    // --- 1) tabak + cupcake
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.beginPath(); ctx.ellipse(6, 130, 96, 20, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath(); ctx.ellipse(0, 124, 96, 20, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 6; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-56, 118, 30, 6, -0.12, 0, k.TAU); ctx.fill();
    // cupcake kabı (trapez)
    const cupPath = () => {
      ctx.beginPath();
      ctx.moveTo(-52, 66); ctx.lineTo(52, 66);
      ctx.lineTo(38, 116); ctx.lineTo(-38, 116); ctx.closePath();
    };
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.save(); ctx.translate(6, 6); cupPath(); ctx.fill(); ctx.restore();
    ctx.fillStyle = k.rgba('panel2', 1);
    cupPath(); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 6; ctx.stroke();
    // kap dikey çizgileri (ink detay)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 4;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath(); ctx.moveTo(i * 19, 70); ctx.lineTo(i * 15, 112); ctx.stroke();
    }
    // cupcake kek üstü
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.beginPath(); ctx.ellipse(0, 64, 54, 14, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 5; ctx.stroke();

    // --- 2) krema: taban katman her zaman, spiral katmanlar squeeze ile büyür
    const cream = (cx, cy, rx, ry, grow, gloss) => {
      if (grow <= 0.01) return;
      ctx.save(); ctx.translate(cx, cy); ctx.scale(Math.max(grow, 0.01), Math.max(grow, 0.01));
      ctx.fillStyle = k.rgba('bg', 0.15);
      ctx.beginPath(); ctx.ellipse(6 / Math.max(grow, 0.01), 6 / Math.max(grow, 0.01), rx, ry, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('yellow', 1);
      ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = 5; ctx.stroke();
      if (gloss) {
        ctx.fillStyle = 'rgba(255,255,255,0.16)';
        ctx.beginPath(); ctx.ellipse(-rx * 0.35, -ry * 0.35, rx * 0.4, ry * 0.32, -0.3, 0, k.TAU); ctx.fill();
      }
      ctx.restore();
    };
    // taban katman (her zaman var)
    cream(0, 52, 50, 15, 1, true);
    // spiral katmanlar (squeeze ilerledikçe)
    const e1 = k.E.outBack(k.clamp(g / 0.45, 0, 1));
    const e2 = k.E.outBack(k.clamp((g - 0.2) / 0.45, 0, 1));
    const e3 = k.E.outBack(k.clamp((g - 0.4) / 0.45, 0, 1));
    const e4 = k.E.outBack(k.clamp((g - 0.6) / 0.4, 0, 1));
    cream(0, 36, 38, 14, e1, true);
    cream(0, 22, 26, 12, e2, true);
    cream(0, 10, 15, 10, e3, false);
    if (e4 > 0.01) {
      ctx.save(); ctx.translate(0, 0); ctx.scale(1, 1);
      ctx.fillStyle = k.rgba('yellow', 1);
      ctx.beginPath(); ctx.arc(0, 0 - 0, 8 * e4, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = 4; ctx.stroke();
      // tepe sivri ucu
      ctx.beginPath();
      ctx.moveTo(-7 * e4, -2); ctx.quadraticCurveTo(2 * e4, -14 * e4, 7 * e4, -2);
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    // --- 3) krema torbası (sallanır + squeeze'de sıkışır)
    const sway = Math.sin(t * 1.3) * 0.035 + (squeezing ? Math.sin(d * 40) * 0.02 * (1 - g) : 0);
    ctx.save(); ctx.translate(0, -150); ctx.rotate(sway); ctx.translate(0, 150);
    // sıkışma: gövde genişler, kısalır
    const squash = squeezing ? Math.sin(Math.min(g * 1.15, 1) * Math.PI) : 0;
    ctx.save(); ctx.translate(0, -105); ctx.scale(1 + 0.22 * squash, 1 - 0.13 * squash); ctx.translate(0, 105);
    // torba gövdesi (koni)
    const bagPath = () => {
      ctx.beginPath();
      ctx.moveTo(-58, -118); ctx.lineTo(58, -118);
      ctx.quadraticCurveTo(30, -88, 15, -66);
      ctx.lineTo(-15, -66);
      ctx.quadraticCurveTo(-30, -88, -58, -118); ctx.closePath();
    };
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.save(); ctx.translate(6, 6); bagPath(); ctx.fill(); ctx.restore();
    ctx.fillStyle = k.rgba(p.color, 1);
    bagPath(); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 7; ctx.stroke();
    // üst büküm (torba ağzı)
    ctx.fillStyle = k.rgba('ink', 1);
    k.rrect(-24, -148, 48, 30, 10); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 5; ctx.stroke();
    ctx.strokeStyle = k.rgba('bg', 0.6); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-14, -140); ctx.lineTo(14, -140); ctx.stroke();
    // torba kat çizgileri (ink detay)
    ctx.strokeStyle = k.rgba('ink', 0.3); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-38, -112); ctx.lineTo(-18, -70); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(38, -112); ctx.lineTo(18, -70); ctx.stroke();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-34, -100, 10, 16, 0.25, 0, k.TAU); ctx.fill();
    ctx.restore();
    // duy (nozzle)
    ctx.fillStyle = k.rgba('bg', 0.15);
    k.rrect(-8, -60, 28, 16, 5); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 1);
    k.rrect(-14, -66, 28, 16, 5); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 5; ctx.stroke();
    ctx.restore();

    // --- 4) sıkma akışı: duy ile spiral arası krema şeridi (hafif dalgalı, alta doğru incelir)
    if (squeezing && d < 1.0) {
      const topY = 4 - e4 * 4;
      const wob = k.noise1(t * 9) * 5;
      const wTop = 8, wBot = 4;
      const streamPath = wScale => {
        ctx.beginPath();
        ctx.moveTo(-wTop * wScale + wob, -50);
        ctx.lineTo(wTop * wScale + wob, -50);
        ctx.lineTo(wBot * wScale + wob * 0.4, topY);
        ctx.lineTo(-wBot * wScale + wob * 0.4, topY);
        ctx.closePath();
      };
      streamPath(1.35); ctx.fillStyle = line; ctx.fill();
      streamPath(1); ctx.fillStyle = k.rgba('yellow', 1); ctx.fill();
      // duy ucunda şişen krema topu
      ctx.fillStyle = k.rgba('yellow', 1);
      ctx.beginPath(); ctx.arc(0, -50, 6 + Math.sin(Math.min(g * 3, 1) * Math.PI) * 4, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = 4; ctx.stroke();
    }

    // --- 5) idle damlası (döngülü): duyda büyür, düşer
    if (!squeezing && d < 0) {
      const cyc = 2.8, ph = (t % cyc) / cyc;
      if (ph < 0.45) {
        const ds = 2 + 5 * (ph / 0.45);
        ctx.fillStyle = k.rgba('yellow', 1);
        ctx.beginPath(); ctx.arc(0, -48 + ds * 0.4, ds, 0, k.TAU); ctx.fill();
        ctx.strokeStyle = line; ctx.lineWidth = 3.5; ctx.stroke();
      } else if (ph < 0.7) {
        const fp = (ph - 0.45) / 0.25;
        const dy = -44 + 96 * fp * fp;
        ctx.fillStyle = k.rgba('yellow', 1 - fp * 0.3);
        ctx.beginPath(); ctx.arc(0, dy, 4.5, 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore();
  },
};

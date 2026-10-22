// winter-fx/snowball-throw — eldivenli elden kar topu fırlatma: at anında geri sarım + savrulma,
// uçan top (parabolik) ve hedefte 0.6 sn'lik kar patlaması.
// NOT: canvas y-aşağıdır; fırlatma soldan sağa; (0,0) sahne merkezidir.
export default {
  name: 'snowball-throw', category: 'winter-fx',
  desc: 'Eldivenli el kar topu fırlatır: geri sarım, kol savrulması, parabolik uçuş ve hedefte kar bulutu patlaması',
  tags: ['kar topu', 'fırlatma', 'atış', 'kış', 'kar', 'snowball', 'throw', 'toss', 'winter', 'snow'],
  box: [-180, -120, 180, 120],
  bleed: 50,
  anchor: 'sahne merkezi (0,0); atış soldan sağa',
  points: { hand: [-105, 5], target: [130, -30], centre: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'atış anı (1.55 sn: geri sarım → savrulma → uçuş → patlama)' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const LW = 10;
    const snow = k.rgba(p.color), line = k.rgba('bg', 0.55), inkC = k.rgba('ink');
    const mitt = k.rgba('red'), coat = k.rgba('panel2');
    const d = p.at == null ? -1 : t - p.at;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const H0 = [-105, 5];                    // el dinlenme noktası
    const REL = [-58, -28];                  // topun bırakıldığı nokta
    const TGT = [130, -30];                  // hedef
    const disc = (x, y, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(x, y, r + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
    };

    // --- el konumu: idle sallanma / geri sarım / savrulma ---
    let hx = H0[0], hy = H0[1], ballInHand = true, swing = 0;
    if (d < 0) {
      hx = H0[0] + Math.sin(t * 1.8) * 4; hy = H0[1] + Math.sin(t * 2.3) * 3;
    } else if (d < 0.25) {
      const w = k.prog(d, 0, 0.25);          // geri sarım
      hx = H0[0] - 38 * w; hy = H0[1] + 20 * w; swing = -w * 0.5;
    } else if (d < 0.55) {
      const s = k.E.outCubic(k.prog(d, 0.25, 0.55));  // öne savrulma
      hx = H0[0] - 38 + 62 * s; hy = H0[1] + 20 - 48 * s; swing = -0.5 + 1.4 * s;
      ballInHand = d < 0.42;                 // 0.42'de top bırakılır
    } else if (d < 0.95) {
      hx = H0[0] + 24; hy = H0[1] - 28; swing = 0.9 * (1 - k.prog(d, 0.55, 0.95));
      ballInHand = false;
    } else {
      hx = H0[0] + Math.sin(t * 1.8) * 4; hy = H0[1] + Math.sin(t * 2.3) * 3;
      ballInHand = false;
    }

    // --- kol (kalın çizgi) + mont kolu ---
    const shX = -176, shY = 62;              // omuz
    ctx.strokeStyle = line; ctx.lineWidth = 30 + LW;
    ctx.beginPath(); ctx.moveTo(shX, shY); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.strokeStyle = coat; ctx.lineWidth = 30;
    ctx.beginPath(); ctx.moveTo(shX, shY); ctx.lineTo(hx, hy); ctx.stroke();
    // mont manşeti
    ctx.strokeStyle = line; ctx.lineWidth = 36;
    ctx.beginPath(); ctx.moveTo(shX + (hx - shX) * 0.72, shY + (hy - shY) * 0.72); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.strokeStyle = coat; ctx.lineWidth = 30;
    ctx.beginPath(); ctx.moveTo(shX + (hx - shX) * 0.72, shY + (hy - shY) * 0.72); ctx.lineTo(hx, hy); ctx.stroke();

    // --- eldivenli el ---
    disc(hx, hy, 17, mitt);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(hx - 6, hy - 7, 6, 4, -0.5, 0, k.TAU); ctx.fill();

    // --- eldeki top ---
    if (ballInHand) {
      disc(hx + 4, hy - 22, 14, snow);
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(hx - 1, hy - 28, 5, 3.5, -0.5, 0, k.TAU); ctx.fill();
    }

    // --- uçan top (0.55–0.95: parabolik) ---
    if (d >= 0.42 && d < 0.95) {
      const pr = k.clamp((d - 0.42) / 0.53, 0, 1);
      const bx = REL[0] + (TGT[0] - REL[0]) * pr;
      const by = REL[1] + (TGT[1] - REL[1]) * pr - 70 * Math.sin(pr * Math.PI);
      disc(bx, by, 14, snow);
      // uçuş çizgisi
      ctx.strokeStyle = inkC; ctx.globalAlpha = 0.30 * (1 - pr * 0.5); ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.moveTo(bx - 46, by + 12); ctx.lineTo(bx - 14, by + 4); ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // --- hedef patlaması (0.95'ten itibaren 0.6 sn) ---
    if (d >= 0.95 && d < 1.55) {
      const bd = d - 0.95, bpr = k.clamp(bd / 0.6, 0, 1);
      // genişleyen halka
      ctx.strokeStyle = k.rgba('ink', 0.6 * (1 - bpr)); ctx.lineWidth = 5 * (1 - bpr) + 1;
      ctx.beginPath(); ctx.arc(TGT[0], TGT[1], 12 + bpr * 52, 0, k.TAU); ctx.stroke();
      // saçılan kar parçaları
      for (let i = 0; i < 12; i++) {
        const h = k.hash(i * 43 + 5), a = h * k.TAU + 0.4;
        const sp = 70 + 70 * k.hash(i * 19 + 2);
        const px = TGT[0] + Math.cos(a) * sp * bd, py = TGT[1] + Math.sin(a) * sp * bd + 50 * bd * bd;
        ctx.fillStyle = snow; ctx.globalAlpha = 0.9 * (1 - bpr);
        ctx.beginPath(); ctx.arc(px, py, (2.5 + 4 * h) * (1 - bpr * 0.4), 0, k.TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
      // kabaran kar bulutu
      for (let i = 0; i < 5; i++) {
        const h = k.hash(i * 71 + 13);
        const px = TGT[0] + (h - 0.5) * 70 * bpr, py = TGT[1] - 10 - h * 40 * bpr;
        ctx.fillStyle = k.rgba('ink', 0.35 * (1 - bpr));
        ctx.beginPath(); ctx.arc(px, py, 10 + 16 * bpr * h, 0, k.TAU); ctx.fill();
      }
    }

    ctx.restore();
  },
};

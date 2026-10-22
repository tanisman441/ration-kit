// robot-fx/mech-step — adım atan mekanik robot bacağı. Contract: engine/kit/ASSETS.md
export default {
  name: 'mech-step', category: 'robot-fx',
  desc: 'Adım atan mekanik robot bacağı: ayak kalkar, ileri uzanır, basar ve toz kaldırır',
  tags: ['robot bacağı', 'yürüme', 'adım', 'mech', 'robot leg', 'step', 'walk', 'mekanik', 'ayak', 'tozu'],
  box: [-160, -155, 160, 85],
  bleed: 42,
  anchor: 'kalça eklemi yakını (0,-110)',
  points: { hip: [-30, -110], foot: [40, 24] },
  params: {
    color: { type: 'color', default: 'dim' },
    step: { type: 'time', default: null, desc: 'adım anı: kalkış → ileri uzanma → basış (~0.9 sn)' },
  },
  draw(ctx, t, p, k) {
    const bw = 320, LW = Math.round(bw * 0.03);
    const line = k.rgba('bg', 0.55), bodyC = k.rgba(p.color);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.save();

    // ayak bileği konumu: dinlenme (40,24) → adımda ileri (110,24)
    const d = p.step == null ? -1 : t - p.step;
    const AX0 = 40, AY0 = 24, AX1 = 110;
    let ax, ay;
    if (d < 0) {
      ax = AX0 + k.noise1(t * 0.8) * 1.5;      // boştayken hafif salınım
      ay = AY0 + k.noise1(t * 0.8 + 5) * 1.5;
    } else {
      const lift = k.E.outCubic(k.clamp(d / 0.25, 0, 1)) * (1 - k.clamp((d - 0.15) / 0.5, 0, 1));
      const fwd = k.E.inOutCubic(k.clamp((d - 0.15) / 0.5, 0, 1));
      const down = k.E.inOutCubic(k.clamp((d - 0.55) / 0.3, 0, 1));
      ax = k.lerp(AX0, AX1, fwd);
      ay = d > 0.85 ? AY0 : k.lerp(AY0 - 46 * lift, AY0, down);
    }
    // kalça sabit, diz iki kemikli çözülür (öne bükülür)
    const HX = -30, HY = -110, L1 = 92, L2 = 92;
    let dx = ax - HX, dy = ay - HY;
    let dist = Math.hypot(dx, dy);
    const maxD = L1 + L2 - 2;
    if (dist > maxD) { dx *= maxD / dist; dy *= maxD / dist; dist = maxD; }
    if (dist < 20) dist = 20;
    const a1 = Math.acos(k.clamp((L1 * L1 + dist * dist - L2 * L2) / (2 * L1 * dist), -1, 1));
    const base = Math.atan2(dy, dx);
    const kneeA = base - a1;                       // diz öne (+x) bükülür
    const kx = HX + Math.cos(kneeA) * L1, ky = HY + Math.sin(kneeA) * L1;

    // zemin çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.3); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-156, 52); ctx.lineTo(156, 52); ctx.stroke();

    // parçacık tozu (basıştan sonra ~0.7 sn)
    if (d >= 0.85 && d < 1.6) {
      const dd = d - 0.85;
      for (let i = 0; i < 8; i++) {
        const h1 = k.hash(i * 17 + 1), h2 = k.hash(i * 17 + 2);
        const px = AX1 - 14 + (h1 - 0.3) * 90 * k.E.outCubic(k.clamp(dd / 0.6, 0, 1));
        const py = 46 - h2 * 26 * k.E.outCubic(k.clamp(dd / 0.6, 0, 1));
        const r = 5 + dd * 22 * (0.6 + h1 * 0.6);
        ctx.fillStyle = k.rgba('dim', 0.5 * (1 - dd / 0.75));
        ctx.beginPath(); ctx.arc(px, py, r, 0, k.TAU); ctx.fill();
      }
      // basış şoku: genişleyen halka
      const rr = 10 + dd * 130;
      ctx.strokeStyle = k.rgba('yellow', 0.55 * (1 - dd / 0.4));
      ctx.lineWidth = 5;
      ctx.beginPath(); ctx.ellipse(AX1, 44, rr, rr * 0.32, 0, 0, k.TAU); ctx.stroke();
    }

    // bacak segmentleri: dış hat + dolgu
    const seg = (x1, y1, x2, y2, w) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = bodyC; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    seg(HX, HY, kx, ky, 22);                       // uyluk
    seg(kx, ky, ax, ay, 18);                       // kaval
    // ayak
    const fxx = ax - 8, fyy = ay - 6, fw = 56, fh = 18;
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(fxx + 6, fyy + 6, fw, fh, 7); ctx.fill();
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(fxx - LW / 2, fyy - LW / 2, fw + LW, fh + LW, 7 + LW / 2); ctx.fill();
    ctx.fillStyle = bodyC;
    ctx.beginPath(); k.rrect(fxx, fyy, fw, fh, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(fxx + fw * 0.3, fyy + 6, fw * 0.28, 5, 0, 0, k.TAU); ctx.fill();

    // eklemler + diz LED'i
    for (const [jx, jy, jr] of [[HX, HY, 13], [kx, ky, 12], [ax, ay, 10]]) {
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.arc(jx, jy, jr + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('panel2');
      ctx.beginPath(); ctx.arc(jx, jy, jr, 0, k.TAU); ctx.fill();
    }
    const blink = 0.5 + 0.5 * Math.sin(t * k.TAU / 1.1);
    k.glow(kx, ky, 13, 'yellow', 0.4 * blink);
    ctx.fillStyle = k.rgba('yellow', 0.4 + 0.6 * blink);
    ctx.beginPath(); ctx.arc(kx, ky, 4.5, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};

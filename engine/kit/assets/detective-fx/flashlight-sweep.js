// detective-fx/flashlight-sweep — el feneri karanlıkta ışınını döngüsel süpürür; ışık dairesi ipucunu ortaya çıkarır. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) fener başının (ışığın çıktığı nokta) merkezidir.
export default {
  name: 'flashlight-sweep', category: 'detective-fx',
  desc: 'Karanlık sahnede el feneri; ışın konisi yukarı aşağı süpürür, ışık dairesi duvardaki ayak izini ortaya çıkarır',
  tags: ['el feneri', 'ışık', 'karanlık', 'süpürme', 'dedektif', 'gece', 'flashlight', 'beam', 'dark', 'sweep', 'detective', 'night'],
  box: [-140, -110, 140, 110],
  bleed: 30,
  anchor: 'fener başı / ışık kaynağı (0,0); duvar sağda x ~110',
  points: { head: [0, 0], spot: [105, 0], handle: [-50, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
    speed: { type: 'number', default: 1, desc: 'süpürme hızı çarpanı (1 = ~3 sn bir gidiş-geliş)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const sp = p.speed || 1;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // karanlık duvar (sağ panel)
    blob(88, -95, 46, 190, 10, k.rgba('panel2'));
    // duvar dokusu: toz noktaları
    ctx.fillStyle = k.rgba('ink', 0.25);
    for (let i = 0; i < 10; i++) {
      ctx.beginPath(); ctx.arc(96 + k.hash(i * 2 + 1) * 30, -80 + k.hash(i * 2 + 2) * 160, 1.8, 0, k.TAU); ctx.fill();
    }

    // ışın açısı: döngüsel süpürme
    const ang = -0.38 * Math.sin(t * k.TAU / 3.0 * sp);
    const beamLen = 130;
    const tipX = beamLen * Math.cos(ang), tipY = beamLen * Math.sin(ang);

    // ışın konisi: dış yumuşak + iç parlak katman
    ctx.save();
    ctx.translate(0, 0);
    ctx.rotate(ang);
    ctx.fillStyle = k.rgba('yellow', 0.10);
    ctx.beginPath(); ctx.moveTo(0, -7); ctx.lineTo(beamLen, -34); ctx.lineTo(beamLen, 34); ctx.lineTo(0, 7); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('yellow', 0.16);
    ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(beamLen, -18); ctx.lineTo(beamLen, 18); ctx.lineTo(0, 4); ctx.closePath(); ctx.fill();
    ctx.restore();

    // ışık dairesi (duvar üzerinde): ışın ucunun duvara düştüğü yer
    const spotY = k.clamp(tipY, -88, 88);
    const spotX = 111;
    k.glow(spotX, spotY, 42, 'yellow', 0.5);
    ctx.fillStyle = k.rgba('yellow', 0.28);
    ctx.beginPath(); ctx.ellipse(spotX, spotY, 20, 26, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('yellow', 0.35);
    ctx.beginPath(); ctx.ellipse(spotX, spotY, 12, 16, 0, 0, k.TAU); ctx.fill();

    // ipucu: ayak izi — ışık dairesi yaklaştıkça belirir
    const clueY = 30;
    const dist = Math.abs(spotY - clueY);
    const vis = k.clamp(1 - dist / 55, 0, 1);
    if (vis > 0.03) {
      ctx.fillStyle = k.rgba('ink', 0.85 * vis);
      ctx.beginPath(); ctx.ellipse(spotX, clueY - 12, 6, 9, 0.15, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(spotX, clueY + 4, 4.5, 6.5, 0.15, 0, k.TAU); ctx.fill();
    }
    // ışık dairesi ipucunun üstündeyse küçük parıltı
    if (vis > 0.6) {
      ctx.strokeStyle = `rgba(255,255,255,${0.6 * vis})`; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(spotX - 8, clueY - 22); ctx.lineTo(spotX, clueY - 28); ctx.lineTo(spotX + 8, clueY - 22); ctx.stroke();
    }

    // ışındaki toz zerreleri (sürüklenen)
    for (let i = 0; i < 8; i++) {
      const cyc = (t * 0.25 * sp + k.hash(i) ) % 1;
      const lx = 20 + cyc * 95;
      const ly = Math.sin(ang) * lx + (k.hash(i + 30) - 0.5) * 26 * (lx / beamLen);
      ctx.fillStyle = k.rgba('yellow', 0.5 * (1 - cyc));
      ctx.beginPath(); ctx.arc(lx, ly, 1.8, 0, k.TAU); ctx.fill();
    }

    // fener gövdesi: lamba (0,0)'da, ışın oradan çıkar
    ctx.save();
    ctx.translate(-22, 0);
    ctx.rotate(ang * 0.6);
    // gövde
    blob(-52, -13, 66, 26, 12, k.rgba('panel2'));
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-38, -6, 12, 4, 0, 0, k.TAU); ctx.fill();
    // baş halkası
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(8, -17, 12, 34, 5); ctx.fill();
    ctx.fillStyle = body; ctx.beginPath(); k.rrect(10, -15, 9, 30, 4); ctx.fill();
    // lamba: sıcak parlayan mercek
    const lampPulse = 0.75 + 0.25 * Math.sin(t * k.TAU / 1.4);
    k.glow(24, 0, 16, 'yellow', 0.5 * lampPulse);
    ctx.fillStyle = k.rgba('yellow', 0.95);
    ctx.beginPath(); ctx.arc(22, 0, 7, 0, k.TAU); ctx.fill();
    // düğme (kırmızı vurgu)
    ctx.fillStyle = k.rgba('red', 0.9);
    ctx.beginPath(); ctx.arc(-18, -13, 5, 0, k.TAU); ctx.fill();
    ctx.restore();
    // sağ alt gölge (fener altı)
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(-68, 14, 60, 9, 4); ctx.fill();
  },
};

// coast-fx/beam-sweep — deniz feneri; ışın döngüsel olarak döner, gece gökyüzünde süpürür. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) fener kulesinin tabanı (kayalıkların üstü).
export default {
  name: 'beam-sweep', category: 'coast-fx',
  desc: 'Kayalık üstünde çizgili deniz feneri; sarı ışın döngüsel olarak döner, denizde ışık izi bırakır',
  tags: ['deniz feneri', 'fener', 'ışın', 'sahil', 'deniz', 'gece', 'lighthouse', 'beam', 'coast', 'sea', 'night', 'sweep'],
  box: [-150, -110, 150, 110],
  bleed: 40,
  anchor: 'fener kulesi tabanı (0,0); lamba y ~-78, kayalık tabanı y ~95',
  points: { lamp: [0, -78], beam: [110, -78], base: [0, 95] },
  params: {
    color: { type: 'color', default: 'dim' },
    speed: { type: 'number', default: 1, desc: 'ışın dönüş hızı çarpanı (1 = tam tur ~4 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // gökyüzü yıldızları (hafif yanıp söner)
    for (let i = 0; i < 8; i++) {
      const sx = -140 + k.hash(i) * 280, sy = -105 + k.hash(i + 20) * 55;
      const tw = 0.35 + 0.3 * Math.sin(t * 2 + k.hash(i + 40) * k.TAU);
      ctx.fillStyle = k.rgba('bg', Math.max(0.1, tw));
      ctx.beginPath(); ctx.arc(sx, sy, 2.2, 0, k.TAU); ctx.fill();
    }

    // deniz (alt bant) + dalga çizgileri
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-150, 62, 300, 48, 6); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.4); ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      const wy = 76 + i * 12;
      const ph = t * 1.2 + i * 1.7;
      ctx.beginPath();
      for (let x = -140; x <= 140; x += 14) {
        const yy = wy + Math.sin(x * 0.05 + ph) * 2.5;
        if (x === -140) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }

    // kayalıklar (fenerin oturduğu)
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-52, 48, 104, 40, 12); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.85); ctx.beginPath(); k.rrect(-47, 50, 94, 36, 10); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-30, 56, 14, 4, 0, 0, k.TAU); ctx.fill();

    // ışın: döngüsel dönüş (tam tur ~4 sn), çift yönlü (lamba iki yana da ışır)
    const ang = t * k.TAU / 4 * (p.speed || 1);
    const beamLen = 120;
    const drawBeam = (a) => {
      const dx = Math.cos(a), dy = Math.sin(a);
      const px = dx * beamLen, py = -78 + dy * beamLen;
      const perp = 0.16;
      // ışın uçta solar (box+bleed dışına alfa <40/255 çıkar, check temiz kalır)
      const wg = ctx.createLinearGradient(0, -78, px, py);
      wg.addColorStop(0, k.rgba('yellow', 0.22));
      wg.addColorStop(1, k.rgba('yellow', 0));
      ctx.fillStyle = wg;
      ctx.beginPath();
      ctx.moveTo(0, -78);
      ctx.lineTo(px + -dy * beamLen * perp, py + dx * beamLen * perp);
      ctx.lineTo(px - -dy * beamLen * perp, py - dx * beamLen * perp);
      ctx.closePath(); ctx.fill();
      const lg = ctx.createLinearGradient(0, -78, dx * 80, -78 + dy * 80);
      lg.addColorStop(0, k.rgba('yellow', 0.5));
      lg.addColorStop(1, k.rgba('yellow', 0));
      ctx.strokeStyle = lg; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(0, -78); ctx.lineTo(dx * 80, -78 + dy * 80); ctx.stroke();
    };
    drawBeam(ang);
    drawBeam(ang + Math.PI);
    // ışının denize düştüğü parlak iz (ışın aşağı bakarken belirir)
    const seaGlow = Math.max(0, Math.sin(ang));
    if (seaGlow > 0.05) {
      ctx.fillStyle = k.rgba('yellow', 0.22 * seaGlow);
      ctx.beginPath(); ctx.ellipse(96, 72, 42 * seaGlow, 5, 0, 0, k.TAU); ctx.fill();
    }

    // fener kulesi (çizgili, hafif konik)
    ctx.fillStyle = line; ctx.beginPath();
    ctx.moveTo(-26, 52); ctx.lineTo(-18, -70); ctx.lineTo(18, -70); ctx.lineTo(26, 52); ctx.closePath(); ctx.fill();
    ctx.fillStyle = body; ctx.beginPath();
    ctx.moveTo(-21, 50); ctx.lineTo(-15, -68); ctx.lineTo(15, -68); ctx.lineTo(21, 50); ctx.closePath(); ctx.fill();
    // kırmızı bantlar
    ctx.fillStyle = k.rgba('red', 0.85);
    ctx.beginPath(); ctx.moveTo(-19.5, 18); ctx.lineTo(-17.5, -6); ctx.lineTo(17.5, -6); ctx.lineTo(19.5, 18); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-20.8, 44); ctx.lineTo(-19.2, 28); ctx.lineTo(19.2, 28); ctx.lineTo(20.8, 44); ctx.closePath(); ctx.fill();
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-11, -52, 5, 26, 0.08, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(14, 46, 7, 3, 0, 0, k.TAU); ctx.fill();

    // lamba odası + kubbe
    const lampPulse = 0.8 + 0.2 * Math.sin(t * k.TAU / 2.4);
    k.glow(0, -78, 30, 'yellow', 0.4 * lampPulse);
    blob(-16, -92, 32, 20, 6, k.rgba('yellow', 0.75 + 0.25 * lampPulse));
    ctx.fillStyle = k.rgba('ink', 0.75); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-16, -82); ctx.lineTo(16, -82); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-16, -92); ctx.lineTo(16, -92); ctx.stroke();
    blob(-13, -104, 26, 12, 6, k.rgba('panel2'));
    ctx.fillStyle = k.rgba('yellow', 0.9);
    ctx.beginPath(); ctx.arc(0, -104, 4, 0, k.TAU); ctx.fill();
  },
};

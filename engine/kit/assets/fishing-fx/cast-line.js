// fishing-fx/cast-line — olta kamışı savrulur, misina açılır, şamandıra suya düşer.
// at anında (0.8 sn) şamandıra kamış ucundan yay çizerek uçar ve suya iner;
// idle: kamış ucu hafif salınır, şamandıra suda batar çıkar.
// NOT: canvas y-aşağıdır; (0,0) sahne merkezidir, su yüzeyi y=70'tir.
export default {
  name: 'cast-line', category: 'fishing-fx',
  desc: 'Olta kamışı savrulur, misina açılır ve şamandıra suya düşer',
  tags: ['olta', 'balık tutma', 'misina', 'şamandıra', 'atış', 'fishing', 'cast', 'rod', 'line', 'bobber'],
  box: [-160, -110, 160, 110],
  bleed: 30,
  anchor: 'sahne merkezi (0,0); kamış sapı sol altta, su yüzeyi sağ altta',
  points: { tip: [-20, -70], bobber: [110, 64], butt: [-140, 90] },
  params: {
    at: { type: 'time', default: null, desc: 'olta atma anı (0.8 sn, misina savrulur şamandıra suya düşer)' },
    color: { type: 'color', default: 'ink', desc: 'kamış rengi' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;

    // atış ilerlemesi 0..1 (0.8 sn, ease-out)
    let cp = 0;
    if (d >= 0 && d < 0.8) { const u = d / 0.8; cp = 1 - (1 - u) * (1 - u); }
    else if (d >= 0.8) cp = 1;

    // su yüzeyi (sağ alt)
    ctx.strokeStyle = k.rgba('cyan', 0.55); ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = -40; x <= 160; x += 8) {
      const wy = 72 + Math.sin(x * 0.09 + t * 1.6) * 2;
      if (x === -40) ctx.moveTo(x, wy); else ctx.lineTo(x, wy);
    }
    ctx.stroke();
    ctx.strokeStyle = k.rgba('cyan', 0.3); ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = -20; x <= 160; x += 8) {
      const wy = 84 + Math.sin(x * 0.07 + t * 1.2 + 2) * 2;
      if (x === -20) ctx.moveTo(x, wy); else ctx.lineTo(x, wy);
    }
    ctx.stroke();

    // kamış ucu (idle salınım)
    const sway = Math.sin(t * k.TAU / 3.2) * 2;
    const tipX = -20 + sway, tipY = -70 + sway * 0.5;

    // şamandıra uçuş yolu: kamış ucu yakını -> suya iniş (110, 64), yay çizerek
    const sx = -34, sy = -56, ex = 110, ey = 64;
    const mx = (sx + ex) / 2, my = Math.min(sy, ey) - 75;
    const bx = (1 - cp) * (1 - cp) * sx + 2 * (1 - cp) * cp * mx + cp * cp * ex;
    let by = (1 - cp) * (1 - cp) * sy + 2 * (1 - cp) * cp * my + cp * cp * ey;
    if (cp >= 1) by = ey + Math.sin(t * k.TAU / 2.2) * 3; // suda batıp çıkma

    // misina: uçtan şamandıraya, hafif sarkık eğri (serbest çizgi = ink)
    const cx = (tipX + bx) / 2, cy = (tipY + by) / 2 - 26 * (1 - cp) - 6;
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(tipX, tipY); ctx.quadraticCurveTo(cx, cy, bx, by - 8); ctx.stroke();

    // kamış gövdesi: sap -> uç
    ctx.strokeStyle = k.rgba(p.color, 0.95); ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(-140, 90); ctx.lineTo(tipX, tipY); ctx.stroke();
    // parlama: kamış üstünde sol üst ışık
    ctx.strokeStyle = 'rgba(255,255,255,0.10)'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-136, 84); ctx.lineTo(tipX - 4, tipY + 4); ctx.stroke();
    // sap tutamağı
    ctx.strokeStyle = k.rgba('dim', 0.95); ctx.lineWidth = 13;
    ctx.beginPath(); ctx.moveTo(-140, 90); ctx.lineTo(-112, 58); ctx.stroke();
    // makara
    ctx.fillStyle = k.rgba('panel2', 0.95);
    ctx.beginPath(); ctx.arc(-104, 52, 12, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(-104, 52, 12, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-108, 48, 5, 3, -0.4, 0, k.TAU); ctx.fill();

    // şamandıra: üst kırmızı, alt beyaz kapsül
    ctx.save();
    ctx.translate(bx, by);
    ctx.fillStyle = k.rgba('red', 0.95);
    ctx.beginPath(); ctx.arc(0, 0, 10, Math.PI, 0); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, 10, 0, k.TAU); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(0, -18); ctx.stroke();
    ctx.restore();

    // iniş sıçraması (atıştan sonraki 0.4 sn)
    if (d >= 0.8 && d < 1.2) {
      const u = (d - 0.8) / 0.4;
      for (let i = 0; i < 6; i++) {
        const h = k.hash(i * 41.7);
        const ang = -Math.PI * (0.15 + h * 0.7);
        const dist = u * (14 + h * 16);
        ctx.fillStyle = k.rgba('cyan', (1 - u) * 0.8);
        ctx.beginPath(); ctx.arc(ex + Math.cos(ang) * dist, ey - 4 + Math.sin(ang) * dist, 2 + h * 2, 0, k.TAU); ctx.fill();
      }
    }

    // iniş sonrası halka dalgalar
    if (cp >= 1) {
      for (let i = 0; i < 2; i++) {
        const frac = ((t * 0.7 + i * 0.5) % 1);
        ctx.strokeStyle = k.rgba('cyan', (1 - frac) * 0.5); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(ex, 72, 8 + frac * 26, 3 + frac * 8, 0, 0, k.TAU); ctx.stroke();
      }
    }

    ctx.restore();
  },
};

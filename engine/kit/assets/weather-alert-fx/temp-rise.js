// weather-alert-fx/temp-rise — yükselen sıcaklık göstergesi: termometre + ısı dalgaları
// level (0-1) cıva yüksekliğini belirler; boşta cıva nabız gibi hafif oynar, ısı dalgaları
// sürekli yukarı süzülür. NOT: canvas y-aşağıdır; cıva hazneden (−y yönünde) yukarı yükselir.
export default {
  name: 'temp-rise', category: 'weather-alert-fx',
  desc: 'Yükselen sıcaklık termometresi; level cıva yüksekliği, ısı dalgaları sürekli yukarı süzülür',
  tags: ['sıcaklık', 'termometre', 'sıcak', 'ısı', 'yükseliş', 'temperature', 'thermometer', 'heat', 'hot', 'rising'],
  box: [-110, -170, 110, 170],
  bleed: 20,
  anchor: 'termometre gövdesi merkezi; hazne alt kısımda (y=110)',
  points: { top: [0, -160], bulb: [0, 110], mercury: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
    heat: { type: 'color', default: 'red' },
    level: { type: 'number', default: 0.6, desc: 'sıcaklık seviyesi 0–1: cıva yüksekliği' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const lvl = Math.max(0, Math.min(1, p.level));
    // idle nabız: cıva ±0.02 oynar (~2.4 sn periyot)
    const pulse = Math.sin(t * 2.6) * 0.02;
    const eff = Math.max(0, Math.min(1, lvl + pulse));
    const tubeTop = -140, tubeBot = 80;
    const mercTop = tubeBot - eff * (tubeBot - tubeTop);

    // ısı dalgaları: 3 dalgalı çizgi sürekli yukarı süzülür (döngüsel)
    ctx.lineWidth = 5;
    for (let i = 0; i < 3; i++) {
      const x = -78 + i * 78;
      const phase = ((t * 0.55 + i * 0.33) % 1);
      const yBase = 60 - phase * 200; // aşağıdan yukarıya
      const alpha = phase < 0.15 ? phase / 0.15 : (phase > 0.8 ? (1 - phase) / 0.2 : 1);
      ctx.strokeStyle = k.rgba(p.heat, 0.7 * Math.max(0, Math.min(1, alpha)));
      ctx.beginPath();
      for (let s = 0; s <= 8; s++) {
        const yy = yBase + s * 12;
        const xx = x + Math.sin(yy * 0.12 + t * 3 + i * 2) * 7;
        if (s === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
      }
      ctx.stroke();
    }

    // gövde: gölge (sağ alt) + tüp
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-33 + 5, -150 + 6, 66, 240, 30); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-33, -150, 66, 240, 30); ctx.fill();
    // sol üst parlama (tüp üzerinde, bilgi taşımayan yüzey)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-14, -110, 10, 34, 0.2, 0, k.TAU); ctx.fill();

    // hazne: gölge + gövde + parlama
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(5, 116, 52, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color); ctx.beginPath(); ctx.arc(0, 110, 52, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-18, 92, 16, 10, -0.5, 0, k.TAU); ctx.fill();

    // cıva: hazne + sütun (seviyeye göre)
    ctx.fillStyle = k.rgba(p.heat);
    ctx.beginPath(); ctx.arc(0, 110, 38, 0, k.TAU); ctx.fill();
    ctx.beginPath(); k.rrect(-14, mercTop, 28, tubeBot - mercTop + 10, 14); ctx.fill();
    // cıva içi kabarcık: yukarı süzülen 3 nokta (canlı idle)
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    for (let i = 0; i < 3; i++) {
      const ph = ((t * 0.4 + i * 0.33) % 1);
      const yy = 100 - ph * (100 - mercTop);
      ctx.beginPath(); ctx.arc(0, yy, 4, 0, k.TAU); ctx.fill();
    }

    // ölçek çizgileri (ink, ince)
    ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 3;
    for (let i = 0; i <= 4; i++) {
      const yy = tubeBot - (i / 4) * (tubeBot - tubeTop);
      ctx.beginPath(); ctx.moveTo(38, yy); ctx.lineTo(54, yy); ctx.stroke();
    }
    // tepe oku: seviye yükseldikçe parlayan yukarı ok
    const arrowY = mercTop - 22;
    ctx.fillStyle = k.rgba(p.heat, 0.75 + 0.25 * Math.sin(t * 2.6));
    ctx.beginPath();
    ctx.moveTo(0, arrowY - 16); ctx.lineTo(16, arrowY + 6); ctx.lineTo(6, arrowY + 6);
    ctx.lineTo(6, arrowY + 20); ctx.lineTo(-6, arrowY + 20); ctx.lineTo(-6, arrowY + 6);
    ctx.lineTo(-16, arrowY + 6); ctx.closePath(); ctx.fill();
  },
};

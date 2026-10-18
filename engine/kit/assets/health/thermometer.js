// health/thermometer — dikey cam termometre; altta ampul, içinde kırmızı cıva sütunu ve ölçü çizgileri.
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır; (0,10) ampul merkezidir.
export default {
  name: 'thermometer', category: 'health',
  desc: 'Cam termometre; cıva seviyesi ayarlanır, yüzey canlıca titrer, measure anında cıva nabzı atar',
  tags: ['termometre', 'ateş', 'sıcaklık', 'ölçüm', 'thermometer', 'temperature', 'fever', 'derece', 'sağlık'],
  box: [-45, -125, 45, 50],
  bleed: 25,
  anchor: 'ampul merkezi (0,10)',
  points: { top: [0, -112], bulb: [0, 10] },
  params: {
    color: { type: 'color', default: 'red', desc: 'cıva rengi' },
    level: { type: 'number', default: 0.55, desc: 'cıva seviyesi 0–1' },
    measure: { type: 'time', default: null, desc: 'ölçüm anı: cıva nabzı + parlama (0.6 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const d = p.measure == null ? -1 : t - p.measure;
    const g = d < 0 ? 0 : k.prog(d, 0, 0.6);

    // cıva seviyesi: ampul üstünden (-2) sapın tepesine (-98)
    const lv = k.clamp(p.level, 0, 1);
    const wobble = k.noise1(t * 2.2) * 2.5;            // canlı cıva titremesi
    const levelY = k.lerp(-2, -98, lv) + wobble;
    const pulse = g > 0 ? Math.sin(g * Math.PI) : 0;  // ölçüm nabzı

    const stem = () => { ctx.beginPath(); k.rrect(-14, -110, 28, 102, 14); };

    ctx.save();

    // gölgeler (sağ alt %12 koyultma)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.save(); ctx.translate(6, 6);
    stem(); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 10, 26, 0, k.TAU); ctx.fill();
    ctx.restore();

    // cam sap: dış hat + cam
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-14 - LW / 2, -110 - LW / 2, 28 + LW, 102 + LW, 16); ctx.fill();
    ctx.fillStyle = k.rgba('panel2', 0.92); stem(); ctx.fill();
    // cam ampul: dış hat + cam
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(0, 10, 26 + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2', 0.92); ctx.beginPath(); ctx.arc(0, 10, 26, 0, k.TAU); ctx.fill();

    // cıva: ampul içi + sütun
    ctx.fillStyle = k.rgba(p.color, 0.95);
    ctx.beginPath(); ctx.arc(0, 10, 17, 0, k.TAU); ctx.fill();
    const cw = 7 * (1 + 0.25 * pulse);
    ctx.beginPath(); k.rrect(-cw, levelY, cw * 2, Math.max(2, -2 - levelY), cw); ctx.fill();
    // cıva parlaması (hareketli ince çizgi)
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath(); k.rrect(-cw + 1.5, levelY + 4, 3, Math.max(2, -8 - levelY), 1.5); ctx.fill();

    // ölçüm nabzı: cıva parlaması
    if (pulse > 0) k.glow(0, (levelY + 10) / 2, 42, p.color, 0.35 * pulse);

    // ölçü çizgileri (sağda)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3; ctx.lineCap = 'round';
    for (const ty of [-90, -70, -50, -30]) {
      ctx.beginPath(); ctx.moveTo(14, ty); ctx.lineTo(23, ty); ctx.stroke();
    }

    // cam parlaması (sol üst, bilgi taşımayan yüzey)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); k.rrect(-11, -104, 6, 84, 3); ctx.fill();

    ctx.restore();
  },
};

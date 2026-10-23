// night-fx/window-lights — gece apartman cephesi: 5×4 pencere ızgarası; pencereler
// yavaş bir dalga döngüsüyle yanıp söner, lights 0–1 paramı yanan pencere yoğunluğunu
// belirler; birkaç pencerede TV titremesi (noise) vardır.
// NOT: canvas y-aşağıdır; bina (0,0) merkezlidir, çatı y=-105, giriş y=90.
export default {
  name: 'window-lights', category: 'night-fx',
  desc: 'Gece apartmanı: pencereler dalga döngüsüyle yanıp söner, lights yoğunluğu ayarlar',
  tags: ['apartman', 'bina', 'pencere', 'gece', 'ışık', 'şehir', 'apartment', 'building', 'window', 'night', 'city', 'lights'],
  box: [-150, -125, 150, 105],
  bleed: 20,
  anchor: 'bina merkezi (0,0); çatı y=-105, zemin y=95',
  points: { roof: [0, -108], door: [0, 88], centre: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
    glow: { type: 'color', default: 'yellow' },
    lights: { type: 'number', default: 0.55, desc: '0–1: yanan pencere yoğunluğu' },
  },
  draw(ctx, t, p, k) {
    const LW = 9;
    const line = k.rgba('bg', 0.55);
    const L = k.clamp(p.lights, 0, 1);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const BW = 240, BH = 190, bx = -120, by = -105;
    const cols = 5, rows = 4;

    // --- bina gövdesi ---
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(bx - LW / 2, by - LW / 2, BW + LW, BH + LW, 10); ctx.fill();
    ctx.fillStyle = k.rgba(p.color); ctx.beginPath(); k.rrect(bx, by, BW, BH, 8); ctx.fill();
    // çatı bandı
    ctx.fillStyle = k.rgba('ink', 0.55); ctx.fillRect(bx, by, BW, 10);
    // premium parlama (sol üst 0.10) + sağ alt gölge
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(bx + 45, by + 30, 34, 16, -0.4, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(bx + BW - 45, by + BH - 30, 38, 18, -0.4, 0, k.TAU); ctx.fill();

    // --- pencereler ---
    const ww = 30, wh = 26, gx = (BW - 2 * 18 - cols * ww) / (cols - 1), gy = 22;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (r === rows - 1 && c === 2) continue; // giriş kapısı burada
        const wx = bx + 18 + c * (ww + gx);
        const wy = by + 30 + r * (wh + gy);
        const seed = r * 17.3 + c * 31.7 + 3;
        // dalga döngüsü: faz sırayla kayar → pencereler sırayla yanıp söner
        const wave = 0.5 + 0.5 * Math.sin(t * 0.9 - (r * 0.9 + c * 0.45) + k.hash(seed) * 1.2);
        const lit = k.hash(seed + 7) < L && wave > 0.45 - 0.25 * L;
        const warm = lit ? (0.55 + 0.45 * wave) : 0.06;

        // pencere çerçevesi
        ctx.fillStyle = line; ctx.beginPath(); k.rrect(wx - 3, wy - 3, ww + 6, wh + 6, 5); ctx.fill();
        ctx.fillStyle = k.rgba(p.glow, warm); ctx.beginPath(); k.rrect(wx, wy, ww, wh, 4); ctx.fill();
        // cam haçı (iç çizgi, ink alfa 0.35)
        ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(wx, wy + wh / 2); ctx.lineTo(wx + ww, wy + wh / 2); ctx.stroke();
        if (lit) {
          // TV titremesi: bazı pencerelerde noise ile titrer
          if (k.hash(seed + 13) < 0.35) {
            const tv = 0.5 + 0.5 * k.noise1(t * 9 + seed);
            ctx.fillStyle = k.rgba('cyan', 0.35 * tv);
            ctx.beginPath(); k.rrect(wx + 3, wy + 3, ww - 6, wh - 6, 3); ctx.fill();
          }
          if (k.hash(seed + 29) < 0.25) k.glow(wx + ww / 2, wy + wh / 2, 26, p.glow, 0.30 * warm);
        }
      }
    }

    // --- giriş kapısı (zemin) ---
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-22 - 4, 48 - 4, 44 + 8, 47 + 8, 8); ctx.fill();
    ctx.fillStyle = k.rgba(p.glow, 0.25 + 0.15 * Math.sin(t * 1.3));
    ctx.beginPath(); k.rrect(-22, 48, 44, 47, 6); ctx.fill();
  },
};

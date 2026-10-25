// blacksmith-fx/blade-sharpen — bıçak bileme taşında ileri geri kayar; temas noktasında kıvılcım çizgileri. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) bileme taşı merkezi.
export default {
  name: 'blade-sharpen', category: 'blacksmith-fx',
  desc: 'Bıçak bileme taşında ritmik olarak ileri geri kayar; hızlı geçişlerde temas noktasından kıvılcım çizgileri çıkar',
  tags: ['bıçak', 'bileme', 'biley', 'kıvılcım', 'demirci', 'blade', 'sharpen', 'whetstone', 'blacksmith', 'knife'],
  box: [-130, -90, 130, 90],
  bleed: 40,
  anchor: 'bileme taşı merkezi (0,0)',
  points: { edge: [0, -14], stone: [0, 10], handle: [-95, -34] },
  params: {
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    // bileme döngüsü: 1.1 sn ileri geri
    const ph = t / 1.1 * k.TAU;
    const slide = Math.sin(ph) * 34;
    const speed = Math.abs(Math.cos(ph)); // hız: uç noktalarda 0, ortada max
    const tilt = Math.sin(ph) * 0.04;

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // bileme taşı (taban)
    blob(-92, -2, 184, 34, 12, body);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-58, 6, 24, 5, 0, 0, k.TAU); ctx.fill();
    // taş yüzeyi (pürüzlü şerit)
    ctx.fillStyle = k.rgba('ink', 0.18);
    ctx.beginPath(); k.rrect(-84, 2, 168, 6, 3); ctx.fill();
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = k.rgba('ink', 0.25);
      ctx.beginPath(); ctx.ellipse(-76 + i * 22, 5, 3, 1.5, 0, 0, k.TAU); ctx.fill();
    }
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(-40, 32, 120, 8, 4); ctx.fill();
    // ahşap altlık
    blob(-100, 32, 200, 16, 8, k.rgba('panel2'));

    // bıçak: taş üzerinde ileri geri kayar
    ctx.save();
    ctx.translate(slide, 0);
    ctx.rotate(-0.09 + tilt);
    // sap
    blob(-108, -40, 44, 18, 9, k.rgba('ink'));
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.ellipse(-96, -31, 5, 5, 0, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-78, -31, 5, 5, 0, 0, k.TAU); ctx.fill();
    // ağız (keskin kenar aşağıda, taşa değer)
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.moveTo(-64, -44); ctx.lineTo(86, -44); ctx.lineTo(100, -16); ctx.lineTo(96, -4); ctx.lineTo(-64, -4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.moveTo(-60, -40); ctx.lineTo(84, -40); ctx.lineTo(96, -16); ctx.lineTo(92, -8); ctx.lineTo(-60, -8); ctx.closePath(); ctx.fill();
    // premium parlama (ağız üstü)
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(10, -32, 34, 5, 0, 0, k.TAU); ctx.fill();
    // keskin kenar çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-60, -8); ctx.lineTo(92, -8); ctx.stroke();
    ctx.restore();

    // kıvılcım çizgileri: hız yüksekken temas noktasında
    if (speed > 0.45) {
      const a = (speed - 0.45) / 0.55;
      for (let i = 0; i < 6; i++) {
        const cyc = (t * 2.2 + k.hash(i + 30)) % 1;
        const dir = Math.sin(ph) > 0 ? 1 : -1;
        const px = slide + 92 + dir * cyc * 30;
        const py = -6 - cyc * 14 + k.hash(i + 50) * 6;
        ctx.strokeStyle = k.rgba('yellow', 0.85 * a * (1 - cyc));
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + dir * 9, py - 4); ctx.stroke();
      }
      // temas parlaması
      k.glow(slide + 92, -6, 18, 'yellow', 0.4 * a);
    }
  },
};

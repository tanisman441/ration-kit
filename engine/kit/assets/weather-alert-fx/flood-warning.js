// weather-alert-fx/flood-warning — sel uyarısı: uyarı üçgeni + kabaran su
// at anında 1.0 sn'de su kabarır, damlalar sıçrar, sonra geri çekilir. Boşta dalgalar
// hafif salınır. NOT: canvas y-aşağıdır; su altan (−y yönünde değil) yukarı kabarır:
// kabarma = su yüzeyinin y değerinin küçülmesi.
export default {
  name: 'flood-warning', category: 'weather-alert-fx',
  desc: 'Ünlemli sel uyarı üçgeni altında kabaran su; at anında 1 sn süren su kabarması ve sıçrama',
  tags: ['sel', 'su baskını', 'uyarı', 'taşkın', 'tehlike', 'flood', 'flood warning', 'water', 'danger', 'alert'],
  box: [-150, -150, 150, 150],
  bleed: 30,
  anchor: 'uyarı üçgeni merkezi (0,-60); su alt bölümde',
  points: { top: [0, -140], waterline: [0, 60], bottom: [0, 140] },
  params: {
    color: { type: 'color', default: 'yellow' },
    water: { type: 'color', default: 'cyan' },
    at: { type: 'time', default: null, desc: 'sel anı: 1.0 sn su kabarması + sıçrayan damlalar' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const d = p.at == null ? -1 : t - p.at;
    const active = d >= 0 && d < 1.0;
    // kabarma eğrisi: hızlı yüksel, 1 sn sonunda geri çekil
    const surge = active ? Math.sin((d / 1.0) * Math.PI) : 0;
    const baseY = 70;
    const waterY = baseY - surge * 55;
    // idle dalga salınımı
    const sway = Math.sin(t * 2.2) * 3;

    // su kütlesi: dalgalı üst kenar, alt rrect
    const wave = (y0, amp, alpha) => {
      ctx.fillStyle = k.rgba(p.water, alpha);
      ctx.beginPath(); ctx.moveTo(-140, 150);
      ctx.lineTo(-140, y0);
      for (let x = -140; x <= 140; x += 10) {
        ctx.lineTo(x, y0 + Math.sin(x * 0.06 + t * 3) * amp);
      }
      ctx.lineTo(140, 150); ctx.closePath(); ctx.fill();
    };
    wave(waterY + 6, 7, 0.45);
    wave(waterY, 5, 0.85);
    // su üstü parlama çizgisi
    ctx.strokeStyle = k.rgba(p.water, 0.9); ctx.lineWidth = 4;
    ctx.beginPath();
    for (let x = -130; x <= 130; x += 10) ctx.lineTo(x, waterY + Math.sin(x * 0.06 + t * 3) * 5 + sway * 0.3);
    ctx.stroke();

    // sıçrayan damlalar: sadece uyarı anında
    if (active) {
      for (let i = 0; i < 14; i++) {
        const prog = Math.min(1, d / 1.0);
        const x0 = -120 + k.hash(i * 3.7 + 2) * 240;
        const h = 30 + k.hash(i * 5.1 + 2) * 60;
        const yy = waterY - prog * h * (1 - prog * 0.3);
        const a = Math.max(0, 1 - prog);
        ctx.fillStyle = k.rgba(p.water, 0.9 * a);
        ctx.beginPath(); ctx.arc(x0, yy, 5 + k.hash(i * 9.1) * 3, 0, k.TAU); ctx.fill();
      }
      k.glow(0, waterY - 20, 90, p.water, 0.3 * (1 - d));
    }

    // uyarı üçgeni: gölge (sağ alt) + gövde + sol üst parlama
    const tri = (ox, oy, c) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.moveTo(ox, oy - 82); ctx.lineTo(ox + 82, oy + 62); ctx.lineTo(ox - 82, oy + 62);
      ctx.closePath(); ctx.fill();
    };
    ctx.save();
    ctx.translate(0, -55 + Math.sin(t * 1.8) * 2);
    tri(5, 6, line);
    tri(0, 0, k.rgba(p.color));
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-26, -34, 26, 13, -0.5, 0, k.TAU); ctx.fill();
    // ünlem: gövde + nokta (uyarıda yanıp söner)
    const blink = active ? (Math.sin(d * 40) > 0 ? 1 : 0.35) : 1;
    ctx.fillStyle = k.rgba('ink', 0.9 * blink);
    ctx.beginPath(); k.rrect(-7, -52, 14, 52, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 34, 9, 0, k.TAU); ctx.fill();
    ctx.restore();
  },
};

// night-fx/streetlight-flicker — sokak lambası: direk ve kol, altında aydınlattığı
// koni alanı; ışık idle'da noise-titremesi yapar, flicker anında 0.6 sn stroboskop kesintisi.
// NOT: canvas y-aşağıdır; (0,0) lambanın kafa merkezidir, direk aşağıya (+y) iner.
export default {
  name: 'streetlight-flicker', category: 'night-fx',
  desc: 'Sokak lambası: titreyen ışık konisi, flicker anında kısa stroboskop kesintisi',
  tags: ['sokak lambası', 'lamba', 'ışık', 'gece', 'titreme', 'flicker', 'streetlight', 'lamp', 'night', 'light'],
  box: [-110, -90, 170, 150],
  bleed: 40,
  anchor: 'lamba kafası merkezi (0,-30); direk tabanı y=130',
  points: { base: [0, 132], light: [62, -30], head: [62, -52] },
  params: {
    color: { type: 'color', default: 'dim' },
    glow: { type: 'color', default: 'yellow' },
    flicker: { type: 'time', default: null, desc: 'elektrik kesintisi anı: 0.6 sn stroboskop (sön-yan)' },
    intensity: { type: 'number', default: 1, desc: '0–1.3: ışık şiddeti çarpanı' },
  },
  draw(ctx, t, p, k) {
    const LW = 9;
    const line = k.rgba('bg', 0.55);
    const pole = k.rgba(p.color), inkC = k.rgba('ink');
    const I = k.clamp(p.intensity, 0, 1.3);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // --- ışık seviyesi: idle titreme + ara sıra derin düşüş + flicker strobu ---
    let lvl = 0.78 + 0.28 * k.noise1(t * 7 + 3);
    if (k.hash(Math.floor(t * 1.6) + 41) < 0.16) lvl *= 0.25;        // aralıklı sönüp yanma
    const d = p.flicker == null ? -1 : t - p.flicker;
    if (d >= 0 && d < 0.6) lvl *= (Math.sin(d * 62) > 0 ? 0.95 : 0.08); // stroboskop
    lvl = k.clamp(lvl * I, 0, 1.2);

    // --- ışık konisi (lambanın arkasında) ---
    if (lvl > 0.03) {
      const cone = ctx.createLinearGradient(0, -20, 0, 125);
      cone.addColorStop(0, k.rgba(p.glow, 0.30 * lvl));
      cone.addColorStop(1, k.rgba(p.glow, 0));
      ctx.fillStyle = cone;
      ctx.beginPath();
      ctx.moveTo(38, -22); ctx.lineTo(86, -22);
      ctx.lineTo(128, 122); ctx.lineTo(-4, 122);
      ctx.closePath(); ctx.fill();
      // zemin aydınlanma havuzu
      ctx.fillStyle = k.rgba(p.glow, 0.16 * lvl);
      ctx.beginPath(); ctx.ellipse(62, 118, 66, 14, 0, 0, k.TAU); ctx.fill();
      // lamba kafasında glow
      k.glow(62, -30, 46, p.glow, 0.5 * Math.min(1, lvl));
    }

    // --- direk (arkada, koninin altında değil; direk solda) ---
    ctx.strokeStyle = line; ctx.lineWidth = LW + 14;
    ctx.beginPath(); ctx.moveTo(0, 134); ctx.lineTo(0, -36); ctx.stroke();
    ctx.strokeStyle = pole; ctx.lineWidth = 14;
    ctx.beginPath(); ctx.moveTo(0, 132); ctx.lineTo(0, -34); ctx.stroke();
    // premium: direk sol üst parlama + sağ alt gölge
    ctx.strokeStyle = 'rgba(255,255,255,0.10)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-4, 120); ctx.lineTo(-4, -26); ctx.stroke();
    ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(5, 128); ctx.lineTo(5, -24); ctx.stroke();
    // taban
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-22 - LW / 2, 122 - LW / 2, 44 + LW, 18 + LW, 8); ctx.fill();
    ctx.fillStyle = pole; ctx.beginPath(); k.rrect(-22, 122, 44, 18, 8); ctx.fill();

    // --- kol (ince serbest çizgi: ink ile) ---
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(0, -34); ctx.quadraticCurveTo(28, -52, 56, -44); ctx.stroke();

    // --- lamba kafası ---
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(34 - LW / 2, -64 - LW / 2, 56 + LW, 26 + LW, 12); ctx.fill();
    ctx.fillStyle = k.rgba('panel2'); ctx.beginPath(); k.rrect(34, -64, 56, 26, 12); ctx.fill();
    // ampul
    const bulbA = 0.25 + 0.75 * lvl;
    ctx.fillStyle = k.rgba(p.glow, bulbA);
    ctx.beginPath(); ctx.ellipse(62, -38, 16, 9, 0, 0, k.TAU); ctx.fill();
    // premium parlama (sol üst, alfa 0.10) + sağ alt gölge
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(48, -56, 13, 6, -0.4, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(78, -42, 11, 5, -0.4, 0, k.TAU); ctx.fill();
  },
};

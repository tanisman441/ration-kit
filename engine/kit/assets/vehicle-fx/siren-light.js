// vehicle-fx/siren-light — siren ışığı: kırmızı/mavi dönüşümlü flaş (~1 sn periyot) + yan glow.
// NOT: canvas y-aşağıdır; taban (0,0), kubbe yukarıda. Mavi taraf tema rengi 'cyan' ile çizilir.
export default {
  name: 'siren-light',
  category: 'vehicle-fx',
  desc: 'Siren ışığı: kırmızı/mavi dönüşümlü flaş, ~1 saniye periyot, kubbeli gövde',
  tags: ['siren', 'polis', 'ambulans', 'itfaiye', 'flaş', 'alarm', 'tehlike', 'siren', 'police', 'light', 'alarm', 'flash', 'emergency'],
  box: [-72, -96, 72, 22],
  bleed: 60,
  anchor: 'taban (0,0): siren buraya monte edilir',
  points: { top: [0, -68], base: [0, 0] },
  params: {
    speed: { type: 'number', default: 1, desc: 'flaş hızı çarpanı (1 = ~1 sn periyot)' },
    color: { type: 'color', default: 'panel2' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    // dönüşümlü flaş: kosinüsün + ve − yarıları kırmızı/mavi (canlı idle döngü)
    // faz kayması: check kareleri (0, 0.5, 1, …) tam kavşak noktasına denk gelmesin diye
    // t=0'da kırmızı zirvede başlar, 0.5 sn'de mavi zirve — kare kare dönüşüm görünür
    const w = k.TAU * k.clamp(p.speed, 0.2, 4);
    const rA = Math.max(0, Math.cos(t * w));   // kırmızı yoğunluğu
    const bA = Math.max(0, -Math.cos(t * w));  // mavi (cyan) yoğunluğu
    const R = 44, CY = -24;                    // kubbe yarıçapı / merkez y

    // 1) yan glow'lar: her renk kendi tarafında
    k.glow(-26, -44, 78, 'red', 0.5 * rA);
    k.glow(26, -44, 78, 'cyan', 0.5 * bA);

    // 2) kubbe: sol yarı kırmızı, sağ yarı mavi tonlanır
    const half = (a0, a1, col, alpha) => {
      ctx.fillStyle = k.rgba(col, alpha);
      ctx.beginPath();
      ctx.moveTo(0, CY);
      ctx.arc(0, CY, R, a0, a1);
      ctx.closePath();
      ctx.fill();
    };
    // kubbe tabanı
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath();
    ctx.arc(0, CY, R, Math.PI, k.TAU);
    ctx.closePath();
    ctx.fill();
    half(Math.PI, Math.PI * 1.5, 'red', 0.12 + 0.68 * rA);
    half(Math.PI * 1.5, k.TAU, 'cyan', 0.12 + 0.68 * bA);
    // kubbe konturu
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(0, CY, R, Math.PI, k.TAU);
    ctx.closePath();
    ctx.stroke();
    // orta bölme çizgisi
    ctx.strokeStyle = k.rgba('bg', 0.4);
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, CY - R); ctx.lineTo(0, CY); ctx.stroke();
    // sol üst parlama (premium finish)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-R * 0.45, CY - R * 0.45, R * 0.34, R * 0.2, -0.5, 0, k.TAU); ctx.fill();

    // 3) montaj tabanı
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 5;
    k.rrect(-52, -24, 104, 24, 8);
    ctx.fill(); ctx.stroke();
    // sağ alt gölge (%12 koyultma, 6 units offset)
    ctx.fillStyle = k.rgba('bg', 0.12);
    k.rrect(-46, -18 + 6, 104, 18, 8);
    ctx.fill();
    ctx.restore();
  },
};

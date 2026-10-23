// police-fx/handcuff-snap — kelepçe: at anında kapak 0.12 sn'de kapanır (klik flaşı + sarsıntı), boşta hafif salınır.
// NOT: canvas y-aşağıdır; (0,0) kelepçe halkası merkezi. Orijinal tasarım.
export default {
  name: 'handcuff-snap',
  category: 'police-fx',
  desc: 'Kelepçe: at anında kapak şak diye kapanır (klik flaşı), boşta hafif salınır',
  tags: ['kelepçe', 'polis', 'tutuklama', 'gözaltı', 'suç', 'handcuff', 'cuffs', 'police', 'arrest', 'crime'],
  box: [-95, -105, 95, 75],
  bleed: 55,
  anchor: 'kelepçe halkası merkezi (0,0)',
  points: { lock: [34, -62], link: [0, 52] },
  params: {
    at: { type: 'time', default: null, desc: 'kelepçe kapanma anı (0.12 sn kapak, klik flaşı)' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const O = k.rgba('bg', 0.55);
    const LW = 5;
    const col = k.rgba(p.color, 1);
    const ink = k.rgba('ink', 1);

    // zaman: d<0 → kapak açık; at anında 0.12 sn'de kapanır, sonra sarsıntı
    const d = p.at == null ? -1 : t - p.at;
    const OPEN = -0.62;
    let gate;
    if (d < 0) gate = OPEN;
    else if (d < 0.12) gate = k.lerp(OPEN, 0, k.E.outCubic(d / 0.12));
    else gate = 0;
    // kapanma sonrası sarsıntı (0.5 sn sönümlü)
    const jolt = d >= 0 && d < 0.5 ? Math.sin(d * 55) * 2.2 * Math.exp(-d * 9) : 0;
    // idle: hafif salınım
    const sway = Math.sin(t * 1.6) * 0.028;
    ctx.translate(jolt, 0);
    ctx.rotate(sway);

    const R = 42;                       // halka yarıçapı
    const ring = (strokeCol, wdt) => {
      ctx.strokeStyle = strokeCol; ctx.lineWidth = wdt;
      ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.stroke();
    };

    // sabitleme zinciri (altta, ink ince serbest çizgi kuralı)
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(-10, R + 8); ctx.lineTo(-10, R + 34); ctx.stroke();
    ctx.beginPath(); ctx.arc(-10, R + 44, 12, 0, k.TAU); ctx.stroke();

    // halka: dış kontur + iç gövde
    ring(O, 20 + LW);
    ring(col, 20);
    // üstte açıklık (kapak boşluğu): bg rengiyle sil
    ctx.save();
    ctx.strokeStyle = k.rgba('bg', 1); ctx.lineWidth = 22;
    ctx.beginPath(); ctx.arc(0, 0, R, -Math.PI / 2 - 0.34, -Math.PI / 2 + 0.34); ctx.stroke();
    ctx.restore();

    // dişli şerit (kapak iç kısmı)
    ctx.fillStyle = k.rgba('bg', 0.35);
    for (let i = 0; i < 6; i++) {
      const a = Math.PI * 0.15 + i * 0.21;
      const x = Math.cos(a) * R, y = Math.sin(a) * R;
      ctx.save(); ctx.translate(x, y); ctx.rotate(a + Math.PI / 2);
      k.rrect(-3, -4, 6, 8, 2); ctx.fill();
      ctx.restore();
    }

    // kapak: menteşeden (sol üst) dönen yay parçası
    const hx = -R * Math.cos(0.28), hy = -R * Math.sin(0.28);  // menteşe (~sol üst)
    ctx.save();
    ctx.translate(hx, hy);
    ctx.rotate(gate);
    ctx.translate(-hx, -hy);
    const gateArc = (strokeCol, wdt) => {
      ctx.strokeStyle = strokeCol; ctx.lineWidth = wdt;
      ctx.beginPath(); ctx.arc(0, 0, R, -Math.PI / 2 - 0.28, -Math.PI / 2 + 0.62); ctx.stroke();
    };
    gateArc(O, 16 + LW);
    gateArc(col, 16);
    // kapak ucu: kilit dili
    const tx = R * Math.cos(-Math.PI / 2 + 0.62), ty = R * Math.sin(-Math.PI / 2 + 0.62);
    ctx.fillStyle = ink;
    ctx.beginPath(); ctx.arc(tx, ty, 7, 0, k.TAU); ctx.fill();
    // menteşe vidası
    ctx.fillStyle = O; ctx.beginPath(); ctx.arc(hx, hy, 9, 0, k.TAU); ctx.fill();
    ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(hx, hy, 6, 0, k.TAU); ctx.fill();
    ctx.restore();

    // klik flaşı (kapanma anında, 0.12 sn)
    if (d >= 0 && d < 0.12) {
      const f = 1 - d / 0.12;
      k.glow(tx, ty, 26 + 30 * f, 'yellow', 0.5 * f);
      ctx.strokeStyle = k.rgba('yellow', 0.8 * f); ctx.lineWidth = 4;
      for (let i = 0; i < 5; i++) {
        const a = k.hash(i * 3 + 7) * k.TAU;
        ctx.beginPath(); ctx.moveTo(tx + Math.cos(a) * 18, ty + Math.sin(a) * 18);
        ctx.lineTo(tx + Math.cos(a) * (30 + 14 * f), ty + Math.sin(a) * (30 + 14 * f)); ctx.stroke();
      }
    }

    // premium parlama: halka sol üst
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-R * 0.6, -R * 0.6, 20, 9, -0.6, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.strokeStyle = k.rgba('bg', 0.12); ctx.lineWidth = 8;
    ctx.beginPath(); ctx.arc(6, 6, R, Math.PI * 0.15, Math.PI * 0.6); ctx.stroke();

    ctx.restore();
  },
};

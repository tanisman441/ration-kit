// time-fx/hourglass-flow — akan kumlu kum saati; `at` anında 180° çevrilir.
// NOT: canvas y-aşağıdır. Çevirme sonrası kum yeniden dolmaya başlar (simetri gereği).
export default {
  name: 'hourglass-flow',
  category: 'time-fx',
  desc: 'Sürekli kum akan kum saati; at anında çevirme animasyonu',
  tags: ['kum saati', 'kum', 'zaman', 'süre', 'çevirme', 'hourglass', 'sand', 'time', 'timer'],
  box: [-160, -160, 160, 160],
  bleed: 20,
  anchor: 'gövde merkezi (0,0)',
  points: { face: [0, 0], top: [0, -118], bottom: [0, 118] },
  params: {
    color: { type: 'color', default: 'ink' },
    at: { type: 'time', default: null, desc: 'çevirme anı: 180° dönüş (0.7 sn)' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55), inkC = k.rgba('ink');
    const P = 14;                                        // kum döngüsü (sn)
    const d = p.at == null ? -1 : t - p.at;
    // çevirme sonrası sayaç yeniden başlar
    const level = d >= 0
      ? (((d % P) + P) % P) / P
      : (((t % P) + P) % P) / P;                        // 0 → üst dolu, 1 → üst boş
    let rot = 0;
    if (d >= 0 && d < 0.7) rot = Math.PI * k.E.inOutCubic(k.clamp(d / 0.7, 0, 1));
    else if (d >= 0.7) rot = Math.PI;

    ctx.save();
    ctx.rotate(rot);

    // çerçeve: iki yan direk + alt/üst kapak
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-94, -126, 188, 22, 11); ctx.fill();   // üst kapak
    ctx.beginPath(); k.rrect(-94, 104, 188, 22, 11); ctx.fill();    // alt kapak
    ctx.beginPath(); k.rrect(-88, -108, 16, 216, 8); ctx.fill();   // sol direk
    ctx.beginPath(); k.rrect(72, -108, 16, 216, 8); ctx.fill();     // sağ direk
    // kapak parlaması (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); k.rrect(-80, -122, 100, 9, 4.5); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(-10, 113, 88, 9, 4.5); ctx.fill();

    // cam gövde: kum saati silueti
    const glass = () => {
      ctx.beginPath();
      ctx.moveTo(-58, -100); ctx.lineTo(58, -100); ctx.lineTo(9, -9);
      ctx.lineTo(9, 9); ctx.lineTo(58, 100); ctx.lineTo(-58, 100);
      ctx.lineTo(-9, 9); ctx.lineTo(-9, -9); ctx.closePath();
    };
    ctx.fillStyle = k.rgba('panel', 0.5); glass(); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 6; glass(); ctx.stroke();
    // cam parlaması (ince diagonal)
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 8; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-44, -88); ctx.lineTo(-22, -60); ctx.stroke();

    // kum geometrisi: level 0 = üst dolu, 1 = üst boş
    const topHW = y => 58 - 50 * ((y + 100) / 92);     // üst odacık yarı genişlik
    const botHW = y => 8 + 50 * ((y - 8) / 92);        // alt odacık yarı genişlik
    ctx.fillStyle = k.rgba('yellow');
    // üst yığını: -100'den yfill'e (level 0 → dolu, 1 → boş)
    const yfill = -12 - level * 88;
    if (level < 0.995) {
      ctx.beginPath();
      ctx.moveTo(-58, -100); ctx.lineTo(58, -100);
      ctx.lineTo(topHW(yfill), yfill); ctx.lineTo(-topHW(yfill), yfill);
      ctx.closePath(); ctx.fill();
      // yüzey çizgisi (ince, ink)
      ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-topHW(yfill), yfill); ctx.lineTo(topHW(yfill), yfill); ctx.stroke();
    }
    // alt yığını: 100'den ysurf'e + küçük tepe
    const ysurf = 100 - level * 80;
    if (level > 0.005) {
      ctx.beginPath();
      ctx.moveTo(-58, 100); ctx.lineTo(58, 100);
      ctx.lineTo(botHW(ysurf), ysurf); ctx.lineTo(-botHW(ysurf), ysurf);
      ctx.closePath(); ctx.fill();
      // kum tepesi
      ctx.beginPath();
      ctx.moveTo(-botHW(ysurf), ysurf); ctx.lineTo(0, ysurf - 6 - level * 14);
      ctx.lineTo(botHW(ysurf), ysurf); ctx.closePath(); ctx.fill();
    }
    // akan kum ipi: hafif yalpalama (canlı idle)
    const midFlip = d >= 0 && d < 0.7;
    if (level < 0.995 && !midFlip) {
      const wob = 3 * k.noise1(t * 7);
      ctx.strokeStyle = k.rgba('yellow'); ctx.lineWidth = 5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(wob * 0.4, -12); ctx.lineTo(wob, 14); ctx.stroke();
      // alt yığına düşen nokta
      ctx.fillStyle = k.rgba('yellow');
      ctx.beginPath(); ctx.arc(wob, ysurf - 4, 4, 0, k.TAU); ctx.fill();
    }
    ctx.restore();
  },
};

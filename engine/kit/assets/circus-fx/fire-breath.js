// circus-fx/fire-breath — ateş püskürten.
// at anında (0.8 sn) ağızdan sağa katmanlı alev konisi + yükselen korlar
// ve glow; boşta nefes + göz kırpma, ağızda küçük kıvılcım hazırlığı.
// NOT: canvas y-aşağıdır; (0,0) sanatçının ayaklarıdır.
export default {
  name: 'fire-breath', category: 'circus-fx',
  desc: 'Sağa doğru alev püskürten sirk sanatçısı, kor parçacıklı',
  tags: ['ateş', 'alev', 'püskürtme', 'sirk', 'fire', 'breath', 'flame', 'circus', 'show'],
  box: [-130, -300, 235, 45],
  bleed: 50,
  anchor: 'sanatçının ayakları (0,0)',
  points: { mouth: [52, -222], head: [18, -228], foot: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'ateş püskürtme anı (0.8 sn alev konisi + korlar)' },
    color: { type: 'color', default: 'red', desc: 'kostüm rengi' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    const ad = p.at == null ? -1 : t - p.at;
    const firing = ad >= 0 && ad < 0.8;
    const env = firing ? Math.sin(k.clamp(ad / 0.8, 0, 1) * Math.PI) : 0;  // 0→1→0

    // zemin gölgesi
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(0, 6, 62, 11, 0, 0, k.TAU); ctx.fill();

    const br = Math.sin(t * k.TAU / 2.4) * 2;
    const blink = (t % 3.9) < 0.12;
    // ateş öncesi göğüs şişer (hazırlık nefesi)
    const inhale = (p.at != null && ad < 0 && ad > -0.4) ? Math.sin((ad + 0.4) / 0.4 * Math.PI) * 4 : 0;

    // bacaklar + ayaklar
    ctx.strokeStyle = k.rgba(acc, 0.85); ctx.lineWidth = 15;
    ctx.beginPath(); ctx.moveTo(-14, -100); ctx.lineTo(-18, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(14, -100); ctx.lineTo(20, 0); ctx.stroke();
    ctx.fillStyle = k.rgba('bg', 0.55);
    k.rrect(-34, -8, 32, 12, 4); ctx.fill();
    k.rrect(6, -8, 32, 12, 4); ctx.fill();

    // gövde
    ctx.fillStyle = k.rgba(acc, 0.9);
    k.rrect(-28, -196 + br * 0.4 - inhale * 0.4, 56 + inhale, 100, 16); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    k.rrect(-28, -196 + br * 0.4 - inhale * 0.4, 56 + inhale, 100, 16); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-12, -178, 12, 21, -0.35, 0, k.TAU); ctx.fill();

    // kol: meşale tutar gibi yana açık (sağ)
    ctx.strokeStyle = k.rgba(acc, 0.9); ctx.lineWidth = 13;
    ctx.beginPath(); ctx.moveTo(22, -168 + br * 0.4); ctx.quadraticCurveTo(52, -160, 66, -190); ctx.stroke();

    // kafa: sağa profilde
    const hy = -228 + br * 0.6;
    ctx.fillStyle = k.rgba('dim', 0.95);
    ctx.beginPath(); ctx.arc(18, hy, 31, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(18, hy, 31, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(7, hy - 11, 10, 7, -0.5, 0, k.TAU); ctx.fill();
    // tek göz (profil)
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 3;
    if (blink) {
      ctx.beginPath(); ctx.moveTo(26, hy - 8); ctx.lineTo(34, hy - 8); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.arc(30, hy - 8, 3.6, 0, k.TAU); ctx.stroke();
    }
    // ağız: ateş anında açık
    const mx = 52, my = -222 + br * 0.6;
    if (firing) {
      ctx.fillStyle = k.rgba('ink', 0.85);
      ctx.beginPath(); ctx.ellipse(mx, my, 8, 11, 0, 0, k.TAU); ctx.fill();
    } else {
      ctx.strokeStyle = k.rgba('ink', 0.75);
      ctx.beginPath(); ctx.arc(mx - 4, my - 4, 7, 0.5, Math.PI - 0.6); ctx.stroke();
    }

    // ALEV: katmanlı koni, titreme noise1 ile
    if (firing) {
      const L = 150 * env, W = 46 * env;
      const flick = k.noise1(ad * 14) * 10 * env;
      const layers = [
        { w: W, l: L, c: 'red', a: 0.85 },
        { w: W * 0.66, l: L * 0.78, c: 'yellow', a: 0.9 },
        { w: W * 0.36, l: L * 0.52, c: 'yellow', a: 0.95 },
      ];
      for (const ly of layers) {
        ctx.fillStyle = k.rgba(ly.c, ly.a);
        ctx.beginPath();
        ctx.moveTo(mx + 4, my - ly.w / 2);
        ctx.quadraticCurveTo(mx + ly.l * 0.55, my - ly.w * 0.42 + flick, mx + ly.l, my + flick * 0.4);
        ctx.quadraticCurveTo(mx + ly.l * 0.55, my + ly.w * 0.42 + flick, mx + 4, my + ly.w / 2);
        ctx.closePath(); ctx.fill();
      }
      // glow + kor parçacıkları
      k.glow(mx + L * 0.45, my, 90 * env, 'yellow', 0.35 * env);
      for (let i = 0; i < 9; i++) {
        const seed = k.hash(i * 13 + 3);
        const ep = (ad * 1.6 + seed) % 1;                 // 0→1 yükselir
        const ex = mx + 20 + seed * L * 0.9 + k.noise1(i * 7 + ad * 9) * 14;
        const ey = my - ep * (60 + seed * 50) + k.noise1(i * 3 + ad * 7) * 10;
        ctx.fillStyle = k.rgba(ep < 0.5 ? 'yellow' : 'red', (1 - ep) * 0.9 * env);
        ctx.beginPath(); ctx.arc(ex, ey, 3.5 * (1 - ep * 0.6), 0, k.TAU); ctx.fill();
      }
    }
    // ateş sonrası duman (0.5 sn)
    if (ad >= 0.8 && ad < 1.3) {
      const sd = (ad - 0.8) / 0.5;
      ctx.strokeStyle = k.rgba('dim', (1 - sd) * 0.5); ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(mx + 40, my - 10);
      ctx.quadraticCurveTo(mx + 80, my - 30 - sd * 30, mx + 110 + k.noise1(sd * 6) * 12, my - 50 - sd * 40);
      ctx.stroke();
    }

    ctx.restore();
  },
};

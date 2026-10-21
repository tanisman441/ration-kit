// traffic-fx/brake-skid — fren kayması: kayma izi bırakan tekerlek, at anında duman bulutu + kızaran fren diski.
// ANIMASYON: `at` anında 0.9 sn duman + kırmızı disk parlaması (jant kilitlenip dönmeyi durdurur);
// idle'da jant yavaşça döner, tekerlek hafif seker. Tek vurgu: red.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'brake-skid',
  category: 'traffic-fx',
  desc: 'Kayma izi bırakan fren yapan tekerlek; at anında duman bulutu ve kızaran fren diski',
  tags: ['fren', 'kayma', 'duman', 'tekerlek', 'jant', 'durma', 'ani fren', 'brake', 'skid', 'smoke', 'tire', 'wheel', 'stop'],
  box: [-120, -70, 120, 70],
  bleed: 50,
  anchor: 'tekerlek merkezi (30,8)',
  points: { wheel: [30, 8], smoke: [-40, -25] },
  params: {
    at: { type: 'time', default: null, desc: 'fren kayması anı: 0.9 sn duman + disk kızarması' },
    color: { type: 'color', default: 'ink', desc: 'lastik rengi' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const skidding = d >= 0 && d < 0.9;
    const WX = 30, WY = 8, R = 42;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // --- zemin ---
    ctx.strokeStyle = k.rgba('ink', 0.35);
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-115, 54); ctx.lineTo(115, 54); ctx.stroke();

    // --- kayma izi: tekerin arkasında iki çizgi (kayarken daha belirgin) ---
    const markA = skidding ? 0.75 : 0.3;
    ctx.strokeStyle = k.rgba('ink', markA);
    ctx.lineWidth = 7;
    for (const my of [46, 58]) {
      ctx.beginPath(); ctx.moveTo(-115, my); ctx.lineTo(WX - R + 4, my); ctx.stroke();
    }

    // --- duman (sadece at anında) ---
    if (skidding) {
      for (let i = 0; i < 6; i++) {
        const life = d - i * 0.07;
        if (life < 0) continue;
        const q = k.prog(life, 0, 0.75);
        const px = WX - 18 - i * 13 + (k.hash(i * 7 + 1) - 0.5) * 10;
        const py = WY - 26 - 42 * q;
        const s = (13 + i * 2.5) * (0.6 + q * 0.8);
        ctx.fillStyle = k.rgba('dim', 0.5 * (1 - q));
        ctx.beginPath(); ctx.arc(px, py, s, 0, k.TAU); ctx.fill();
      }
    }

    // --- tekerlek: zıplama + sağ alt gölge ---
    const bounce = skidding ? Math.sin(d * 25) * 2 : k.noise1(t * 1.8) * 1.5;
    const by = WY + bounce;
    ctx.fillStyle = k.rgba('bg', 0.15); // yere düşen gölge
    ctx.beginPath(); ctx.ellipse(WX + 6, 58, 46, 8, 0, 0, k.TAU); ctx.fill();

    ctx.fillStyle = k.rgba('bg', 0.12); // sağ alt gölge
    ctx.beginPath(); ctx.arc(WX + 6, by + 6, R, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);    // lastik
    ctx.beginPath(); ctx.arc(WX, by, R, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('#ffffff', 0.10); // sol üst parlama
    ctx.beginPath(); ctx.ellipse(WX - 14, by - 17, 12, 18, 0.5, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.6);    // kontur
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(WX, by, R, 0, k.TAU); ctx.stroke();

    // --- jant: kayarken kilitlenir (dönmez), idle'da yavaş döner ---
    const spin = skidding ? 0 : t * 0.8;
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); ctx.arc(WX, by, 26, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.6);
    ctx.lineWidth = 5;
    for (let s = 0; s < 5; s++) {
      const a = spin + (s / 5) * k.TAU;
      ctx.beginPath();
      ctx.moveTo(WX, by);
      ctx.lineTo(WX + Math.cos(a) * 23, by + Math.sin(a) * 23);
      ctx.stroke();
    }

    // --- fren diski: at anında kızarır ---
    const heat = skidding ? 1 - d / 0.9 : 0;
    if (heat > 0) k.glow(WX, by, 26, 'red', 0.5 * heat);
    ctx.fillStyle = k.rgba('red', 0.35 + 0.65 * heat);
    ctx.beginPath(); ctx.arc(WX, by, 11, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.6);
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(WX, by, 11, 0, k.TAU); ctx.stroke();
  },
};

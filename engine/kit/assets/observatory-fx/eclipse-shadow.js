// observatory-fx/eclipse-shadow — `at` anında ay güneşin önünden geçer, gölge geçişi + korona parlaması. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) güneş diskinin merkezi.
export default {
  name: 'eclipse-shadow', category: 'observatory-fx',
  desc: 'Güneş tutulması: ay soldan gelip güneşi kapatır, tam tutulma anında korona parlar, sonra güneş geri döner',
  tags: ['tutulma', 'güneş tutulması', 'ay', 'korona', 'gölge', 'eclipse', 'solar eclipse', 'corona', 'moon', 'shadow'],
  box: [-120, -110, 120, 110],
  bleed: 40,
  anchor: 'güneş diskinin merkezi (0,0)',
  points: { sun: [0, 0], corona: [0, -62] },
  params: {
    color: { type: 'color', default: 'yellow' },
    at: { type: 'time', default: null, desc: 'tutulma anı — ay güneşin tam önünden geçer, korona parlar (1.2 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    // ay soldan sağa kayar; at anında güneşin tam üstünde; kutu dışına taşmasın diye kenarda söner
    const moonX = p.at == null ? -170 : k.clamp(d * 130, -100, 100);
    const moonA = p.at == null ? 0 : k.clamp(1 - (Math.abs(moonX) - 78) / 22, 0, 1);
    const dist = Math.abs(moonX);
    const cover = k.clamp(1 - dist / 118, 0, 1); // 0 = açık güneş, 1 = tam tutulma
    const R = 62;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // korona halesi (tam tutulmaya yaklaşınca belirir)
    const coronaA = k.clamp((cover - 0.55) / 0.45, 0, 1);
    if (coronaA > 0) {
      k.glow(0, 0, 120, 'yellow', coronaA * 0.45);
      // korona ışınları: düzensiz, dışa uzanan ince çizgiler
      ctx.strokeStyle = k.rgba('yellow', coronaA * 0.85); ctx.lineWidth = 3;
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * k.TAU + k.hash(i) * 0.3;
        const len = 78 + k.hash(i + 30) * 26;
        const wob = 1 + 0.06 * Math.sin(t * 3 + i);
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * (R + 4), Math.sin(a) * (R + 4));
        ctx.lineTo(Math.cos(a) * len * wob, Math.sin(a) * len * wob);
        ctx.stroke();
      }
    }

    // güneş ışınları: yavaşça döner, tutulmayla söner (idle)
    const rayA = 0.75 * (1 - cover * 0.85);
    if (rayA > 0.03) {
      ctx.strokeStyle = k.rgba('yellow', rayA); ctx.lineWidth = 5;
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * k.TAU + t * 0.06;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * (R + 8), Math.sin(a) * (R + 8));
        ctx.lineTo(Math.cos(a) * (R + 24), Math.sin(a) * (R + 24));
        ctx.stroke();
      }
    }

    // güneş diski: tutulmayla kararır
    const sunA = 1 - cover * 0.8;
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); ctx.arc(4, 5, R, 0, k.TAU); ctx.fill();
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 0, R + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, sunA);
    ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.fill();
    // premium parlama (sol üst) — tutulma dışında
    if (sunA > 0.4) {
      ctx.fillStyle = `rgba(255,255,255,${0.10 * sunA})`;
      ctx.beginPath(); ctx.ellipse(-24, -28, 18, 12, -0.5, 0, k.TAU); ctx.fill();
    }
    // güneş yüzü: hafif benekler (idle nabız)
    ctx.fillStyle = k.rgba('red', 0.25 * (1 - cover));
    for (let i = 0; i < 5; i++) {
      const bx = (k.hash(i + 50) - 0.5) * 70;
      const by = (k.hash(i + 60) - 0.5) * 70;
      ctx.beginPath(); ctx.arc(bx, by, 5 + 2 * Math.sin(t * 2 + i), 0, k.TAU); ctx.fill();
    }

    // ay diski: koyu, bg kenarlıklı; güneşin üstünden kayar (kenarda söner)
    if (moonA > 0.02) {
      ctx.fillStyle = k.rgba('bg', 0.32 * moonA);
      ctx.beginPath(); ctx.arc(moonX + 4, 5, 58, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('bg', 0.55 * moonA);
      ctx.beginPath(); ctx.arc(moonX, 0, 58 + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('dim', moonA);
      ctx.beginPath(); ctx.arc(moonX, 0, 58, 0, k.TAU); ctx.fill();
      // ay kraterleri (koyu disk üstünde hafif görünür)
      ctx.fillStyle = k.rgba('ink', 0.4 * moonA);
      for (let i = 0; i < 4; i++) {
        const cx = moonX + (k.hash(i + 80) - 0.5) * 60;
        const cy = (k.hash(i + 90) - 0.5) * 60;
        ctx.beginPath(); ctx.arc(cx, cy, 5 + k.hash(i) * 4, 0, k.TAU); ctx.fill();
      }
      // tam tutulma anında ay kenarında ince ışık halkası
      if (coronaA > 0) {
        ctx.strokeStyle = k.rgba('yellow', coronaA * moonA);
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(moonX, 0, 58, 0, k.TAU); ctx.stroke();
      }
    }
  },
};

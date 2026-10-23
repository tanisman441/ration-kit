// combat-hits-2/rage-aura — öfke aurası: sıkılmış yumruk çevresinde yükselen alev dilleri.
// charge 0-1 alev boyunu/yoğunluğunu yönetir; alevler boşta sürekli titrer (noise tabanlı).
// NOT: canvas y-aşağıdır; (0,0) yumruğun merkezi (aura bu merkezden yükselir).
export default {
  name: 'rage-aura', category: 'combat-hits-2',
  desc: 'Öfke aurası: charge ile büyüyen, boşta sürekli titreyen alevler içinde sıkılmış yumruk',
  tags: ['öfke', 'aura', 'alev', 'şarj', 'güç', 'yumruk', 'kızgınlık', 'rage', 'aura', 'flame', 'charge', 'power', 'fist'],
  box: [-120, -150, 120, 150],
  bleed: 70,
  anchor: 'yumruğun merkezi (0,0)',
  points: { fist: [0, 10], top: [0, -100] },
  params: {
    charge: { type: 'number', default: 0.5, desc: 'öfke yoğunluğu 0-1 (alev boyu, sayısı, parlama)' },
    color: { type: 'color', default: 'red' },
  },
  draw(ctx, t, p, k) {
    const ch = k.clamp(p.charge, 0, 1);
    ctx.save();

    // 1) alev dilleri — yumruğun arkasında, charge ile boy/sayı/şiddet artar
    const flames = 4 + Math.round(ch * 3);                 // 4-7 dil
    for (let i = 0; i < flames; i++) {
      const h1 = k.hash(i * 7 + 303), h2 = k.hash(i * 13 + 151);
      const spread = (i / (flames - 1) - 0.5) * 2;        // -1..1
      const fx = spread * (46 + 10 * h1);
      // titreme — boşta canlı hareket: noise ile kıvrımlı sallanma
      const wob = k.noise1(t * (2.2 + h2 * 1.5) + i * 9) * (8 + 10 * ch);
      const tipY = -58 - ch * (58 + h2 * 46) - h1 * 14 + wob * 0.5;
      const baseW = (13 + h1 * 9) * (0.75 + 0.5 * ch);
      const tipX = fx + wob * 1.6;
      const alpha = 0.4 + 0.32 * ch * (0.7 + 0.3 * h2);
      // dış alev — damla formu
      ctx.fillStyle = k.rgba(p.color, alpha);
      ctx.beginPath();
      ctx.moveTo(fx - baseW, 44);
      ctx.quadraticCurveTo(fx - baseW * 1.25, (44 + tipY) / 2, tipX, tipY);
      ctx.quadraticCurveTo(fx + baseW * 1.25, (44 + tipY) / 2, fx + baseW, 44);
      ctx.closePath();
      ctx.fill();
      // iç alev — daha dar, daha parlak (aynı vurgu rengi)
      ctx.fillStyle = k.rgba(p.color, alpha * 0.9);
      ctx.beginPath();
      ctx.moveTo(fx - baseW * 0.45, 44);
      ctx.quadraticCurveTo(fx - baseW * 0.55, (44 + tipY) / 2 + 10, tipX * 0.92, tipY + 22);
      ctx.quadraticCurveTo(fx + baseW * 0.55, (44 + tipY) / 2 + 10, fx + baseW * 0.45, 44);
      ctx.closePath();
      ctx.fill();
    }
    // alev altı parlaması
    if (ch > 0.05) k.glow(0, -40, 60 + 60 * ch, p.color, 0.16 + 0.18 * ch);

    // 2) yükselen korlar — charge arttıkça daha çok
    const embers = Math.round(ch * 8);
    for (let i = 0; i < embers; i++) {
      const h1 = k.hash(i * 17 + 407), h2 = k.hash(i * 23 + 503);
      const cyc = ((t * (0.5 + h2 * 0.7) + h1) % 1 + 1) % 1;   // yükselen döngü
      const ex = (h1 - 0.5) * 130 + k.noise1(t * 3 + i * 5) * 12;
      const ey = -40 - cyc * (110 + h2 * 60);
      const er = 2.5 + h2 * 3.5;
      ctx.fillStyle = k.rgba(p.color, 0.75 * (1 - cyc));
      ctx.beginPath(); ctx.arc(ex, ey, er, 0, k.TAU); ctx.fill();
    }

    // 3) yumruk — sıkılmış, önden görünüm (dim gövde)
    // sağ alt gölge — %12 koyultma, 6 birim offset
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(-46 + 6, -12 + 6, 92, 58, 20); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.beginPath(); k.rrect(-46, -12, 92, 58, 20); ctx.fill();
    // eklem çıkıntıları — 4 parmak
    for (let i = 0; i < 4; i++) {
      const kx = -34.5 + i * 23;
      ctx.beginPath(); ctx.arc(kx, -10, 13.5, 0, k.TAU); ctx.fill();
    }
    // başparmak — solda kıvrım
    ctx.beginPath();
    ctx.ellipse(-44, 30, 13, 22, 0.5, 0, k.TAU);
    ctx.fill();
    // bilek
    ctx.beginPath(); k.rrect(-32, 42, 64, 46, 12); ctx.fill();
    // sol üst parlama — beyaz alfa 0.10, kontursuz
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(-26, -2, 30, 16, -0.45, 0, k.TAU); ctx.fill();
    // dış hat — bg alfa 0.55
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 5;
    ctx.beginPath(); k.rrect(-46, -12, 92, 58, 20); ctx.stroke();
    ctx.lineWidth = 4;
    ctx.beginPath(); k.rrect(-32, 42, 64, 46, 12); ctx.stroke();
    // parmak ayrım çizgileri — ink alfa 0.35
    ctx.strokeStyle = k.rgba('ink', 0.35);
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const kx = -23 + i * 23;
      ctx.beginPath(); ctx.moveTo(kx, -6); ctx.lineTo(kx, 14); ctx.stroke();
    }

    ctx.restore();
  },
};

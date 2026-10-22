// garden-fx/mower-pass — yandan çim biçme makinesi; tekerlekler döner, çim püskürür,
// pass anında ileri hamle + kesme atağı (0.6 sn).
// NOT: canvas y-aşağıdır; makine sağa bakar, zemin y=70.
export default {
  name: 'mower-pass', category: 'garden-fx',
  desc: 'Yandan çim biçme makinesi: dönen tekerlekler, savrulan çim kırpıntıları; pass anında ileri hamle yapar',
  tags: ['çim biçme', 'çimen', 'bahçe', 'çimen biçme makinesi', 'lawn mower', 'mower', 'garden', 'çim'],
  box: [-150, -100, 150, 90],
  bleed: 30,
  anchor: 'zemin (y=70), gövde merkezi',
  points: { deck: [0, 27], handle: [-110, -55] },
  params: {
    color: { type: 'color', default: 'red', desc: 'makine gövde rengi' },
    pass: { type: 'time', default: null, desc: 'biçme atağı: ileri hamle + çim püskürmesi (0.6 sn)' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };

    const d = p.pass == null ? -1 : t - p.pass;
    const attacking = d >= 0 && d < 0.6;
    const lurch = attacking ? Math.sin(Math.PI * d / 0.6) : 0;
    const dx = lurch * 30;
    const vib = k.noise1(t * 9) * 1.6;

    // çim: solda kısa (biçilmiş), sağda uzun (biçilecek)
    const blade = (x, h, sway) => {
      ctx.strokeStyle = k.rgba('green', 0.95); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(x, 72);
      ctx.quadraticCurveTo(x + sway, 72 - h * 0.6, x + sway * 1.8, 72 - h); ctx.stroke();
    };
    for (let i = 0; i < 30; i++) {
      const x = -148 + i * 10.2 + (k.hash(i * 3.3) - 0.5) * 5;
      const h = x > 45 ? 24 + k.hash(i * 7.7) * 12 : 9 + k.hash(i * 7.7) * 5;
      blade(x, h, Math.sin(t * 2.2 + i * 1.1) * 3);
    }

    ctx.save(); ctx.translate(dx, vib);
    // sap (handle) — serbest çizgi: ink
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(-58, 14); ctx.lineTo(-108, -52); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-108, -52); ctx.lineTo(-92, -58); ctx.stroke();

    // gövde (deck)
    ctx.fillStyle = line; k.rrect(-73, 9, 134, 36, 13); ctx.fill();
    ctx.fillStyle = darker(p.color); k.rrect(-73 + 5, 9 + 6, 134, 36, 13); ctx.fill();
    ctx.fillStyle = k.rgba(p.color); k.rrect(-73, 9, 134, 36, 13); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-30, 17, 30, 6, -0.1, 0, k.TAU); ctx.fill();
    // motor kutusu
    ctx.fillStyle = line; k.rrect(-46, -20, 52, 32, 9); ctx.fill();
    ctx.fillStyle = darker('dim'); k.rrect(-46 + 4, -20 + 5, 52, 32, 9); ctx.fill();
    ctx.fillStyle = k.rgba('dim'); k.rrect(-46, -20, 52, 32, 9); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-32, -12, 13, 3.6, -0.15, 0, k.TAU); ctx.fill();
    // motor kapağı çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-38, -8); ctx.lineTo(2, -8); ctx.stroke();

    // tekerlekler (dönen kollu)
    const wheel = (x, y, r) => {
      const spin = t * (4 + lurch * 14);
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(x, y, r + 3, 0, k.TAU); ctx.fill();
      ctx.fillStyle = darker('ink'); ctx.beginPath(); ctx.arc(x + 3, y + 4, r, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('ink', 0.92); ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('dim', 0.85); ctx.lineWidth = 4.5;
      for (let s = 0; s < 4; s++) {
        const a = spin + s * Math.PI / 2;
        ctx.beginPath(); ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(a) * (r - 6), y + Math.sin(a) * (r - 6)); ctx.stroke();
      }
      ctx.fillStyle = k.rgba('dim'); ctx.beginPath(); ctx.arc(x, y, 5, 0, k.TAU); ctx.fill();
    };
    wheel(-42, 56, 24);
    wheel(36, 60, 17);

    // biçme ağzı (önde, bıçak parıltısı)
    ctx.fillStyle = k.rgba('bg', 0.6);
    k.rrect(52, 30, 16, 22, 5); ctx.fill();
    ctx.fillStyle = k.rgba('yellow', attacking ? 1 : 0.55);
    k.rrect(56, 34, 8, 14, 3); ctx.fill();
    ctx.restore();

    // çim kırpıntıları (sürekli)
    const chip = (x, y, r, alpha) => {
      ctx.fillStyle = k.rgba('green', alpha);
      ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.55, 0.6, 0, k.TAU); ctx.fill();
    };
    const n = attacking ? 26 : 12;
    for (let j = 0; j < n; j++) {
      const h1 = k.hash(j * 9.17), h2 = k.hash(j * 4.53 + 3), h3 = k.hash(j * 6.71 + 7);
      const speed = attacking ? 1.6 : 1;
      const age = ((t * speed + h1 * 1.1) % 1.1);
      const vx = -(28 + h2 * 44) * (attacking ? 1.4 : 1);
      const vy = -(50 + h3 * 50);
      const px = -62 + dx + vx * age, py = 30 + vib + vy * age + 130 * age * age;
      if (py > 78) continue;
      chip(px, py, 2.5 + h1 * 2.5, 0.9 * (1 - age / 1.1));
    }
    // atak anında toz bulutu
    if (attacking) {
      const f = 1 - d / 0.6;
      ctx.fillStyle = k.rgba('dim', 0.4 * f);
      ctx.beginPath(); ctx.ellipse(-40 + dx, 64, 26 * f + 10, 12 * f + 4, 0, 0, k.TAU); ctx.fill();
    }
  },
};

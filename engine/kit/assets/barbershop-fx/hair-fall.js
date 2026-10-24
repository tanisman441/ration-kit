// barbershop-fx/hair-fall — başın üstünde kesilen saç telleri; `at` anında kopup yere düşer, sönümlenir. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) başın merkezi.
export default {
  name: 'hair-fall', category: 'barbershop-fx',
  desc: 'Başın üstündeki saç telleri kesim anında kopup salınarak yere düşer',
  tags: ['saç', 'kesim', 'berber', 'saç dökülmesi', 'hair', 'falling', 'barber', 'haircut', 'strands', 'salon'],
  box: [-120, -125, 120, 110],
  bleed: 35,
  anchor: 'başın merkezi (0,0); zemin y=100',
  points: { head: [0, -60], floor: [0, 100], strands: [0, -112] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'kesim anı — saç telleri kopup düşer (1.2 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const skin = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const falling = d >= 0 && d < 1.2;
    const progAll = d < 0 ? 0 : k.clamp(d / 1.2, 0, 1);
    const br = Math.sin(t * k.TAU / 2.6) * 1.5; // nefes
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // zemin çizgisi (gövdenin altında)
    ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-110, 100); ctx.lineTo(110, 100); ctx.stroke();

    // omuzlar
    blob(-72, 6, 144, 74, 22, skin);
    // boyun
    blob(-18, -18, 36, 30, 10, skin);
    // baş
    disc(0, -58 + br * 0.4, 54, 52, skin);
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-28, -82, 15, 9, -0.4, 0, k.TAU); ctx.fill();
    // saç şapkası (üstte kalan saç)
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); ctx.ellipse(0, -84, 48, 26, 0, Math.PI, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-47, -70, 8, 12, 0.3, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(47, -70, 8, 12, -0.3, 0, k.TAU); ctx.fill();
    // yüz: gözler + gülümseme
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.ellipse(-18, -58, 5, 5, 0, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(18, -58, 5, 5, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = inkC; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, -40, 12, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();

    // saç telleri: saç şapkasının kenarından yelpaze gibi çıkar, kesimde yana savrulup yere düşer
    const N = 7;
    for (let i = 0; i < N; i++) {
      const fi = i / (N - 1); // 0..1 soldan sağa
      const ang = -0.55 + fi * 1.1; // dışa açılan yelpaze
      const hx = Math.sin(ang) * 40;
      const hy = -84 - Math.cos(ang) * 22;
      const len = 10 + k.hash(i + 70) * 6;
      const ex = hx + Math.sin(ang) * len, ey = hy - Math.cos(ang) * len;
      const delay = k.hash(i + 80) * 0.35;
      const fp = k.clamp((d - delay) / 0.9, 0, 1);
      if (d < 0 || fp <= 0) {
        // hâlâ başta: hafif salınım (idle)
        const sway = k.noise1(t * 1.4 + i * 2.1) * 2.5;
        ctx.strokeStyle = k.rgba('ink', 0.9); ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.moveTo(hx, hy);
        ctx.quadraticCurveTo(hx + Math.sin(ang) * len * 0.6 + sway, hy - Math.cos(ang) * len * 0.6, ex + sway, ey);
        ctx.stroke();
      } else {
        // düşüyor: yerçekimi + yana savrulma + salınım + sönüm
        const fall = fp * fp * 195;
        const drift = Math.sign(hx || 1) * fp * 26;
        const sway = Math.sin(fp * 9 + i * 2.4) * 8 * (1 - fp * 0.5);
        const y = hy + fall;
        const alpha = 0.9 * (1 - fp * 0.75);
        ctx.strokeStyle = k.rgba('ink', alpha); ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.moveTo(hx + drift + sway, y);
        ctx.quadraticCurveTo(hx + drift + sway + 3, y + len * 0.6, hx + drift + sway + 5, y + len);
        ctx.stroke();
      }
    }

    // yere düşen tellerin biriktiği küçük yığın (kesim sonrası, gövdenin altında)
    if (progAll > 0.55) {
      const a = k.clamp((progAll - 0.55) / 0.45, 0, 1);
      ctx.strokeStyle = k.rgba('ink', 0.75 * a); ctx.lineWidth = 3.5;
      for (let i = 0; i < 6; i++) {
        const px = -40 + i * 15 + k.hash(i + 90) * 6;
        ctx.beginPath(); ctx.moveTo(px, 98); ctx.quadraticCurveTo(px + 6, 94, px + 12, 98); ctx.stroke();
      }
    }
    void falling;
  },
};

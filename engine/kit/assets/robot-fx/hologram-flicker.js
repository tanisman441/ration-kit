// robot-fx/hologram-flicker — titreşen hologram projeksiyonu. Contract: engine/kit/ASSETS.md
export default {
  name: 'hologram-flicker', category: 'robot-fx',
  desc: 'Projektörden yükselen mavi ışık konisi içinde süzülen titreşen hologram küp',
  tags: ['hologram', 'projeksiyon', '3d', 'küp', 'flicker', 'titreme', 'ışık konisi', 'sanal', 'teknoloji', 'cyber'],
  box: [-150, -165, 150, 70],
  bleed: 24,
  anchor: 'projektör tabanı (0,50)',
  points: { projector: [0, 52], image: [0, -64] },
  params: {
    color: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    const bw = 300, LW = Math.round(bw * 0.03);
    const line = k.rgba('bg', 0.55), bodyC = k.rgba(p.color);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.save();

    // titreşim: gürültü tabanlı parlaklık + ara ara kısa kesinti
    const drop = k.hash(Math.floor(t * 6)) < 0.10 ? 0.30 : 1;
    const flick = (0.72 + 0.28 * (0.5 + 0.5 * k.noise1(t * 9))) * drop;
    const acc = (a) => k.rgba(p.color, a * flick);

    // ışık konisi: tabandan yukarı genişleyen yarı saydam koni + yatay tarama çizgileri
    const coneY0 = 30, coneY1 = -130, cx0 = 26, cx1 = 100;
    ctx.fillStyle = acc(0.10);
    ctx.beginPath();
    ctx.moveTo(-cx0, coneY0); ctx.lineTo(cx0, coneY0);
    ctx.lineTo(cx1, coneY1); ctx.lineTo(-cx1, coneY1);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = acc(0.38); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-cx0, coneY0); ctx.lineTo(-cx1, coneY1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx0, coneY0); ctx.lineTo(cx1, coneY1); ctx.stroke();
    for (let i = 0; i < 4; i++) {
      const yy = k.lerp(coneY0 - 18, coneY1 + 18, i / 3);
      const wob = Math.sin(t * 3 + i * 1.7) * 4;
      const half = k.lerp(cx0 + 8, cx1 - 8, i / 3);
      ctx.strokeStyle = acc(0.22); ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(-half + wob, yy); ctx.lineTo(half + wob, yy); ctx.stroke();
    }

    // yükselen ışık parçacıkları
    for (let i = 0; i < 6; i++) {
      const h = k.hash(i * 13 + 3);
      const yy = coneY0 - 8 - ((t * 34 + h * 150) % 148);
      const xx = (h - 0.5) * 110 * k.clamp((coneY0 - yy) / 160, 0.2, 1);
      ctx.fillStyle = acc(0.55 * (1 - (coneY0 - yy) / 170));
      ctx.beginPath(); ctx.arc(xx, yy, 2.6, 0, k.TAU); ctx.fill();
    }

    // süzülen küp: ön yüz + ofset arka yüz, yavaş sözde-3B dönüş
    const cy = -62 + Math.sin(t * k.TAU / 3) * 6;
    const spin = Math.sin(t * 0.55);
    const s = 42, off = 15 + spin * 9;
    const fx = -s / 2, fy = cy - s / 2;
    ctx.strokeStyle = acc(0.85); ctx.lineWidth = 4;
    // arka yüz
    ctx.strokeStyle = acc(0.45);
    ctx.beginPath(); k.rrect(fx + off, fy - off, s, s, 8); ctx.stroke();
    // bağlantı köşeleri
    ctx.strokeStyle = acc(0.55); ctx.lineWidth = 3;
    const cn = [[fx, fy], [fx + s, fy], [fx, fy + s], [fx + s, fy + s]];
    ctx.beginPath();
    for (const [px, py] of cn) { ctx.moveTo(px, py); ctx.lineTo(px + off, py - off); }
    ctx.stroke();
    // ön yüz
    ctx.strokeStyle = acc(0.95); ctx.lineWidth = 5;
    ctx.beginPath(); k.rrect(fx, fy, s, s, 8); ctx.stroke();
    ctx.fillStyle = acc(0.12);
    ctx.beginPath(); k.rrect(fx, fy, s, s, 8); ctx.fill();
    k.glow(fx + s / 2, cy, 30, p.color, 0.30 * flick);

    // projektör tabanı: dış hat + dolgu + parlama
    const px = -62, py = 30, pw = 124, ph = 32, pr = 12;
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(px + 6, py + 6, pw, ph, pr); ctx.fill();
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(px - LW / 2, py - LW / 2, pw + LW, ph + LW, pr + LW / 2); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(px, py, pw, ph, pr); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(px + pw * 0.32, py + 9, pw * 0.28, 7, -0.2, 0, k.TAU); ctx.fill();
    // mercek: nabız gibi parlar
    const pulse = 0.7 + 0.3 * Math.sin(t * k.TAU / 1.2);
    k.glow(0, py - 2, 16, p.color, 0.45 * pulse * flick);
    ctx.fillStyle = acc(0.95);
    ctx.beginPath(); ctx.arc(0, py - 2, 7, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};

// library-fx/bookmark-slide — açık kitabın sayfasında ayraç yukarıdan aşağı kayar.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) = kitap merkezi.
export default {
  name: 'bookmark-slide', category: 'library-fx',
  desc: 'Açık kitabın sağ sayfasında kurdele ayraç at anında yukarıdan aşağı kayar',
  tags: ['kitap', 'ayraç', 'kütüphane', 'sayfa', 'okuma', 'book', 'bookmark', 'ribbon', 'library', 'reading'],
  box: [-170, -125, 170, 125],
  bleed: 35,
  anchor: 'kitap merkezi (iki sayfa arası)',
  points: { top: [45, -85], bottom: [45, 65], spine: [0, 0] },
  params: {
    color: { type: 'color', default: 'red' },
    at: { type: 'time', default: null, desc: 'ayracın kayma anı (0.8 sn: yukarıdan aşağı kayış)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const sliding = d >= 0 && d < 0.8;
    const done = d >= 0.8;
    let ry = -85;
    if (p.at != null && d >= 0) {
      const pr = Math.min(1, d / 0.8);
      const ease = 1 - Math.pow(1 - pr, 2);
      ry = k.lerp(-85, 20, ease);
    } else if (p.at == null) {
      ry = -85 + k.noise1(t * 0.7) * 3;
    }
    const sway = sliding ? Math.sin((d / 0.8) * Math.PI) * 6 : k.noise1(t * 1.1 + 5) * 3;
    ctx.lineCap = 'round';
    ctx.save();
    ctx.fillStyle = k.rgba('ink', 0.12); ctx.beginPath(); k.rrect(-154, -104, 320, 220, 14); ctx.fill();
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-160, -110, 320, 220, 14); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 1); ctx.beginPath(); k.rrect(-156, -106, 312, 212, 14); ctx.fill();
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-148, -98, 148, 196, 10); ctx.fill();
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(0, -98, 148, 196, 10); ctx.fill();
    ctx.fillStyle = k.rgba('panel2', 1); ctx.beginPath(); k.rrect(-144, -94, 144, 188, 10); ctx.fill();
    ctx.fillStyle = k.rgba('panel2', 1); ctx.beginPath(); k.rrect(4, -94, 140, 188, 10); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-110, -70, 26, 12, -0.4, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
      const yy = -60 + i * 22;
      ctx.beginPath(); ctx.moveTo(-124, yy); ctx.lineTo(-30, yy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(24, yy); ctx.lineTo(124, yy); ctx.stroke();
    }
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0, -94); ctx.lineTo(0, 94); ctx.stroke();
    const rx = 45 + sway;
    ctx.save();
    ctx.translate(rx, ry);
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-13, -6, 26, 78, 6); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1); ctx.beginPath(); k.rrect(-10, -3, 20, 72, 6); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath(); ctx.moveTo(-10, 62); ctx.lineTo(0, 50); ctx.lineTo(10, 62); ctx.lineTo(10, 69); ctx.lineTo(-10, 69); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-4, 8, 5, 16, -0.2, 0, k.TAU); ctx.fill();
    ctx.restore();
    if (sliding) {
      const pg = d / 0.8;
      ctx.strokeStyle = k.rgba(p.color, 0.45 * (1 - pg));
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(45, -85); ctx.lineTo(45, ry); ctx.stroke();
    }
    if (done && d < 1.3) {
      const pg = (d - 0.8) / 0.5;
      ctx.strokeStyle = k.rgba(p.color, 0.6 * (1 - pg));
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(45, 55, 14 + pg * 22, 0, k.TAU); ctx.stroke();
    }
    ctx.restore();
  },
};

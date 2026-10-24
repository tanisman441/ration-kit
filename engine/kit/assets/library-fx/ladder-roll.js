// library-fx/ladder-roll — kütüphane merdiveni ray boyunca yana kayar, tekerlekler döner.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) = merdiven merkezi.
export default {
  name: 'ladder-roll', category: 'library-fx',
  desc: 'Kitaplık merdiveni at anında ray boyunca yana kayar, tekerlekleri döner',
  tags: ['merdiven', 'kütüphane', 'kitaplık', 'ray', 'tekerlek', 'ladder', 'library', 'shelf', 'roll', 'bookshelf'],
  box: [-185, -165, 185, 165],
  bleed: 40,
  anchor: 'merdiven merkezi',
  points: { rail: [0, -140] },
  params: {
    color: { type: 'color', default: 'ink' },
    at: { type: 'time', default: null, desc: 'merdivenin kayma anı (0.9 sn: yana kayış + tekerlek dönüşü)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const rolling = d >= 0 && d < 0.9;
    const done = d >= 0.9;
    let lx = -55;
    if (p.at != null && d >= 0) {
      const pr = Math.min(1, d / 0.9);
      const ease = 1 - Math.pow(1 - pr, 3);
      lx = k.lerp(-55, 55, ease);
    } else if (p.at == null) {
      lx = -55 + k.noise1(t * 0.6) * 2;
    }
    const bounce = rolling ? Math.abs(Math.sin((d / 0.9) * Math.PI * 3)) * 3 * (1 - d / 0.9) : 0;
    const wheelRot = (lx + 55) * 0.06;
    ctx.lineCap = 'round';
    ctx.save();
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-180, -150, 90, 300, 10); ctx.fill();
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(90, -150, 90, 300, 10); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 1); ctx.beginPath(); k.rrect(-176, -146, 82, 292, 10); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 1); ctx.beginPath(); k.rrect(94, -146, 82, 292, 10); ctx.fill();
    for (let s = 0; s < 3; s++) {
      const yy = -120 + s * 95;
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = k.rgba(i % 2 ? 'panel2' : 'ink', 0.85);
        ctx.beginPath(); k.rrect(-168 + i * 26, yy, 18, 55, 4); ctx.fill();
        ctx.fillStyle = k.rgba(i % 2 ? 'panel2' : 'ink', 0.85);
        ctx.beginPath(); k.rrect(102 + i * 26, yy, 18, 55, 4); ctx.fill();
      }
    }
    ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(-180, -140); ctx.lineTo(180, -140); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-180, 150); ctx.lineTo(180, 150); ctx.stroke();
    ctx.save();
    ctx.translate(lx, -bounce);
    ctx.fillStyle = k.rgba('ink', 0.12); ctx.beginPath(); k.rrect(-58, -134, 116, 270, 10); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 16;
    ctx.beginPath(); ctx.moveTo(-55, -130); ctx.lineTo(-55, 130); ctx.moveTo(55, -130); ctx.lineTo(55, 130); ctx.stroke();
    ctx.strokeStyle = k.rgba(p.color, 1); ctx.lineWidth = 12;
    ctx.beginPath(); ctx.moveTo(-55, -130); ctx.lineTo(-55, 130); ctx.moveTo(55, -130); ctx.lineTo(55, 130); ctx.stroke();
    for (let i = 0; i < 5; i++) {
      const yy = -95 + i * 52;
      ctx.strokeStyle = line; ctx.lineWidth = 12;
      ctx.beginPath(); ctx.moveTo(-55, yy); ctx.lineTo(55, yy); ctx.stroke();
      ctx.strokeStyle = k.rgba('panel2', 1); ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(-55, yy); ctx.lineTo(55, yy); ctx.stroke();
    }
    ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(-55, -130); ctx.quadraticCurveTo(-55, -152, -40, -148); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(55, -130); ctx.quadraticCurveTo(55, -152, 70, -148); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-55, -100, 8, 22, 0, 0, k.TAU); ctx.fill();
    for (const wx of [-55, 55]) {
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(wx, 142, 16, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('ink', 1); ctx.beginPath(); ctx.arc(wx, 142, 12, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('panel2', 1); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(wx, 142);
      ctx.lineTo(wx + Math.cos(wheelRot) * 10, 142 + Math.sin(wheelRot) * 10); ctx.stroke();
    }
    ctx.restore();
    if (rolling) {
      const pg = d / 0.9;
      for (let i = 0; i < 6; i++) {
        const px = lx - 60 + k.hash(i * 7 + 1) * 20 - pg * 10;
        ctx.fillStyle = k.rgba('dim', 0.5 * (1 - pg));
        ctx.beginPath(); ctx.arc(px, 144 - k.hash(i * 11 + 2) * 8, 3 + k.hash(i * 13 + 3) * 3, 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore();
  },
};

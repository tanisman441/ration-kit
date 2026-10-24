// library-fx/stamp-due — kütüphane mührü at anında karta basılır, kırmızı mühür izi belirir.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) = kart merkezi.
export default {
  name: 'stamp-due', category: 'library-fx',
  desc: 'Kütüphane mührü at anında kartın üstüne basılır, kırmızı mühür izi ve sarsıntı oluşur',
  tags: ['mühür', 'damga', 'kütüphane', 'kart', 'iade', 'stamp', 'library', 'due', 'card', 'ink'],
  box: [-170, -145, 170, 145],
  bleed: 45,
  anchor: 'kart merkezi',
  points: { card: [0, 55], stamp: [0, -100] },
  params: {
    color: { type: 'color', default: 'red' },
    at: { type: 'time', default: null, desc: 'mührün basma anı (0.5 sn: iniş + iz + sarsıntı)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const stamping = d >= 0 && d < 0.5;
    const done = d >= 0.5;
    let sy = -62, press = 0;
    if (p.at != null && d >= 0) {
      const pr = Math.min(1, d / 0.22);
      sy = k.lerp(-62, 18, pr * pr);
      if (d >= 0.22 && d < 0.5) { sy = 18 - (d - 0.22) / 0.28 * 8; press = 1 - (d - 0.22) / 0.28; }
      if (done) { sy = 10; press = 0; }
    } else if (p.at == null) {
      sy = -62 + Math.sin(t * 1.6) * 3;
    }
    const shake = stamping && d >= 0.22 && d < 0.5 ? (1 - (d - 0.22) / 0.28) * 3 : 0;
    const shx = shake ? k.noise1(t * 30) * shake : 0;
    ctx.lineCap = 'round';
    ctx.save();
    ctx.save();
    ctx.translate(shx, 0);
    ctx.fillStyle = k.rgba('ink', 0.12); ctx.beginPath(); k.rrect(-144, 14, 300, 130, 12); ctx.fill();
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-150, 8, 300, 130, 12); ctx.fill();
    ctx.fillStyle = k.rgba('panel2', 1); ctx.beginPath(); k.rrect(-146, 12, 292, 122, 12); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-110, 30, 26, 12, -0.4, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      const yy = 40 + i * 24;
      ctx.beginPath(); ctx.moveTo(-124, yy); ctx.lineTo(-20, yy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(60, yy); ctx.lineTo(124, yy); ctx.stroke();
    }
    if (p.at != null && d >= 0.22) {
      const pg = Math.min(1, (d - 0.22) / 0.28);
      ctx.save();
      ctx.translate(0, 68); ctx.rotate(-0.12);
      ctx.strokeStyle = k.rgba(p.color, 0.9 * pg); ctx.lineWidth = 4;
      ctx.beginPath(); k.rrect(-58, -22, 116, 44, 8); ctx.stroke();
      ctx.strokeStyle = k.rgba(p.color, 0.75 * pg); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-44, -4); ctx.lineTo(44, -4); ctx.moveTo(-44, 10); ctx.lineTo(44, 10); ctx.stroke();
      ctx.fillStyle = k.rgba(p.color, 0.85 * pg);
      ctx.beginPath(); ctx.arc(-64, 0, 7, 0, k.TAU); ctx.fill();
      ctx.restore();
    }
    ctx.restore();
    ctx.save();
    ctx.translate(0, sy);
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-52, -72, 104, 46, 12); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 1); ctx.beginPath(); k.rrect(-48, -68, 96, 38, 12); ctx.fill();
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-16, -112, 32, 44, 10); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1); ctx.beginPath(); k.rrect(-13, -109, 26, 38, 10); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-6, -98, 6, 12, -0.3, 0, k.TAU); ctx.fill();
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-58, -28, 116, 18, 6); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1); ctx.beginPath(); k.rrect(-54, -26, 108, 14, 6); ctx.fill();
    ctx.restore();
    if (p.at != null && d >= 0.22 && d < 0.75) {
      const pg = (d - 0.22) / 0.53;
      ctx.strokeStyle = k.rgba(p.color, 0.7 * (1 - pg)); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(0, 68, 70 + pg * 55, 0, k.TAU); ctx.stroke();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * k.TAU + 0.3;
        ctx.strokeStyle = k.rgba(p.color, 0.6 * (1 - pg)); ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 78, 68 + Math.sin(a) * 30);
        ctx.lineTo(Math.cos(a) * (78 + pg * 30), 68 + Math.sin(a) * (30 + pg * 12));
        ctx.stroke();
      }
    }
    ctx.restore();
  },
};

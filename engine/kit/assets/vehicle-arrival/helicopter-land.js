// vehicle-arrival/helicopter-land — helikopter, yandan: at anında alçalır,
// inişte rotor tozu patlar. Boşta: rotor döner, gövde hafif yalpa yapar.
// (0,0) = zemin; iniş pisti. Contract: engine/kit/ASSETS.md — canvas y-aşağı, saf draw.
export default {
  name: 'helicopter-land', category: 'vehicle-arrival',
  desc: 'Yandan helikopter; at anında alçalıp piste iner, rotor dönüşü + iniş tozu',
  tags: ['helikopter', 'iniş', 'pist', 'rotor', 'hava', 'ulaşım', 'helicopter', 'landing', 'rotor', 'helipad', 'aircraft'],
  box: [-210, -330, 210, 30],
  bleed: 100,
  anchor: 'zemin (0,0); iniş pisti',
  points: { skid: [0, -10], rotor: [0, -168], tail: [165, -140] },
  params: {
    at: { type: 'time', default: null, desc: 'iniş anı (1.3 sn alçalma + toz patlaması)' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const hull = k.rgba(p.color, 1), line = k.rgba('bg', 0.55), dark = k.rgba('ink', 0.85);
    const d = p.at == null ? -1 : t - p.at;
    // alçalma: d∈[-1.3,0] ease-out (yavaşlayarak konma)
    let dy = 0;
    if (d >= -1.3 && d < 0) {
      const g = k.prog(d, -1.3, 0);
      dy = -190 * (1 - (1 - Math.pow(1 - g, 2)));
    } else if (p.at == null) {
      dy = -190; // olay yoksa havada asılı durur (canlı idle)
    }
    const bob = (p.at == null ? k.noise1(t * 1.6) * 6 : k.noise1(t * 1.6) * 2);
    const sway = (p.at == null ? Math.sin(t * 1.1) * 0.035 : Math.sin(t * 1.4) * 0.012);
    const rotorA = t * 22;

    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.save();
    ctx.beginPath(); ctx.rect(-310, -430, 620, 490); ctx.clip(); // box+bleed

    // iniş pisti: halka + zemin
    ctx.fillStyle = k.rgba('bg', 0.25);
    ctx.beginPath(); k.rrect(-310, -6, 620, 20, 6); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.ellipse(0, 4, 120, 12, 0, 0, k.TAU); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink', 0.28); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(0, 4, 78, 8, 0, 0, k.TAU); ctx.stroke();

    ctx.save();
    ctx.translate(0, dy + bob);
    ctx.rotate(sway);

    // kuyruk bomu (sağ)
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(58 - LW / 2, -152 - LW / 2, 108 + LW, 24 + LW, 10); ctx.fill();
    ctx.fillStyle = hull; ctx.beginPath(); k.rrect(58, -152, 108, 24, 10); ctx.fill();
    // dikey kuyruk yüzgeci + kuyruk rotoru
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(148 - LW / 2, -196 - LW / 2, 26 + LW, 48 + LW, 8); ctx.fill();
    ctx.fillStyle = hull; ctx.beginPath(); k.rrect(148, -196, 26, 48, 8); ctx.fill();
    const trA = t * 30;
    ctx.strokeStyle = dark; ctx.lineWidth = 5;
    for (let i = 0; i < 2; i++) {
      const a = trA + i * Math.PI / 2;
      ctx.beginPath(); ctx.moveTo(161 - Math.cos(a) * 22, -172 - Math.sin(a) * 22);
      ctx.lineTo(161 + Math.cos(a) * 22, -172 + Math.sin(a) * 22); ctx.stroke();
    }
    // gövde
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-72 - LW / 2, -158 - LW / 2, 144 + LW, 72 + LW, 26); ctx.fill();
    ctx.fillStyle = hull; ctx.beginPath(); k.rrect(-72, -158, 144, 72, 26); ctx.fill();
    ctx.save();
    ctx.beginPath(); k.rrect(-72, -158, 144, 72, 26); ctx.clip();
    ctx.fillStyle = k.rgba('bg', 0.12); ctx.fillRect(-8, -158, 80, 72);
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-44, -142, 26, 12, -0.4, 0, k.TAU); ctx.fill();
    ctx.restore();
    // kokpit camı (sol, pilot tarafı)
    ctx.fillStyle = k.rgba('ink', 0.72);
    ctx.beginPath(); k.rrect(-68, -152, 52, 42, 14); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-60, -116); ctx.lineTo(-34, -146); ctx.stroke();
    // vurgu şeridi (tek vurgu: accent)
    ctx.fillStyle = k.rgba('accent', 0.95);
    ctx.beginPath(); k.rrect(-72, -104, 144, 12, 6); ctx.fill();
    // kızak takımı
    ctx.strokeStyle = dark; ctx.lineWidth = 7;
    for (const sx of [-40, 40]) {
      ctx.beginPath(); ctx.moveTo(sx, -88); ctx.lineTo(sx, -10); ctx.stroke();
    }
    ctx.strokeStyle = line; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(-64, -10); ctx.lineTo(64, -10); ctx.stroke();
    ctx.strokeStyle = dark; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(-64, -10); ctx.lineTo(64, -10); ctx.stroke();

    // ana rotor direği + dönen palalar
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-8 - LW / 2, -186 - LW / 2, 16 + LW, 30 + LW, 6); ctx.fill();
    ctx.fillStyle = dark; ctx.beginPath(); k.rrect(-8, -186, 16, 30, 6); ctx.fill();
    // hareket bulanıklığı diski
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    ctx.beginPath(); ctx.ellipse(0, -190, 150, 14, 0, 0, k.TAU); ctx.fill();
    ctx.save();
    ctx.translate(0, -190); ctx.rotate(0); // disk düzlemi sabit, palalar döner
    for (let i = 0; i < 2; i++) {
      const a = rotorA + i * Math.PI;
      ctx.save(); ctx.rotate(a);
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(-150 - LW / 2, -7 - LW / 2, 300 + LW, 14 + LW, 7); ctx.fill();
      ctx.fillStyle = dark; ctx.beginPath(); k.rrect(-150, -7, 300, 14, 7); ctx.fill();
      ctx.restore();
    }
    ctx.restore();
    ctx.fillStyle = dark; ctx.beginPath(); ctx.arc(0, -190, 10, 0, k.TAU); ctx.fill();
    ctx.restore(); // helikopter

    // iniş tozu: rotor rüzgarı zeminden dışa savrulur (0.8 sn)
    if (d >= 0 && d < 0.8) {
      const g = k.prog(d, 0, 0.8), al = 1 - g;
      for (let i = 0; i < 14; i++) {
        const h1 = k.hash(i * 17 + 2), h2 = k.hash(i * 31 + 7);
        const sgn = i % 2 ? 1 : -1;
        const px = sgn * (60 + h1 * 60 + g * 190);
        const py = -6 - h2 * 30 - g * 34;
        ctx.fillStyle = k.rgba('dim', 0.5 * al);
        ctx.beginPath(); ctx.arc(px, py, 9 + g * 18, 0, k.TAU); ctx.fill();
      }
      // yer sarsıntısı halkası
      ctx.strokeStyle = k.rgba('ink', 0.35 * al); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.ellipse(0, 4, 60 + g * 130, 7 + g * 12, 0, 0, k.TAU); ctx.stroke();
    }

    ctx.restore();
  },
};

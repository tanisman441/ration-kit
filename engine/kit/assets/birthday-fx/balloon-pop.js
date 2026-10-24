// birthday-fx/balloon-pop — sallanan balon; at anında patlar: flaş, parça saçılması, ip sarkar.
// NOT: canvas y-aşağıdır; (0,0) balonun düğüm hizasıdır, gövde negatif y yönünde yukarıdadır.
export default {
  name: 'balloon-pop', category: 'birthday-fx',
  desc: 'Havada sallanan balon; patlama anında flaş ve parçalar saçılır, ipi sarkar',
  tags: ['balon', 'patlama', 'doğum günü', 'parti', 'kutlama', 'balloon', 'pop', 'burst', 'birthday', 'party', 'celebration'],
  box: [-120, -165, 120, 140],
  bleed: 60,
  anchor: 'balon düğümü (0,0)',
  points: { top: [0, -152], knot: [0, 32], string: [18, 120] },
  params: {
    color: { type: 'color', default: 'red', desc: 'balon rengi (tek vurgu rengi)' },
    at: { type: 'time', default: null, desc: 'patlama anı — 0.15 sn flaş, 0.7 sn parça saçılması' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const popped = d >= 0;
    const bob = Math.sin(t * k.TAU / 2.2) * 4; // hafif yükselme (canlı idle)
    const sway = k.noise1(t * 1.4) * 10;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };

    // ip: patlamadan önce gergin salınım, sonra sarkık
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 3;
    ctx.beginPath();
    if (!popped) {
      ctx.moveTo(0, 8 + bob);
      ctx.quadraticCurveTo(10 + sway, 70, 18 + sway, 128);
    } else {
      const settle = k.clamp(d / 0.5, 0, 1);
      ctx.moveTo(0, 8 + bob);
      ctx.quadraticCurveTo(26 * settle, 46, 34 * settle, 96 + 20 * (1 - settle));
    }
    ctx.stroke();

    if (!popped) {
      // balon gövdesi
      ctx.save();
      ctx.translate(0, bob);
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(0, -60, 80, 95, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(p.color);
      ctx.beginPath(); ctx.ellipse(0, -60, 76, 91, 0, 0, k.TAU); ctx.fill();
      // premium parlama (sol üst)
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-30, -96, 22, 34, -0.4, 0, k.TAU); ctx.fill();
      // düğüm
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.moveTo(-9, 28); ctx.lineTo(9, 28); ctx.lineTo(0, 40); ctx.closePath(); ctx.fill();
      ctx.fillStyle = k.rgba(p.color);
      ctx.beginPath(); ctx.moveTo(-6, 30); ctx.lineTo(6, 30); ctx.lineTo(0, 38); ctx.closePath(); ctx.fill();
      ctx.restore();
      return;
    }

    // patlama flaşı: ilk 0.15 sn
    if (d < 0.15) {
      const f = 1 - d / 0.15;
      k.glow(0, -60 + bob, 120 * f, p.color, 0.5 * f);
      ctx.fillStyle = 'rgba(255,255,255,' + (0.9 * f).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(0, -60 + bob, 16 * f + 6, 0, k.TAU); ctx.fill();
    }
    // şok halkası: ilk 0.3 sn
    if (d < 0.3) {
      const g = d / 0.3;
      ctx.strokeStyle = k.rgba(p.color, 0.6 * (1 - g));
      ctx.lineWidth = 5 * (1 - g) + 1.5;
      ctx.beginPath(); ctx.arc(0, -60 + bob, 14 + 90 * g, 0, k.TAU); ctx.stroke();
    }
    // parçalar: 0.7 sn içinde dışa fırlayıp sönümlenir
    if (d < 0.75) {
      for (let i = 0; i < 12; i++) {
        const h1 = k.hash(i * 7 + 3), h2 = k.hash(i * 13 + 29), h3 = k.hash(i * 23 + 47);
        const ang = h1 * k.TAU;
        const e = 1 - Math.pow(1 - Math.min(d / 0.55, 1), 2);
        const dist = (20 + h2 * 100) * e;
        const x = Math.cos(ang) * dist;
        const y = -60 + bob + Math.sin(ang) * dist + 34 * d * d;
        const fade = 1 - k.prog(d, 0.3, 0.75);
        if (fade <= 0) continue;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(ang + h3 * 3);
        ctx.fillStyle = k.rgba(p.color, fade);
        ctx.beginPath();
        ctx.moveTo(-7 - h2 * 6, 0); ctx.lineTo(0, -5 - h3 * 5); ctx.lineTo(7 + h2 * 6, 0); ctx.lineTo(0, 5 + h3 * 5);
        ctx.closePath(); ctx.fill();
        ctx.restore();
      }
    }
    // düğüm kalıntısı: patlamadan sonra ipin ucunda küçük parça
    if (d < 1.2) {
      const fade = 1 - k.prog(d, 0.8, 1.2);
      ctx.fillStyle = k.rgba(p.color, Math.max(fade, 0) * 0.9);
      ctx.beginPath(); ctx.moveTo(-5, 6 + bob); ctx.lineTo(5, 6 + bob); ctx.lineTo(0, 14 + bob); ctx.closePath(); ctx.fill();
    }
  },
};

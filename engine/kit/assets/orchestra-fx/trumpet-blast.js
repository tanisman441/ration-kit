// orchestra-fx/trumpet-blast — `at` anında trompetten ses dalgaları ve notalar patlar; öncesinde pistonlar hafifçe oynar. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) trompet gövdesinin (borunun) merkezidir.
export default {
  name: 'trumpet-blast', category: 'orchestra-fx',
  desc: 'Yandan görünen trompet; üfleme anında çan ağzından genişleyen ses halkaları ve uçan notalar patlar',
  tags: ['trompet', 'üfleme', 'ses', 'nota', 'orkestra', 'borazan', 'müzik', 'trumpet', 'blast', 'sound', 'notes', 'orchestra', 'brass'],
  box: [-150, -90, 150, 90],
  bleed: 60,
  anchor: 'trompet borusunun merkezi (0,0); çan sağa, ağızlık sola bakar',
  points: { bell: [132, 0], mouthpiece: [-128, 0], valves: [0, -32] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: 0.8, desc: 'üfleme anı (ses dalgası + nota patlaması)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.save();

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // alt boru (dönüş borusu)
    ctx.strokeStyle = line; ctx.lineWidth = 13;
    ctx.beginPath(); ctx.moveTo(-110, 26); ctx.lineTo(30, 26); ctx.stroke();
    ctx.strokeStyle = body; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(-110, 26); ctx.lineTo(30, 26); ctx.stroke();
    // alt boru ucu kıvrımı
    ctx.strokeStyle = line; ctx.lineWidth = 13;
    ctx.beginPath(); ctx.arc(38, 13, 13, -Math.PI / 2, Math.PI / 2); ctx.stroke();
    ctx.strokeStyle = body; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.arc(38, 13, 13, -Math.PI / 2, Math.PI / 2); ctx.stroke();

    // ana boru
    ctx.strokeStyle = line; ctx.lineWidth = 15;
    ctx.beginPath(); ctx.moveTo(-118, 0); ctx.lineTo(62, 0); ctx.stroke();
    ctx.strokeStyle = body; ctx.lineWidth = 11;
    ctx.beginPath(); ctx.moveTo(-118, 0); ctx.lineTo(62, 0); ctx.stroke();
    // premium parlama (sol üst, boru üstü)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-60, -5, 34, 3.5, 0, 0, k.TAU); ctx.fill();

    // çan: sağa açılan huni
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(58, -8); ctx.lineTo(132, -42); ctx.lineTo(132, 42); ctx.lineTo(58, 8); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath();
    ctx.moveTo(58, -6); ctx.lineTo(130, -38); ctx.lineTo(130, 38); ctx.lineTo(58, 6); ctx.closePath(); ctx.fill();
    // çan ağzı halkası
    ctx.strokeStyle = line; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(132, -42); ctx.lineTo(132, 42); ctx.stroke();
    ctx.strokeStyle = k.rgba('yellow', 0.9); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(132, -38); ctx.lineTo(132, 38); ctx.stroke();
    // çan içi parıltı
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(96, -16, 22, 6, -0.35, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(96, 26, 24, 5, 0.1, 0, k.TAU); ctx.fill();

    // pistonlar: üç silindir, boşta hafifçe oynar (nefes gibi)
    for (let i = 0; i < 3; i++) {
      const vx = -28 + i * 26;
      const bob = 2 * Math.sin(t * k.TAU / 1.6 + i * 0.9);
      blob(vx - 8, -34 + bob, 16, 30, 6, k.rgba('panel2'));
      ctx.fillStyle = k.rgba('accent', 0.85);
      ctx.beginPath(); ctx.arc(vx, -36 + bob, 5, 0, k.TAU); ctx.fill();
    }
    // piston gövdesi (boru üstü kutu)
    blob(-42, -12, 84, 14, 6, k.rgba('panel2'));

    // ağızlık: sol uçta küçük huni
    ctx.strokeStyle = line; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(-118, 0); ctx.lineTo(-132, 0); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink'); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-118, 0); ctx.lineTo(-132, 0); ctx.stroke();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.arc(-134, 0, 6, 0, k.TAU); ctx.fill();

    // PATLAMA: `at` anından sonra ~1.2 sn süren ses dalgaları + notalar
    if (d >= 0 && d < 1.2) {
      const q = d / 1.2; // 0 → 1 sönüm
      // genişleyen ses halkaları (çan ağzından)
      for (let i = 0; i < 3; i++) {
        const r = 14 + (d * 95 - i * 22);
        if (r < 8) continue;
        ctx.strokeStyle = k.rgba('accent', (1 - q) * 0.8);
        ctx.lineWidth = 5 - i;
        ctx.beginPath(); ctx.arc(132, 0, r, -0.9, 0.9); ctx.stroke();
      }
      // çan ağzı flaşı
      k.glow(132, 0, 26 + 30 * (1 - q), 'yellow', 0.5 * (1 - q));
      // uçan notalar: hash ile dağınık yönler, dışa uçar
      for (let i = 0; i < 3; i++) {
        const hx = k.hash(i * 7 + 1), hy = k.hash(i * 7 + 2);
        const nx = 132 + 20 + d * 110 * (0.7 + hx * 0.5);
        const ny = (hy - 0.5) * 110 * (1 + d * 0.6);
        const ns = 0.8 + 0.4 * (1 - q);
        ctx.save(); ctx.translate(nx, ny); ctx.scale(ns, ns); ctx.globalAlpha = 1 - q;
        ctx.fillStyle = k.rgba('accent');
        ctx.beginPath(); ctx.ellipse(0, 0, 6, 4.5, -0.3, 0, k.TAU); ctx.fill();
        ctx.fillRect(4.5, -16, 2.6, 16);
        ctx.beginPath(); ctx.moveTo(7, -16); ctx.quadraticCurveTo(15, -13, 13, -6); ctx.lineTo(7, -9); ctx.closePath(); ctx.fill();
        ctx.restore();
      }
    } else if (d >= 1.2) {
      // patlama bitti: çanda hafif sönük parıltı
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.beginPath(); ctx.ellipse(118, 0, 10, 24, 0, 0, k.TAU); ctx.fill();
    } else {
      // üflemeden önce: çan ağzında bekleyen minik parıltı (yaklaşan anın işareti)
      const pre = 0.5 + 0.5 * Math.sin(t * k.TAU / 0.9);
      ctx.fillStyle = `rgba(255,255,255,${0.10 + 0.12 * pre})`;
      ctx.beginPath(); ctx.arc(128, 0, 5, 0, k.TAU); ctx.fill();
    }

    ctx.restore();
  },
};

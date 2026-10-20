// battle-fx/bullet-time — mermi izi yavaşlama: ağır çekimde ilerleyen mermi, iz ve dalga halkalarıyla.
// NOT: canvas y-aşağıdır; (0,0) geçişin orta noktasıdır. Idle'da mermi havada süzülür.
export default {
  name: 'bullet-time',
  category: 'battle-fx',
  desc: 'Mermi izi yavaşlama: ağır çekimde süzülen mermi, arkasında iz çizgileri ve genişleyen dalga halkaları',
  tags: ['mermi', 'kurşun', 'yavaşlama', 'ağır çekim', 'iz', 'bullet', 'slow motion', 'trail', 'shot'],
  box: [-190, -110, 190, 110],
  bleed: 60,
  anchor: 'geçişin orta noktası (0,0)',
  points: { head: [0, 0], tail: [-90, 0] },
  params: {
    fire: { type: 'time', default: null, desc: 'ateş anı (1.2 sn: mermi soldan sağa ağır çekimde geçer)' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: mermi büyüklüğü' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    const d = p.fire == null ? -1 : t - p.fire;
    const S = k.clamp(p.size, 0.5, 1.5);
    ctx.save();

    function bullet(x, y, alpha, scl) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scl, scl);
      // gövde: uzun kapsül
      ctx.fillStyle = k.rgba('ink', alpha);
      ctx.strokeStyle = k.rgba('bg', 0.55 * alpha);
      ctx.lineWidth = 3 * S;
      ctx.beginPath();
      ctx.moveTo(-34 * S, -9 * S);
      ctx.lineTo(18 * S, -9 * S);
      ctx.quadraticCurveTo(38 * S, 0, 18 * S, 9 * S);
      ctx.lineTo(-34 * S, 9 * S);
      ctx.quadraticCurveTo(-42 * S, 0, -34 * S, -9 * S);
      ctx.fill(); ctx.stroke();
      // burun parlaması
      ctx.fillStyle = k.rgba(p.color, 0.9 * alpha);
      ctx.beginPath();
      ctx.moveTo(18 * S, -6.5 * S);
      ctx.quadraticCurveTo(33 * S, 0, 18 * S, 6.5 * S);
      ctx.closePath(); ctx.fill();
      // üst çizgi detayı
      ctx.strokeStyle = k.rgba('bg', 0.35 * alpha);
      ctx.lineWidth = 2.4 * S;
      ctx.beginPath();
      ctx.moveTo(-28 * S, -4 * S); ctx.lineTo(10 * S, -4 * S);
      ctx.stroke();
      ctx.restore();
    }

    // --- idle: mermi merkezde süzülür, iz halkaları nabız gibi açılır ---
    if (d < 0) {
      const bob = Math.sin(t * 2.1) * 5 * S;
      const trem = k.noise1(t * 5) * 2;
      bullet(0, bob + trem * 0.3, 1, 1);
      // iz: solda solan 3 hayalet mermi
      for (let i = 1; i <= 3; i++) {
        bullet(-i * 52 * S, bob * 0.6, 0.28 / i, 1 - i * 0.08);
      }
      // nabız halkaları
      const cyc = (t * 0.8) % 1;
      ctx.strokeStyle = k.rgba(p.color, 0.3 * (1 - cyc));
      ctx.lineWidth = (3 * (1 - cyc) + 1) * S;
      ctx.beginPath();
      ctx.arc(-30 * S, bob, (10 + 44 * cyc) * S, 0, k.TAU);
      ctx.stroke();
      ctx.restore();
      return;
    }
    if (d > 1.6) { ctx.restore(); return; }

    // --- ağır çekim geçişi: mermi soldan sağa, yavaşlayarak ---
    const g = k.prog(d, 0, 1.2);
    const e = k.E.outCubic(g); // yavaşlayan hareket
    const bx = (-170 + 340 * e) * S;
    const wob = Math.sin(d * 9) * 3 * S * (1 - g * 0.5);
    const speed = 1 - e; // kalan hız

    // iz çizgileri — merminin gerisinde uzayan hız çizgileri
    for (let i = 0; i < 5; i++) {
      const off = (12 + i * 14) * S;
      const len = (40 + speed * 160 + i * 22) * S * k.E.outCubic(Math.min(g * 1.2, 1));
      ctx.strokeStyle = k.rgba(i === 0 ? p.color : 'dim', (0.55 - i * 0.08) * Math.min(1, g * 3));
      ctx.lineWidth = (4.5 - i * 0.7) * S;
      ctx.lineCap = 'round';
      const yy = (i - 2) * 13 * S + wob * 0.4;
      ctx.beginPath();
      ctx.moveTo(bx - off, yy);
      ctx.lineTo(bx - off - len, yy);
      ctx.stroke();
    }

    // hayalet izler — merminin önceki konumları
    for (let i = 1; i <= 3; i++) {
      const gg = k.prog(d - i * 0.12, 0, 1.2);
      if (gg <= 0) continue;
      const ee = k.E.outCubic(gg);
      const gx = (-170 + 340 * ee) * S;
      bullet(gx, Math.sin((d - i * 0.12) * 9) * 3 * S * (1 - gg * 0.5), 0.22 * (1 - gg * 0.6), 1 - i * 0.06);
    }

    // dalga halkaları — mermi etrafında ağır çekim dalgaları
    for (let r = 0; r < 3; r++) {
      const rg = k.prog(d - r * 0.22, 0, 0.9);
      if (rg <= 0 || rg >= 1) continue;
      ctx.strokeStyle = k.rgba(p.color, 0.45 * (1 - rg));
      ctx.lineWidth = (4 * (1 - rg) + 1.2) * S;
      ctx.beginPath();
      ctx.ellipse(bx, wob, (14 + 64 * k.E.outCubic(rg)) * S, (10 + 34 * k.E.outCubic(rg)) * S, 0, 0, k.TAU);
      ctx.stroke();
    }

    // ana mermi + hafif glow
    if (d < 0.25) k.glow(bx - 34 * S, wob, 44 * S * (1 - d / 0.25), p.color, 0.4);
    bullet(bx, wob, 1, 1);

    // ateş ağzı çakması (başlangıçta, 0.12 sn)
    if (d < 0.12) {
      const f = 1 - d / 0.12;
      k.glow(-178 * S, 0, 52 * S * f, p.color, 0.5 * f);
      ctx.fillStyle = k.rgba(p.color, 0.85 * f);
      ctx.beginPath();
      ctx.moveTo(-178 * S, 0);
      ctx.lineTo(-158 * S, -10 * S * f);
      ctx.lineTo(-146 * S, 0);
      ctx.lineTo(-158 * S, 10 * S * f);
      ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  },
};

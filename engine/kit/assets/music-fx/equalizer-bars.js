// music-fx/equalizer-bars — ritmik yükseklik değiştiren 5-7 ekolayzer çubuğu.
// kick anında tüm çubuklar zıplar (0.3 sn); boşta k.noise1 tabanlı sürekli dalgalanma.
export default {
  name: 'equalizer-bars', category: 'music-fx',
  desc: 'Equalizer bars dancing to the beat, all jumping together on a kick',
  tags: ['ekolayzer', 'equalizer', 'ses', 'bar', 'müzik', 'bass', 'bars', 'vu meter', 'vuruş'],
  box: [-170, -140, 170, 90],
  bleed: 25,
  anchor: 'taban çizgisi (0,60); çubuklar yukarı uzar',
  points: { base: [0, 60], peak: [0, -130], left: [-150, 60], right: [150, 60] },
  params: {
    kick: { type: 'time', default: null, desc: 'bas vuruşu: tüm çubuklar zıplar (0.3 sn)' },
    bars: { type: 'number', default: 6, desc: 'çubuk sayısı (5-7)' },
    color: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const n = Math.max(5, Math.min(7, Math.round(p.bars)));
    const d = p.kick == null ? -1 : t - p.kick;
    const baseY = 60, bw = 30;
    const span = 300, step = span / n;

    // 1) taban çizgisi
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    k.rrect(-160 + 6, baseY + 6, 320, 14, 7); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 6;
    ctx.beginPath(); k.rrect(-160, baseY, 320, 14, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-120, baseY + 4, 46, 4, 0, 0, k.TAU); ctx.fill();

    // 2) kick zıplaması: 0.3 sn'de sönümlenen ortak yükseklik
    let jump = 0, flash = 0;
    if (d >= 0 && d <= 0.3) {
      const g = k.prog(d, 0, 0.3);
      jump = 62 * Math.pow(1 - g, 1.5);
      flash = 1 - g;
    }

    // 3) çubuklar
    for (let i = 0; i < n; i++) {
      const x = -150 + i * step + (step - bw) / 2;
      const wave = 0.5 + 0.5 * k.noise1(t * 1.8 + i * 7.3);
      const h = 26 + 108 * wave + jump;
      // gölge
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      k.rrect(x + 6, baseY - h + 6, bw, h, 10); ctx.fill();
      // gövde
      ctx.fillStyle = k.rgba(p.color, 0.88);
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 6;
      ctx.beginPath(); k.rrect(x, baseY - h, bw, h, 10); ctx.fill(); ctx.stroke();
      // premium parlama (sol üst)
      ctx.fillStyle = 'rgba(255,255,255,0.11)';
      ctx.beginPath(); ctx.ellipse(x + 10, baseY - h + 14, 7, 12, -0.4, 0, k.TAU); ctx.fill();
      // tepe kapağı (parlak)
      ctx.fillStyle = k.rgba(p.color, 1);
      ctx.beginPath(); k.rrect(x, baseY - h, bw, 10, 5); ctx.fill();
    }

    // 4) kick parlaması: tabanda ışık
    if (flash > 0) {
      k.glow(0, baseY - 8, 60, p.color, 0.4 * flash);
      ctx.fillStyle = k.rgba(p.color, 0.5 * flash);
      ctx.beginPath(); k.rrect(-160, baseY - 6, 320, 8, 4); ctx.fill();
    }
    ctx.restore();
  },
};

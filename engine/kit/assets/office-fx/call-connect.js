// office-fx/call-connect — at anında telefon çalar: 0.45 sn zil titremesi +
// halka ses dalgaları, sonra bağlantı anında 3 genişleyen sinyal halkası ve
// ahize hafifçe kalkar. idle'da LED nabzı. canvas y-aşağı; (0,0) ahize merkezi.
export default {
  name: 'call-connect', category: 'office-fx',
  desc: 'at anında zil titremesi, sonra genişleyen bağlantı sinyal halkaları',
  tags: ['telefon', 'arama', 'zil', 'bağlantı', 'ahize', 'phone', 'call', 'ring', 'connect', 'ofis', 'office'],
  box: [-140, -110, 140, 110],
  bleed: 60,
  anchor: 'ahize merkezi',
  points: { ear: [-58, -34], wave: [0, -62] },
  params: {
    color: { type: 'color', default: 'cyan', desc: 'sinyal rengi' },
    at: { type: 'time', default: null, desc: 'arama anı: 0.45 sn zil + 1.05 sn bağlantı dalgası' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.at == null ? -1 : t - p.at;

    let dx = 0, dy = 0, lift = 0;
    // zil titremesi
    if (d >= 0 && d < 0.45) {
      dx = 5 * Math.sin(d * 55); dy = 3 * Math.sin(d * 47);
      // zil ses halkaları
      for (let i = 0; i < 2; i++) {
        const g = k.prog(d - i * 0.16, 0, 0.32);
        if (g <= 0 || g >= 1) continue;
        ctx.strokeStyle = k.rgba('ink', 0.5 * (1 - g));
        ctx.lineWidth = 5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(-70, -52, 26 + 66 * g, -2.4, -0.7); ctx.stroke();
        ctx.beginPath(); ctx.arc(70, -52, 26 + 66 * g, -2.4, -0.7); ctx.stroke();
      }
    }
    // bağlantı dalgaları
    if (d >= 0.45 && d < 1.6) {
      lift = 14 * k.prog(d, 0.45, 0.75);
      for (let i = 0; i < 3; i++) {
        const dd = d - 0.45 - i * 0.28;
        if (dd < 0 || dd > 0.9) continue;
        const g = dd / 0.9;
        ctx.strokeStyle = k.rgba(p.color, 0.6 * (1 - g));
        ctx.lineWidth = 6; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(0, -24 - lift, 24 + 120 * g, 0, k.TAU); ctx.stroke();
      }
      // bağlantı parlaması
      const bg = Math.max(0, 1 - (d - 0.45) / 0.4);
      if (bg > 0) k.glow(0, -24 - lift, 60, p.color, 0.4 * bg);
    }

    ctx.translate(dx, dy - lift);
    ctx.rotate(-0.35);
    // gölge
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-72, -14, 152, 40, 18); ctx.fill();
    // ahize barı
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-78, -20, 156, 40, 18); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.beginPath(); k.rrect(-74, -16, 148, 32, 16); ctx.fill();
    // parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-40, -8, 34, 7, -0.1, 0, k.TAU); ctx.fill();
    // kulaklık / mikrofon uçları
    for (const ex of [-62, 62]) {
      ctx.fillStyle = k.rgba('bg', 0.55);
      ctx.beginPath(); ctx.arc(ex, 0, 26, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('panel2', 1);
      ctx.beginPath(); ctx.arc(ex, -2, 22, 0, k.TAU); ctx.fill();
    }
    // LED (idle nabzı)
    const led = 0.3 + 0.3 * Math.sin(t * 2.4);
    k.glow(0, 0, 14, p.color, led);
    ctx.fillStyle = k.rgba(p.color, 0.5 + led);
    ctx.beginPath(); ctx.arc(0, 0, 6, 0, k.TAU); ctx.fill();
    ctx.restore();
  },
};

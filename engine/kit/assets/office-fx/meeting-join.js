// office-fx/meeting-join — at anında 3 katılımcı simgesi sırayla pop girişi
// yapar (0.28 sn arayla, outBack), sonra ortadaki el kaldırıp sallar; idle'da
// avatarlar hafifçe salınır. canvas y-aşağı; (0,0) orta avatar merkezi.
export default {
  name: 'meeting-join', category: 'office-fx',
  desc: 'at anında 3 katılımcı pop ile girer, ortadaki el kaldırır',
  tags: ['toplantı', 'katılımcı', 'görüşme', 'el kaldır', 'meeting', 'join', 'video call', 'participant', 'ofis', 'office'],
  box: [-170, -100, 170, 100],
  bleed: 26,
  anchor: 'orta avatar merkezi',
  points: { hand: [26, -72], center: [0, 0] },
  params: {
    color: { type: 'color', default: 'accent', desc: 'avatar gövde rengi' },
    at: { type: 'time', default: null, desc: 'katılım anı: 0.28 sn arayla pop giriş + el kaldırma' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.at == null ? -1 : t - p.at;
    const xs = [-92, 0, 92];

    for (let i = 0; i < 3; i++) {
      let s = 1, joined = true;
      if (d >= 0) {
        const dd = d - i * 0.28;
        joined = dd >= 0;
        s = joined ? k.E.outBack(k.prog(dd, 0, 0.45), 1.5) : 0.0001;
      }
      if (!joined) continue;
      ctx.save();
      const bob = 3 * Math.sin(t * 2 + i * 2.1);   // idle salınım
      ctx.translate(xs[i], bob);
      ctx.scale(s, s);

      // gölge
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); ctx.arc(4, -28, 36, 0, k.TAU); ctx.fill();
      // gövde
      ctx.fillStyle = k.rgba('bg', 0.55);
      ctx.beginPath(); k.rrect(-34, -6, 68, 62, 16); ctx.fill();
      ctx.fillStyle = k.rgba(p.color, 1);
      ctx.beginPath(); k.rrect(-30, -2, 60, 54, 14); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-14, 8, 10, 16, 0.2, 0, k.TAU); ctx.fill();
      // baş
      ctx.fillStyle = k.rgba('bg', 0.55);
      ctx.beginPath(); ctx.arc(0, -30, 28, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('panel2', 1);
      ctx.beginPath(); ctx.arc(0, -34, 25, 0, k.TAU); ctx.fill();
      // yüz (nötr)
      ctx.fillStyle = k.rgba('ink', 0.75);
      ctx.beginPath(); ctx.arc(-6, -36, 2.6, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(6, -36, 2.6, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-6, -26); ctx.quadraticCurveTo(0, -24, 6, -26); ctx.stroke();

      // ortadaki avatar: el kaldırıp sallar (d > 1.3)
      if (i === 1 && d > 1.3) {
        const wd = d - 1.3;
        const rise = k.E.outBack(k.prog(wd, 0, 0.4), 1.6);
        const wave = 0.22 * Math.sin(wd * 7) * Math.max(0, 1 - wd / 2.5);
        const ang = -1.1 + (1 - rise) * 2.2 + wave;
        const hx = 30 + 52 * Math.cos(ang), hy = -6 + 52 * Math.sin(ang);
        ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 15; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(30, -6); ctx.lineTo(hx, hy); ctx.stroke();
        ctx.strokeStyle = k.rgba('panel2', 1); ctx.lineWidth = 11;
        ctx.beginPath(); ctx.moveTo(30, -6); ctx.lineTo(hx, hy); ctx.stroke();
        ctx.fillStyle = k.rgba('panel2', 1);
        ctx.beginPath(); ctx.arc(hx, hy, 9, 0, k.TAU); ctx.fill();
      }
      ctx.restore();

      // isim çubuğu
      if (s > 0.6) {
        ctx.fillStyle = k.rgba('dim', 0.85);
        ctx.beginPath(); k.rrect(xs[i] - 30, 62, 60, 14, 7); ctx.fill();
      }
    }
    ctx.restore();
  },
};

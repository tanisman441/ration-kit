// social-fx/follow-pop — takipçi rozeti: kişi ikonu + sağ üstte artı rozeti.
// at anında ikon pop yapar, rozetten halka yayılır. Boşta hafif nefes.
export default {
  name: 'follow-pop', category: 'social-fx',
  desc: 'Person icon with a plus badge that pops and rings on the follow moment',
  tags: ['takip', 'follow', 'takipçi', 'follower', 'abone ol', 'kişi', 'person', 'plus', 'add'],
  box: [-110, -115, 110, 115],
  bleed: 60,
  anchor: 'kişi ikonunun merkezi',
  points: { person: [0, -5], badge: [56, -58], head: [0, -52] },
  params: {
    at: { type: 'time', default: null, desc: 'takip anı: pop + rozetten halka (0.7 sn)' },
    color: { type: 'color', default: 'green' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.at == null ? -1 : t - p.at;
    const col = p.color;

    // 1) pop ölçeği
    let s = 1 + 0.02 * Math.sin(t * 2.4);
    if (d >= 0 && d <= 0.7) {
      const g = k.prog(d, 0, 0.7);
      const pop = Math.min(1, d / 0.2);
      s *= 1 + 0.3 * Math.sin(Math.PI * pop) * (1 - g * 0.3);
    }
    ctx.scale(s, s);

    // 2) kişi: baş + omuzlar
    const bodyPath = () => {
      ctx.beginPath(); ctx.arc(0, -48, 30, 0, k.TAU); // baş
      ctx.moveTo(-52, 78);
      ctx.quadraticCurveTo(-50, 20, 0, 18);
      ctx.quadraticCurveTo(50, 20, 52, 78);
      ctx.quadraticCurveTo(0, 66, -52, 78);
      ctx.closePath();
    };
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.save(); ctx.translate(6, 6); bodyPath(); ctx.fill(); ctx.restore();
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 7;
    bodyPath(); ctx.fill(); ctx.stroke();
    // sol üst parlama (başta)
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-12, -60, 11, 14, -0.4, 0, k.TAU); ctx.fill();

    // 3) rozet: artı işareti — at anında sıçrar + halka
    let bz = 1, by = 0;
    if (d >= 0 && d <= 0.7) {
      const g = k.prog(d, 0, 0.7);
      const pop = Math.min(1, d / 0.2);
      bz = 1 + 0.55 * Math.sin(Math.PI * pop);
      by = -14 * Math.sin(Math.PI * pop);
      const ringR = 20 + 55 * k.E.outExpo(g);
      ctx.strokeStyle = k.rgba(col, 0.7 * (1 - g));
      ctx.lineWidth = 7 * (1 - g) + 2;
      ctx.beginPath(); ctx.arc(56, -58, ringR, 0, k.TAU); ctx.stroke();
    }
    ctx.save(); ctx.translate(56, -58 + by); ctx.scale(bz, bz);
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.arc(6, 6, 26, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(col, 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(0, 0, 26, 0, k.TAU); ctx.fill(); ctx.stroke();
    // artı
    ctx.strokeStyle = k.rgba('bg', 0.7); ctx.lineWidth = 11; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, -11); ctx.lineTo(0, 11); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-11, 0); ctx.lineTo(11, 0); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(0, -11); ctx.lineTo(0, 11); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-11, 0); ctx.lineTo(11, 0); ctx.stroke();
    ctx.restore();

    ctx.restore();
  },
};

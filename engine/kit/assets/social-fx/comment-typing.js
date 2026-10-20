// social-fx/comment-typing — yorum baloncuğu: içindeki üç nokta boşta sürekli
// sırayla zıplar (yazıyor efekti); at anında balon bir an şişer.
export default {
  name: 'comment-typing', category: 'social-fx',
  desc: 'Speech bubble with three dots jumping in a loop, like someone is typing',
  tags: ['yorum', 'comment', 'yazıyor', 'typing', 'balon', 'bubble', 'mesaj', 'message', 'chat'],
  box: [-130, -100, 130, 100],
  bleed: 40,
  anchor: 'balon merkezi',
  points: { bubble: [0, -10], tail: [-70, 62], top: [0, -85] },
  params: {
    at: { type: 'time', default: null, desc: 'vurgu anı: balon bir an büyür (0.4 sn)' },
    color: { type: 'color', default: 'purple' },
    rate: { type: 'number', default: 4, desc: 'nokta zıplama hızı (2-8)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.at == null ? -1 : t - p.at;
    const col = p.color;
    const rate = Math.max(2, Math.min(8, p.rate));

    // balon ölçeği — idle nefes + at pop'u
    let bs = 1 + 0.02 * Math.sin(t * 2.2);
    if (d >= 0 && d <= 0.4) {
      const pop = Math.min(1, d / 0.18);
      bs *= 1 + 0.22 * Math.sin(Math.PI * pop);
    }
    ctx.translate(0, -10);
    ctx.scale(bs, bs);

    const W = 210, H = 130;
    const bubblePath = () => {
      ctx.beginPath(); k.rrect(-W / 2, -H / 2, W, H, 26);
      ctx.moveTo(-W / 2 + 40, H / 2 - 4);
      ctx.lineTo(-W / 2 + 24, H / 2 + 34);
      ctx.lineTo(-W / 2 + 78, H / 2 - 4);
      ctx.closePath();
    };
    // gölge
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.save(); ctx.translate(6, 6); bubblePath(); ctx.fill(); ctx.restore();
    // balon gövdesi
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 7;
    bubblePath(); ctx.fill(); ctx.stroke();
    // sol üst parlama (kuyruğa taşmaz)
    ctx.save();
    ctx.beginPath(); k.rrect(-W / 2, -H / 2, W, H, 26); ctx.clip();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-62, -38, 46, 20, -0.4, 0, k.TAU); ctx.fill();
    ctx.restore();

    // yazıyor noktaları — döngülü zıplama
    for (let i = 0; i < 3; i++) {
      const ph = t * rate + i * (Math.PI * 2 / 3);
      const jump = Math.max(0, Math.sin(ph));
      const jx = -44 + i * 44;
      const jy = -jump * 16;
      const jr = 11 + jump * 2.5;
      ctx.fillStyle = k.rgba('bg', 0.12 * (1 - jump));
      ctx.beginPath(); ctx.arc(jx + 4, 6 + 4, jr, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(col, 0.55 + 0.45 * jump);
      ctx.strokeStyle = k.rgba('bg', 0.4); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(jx, jy, jr, 0, k.TAU); ctx.fill(); ctx.stroke();
    }
    ctx.restore();
  },
};

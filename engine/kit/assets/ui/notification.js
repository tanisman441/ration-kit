// ui/notification — bildirim kartı; başlık + metin, `at` anında yukarıdan
// kayarak girer. Contract: engine/kit/ASSETS.md
export default {
  name: 'notification',
  category: 'ui',
  desc: 'Bildirim kartı; başlık ve metinle yukarıdan kayarak girer',
  tags: ['bildirim', 'uyarı', 'kart', 'mesaj', 'itme', 'notification', 'alert', 'card', 'push', 'notice'],
  box: [-230, -150, 230, 90],
  bleed: 30,
  anchor: 'kart merkezi (0,0)',
  points: { icon: [-168, 0], card: [0, 0] },
  params: {
    color: { type: 'color', default: 'panel' },
    title: { type: 'text', default: 'Bildirim' },
    text: { type: 'text', default: 'Yeni bir gelişme var.' },
    at: { type: 'time', default: null, desc: 'giriş anı: yukarıdan kayar' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const d = p.at == null ? 1 : t - p.at;
    if (d < 0) return;
    const e = k.E.outCubic(k.clamp(d / 0.45, 0, 1));
    const yOff = (1 - e) * -160;                       // yukarıdan kayma
    const alpha = k.clamp(d / 0.25, 0, 1);
    const line = k.rgba('bg', 0.55), inkC = k.rgba('ink'), dimC = k.rgba('dim');
    const cardC = k.rgba(p.color);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const W = 420, H = 112, R = 22;
    const fit = (s, maxW, size) => {
      ctx.font = `700 ${size}px 'JetBrains Mono', monospace`;
      let out = String(s ?? '');
      while (out.length > 1 && ctx.measureText(out).width > maxW) out = out.slice(0, -1);
      if (out !== String(s ?? '')) out = out.slice(0, -1) + '…';
      return out;
    };

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(0, yOff);

    // gölge
    ctx.fillStyle = k.rgba('bg', 0.3);
    ctx.beginPath(); k.rrect(-W / 2, -H / 2 + 10, W, H, R); ctx.fill();
    // kart
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-W / 2 - LW / 2, -H / 2 - LW / 2, W + LW, H + LW, R + LW / 2); ctx.fill();
    ctx.fillStyle = cardC;
    ctx.beginPath(); k.rrect(-W / 2, -H / 2, W, H, R); ctx.fill();
    // üst parlama (premium)
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath(); k.rrect(-W / 2 + 16, -H / 2 + 10, W - 32, 18, 9); ctx.fill();

    // ikon: vurgu rengi kare + beyaz ünlem
    const ix = -W / 2 + 22, iy = -30, is = 60;
    ctx.fillStyle = k.rgba('accent');
    ctx.beginPath(); k.rrect(ix, iy, is, is, 16); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath(); k.rrect(ix + is / 2 - 4, iy + 12, 8, 22, 4); ctx.fill();
    ctx.beginPath(); ctx.arc(ix + is / 2, iy + 44, 5, 0, k.TAU); ctx.fill();

    // metinler (taşmayı … ile kırp)
    const tx = ix + is + 20;
    const maxW = (W / 2 - 24) - tx;
    const title = fit(p.title, maxW, 30);
    const body = fit(p.text, maxW, 24);
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = inkC;
    ctx.font = `700 30px 'JetBrains Mono', monospace`;
    ctx.fillText(title, tx, -6);
    ctx.fillStyle = dimC;
    ctx.font = `700 24px 'JetBrains Mono', monospace`;
    ctx.fillText(body, tx, 30);

    ctx.restore();
  },
};

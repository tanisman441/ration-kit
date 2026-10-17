// ui/killfeed — FPS öldürme bildirimi satırı; katil + ikon + kurban,
// `at` anında sağdan kayarak girer, 4 sn sonra solar. Contract: engine/kit/ASSETS.md
export default {
  name: 'killfeed',
  category: 'ui',
  desc: 'FPS öldürme bildirimi satırı; katil ve kurban adıyla sağdan kayarak girer',
  tags: ['öldürme', 'skor', 'bildirim', 'fps', 'kill', 'killfeed', 'score', 'ölüm', 'game', 'hud'],
  box: [-340, -44, 340, 44],
  bleed: 40,
  anchor: 'satır merkezi (0,0)',
  points: { killer: [-290, 0], mid: [0, 0], victim: [290, 0] },
  params: {
    killer: { type: 'text', default: 'Oyuncu1' },
    victim: { type: 'text', default: 'Oyuncu2' },
    at: { type: 'time', default: null, desc: 'giriş anı: sağdan kayar' },
    color: { type: 'color', default: 'red' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const d = p.at == null ? 1 : t - p.at;
    if (d < 0) return;
    const e = k.E.outCubic(k.clamp(d / 0.35, 0, 1));
    const xOff = (1 - e) * 240;
    const fade = d > 4 ? k.clamp(1 - (d - 4) / 0.6, 0, 1) : 1;
    const alpha = k.clamp(d / 0.2, 0, 1) * fade;
    if (alpha <= 0) return;
    const line = k.rgba('bg', 0.55), inkC = k.rgba('ink'), dimC = k.rgba('dim');
    const panelC = k.rgba('panel'), glyphC = k.rgba(p.color);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const fit = (s, maxW, size) => {
      ctx.font = `700 ${size}px 'JetBrains Mono', monospace`;
      let out = String(s ?? '');
      while (out.length > 1 && ctx.measureText(out).width > maxW) out = out.slice(0, -1);
      if (out !== String(s ?? '')) out = out.slice(0, -1) + '…';
      return out;
    };

    const killer = fit(p.killer, 220, 30);
    const victim = fit(p.victim, 220, 30);
    ctx.font = `700 30px 'JetBrains Mono', monospace`;
    const kw = ctx.measureText(killer).width;
    const vw = ctx.measureText(victim).width;
    const w = Math.min(640, kw + vw + 190);
    const h = 68, r = 18;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(xOff, 0);

    // satır gövdesi
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-w / 2 - LW / 2, -h / 2 - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
    ctx.fillStyle = panelC;
    ctx.beginPath(); k.rrect(-w / 2, -h / 2, w, h, r); ctx.fill();
    // üst parlama (premium)
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath(); k.rrect(-w / 2 + 14, -h / 2 + 8, w - 28, 14, 7); ctx.fill();

    // orta ikon: çarpı yıldızı (vurgu)
    k.glow(0, 0, 30, p.color, 0.35);
    ctx.strokeStyle = glyphC; ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(-13, -13); ctx.lineTo(13, 13);
    ctx.moveTo(13, -13); ctx.lineTo(-13, 13);
    ctx.stroke();

    // isimler
    ctx.textBaseline = 'middle';
    ctx.fillStyle = inkC;
    ctx.textAlign = 'right';
    ctx.fillText(killer, -34, 1);
    ctx.fillStyle = dimC;
    ctx.textAlign = 'left';
    ctx.fillText(victim, 34, 1);

    ctx.restore();
  },
};

// ui-animated/tooltip — ipucu baloncuğu; `at` anında pop ile belirir,
// sonra hafifçe yüzer (canlı idle). Kuyruk (0,0)'daki hedefi gösterir.
// Contract: engine/kit/ASSETS.md — balon bilgi yüzeyidir, parlama yok.
export default {
  name: 'tooltip',
  category: 'ui-animated',
  desc: 'İpucu baloncuğu; pop girişiyle belirir ve hafifçe yüzer, kuyruk hedefi gösterir',
  tags: ['tooltip', 'ipucu', 'baloncuk', 'bilgi', 'yardım', 'pop', 'tooltip bubble', 'hint', 'info', 'ipucu balonu'],
  box: [-215, -205, 215, 20],
  bleed: 15,
  anchor: 'kuyruğun işaret ettiği uç (0,0)',
  points: { tip: [0, 0], bubble: [0, -120] },
  params: {
    color: { type: 'color', default: 'ink' },
    text: { type: 'text', default: 'Biliyor muydun?' },
    at: { type: 'time', default: null, desc: 'belirme anı: pop girişi' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const W = 400, H = 96, R = 24, CY = -118; // balon merkezi
    const d = p.at == null ? 999 : t - p.at;
    if (d < 0) return;
    const pop = p.at == null ? 1 : k.E.outBack(k.clamp(d / 0.35, 0, 1), 2);
    const alpha = k.clamp(d / 0.18, 0, 1);
    const floatY = Math.sin((t * k.TAU) / 2.2) * 3; // canlı idle: hafif yüzme
    const line = k.rgba('bg', 0.55), inkC = k.rgba('ink');
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(0, floatY);
    ctx.scale(pop, pop);

    // kuyruk (balonun altında, hedefe doğru)
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(-26, CY + H / 2 - 14); ctx.lineTo(26, CY + H / 2 - 14); ctx.lineTo(0, -2);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath();
    ctx.moveTo(-20, CY + H / 2 - 12); ctx.lineTo(20, CY + H / 2 - 12); ctx.lineTo(0, -10);
    ctx.closePath(); ctx.fill();

    // balon gövde + dış hat
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-W / 2 - LW / 2, CY - H / 2 - LW / 2, W + LW, H + LW, R + LW / 2); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-W / 2, CY - H / 2, W, H, R); ctx.fill();

    // bilgi ikonu (vurgu rengi daire + i)
    const ix = -W / 2 + 30, ir = 26;
    ctx.fillStyle = k.rgba('cyan');
    ctx.beginPath(); ctx.arc(ix, CY, ir, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath(); ctx.arc(ix, CY - 10, 4.5, 0, k.TAU); ctx.fill();
    ctx.fillRect(ix - 4, CY - 2, 8, 18);

    // metin
    ctx.fillStyle = inkC;
    ctx.font = `700 30px 'JetBrains Mono', monospace`;
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    let out = String(p.text ?? '');
    const maxW = W / 2 - 20 - (ix + ir + 14);
    while (out.length > 1 && ctx.measureText(out).width > maxW) out = out.slice(0, -1);
    if (out !== String(p.text ?? '')) out = out.slice(0, -1) + '…';
    ctx.fillText(out, ix + ir + 14, CY + 2);

    ctx.restore();
  },
};

// ui/chat-bubble — konuşma balonu; metin ve kuyruk yönü ayarlanır,
// `at` anında pop animasyonuyla belirir. Contract: engine/kit/ASSETS.md
export default {
  name: 'chat-bubble',
  category: 'ui',
  desc: 'Konuşma balonu; metin, kuyruk yönü (left|right) ve belirme anı ayarlanabilir',
  tags: ['balon', 'konuşma', 'mesaj', 'diyalog', 'sohbet', 'chat', 'bubble', 'speech', 'message', 'dialog'],
  box: [-280, -120, 280, 120],
  bleed: 20,
  anchor: 'balon merkezi (0,0); kuyruk ucu points.tailL/tailR',
  points: { tailL: [-252, 72], tailR: [252, 72] },
  params: {
    color: { type: 'color', default: 'panel' },
    text: { type: 'text', default: 'Merhaba!' },
    side: { type: 'enum', values: ['left', 'right'], default: 'left' },
    at: { type: 'time', default: null, desc: 'belirme anı: pop animasyonu' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const d = p.at == null ? 1 : t - p.at;
    if (d < 0) return;
    const pop = p.at == null ? 1 : k.E.outBack(k.clamp(d / 0.28, 0, 1));
    const floatY = Math.sin(t * 2.2) * 3;                 // hafif süzülme
    const line = k.rgba('bg', 0.55), inkC = k.rgba('ink'), bubC = k.rgba(p.color);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // metin ölçüsü
    const lines = String(p.text ?? '').split('\n');
    ctx.font = `700 30px 'JetBrains Mono', monospace`;
    let tw = 0;
    for (const ln of lines) tw = Math.max(tw, ctx.measureText(ln).width);
    const w = Math.min(480, Math.max(120, tw + 64));
    const h = lines.length * 44 + 48;
    const dir = p.side === 'right' ? 1 : -1;
    const tipX = dir * 252, tipY = 72;
    const bx0 = -w / 2;

    ctx.save();
    ctx.translate(0, floatY);
    ctx.scale(pop, pop);

    // kuyruk (önce çizilir, balon eklemi kapatır)
    const bcx = dir < 0 ? bx0 + 55 : bx0 + w - 55;
    const bcy = h / 2 - 6;
    ctx.strokeStyle = line; ctx.lineWidth = 36;
    ctx.beginPath(); ctx.moveTo(bcx, bcy); ctx.lineTo(tipX, tipY); ctx.stroke();
    ctx.strokeStyle = bubC; ctx.lineWidth = 28;
    ctx.beginPath(); ctx.moveTo(bcx, bcy); ctx.lineTo(tipX, tipY - 2); ctx.stroke();

    // balon gövdesi
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(bx0 - LW / 2, -h / 2 - LW / 2, w + LW, h + LW, 26 + LW / 2); ctx.fill();
    ctx.fillStyle = bubC;
    ctx.beginPath(); k.rrect(bx0, -h / 2, w, h, 26); ctx.fill();
    // üst parlama (premium)
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath(); k.rrect(bx0 + 16, -h / 2 + 10, w - 32, 18, 9); ctx.fill();

    // metin
    ctx.fillStyle = inkC;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    lines.forEach((ln, i) => {
      ctx.fillText(ln, 0, (i - (lines.length - 1) / 2) * 44);
    });
    ctx.restore();
  },
};

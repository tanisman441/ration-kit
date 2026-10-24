// broadcast-fx/mic-on-air — canlı yayın mikrofonu, ON AIR tabelası yanar. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) mikrofon gövdesinin merkezidir.
export default {
  name: 'mic-on-air', category: 'broadcast-fx',
  desc: 'Canlı yayın mikrofonu: üstte ON AIR tabelası, on yükseldikçe tabela ve lamba parlar, ses dalgaları canlanır',
  tags: ['mikrofon', 'canlı yayın', 'on air', 'yayında', 'stüdyo', 'radyo', 'microphone', 'live', 'on air', 'broadcast', 'studio', 'radio'],
  box: [-140, -140, 140, 115],
  bleed: 30,
  anchor: 'mikrofon gövdesinin merkezi (0,0)',
  points: { mic: [0, -10], sign: [0, -110], stand: [0, 105] },
  params: {
    on: { type: 'number', default: 1, desc: '0–1: yayın açık mı (tabela parlaklığı + ses dalgası şiddeti)' },
    color: { type: 'color', default: 'panel2' },
  },
  draw(ctx, t, p, k) {
    const on = k.clamp(p.on ?? 1, 0, 1);
    const sway = Math.sin(t * 1.6) * 2; // idle salınım
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // ON AIR tabelası
    const signC = on > 0.5 ? 'red' : 'dim';
    blob(-105, -138, 210, 46, 12, k.rgba(signC));
    const lamp = on > 0.5 && (Math.sin(t * 4.5) > -0.6 || on >= 1);
    if (on > 0.05) k.glow(-82, -115, 16 + 14 * on, 'red', 0.35 * on);
    ctx.fillStyle = on > 0.5 ? k.rgba('red') : k.rgba('dim');
    ctx.beginPath(); ctx.arc(-82, -115, 9, 0, k.TAU); ctx.fill();
    ctx.save();
    ctx.font = "700 24px system-ui, sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = on > 0.5 ? 'rgba(255,255,255,0.95)' : k.rgba('ink', 0.6);
    ctx.fillText('ON AIR', 18, -114);
    ctx.restore();

    // askı + mikrofon gövdesi (hafif salınım)
    ctx.save(); ctx.translate(sway, 0);
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(0, -8, 52, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); // yoke
    blob(-30, -62, 60, 104, 30, k.rgba(p.color));
    // ızgara çizgileri
    ctx.strokeStyle = k.rgba('ink', 0.45); ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      const gy = -44 + i * 18;
      ctx.beginPath(); ctx.moveTo(-22, gy); ctx.lineTo(22, gy); ctx.stroke();
    }
    // parlama: sol üst, alfa 0.10
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-14, -48, 12, 22, -0.3, 0, k.TAU); ctx.fill();
    // ayak
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(0, 42); ctx.lineTo(0, 92); ctx.stroke();
    blob(-38, 88, 76, 14, 7, k.rgba('dim'));
    ctx.restore();

    // ses dalgaları: on ile büyür, idle titrer (0.5 sn döngü nabzı)
    for (const side of [-1, 1]) {
      for (let i = 0; i < 3; i++) {
        const wob = 1 + 0.18 * k.noise1(t * 3 + i * 7 + (side + 1) * 3);
        const r = (18 + i * 16) * wob;
        ctx.globalAlpha = on * (0.75 - i * 0.2);
        ctx.strokeStyle = k.rgba('accent'); ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(side * 52, -10, r, side < 0 ? Math.PI * 0.6 : -Math.PI * 0.6, side < 0 ? Math.PI * 1.4 : Math.PI * 0.4); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    // zemin gölgesi
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(0, 112, 52, 6, 0, 0, k.TAU); ctx.fill();
  },
};

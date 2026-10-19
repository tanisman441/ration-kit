// ui-animated/modal-pop — diyalog penceresi; `at` anında ölçekli pop ile
// açılır, onay düğmesi canlı nabızla parlar (idle).
// Contract: engine/kit/ASSETS.md — pencere bilgi yüzeyidir, parlama yok.
export default {
  name: 'modal-pop',
  category: 'ui-animated',
  desc: 'Diyalog penceresi; pop girişiyle açılır, onay düğmesi nabız gibi parlar',
  tags: ['modal', 'pencere', 'diyalog', 'popup', 'onay', 'uyarı kutusu', 'dialog', 'popup window', 'confirm', 'alert box'],
  box: [-250, -180, 250, 180],
  bleed: 25,
  anchor: 'pencere merkezi (0,0)',
  points: { confirm: [105, 108], cancel: [-105, 108], title: [0, -108] },
  params: {
    color: { type: 'color', default: 'panel' },
    title: { type: 'text', default: 'Emin misin?' },
    at: { type: 'time', default: null, desc: 'açılma anı: ölçekli pop girişi' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const W = 440, H = 300, R = 26, BAR = 68;
    const d = p.at == null ? 999 : t - p.at;
    if (d < 0) return;
    const pop = p.at == null ? 1 : k.E.outBack(k.clamp(d / 0.42, 0, 1), 2.2);
    const alpha = k.clamp(d / 0.2, 0, 1);
    const line = k.rgba('bg', 0.55), inkC = k.rgba('ink'), dimC = k.rgba('dim');
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.scale(pop, pop);

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.3);
    ctx.beginPath(); k.rrect(-W / 2, -H / 2 + 14, W, H, R); ctx.fill();
    // gövde + dış hat
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-W / 2 - LW / 2, -H / 2 - LW / 2, W + LW, H + LW, R + LW / 2); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-W / 2, -H / 2, W, H, R); ctx.fill();

    // başlık çubuğu (ayırıcı çizgi)
    ctx.strokeStyle = k.rgba('bg', 0.45);
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-W / 2 + 24, -H / 2 + BAR); ctx.lineTo(W / 2 - 24, -H / 2 + BAR); ctx.stroke();

    // trafik ışıkları
    const dots = ['red', 'yellow', 'green'];
    dots.forEach((c, i) => {
      ctx.fillStyle = k.rgba(c);
      ctx.beginPath(); ctx.arc(-W / 2 + 44 + i * 40, -H / 2 + BAR / 2, 11, 0, k.TAU); ctx.fill();
    });

    // başlık metni
    ctx.fillStyle = inkC;
    ctx.font = `700 32px 'JetBrains Mono', monospace`;
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    let title = String(p.title ?? '');
    const maxTW = W - 200;
    while (title.length > 1 && ctx.measureText(title).width > maxTW) title = title.slice(0, -1);
    if (title !== String(p.title ?? '')) title = title.slice(0, -1) + '…';
    ctx.fillText(title, -W / 2 + 44 + 3 * 40 + 14, -H / 2 + BAR / 2 + 1);

    // gövde metin çizgileri (soyut satırlar)
    const rows = [0.92, 0.78, 0.62];
    rows.forEach((wfrac, i) => {
      ctx.fillStyle = k.rgba('dim', 0.55);
      const bw = (W - 96) * wfrac;
      ctx.beginPath(); k.rrect(-W / 2 + 48, -H / 2 + BAR + 30 + i * 40, bw, 20, 10); ctx.fill();
    });

    // düğmeler: iptal (çerçeve) + onay (vurgu, nabız)
    const by = H / 2 - 62, bw2 = 170, bh = 64;
    ctx.lineWidth = 5;
    ctx.strokeStyle = k.rgba('dim', 0.8);
    ctx.beginPath(); k.rrect(-bw2 - 12, by - bh / 2, bw2, bh, 18); ctx.fill();
    ctx.stroke();
    const pulse = 0.5 + 0.5 * Math.sin((t * k.TAU) / 2.4); // canlı idle nabız
    ctx.fillStyle = k.rgba('green');
    ctx.globalAlpha = alpha * (0.82 + 0.18 * pulse);
    ctx.beginPath(); k.rrect(12, by - bh / 2, bw2, bh, 18); ctx.fill();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.font = `700 30px 'JetBrains Mono', monospace`;
    ctx.textAlign = 'center';
    ctx.fillText('Tamam', 12 + bw2 / 2, by + 2);
    ctx.fillStyle = dimC;
    ctx.fillText('Vazgeç', -12 - bw2 / 2, by + 2);

    ctx.restore();
  },
};

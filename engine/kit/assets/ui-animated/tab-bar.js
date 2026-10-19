// ui-animated/tab-bar — alt sekme çubuğu; `at` anında aşağıdan kayarak
// girer, aktif sekme vurgu hapı + ikonla belirginleşir, vurgu hafifçe nabız
// yapar (canlı idle).
// Contract: engine/kit/ASSETS.md
export default {
  name: 'tab-bar',
  category: 'ui-animated',
  desc: 'Alt sekme çubuğu; kayarak girer, aktif sekme vurgu hapıyla öne çıkar',
  tags: ['tab', 'sekme', 'çubuk', 'navigasyon', 'menü', 'alt bar', 'tab bar', 'navigation', 'bottom bar', 'menu'],
  box: [-300, -95, 300, 190], // giriş kayması (aşağıdan +110) kutu içinde
  bleed: 15,
  anchor: 'çubuk merkezi (0,0)',
  points: { tab1: [-210, 0], tab2: [-70, 0], tab3: [70, 0], tab4: [210, 0] },
  params: {
    color: { type: 'color', default: 'panel' },
    active: { type: 'enum', values: ['1', '2', '3', '4'], default: '1', desc: 'aktif sekme' },
    at: { type: 'time', default: null, desc: 'giriş anı: aşağıdan kayarak gelir' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const W = 580, H = 150, R = 30;
    const d = p.at == null ? 999 : t - p.at;
    if (d < 0) return;
    const e = p.at == null ? 1 : k.E.outCubic(k.clamp(d / 0.45, 0, 1));
    const yOff = (1 - e) * 110; // giriş kayması (kutu alt sınırının içinde)
    const alpha = k.clamp(d / 0.22, 0, 1);
    const line = k.rgba('bg', 0.55), inkC = k.rgba('ink'), dimC = k.rgba('dim');
    const active = Math.max(1, Math.min(4, parseInt(p.active, 10) || 1));
    const tx = [-210, -70, 70, 210];
    const pulse = 0.5 + 0.5 * Math.sin((t * k.TAU) / 2.6); // canlı idle
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const glyph = (cx, cy, i, col) => {
      ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 8;
      if (i === 0) { // ev
        ctx.beginPath();
        ctx.moveTo(cx - 24, cy + 2); ctx.lineTo(cx, cy - 22); ctx.lineTo(cx + 24, cy + 2);
        ctx.lineTo(cx + 24, cy + 24); ctx.lineTo(cx - 24, cy + 24); ctx.closePath(); ctx.stroke();
      } else if (i === 1) { // arama
        ctx.beginPath(); ctx.arc(cx - 4, cy - 2, 17, 0, k.TAU); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + 9, cy + 11); ctx.lineTo(cx + 24, cy + 26); ctx.stroke();
      } else if (i === 2) { // zil
        ctx.beginPath();
        ctx.moveTo(cx - 20, cy + 10); ctx.lineTo(cx - 20, cy - 8);
        ctx.arc(cx, cy - 8, 20, Math.PI, 0);
        ctx.lineTo(cx + 20, cy + 10); ctx.closePath(); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy + 20, 5, 0, k.TAU); ctx.fill();
      } else { // kullanıcı
        ctx.beginPath(); ctx.arc(cx, cy - 8, 13, 0, k.TAU); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy + 30, 22, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      }
    };
    const labels = ['Ev', 'Ara', 'Zil', 'Profil'];

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(0, yOff);

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.3);
    ctx.beginPath(); k.rrect(-W / 2, -H / 2 + 12, W, H, R); ctx.fill();
    // gövde + dış hat
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-W / 2 - LW / 2, -H / 2 - LW / 2, W + LW, H + LW, R + LW / 2); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-W / 2, -H / 2, W, H, R); ctx.fill();

    // sekmeler
    for (let i = 0; i < 4; i++) {
      const cx = tx[i], isActive = i + 1 === active;
      if (isActive) {
        // vurgu hapı (vurgu rengi, nabızlı)
        ctx.fillStyle = k.rgba('accent', 0.16 + 0.08 * pulse);
        ctx.beginPath(); k.rrect(cx - 62, -52, 124, 104, 26); ctx.fill();
        ctx.fillStyle = k.rgba('accent', 0.55);
        ctx.beginPath(); k.rrect(cx - 30, 40, 60, 8, 4); ctx.fill(); // alt gösterge
        glyph(cx, -8, i, k.rgba('accent'));
        ctx.fillStyle = k.rgba('accent');
      } else {
        glyph(cx, -8, i, dimC);
        ctx.fillStyle = dimC;
      }
      ctx.font = `700 22px 'JetBrains Mono', monospace`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
      ctx.fillText(labels[i], cx, 58);
    }

    ctx.restore();
  },
};

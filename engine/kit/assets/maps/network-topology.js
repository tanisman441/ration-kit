// maps/network-topology — ağ topolojisi; merkez hub ve 6 düğüm, active anında veri paketleri akar.
// NOT: canvas y-aşağıdır; (0,0) hub merkezidir.
export default {
  name: 'network-topology',
  category: 'maps',
  desc: 'Ağ topolojisi; merkez hub ve 6 düğüm, active anında veri paketleri akar',
  tags: ['ağ', 'topoloji', 'network', 'topology', 'bağlantı', 'sunucu ağı', 'node', 'hub', 'internet ağı', 'lan', 'düğüm'],
  box: [-240, -180, 240, 180],
  bleed: 40,
  anchor: 'hub merkezi (0,0)',
  points: { hub: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'düğüm rengi' },
    active: { type: 'time', default: null, desc: 'veri akışı anı (paketler hub’dan düğümlere akar)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const nodeC = k.rgba(p.color);
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.7))).join(',')})`;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // düğüm konumları (6 adet, yarıçap 130)
    const nodes = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * k.TAU - Math.PI / 2;
      nodes.push([Math.cos(a) * 130, Math.sin(a) * 130]);
    }

    // bağlantı çizgileri (serbest çizgi kuralı: ink)
    ctx.strokeStyle = k.rgba('ink', 0.55); ctx.lineWidth = 4;
    nodes.forEach(([nx, ny]) => {
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(nx, ny); ctx.stroke();
    });

    // düğümler: daire + iç ekran işareti
    nodes.forEach(([nx, ny], i) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(nx, ny, 26 + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = i % 2 ? dark : nodeC;
      ctx.beginPath(); ctx.arc(nx, ny, 26, 0, k.TAU); ctx.fill();
      // iç detay: mini ekran çizgileri
      ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(nx - 11, ny - 4); ctx.lineTo(nx + 11, ny - 4); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(nx - 11, ny + 5); ctx.lineTo(nx + 2, ny + 5); ctx.stroke();
      // parlama
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(nx - 9, ny - 10, 8, 6, -0.4, 0, k.TAU); ctx.fill();
    });

    // hub: köşeli gövde + LED + glow
    const ledOn = 0.5 + 0.5 * Math.sin(t * 3 + k.hash(7) * k.TAU) > 0.25;
    if (ledOn) k.glow(0, 0, 52, 'cyan', 0.3);
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-34 - LW / 2, -34 - LW / 2, 68 + LW, 68 + LW, 18); ctx.fill();
    ctx.fillStyle = k.rgba('panel2'); ctx.beginPath(); k.rrect(-34, -34, 68, 68, 16); ctx.fill();
    // hub portları
    ctx.fillStyle = k.rgba('bg', 0.6);
    ctx.beginPath(); k.rrect(-22, -24, 44, 10, 4); ctx.fill();
    ctx.beginPath(); k.rrect(-22, -6, 44, 10, 4); ctx.fill();
    // LED
    ctx.fillStyle = k.rgba('cyan', ledOn ? 1 : 0.25);
    ctx.beginPath(); ctx.arc(0, 22, 6, 0, k.TAU); ctx.fill();
    // hub parlaması
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-13, -14, 13, 9, -0.4, 0, k.TAU); ctx.fill();

    // active: paketler hub'dan düğümlere akar (0.9 sn)
    const d = p.active == null ? -1 : t - p.active;
    if (d >= 0 && d <= 1.1) {
      const prog = k.prog(d, 0, 0.9);
      const fade = 1 - k.prog(d, 0.7, 1.1);
      nodes.forEach(([nx, ny], i) => {
        const off = (i * 0.09) % 0.5;
        const q = k.clamp((prog - off) / (1 - off), 0, 1);
        if (q <= 0 || q >= 1) return;
        const px = nx * q, py = ny * q;
        k.glow(px, py, 18, 'cyan', 0.45 * fade);
        ctx.fillStyle = k.rgba('cyan', fade);
        ctx.beginPath(); ctx.arc(px, py, 7, 0, k.TAU); ctx.fill();
      });
    }

    ctx.restore();
  },
};

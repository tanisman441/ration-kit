// environment/crate — 3/4 görünüm kasa; wood = çıtalı, metal = perçinli.
// NOT: canvas y-aşağıdır; zemin (0,0), kasa negatif y yönünde yukarı uzar.
export default {
  name: 'crate',
  category: 'environment',
  desc: '3/4 görünüm kasa; wood varyantı çıtalı, metal varyantı perçinli',
  tags: ['kasa', 'sandık', 'kutu', 'malzeme', 'crate', 'box', 'wooden crate', 'metal crate', 'supply'],
  box: [-110, -150, 110, 12],
  bleed: 0,
  anchor: 'zemin (0,0); kasa merkezi',
  points: { top: [0, -132] },
  params: {
    color: { type: 'color', default: 'dim' },
    variant: { type: 'enum', values: ['wood', 'metal'], default: 'wood' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.8))).join(',')})`;
    const darker = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.64))).join(',')})`;
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const poly = (pts, c) => {
      ctx.fillStyle = c; ctx.beginPath();
      pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = LW; ctx.stroke();
    };
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(8, -5, 105, 10, 0, 0, k.TAU); ctx.fill();

    const wood = p.variant === 'wood';

    // yan yüz (en koyu) — önce çizilir
    poly([[70, -108], [96, -136], [96, -36], [70, -8]], darker);

    // üst yüz
    poly([[-70, -108], [70, -108], [96, -136], [-44, -136]], dark);

    // ön yüz
    blob(-70, -108, 140, 100, 8, k.rgba(p.color));

    if (wood) {
      // tahta derzleri (yatay)
      ctx.strokeStyle = k.rgba('bg', 0.35); ctx.lineWidth = 3;
      for (const ly of [-83, -58, -33]) {
        ctx.beginPath(); ctx.moveTo(-64, ly); ctx.lineTo(64, ly); ctx.stroke();
      }
      // köşe çıtaları (dikey)
      ctx.fillStyle = dark;
      ctx.beginPath(); k.rrect(-70, -108, 16, 100, 6); ctx.fill();
      ctx.beginPath(); k.rrect(54, -108, 16, 100, 6); ctx.fill();
      // çapraz destek
      ctx.strokeStyle = k.rgba('bg', 0.4); ctx.lineWidth = 10;
      ctx.beginPath(); ctx.moveTo(-52, -96); ctx.lineTo(52, -20); ctx.stroke();
      // üst yüzde tahta çizgileri
      ctx.strokeStyle = k.rgba('bg', 0.3); ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(-57, -122); ctx.lineTo(83, -122); ctx.stroke();
    } else {
      // perçinler (ön yüz kenarları)
      ctx.fillStyle = k.rgba('ink', 0.8);
      for (let i = 0; i < 4; i++) {
        const ry = -96 + i * 26;
        for (const rx of [-62, 62]) { ctx.beginPath(); ctx.arc(rx, ry, 3.5, 0, k.TAU); ctx.fill(); }
      }
      // panel çizgisi + şablon etiket
      ctx.strokeStyle = k.rgba('bg', 0.4); ctx.lineWidth = 3;
      ctx.beginPath(); k.rrect(-44, -88, 88, 60, 6); ctx.stroke();
      ctx.fillStyle = k.rgba('bg', 0.3);
      ctx.beginPath(); k.rrect(-34, -78, 40, 10, 4); ctx.fill();
      ctx.beginPath(); k.rrect(-34, -62, 68, 10, 4); ctx.fill();
      // üst yüzde metal şerit
      ctx.strokeStyle = k.rgba('bg', 0.35); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-44, -136); ctx.lineTo(-18, -108); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(96, -136); ctx.lineTo(70, -108); ctx.stroke();
    }

    // premium parlama (üst yüz sol)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath();
    ctx.moveTo(-60, -112); ctx.lineTo(-20, -112); ctx.lineTo(2, -132); ctx.lineTo(-38, -132);
    ctx.closePath(); ctx.fill();
  },
};

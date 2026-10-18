// school/book — yarı açık kitap; flip anında sağ sayfa sola doğru çevrilir
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır; (0,0) omurga merkezidir.
export default {
  name: 'book', category: 'school',
  desc: 'Yarı açık duran kitap; flip anında sağdaki sayfa havada kavis çizerek sola çevrilir',
  tags: ['kitap', 'okuma', 'book', 'reading', 'ders', 'study', 'sayfa'],
  box: [-130, -90, 130, 90],
  bleed: 60,
  anchor: 'kitap omurgası (0,0)',
  points: { spine: [0, 10], left: [-105, -25], right: [105, -25] },
  params: {
    open: { type: 'number', default: 0.65, desc: 'sayfaların açıklığı (0: kapalıya yakın V, 1: tam açık)' },
    flip: { type: 'time', default: null, desc: 'sayfa çevirme anı (sağ sayfa sola çevrilir, ~0.7 sn)' },
    color: { type: 'color', default: 'accent' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const line = k.rgba('bg', 0.55);
    const page = k.rgba('panel2');
    const cover = k.rgba(p.color);
    const d = p.flip == null ? -1 : t - p.flip;
    const open = k.clamp(p.open == null ? 0.65 : p.open, 0, 1);
    const bob = Math.sin(t * (k.TAU / 2.4)) * 3; // hafif nefes (idle)

    // sayfa açısı: open=1 → neredeyse düz, open=0 → V formu
    const a = 0.06 + (1 - open) * 0.38;

    ctx.save();
    ctx.translate(0, 8 + bob);

    // kapak (sayfalardan biraz büyük, arkada)
    for (const s of [-1, 1]) {
      ctx.save();
      ctx.rotate(s * (a + 0.03));
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(s < 0 ? -118 - LW / 2 : -LW / 2, -72 - LW / 2, 118 + LW / 2, 152 + LW, 12); ctx.fill();
      ctx.fillStyle = cover;
      ctx.beginPath(); k.rrect(s < 0 ? -118 : 0, -72, 118, 152, 12); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.beginPath(); k.rrect(s < 0 ? -118 : 0, 40, 118, 40, 12); ctx.fill();
      ctx.restore();
    }

    // sayfalar
    for (const s of [-1, 1]) {
      ctx.save();
      ctx.rotate(s * a);
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(s < 0 ? -110 - LW / 2 : -LW / 2, -64 - LW / 2, 110 + LW / 2, 136 + LW, 10); ctx.fill();
      ctx.fillStyle = page;
      ctx.beginPath(); k.rrect(s < 0 ? -110 : 0, -64, 110, 136, 10); ctx.fill();
      // satır çizgileri
      ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3; ctx.lineCap = 'round';
      for (let i = 0; i < 4; i++) {
        const y = -38 + i * 24;
        ctx.beginPath();
        ctx.moveTo(s < 0 ? -96 : 14, y);
        ctx.lineTo(s < 0 ? -14 : 96, y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // omurga
    ctx.fillStyle = k.rgba('ink', 0.25);
    k.rrect(-7, -66, 14, 140, 7); ctx.fill();

    // premium parlama (sol üst sayfada)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-52, -40, 26, 12, -0.35, 0, k.TAU); ctx.fill();

    ctx.restore();

    // çevrilen sayfa: omurgadan kalkıp sola kavis çizer
    if (d >= 0 && d < 0.7) {
      const q = d / 0.7;
      const e = q * q * (3 - 2 * q); // ease in-out
      const tipX = 100 - e * 200;          // sağdan sola
      const tipY = 8 + bob - Math.sin(q * Math.PI) * 85; // havada kavis
      ctx.fillStyle = line;
      ctx.strokeStyle = line; ctx.lineWidth = LW;
      ctx.beginPath();
      ctx.moveTo(0, 8 + bob);
      ctx.quadraticCurveTo(tipX / 2, tipY - 25, tipX, tipY);
      ctx.lineTo(tipX, tipY + 26);
      ctx.quadraticCurveTo(tipX / 2, tipY + 1, 0, 34 + bob);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = page;
      ctx.beginPath();
      ctx.moveTo(0, 10 + bob);
      ctx.quadraticCurveTo(tipX / 2, tipY - 19, tipX - 4, tipY + 3);
      ctx.lineTo(tipX - 4, tipY + 23);
      ctx.quadraticCurveTo(tipX / 2, tipY + 4, 0, 30 + bob);
      ctx.closePath(); ctx.fill();
    }
  },
};

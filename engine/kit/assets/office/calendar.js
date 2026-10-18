// office/calendar — duvar takvimi: üstte spiral halka, ay ızgarası;
// flip anında üst sayfa yukarı kıvrılıp çevrilir (işaretli gün değişir), işaretli gün nabız yapar.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; anchor sayfa merkezidir (0,0).
export default {
  name: 'calendar', category: 'office',
  desc: 'Duvar takvimi; sayfa çevirme anında üst sayfa yukarı kıvrılır, işaretli gün değişir',
  tags: ['takvim', 'duvar takvimi', 'tarih', 'ajanda', 'ofis', 'calendar', 'wall calendar', 'date', 'planner'],
  box: [-115, -115, 115, 115],
  bleed: 14,
  anchor: 'sayfa merkezi (0,0)',
  points: { top: [0, -108], page: [0, 10], rings: [0, -88] },
  params: {
    color: { type: 'color', default: 'panel2' },
    flip: { type: 'time', default: null, desc: 'sayfa çevirme anı: üst sayfa 0.7 sn\'de yukarı kıvrılıp düşer, işaretli gün değişir' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const SH = 'rgba(0,0,0,0.12)', HI = 'rgba(255,255,255,0.10)';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const shade = (x, y, w, h, r) => {
      ctx.fillStyle = SH; ctx.save(); ctx.translate(6, 6);
      ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill(); ctx.restore();
    };
    const shine = (x, y, rx, ry, rot) => {
      ctx.fillStyle = HI; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot || 0, 0, k.TAU); ctx.fill();
    };

    const PW = 190, PH = 168, px0 = -PW / 2, py0 = -84;
    const pageY = py0 + 30, pageH = PH - 30;

    // başlık bandı (üstte renkli şerit)
    shade(px0, py0, PW, 34, 10);
    blob(px0, py0, PW, 34, 10, k.rgba('accent'));
    shine(px0 + 22, py0 + 8, 12, 4, -0.1);
    // ay yazısı (çubuklarla simgele)
    ctx.fillStyle = k.rgba('bg', 0.85);
    ctx.beginPath(); k.rrect(px0 + 62, py0 + 12, 66, 10, 5); ctx.fill();

    // bir sayfa çiz: zemin + gün ızgarası + işaretli gün (ox,oy ofsetli çizim)
    const drawPage = (ox, oy, markC, markR, pulseOn) => {
      ctx.fillStyle = k.rgba('bg', 0.97);
      ctx.beginPath(); k.rrect(ox + px0, oy + pageY, PW, pageH, 10); ctx.fill();
      const gx = ox + px0 + 12, gy = oy + pageY + 12, cw = 23, ch = 17, gap = 4;
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 7; c++) {
          ctx.fillStyle = k.rgba('dim', 0.28);
          ctx.beginPath(); k.rrect(gx + c * (cw + gap), gy + r * (ch + gap), cw, ch, 4); ctx.fill();
        }
      }
      ctx.fillStyle = k.rgba('red', 0.85);
      ctx.beginPath(); k.rrect(gx + markC * (cw + gap), gy + markR * (ch + gap), cw, ch, 4); ctx.fill();
      const pulse = pulseOn ? 1 + Math.sin(t * 4) * 0.12 : 1;
      ctx.strokeStyle = k.rgba('red', 0.9); ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.arc(gx + markC * (cw + gap) + cw / 2, gy + markR * (ch + gap) + ch / 2, 11 * pulse, 0, k.TAU); ctx.stroke();
    };

    // alt sayfa (çevrilince ortaya çıkar: farklı işaretli gün)
    shade(px0, pageY, PW, pageH, 10);
    drawPage(0, 0, 4, 2, true);

    // spiral halkalar (üstte)
    for (let i = 0; i < 5; i++) {
      const rx = -64 + i * 32;
      ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(rx, py0 + 2, 9, 0, k.TAU); ctx.stroke();
    }

    // üst sayfa: çevirme anında yukarı kıvrılıp kaybolur
    const d = p.flip == null ? -1 : t - p.flip;
    if (d >= 0 && d < 0.8) {
      const fp = k.prog(d, 0, 0.8);              // 0 → 1
      const lift = fp * 130;                     // yukarı kalkış
      const shrink = 1 - fp * 0.85;              // kıvrılma (dikey basıklaşma)
      const fade = 1 - k.prog(d, 0.55, 0.8);
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.translate(0, pageY - lift);
      ctx.scale(1, Math.max(shrink, 0.05));
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(px0 - LW / 2, -LW / 2, PW + LW, pageH + LW, 10); ctx.fill();
      drawPage(0, -pageY, 1, 1, false);          // ofseti sıfırla: sayfa kendi kutusunda
      ctx.restore();
    } else if (d < 0) {
      // çevrilmemiş üst sayfa (hafif salınım)
      const sway = Math.sin(t * 1.5) * 2;
      ctx.save(); ctx.translate(sway, 0);
      ctx.fillStyle = SH; ctx.save(); ctx.translate(6, 6);
      ctx.beginPath(); k.rrect(px0, pageY, PW, pageH, 10); ctx.fill(); ctx.restore();
      drawPage(0, 0, 1, 1, false);
      ctx.restore();
      shine(px0 + 22, pageY + 8, 12, 4, -0.1);
    }
    // d >= 0.8: sayfa tamamen çevrildi, alt sayfa görünür
  },
};

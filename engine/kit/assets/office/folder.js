// office/folder — dosya klasörü: arkası yüksek, önü alçak, üstte sekme;
// open anında ön kapak öne eğilir ve kağıtlar yukarı kayarak çıkar.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; anchor klasör taban merkezidir (0,0).
export default {
  name: 'folder', category: 'office',
  desc: 'Dosya klasörü; açılınca kağıtlar yukarı kayar, ön kapak öne eğilir',
  tags: ['klasör', 'dosya', 'dosya klasörü', 'belge', 'evrak', 'folder', 'file folder', 'documents', 'paperwork'],
  box: [-115, -120, 115, 75],
  bleed: 14,
  anchor: 'klasör taban merkezi (0,0)',
  points: { top: [0, -110], papers: [0, -80], tab: [-58, -104] },
  params: {
    color: { type: 'color', default: 'yellow' },
    open: { type: 'time', default: null, desc: 'açılma anı: kağıtlar çıkar, kapak öne eğilir; 1.2 sn sürer' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
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

    const d = p.open == null ? -1 : t - p.open;
    const op = d < 0 ? 0 : k.prog(d, 0, 0.45);          // 0 kapalı → 1 açık
    const paperOut = op * 62;                            // kağıtların yükselişi
    const flapTilt = op * 26;                            // ön kapağın öne eğilişi

    // arka kapak (yüksek) + sekme
    shade(-100, -92, 200, 152, 10);
    blob(-100, -92, 200, 152, 10, body);
    shine(-78, -82, 14, 6, -0.15);
    // sekme (sol üst)
    shade(-100, -112, 62, 26, 8);
    blob(-100, -112, 62, 26, 8, body);
    shine(-88, -107, 8, 3.5, -0.1);
    // sekme etiketi
    ctx.fillStyle = k.rgba('bg', 0.85);
    ctx.beginPath(); k.rrect(-92, -106, 44, 12, 5); ctx.fill();

    // kağıtlar (open'da yukarı kayar; boşta hafif salınım)
    const idleBob = Math.sin(t * 1.8) * 2;
    for (let i = 0; i < 3; i++) {
      const px = -78 + i * 62, py = -64 - paperOut + idleBob * (i % 2 ? 1 : -1) - i * 3;
      ctx.fillStyle = SH; ctx.save(); ctx.translate(6, 6);
      ctx.beginPath(); k.rrect(px, py, 56, 84, 5); ctx.fill(); ctx.restore();
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(px - LW / 2, py - LW / 2, 56 + LW, 84 + LW, 5 + LW / 2); ctx.fill();
      ctx.fillStyle = k.rgba('bg', 0.95); ctx.beginPath(); k.rrect(px, py, 56, 84, 5); ctx.fill();
      // yazı çizgileri
      ctx.fillStyle = k.rgba('dim', 0.7);
      for (let ln = 0; ln < 4; ln++) {
        ctx.beginPath(); k.rrect(px + 8, py + 14 + ln * 14, 40 - (k.hash(i * 9 + ln) % 12), 5, 2.5); ctx.fill();
      }
    }

    // ön kapak (alçak; open'da öne eğilir → aşağı kaymış gibi)
    shade(-100, -52 + flapTilt, 200, 112, 10);
    blob(-100, -52 + flapTilt, 200, 112, 10, body);
    shine(-78, -42 + flapTilt, 14, 6, -0.12);
    // ön kapak detay çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-84, -18 + flapTilt); ctx.lineTo(84, -18 + flapTilt); ctx.stroke();
  },
};

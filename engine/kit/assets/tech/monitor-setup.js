// tech/monitor-setup — çift monitörlü kurulum: ortak ayak, iki ekran.
// Ekran içeriği laptop.js ile aynı dilde (code|chart|game|blank).
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; taban (0,0), her şey negatif y yönünde yukarı uzar.
export default {
  name: 'monitor-setup', category: 'tech',
  desc: 'Çift monitörlü kurulum; ekran içeriği kod, grafik, oyun veya boş olabilir',
  tags: ['monitör', 'monitor', 'ekran', 'çift ekran', 'kurulum', 'dual screen', 'setup', 'masaüstü', 'desktop'],
  box: [-215, -200, 215, 12],
  bleed: 8,
  anchor: 'taban (0,0); monitörler yukarı uzar',
  points: { screenL: [-102, -128], screenR: [102, -128] },
  params: {
    color: { type: 'color', default: 'panel2' },
    screen: { type: 'enum', values: ['code', 'chart', 'game', 'blank'], default: 'code', desc: 'ekran içeriği' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -4, 190, 10, 0, 0, k.TAU); ctx.fill();

    // ayak: taban + direk + iki kol
    blob(-46, -16, 92, 14, 6, body);
    blob(-9, -96, 18, 84, 6, body);
    ctx.strokeStyle = line; ctx.lineWidth = 13;
    ctx.beginPath(); ctx.moveTo(0, -90); ctx.lineTo(-100, -104); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -90); ctx.lineTo(100, -104); ctx.stroke();
    ctx.strokeStyle = body; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(0, -90); ctx.lineTo(-100, -104); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -90); ctx.lineTo(100, -104); ctx.stroke();

    // ekran içeriği (laptop.js ile aynı dil)
    const content = (sx, sy, sw, sh, seed) => {
      const acc = k.rgba('cyan');
      if (p.screen === 'code') {
        const cols = ['cyan', 'green', 'yellow', 'dim', 'cyan'];
        const ws = [sw * 0.55, sw * 0.42, sw * 0.68, sw * 0.35, sw * 0.5];
        for (let i = 0; i < 5; i++) {
          ctx.fillStyle = k.rgba(cols[i], i === 4 ? 0.7 : 0.85);
          ctx.beginPath(); k.rrect(sx + 10, sy + 10 + i * 15, ws[i], 8, 4); ctx.fill();
        }
        if (Math.sin(t * 5 + seed) > 0) {
          ctx.fillStyle = acc;
          ctx.beginPath(); k.rrect(sx + 10 + sw * 0.55, sy + 10 + 4 * 15, 7, 8, 3); ctx.fill();
        }
      } else if (p.screen === 'chart') {
        ctx.strokeStyle = k.rgba('dim', 0.8); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(sx + 12, sy + 10); ctx.lineTo(sx + 12, sy + sh - 12); ctx.lineTo(sx + sw - 10, sy + sh - 12); ctx.stroke();
        for (let i = 0; i < 5; i++) {
          const h = 14 + (sh - 50) * (0.5 + 0.5 * Math.sin(t * 1.4 + i * 1.2 + seed));
          ctx.fillStyle = k.rgba(i === 4 ? 'green' : 'cyan', 0.85);
          ctx.beginPath(); k.rrect(sx + 20 + i * ((sw - 40) / 5), sy + sh - 12 - h, (sw - 60) / 5, h, 3); ctx.fill();
        }
      } else if (p.screen === 'game') {
        const tx = sx + 20 + ((t * 60 + seed * 40) % (sw - 44));
        const ty = sy + sh / 2 + Math.sin(t * 3.2 + seed) * 12;
        k.glow(tx, ty, 20, 'red', 0.3);
        ctx.fillStyle = k.rgba('red');
        ctx.beginPath(); ctx.arc(tx, ty, 8, 0, k.TAU); ctx.fill();
        ctx.fillStyle = k.rgba('green');
        ctx.beginPath(); k.rrect(sx + 10, sy + 8, (sw - 20) * 0.72, 7, 3); ctx.fill();
      }
      // blank: boş
    };

    const monitor = (cx, seed) => {
      const mw = 190, mh = 122;
      const x = cx - mw / 2, y = -186;
      blob(x, y, mw, mh, 10, k.rgba('ink'));   // çerçeve
      const sx = x + 9, sy = y + 9, sw = mw - 18, sh = mh - 18;
      ctx.fillStyle = k.rgba('bg', 0.9);
      ctx.beginPath(); k.rrect(sx, sy, sw, sh, 6); ctx.fill();
      content(sx, sy, sw, sh, seed);
      // güç LED'i
      ctx.fillStyle = k.rgba('green', 0.9);
      ctx.beginPath(); ctx.arc(cx + mw / 2 - 12, y + mh - 5, 2.5, 0, k.TAU); ctx.fill();
    };
    monitor(-102, 0);
    monitor(102, 2.1);
  },
};

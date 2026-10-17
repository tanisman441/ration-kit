// tech/laptop — dizüstü bilgisayar: ekran paramına göre mini içerik (kod/grafik/oyun/boş).
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; taban (0,0), her şey negatif y yönünde yukarı uzar.
export default {
  name: 'laptop', category: 'tech',
  desc: 'Dizüstü bilgisayar; ekranında kod, grafik, oyun veya boş içerik gösterilir',
  tags: ['laptop', 'dizüstü', 'bilgisayar', 'notebook', 'ekran', 'computer', 'notebook', 'screen'],
  box: [-110, -160, 110, 8],
  bleed: 6,
  anchor: 'taban (0,0); ekran yukarı uzar',
  points: { screen: [0, -96], keyboard: [0, -12] },
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
    ctx.beginPath(); ctx.ellipse(0, -4, 100, 9, 0, 0, k.TAU); ctx.fill();

    // taban (klavye kısmı): hafif yamuk
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(-100 - LW / 2, -4); ctx.lineTo(100 + LW / 2, -4);
    ctx.lineTo(88 + LW / 2, -22 - LW / 2); ctx.lineTo(-88 - LW / 2, -22 - LW / 2);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.moveTo(-100, -4); ctx.lineTo(100, -4);
    ctx.lineTo(88, -22); ctx.lineTo(-88, -22);
    ctx.closePath(); ctx.fill();
    // touchpad
    ctx.fillStyle = k.rgba('bg', 0.3);
    ctx.beginPath(); k.rrect(-24, -19, 48, 12, 4); ctx.fill();
    // klavye tuşları (touchpad'in iki yanında, iki sıra)
    ctx.fillStyle = k.rgba('bg', 0.35);
    for (let r = 0; r < 2; r++) {
      for (const x0 of [-80, 34]) {
        for (let c = 0; c < 3; c++) {
          ctx.beginPath(); k.rrect(x0 + c * 15, -21 + r * 6, 12, 4, 2); ctx.fill();
        }
      }
    }

    // menteşe + ekran
    blob(-8, -34, 16, 14, 5, body);
    blob(-85, -150, 170, 122, 10, k.rgba('ink'));   // çerçeve
    // ekran yüzeyi
    const sx = -76, sy = -141, sw = 152, sh = 104;
    ctx.fillStyle = k.rgba('bg', 0.9);
    ctx.beginPath(); k.rrect(sx, sy, sw, sh, 6); ctx.fill();

    // ekran içerikleri (vurgu: cyan)
    const acc = k.rgba('cyan');
    if (p.screen === 'code') {
      const cols = ['cyan', 'green', 'yellow', 'dim', 'cyan'];
      const ws = [86, 64, 104, 52, 76];
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = k.rgba(cols[i], i === 4 ? 0.7 : 0.85);
        ctx.beginPath(); k.rrect(sx + 12, sy + 12 + i * 17, ws[i], 9, 4); ctx.fill();
      }
      // yanıp sönen imleç
      if (Math.sin(t * 5) > 0) {
        ctx.fillStyle = acc;
        ctx.beginPath(); k.rrect(sx + 12 + 84, sy + 12 + 4 * 17, 8, 9, 3); ctx.fill();
      }
    } else if (p.screen === 'chart') {
      // eksenler
      ctx.strokeStyle = k.rgba('dim', 0.8); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(sx + 14, sy + 12); ctx.lineTo(sx + 14, sy + sh - 14); ctx.lineTo(sx + sw - 12, sy + sh - 14); ctx.stroke();
      // çubuklar (yavaşça yükselip alçalır)
      for (let i = 0; i < 6; i++) {
        const h = 18 + 44 * (0.5 + 0.5 * Math.sin(t * 1.4 + i * 1.1));
        ctx.fillStyle = k.rgba(i === 5 ? 'green' : 'cyan', 0.85);
        ctx.beginPath(); k.rrect(sx + 24 + i * 20, sy + sh - 14 - h, 13, h, 3); ctx.fill();
      }
    } else if (p.screen === 'game') {
      // mini oyun: hareketli hedef + can barı
      const tx = sx + 24 + ((t * 70) % (sw - 56)), ty = sy + sh / 2 + Math.sin(t * 3.2) * 14;
      k.glow(tx, ty, 24, 'red', 0.3);
      ctx.fillStyle = k.rgba('red');
      ctx.beginPath(); ctx.arc(tx, ty, 9, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('green');
      ctx.beginPath(); k.rrect(sx + 10, sy + 8, (sw - 20) * 0.72, 8, 4); ctx.fill();
      // skor noktaları
      ctx.fillStyle = k.rgba('yellow', 0.9);
      for (let i = 0; i < 3; i++) {
        ctx.beginPath(); ctx.arc(sx + 30 + i * 26 + ((t * 30) % 12), sy + sh - 22, 4, 0, k.TAU); ctx.fill();
      }
    }
    // blank: ekran boş kalır

    // kamera noktası
    ctx.fillStyle = k.rgba('dim', 0.8);
    ctx.beginPath(); ctx.arc(0, sy - 5, 2.5, 0, k.TAU); ctx.fill();
  },
};

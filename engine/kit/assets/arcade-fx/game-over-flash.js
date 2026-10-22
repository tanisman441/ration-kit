// arcade-fx/game-over-flash — arcade ekranında "GAME OVER" yazısı: at anında
// (1.2 sn) hızlı yanıp söner (kromatik sapmayla), sonra sabit yanar.
// Boşta ekran loştur, tarama çizgileri ve hafif titreme vardır.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) ekran merkezidir.
export default {
  name: 'game-over-flash', category: 'arcade-fx',
  desc: 'Olay anında yanıp sönen GAME OVER arcade ekranı',
  tags: ['game over', 'oyun bitti', 'ekran', 'yanıp sönme', 'arcade', 'game over', 'flash', 'screen', 'arcade', 'blink'],
  box: [-195, -125, 195, 125],
  bleed: 25,
  anchor: 'ekran merkezi (0,0)',
  points: { center: [0, 0], screen: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'GAME OVER flaş anı (1.2 sn yanıp sönme)' },
    color: { type: 'color', default: 'red', desc: 'yazı ve flaş rengi' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? 1e9 : t - p.at;
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    // çerçeve + ekran yüzeyi
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-188, -118, 376, 236, 18); ctx.fill();
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); k.rrect(-184, -114, 368, 228, 16); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.92);
    ctx.beginPath(); k.rrect(-168, -98, 336, 196, 10); ctx.fill();

    // tarama çizgileri
    ctx.fillStyle = k.rgba('ink', 0.06);
    for (let i = 0; i < 9; i++) ctx.fillRect(-168, -98 + i * 24, 336, 2);

    // === yazı durumu ===
    let alpha, flashing = false;
    if (d >= 0 && d < 1.2) {
      flashing = true;
      alpha = 0.35 + 0.65 * Math.abs(Math.sin(d * k.TAU / 0.24));
    } else if (d >= 1.2) {
      alpha = 0.9;                    // flaş bitti: sabit yanar
    } else {
      alpha = 0.22 + 0.05 * Math.sin(t * 9);   // boşta loş + hafif titreme
    }

    ctx.font = `700 54px 'JetBrains Mono', system-ui, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

    // ekran parlaması
    k.glow(0, 0, 150, acc, flashing ? 0.15 + alpha * 0.25 : 0.08);

    if (flashing) {
      // kromatik sapma: kırmızı/camgöbeği kopyalar
      const off = 5 * Math.abs(Math.sin(d * k.TAU / 0.24));
      ctx.globalAlpha = 0.5 * alpha;
      ctx.fillStyle = k.rgba('cyan');
      ctx.fillText('GAME OVER', -off, 0);
      ctx.fillStyle = k.rgba('red');
      ctx.fillText('GAME OVER', off, 0);
      ctx.globalAlpha = 1;
      // çerçeve flaşı
      ctx.strokeStyle = k.rgba(acc, alpha * 0.8); ctx.lineWidth = 6;
      ctx.beginPath(); k.rrect(-168, -98, 336, 196, 10); ctx.stroke();
    }
    ctx.fillStyle = k.rgba(acc, Math.min(1, alpha));
    ctx.fillText('GAME OVER', 0, 0);

    // alt mini gösterge: boşta nefes alır, flaşta hızlı yanıp söner
    const indOn = flashing ? Math.sin(d * k.TAU / 0.24) > 0 : Math.sin(t * k.TAU / 2.4) > 0;
    ctx.fillStyle = k.rgba(acc, indOn ? 0.9 : 0.2);
    ctx.beginPath(); ctx.arc(0, 66, 8, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};

// karaoke-fx/lyric-scroll — şarkı sözleri ekranı; satırlar speed hızıyla yukarı kayar,
// ortadaki satır vurgulanır. Döngüsel, canlı idle.
// Contract: engine/kit/ASSETS.md — NOT: canvas y-aşağıdır; (0,0) ekran merkezidir.
export default {
  name: 'lyric-scroll', category: 'karaoke-fx',
  desc: 'Şarkı sözleri ekranı; satırlar yukarı kayar, ortadaki satır vurgu rengiyle parlar',
  tags: ['şarkı sözleri', 'lyrics', 'karaoke', 'kayan yazı', 'ekran', 'şarkı', 'nakarat', 'scroll', 'screen', 'singing'],
  box: [-170, -112, 170, 112],
  bleed: 12,
  anchor: 'ekran merkezi (0,0)',
  points: { top: [0, -112], center: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'ekran çerçeve rengi' },
    accent: { type: 'color', default: 'accent', desc: 'aktif satırın vurgu rengi' },
    speed: { type: 'number', default: 0.5, desc: 'kayma hızı 0–1' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const inkC = k.rgba('ink', 0.9);
    const dimC = k.rgba('ink', 0.45);
    const sp = Math.max(0, Math.min(1, p.speed));
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // ekran çerçevesi
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-170 - LW / 2, -112 - LW / 2, 340 + LW, 224 + LW, 18); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-170, -112, 340, 224, 18); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(120, 60, 48, 50, 12); ctx.fill();
    // iç ekran (sayfa zemin rengi; metin her iki temada da okunur)
    ctx.fillStyle = k.rgba('bg');
    ctx.beginPath(); k.rrect(-152, -94, 304, 188, 12); ctx.fill();

    // kayan satırlar
    const lines = ['La la la la la', 'Hadi hep birlikte', 'Nakarat geliyor', 'Söyle, sesin çıksın'];
    const gap = 46;
    const cycle = lines.length * gap;
    const off = (t * (8 + sp * 42)) % cycle;
    ctx.save();
    ctx.beginPath(); k.rrect(-152, -94, 304, 188, 12); ctx.clip();
    ctx.font = `700 27px 'JetBrains Mono', system-ui, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let i = 0; i < lines.length + 1; i++) {
      const idx = i % lines.length;
      let y = -94 + ((i * gap - off) % cycle);
      if (y < -94) y += cycle;
      // ortadaki satır = aktif: vurgu arka planı + accent metin
      const distC = Math.abs(y);
      const active = distC < gap / 2;
      if (active) {
        const a = 0.28 + 0.08 * Math.sin(t * 3);
        ctx.fillStyle = k.rgba(p.accent, a);
        ctx.beginPath(); k.rrect(-140, y - 19, 280, 38, 9); ctx.fill();
        ctx.fillStyle = k.rgba(p.accent);
      } else {
        ctx.fillStyle = dimC;
      }
      ctx.fillText(lines[idx], 0, y);
    }
    ctx.restore();

    // alt köşe: küçük nota işareti (nabızla büyür)
    const nb = 1 + 0.12 * Math.sin(t * 3);
    ctx.save();
    ctx.translate(132, 76); ctx.scale(nb, nb);
    ctx.fillStyle = k.rgba(p.accent);
    ctx.beginPath(); ctx.ellipse(0, 0, 7, 5, -0.3, 0, k.TAU); ctx.fill();
    ctx.fillRect(5, -16, 3, 16);
    ctx.restore();

    // premium parlama: sol üst köşe (bilgi yüzeyine değil, çerçeveye)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); k.rrect(-162, -104, 26, 60, 8); ctx.fill();
    ctx.restore();
  },
};

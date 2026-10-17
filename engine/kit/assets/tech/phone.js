// tech/phone — akıllı telefon: ekran modları (sohbet/uygulama/arama/boş),
// notify anında üstten bildirim bandı düşer. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; anchor gövde merkezidir (0,0).
export default {
  name: 'phone', category: 'tech',
  desc: 'Akıllı telefon; ekranında sohbet, uygulama ızgarası, arama veya boş içerik; bildirim bandı düşer',
  tags: ['telefon', 'akıllı telefon', 'cep', 'mobil', 'bildirim', 'phone', 'smartphone', 'mobile', 'notification'],
  box: [-62, -112, 62, 112],
  bleed: 12,
  anchor: 'gövde merkezi (0,0)',
  points: { screen: [0, 0], top: [0, -104] },
  params: {
    color: { type: 'color', default: 'panel2' },
    screen: { type: 'enum', values: ['chat', 'app', 'call', 'blank'], default: 'chat', desc: 'ekran içeriği' },
    notify: { type: 'time', default: null, desc: 'bildirim anı: üstten band düşer, 1.4 sn kalır' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // gövde
    blob(-52, -102, 104, 204, 18, body);
    // ekran
    const sx = -43, sy = -88, sw = 86, sh = 172;
    ctx.fillStyle = k.rgba('bg', 0.9);
    ctx.beginPath(); k.rrect(sx, sy, sw, sh, 10); ctx.fill();

    // ekran içerikleri
    if (p.screen === 'chat') {
      // sohbet balonları (sola/sağa)
      const bubbles = [
        [-37, -64, 44, 'panel'], [ -37, -40, 58, 'panel'],
        [7, -12, 44, 'cyan'], [-37, 14, 50, 'panel'], [13, 40, 38, 'cyan'],
      ];
      for (const [bx, by, bw, bc] of bubbles) {
        ctx.fillStyle = k.rgba(bc, bc === 'cyan' ? 0.85 : 0.9);
        ctx.beginPath(); k.rrect(bx, by, bw, 18, 8); ctx.fill();
      }
      // yazı göstergesi (üç nokta, hafif zıplar)
      for (let i = 0; i < 3; i++) {
        const dy = Math.abs(Math.sin(t * 4 + i * 0.8)) * -3;
        ctx.fillStyle = k.rgba('dim', 0.9);
        ctx.beginPath(); ctx.arc(-28 + i * 12, 68 + dy, 3.5, 0, k.TAU); ctx.fill();
      }
    } else if (p.screen === 'app') {
      // uygulama ızgarası: 3x4 ikon
      const cols = ['cyan', 'green', 'yellow', 'purple'];
      let n = 0;
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 3; c++) {
          ctx.fillStyle = k.rgba(cols[(n + r) % 4], 0.85);
          ctx.beginPath(); k.rrect(sx + 10 + c * 25, sy + 12 + r * 26, 19, 19, 6); ctx.fill();
          n++;
        }
      }
      // alt dock
      ctx.fillStyle = k.rgba('panel', 0.9);
      ctx.beginPath(); k.rrect(sx + 6, sy + sh - 30, sw - 12, 24, 8); ctx.fill();
    } else if (p.screen === 'call') {
      // arayan: avatar + kabul/red butonları
      ctx.fillStyle = k.rgba('panel');
      ctx.beginPath(); ctx.arc(0, -38, 30, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('dim');
      ctx.beginPath(); ctx.arc(0, -46, 12, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(0, -18, 20, Math.PI, 0); ctx.fill();
      // isim çubuğu
      ctx.fillStyle = k.rgba('dim', 0.7);
      ctx.beginPath(); k.rrect(-26, 2, 52, 8, 4); ctx.fill();
      // butonlar (nabız gibi hafif büyür)
      const pulse = 1 + Math.sin(t * 5) * 0.06;
      ctx.fillStyle = k.rgba('red');
      ctx.beginPath(); ctx.arc(-22, 44, 15 * pulse, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('green');
      ctx.beginPath(); ctx.arc(22, 44, 15 * pulse, 0, k.TAU); ctx.fill();
    }
    // blank: ekran boş kalır

    // bildirim bandı: notify anında üstten kayarak düşer
    const d = p.notify == null ? -1 : t - p.notify;
    if (d >= 0 && d < 1.6) {
      const inA = k.prog(d, 0, 0.25), outA = k.prog(d, 1.2, 1.6);
      const slide = (1 - inA) * -30 + outA * -30;   // bant kutu üst sınırını (-112) aşmaz
      const by = sy + 8 + slide;
      ctx.fillStyle = k.rgba('panel', 0.97);
      ctx.beginPath(); k.rrect(sx + 5, by, sw - 10, 38, 10); ctx.fill();
      ctx.fillStyle = k.rgba('cyan', 0.9);
      ctx.beginPath(); ctx.arc(sx + 19, by + 19, 9, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('dim', 0.9);
      ctx.beginPath(); k.rrect(sx + 34, by + 8, 34, 7, 3); ctx.fill();
      ctx.beginPath(); k.rrect(sx + 34, by + 20, 26, 6, 3); ctx.fill();
    }

    // ön kamera + home çizgisi
    ctx.fillStyle = k.rgba('dim', 0.8);
    ctx.beginPath(); ctx.arc(0, -95, 2.5, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('dim', 0.6); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-16, 94); ctx.lineTo(16, 94); ctx.stroke();
  },
};

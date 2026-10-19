// ui-animated/toast — bildirim kartı (toast); `at` anında yukarıdan kayarak
// girer, `hold` sn kalır, sonra aşağı kayarak kaybolur.
// Contract: engine/kit/ASSETS.md — premium finish: bilgi taşıyan kart yüzeyine
// parlama uygulanmaz (sadece ikon karesine).
export default {
  name: 'toast',
  category: 'ui-animated',
  desc: 'Bildirim toast kartı; yukarıdan kayarak girer, bir süre durur, aşağı kayarak kaybolur',
  tags: ['toast', 'bildirim', 'kart', 'mesaj', 'uyarı', 'popup', 'notification', 'alert', 'toast message', 'bildirim kartı'],
  box: [-230, -200, 230, 100],
  bleed: 10,
  anchor: 'kart merkezi (0,0)',
  points: { icon: [-168, 0], card: [0, 0] },
  params: {
    color: { type: 'color', default: 'panel' },
    title: { type: 'text', default: 'Kopyalandı' },
    text: { type: 'text', default: 'Bağlantı kopyalandı.' },
    at: { type: 'time', default: null, desc: 'giriş anı: yukarıdan kayarak gelir' },
    hold: { type: 'number', default: 2.0, desc: 'ekranda kalma süresi (sn); sonra aşağı kayarak kaybolur' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const W = 420, H = 112, R = 22;
    const IN = 0.5, OUT = 0.4;
    const d = p.at == null ? 999 : t - p.at; // null ise sabit dinlenir hâlde
    if (d < 0) return;
    const outStart = IN + p.hold;
    if (d >= outStart + OUT) return;

    // giriş: yukarıdan kayma; çıkış: aşağı kayma + sönme
    let yOff, alpha;
    if (d < IN) {
      const e = k.E.outCubic(k.clamp(d / IN, 0, 1));
      yOff = (1 - e) * -180; alpha = k.clamp(d / 0.22, 0, 1);
    } else if (d < outStart) {
      yOff = 0; alpha = 1;
    } else {
      const e = k.E.inCubic(k.clamp((d - outStart) / OUT, 0, 1));
      yOff = e * 170; alpha = 1 - e;
    }
    const line = k.rgba('bg', 0.55), inkC = k.rgba('ink'), dimC = k.rgba('dim');
    const cardC = k.rgba(p.color);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const fit = (s, maxW, size) => {
      ctx.font = `700 ${size}px 'JetBrains Mono', monospace`;
      let out = String(s ?? '');
      while (out.length > 1 && ctx.measureText(out).width > maxW) out = out.slice(0, -1);
      if (out !== String(s ?? '')) out = out.slice(0, -1) + '…';
      return out;
    };

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(0, yOff);

    // zemin gölgesi (sağ alt, tek ton)
    ctx.fillStyle = k.rgba('bg', 0.3);
    ctx.beginPath(); k.rrect(-W / 2, -H / 2 + 12, W, H, R); ctx.fill();
    // kart gövde + dış hat
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-W / 2 - LW / 2, -H / 2 - LW / 2, W + LW, H + LW, R + LW / 2); ctx.fill();
    ctx.fillStyle = cardC;
    ctx.beginPath(); k.rrect(-W / 2, -H / 2, W, H, R); ctx.fill();

    // ikon: vurgu rengi kare + beyaz onay işareti (bilgi yüzeyi değil → parlama serbest)
    const ix = -W / 2 + 22, iy = -30, is = 60;
    ctx.fillStyle = k.rgba('accent');
    ctx.beginPath(); k.rrect(ix, iy, is, is, 16); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.16)';
    ctx.beginPath(); k.rrect(ix + 8, iy + 6, is - 16, 14, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.95)';
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(ix + 15, iy + 31); ctx.lineTo(ix + 27, iy + 43); ctx.lineTo(ix + 46, iy + 18);
    ctx.stroke();

    // metinler
    const tx = ix + is + 20;
    const maxW = (W / 2 - 24) - tx;
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = inkC;
    ctx.font = `700 30px 'JetBrains Mono', monospace`;
    ctx.fillText(fit(p.title, maxW, 30), tx, -6);
    ctx.fillStyle = dimC;
    ctx.font = `700 24px 'JetBrains Mono', monospace`;
    ctx.fillText(fit(p.text, maxW, 24), tx, 30);

    ctx.restore();
  },
};

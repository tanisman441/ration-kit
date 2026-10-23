// retail-fx/queue-snake — yılan gibi kıvrımlı müşteri kuyruğu; figürler yol boyunca ilerler, hafif salınır.
// NOT: canvas y-aşağıdır. Idle: ~2.4 sn salınım + 14 sn'de tam tur ilerleme döngüsü (sürekli animasyon, time paramı yok).
export default {
  name: 'queue-snake', category: 'retail-fx',
  desc: 'Yılan gibi kıvrımlı müşteri kuyruğu; renkli figürler yol boyunca ilerleyip salınır',
  tags: ['kuyruk', 'müşteri', 'sıra', 'kasa', 'mağaza', 'kalabalık', 'queue', 'line', 'customers', 'checkout', 'store', 'crowd'],
  box: [-180, -120, 180, 120],
  bleed: 40,
  anchor: 'kuyruk alanının merkezi (0,0); ön uç sağ altta',
  points: { front: [140, 70], tail: [-140, -70] },
  params: {
    color: { type: 'color', default: 'accent' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round';

    // ---- yılan yolu: A (üst, soldan sağa) → dönüş → B (orta, sağdan sola) → dönüş → C (alt, soldan sağa) ----
    const ST = 280, TN = 110, L = ST * 3 + TN * 2; // 1060
    const posAt = s => {
      const dist = ((s % 1) + 1) % 1 * L;
      if (dist < ST) return [-140 + dist, -70];                                    // A
      if (dist < ST + TN) {                                                        // sağ dönüş
        const a = -Math.PI / 2 + ((dist - ST) / TN) * Math.PI;
        return [140 + 35 * Math.cos(a), -35 + 35 * Math.sin(a)];
      }
      if (dist < ST + TN + ST) return [140 - (dist - ST - TN), 0];                  // B
      if (dist < ST + TN + ST + TN) {                                              // sol dönüş
        const a = -Math.PI / 2 + ((dist - ST - TN - ST) / TN) * Math.PI;
        return [-140 + 35 * Math.cos(a), 35 + 35 * Math.sin(a)];
      }
      return [-140 + (dist - ST - TN - ST - TN), 70];                              // C
    };

    // yol kılavuzu (kesik çizgi)
    ctx.strokeStyle = k.rgba('ink', 0.25); ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const [x, y] = posAt(i / 100);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // ---- müşteriler ----
    const cols = ['accent', 'cyan', 'green', 'yellow', 'purple', 'dim'];
    const N = 6;
    for (let i = 0; i < N; i++) {
      const s = i / N + t / 14; // 14 sn'de tam tur
      const [x, y] = posAt(s);
      const ph = i * 1.3;
      const bob = 2 * Math.sin(t * k.TAU / 2.4 + ph);
      const tilt = 0.07 * Math.sin(t * k.TAU / 2.4 + ph + 0.8);
      const col = cols[i % cols.length];
      ctx.save();
      ctx.translate(x, y + bob); ctx.rotate(tilt);
      // gölge
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.beginPath(); ctx.ellipse(3, 13, 13, 5, 0, 0, k.TAU); ctx.fill();
      // gövde
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(-12, -18, 24, 30, 7); ctx.fill();
      ctx.fillStyle = k.rgba(col);
      ctx.beginPath(); k.rrect(-8, -14, 16, 22, 5); ctx.fill();
      // sol üst parlama
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-3, -8, 5, 3, -0.3, 0, k.TAU); ctx.fill();
      // baş
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.arc(0, -27, 11, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(col);
      ctx.beginPath(); ctx.arc(0, -27, 7.5, 0, k.TAU); ctx.fill();
      // yüz: iki nokta göz
      ctx.fillStyle = k.rgba('bg', 0.8);
      ctx.beginPath(); ctx.arc(-3, -28, 1.6, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(3, -28, 1.6, 0, k.TAU); ctx.fill();
      ctx.restore();
    }

    // ---- ön uç: kasa tabelası ----
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(116, 2, 58, 26, 8); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(120, 6, 50, 18, 6); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.9);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '800 14px system-ui, sans-serif';
    ctx.fillText('KASA', 145, 16);
    ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(145, 28); ctx.lineTo(145, 52); ctx.stroke();
  },
};

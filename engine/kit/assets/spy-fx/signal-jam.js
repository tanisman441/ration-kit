// spy-fx/signal-jam — sinyal dalgaları: `at` anında dalgalar bozuluyor
// (glitch titremesi), sonra temiz sinyal geri dönüyor; boştayken dalgalar yayılıyor.
// NOT: canvas y-aşağıdır; (0,0) verici direğin tabanıdır.
export default {
  name: 'signal-jam',
  category: 'spy-fx',
  desc: 'Vericiden yayılan sinyal dalgaları: karıştırma anında glitch ile bozulup temizleniyor',
  tags: ['sinyal', 'dalga', 'karıştırma', 'glitch', 'verici', 'ajan', 'signal', 'wave', 'jam', 'glitch', 'spy', 'transmitter'],
  box: [-150, -190, 150, 110],
  bleed: 60,
  anchor: 'verici direk tabanı (0,0)',
  points: { source: [-112, -46], wave_edge: [72, -54], dish: [-112, -96] },
  params: {
    at: { type: 'time', default: null, desc: 'karıştırma anı: 0.45 sn glitch, sonra temiz sinyal döner' },
    color: { type: 'color', default: 'cyan', desc: 'sinyal dalga rengi' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const glitching = d >= 0 && d < 0.45;
    const recovering = d >= 0.45 && d < 1.1;
    const SX = -112, SY = -46; // verici başı
    ctx.save();

    // verici direği
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(SX - 9, SY, 18, 96, 8); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4.5; ctx.stroke();
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(SX - 4, SY + 30, 5, 26, 0.1, 0, k.TAU); ctx.fill();
    // çanak anten
    ctx.save(); ctx.translate(SX, SY - 8);
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); ctx.arc(0, 0, 26, -Math.PI * 0.42, Math.PI * 0.42); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, 0, 26, -Math.PI * 0.42, Math.PI * 0.42); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(20, 0); ctx.stroke();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); ctx.arc(20, 0, 5, 0, k.TAU); ctx.fill();
    ctx.restore();

    // sinyal kaynağı nabzı (idle)
    const srcPulse = 0.5 + 0.5 * Math.sin(t * 3.4);
    k.glow(SX + 20, SY - 8, 20 + srcPulse * 10, glitching ? 'red' : p.color, glitching ? 0.5 : 0.3);

    // dalgalar: vericiden sağa yayılan 5 yay
    const WAVES = 5;
    for (let i = 0; i < WAVES; i++) {
      const r = 44 + i * 30;
      const phase = (t * 1.6 - i * 0.55) % 1;
      const alpha = Math.sin(k.clamp(phase, 0, 1) * Math.PI);
      if (alpha <= 0.02) continue;
      const a0 = -Math.PI * 0.38, a1 = Math.PI * 0.38; // sağa bakan yaylar
      const cx = SX + 20;

      if (glitching) {
        // glitch: yay parçalara bölünüyor, yatay kaymalar + kırmızı
        const jit = k.noise1(t * 40 + i * 7) * 14;
        for (let s = 0; s < 4; s++) {
          const sa0 = a0 + (a1 - a0) * (s / 4), sa1 = a0 + (a1 - a0) * ((s + 0.72) / 4);
          const off = k.noise1(t * 30 + i * 13 + s * 5) * 18;
          ctx.strokeStyle = k.rgba(s % 2 ? 'red' : p.color, 0.75 * alpha);
          ctx.lineWidth = 4;
          ctx.beginPath(); ctx.arc(cx + off, SY - 8 + jit * 0.4, r, sa0, sa1); ctx.stroke();
        }
        // glitch kıvılcımları
        for (let s = 0; s < 3; s++) {
          const h = k.hash(i * 11 + s * 29 + 1);
          const gx = cx + r * Math.cos((h - 0.5) * 1.2) + (h - 0.5) * 30;
          const gy = SY - 8 + r * Math.sin((h - 0.5) * 1.2);
          ctx.fillStyle = k.rgba('red', 0.8 * alpha);
          ctx.fillRect(gx - 2, gy - 1, 4 + h * 8, 2.5);
        }
      } else if (recovering) {
        // toparlanma: temiz dalga geri gelirken ince yeşil süpürme halkası
        ctx.strokeStyle = k.rgba(p.color, 0.75 * alpha);
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(cx, SY - 8, r, a0, a1); ctx.stroke();
        const rp = k.prog(d, 0.45, 1.05);
        ctx.strokeStyle = k.rgba('green', 0.5 * (1 - rp));
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(cx, SY - 8, r * rp + 20, a0, a1); ctx.stroke();
      } else {
        // temiz sinyal
        ctx.strokeStyle = k.rgba(p.color, 0.75 * alpha);
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(cx, SY - 8, r, a0, a1); ctx.stroke();
        ctx.strokeStyle = k.rgba('bg', 0.4 * alpha);
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(cx, SY - 8, r, a0, a1); ctx.stroke();
      }
    }

    // karıştırma göstergesi: glitch sırasında vericide kırmızı uyarı
    if (glitching) {
      ctx.fillStyle = k.rgba('red', 0.5 + 0.5 * k.noise1(t * 50));
      ctx.beginPath(); ctx.arc(SX, SY - 52, 8, 0, k.TAU); ctx.fill();
      k.glow(SX, SY - 52, 30, 'red', 0.5);
    }
    ctx.restore();
  },
};

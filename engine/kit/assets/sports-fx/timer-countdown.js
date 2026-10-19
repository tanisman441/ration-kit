// sports-fx/timer-countdown — maç saati: geri sayan dijital panel; sıfırda flaş patlar.
// NOT: canvas y-aşağıdır. `at` verilirse sıfır anı t=`at` olur; verilmezse sayaç döngüsel çalışır.
export default {
  name: 'timer-countdown',
  category: 'sports-fx',
  desc: 'Maç saati: geri sayan dijital panel, sıfıra ulaşınca flaş patlaması',
  tags: ['sayaç', 'zaman', 'maç saati', 'geri sayım', 'timer', 'countdown', 'clock', 'süre', 'time'],
  box: [-190, -110, 190, 110],
  bleed: 60,
  anchor: 'panel merkezi (0,0)',
  points: { face: [0, 0] },
  params: {
    color: { type: 'color', default: 'ink' },
    start: { type: 'number', default: 10, desc: 'geri sayım başlangıç saniyesi' },
    at: { type: 'time', default: null, desc: 'sıfır anı: flaş patlaması' },
  },
  draw(ctx, t, p, k) {
    const S = Math.max(2, Math.round(p.start));
    // zamanı `at`'e göre kaydır: tt=S anında sayaç sıfır olur
    const tt = p.at == null ? t : t - (p.at - S);
    const cyc = ((tt % (S + 1.2)) + (S + 1.2)) % (S + 1.2);
    const rem = cyc < S ? S - cyc : 0;              // kalan saniye
    const zeroD = cyc < S ? -1 : cyc - S;           // sıfırdaki geçen süre (0–1.2)
    const flash = zeroD >= 0 ? 1 - zeroD / 1.0 : 0;
    const line = k.rgba('bg', 0.55), inkC = k.rgba('ink');
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.lineCap = 'round';

    // panel: dış hat + gövde + sol üst parlama (ekran bilgi yüzeyi: parlamasız şerit değil, köşe parlaması)
    const PW = 300, PH = 140;
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-PW / 2 - 4, -PH / 2 - 4, PW + 8, PH + 8, 30); ctx.fill();
    ctx.fillStyle = k.rgba('panel');
    ctx.beginPath(); k.rrect(-PW / 2, -PH / 2, PW, PH, 26); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); k.rrect(-PW / 2 + 18, -PH / 2 + 12, PW - 36, 20, 10); ctx.fill();
    // alt gölge
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(-PW / 2 + 18, PH / 2 - 30, PW - 36, 18, 9); ctx.fill();

    // rakamlar: SS biçimi; iki nokta her saniye yanıp söner (idle)
    const secs = Math.ceil(rem);
    const label = `00:${String(secs).padStart(2, '0')}`;
    const blink = (Math.floor(rem * 2) % 2 === 0) || rem === 0;
    const shown = blink ? label : label.replace(':', ' ');
    const big = flash > 0 ? 1 + 0.25 * flash : 1;   // sıfırda büyüme
    ctx.save();
    ctx.scale(big, big);
    ctx.font = "900 72px 'JetBrains Mono', monospace";
    ctx.fillStyle = rem === 0 ? k.rgba('red') : k.rgba(p.color);
    ctx.fillText(shown, 0, 6);
    ctx.restore();

    // sıfır flaşı: parlama + genişleyen halka + yıldızlar
    if (flash > 0) {
      k.glow(0, 0, 150 * flash, 'yellow', 0.5 * flash);
      const rr = 90 + 150 * k.E.outExpo(k.clamp(zeroD / 0.8, 0, 1));
      ctx.strokeStyle = k.rgba('red', 0.8 * flash);
      ctx.lineWidth = 12;
      ctx.beginPath(); ctx.arc(0, 0, Math.min(rr, 156), 0, k.TAU); ctx.stroke();
      for (let i = 0; i < 8; i++) {
        const h = k.hash(i * 11 + 7);
        const a = (i / 8) * k.TAU + 0.4;
        const r1 = Math.min(100 + zeroD * 260 * (0.7 + h * 0.6), 156);
        ctx.fillStyle = k.rgba('yellow', 0.8 * flash * (1 - zeroD));
        ctx.beginPath(); ctx.arc(Math.cos(a) * r1, Math.sin(a) * r1, 4 + h * 4, 0, k.TAU); ctx.fill();
      }
    }
  },
};

// space-action/oxygen-alert — duvara monte oksijen durum paneli: `at` anında kırmızı
// alarm lambası yanıp sönmeye başlar (1.5 sn), O2 molekül simgesi nabız gibi atar.
// NOT: canvas y-aşağıdır; (0,0) panel merkezidir. Yukarı = negatif y.
export default {
  name: 'oxygen-alert',
  category: 'space-action',
  desc: 'Oksijen durum paneli; anı gelince kırmızı alarm yanıp söner, O2 simgesi nabız atar',
  tags: ['oksijen', 'alarm', 'panel', 'uyarı', 'kırmızı ışık', 'molekül', 'oxygen', 'alert', 'alarm', 'warning', 'panel', 'gauge'],
  box: [-130, -130, 130, 110],
  bleed: 60,
  anchor: 'panel merkezi (0,0)',
  points: { light: [0, -92], gauge: [0, 10], panel: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'panel gövde rengi' },
    at: { type: 'time', default: null, desc: 'alarm anı: 1.5 sn kırmızı yanıp sönme + O2 nabzı' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const OUT = 6;
    ctx.save();

    const alarming = d >= 0 && d < 1.5;
    const blink = alarming ? (Math.sin(d * 31) > 0 ? 1 : 0.15) : 0; // ~5 Hz yanıp sönme

    // --- alarm şok halkaları ---
    if (alarming) {
      for (let i = 0; i < 3; i++) {
        const rp = ((d * 1.6 + i * 0.33) % 1);
        ctx.strokeStyle = k.rgba('red', 0.5 * (1 - rp));
        ctx.lineWidth = 5 * (1 - rp) + 2;
        ctx.beginPath(); ctx.arc(0, 0, 60 + rp * 130, 0, k.TAU); ctx.stroke();
      }
    }

    // --- panel gövdesi ---
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = OUT;
    k.rrect(-95, -70, 190, 150, 20); ctx.fill(); ctx.stroke();
    // iç çerçeve
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    k.rrect(-82, -57, 164, 124, 14); ctx.stroke();

    // --- alarm lambası (üstte kubbe) ---
    const domeA = alarming ? 0.25 + 0.75 * blink : 0.25;
    ctx.fillStyle = k.rgba('red', domeA);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(0, -92, 20, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    k.rrect(-26, -94, 52, 8, 4); ctx.fill(); ctx.stroke();
    if (alarming) k.glow(0, -92, 55 * blink + 10, k.col('red'), 0.5 * blink);

    // --- O2 molekül simgesi (nabız: idle'da nefes, alarmda güçlü vuruş) ---
    const idlePulse = 1 + 0.03 * Math.sin(t * 2.6);
    const alarmPulse = alarming ? 1 + 0.12 * Math.max(0, Math.sin(d * 31)) : 1;
    const beat = idlePulse * alarmPulse;
    ctx.save();
    ctx.translate(0, -14);
    ctx.scale(beat, beat);
    // iki oksijen atomu
    for (const s of [-1, 1]) {
      ctx.fillStyle = k.rgba(alarming ? 'red' : 'cyan', 1);
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(s * 20, 0, 17, 0, k.TAU); ctx.fill(); ctx.stroke();
      // atom parlama
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); ctx.ellipse(s * 20 - 6, -6, 7, 5, -0.4, 0, k.TAU); ctx.fill();
    }
    // bağ (çift çizgi)
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-9, -5); ctx.lineTo(9, -5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-9, 5); ctx.lineTo(9, 5); ctx.stroke();
    ctx.restore();
    // O2 etiketi
    ctx.fillStyle = k.rgba('ink', 0.8);
    ctx.font = '700 26px system-ui, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText('O2', 0, 16);

    // --- seviye göstergesi (yay) ---
    const lvl = 0.78;
    ctx.lineWidth = 10; ctx.lineCap = 'round';
    ctx.strokeStyle = k.rgba('ink', 0.25);
    ctx.beginPath(); ctx.arc(0, 10, 46, 0.6, Math.PI - 0.6); ctx.stroke();
    ctx.strokeStyle = k.rgba(alarming ? 'red' : 'green', 0.95);
    ctx.beginPath(); ctx.arc(0, 10, 46, 0.6, 0.6 + (Math.PI - 1.2) * lvl); ctx.stroke();
    // iğne (idle'da hafif titrer, alarmda sallanır)
    const needle = alarming ? 0.5 * Math.sin(d * 31) : 0.06 * k.noise1(t * 3);
    const na = Math.PI - 0.6 - (Math.PI - 1.2) * (lvl + 0.06 * needle);
    ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(Math.cos(na) * 40, 10 + Math.sin(na) * 40);
    ctx.stroke();
    ctx.fillStyle = k.rgba('ink', 0.9);
    ctx.beginPath(); ctx.arc(0, 10, 6, 0, k.TAU); ctx.fill();

    // --- alt LED şeridi (idle akan ışık) ---
    for (let i = 0; i < 5; i++) {
      const x = -56 + i * 28;
      const on = k.hash(Math.floor(t * 3) + i * 17) > 0.4;
      ctx.fillStyle = k.rgba(alarming ? 'red' : 'green', on ? 0.95 : 0.2);
      ctx.beginPath(); ctx.arc(x, 62, 5, 0, k.TAU); ctx.fill();
    }

    // premium finish: sol üst parlama + sağ alt gölge
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(-60, -48, 40, 16, -0.4, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(58, 56, 38, 15, -0.4, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};

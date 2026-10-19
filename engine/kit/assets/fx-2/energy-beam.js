// fx-2/energy-beam — enerji ışını: idle'da nabız atan, titreyen ışın + merkezden uca akan
// enerji paketleri; at anında güç patlaması (genişleme + beyaz flaş + dikey kıvılcımlar).
// orientation ile dikey/yatay çizilir (yatay = 90° döndürülmüş aynı çizim).
// NOT: canvas y-aşağıdır; (0,0) ışın çekirdeği (ortadaki düğüm).
export default {
  name: 'energy-beam', category: 'fx-2',
  desc: 'Enerji ışını: nabızla titreyen ışın, at anında güç patlaması ve kıvılcım yağmuru',
  tags: ['enerji', 'ışın', 'beam', 'lazer', 'laser', 'güç', 'power', 'elektrik', 'şarj', 'charge'],
  box: [-195, -195, 195, 195],
  bleed: 25,
  anchor: 'merkez (0,0) — ışın çekirdeği (düğüm noktası)',
  points: { top: [0, -160], bottom: [0, 160], left: [-160, 0], right: [160, 0] },
  params: {
    color: { type: 'color', default: 'yellow', desc: 'enerji rengi' },
    orientation: { type: 'enum', values: ['vertical', 'horizontal'], default: 'vertical', desc: 'ışın yönü' },
    intensity: { type: 'number', default: 0.7, desc: 'ışın yoğunluğu (0–1)' },
    at: { type: 'time', default: null, desc: 'güç patlaması anı (flare + kıvılcımlar)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round';
    if (p.orientation === 'horizontal') ctx.rotate(Math.PI / 2);
    const inten = k.clamp(p.intensity ?? 0.7, 0, 1);
    const d = p.at == null ? -1 : t - p.at;

    // patlama büyütmesi (0 → 0.6 sn'de kabarıp iner)
    let flare = 1;
    if (d >= 0 && d < 0.6) flare = 1 + 1.25 * Math.sin(Math.min(d / 0.6, 1) * Math.PI);

    // ---- ışın nabzı: genişlik + alfa titremesi ----
    const pulse = Math.sin(t * 7.3), flick = k.noise1(t * 9.1);
    const w = (14 + 22 * inten) * (1 + 0.16 * pulse + 0.08 * flick) * flare;
    const al = (0.42 + 0.3 * inten) * (1 + 0.18 * pulse);

    // dış parlama
    k.glow(0, 0, 120, p.color, Math.min(0.3 * al * flare, 0.5));
    // orta katman
    ctx.fillStyle = k.rgba(p.color, Math.min(al, 0.95));
    ctx.beginPath(); ctx.ellipse(0, 0, w, 162, 0, 0, k.TAU); ctx.fill();
    // beyaz çekirdek
    const coreA = 0.55 * Math.min(al + 0.25, 1) * Math.min(0.6 + 0.4 * flare, 1);
    ctx.fillStyle = 'rgba(255,255,255,' + coreA.toFixed(3) + ')';
    ctx.beginPath(); ctx.ellipse(0, 0, w * 0.38, 158, 0, 0, k.TAU); ctx.fill();

    // ---- enerji paketleri: merkezden uçlara akan parlak düğümler ----
    for (let i = 0; i < 3; i++) {
      const h1 = k.hash(i * 53 + 701);
      const cyc = (t * (0.55 + h1 * 0.35) + h1) % 1;
      const yy = -158 + cyc * 316;
      const pr = (4 + h1 * 5) * flare;
      ctx.fillStyle = 'rgba(255,255,255,' + (0.9 * (1 - Math.abs(cyc - 0.5))).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(0, yy, pr, 0, k.TAU); ctx.fill();
      k.glow(0, yy, pr * 4, p.color, 0.4);
    }

    // ---- merkez düğüm (elmas) ----
    const dw = 20 * (1 + 0.12 * pulse) * flare;
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath();
    ctx.moveTo(0, -dw - 3); ctx.lineTo(dw + 3, 0); ctx.lineTo(0, dw + 3); ctx.lineTo(-dw - 3, 0);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 0.95);
    ctx.beginPath();
    ctx.moveTo(0, -dw); ctx.lineTo(dw, 0); ctx.lineTo(0, dw); ctx.lineTo(-dw, 0);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.beginPath();
    ctx.moveTo(0, -dw * 0.45); ctx.lineTo(dw * 0.45, 0); ctx.lineTo(0, dw * 0.45); ctx.lineTo(-dw * 0.45, 0);
    ctx.closePath(); ctx.fill();

    // uç kapakları
    for (const s of [-1, 1]) k.glow(0, s * 160, 30, p.color, 0.45 * al);

    // ---- at: güç patlaması — beyaz flaş + dik kıvılcımlar ----
    if (d >= 0 && d < 0.6) {
      const g = k.prog(d, 0, 0.6);
      if (d < 0.16) {
        const f = 1 - d / 0.16;
        ctx.fillStyle = 'rgba(255,255,255,' + (0.55 * f).toFixed(3) + ')';
        ctx.beginPath(); ctx.ellipse(0, 0, w * 1.6, 165, 0, 0, k.TAU); ctx.fill();
      }
      for (let i = 0; i < 18; i++) {
        const h1 = k.hash(i * 59 + 721), h2 = k.hash(i * 61 + 739);
        const side = h1 > 0.5 ? 1 : -1;
        const yy = -150 + h2 * 300;
        const dist = d * 260 * (0.7 + h2 * 0.6);
        const px = side * (w * 0.8 + dist);
        if (Math.abs(px) > 190) continue;
        const py = yy + k.noise1(i * 4 + d * 8) * 10;
        ctx.fillStyle = h2 > 0.5
          ? 'rgba(255,255,255,' + (0.85 * (1 - g)).toFixed(3) + ')'
          : k.rgba(p.color, 0.85 * (1 - g));
        ctx.beginPath(); ctx.arc(px, py, 2.5 + h2 * 4 * (1 - g), 0, k.TAU); ctx.fill();
      }
    }

    // premium parlama (sol üst uç)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-w * 0.32, -128, w * 0.28, 26, -0.15, 0, k.TAU); ctx.fill();
    ctx.restore();
  },
};

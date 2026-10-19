// magic-2/spell-cast — büyü fırlatma: cast anında 0.6 sn'de sağa uçan ışın mermisi,
// arkasında iz ve kıvılcımlar; hedefte çarpma patlaması.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) fırlatma noktasıdır, mermi +x yönüne uçar.
export default {
  name: 'spell-cast', category: 'magic-2',
  desc: 'Büyü fırlatma: cast anında fırlayan ışın mermisi, ışık izi ve hedefteki çarpma patlaması',
  tags: ['büyü', 'fırlatma', 'spell', 'cast', 'ışın', 'beam', 'mermi', 'sihir', 'saldırı'],
  box: [-70, -90, 190, 90],
  bleed: 60,
  anchor: 'fırlatma noktası (0,0) — ışın buradan sağa (+x) doğru uçar',
  points: { launch: [0, 0], impact: [170, 0] },
  params: {
    color: { type: 'color', default: 'cyan', desc: 'büyü enerjisinin rengi' },
    cast: { type: 'time', default: null, desc: 'fırlatma anı (0.6 sn uçuş + çarpma patlaması)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round';
    const d = p.cast == null ? -1 : t - p.cast;
    const col = p.color;
    if (d > 1.1) { ctx.restore(); return; }

    // ---- şarj (d < 0): nabız atan enerji küresi + içe süzülen parçacıklar ----
    if (d < 0) {
      const pulse = 0.5 + 0.5 * Math.sin(t * 6);
      k.glow(0, 0, 40 + 14 * pulse, col, 0.35 + 0.2 * pulse);
      ctx.fillStyle = k.rgba(col, 0.35 + 0.3 * pulse);
      ctx.beginPath(); ctx.arc(0, 0, 12 + 5 * pulse, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,' + (0.35 + 0.3 * pulse).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(-3, -3, 4.5 + 2 * pulse, 0, k.TAU); ctx.fill();
      for (let i = 0; i < 10; i++) {
        const h = k.hash(i * 5 + 1);
        const rr = 60 - ((t * 70 + h * 60) % 60);
        const a = h * k.TAU;
        ctx.fillStyle = k.rgba(col, Math.max(0.5 * (1 - rr / 70), 0));
        ctx.beginPath(); ctx.arc(Math.cos(a) * rr, Math.sin(a) * rr, 2.5, 0, k.TAU); ctx.fill();
      }
    }

    // ---- uçuş (0–0.6 sn): hızlanan kafa + solan ışık izi ----
    if (d >= 0 && d < 0.6) {
      const e = 1 - Math.pow(1 - d / 0.6, 3);
      const hx = e * 170;
      for (let i = 0; i < 12; i++) {
        const sx = hx - 14 * (i + 1);
        if (sx < -30) continue;
        const sa = 0.5 * (1 - i / 12) * (1 - (d / 0.6) * 0.5);
        ctx.fillStyle = k.rgba(col, Math.max(sa, 0));
        ctx.beginPath(); ctx.ellipse(sx, 0, 16 - i, 10 - i * 0.6, 0, 0, k.TAU); ctx.fill();
      }
      k.glow(hx, 0, 60, col, 0.5);
      ctx.fillStyle = k.rgba(col, 0.95);
      ctx.beginPath();
      ctx.moveTo(hx + 26, 0); ctx.lineTo(hx, -13); ctx.lineTo(hx - 18, 0); ctx.lineTo(hx, 13);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.beginPath(); ctx.arc(hx + 2, 0, 7, 0, k.TAU); ctx.fill();
      for (let i = 0; i < 12; i++) {
        const h1 = k.hash(i * 3 + 1), h2 = k.hash(i * 11 + 7);
        const px = hx - 10 - h1 * 80 * (d / 0.6 + 0.25);
        const py = (h2 - 0.5) * 70;
        ctx.fillStyle = k.rgba(col, Math.max(0.6 * (1 - h1 * 0.5) * (1 - d / 0.6), 0));
        ctx.beginPath(); ctx.arc(px, py, 2 + h2 * 3, 0, k.TAU); ctx.fill();
      }
    }

    // ---- çarpma (0.6–1.1 sn): genişleyen halka + kıvılcım yıldızları ----
    if (d >= 0.6 && d < 1.1) {
      const ig = (d - 0.6) / 0.5;
      k.glow(170, 0, 75 * (1 - ig * 0.5), col, 0.55 * (1 - ig));
      ctx.strokeStyle = k.rgba(col, 0.8 * (1 - ig));
      ctx.lineWidth = 8 * (1 - ig) + 2;
      ctx.beginPath(); ctx.arc(170, 0, 10 + 80 * ig, 0, k.TAU); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,' + (0.7 * (1 - ig)).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(170, 0, 12 * (1 - ig) + 3, 0, k.TAU); ctx.fill();
      for (let i = 0; i < 14; i++) {
        const a = k.hash(i * 3 + 2) * k.TAU;
        const dist = ig * (50 + k.hash(i * 7 + 3) * 50);
        ctx.fillStyle = k.rgba(col, Math.max(0.8 * (1 - ig), 0));
        ctx.beginPath();
        ctx.arc(170 + Math.cos(a) * dist, Math.sin(a) * dist * 0.8, 3 + k.hash(i * 5 + 4) * 4, 0, k.TAU);
        ctx.fill();
      }
    }
    ctx.restore();
  },
};

// fail-fx/down-arrow-fall — düşen ok: at anında yere saplanır, 0.2 sn sekme;
// idle'da hafif yukarı-aşağı salınım (k.noise1). Y-AŞAĞI canvas.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'down-arrow-fall',
  category: 'fail-fx',
  desc: 'Yere saplanmış, sekip salınan kırmızı düşüş oku',
  tags: ['düşüş', 'ok', 'batış', 'düşen', 'kriz', 'çöküş', 'fall', 'down', 'arrow', 'crash', 'decline', 'drop', 'fail'],
  box: [-85, -125, 85, 125],
  bleed: 40,
  anchor: 'ucun saplandığı yer (0,78)',
  points: { tip: [0, 78], top: [0, -72], center: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'saplanma anı: ok düşer, 0.2 sn sekme' },
    color: { type: 'color', default: 'red' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const tipY = 78;          // ucun saplandığı y
    const arrowLen = 150;      // ok boyu

    // okun dikey konumu: at öncesi yukarıdan düşer, at sonrası seker, idle salınır
    let yOff = 0, wobble = 0;
    if (d < 0) {
      const approach = k.clamp(1 + d / 0.8, 0, 1);   // son 0.8 sn yaklaşma (box içinde)
      yOff = -70 * (1 - approach * approach);
    } else if (d < 0.2) {
      const e = d / 0.2;
      yOff = -24 * Math.sin(e * Math.PI) * (1 - e * 0.5); // 0.2 sn sekme
      wobble = 0.05 * Math.sin(e * Math.PI * 2) * (1 - e);
    } else {
      yOff = k.noise1(t * 1.3) * 3;                    // idle: hafif salınım
      wobble = k.noise1(t * 1.1 + 4) * 0.02;
    }

    // --- zemin: alçak tümsek ---
    ctx.fillStyle = k.rgba('bg', 0.5);
    ctx.beginPath(); ctx.ellipse(6, 98, 78, 16, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); ctx.ellipse(0, 92, 78, 16, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-30, 86, 34, 6, -0.15, 0, k.TAU); ctx.fill();

    ctx.save();
    ctx.translate(0, yOff);
    ctx.rotate(wobble);
    const topY = tipY - arrowLen; // -72

    // saplanma çatlağı (sadece at sonrası)
    if (d >= 0) {
      const crack = k.prog(d, 0, 0.25);
      ctx.strokeStyle = k.rgba('ink', 0.7);
      ctx.lineCap = 'round';
      for (let i = 0; i < 4; i++) {
        const side = i % 2 === 0 ? -1 : 1;
        const cx = side * (10 + k.hash(20 + i) * 34);
        const reach = k.E.outCubic(crack) * (18 + k.hash(30 + i) * 22);
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(side * 8, tipY + 2);
        ctx.lineTo(cx, tipY + 2 + reach);
        ctx.stroke();
      }
    }

    // --- ok gövdesi: üstte ince şaft, altta geniş ok başı ---
    const shaftTop = topY + 8, headBase = tipY - 42;
    // sağ alt gölge
    ctx.fillStyle = k.rgba('bg', 0.5);
    ctx.beginPath(); k.rrect(-13 + 5, shaftTop + 5, 26, headBase - shaftTop, 10); ctx.fill();
    // şaft
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-13, shaftTop, 26, headBase - shaftTop, 10); ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-13, shaftTop, 26, headBase - shaftTop, 10); ctx.stroke();
    // ok başı (aşağı bakan geniş üçgen)
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath();
    ctx.moveTo(-32 + 5, headBase + 5); ctx.lineTo(32 + 5, headBase + 5); ctx.lineTo(0 + 5, tipY + 8 + 5);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath();
    ctx.moveTo(-32, headBase); ctx.lineTo(32, headBase); ctx.lineTo(0, tipY + 8);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    ctx.stroke();
    // sol üst parlama (şaft üstünde, ince)
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-7, shaftTop + 34, 5, 26, 0, 0, k.TAU); ctx.fill();
    // kuyruk tüyleri (üstte iki yan kanat)
    ctx.fillStyle = k.rgba('ink', 0.75);
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(side * 13, topY + 8);
      ctx.lineTo(side * 34, topY - 14);
      ctx.lineTo(side * 34, topY + 22);
      ctx.closePath(); ctx.fill();
    }

    ctx.restore();

    // --- toz bulutu: 0.5 sn yükselip söner ---
    if (d >= 0 && d < 0.6) {
      for (let i = 0; i < 5; i++) {
        const ang = Math.PI + (k.hash(60 + i) - 0.5) * 1.6; // yukarı-yana
        const dist = k.E.outCubic(k.prog(d, 0, 0.55)) * (26 + k.hash(70 + i) * 26);
        const alpha = 0.6 * (1 - k.prog(d, 0.15, 0.6));
        const r = (5 + k.hash(80 + i) * 7) * (1 + k.prog(d, 0, 0.5));
        ctx.fillStyle = k.rgba('dim', alpha);
        ctx.beginPath();
        ctx.arc(Math.cos(ang) * dist, tipY + 4 + Math.sin(ang) * dist * 0.5, r, 0, k.TAU);
        ctx.fill();
      }
    }
  },
};

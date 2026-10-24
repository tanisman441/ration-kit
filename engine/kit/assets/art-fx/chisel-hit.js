// art-fx/chisel-hit — keski + çekiç: çekiç kalkar, vurur (0.18 sn),
// kıvılcım ve taş parçaları saçar, taşta çatlak belirir; sonra geri çekilir.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) = taş bloğun taban merkezi.
export default {
  name: 'chisel-hit', category: 'art-fx',
  desc: 'Çekiç keskiye vurur; kıvılcım ve taş parçaları saçar, taşta çatlak açılır',
  tags: ['keski', 'çekiç', 'taş', 'oyma', 'heykel', 'zanaat', 'chisel', 'hammer', 'stone', 'carve', 'sculpture', 'craft'],
  box: [-140, -235, 140, 115],
  bleed: 45,
  anchor: 'taş bloğun taban merkezi (0,0)',
  points: { hit: [0, -40], chisel_top: [0, -142] },
  params: {
    at: { type: 'time', default: null, desc: 'vuruş anı (0.18 sn salınım + 0.55 sn kıvılcım)' },
  },
  draw(ctx, t, p, k) {
    const LW = 8;
    const line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const A0 = 0.55, A1 = 0; // çekiç açısı: kalkık → vuruş
    let a;
    if (d < 0) a = A0 + 0.05 * Math.sin(t * 2.3);           // idle: hafif salınım
    else if (d < 0.18) { const e = 1 - Math.pow(1 - d / 0.18, 3); a = A0 + (A1 - A0) * e; }
    else { const g = k.prog(d - 0.18, 0, 0.4); const e = 1 - Math.pow(1 - g, 3); a = A1 + (A0 + 0.12 - A1) * e; }
    const struck = d >= 0.18;

    ctx.save();
    ctx.beginPath(); ctx.rect(-190, -285, 380, 415); ctx.clip();
    ctx.lineCap = 'round';

    // zemin gölgesi
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(6, 50, 72, 11, 0, 0, k.TAU); ctx.fill();

    // taş blok
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-85 - LW / 2, -40 - LW / 2, 170 + LW, 80 + LW, 12); ctx.fill();
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.beginPath(); k.rrect(-85, -40, 170, 80, 12); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-42, -26, 30, 9, -0.4, 0, k.TAU); ctx.fill();
    // vuruş sonrası çatlak
    if (struck) {
      const ca = Math.min(1, (d - 0.18) / 0.3);
      ctx.strokeStyle = k.rgba('ink', 0.7 * ca); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(0, -40); ctx.lineTo(14, -24); ctx.lineTo(8, -10); ctx.lineTo(26, 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -40); ctx.lineTo(-18, -26); ctx.lineTo(-12, -12); ctx.stroke();
    }

    // keski: uç taşta, sap yukarı
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-8 - LW / 2, -118 - LW / 2, 16 + LW, 78 + LW, 6); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.9);
    ctx.beginPath(); k.rrect(-8, -118, 16, 78, 6); ctx.fill();
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-13 - LW / 2, -142 - LW / 2, 26 + LW, 26 + LW, 10); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.beginPath(); k.rrect(-13, -142, 26, 26, 10); ctx.fill();

    // çekiç: keski tepesi etrafında döner (vuruşta başlık keskiye değer)
    ctx.save();
    ctx.translate(0, -142);
    ctx.rotate(a);
    // sap
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-6 - LW / 2, -92 - LW / 2, 12 + LW, 58 + LW, 6); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.beginPath(); k.rrect(-6, -92, 12, 58, 6); ctx.fill();
    // başlık (metal)
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-32 - LW / 2, -36 - LW / 2, 64 + LW, 36 + LW, 10); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 1);
    ctx.beginPath(); k.rrect(-32, -36, 64, 36, 10); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-13, -28, 13, 6, -0.4, 0, k.TAU); ctx.fill();
    ctx.restore();

    // vuruş efektleri
    if (struck) {
      const e2 = k.prog(d - 0.18, 0, 0.55);
      // flaş
      if (d - 0.18 < 0.25) {
        const f = 1 - (d - 0.18) / 0.25;
        k.glow(0, -150, 46, 'yellow', 0.45 * f);
      }
      // kıvılcımlar
      for (let i = 0; i < 10; i++) {
        const an = -Math.PI / 2 + (k.hash(i * 17 + 6) - 0.5) * 2.4;
        const sp = 35 + k.hash(i * 19 + 7) * 60;
        const px = Math.cos(an) * sp * e2;
        const py = -150 + Math.sin(an) * sp * e2 + e2 * e2 * 70;
        ctx.fillStyle = k.rgba(i % 2 ? 'yellow' : 'ink', 0.95 * (1 - e2));
        ctx.beginPath(); ctx.arc(px, py, 2.5 + k.hash(i * 23 + 8) * 3, 0, k.TAU); ctx.fill();
      }
      // taş parçaları
      for (let i = 0; i < 5; i++) {
        const an = -Math.PI / 2 + (k.hash(i * 29 + 4) - 0.5) * 1.8;
        const sp = 25 + k.hash(i * 31 + 5) * 40;
        const px = Math.cos(an) * sp * e2;
        const py = -120 + Math.sin(an) * sp * e2 + e2 * e2 * 110;
        ctx.save(); ctx.translate(px, py); ctx.rotate(k.hash(i * 37 + 6) * k.TAU + e2 * 4);
        ctx.fillStyle = k.rgba('panel2', 0.95 * (1 - e2 * 0.6));
        ctx.beginPath(); k.rrect(-5, -4, 10, 8, 3); ctx.fill();
        ctx.restore();
      }
    }

    ctx.restore();
  },
};

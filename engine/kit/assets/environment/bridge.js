// environment/bridge — asma köprü (yandan); iki kule, ana kablo ve askılar.
// NOT: canvas y-aşağıdır; güverte merkezi (0,0), kuleler negatif y yönünde yukarı uzar.
export default {
  name: 'bridge',
  category: 'environment',
  desc: 'Yandan asma köprü; iki kule, sarkan ana kablo ve güverteye inen askılar',
  tags: ['köprü', 'asma köprü', 'viyadük', 'geçit', 'bridge', 'suspension bridge', 'viaduct', 'crossing'],
  box: [-250, -130, 250, 30],
  bleed: 0,
  anchor: 'güverte merkezi (0,0); güverte yatay, kuleler yukarı uzar',
  points: { left: [-240, 0], right: [240, 0], deck: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.75))).join(',')})`;
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // ana kablo eğrisi (parçalı kuadratik) — askılar da aynı fonksiyonu kullanır
    const qy = (p0, c, p1, tt) => (1 - tt) * (1 - tt) * p0 + 2 * (1 - tt) * tt * c + tt * tt * p1;
    const cableY = (x) => {
      if (x < -115) { const tt = (x + 240) / 125; return qy(-8, -60, -106, tt); }
      if (x < 0) { const tt = (x + 115) / 115; return qy(-106, -66, -62, tt); }
      if (x < 115) { const tt = x / 115; return qy(-62, -66, -106, tt); }
      const tt = (x - 115) / 125; return qy(-106, -60, -8, tt);
    };

    // kuleler (önce, kablonun arkasında)
    for (const tx of [-115, 115]) {
      blob(tx - 8, -118, 16, 106, 6, dark);
      blob(tx - 13, -126, 26, 12, 5, dark); // başlık
    }

    // ana kablo (boş zeminde kontrast için ink)
    ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-240, -8);
    ctx.quadraticCurveTo(-177, -60, -115, -106);
    ctx.quadraticCurveTo(-57, -66, 0, -62);
    ctx.quadraticCurveTo(57, -66, 115, -106);
    ctx.quadraticCurveTo(177, -60, 240, -8);
    ctx.stroke();

    // askılar (kablodan güverteye)
    ctx.strokeStyle = k.rgba('ink', 0.55); ctx.lineWidth = 3;
    for (let x = -200; x <= 200; x += 40) {
      if (Math.abs(Math.abs(x) - 115) < 20) continue; // kule hizasını atla
      ctx.beginPath(); ctx.moveTo(x, cableY(x) + 2); ctx.lineTo(x, -12); ctx.stroke();
    }

    // güverte
    blob(-240, -12, 480, 24, 8, k.rgba(p.color));
    // güverte korkuluğu
    ctx.strokeStyle = k.rgba('bg', 0.4); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-232, -12); ctx.lineTo(232, -12); ctx.stroke();

    // su çizgileri (altta, ince)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 2.5;
    for (const [wx, ww] of [[-150, 70], [20, 90], [150, 60]]) {
      ctx.beginPath(); ctx.moveTo(wx, 20); ctx.lineTo(wx + ww, 20); ctx.stroke();
    }

    // premium parlama (güverte sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); k.rrect(-232, -10, 130, 7, 3.5); ctx.fill();
  },
};

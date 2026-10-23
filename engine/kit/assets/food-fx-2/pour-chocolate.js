// food-fx-2/pour-chocolate — eğik çikolata cezvesinden akan döngülü çikolata akışı; drizzle anında cezve zigzag yapar, çilek üstünde desen oluşur.
// NOT: canvas y-aşağıdır; çikolata yukarıdan (negatif y) aşağı akar. Çikolata rengi için hex kahve kullanılır (tema paletinde kahve yok).
export default {
  name: 'pour-chocolate', category: 'food-fx-2',
  desc: 'Eğik cezveden akan çikolata: boşta döngülü akış, drizzle anında cezve zigzag yapıp çileğe desen çizer',
  tags: ['çikolata', 'dökme', 'çilek', 'drizzle', 'akış', 'tatlı', 'chocolate', 'pour', 'drizzle', 'strawberry', 'dessert'],
  box: [-140, -195, 140, 165],
  bleed: 45,
  anchor: 'döküm noktası (ağız ucu)',
  points: { spout: [18, -72], pool: [18, 108], strawberry: [18, 88] },
  params: {
    drizzle: { type: 'time', default: null, desc: 'desen anı (1.0 sn): cezve zigzag yapar, çikolata deseni çizilir' },
    flow: { type: 'number', default: 0.8, desc: 'akış şiddeti 0–1: akış kalınlığı ve hızı' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const flow = k.clamp(p.flow ?? 0.8, 0, 1);
    const choc = '#7a4a21';
    const chocDk = `rgb(${k.col(choc).map(v => Math.max(0, Math.round(v * 0.68))).join(',')})`;
    const d = p.drizzle == null ? -1 : t - p.drizzle;
    const drizzling = d >= 0 && d <= 1.0;
    const g = drizzling ? k.prog(d, 0, 1.0) : -1;

    // eğik cezve: döner grup; ağız ucu grup-içi (31,-81) → dünya koordinatı kodla hesaplanır
    const tilt = 0.38, cs = Math.cos(tilt), sn = Math.sin(tilt);
    const spoutLocal = [31, -81];
    const wig = drizzling ? Math.sin(d * Math.PI * 4) * 26 : k.noise1(t * 1.4) * 3;
    const spX = (spoutLocal[0]) * cs - (spoutLocal[1] + 110) * sn + wig;
    const spY = (spoutLocal[0]) * sn + (spoutLocal[1] + 110) * cs - 110;

    ctx.save(); ctx.translate(wig, 0); ctx.translate(0, -110); ctx.rotate(tilt); ctx.translate(0, 110);
    // cezve gövdesi
    ctx.fillStyle = k.rgba('bg', 0.15);
    k.rrect(-46, -146, 116, 72, 14); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    k.rrect(-52, -152, 116, 72, 14); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 7; ctx.stroke();
    // sap (sol yanda)
    ctx.strokeStyle = line; ctx.lineWidth = 13;
    ctx.beginPath(); ctx.arc(-58, -116, 26, Math.PI * 0.55, Math.PI * 1.45); ctx.stroke();
    ctx.strokeStyle = k.rgba(p.color, 1); ctx.lineWidth = 9;
    ctx.beginPath(); ctx.arc(-58, -116, 26, Math.PI * 0.55, Math.PI * 1.45); ctx.stroke();
    // ağız (cezve alt kenarında, akış buradan; ucu spoutLocal'da)
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath(); ctx.moveTo(12, -92); ctx.lineTo(spoutLocal[0], spoutLocal[1]); ctx.lineTo(8, -70); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 5; ctx.stroke();
    // üstte çikolata yüzeyi
    ctx.fillStyle = k.rgba(choc, 1);
    ctx.beginPath(); ctx.ellipse(6, -146, 46, 10, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.14)';
    ctx.beginPath(); ctx.ellipse(-8, -148, 18, 4, -0.1, 0, k.TAU); ctx.fill();
    // gövde parlaması
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-28, -120, 8, 22, 0.2, 0, k.TAU); ctx.fill();
    ctx.restore();

    if (flow <= 0.02) { ctx.restore(); return; }

    // --- akış sütunu: kıpırdayan kenarlı, ağızdan çileğe
    const topY = spY + 4, botY = 92;
    const w = (6 + 13 * flow) * (drizzling ? 1.25 : 1);
    const column = (half, style) => {
      ctx.fillStyle = style;
      ctx.beginPath();
      for (let y = topY; y <= botY; y += 8) {
        const x = spX - half + k.noise1(y * 0.05 + t * 6 + wig * 0.05) * 3;
        if (y === topY) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      for (let y = botY; y >= topY; y -= 8) {
        const x = spX + half + k.noise1(y * 0.05 + 7 + t * 6 + wig * 0.05) * 3;
        ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.fill();
    };
    column(w + 5, chocDk);
    column(w, k.rgba(choc, 0.95));
    // parlama şeridi
    ctx.fillStyle = 'rgba(255,255,255,0.13)';
    ctx.beginPath(); ctx.ellipse(spX - w * 0.32, (topY + botY) / 2, w * 0.15, (botY - topY) * 0.32, 0.1, 0, k.TAU); ctx.fill();

    // düşen damla çizgileri (döngülü)
    const N = Math.round(5 + 8 * flow);
    const fallH = botY - topY, speed = 260 + 200 * flow;
    for (let i = 0; i < N; i++) {
      if (k.hash(i * 13.7 + 1) > flow + 0.08) continue;
      const x0 = spX + (k.hash(i * 3.1 + 1) - 0.5) * w * 1.2;
      const yy = topY + ((t * speed + k.hash(i * 9.3 + 1) * fallH) % fallH);
      const fade = 1 - k.prog(yy, botY - 20, botY);
      ctx.strokeStyle = k.rgba(choc, 0.5 * fade);
      ctx.lineWidth = 3.5 + 2.5 * flow;
      const wob = k.noise1(t * 6 + i * 5.1) * 2.5;
      ctx.beginPath(); ctx.moveTo(x0 + wob, yy); ctx.lineTo(x0 + wob * 0.5, yy + 22); ctx.stroke();
    }

    // --- çilek + tabak
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.beginPath(); ctx.ellipse(24, 138, 78, 17, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath(); ctx.ellipse(18, 132, 78, 17, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 6; ctx.stroke();
    // çilek gövdesi (kalp formu)
    const sbPath = () => {
      ctx.beginPath();
      ctx.moveTo(18, 118);
      ctx.bezierCurveTo(-14, 118, -22, 92, -12, 76);
      ctx.bezierCurveTo(-4, 64, 8, 64, 18, 72);
      ctx.bezierCurveTo(28, 64, 40, 64, 48, 76);
      ctx.bezierCurveTo(58, 92, 50, 118, 18, 118); ctx.closePath();
    };
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.save(); ctx.translate(6, 6); sbPath(); ctx.fill(); ctx.restore();
    ctx.fillStyle = k.rgba('red', 1);
    sbPath(); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 6; ctx.stroke();
    // çekirdekler (ink detay)
    ctx.fillStyle = k.rgba('ink', 0.65);
    const seeds = [[2, 86], [34, 86], [18, 96], [8, 106], [28, 106], [18, 78]];
    for (let i = 0; i < seeds.length; i++) {
      ctx.beginPath(); ctx.ellipse(seeds[i][0], seeds[i][1], 2.6, 3.6, 0, 0, k.TAU); ctx.fill();
    }
    // sap (ink)
    ctx.strokeStyle = k.rgba('ink', 0.85); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(18, 70); ctx.lineTo(18, 58); ctx.stroke();
    ctx.fillStyle = k.rgba('ink', 0.85);
    ctx.beginPath(); ctx.ellipse(18, 62, 14, 6, 0, 0, k.TAU); ctx.fill();
    // çilek parlaması
    ctx.fillStyle = 'rgba(255,255,255,0.13)';
    ctx.beginPath(); ctx.ellipse(2, 84, 7, 12, 0.25, 0, k.TAU); ctx.fill();

    // --- çikolata havuzu (çilek üstünde birikir)
    const poolW = 30 + 14 * flow;
    ctx.fillStyle = k.rgba(choc, 1);
    ctx.beginPath(); ctx.ellipse(18, 74, poolW, 9, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 4; ctx.stroke();
    // havuz dalgası (döngülü)
    const wr = (t * 40) % 22;
    ctx.strokeStyle = k.rgba(choc, 0.6 * (1 - wr / 22));
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(18, 74, poolW + wr, 9 + wr * 0.4, 0, 0, k.TAU); ctx.stroke();

    // --- drizzle deseni: çilek üstünde zigzag çizgiler belirir (havuzun altında, kırmızı zeminde)
    if (drizzling || d > 1.0) {
      const dg = drizzling ? g : 1;
      ctx.strokeStyle = k.rgba(choc, 0.95); ctx.lineWidth = 6;
      const zz = Math.min(dg * 1.6, 1);
      for (let r = 0; r < 3; r++) {
        const yy = 94 + r * 12;
        const x0 = -6, x1 = 42;
        const xe = x0 + (x1 - x0) * Math.max(0, zz - r * 0.22);
        if (xe <= x0) continue;
        ctx.beginPath(); ctx.moveTo(x0, yy);
        for (let x = x0; x <= xe; x += 4) {
          ctx.lineTo(x, yy + Math.sin((x - x0) * 0.5) * 5);
        }
        ctx.stroke();
      }
      // sıçrayan damlalar
      if (drizzling) {
        for (let i = 0; i < 8; i++) {
          const sg = k.prog(d - k.hash(i * 4.4 + 2) * 0.3, 0, 0.6);
          if (sg <= 0) continue;
          const px = 18 + (k.hash(i * 7.1 + 5) - 0.5) * 110;
          const py = 70 - 46 * Math.sin(sg * Math.PI);
          ctx.fillStyle = k.rgba(choc, 0.9 * (1 - sg * 0.6));
          ctx.beginPath(); ctx.arc(px, py, 2.5 + k.hash(i * 2.9 + 8) * 2.5, 0, k.TAU); ctx.fill();
        }
      }
    }
    ctx.restore();
  },
};

// coast-fx/tide-rush — gelgit dalgası; `at` anında dalga kıyıya vurur, köpük kumsala yayılır. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) kıyı çizgisi (dalganın vurduğu nokta, kumsalın üst kenarı).
export default {
  name: 'tide-rush', category: 'coast-fx',
  desc: 'Kumsala vuran gelgit dalgası; dalga yükselir, kıyıya çarpar ve beyaz köpük kumsala doğru yayılır',
  tags: ['gelgit', 'dalga', 'kıyı', 'kumsal', 'köpük', 'deniz', 'tide', 'wave', 'shore', 'beach', 'foam', 'sea'],
  box: [-150, -110, 150, 110],
  bleed: 30,
  anchor: 'kıyı çizgisi (0,0); deniz üst yarı, kumsal alt yarı (y 0..110)',
  points: { shore: [0, 0], crest: [0, -70], foam: [0, 60] },
  params: {
    color: { type: 'color', default: 'panel2' },
    at: { type: 'time', default: null, desc: 'dalga vurma anı — dalga yükselir, kıyıya çarpar, köpük yayılır (1.4 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const rushing = d >= 0 && d < 1.4;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // kumsal (alt yarı) — panel, denizden (panel2) ayrışır
    ctx.fillStyle = k.rgba('panel');
    ctx.beginPath(); k.rrect(-150, 0, 300, 110, 6); ctx.fill();
    // kumda küçük taşlar / kabuk izleri
    for (let i = 0; i < 6; i++) {
      const sx = -120 + k.hash(i) * 240, sy = 55 + k.hash(i + 20) * 45;
      ctx.fillStyle = k.rgba('dim', 0.5);
      ctx.beginPath(); ctx.arc(sx, sy, 3 + k.hash(i + 40) * 2, 0, k.TAU); ctx.fill();
    }
    // deniz (üst yarı) — panel2 + cyan tint, kumsaldan ayrışır
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-150, -110, 300, 110, 6); ctx.fill();
    ctx.fillStyle = k.rgba('cyan', 0.16);
    ctx.beginPath(); k.rrect(-150, -110, 300, 110, 6); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.35); ctx.lineWidth = 3;
    for (let i = 0; i < 2; i++) {
      const wy = -88 + i * 26;
      ctx.beginPath();
      for (let x = -140; x <= 140; x += 14) {
        const yy = wy + Math.sin(x * 0.05 + t * 1.0 + i * 2) * 2.5;
        if (x === -140) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }

    // dalga: yaklaşırken yükselir (d < 0: hafif salınım; 0..0.35: hızlı yükselme; sonra çökme)
    let crestH = 0, crestX = 0;
    if (d < 0) {
      crestH = 16 + Math.sin(t * 1.2) * 4;
      crestX = Math.sin(t * 0.7) * 6;
    } else if (d < 0.35) {
      const s = d / 0.35;
      crestH = 16 + s * s * 52;
      crestX = 0;
    } else {
      crestH = Math.max(0, 68 - (d - 0.35) * 70);
    }
    const crestY = -6 - crestH;
    // dalga gövdesi (kıyıya paralel kavisli şerit)
    ctx.fillStyle = line; ctx.beginPath();
    ctx.moveTo(-150, 2);
    ctx.quadraticCurveTo(crestX, crestY - 8, 150, 2);
    ctx.lineTo(150, 2); ctx.lineTo(-150, 2);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('cyan', 0.75); ctx.beginPath();
    ctx.moveTo(-146, 0);
    ctx.quadraticCurveTo(crestX, crestY, 146, 0);
    ctx.lineTo(146, 0); ctx.lineTo(-146, 0);
    ctx.closePath(); ctx.fill();
    // dalga tepesi köpük çizgisi (beyaz — iki temada da okunur)
    ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-146, -2);
    ctx.quadraticCurveTo(crestX, crestY - 2, 146, -2);
    ctx.stroke();
    // premium parlama (sol üst, dalga üstünde)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-90, crestY + 6, 22, 4, 0, 0, k.TAU); ctx.fill();

    // köpük: çarpma anından sonra kumsala yayılır (0.35..1.4 sn)
    if (d >= 0.35) {
      const fp = k.clamp((d - 0.35) / 0.9, 0, 1);
      const foamReach = fp * 78;
      // köpük tabakası (düzensiz ön kenar) — beyaz köpük, iki temada da okunur
      ctx.fillStyle = `rgba(255,255,255,${(0.85 * (1 - fp * 0.35)).toFixed(2)})`;
      ctx.beginPath();
      ctx.moveTo(-150, 0);
      for (let x = -150; x <= 150; x += 15) {
        const fy = foamReach * (0.75 + 0.25 * Math.sin(x * 0.09 + 1.3));
        ctx.lineTo(x, fy);
      }
      ctx.lineTo(150, 0);
      ctx.closePath(); ctx.fill();
      // köpük baloncukları
      for (let i = 0; i < 14; i++) {
        const bx = -140 + k.hash(i) * 280;
        const by = k.hash(i + 30) * foamReach * 0.9;
        const bs = 2 + k.hash(i + 50) * 3.5;
        ctx.fillStyle = `rgba(255,255,255,${(0.9 * (1 - fp * 0.4)).toFixed(2)})`;
        ctx.beginPath(); ctx.arc(bx, by, bs, 0, k.TAU); ctx.fill();
      }
      // geri çekilen su çizgisi
      ctx.strokeStyle = k.rgba('cyan', 0.5 * (1 - fp));
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = -140; x <= 140; x += 14) {
        const yy = foamReach + Math.sin(x * 0.06 + t * 2) * 2;
        if (x === -140) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
      }
      ctx.stroke();
    } else {
      // çarpma öncesi: kıyıda hafif köpük izi
      ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = -140; x <= 140; x += 14) {
        const yy = 2 + Math.sin(x * 0.06 + t * 1.5) * 2;
        if (x === -140) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }

    // çarpma anı flaşı
    if (d >= 0.3 && d < 0.65) {
      const fe = 1 - (d - 0.3) / 0.35;
      k.glow(0, -10, 60, 'cyan', 0.3 * fe);
    }
  },
};

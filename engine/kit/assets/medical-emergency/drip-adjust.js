// medical-emergency/drip-adjust — serum hortumundaki roller kıskaç: akış ayarı anı + döngülü damlama.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'drip-adjust', category: 'medical-emergency',
  desc: 'Serum hortumu üzerinde roller kıskaç; at anında tekerlek kayar ve damla hızı artar, odacıkta döngülü damlama',
  tags: ['serum', 'damla', 'kıskaç', 'akış ayarı', 'infüzyon', 'roller', 'drip', 'flow', 'adjust', 'clamp', 'intravenous', 'hospital', 'medical'],
  box: [-80, -110, 80, 110],
  bleed: 26,
  anchor: 'roller kıskaç merkezi',
  points: { inlet: [0, -100], outlet: [0, 100], chamber: [0, 62], roller: [0, -12] },
  params: {
    color: { type: 'color', default: 'cyan' },
    at: { type: 'time', default: null, desc: 'akış ayarı: 0.8 sn tekerlek aşağı kayar, damla hızı 2 katına çıkar, LED hızlanır (0.2–1.5 sn arası)' },
    flow: { type: 'number', default: 1, desc: 'bazal damla hızı çarpanı' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55), lw = 6;
    ctx.save();
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;
    const adj = d >= 0 && d < 0.8 ? k.E.inOutCubic(k.prog(d, 0, 0.8)) : (d >= 0.8 ? 1 : 0);
    // ayar anından sonraki 2.5 sn boyunca hızlanmış damlama
    const boost = d >= 0 && d < 2.5 ? 2 * Math.exp(-d * 1.2) : 0;
    const rate = p.flow + boost;

    // hortum (üstten alta, serbest çizgi: ink)
    ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(0, -104); ctx.lineTo(0, 104); ctx.stroke();

    // roller kıskaç gövdesi + sağ alt gölge
    const rollerY = -22 + 26 * adj; // tekerlek aşağı kayar (akış açılır)
    ctx.fillStyle = k.rgba('bg', 0.12);
    k.rrect(-20 + 6, -52 + 6, 40, 80, 12); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.strokeStyle = line; ctx.lineWidth = lw;
    k.rrect(-20, -52, 40, 80, 12); ctx.fill(); ctx.stroke();
    // premium: sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-10, -40, 9, 5, -0.5, 0, k.TAU); ctx.fill();
    // hortum kanalı (kıskaç içinden geçen açık yarık)
    ctx.fillStyle = k.rgba('ink');
    k.rrect(-6, -46, 12, 68, 6); ctx.fill();
    // tekerlek
    ctx.fillStyle = k.rgba(p.color, 0.9);
    ctx.strokeStyle = line; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.arc(0, rollerY, 12, 0, k.TAU); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 3;
    for (let s = 0; s < 3; s++) {
      const a = rollerY * 0.35 + s * k.TAU / 3;
      ctx.beginPath(); ctx.moveTo(0, rollerY);
      ctx.lineTo(7 * Math.cos(a), rollerY + 7 * Math.sin(a)); ctx.stroke();
    }
    // akış göstergesi LED (hızla yanıp söner)
    const ledA = 0.35 + 0.65 * Math.pow(Math.max(0, Math.sin(t * 3 * rate)), 2);
    ctx.fillStyle = k.rgba(p.color, ledA);
    ctx.beginPath(); ctx.arc(0, 16, 6, 0, k.TAU); ctx.fill();
    // ayar anında küçük kıvılcım çemberi
    if (d >= 0 && d < 0.8) {
      ctx.strokeStyle = k.rgba(p.color, 0.8 * (1 - d / 0.8)); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(0, rollerY, 22 - 12 * (d / 0.8), 0, k.TAU); ctx.stroke();
    }

    // damla odacığı
    ctx.fillStyle = k.rgba('bg', 0.12);
    k.rrect(-18 + 6, 40 + 6, 36, 56, 10); ctx.fill();
    ctx.fillStyle = k.rgba('panel');
    ctx.strokeStyle = line; ctx.lineWidth = lw;
    k.rrect(-18, 40, 36, 56, 10); ctx.fill(); ctx.stroke();
    ctx.save();
    k.rrect(-18, 40, 36, 56, 10); ctx.clip();
    // sıvı seviyesi
    ctx.fillStyle = k.rgba(p.color, 0.35);
    k.rrect(-18, 74, 36, 22, 0); ctx.fill();
    // düşen damla (döngülü, hız rate'e bağlı)
    const period = 1.6 / Math.max(0.2, rate);
    const ph = ((t % period) + period) % period / period;
    if (ph < 0.55) {
      const dy = 44 + ph / 0.55 * 30;
      ctx.fillStyle = k.rgba(p.color, 0.95);
      ctx.beginPath();
      ctx.moveTo(0, dy - 8);
      ctx.quadraticCurveTo(6, dy - 2, 5, dy + 2);
      ctx.quadraticCurveTo(4, dy + 7, 0, dy + 7);
      ctx.quadraticCurveTo(-4, dy + 7, -5, dy + 2);
      ctx.quadraticCurveTo(-6, dy - 2, 0, dy - 8);
      ctx.fill();
    }
    // halka (damla sıvıya düşünce)
    const rq = (ph - 0.55) / 0.45;
    if (ph >= 0.55 && rq < 1) {
      ctx.strokeStyle = k.rgba(p.color, 0.7 * (1 - rq)); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(0, 78, 4 + 10 * rq, 2 + 5 * rq, 0, 0, k.TAU); ctx.stroke();
    }
    ctx.restore();

    ctx.restore();
  },
};

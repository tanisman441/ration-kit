// aquarium-fx/octopus-ink — ahtapot: kollar idle dalgalanır, manto
// nefes alır (~2.4 sn); at anında (0.8 sn) mürekkep bulutu püskürür,
// ahtapot ters yöne fırlayarak kaçar.
// NOT: canvas y-aşağıdır; (0,0) mantonun merkezidir, yüz sağa bakar.
export default {
  name: 'octopus-ink', category: 'aquarium-fx',
  desc: 'Kolları dalgalanan ahtapot, at anında mürekkep püskürtüp geri fırlar',
  tags: ['ahtapot', 'mürekkep', 'kaçış', 'bulut', 'akvaryum', 'octopus', 'ink', 'escape', 'tentacles', 'underwater'],
  box: [-130, -95, 130, 115],
  bleed: 65,
  anchor: 'mantonun merkezi (0,0)',
  points: { head: [0, -55], siphon: [-52, 8] },
  params: {
    at: { type: 'time', default: null, desc: 'mürekkep püskürtme anı (0.8 sn, bulut genişler + geri tepme)' },
    color: { type: 'color', default: 'purple', desc: 'ahtapot rengi' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    // at olayı (0.8 sn): mürekkep bulutu sola genişler, ahtapot sağa fırlar
    const ad = p.at == null ? -1 : t - p.at;
    let inkP = -1, flee = 0;
    if (ad >= 0 && ad < 0.8) {
      inkP = ad / 0.8;
      flee = Math.sin(Math.min(inkP * 1.4, 1) * Math.PI * 0.5) * 52; // sağa kaçış
    } else if (ad >= 0.8 && ad < 2.2) {
      flee = 52 * (1 - (ad - 0.8) / 1.4); // olay sonrası yavaşça geri süzülür
    }

    ctx.translate(flee, Math.sin(t * k.TAU / 3.1) * 5); // idle süzülme

    // manto nefesi (2.4 sn)
    const breathe = 1 + Math.sin(t * k.TAU / 2.4) * 0.03;
    const mrX = 56 * breathe, mrY = 48 * (2 - breathe) / 1;

    // kollar: 8 kol, sine dalgası (ink anında geriye toplanır)
    const tn = 8;
    for (let i = 0; i < tn; i++) {
      const frac = i / (tn - 1);
      const hx = (frac - 0.5) * 88;
      const len = 58 + k.hash(i * 11.7) * 34;
      const curl = inkP >= 0 ? Math.sin(inkP * Math.PI) * 26 : 0; // kaçışta kollar geriye
      ctx.strokeStyle = k.rgba(acc, 0.85); ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.moveTo(hx, mrY * 0.55);
      for (let s = 1; s <= 8; s++) {
        const yy = mrY * 0.55 + (s / 8) * len;
        const xx = hx + Math.sin(s * 0.85 + t * 3 + i * 1.9) * 10 * (s / 8) + curl * (s / 8);
        ctx.lineTo(xx, yy);
      }
      ctx.stroke();
      ctx.strokeStyle = k.rgba('bg', 0.5); ctx.lineWidth = 2;
      // iç emici çizgisi
      ctx.beginPath();
      ctx.moveTo(hx, mrY * 0.55);
      for (let s = 1; s <= 4; s++) {
        const yy = mrY * 0.55 + (s / 8) * len;
        const xx = hx + Math.sin(s * 0.85 + t * 3 + i * 1.9) * 10 * (s / 8) + curl * (s / 8);
        ctx.lineTo(xx, yy);
      }
      ctx.stroke();
    }

    // manto: kubbe
    ctx.fillStyle = k.rgba(acc, 0.92);
    ctx.beginPath(); ctx.ellipse(0, -8, mrX, mrY, 0, Math.PI, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.ellipse(0, -8, mrX, mrY, 0, Math.PI, k.TAU); ctx.stroke();
    ctx.fillStyle = k.rgba(acc, 0.92);
    k.rrect(-mrX, -14, mrX * 2, 16, 8); ctx.fill();
    // premium finish: sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-mrX * 0.38, -8 - mrY * 0.42, mrX * 0.30, mrY * 0.24, -0.5, 0, k.TAU); ctx.fill();

    // sifon (mürekkep çıkışı, solda)
    ctx.fillStyle = k.rgba(acc, 0.9);
    ctx.beginPath(); ctx.ellipse(-52, 8, 10, 7, 0.3, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.ellipse(-52, 8, 10, 7, 0.3, 0, k.TAU); ctx.stroke();

    // yüz: karakter ailesi dili — iki nokta göz, kısa ağız
    ctx.fillStyle = k.rgba('ink', 0.85);
    ctx.beginPath(); ctx.arc(14, -34, 5, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(36, -32, 5, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(27, -16, 7, 0.5, 2.4); ctx.stroke();

    ctx.restore();

    // mürekkep bulutu: sola doğru genişleyen koyu puflar (0.8 sn)
    if (inkP >= 0) {
      ctx.save();
      for (let i = 0; i < 9; i++) {
        const h = k.hash(i * 29.3 + 5);
        const dist = (20 + h * 90) * inkP;
        const x = -52 - dist + k.noise1(i * 3.3) * 24;
        const y = 8 + (h - 0.5) * 90 * inkP - inkP * 20;
        const r = (8 + h * 16) * (0.4 + inkP * 1.3);
        const alpha = (1 - inkP) * 0.85;
        if (alpha <= 0) continue;
        // mürekkep her iki temada da koyu görünmeli (sabit renk, tema bağımsız)
        ctx.fillStyle = `rgba(28,26,40,${alpha})`;
        ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
      }
      // ilk fışkırma: ince jet çizgisi
      if (inkP < 0.35) {
        ctx.strokeStyle = `rgba(28,26,40,${(1 - inkP / 0.35) * 0.9})`; ctx.lineWidth = 8;
        ctx.beginPath(); ctx.moveTo(-58, 8); ctx.lineTo(-58 - 70 * (inkP / 0.35), 8); ctx.stroke();
      }
      ctx.restore();
    }
  },
};

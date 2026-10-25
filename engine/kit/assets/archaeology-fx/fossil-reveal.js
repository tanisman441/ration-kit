// archaeology-fx/fossil-reveal — kaya levhadaki ammonit fosili; `at` anında toprak tabakası kalkar, fosil parlar. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) kaya levhanın merkezi.
export default {
  name: 'fossil-reveal', category: 'archaeology-fx',
  desc: 'Kaya levha üzerinde spiral ammonit fosili; ortaya çıkış anında toprak tabakası kalkar, fosil parıltıyla belirir',
  tags: ['fosil', 'ammonit', 'arkeoloji', 'kazı', 'kaya', 'fossil', 'ammonite', 'archaeology', 'excavation', 'rock', 'paleontology'],
  box: [-130, -110, 130, 110],
  bleed: 45,
  anchor: 'kaya levhanın merkezi (0,0); fosil merkezde',
  points: { fossil: [0, 0], slab: [0, 86], top: [0, -92] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'ortaya çıkış anı — toprak tabakası kalkar, fosil belirir (1.1 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const rev = d >= 0 && d < 1.1;
    // toprak kalkışı: 0→1 (olay sonrası kalıcı olarak kalkmış)
    const clearP = d < 0 ? 0 : Math.min(d / 1.1, 1);
    const env = rev ? Math.sin(Math.min(d / 1.1, 1) * Math.PI) : 0;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // kaya levha
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); k.rrect(-116, -94, 232, 188, 30); ctx.fill();
    blob(-116, -94, 232, 188, 30, k.rgba('panel2'));
    // levha çatlakları
    ctx.strokeStyle = k.rgba('ink', 0.3); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-100, -70); ctx.lineTo(-70, -40); ctx.lineTo(-84, -6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(96, 60); ctx.lineTo(70, 34); ctx.lineTo(88, 8); ctx.stroke();
    // gölge (sağ alt)
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(-108, 82, 216, 10, 5); ctx.fill();

    // ammonit fosili: spiral halkalar (merkezden dışa)
    const fossilA = 0.25 + 0.75 * clearP; // olay öncesi hafif silik, sonra net
    ctx.save();
    ctx.translate(0, 0);
    ctx.strokeStyle = k.rgba('yellow', 0.9 * fossilA); ctx.lineWidth = 7;
    ctx.beginPath(); ctx.arc(0, 0, 8, 0, k.TAU); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink', 0.75 * fossilA); ctx.lineWidth = 5;
    for (const r of [18, 30, 42, 54]) {
      ctx.beginPath(); ctx.arc(0, 0, r, 0.3, k.TAU * 0.82); ctx.stroke();
    }
    // bölme çizgileri (septalar)
    ctx.strokeStyle = k.rgba('ink', 0.55 * fossilA); ctx.lineWidth = 3.5;
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * k.TAU + 0.4;
      const r1 = 12 + (i % 3) * 12;
      const r2 = r1 + 12;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
      ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
      ctx.stroke();
    }
    // dış halka vurgusu
    ctx.strokeStyle = k.rgba('yellow', 0.55 * fossilA); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, 0, 62, 0.3, k.TAU * 0.82); ctx.stroke();
    ctx.restore();

    // toprak tabakası (olay öncesi fosili örter, sonra kalkar)
    if (clearP < 1) {
      const liftY = -clearP * 130;
      const fade = 1 - clearP;
      ctx.save();
      ctx.translate(0, liftY);
      ctx.globalAlpha = fade;
      ctx.fillStyle = k.rgba('dim');
      ctx.beginPath(); ctx.ellipse(0, 0, 78, 72, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('ink', 0.35);
      for (let i = 0; i < 10; i++) {
        const bx = -60 + k.hash(i * 3) * 120;
        const by = -52 + k.hash(i * 3 + 1) * 104;
        ctx.beginPath(); ctx.ellipse(bx, by, 5 + k.hash(i) * 6, 3 + k.hash(i + 9) * 4, 0, 0, k.TAU); ctx.fill();
      }
      ctx.restore();
    }

    // ortaya çıkış parıltısı (süpürme ışığı)
    if (rev) {
      ctx.strokeStyle = k.rgba('yellow', 0.8 * (1 - d / 1.1));
      ctx.lineWidth = 4;
      const rr = 10 + d * 90;
      ctx.beginPath(); ctx.arc(0, 0, rr, 0, k.TAU); ctx.stroke();
      // toz parçacıkları
      for (let i = 0; i < 8; i++) {
        const prog = k.clamp((d - k.hash(i) * 0.2) / 0.5, 0, 1);
        if (prog <= 0) continue;
        const dx = (k.hash(i + 20) - 0.5) * 130 * prog;
        const dy = (k.hash(i + 30) - 0.5) * 110 * prog - prog * 20;
        ctx.fillStyle = k.rgba('dim', 0.6 * (1 - prog));
        ctx.beginPath(); ctx.ellipse(dx, dy, 4 + k.hash(i) * 4, 3, 0, 0, k.TAU); ctx.fill();
      }
    }

    // boşta fosil parıltısı (3 sn'de bir kısa nabız)
    const pulse = Math.max(0, Math.sin(t * k.TAU / 3)) ** 8;
    ctx.fillStyle = k.rgba('yellow', 0.35 * pulse * (0.3 + 0.7 * clearP));
    ctx.beginPath(); ctx.ellipse(-18, -18, 7, 11, 0.3, 0, k.TAU); ctx.fill();
  },
};

// sports/whistle — klasik düdük formu + ip/askı; blow anında ses çizgileri + titreşim
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır; (0,0) düdüğün merkezidir.
export default {
  name: 'whistle', category: 'sports',
  desc: 'İpli klasik düdük; blow anında ses çizgileri çıkar ve düdük titrer',
  tags: ['düdük', 'whistle', 'hakem', 'referee', 'çal', 'blow', 'spor', 'ses'],
  box: [-100, -80, 100, 60],
  bleed: 60,
  anchor: 'düdüğün merkezi (0,0)',
  points: { mouth: [62, 0], mouthpiece: [-52, 0] },
  params: {
    blow: { type: 'time', default: null, desc: 'çalma anı (ses çizgileri + titreşim 0.3 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba('dim'), line = k.rgba('bg', 0.55);

    // blow: 0.3 sn titreşim + ses çizgileri
    const d = p.blow == null ? -1 : t - p.blow;
    const blowing = d >= 0 && d < 0.3;
    const vib = blowing ? Math.sin(d * 120) * 2.5 * (1 - d / 0.3) : 0;

    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    ctx.save();
    ctx.translate(0, vib);

    // sağ alt gölge (%12 koyultma)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.arc(-18 + 6, 6, 30, 0, k.TAU); ctx.fill();
    ctx.fillRect(-58 + 6, -12 + 6, 66, 24);

    // düdük gövdesi: ağızlık + yuvarlak hazne
    // dış hat
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(-18, 0, 30 + LW / 2, 0, k.TAU); ctx.fill();
    ctx.beginPath(); k.rrect(-62, -14 - LW / 2, 66, 28 + LW, 10); ctx.fill();
    // ana gövde
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.arc(-18, 0, 30, 0, k.TAU); ctx.fill();
    ctx.beginPath(); k.rrect(-62, -14, 66, 28, 10); ctx.fill();

    // iç detay: üfleme deliği (ink 0.75) + hazne çizgisi (ink 0.35)
    ctx.fillStyle = k.rgba('ink', 0.75);
    ctx.beginPath(); ctx.arc(-18, -6, 7, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(6, -14); ctx.lineTo(6, 14); ctx.stroke();

    // premium parlama (sol üst, hazne)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-32, -13, 11, 6, -0.4, 0, k.TAU); ctx.fill();

    // ip/askı: üstten çıkan serbest çizgi (ink rengi)
    ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-40, -28); ctx.quadraticCurveTo(-70, -52, -52, -72); ctx.stroke();

    ctx.restore();

    // blow efekti: sağdan yayılan ses çizgileri (0.3 sn)
    if (blowing) {
      const a = 1 - d / 0.3;
      ctx.strokeStyle = k.rgba('ink', 0.75 * a); ctx.lineWidth = 4;
      for (let i = 0; i < 3; i++) {
        const r = 58 + i * 13 + d * 40;
        ctx.beginPath(); ctx.arc(62, 0, r, -0.5, 0.5); ctx.stroke();
      }
    }
  },
};

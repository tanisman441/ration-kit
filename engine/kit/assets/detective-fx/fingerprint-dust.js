// detective-fx/fingerprint-dust — toz fırçası parmak izi üzerinde gezer; `at` anında iz tozla belirir. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) parmak izinin merkezidir.
export default {
  name: 'fingerprint-dust', category: 'detective-fx',
  desc: 'Koyu yüzeyde parmak izi; toz fırçası soldan sağa süpürür, `at` anında iz tozla belirginleşir',
  tags: ['parmak izi', 'toz', 'fırça', 'delil', 'dedektif', 'inceleme', 'fingerprint', 'dust', 'brush', 'evidence', 'detective', 'forensic'],
  box: [-130, -100, 130, 100],
  bleed: 30,
  anchor: 'parmak izi merkezi (0,0); yüzey kartı y ~-80..80',
  points: { print: [0, 0], brush: [0, -55] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'toz serpme anı — fırça izi süpürür, iz belirir (0.9 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // koyu yüzey kartı
    blob(-120, -85, 240, 170, 14, k.rgba('panel2'));
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-88, -68, 30, 9, 0, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(58, 62, 56, 12, 6); ctx.fill();

    // fırça konumu: at'tan önce solda bekler, at..at+0.6 arası süpürür, sonra sağda durur
    let bx;
    if (d < 0) bx = -95 + Math.sin(t * k.TAU / 2.4) * 4;
    else if (d < 0.6) bx = k.lerp(-95, 95, 1 - Math.pow(1 - d / 0.6, 2));
    else bx = 95;
    const by = -52 + Math.sin(t * k.TAU / 1.7) * 3;

    // belirme: iz, fırçanın geçtiği yerde belirir (clip ile soldan sağa)
    const revealX = d < 0 ? -120 : bx;
    const printAlpha = d < 0 ? 0.18 : 0.95;
    // hayalet iz (henüz belirginleşmemiş hâl)
    ctx.strokeStyle = k.rgba('ink', 0.18); ctx.lineWidth = 3;
    for (let r = 12; r <= 48; r += 9) { ctx.beginPath(); ctx.arc(0, 0, r, 0.3, k.TAU - 0.7); ctx.stroke(); }
    // belirgin iz (clip: fırçanın solunda)
    ctx.save();
    ctx.beginPath(); ctx.rect(-120, -85, revealX + 120, 170); ctx.clip();
    ctx.strokeStyle = k.rgba('ink', printAlpha); ctx.lineWidth = 3.5;
    for (let r = 12; r <= 48; r += 9) { ctx.beginPath(); ctx.arc(0, 0, r, 0.3, k.TAU - 0.7); ctx.stroke(); }
    // merkez girdap
    ctx.beginPath(); ctx.arc(0, 0, 5, 0, k.TAU); ctx.stroke();
    ctx.restore();

    // toz zerreleri: süpürme sırasında fırça ucundan saçılır, sonra çöker
    if (d >= 0 && d < 0.9) {
      for (let i = 0; i < 16; i++) {
        const prog = k.clamp((d - k.hash(i) * 0.2) / 0.6, 0, 1);
        if (prog <= 0) continue;
        const a = k.hash(i + 20) * k.TAU;
        const dist = prog * (10 + k.hash(i + 40) * 30);
        const px = bx + Math.cos(a) * dist;
        const py = by + 18 + Math.sin(a) * dist * 0.5 + prog * prog * 14;
        ctx.fillStyle = k.rgba('yellow', 0.85 * (1 - prog));
        ctx.beginPath(); ctx.arc(px, py, 2.5 + k.hash(i + 60) * 2, 0, k.TAU); ctx.fill();
      }
      k.glow(bx, by + 10, 26, 'yellow', 0.25 * (1 - d / 0.9));
    }

    // fırça: sap + tozlu kıl demeti
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(-0.5 + Math.sin(t * k.TAU / 1.7) * 0.06);
    // sap
    ctx.strokeStyle = line; ctx.lineWidth = 11;
    ctx.beginPath(); ctx.moveTo(0, -34); ctx.lineTo(0, 2); ctx.stroke();
    ctx.strokeStyle = k.rgba('panel2'); ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(0, -34); ctx.lineTo(0, 2); ctx.stroke();
    // kıl demeti (yelpaze)
    ctx.fillStyle = k.rgba('yellow', 0.85);
    ctx.beginPath(); ctx.moveTo(-4, 0); ctx.quadraticCurveTo(-16, 22, -10, 30); ctx.lineTo(10, 30); ctx.quadraticCurveTo(16, 22, 4, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.moveTo(-4, 0); ctx.quadraticCurveTo(-12, 20, -8, 29); ctx.lineTo(8, 29); ctx.quadraticCurveTo(12, 20, 4, 0); ctx.closePath(); ctx.fill();
    ctx.restore();

    // boştayken iz hafifçe parlar (nabız) — at yoksa da canlı
    if (d < 0) {
      const pulse = 0.5 + 0.5 * Math.sin(t * k.TAU / 2.0);
      ctx.strokeStyle = k.rgba('cyan', 0.25 + 0.3 * pulse); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, 52 + pulse * 3, 0, k.TAU); ctx.stroke();
    }
  },
};

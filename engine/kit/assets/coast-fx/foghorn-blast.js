// coast-fx/foghorn-blast — iskele ucundaki sis düdüğü; `at` anında öter, ses dalgaları halka halka yayılır. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) düdük borusunun ağzı (sesin çıktığı nokta).
export default {
  name: 'foghorn-blast', category: 'coast-fx',
  desc: 'İskele direği üstünde pirinç sis düdüğü; öttüğü anda borudan ses halkaları yayılır, düdük titrer',
  tags: ['sis düdüğü', 'düdük', 'sis', 'ses', 'iskele', 'gemi', 'foghorn', 'horn', 'sound', 'pier', 'fog', 'blast'],
  box: [-150, -110, 150, 110],
  bleed: 40,
  anchor: 'düdük borusu ağzı (0,0); direk tabanı y ~95, deniz y ~70',
  points: { horn: [0, 0], mouth: [58, 0], base: [0, 95] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'sis düdüğü ötme anı — ses halkaları yayılır (1.2 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const blasting = d >= 0 && d < 1.2;
    const env = blasting ? Math.sin(Math.min(d / 1.2, 1) * Math.PI) : 0;
    // ötme anında düdük hafif titrer
    const shake = blasting ? Math.sin(d * 55) * 1.6 * env : Math.sin(t * 1.4) * 0.6;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // arka plan: sisli gökyüzü çizgileri + deniz
    ctx.strokeStyle = k.rgba('bg', 0.25); ctx.lineWidth = 4;
    for (let i = 0; i < 3; i++) {
      const fy = -92 + i * 18 + Math.sin(t * 0.5 + i) * 2;
      ctx.beginPath(); ctx.moveTo(-140, fy); ctx.lineTo(140 - i * 30, fy); ctx.stroke();
    }
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-150, 70, 300, 40, 6); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.4); ctx.lineWidth = 3;
    for (let i = 0; i < 2; i++) {
      const wy = 82 + i * 12;
      ctx.beginPath();
      for (let x = -140; x <= 140; x += 14) {
        const yy = wy + Math.sin(x * 0.05 + t * 1.1 + i * 2) * 2.5;
        if (x === -140) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }

    // iskele direği + platform
    blob(-14, 30, 28, 66, 8, k.rgba('panel2'));
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(2, 36, 10, 56, 5); ctx.fill();
    blob(-44, 22, 88, 14, 6, body);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-28, 26, 12, 3, 0, 0, k.TAU); ctx.fill();

    // ses halkaları: ötme anında ağızdan sağa doğru genişler ve solar
    if (blasting) {
      for (let i = 0; i < 4; i++) {
        const prog = k.clamp((d - i * 0.14) / 0.9, 0, 1);
        if (prog <= 0) continue;
        const r = 16 + prog * 88;
        const a = 0.9 * (1 - prog) * env;
        ctx.strokeStyle = k.rgba('yellow', a);
        ctx.lineWidth = 5 * (1 - prog * 0.5);
        ctx.beginPath(); ctx.arc(58, 0, r, -0.9, 0.9); ctx.stroke();
      }
      // ağız flaşı
      k.glow(58, 0, 26 + env * 18, 'yellow', 0.45 * env);
    } else {
      // boştayken hafif nefes: ara ara tek sönük halka
      const cyc = (t * 0.33 + 0.2) % 1;
      if (cyc < 0.4) {
        const r = 14 + (cyc / 0.4) * 34;
        ctx.strokeStyle = k.rgba('bg', 0.28 * (1 - cyc / 0.4));
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(58, 0, r, -0.8, 0.8); ctx.stroke();
      }
    }

    // sis düdüğü gövdesi (titreyen grup)
    ctx.save();
    ctx.translate(0, shake);
    // boru: dar gövdeden geniş ağza
    ctx.fillStyle = line; ctx.beginPath();
    ctx.moveTo(-46, -16); ctx.lineTo(52, -30); ctx.lineTo(52, 30); ctx.lineTo(-46, 16); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('yellow', 0.85); ctx.beginPath();
    ctx.moveTo(-42, -12); ctx.lineTo(48, -25); ctx.lineTo(48, 25); ctx.lineTo(-42, 12); ctx.closePath(); ctx.fill();
    // boru bantları
    ctx.fillStyle = k.rgba('ink', 0.3); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-20, -13.5); ctx.lineTo(-20, 13.5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(8, -18); ctx.lineTo(8, 18); ctx.stroke();
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-18, -8, 16, 4, -0.1, 0, k.TAU); ctx.fill();
    // ağız halkası
    blob(46, -34, 14, 68, 7, k.rgba('red', 0.85));
    ctx.fillStyle = k.rgba('ink', 0.75);
    ctx.beginPath(); ctx.ellipse(60, 0, 5, 26, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('yellow', 0.35 + 0.6 * env);
    ctx.beginPath(); ctx.ellipse(60, 0, 3, 20, 0, 0, k.TAU); ctx.fill();
    // arka kapak + boru bağlantısı
    blob(-56, -12, 14, 24, 6, k.rgba('panel2'));
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(20, 26, 18, 4, 0, 0, k.TAU); ctx.fill();
    ctx.restore();

    // küçük uyarı lambası (ötme anında yanar)
    const lampOn = blasting ? 0.9 : 0.25 + 0.15 * Math.sin(t * 2);
    k.glow(0, -34, 12, 'red', 0.4 * lampOn);
    ctx.fillStyle = k.rgba('red', lampOn);
    ctx.beginPath(); ctx.arc(0, -34, 6, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, -28); ctx.lineTo(0, -20); ctx.stroke();
  },
};

// blacksmith-fx/hammer-strike — örs üzerindeki kızgın demire çekiç darbesi; `at` anında darbe + kıvılcım patlaması. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) örs tablasının ortası (darbe noktası).
export default {
  name: 'hammer-strike', category: 'blacksmith-fx',
  desc: 'Örs üzerinde kızgın demir çubuk; çekiç darbe anında iner, çarpma noktasından kıvılcımlar saçılır',
  tags: ['demirci', 'çekiç', 'örs', 'darbe', 'kıvılcım', 'dövme', 'blacksmith', 'hammer', 'anvil', 'strike', 'spark', 'forge'],
  box: [-130, -110, 130, 110],
  bleed: 50,
  anchor: 'örs tablası merkezi / darbe noktası (0,0); örs tabanı y ~95',
  points: { impact: [0, 0], anvil: [0, 60], hammer: [40, -70] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'çekiç darbesi anı — çekiç iner, kıvılcım patlaması (0.7 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const struck = d >= 0 && d < 0.7;
    const env = struck ? Math.sin(Math.min(d / 0.7, 1) * Math.PI) : 0;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // örs: tabla + gövde + taban
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); k.rrect(-92, 0, 184, 26, 10); ctx.fill();
    blob(-92, 2, 184, 24, 10, body);
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-70, 8, 16, 5, 0, 0, k.TAU); ctx.fill();
    // örs boynu (daralan gövde)
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-38, 26, 76, 44, 8); ctx.fill();
    ctx.fillStyle = body; ctx.beginPath(); k.rrect(-33, 28, 66, 40, 8); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(-20, 62, 66, 10, 5); ctx.fill();
    // taban
    blob(-58, 66, 116, 22, 8, k.rgba('panel2'));

    // kızgın demir çubuk (örs üstünde, nabız gibi parlar)
    const glowPulse = 0.55 + 0.35 * Math.sin(t * k.TAU / 1.6);
    const hot = struck ? 1 : glowPulse;
    k.glow(0, -6, 46, 'red', 0.35 * hot);
    ctx.fillStyle = k.rgba('yellow', 0.25 + 0.55 * hot);
    ctx.beginPath(); k.rrect(-64, -12, 128, 12, 6); ctx.fill();
    ctx.fillStyle = k.rgba('red', 0.85);
    ctx.beginPath(); k.rrect(-64, -12, 128, 5, 6); ctx.fill();

    // çekiç: sap ucundaki pivot etrafında döner; darbe anında hızla iner, hafif sekme
    let ang;
    if (struck) {
      const s = Math.min(d / 0.18, 1);
      const down = 1 - Math.pow(1 - s, 3);
      const rebound = d > 0.18 ? Math.sin((d - 0.18) / 0.5 * Math.PI) * 0.18 : 0;
      ang = k.lerp(-0.62, 0.12, down) - rebound;
    } else {
      ang = -0.62 + Math.sin(t * k.TAU / 2.4) * 0.05;
    }
    ctx.save();
    ctx.translate(58, -78);
    ctx.rotate(ang);
    // sap
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-52, 52); ctx.stroke();
    // çekiç başı (sap ucunda)
    ctx.translate(-58, 58);
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); k.rrect(-34, -16, 68, 32, 10); ctx.fill();
    blob(-34, -16, 68, 32, 10, k.rgba('panel2'));
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-18, -8, 10, 4, 0, 0, k.TAU); ctx.fill();
    // darbe yüzü
    ctx.fillStyle = k.rgba('yellow', 0.3 + 0.6 * env);
    ctx.beginPath(); k.rrect(-38, -13, 8, 26, 3); ctx.fill();
    ctx.restore();

    // kıvılcım patlaması (darbe anı)
    if (struck) {
      for (let i = 0; i < 14; i++) {
        const prog = k.clamp((d - k.hash(i) * 0.15) / 0.55, 0, 1);
        if (prog <= 0) continue;
        const a = k.hash(i + 30) * k.TAU - Math.PI / 2;
        const dist = 18 + prog * (26 + k.hash(i + 50) * 44);
        const sx = Math.cos(a) * dist;
        const sy = Math.sin(a) * dist * 0.7 + prog * prog * 26;
        ctx.strokeStyle = k.rgba('yellow', 0.95 * (1 - prog));
        ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + Math.cos(a) * 9, sy + Math.sin(a) * 9); ctx.stroke();
      }
      // çarpma flaşı
      k.glow(0, -4, 34 + env * 22, 'yellow', 0.55 * env);
    } else {
      // boştayken ara ara tek kıvılcım
      const cyc = (t * 0.5 + 0.3) % 1;
      if (cyc < 0.35) {
        const a = -Math.PI / 2 + (k.hash(7) - 0.5) * 1.6;
        const dist = cyc / 0.35 * 26;
        ctx.strokeStyle = k.rgba('yellow', 0.8 * (1 - cyc / 0.35));
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(Math.cos(a) * dist, Math.sin(a) * dist);
        ctx.lineTo(Math.cos(a) * (dist + 8), Math.sin(a) * (dist + 8)); ctx.stroke();
      }
    }
  },
};

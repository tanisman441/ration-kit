// barbershop-fx/mirror-check — solda aynada yansıyan yüz, sağda arkadan görülen müşteri başı; `at` anında yansıma başını eğer, ayna parlar. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) aynanın merkezi.
export default {
  name: 'mirror-check', category: 'barbershop-fx',
  desc: 'Aynada yansıyan yüz ve arkadan görülen müşteri; kontrol anında yansıma başını eğip ayna parlar',
  tags: ['ayna', 'berber', 'kontrol', 'yansıma', 'saç', 'mirror', 'barber', 'reflection', 'check', 'hair'],
  box: [-145, -120, 145, 95],
  bleed: 35,
  anchor: 'aynanın merkezi (0,0)',
  points: { mirror: [-58, -38], face: [-58, -42], person: [96, -32] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'ayna kontrolü anı — yansıma başını eğer, ayna parlar (1.0 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const frame = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const checking = d >= 0 && d < 1.0;
    const prog = d < 0 ? 0 : k.clamp(d / 1.0, 0, 1);
    const env = checking ? Math.sin(prog * Math.PI) : 0;
    // göz kırpma: ~4 sn'de bir (idle)
    const blinkPhase = (t % 4.2) / 4.2;
    const blink = blinkPhase > 0.96 ? 1 - (blinkPhase - 0.96) / 0.04 : 0;
    const br = Math.sin(t * k.TAU / 2.6) * 1.5; // nefes
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };

    // ayna çerçevesi (sol)
    blob(-118, -108, 120, 170, 26, frame);
    // ayna camı
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-108, -98, 100, 150, 20); ctx.fill();
    // cam parlama çizgisi (sol üst, premium)
    ctx.fillStyle = 'rgba(255,255,255,0.16)';
    ctx.beginPath(); ctx.ellipse(-88, -78, 12, 22, 0.5, 0, k.TAU); ctx.fill();
    // ayna ayağı
    blob(-72, 62, 28, 28, 8, frame);

    // yansıyan yüz: kontrol anında başını yana eğer
    ctx.save();
    ctx.translate(-58, -40);
    ctx.rotate(env * 0.22);
    // yüz
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(0, 0, 33, 31, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); ctx.ellipse(0, 0, 30, 28, 0, 0, k.TAU); ctx.fill();
    // saç (yansıma)
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); ctx.ellipse(0, -16, 30, 16, 0, Math.PI, Math.PI * 2); ctx.fill();
    // gözler (kırpma)
    ctx.fillStyle = inkC;
    const eyeH = 4.5 * (1 - blink * 0.85);
    ctx.beginPath(); ctx.ellipse(-11, -2, 4, Math.max(eyeH, 0.6), 0, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(11, -2, 4, Math.max(eyeH, 0.6), 0, 0, k.TAU); ctx.fill();
    // gülümseme: kontrol anında belirginleşir
    ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(0, 8, 9 + env * 3, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
    ctx.restore();

    // ayna parlaması (kontrol anı): köşede dört kollu yıldız
    if (checking) {
      const sx = -22, sy = -92, r = 6 + env * 12;
      ctx.fillStyle = k.rgba('yellow', 0.85 * env);
      ctx.beginPath();
      ctx.moveTo(sx, sy - r); ctx.quadraticCurveTo(sx + r * 0.18, sy - r * 0.18, sx + r, sy);
      ctx.quadraticCurveTo(sx + r * 0.18, sy + r * 0.18, sx, sy + r);
      ctx.quadraticCurveTo(sx - r * 0.18, sy + r * 0.18, sx - r, sy);
      ctx.quadraticCurveTo(sx - r * 0.18, sy - r * 0.18, sx, sy - r);
      ctx.fill();
    }

    // müşteri: arkadan görülen baş + omuz (sağ) — baş omza bitişik
    const bob = Math.sin(t * k.TAU / 2.6) * 2;
    blob(62, 8 + bob * 0.3, 84, 82, 20, k.rgba('panel2'));
    // boyun (başa bitişik)
    blob(82, -8, 28, 26, 8, k.rgba('dim'));
    disc(96, -34 + bob + br * 0.4 - env * 5, 38, 38, k.rgba('ink'));
    // saç tutamı: başın üstünde küçük kıvrım, kontrol anında zıplar
    const tuft = env * 6;
    ctx.strokeStyle = k.rgba('ink', 0.9); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(88, -68 - tuft); ctx.quadraticCurveTo(96, -80 - tuft, 104, -68 - tuft); ctx.stroke();
  },
};

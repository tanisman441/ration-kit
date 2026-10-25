// archaeology-fx/tomb-open — taş mezar kapağı; `at` anında kapak döner açılır, içinden ışık ve toz çıkar. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) mezar tabanının merkezi.
export default {
  name: 'tomb-open', category: 'archaeology-fx',
  desc: 'Hiyeroglifli taş mezar kapağı menteşeden döner açılır; açılışta içinden altın ışık ve toz bulutu yükselir',
  tags: ['mezar', 'kapak', 'lahit', 'arkeoloji', 'açılış', 'ışık', 'tomb', 'sarcophagus', 'lid', 'archaeology', 'mummy', 'excavation'],
  box: [-130, -150, 130, 110],
  bleed: 55,
  anchor: 'mezar tabanının merkezi (0,0); kapak sol menteşeden açılır',
  points: { lid: [0, -30], hinge: [-88, -34], glow: [0, -6], base: [0, 88] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'açılış anı — kapak döner açılır, ışık + toz yükselir (1.4 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const open = d >= 0 && d < 1.4;
    // kapak açısı: 0→1 (olay sonrası açık kalır)
    const openP = d < 0 ? 0 : Math.min(d / 1.4, 1);
    const ease = 1 - Math.pow(1 - openP, 2);
    const env = open ? Math.sin(Math.min(d / 1.4, 1) * Math.PI) : 0;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // iç ışık (kapak açıldıkça güçlenir)
    const glowA = 0.1 + 0.5 * ease + env * 0.15;
    k.glow(0, -8, 60 + ease * 40, 'yellow', Math.min(glowA, 0.6));
    // ışık hüzmesi (açıktan yukarı)
    if (openP > 0.05) {
      ctx.fillStyle = k.rgba('yellow', 0.16 * ease);
      ctx.beginPath();
      ctx.moveTo(-46, -18); ctx.lineTo(46, -18);
      ctx.lineTo(78, -104); ctx.lineTo(-78, -104);
      ctx.closePath(); ctx.fill();
    }

    // mezar tabanı (alt blok)
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); k.rrect(-108, 6, 216, 82, 18); ctx.fill();
    blob(-108, 6, 216, 82, 18, k.rgba('panel2'));
    // taban süs çizgileri
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-96, 30); ctx.lineTo(96, 30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-96, 58); ctx.lineTo(96, 58); ctx.stroke();
    // iç oyuk (karanlık aralık, kapak açıldıkça görünür)
    ctx.fillStyle = k.rgba('ink', 0.55 * (0.3 + 0.7 * ease));
    ctx.beginPath(); k.rrect(-84, -14, 168, 22, 8); ctx.fill();
    // altın iç parıltı
    ctx.fillStyle = k.rgba('yellow', 0.5 * ease);
    ctx.beginPath(); k.rrect(-70, -10, 140, 6, 3); ctx.fill();
    // gölge (sağ alt)
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(-102, 78, 204, 10, 5); ctx.fill();

    // kapak: sol menteşeden döner açılır
    ctx.save();
    ctx.translate(-88, -20);
    ctx.rotate(-ease * 0.55);
    ctx.translate(88, 20);
    // kapak gövdesi
    blob(-92, -52, 184, 34, 12, k.rgba(p.color));
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-64, -44, 16, 6, -0.1, 0, k.TAU); ctx.fill();
    // hiyeroglifler (göz, kuş, dalga)
    ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 3;
    // göz
    ctx.beginPath(); ctx.ellipse(-52, -35, 10, 5, 0, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = k.rgba('ink', 0.6);
    ctx.beginPath(); ctx.ellipse(-52, -35, 2.5, 2.5, 0, 0, k.TAU); ctx.fill();
    // kuş (basit V kanat)
    ctx.strokeStyle = k.rgba('ink', 0.6);
    ctx.beginPath(); ctx.moveTo(-16, -30); ctx.lineTo(-8, -40); ctx.lineTo(0, -30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-8, -40); ctx.lineTo(-8, -28); ctx.stroke();
    // dalga
    ctx.beginPath(); ctx.moveTo(24, -32); ctx.quadraticCurveTo(32, -42, 40, -32); ctx.quadraticCurveTo(48, -22, 56, -32); ctx.stroke();
    // güneş diski
    ctx.beginPath(); ctx.ellipse(72, -35, 8, 8, 0, 0, k.TAU); ctx.stroke();
    ctx.restore();

    // menteşe topuzu
    ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(-88, -20, 10, 10, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('yellow', 0.9); ctx.beginPath(); ctx.ellipse(-88, -20, 6, 6, 0, 0, k.TAU); ctx.fill();

    // toz + ışık parçacıkları (açılış anı)
    if (open) {
      for (let i = 0; i < 12; i++) {
        const prog = k.clamp((d - k.hash(i) * 0.25) / 0.7, 0, 1);
        if (prog <= 0) continue;
        const dx = (k.hash(i + 20) - 0.5) * 150 * prog;
        const dy = -20 - prog * (40 + k.hash(i + 40) * 50) + prog * prog * 20;
        ctx.fillStyle = k.rgba('dim', 0.55 * (1 - prog * 0.7));
        ctx.beginPath(); ctx.ellipse(dx, dy, 5 + prog * 9 + k.hash(i + 50) * 5, 4 + prog * 6, 0, 0, k.TAU); ctx.fill();
      }
      // yükselen ışık kıvılcımları
      for (let i = 0; i < 6; i++) {
        const prog = k.clamp((d - k.hash(i + 60) * 0.3) / 0.6, 0, 1);
        if (prog <= 0) continue;
        const sx = (k.hash(i + 70) - 0.5) * 90;
        const sy = -20 - prog * 70;
        ctx.fillStyle = k.rgba('yellow', 0.9 * (1 - prog));
        ctx.beginPath(); ctx.ellipse(sx, sy, 3, 3, 0, 0, k.TAU); ctx.fill();
      }
    }

    // boşta: aralıktan sızan hafif ışık nabzı
    const pulse = 0.5 + 0.5 * Math.sin(t * k.TAU / 2.6);
    ctx.fillStyle = k.rgba('yellow', 0.08 + 0.1 * pulse * (1 - ease));
    ctx.beginPath(); ctx.ellipse(0, -12, 70, 8, 0, 0, k.TAU); ctx.fill();
  },
};

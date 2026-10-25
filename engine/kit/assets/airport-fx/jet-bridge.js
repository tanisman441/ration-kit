// airport-fx/jet-bridge — körük terminalden uçağa yanaşır; kenetlenince yeşil ışık yanar. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) körüğün orta noktasıdır, zemin y=85 çizgisindedir.
export default {
  name: 'jet-bridge', category: 'airport-fx',
  desc: 'Yolcu körüğü terminalden uzar, uçağın kapısına kenetlenir; kenetlenince kabindeki yeşil ışık yanar',
  tags: ['körük', 'jet bridge', 'terminal', 'kapı', 'uçağa biniş', 'havalimanı', 'jetbridge', 'boarding', 'gate', 'airport', 'terminal', 'aircraft door'],
  box: [-165, -100, 165, 100],
  bleed: 30,
  anchor: 'körüğün orta noktası (0,0); terminal solda, uçak burnu sağdadır; cabin noktası körüğün geri çekilmiş konumudur',
  points: { door: [105, -30], cabin: [-20, -37], terminal: [-130, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'körük yanaşma anı: körük 0.9 sn içinde uçağa uzanır' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // zemin
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-165, 85); ctx.lineTo(165, 85); ctx.stroke();

    // terminal binası (solda)
    blob(-165, -70, 70, 155, 10, k.rgba('panel2'));
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-150, -60, 14, 5, 0, 0, k.TAU); ctx.fill();
    // terminal pencereleri
    ctx.fillStyle = k.rgba('ink', 0.55);
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 2; c++) {
        ctx.beginPath(); k.rrect(-152 + c * 26, -40 + r * 30, 16, 12, 3); ctx.fill();
      }
    }
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(-130, 70, 30, 10, 5); ctx.fill();

    // uçak burnu (sağda, kısmi)
    ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(145, -30, 48, 30, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2'); ctx.beginPath(); ctx.ellipse(145, -30, 45, 27, 0, 0, k.TAU); ctx.fill();
    // kapı (kenetlenme noktası)
    ctx.fillStyle = k.rgba('ink', 0.6);
    ctx.beginPath(); k.rrect(100, -48, 6, 36, 3); ctx.fill();
    // uçak pencereleri
    ctx.fillStyle = k.rgba('ink', 0.75);
    for (let i = 0; i < 3; i++) {
      ctx.beginPath(); ctx.arc(124 + i * 18, -44, 3.5, 0, k.TAU); ctx.fill();
    }

    // körük uzaması
    const d = p.at == null ? -1 : t - p.at;
    const prog = d < 0 ? 0 : k.clamp(d / 0.9, 0, 1);
    const ease = prog * prog * (3 - 2 * prog);
    const tipX = -20 + ease * 118; // -20 → 98 (kapıya dayanır)
    const sway = (d < 0 ? 1.5 : 0.5) * Math.sin(t * k.TAU / 2.6);
    const bx0 = -95, by = -52 + sway, bh = 30;

    // destek kolonu (körük ortasından zemine)
    const midX = (bx0 + tipX) / 2;
    ctx.strokeStyle = line; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(midX, by + bh); ctx.lineTo(midX, 85); ctx.stroke();
    ctx.strokeStyle = k.rgba('dim'); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(midX, by + bh); ctx.lineTo(midX, 85); ctx.stroke();
    ctx.fillStyle = k.rgba('ink', 0.7);
    ctx.beginPath(); ctx.arc(midX, 85, 6, 0, k.TAU); ctx.fill();

    // körük gövdesi (akordeon)
    blob(bx0, by, tipX - bx0, bh, 8, k.rgba(p.color));
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 2.5;
    for (let x = bx0 + 14; x < tipX - 6; x += 14) {
      ctx.beginPath(); ctx.moveTo(x, by + 4); ctx.lineTo(x, by + bh - 4); ctx.stroke();
    }
    // parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(bx0 + 14, by + 6, 12, 3, 0, 0, k.TAU); ctx.fill();

    // kabin (uç kısım)
    blob(tipX - 6, by - 6, 22, bh + 12, 6, k.rgba('panel2'));
    // durum ışığı: kenetlenince yeşil, öncesinde kırmızı yanıp söner
    const docked = prog >= 0.98;
    const blink = 0.5 + 0.5 * Math.sin(t * k.TAU / 1.4);
    ctx.fillStyle = docked ? k.rgba('green') : k.rgba('red', 0.4 + 0.5 * blink);
    ctx.beginPath(); ctx.arc(tipX + 5, by - 12, 5, 0, k.TAU); ctx.fill();
    if (docked) k.glow(tipX + 5, by - 12, 12, 'green', 0.5);
    ctx.restore();
  },
};

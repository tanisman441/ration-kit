// stage-fx/curtain-open — sahne perdesi.
// at anında iki perde ~0.8 sn'de iki yana toplanır; arkada spot altındaki
// silüet görünür. Boşta perde etekleri hafifçe salınır.
// NOT: canvas y-aşağıdır; (0,0) perdenin üst ortasıdır (valans tepesi).
export default {
  name: 'curtain-open', category: 'stage-fx',
  desc: 'İki yana açılan kırmızı sahne perdesi; at anında sahne görünür',
  tags: ['perde', 'sahne', 'tiyatro', 'açılış', 'gösteri', 'curtain', 'stage', 'theater', 'opening', 'show'],
  box: [-235, -30, 235, 300],
  bleed: 25,
  anchor: 'perdenin üst ortası (0,0)',
  points: { top: [0, 0], center: [0, 170], reveal: [0, 200] },
  params: {
    at: { type: 'time', default: null, desc: 'perdenin iki yana açıldığı an (0.8 sn)' },
    color: { type: 'color', default: 'red', desc: 'perde rengi' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    const d = p.at == null ? -1 : t - p.at;
    const e = d < 0 ? 0 : k.prog(d, 0, 0.8);       // açılma ilerlemesi 0..1
    const open = k.E.inOutCubic(e);
    const sway = Math.sin(t * k.TAU / 3.4) * 5; // boşta etek salınımı

    // ---- arkada görünen sahne (perdeler kapanınca örtülür) ----
    ctx.fillStyle = k.rgba('panel', 0.95);
    k.rrect(-205, 55, 410, 235, 10); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    k.rrect(-205, 55, 410, 235, 10); ctx.stroke();
    // sahne ışığı havuzu + silüet
    const glowA = 0.25 + open * 0.25;
    ctx.fillStyle = k.rgba('yellow', glowA);
    ctx.beginPath(); ctx.ellipse(0, 262, 92, 20, 0, 0, k.TAU); ctx.fill();
    k.glow(0, 175, 70, 'yellow', 0.18 + open * 0.3);
    // silüet sanatçı (basit karakter oranı)
    const silY = 208;
    ctx.fillStyle = k.rgba('ink', 0.85);
    ctx.beginPath(); ctx.arc(0, silY - 46, 20, 0, k.TAU); ctx.fill();      // baş
    k.rrect(-16, silY - 30, 32, 62, 12); ctx.fill();                        // gövde
    ctx.strokeStyle = k.rgba('ink', 0.85); ctx.lineWidth = 11;
    ctx.beginPath(); ctx.moveTo(-12, silY - 22); ctx.lineTo(-46, silY - 44); ctx.stroke(); // kollar açık
    ctx.beginPath(); ctx.moveTo(12, silY - 22); ctx.lineTo(46, silY - 44); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-8, silY + 32); ctx.lineTo(-10, silY + 52); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(8, silY + 32); ctx.lineTo(10, silY + 52); ctx.stroke();

    // ---- perde kanadı çizen yardımcı ----
    const panel = (side) => {   // side: -1 sol, +1 sağ
      ctx.save();
      const pivot = side * 225;
      const px = pivot + side * 30 * open;              // dışa toplanma
      ctx.translate(px, 0);
      ctx.scale(1 - 0.62 * open, 1);                   // pile gibi büzülme
      ctx.translate(-pivot, 0);
      ctx.translate(sway * (1 - open) * side * 0.4, 0);

      const x0 = side < 0 ? -225 : 0;                  // kanadın yerel aralığı
      const x1 = side < 0 ? 0 : 225;
      // ana kumaş
      ctx.fillStyle = k.rgba(acc, 0.95);
      ctx.beginPath();
      ctx.moveTo(x0, 48);
      ctx.lineTo(x1, 48);
      ctx.lineTo(x1, 262);
      // taraklı etek
      const hemN = 5;
      for (let i = 0; i <= hemN; i++) {
        const hx = x1 - (i / hemN) * (x1 - x0);
        const hy = 262 + Math.sin(i * Math.PI) * 16;
        ctx.lineTo(hx, hy);
      }
      ctx.lineTo(x0, 262);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
      ctx.stroke();
      // pileler: dikey koyu/açık şeritler
      for (let i = 0; i < 6; i++) {
        const fx = x0 + (i + 0.5) * ((x1 - x0) / 6);
        ctx.fillStyle = k.rgba('ink', 0.22);
        ctx.fillRect(fx - 5, 48, 10, 200);
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.fillRect(fx + 8, 48, 8, 190);
      }
      // sol üst parlama (ana formda)
      if (side < 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.10)';
        ctx.beginPath(); ctx.ellipse(x0 + 42, 110, 16, 46, -0.25, 0, k.TAU); ctx.fill();
      }
      // açıkken bağ kuşağı (vurgu)
      if (open > 0.75) {
        ctx.fillStyle = k.rgba('yellow', 0.9);
        const bx = side < 0 ? x0 + 26 : x1 - 26;
        k.rrect(bx - 14, 150, 28, 16, 8); ctx.fill();
      }
      ctx.restore();
    };
    panel(-1); panel(1);

    // ---- üst valans (sabit, dalgalı) ----
    ctx.fillStyle = k.rgba(acc, 0.95);
    ctx.beginPath();
    ctx.moveTo(-232, -18);
    ctx.lineTo(232, -18);
    ctx.lineTo(232, 34);
    for (let i = 0; i <= 8; i++) {
      const hx = 232 - (i / 8) * 464;
      ctx.quadraticCurveTo(hx + 29, 78, hx, 40);
    }
    ctx.lineTo(-232, 34);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.stroke();
    ctx.fillStyle = k.rgba('ink', 0.22);              // pile gölgeleri
    for (let i = 0; i < 8; i++) {
      const fx = -232 + (i + 0.5) * 58;
      ctx.fillRect(fx - 6, -18, 12, 44);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.11)';         // sol üst parlama
    ctx.beginPath(); ctx.ellipse(-150, 4, 44, 16, -0.15, 0, k.TAU); ctx.fill();
    // üst çubuk
    ctx.fillStyle = k.rgba('dim', 0.95);
    k.rrect(-235, -30, 470, 16, 6); ctx.fill();

    ctx.restore();
  },
};

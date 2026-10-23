// food-fx-2/blender-mix — stand mikser: çırpıcı speed parametresiyle döner, hamur girdapla karışır; burst anında turbo hız, sıçrama ve sarsıntı.
// NOT: canvas y-aşağıdır; çırpıcı başlıktan aşağı (artı y) sarkar, kase alttadır. blender-swirl'den farklı: kapaklı hazne değil, kollu stand mikser.
export default {
  name: 'blender-mix', category: 'food-fx-2',
  desc: 'Stand mikser: çırpıcı sürekli döner, kasedeki hamur girdap yapar; burst anında turbo hızla hamur sıçrar',
  tags: ['mikser', 'stand mikser', 'çırpıcı', 'hamur', 'karıştırma', 'mutfak', 'stand mixer', 'whisk', 'mixing', 'dough'],
  box: [-155, -195, 155, 155],
  bleed: 50,
  anchor: 'taban merkezi (0,110)',
  points: { base: [0, 110], whisk: [-52, 30], bowl: [-52, 90] },
  params: {
    burst: { type: 'time', default: null, desc: 'turbo anı (0.8 sn): çırpıcı hızlanır, hamur sıçrar, gövde sarsılır' },
    speed: { type: 'number', default: 0.6, desc: 'karıştırma hızı 0–1: çırpıcı ve girdap hızı' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const d = p.burst == null ? -1 : t - p.burst;
    const bursting = d >= 0 && d <= 0.8;
    const g = bursting ? k.prog(d, 0, 0.8) : -1;
    const speed = bursting ? 1 : k.clamp(p.speed ?? 0.6, 0, 1);
    const ph = t * (2.5 + 13 * speed); // çırpıcı fazı

    // --- 1) taban
    ctx.fillStyle = k.rgba('bg', 0.15);
    k.rrect(-114, 96, 244, 44, 14); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    k.rrect(-120, 90, 244, 44, 14); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 7; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-84, 102, 30, 7, -0.12, 0, k.TAU); ctx.fill();

    // --- 2) gövde kolonu (sağda)
    const colPath = () => { k.rrect(52, -118, 62, 208, 18); };
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.save(); ctx.translate(6, 6); colPath(); ctx.fill(); ctx.restore();
    ctx.fillStyle = k.rgba(p.color, 1);
    colPath(); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 7; ctx.stroke();
    // marka bandı (ink detay)
    ctx.fillStyle = k.rgba('ink', 0.4);
    k.rrect(58, -60, 50, 16, 8); ctx.fill();

    // --- 3) başlık (burst'ta sarsılır)
    const shk = bursting ? Math.sin(d * 52) * 3 * (1 - g) : 0;
    ctx.save(); ctx.translate(shk, 0);
    const headPath = () => { k.rrect(-118, -176, 232, 60, 20); };
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.save(); ctx.translate(6, 6); headPath(); ctx.fill(); ctx.restore();
    ctx.fillStyle = k.rgba(p.color, 1);
    headPath(); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 7; ctx.stroke();
    // hız düğmesi + LED
    ctx.fillStyle = k.rgba('ink', 1);
    ctx.beginPath(); ctx.arc(-20, -176, 16, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 5; ctx.stroke();
    ctx.save(); ctx.translate(-20, -176); ctx.rotate(-2.2 + speed * 2.6);
    ctx.strokeStyle = k.rgba('bg', 0.8); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -9); ctx.stroke();
    ctx.restore();
    const ledOn = k.hash(Math.floor(t * (2 + 8 * speed))) > 0.35;
    ctx.fillStyle = k.rgba('yellow', ledOn ? 1 : 0.3);
    ctx.beginPath(); ctx.arc(24, -176, 7, 0, k.TAU); ctx.fill();
    // başlık parlaması
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-84, -162, 26, 8, -0.15, 0, k.TAU); ctx.fill();

    // --- 4) çırpıcı mili + dönen tel kafes (başlıkla birlikte sarsılır)
    const wx = -52;
    ctx.strokeStyle = line; ctx.lineWidth = 12;
    ctx.beginPath(); ctx.moveTo(wx, -118); ctx.lineTo(wx, 6); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink', 1); ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(wx, -118); ctx.lineTo(wx, 6); ctx.stroke();
    // tel ilmekler: faz ile genişleyip daralan elipsler (3B dönüş hissi)
    for (let i = 0; i < 3; i++) {
      const ly = 22 + i * 18;
      const rx = 6 + 20 * Math.abs(Math.cos(ph + i * Math.PI / 3));
      ctx.strokeStyle = line; ctx.lineWidth = 9;
      ctx.beginPath(); ctx.ellipse(wx, ly, rx, 13, 0, 0, k.TAU); ctx.stroke();
      ctx.strokeStyle = k.rgba('ink', 1); ctx.lineWidth = 5.5;
      ctx.beginPath(); ctx.ellipse(wx, ly, rx, 13, 0, 0, k.TAU); ctx.stroke();
    }
    // dönüş bulanıklığı (hızla belirginleşir)
    if (speed > 0.15) {
      ctx.strokeStyle = k.rgba('ink', 0.25 * speed);
      ctx.lineWidth = 4;
      for (let i = 0; i < 2; i++) {
        const a0 = ph * 1.2 + i * Math.PI;
        ctx.beginPath(); ctx.ellipse(wx, 40, 26, 30, 0, a0, a0 + 1.8); ctx.stroke();
      }
    }
    ctx.restore();

    // --- 5) kase + hamur
    const bowlPath = () => {
      ctx.beginPath();
      ctx.moveTo(-108, 48);
      ctx.quadraticCurveTo(-104, 108, wx, 114);
      ctx.quadraticCurveTo(0, 108, 4, 48);
      ctx.closePath();
    };
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.save(); ctx.translate(6, 6); bowlPath(); ctx.fill(); ctx.restore();
    ctx.fillStyle = k.rgba('panel2', 1);
    bowlPath(); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 7; ctx.stroke();
    // hamur (dalgalı yüzey)
    const surf = 56 + Math.sin(t * (3 + 6 * speed)) * 3 * (0.4 + speed) + (bursting ? Math.sin(d * 34) * 4 * (1 - g) : 0);
    ctx.fillStyle = k.rgba('yellow', 1);
    ctx.beginPath();
    ctx.moveTo(-108, 120); ctx.lineTo(-108, surf);
    for (let x = -108; x <= 4; x += 8) ctx.lineTo(x, surf + Math.sin(x * 0.16 + t * (4 + 9 * speed)) * 3.5);
    ctx.lineTo(4, 120); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 5; ctx.stroke();
    // girdap kolları (çırpıcı fazıyla döner)
    for (let i = 0; i < 3; i++) {
      const a = ph * 0.8 + i * (k.TAU / 3);
      ctx.strokeStyle = k.rgba('bg', 0.45); ctx.lineWidth = 7;
      ctx.beginPath(); ctx.ellipse(wx, 82, 34 - i * 8, 10, 0, a, a + 2.0); ctx.stroke();
    }
    // hamur parlaması
    ctx.fillStyle = 'rgba(255,255,255,0.14)';
    ctx.beginPath(); ctx.ellipse(-78, 68, 16, 5, -0.2, 0, k.TAU); ctx.fill();
    // kase dış parlaması
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-84, 88, 9, 14, 0.2, 0, k.TAU); ctx.fill();

    // --- 6) burst: hamur sıçraması + hız çizgileri
    if (bursting) {
      k.glow(wx, 60, 60 * (1 - g) + 20, 'yellow', 0.3 * (1 - g));
      for (let i = 0; i < 10; i++) {
        const dg = k.prog(d - k.hash(i * 5.5 + 2) * 0.25, 0, 0.6);
        if (dg <= 0) continue;
        const side = i % 2 ? 1 : -1;
        const px = wx + side * (30 + 90 * dg);
        const py = 52 - 60 * Math.sin(dg * Math.PI) + dg * 30;
        const fade = 1 - k.prog(dg, 0.65, 1.0);
        if (fade <= 0) continue;
        ctx.fillStyle = k.rgba('yellow', 0.9 * fade);
        ctx.beginPath(); ctx.arc(px, py, 3 + k.hash(i * 2.2 + 6) * 3.5, 0, k.TAU); ctx.fill();
      }
      for (let i = 0; i < 4; i++) {
        const sx = wx + (i % 2 ? 74 : -74) + (i > 1 ? (i % 2 ? 14 : -14) : 0);
        const yy = -40 + (i >> 1) * 46 + ((t * 340) % 36);
        ctx.strokeStyle = k.rgba('ink', 0.5 * (1 - g));
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(sx, yy); ctx.lineTo(sx, yy + 24); ctx.stroke();
      }
    }
    ctx.restore();
  },
};

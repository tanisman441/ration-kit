// school-fx-2/backpack-zip — fermuarlı sırt çantası:
// at anında fermuar çekmesi aşağı kayar (0.5 sn açılma), cepten ışık ve
// parıltılar taşar, 0.6 sn açık kalıp geri kapanır; idle'da hafif salınım.
// canvas y-aşağı; (0,0) çanta gövde merkezi.
export default {
  name: 'backpack-zip', category: 'school-fx-2',
  desc: 'Sırt çantası: at anında fermuar açılır, içinden ışık ve parıltı taşar',
  tags: ['sırt çantası', 'çanta', 'fermuar', 'okul çantası', 'backpack', 'bag', 'zip', 'zipper', 'okul', 'çantası'],
  box: [-100, -112, 100, 112],
  bleed: 18,
  anchor: 'çanta gövde merkezi',
  points: { handle: [0, -104], zipper: [0, 14] },
  params: {
    color: { type: 'color', default: 'accent', desc: 'çanta gövde rengi' },
    at: { type: 'time', default: null, desc: 'fermuarın açılma anı (açıl 0.5 sn + açık 0.6 sn + kapan 0.5 sn)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.at == null ? -1 : t - p.at;

    // açılma miktarı 0..1
    let open = 0;
    if (d >= 0) {
      if (d < 0.4) open = k.prog(d, 0, 0.4);
      else if (d < 0.9) open = 1;
      else if (d < 1.4) open = 1 - k.prog(d, 0.9, 1.4);
    }
    const zipY = 14 + open * 56;   // çekme konumu

    // idle salınım
    ctx.rotate(0.03 * Math.sin(t * 1.6));

    // omuz askıları (arkada)
    ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 13; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-42, -84); ctx.quadraticCurveTo(-52, -108, -30, -112); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(42, -84); ctx.quadraticCurveTo(52, -108, 30, -112); ctx.stroke();
    // üst tutamaç
    ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 9;
    ctx.beginPath(); ctx.arc(0, -92, 15, Math.PI, 0); ctx.stroke();

    // gövde gölge + ana form
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-56, -82, 124, 176, 26); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-68, -94, 124, 176, 26); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath(); k.rrect(-62, -88, 124, 176, 26); ctx.fill();
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-38, -62, 20, 34, 0.25, 0, k.TAU); ctx.fill();
    // alt takviye bandı
    ctx.fillStyle = k.rgba('bg', 0.18);
    ctx.beginPath(); k.rrect(-62, 52, 124, 36, 18); ctx.fill();

    // ön cep
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-45, 3, 90, 76, 18); ctx.fill();
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.beginPath(); k.rrect(-40, 8, 80, 66, 16); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-24, 22, 12, 8, -0.3, 0, k.TAU); ctx.fill();

    // açık ağız: fermuardan aşağı genişleyen koyu V + iç ışık
    if (open > 0.01) {
      const w = 30 * open, yb = 14 + 58 * open;
      ctx.fillStyle = k.rgba('bg', 0.8);
      ctx.beginPath();
      ctx.moveTo(-3, 14); ctx.lineTo(-w, yb); ctx.lineTo(w, yb); ctx.lineTo(3, 14);
      ctx.closePath(); ctx.fill();
      k.glow(0, 14 + 28 * open, 42 * open, 'yellow', 0.5 * open);
      // cep ağzı dudakları
      ctx.strokeStyle = k.rgba('panel2', 1); ctx.lineWidth = 5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-3, 14); ctx.quadraticCurveTo(-w - 4, (14 + yb) / 2, -w, yb); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(3, 14); ctx.quadraticCurveTo(w + 4, (14 + yb) / 2, w, yb); ctx.stroke();
      // parıltılar
      for (let i = 0; i < 12; i++) {
        const h1 = k.hash(i * 17 + 3), h2 = k.hash(i * 31 + 11);
        const dd = d - 0.12 - h1 * 0.45;
        if (dd < 0 || dd > 0.9 || d > 1.1) continue;
        const px = (h1 - 0.5) * 52, py = 30 + h2 * 22 - dd * 60;
        ctx.fillStyle = k.rgba('yellow', 0.9 * (1 - dd / 0.9));
        ctx.beginPath(); ctx.arc(px, py, 1.8 + h2 * 2.6, 0, k.TAU); ctx.fill();
      }
    }

    // fermuar rayı
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 9; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, 12); ctx.lineTo(0, 70); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(0, 12); ctx.lineTo(0, 70); ctx.stroke();
    ctx.setLineDash([]);

    // fermuar çekmesi
    const bounce = open < 0.01 ? 1.5 * Math.sin(t * 3) : 0;
    const py = zipY + bounce;
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-10, py - 3, 20, 26, 7); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 1);
    ctx.beginPath(); k.rrect(-7, py, 14, 20, 6); ctx.fill();
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.beginPath(); ctx.arc(0, py + 10, 3.2, 0, k.TAU); ctx.fill();
    ctx.restore();
  },
};

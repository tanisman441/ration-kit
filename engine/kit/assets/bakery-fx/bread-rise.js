// bakery-fx/bread-rise — kalıptaki ekmek `at` anında kabarır, üstünden buhar yükselir. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) kalıbın üst kenarının merkezidir.
export default {
  name: 'bread-rise', category: 'bakery-fx',
  desc: 'Kalıptaki ekmek hamuru `at` anında kabarır, kubbeleşir ve buhar çıkarır',
  tags: ['ekmek', 'kabarma', 'hamur', 'buhar', 'fırın', 'somun', 'bread', 'rise', 'dough', 'steam', 'bake', 'loaf'],
  box: [-130, -110, 130, 90],
  bleed: 25,
  anchor: 'kalıp üst kenarının merkezi (0,0); ekmek yukarı doğru kabarır',
  points: { loaf: [0, -25], steam: [0, -70], pan: [0, 50] },
  params: {
    color: { type: 'color', default: 'yellow' },
    at: { type: 'time', default: null, desc: 'ekmeğin kabarmaya başlama anı' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const d = p.at == null ? -1 : t - p.at;

    // kabarma ilerlemesi: 0 = düz hamur, 1 = tam kabarmış
    let rise = 0;
    if (d >= 0) rise = k.E.outCubic(Math.min(1, d / 1.2));
    const h = 14 + 44 * rise; // kubbe yüksekliği
    const domeTop = 25 - h;

    // kalıp
    const blob = (x, y, w, h2, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h2 + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h2, r); ctx.fill();
    };
    blob(-105, 25, 210, 55, 12, k.rgba('panel2'));
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-80, 32, 26, 6, 0, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(58, 64, 44, 9, 5); ctx.fill();
    // kalıp kulpları
    for (const px of [-112, 112]) {
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(px, 52, 9, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('dim'); ctx.beginPath(); ctx.arc(px, 52, 6, 0, k.TAU); ctx.fill();
    }

    // ekmek kubbesi
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(-88, 26);
    ctx.quadraticCurveTo(-88, domeTop - 4, 0, domeTop - 4);
    ctx.quadraticCurveTo(88, domeTop - 4, 88, 26);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.moveTo(-83, 25);
    ctx.quadraticCurveTo(-83, domeTop, 0, domeTop);
    ctx.quadraticCurveTo(83, domeTop, 83, 25);
    ctx.closePath(); ctx.fill();
    // kubbe üstü parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-34, domeTop + 8, 26, 6, 0, 0, k.TAU); ctx.fill();
    // kabardıkça beliren kesik çizgileri
    if (rise > 0.25) {
      ctx.strokeStyle = k.rgba('ink', 0.45 * rise); ctx.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        const sx = -34 + i * 34;
        ctx.beginPath(); ctx.moveTo(sx - 9, domeTop + 14); ctx.quadraticCurveTo(sx, domeTop + 22, sx + 9, domeTop + 15); ctx.stroke();
      }
    }

    // buhar: kabarma ilerledikçe belirir, döngüsel yükselir
    const steamA = rise > 0.3 ? 0.5 : 0.12;
    for (let i = 0; i < 3; i++) {
      const wx = -40 + i * 40;
      const ph = (t * 0.5 + i * 0.33) % 1;
      const yTop = domeTop - 8 - ph * 34;
      const alpha = steamA * (1 - ph);
      ctx.strokeStyle = k.rgba('ink', alpha); ctx.lineWidth = 3;
      ctx.beginPath();
      for (let s = 0; s <= 8; s++) {
        const yy = domeTop - 6 + (yTop - domeTop + 6) * (s / 8);
        const xx = wx + 6 * Math.sin(s * 0.9 + t * 2.6 + i * 2);
        s === 0 ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy);
      }
      ctx.stroke();
    }
  },
};

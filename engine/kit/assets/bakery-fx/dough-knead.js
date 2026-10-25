// bakery-fx/dough-knead — tezgahta hamur yoğurma; iki el döngüsel olarak bastırır, hamur yayılıp toplanır. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) tezgah yüzeyinin merkezidir.
export default {
  name: 'dough-knead', category: 'bakery-fx',
  desc: 'Tezgahta hamur yoğrulur; iki el ritmik olarak bastırdıkça hamur yayılır ve toplanır',
  tags: ['hamur', 'yoğurma', 'ekmek', 'fırın', 'pastane', 'el', 'dough', 'knead', 'bread', 'bakery', 'hands', 'flour'],
  box: [-140, -90, 140, 90],
  bleed: 15,
  anchor: 'tezgah yüzeyinin merkezi (0,0); hamur yüzeyde, eller üsttedir',
  points: { dough: [0, 22], handL: [-42, -18], handR: [42, -18] },
  params: {
    color: { type: 'color', default: 'yellow' },
    speed: { type: 'number', default: 1, desc: 'yoğurma hızı çarpanı (1 = ~1.6 sn bir bastırma döngüsü)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const sp = p.speed || 1;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // bastırma döngüsü: 0 = eller yukarı, 1 = tam bastırma
    const press = 0.5 + 0.5 * Math.sin(t * k.TAU / 1.6 * sp - Math.PI / 2);

    // tezgah
    blob(-130, 18, 260, 68, 12, k.rgba('panel2'));
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-96, 26, 30, 7, 0, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(70, 66, 52, 10, 5); ctx.fill();

    // un serpintisi (bastırdıkça belirir)
    ctx.fillStyle = k.rgba('ink', 0.25 + 0.2 * press);
    for (let i = 0; i < 6; i++) {
      const fx = -110 + k.hash(i * 7 + 1) * 220;
      const fy = 26 + k.hash(i * 7 + 2) * 8;
      ctx.beginPath(); ctx.arc(fx, fy, 2.5, 0, k.TAU); ctx.fill();
    }

    // hamur: bastırdıkça yayılır ve incelir
    const rx = 58 + 12 * press, ry = 26 - 7 * press;
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(0, 22, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.ellipse(0, 22, rx, ry, 0, 0, k.TAU); ctx.fill();
    // hamur üstü parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-rx * 0.4, 22 - ry * 0.45, rx * 0.35, ry * 0.3, 0, 0, k.TAU); ctx.fill();
    // hamur kat izleri
    ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-rx * 0.5, 22 + ry * 0.3); ctx.quadraticCurveTo(0, 22 + ry * 0.55, rx * 0.5, 22 + ry * 0.3); ctx.stroke();

    // un bulutları (bastırma anında hamur kenarından yükselir)
    for (let i = 0; i < 3; i++) {
      const px = -rx * 0.9 + i * rx * 0.9;
      const puff = Math.max(0, press - 0.55) / 0.45;
      ctx.fillStyle = k.rgba('ink', 0.3 * puff);
      ctx.beginPath(); ctx.arc(px, 22 - ry - 6 * puff - 4 * i, 3 + 4 * puff, 0, k.TAU); ctx.fill();
    }

    // eller: bastırdıkça aşağı iner
    const handY = -52 + 40 * press;
    const hand = (hx, tilt) => {
      ctx.save(); ctx.translate(hx, handY); ctx.rotate(tilt);
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(-22, -18, 44, 38, 14); ctx.fill();
      ctx.fillStyle = k.rgba('panel2'); ctx.beginPath(); k.rrect(-19, -15, 38, 32, 12); ctx.fill();
      // parmak ayrım çizgileri
      ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(-7, 17); ctx.lineTo(-7, 7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(7, 17); ctx.lineTo(7, 7); ctx.stroke();
      // başparmak çıkıntısı (iç yanda)
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(hx < 0 ? 20 : -20, 2, 8, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('panel2'); ctx.beginPath(); ctx.arc(hx < 0 ? 20 : -20, 2, 5.5, 0, k.TAU); ctx.fill();
      // bilek
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(-10, -38, 20, 22, 7); ctx.fill();
      ctx.fillStyle = k.rgba('dim'); ctx.beginPath(); k.rrect(-7, -35, 14, 20, 5); ctx.fill();
      ctx.restore();
    };
    hand(-42, -0.12); hand(42, 0.12);
  },
};

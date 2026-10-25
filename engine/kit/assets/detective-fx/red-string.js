// detective-fx/red-string — kırmızı ip `at` anında iki ipucu arasında gerilir; sonra hafifçe titreşir. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) panonun merkezidir. Serbest ip çizgisi ink rengiyle çizilir (STYLE.md kuralı), ipin kendisi kırmızı vurgudur.
export default {
  name: 'red-string', category: 'detective-fx',
  desc: 'Soruşturma panosunda iki ipucu notu; `at` anında kırmızı ip birinden diğerine gerilir ve titreşerek oturur',
  tags: ['kırmızı ip', 'ipucu', 'pano', 'bağlantı', 'dedektif', 'soruşturma', 'red string', 'clue', 'board', 'connection', 'detective', 'investigation'],
  box: [-140, -110, 140, 110],
  bleed: 30,
  anchor: 'pano merkezi (0,0); A notu sol üstte, B notu sağ altta',
  points: { pinA: [-75, -35], pinB: [75, 35], string: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'ip gerilme anı — ip A’dan B’ye uzar (0.6 sn), sonra sönümlü titreşim' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // pano
    blob(-130, -95, 260, 190, 12, k.rgba('panel2'));
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-100, -78, 28, 8, 0, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(70, 72, 54, 12, 6); ctx.fill();

    // A notu (sol üst): fotoğraf karesi
    ctx.save();
    ctx.translate(-75, -35);
    ctx.rotate(-0.08);
    blob(-30, -24, 60, 48, 6, k.rgba('panel'));
    // fotoğraf içi: siluet baş + omuz
    ctx.fillStyle = k.rgba('ink', 0.7);
    ctx.beginPath(); ctx.arc(0, -6, 8, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 16, 12, Math.PI, 0); ctx.fill();
    ctx.restore();
    // B notu (sağ alt): belge
    ctx.save();
    ctx.translate(75, 35);
    ctx.rotate(0.06);
    blob(-30, -24, 60, 48, 6, k.rgba('panel'));
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-20, -10); ctx.lineTo(20, -10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(12, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-20, 10); ctx.lineTo(18, 10); ctx.stroke();
    ctx.restore();

    // iğneler (kırmızı başlar)
    const pin = (x, y) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(x, y, 8, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('red', 0.95); ctx.beginPath(); ctx.arc(x, y, 6, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.beginPath(); ctx.arc(x - 2, y - 2, 1.8, 0, k.TAU); ctx.fill();
    };
    pin(-75, -35); pin(75, 35);

    // ip: A'dan B'ye. at'tan önce A'dan aşağı sarkan gevşek ip; at..at+0.6 gerilir; sonra sönümlü titreşim
    const Ax = -75, Ay = -35, Bx = 75, By = 35;
    if (d < 0) {
      // gevşek ip: A iğnesinden aşağı sarkar, hafif salınır
      const swayX = 10 * Math.sin(t * k.TAU / 1.8);
      ctx.strokeStyle = k.rgba('red', 0.85); ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.moveTo(Ax, Ay);
      ctx.quadraticCurveTo(Ax - 8 + swayX, Ay + 22, Ax + 2 + swayX, Ay + 42); ctx.stroke();
      // ip ucu düğümü
      ctx.fillStyle = k.rgba('red', 0.9);
      ctx.beginPath(); ctx.arc(Ax + 2 + swayX, Ay + 42, 3, 0, k.TAU); ctx.fill();
      // B iğnesi beklerken hafifçe parlar
      const pulse = 0.5 + 0.5 * Math.sin(t * k.TAU / 1.5);
      k.glow(Bx, By, 12 + pulse * 4, 'red', 0.12 + 0.12 * pulse);
    } else {
      // gerilme ilerlemesi
      const grow = d < 0.6 ? 1 - Math.pow(1 - d / 0.6, 2) : 1;
      const ex = k.lerp(Ax, Bx, grow), ey = k.lerp(Ay, By, grow);
      // sönümlü titreşim: gerildikten sonra ip orta noktada salınır
      const wob = d >= 0.6 ? Math.sin((d - 0.6) * 9) * 7 * Math.exp(-(d - 0.6) * 2.2) : 0;
      const mx = (Ax + ex) / 2, my = (Ay + ey) / 2;
      const sag = 10 * (1 - grow) + 6 + wob;
      // ipin dik yönü: (Bx-Ax, By-Ay) normalize -> dik (dy, -dx)
      const dx = Bx - Ax, dy = By - Ay, len = Math.hypot(dx, dy);
      const nx = dy / len, ny = -dx / len;
      const cxp = mx + nx * sag, cyp = my + ny * sag;
      ctx.strokeStyle = k.rgba('red', 0.95); ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.moveTo(Ax, Ay);
      ctx.quadraticCurveTo(cxp, cyp, ex, ey); ctx.stroke();
      // gerilme anında uçta küçük kıvılcım/parıltı
      if (d < 0.8) {
        k.glow(ex, ey, 14, 'red', 0.4 * (1 - d / 0.8));
        ctx.fillStyle = k.rgba('red', 0.9);
        ctx.beginPath(); ctx.arc(ex, ey, 3.5, 0, k.TAU); ctx.fill();
      }
      // ip gerildikten sonra orta noktada nabız halkası (bir kez)
      if (d >= 0.6 && d < 1.4) {
        const prog = (d - 0.6) / 0.8;
        ctx.strokeStyle = k.rgba('red', 0.5 * (1 - prog)); ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(mx + nx * 6, my + ny * 6, 8 + prog * 18, 0, k.TAU); ctx.stroke();
      }
    }
  },
};

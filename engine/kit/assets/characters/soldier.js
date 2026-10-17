// characters/soldier — FPS askeri, yandan görünüm; kask + yelek, göğüste tüfek.
// Orijinal tasarım; gerçek ordu/üniforma kopyası değildir.
// NOT: canvas y-aşağıdır; zemin (0,0), yukarı NEGATİF y'dir. Asker sağa bakar.
export default {
  name: 'soldier',
  category: 'characters',
  desc: 'FPS askeri (yandan, sağa bakar); kask, yelek, göğüste tüfek; idle|aim|run',
  tags: ['asker', 'FPS', 'tüfek', 'silah', 'askeri', 'soldier', 'military', 'rifle', 'army', 'shooter'],
  box: [-72, -310, 120, 12],
  bleed: 34,
  anchor: 'ayaklar (0,0); sahne merkezi',
  points: { head: [2, -292], chest: [0, -185], gun: [98, -198] },
  params: {
    color: { type: 'color', default: 'dim' },
    team: { type: 'color', default: 'red', desc: 'takım vurgu rengi (yelek şeridi)' },
    pose: { type: 'enum', values: ['idle', 'aim', 'run'], default: 'idle' },
    hit: { type: 'time', default: null, desc: 'vurulma anı: sarsılma + beyaz flaş' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const teamC = k.rgba(p.team);
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.68))).join(',')})`;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // vurulma: geri tepme + flaş
    const d = p.hit == null ? -1 : t - p.hit;
    const hitK = d >= 0 && d < 0.35 ? Math.sin((d / 0.35) * Math.PI) : 0;
    const knockX = -22 * hitK;
    const br = Math.sin(t * k.TAU / 2.4) * 1.6;

    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };

    ctx.save();
    ctx.translate(knockX, 0);

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -6, 62, 10, 0, 0, k.TAU); ctx.fill();

    const pose = p.pose, lean = pose === 'run' ? 10 : 0;
    const ph = t * 7;

    // bacaklar (yan görünüm: ön/arka)
    const legPose = (front) => {
      if (pose === 'run') {
        const s = Math.sin(ph + (front ? 0 : Math.PI));
        return [front ? 14 + s * 30 : -14 - s * 30, -14 - Math.max(0, Math.cos(ph + (front ? 0 : Math.PI))) * 16];
      }
      return [front ? 16 : -16, -14];
    };
    for (const front of [false, true]) {
      const [fx, fy] = legPose(front);
      limb(front ? 8 : -8, -130, fx, fy - 4, 20, body);
      blob(fx - 13, -13, 28, 13, 6, dark);            // bot
    }

    // gövde + yelek
    const tx = lean * 0.4;
    blob(-30 + tx, -240 - br * 0.4, 60, 112, 26, body);
    blob(-26 + tx, -228 - br * 0.4, 52, 62, 15, dark); // yelek
    blob(-26 + tx, -214 - br * 0.4, 52, 12, 6, teamC); // takım şeridi
    blob(-30 + tx, -138, 60, 14, 7, dark);             // kemer

    // tüfek ofseti poza göre
    const rdx = pose === 'aim' ? 6 : 0, rdy = pose === 'aim' ? -14 : (pose === 'run' ? 8 : 0);
    const gun = (dx, dy) => {
      // dipçik + gövde + namlu (sağa bakar)
      blob(-16 + dx, -199 + dy, 34, 16, 5, dark);
      blob(16 + dx, -201 + dy, 46, 16, 5, dark);
      blob(60 + dx, -198 + dy, 38, 9, 4, dark);
      blob(34 + dx, -186 + dy, 11, 17, 3, dark);      // şarjör
      blob(4 + dx, -186 + dy, 10, 16, 3, dark);       // kabza
      blob(26 + dx, -208 + dy, 10, 8, 3, dark);       // gez
    };

    // kollar: omuz -> dirsek -> el (tüfek üstünde)
    const shoX = 4 + tx, shoY = -208 - br * 0.4;
    const handB = [-2 + rdx, -188 + rdy], handF = [46 + rdx, -191 + rdy];
    limb(shoX, shoY, -6 + rdx, -172 + rdy, 17, body);
    limb(-6 + rdx, -172 + rdy, handB[0], handB[1], 15, body);
    disc(handB[0], handB[1], 9, 9, body);
    limb(shoX + 6, shoY, 30 + rdx, -178 + rdy, 17, body);
    limb(30 + rdx, -178 + rdy, handF[0], handF[1], 15, body);
    disc(handF[0], handF[1], 9, 9, body);
    gun(rdx, rdy);

    // baş + kask
    const hx = 2 + tx + (pose === 'aim' ? 6 : 0), hy = -258 - br * 0.5 + (pose === 'aim' ? 4 : 0);
    disc(hx, hy, 31, 30, body);
    // yüz (yan): tek göz
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.ellipse(hx + 14, hy - 2, 4, 4 * (((t + 1) % 4.2) < 0.12 ? 0.2 : 1), 0, 0, k.TAU); ctx.fill();
    // kask: kubbe + siperlik
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(hx, hy - 6, 38, 34, 0, Math.PI, k.TAU); ctx.fill();
    ctx.fillStyle = dark;
    ctx.beginPath(); ctx.ellipse(hx, hy - 6, 35.5, 31.5, 0, Math.PI, k.TAU); ctx.fill();
    blob(hx - 40, hy - 12, 80, 11, 5, dark);          // siperlik
    // kask parlaması (premium)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(hx - 14, hy - 26, 12, 7, -0.4, 0, k.TAU); ctx.fill();

    ctx.restore();

    // vurulma flaşı
    if (hitK > 0) {
      ctx.fillStyle = `rgba(255,255,255,${(hitK * 0.45).toFixed(3)})`;
      ctx.beginPath(); ctx.ellipse(knockX - 10, -160, 80, 140, 0, 0, k.TAU); ctx.fill();
    }
  },
};

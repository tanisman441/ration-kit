// characters/gamer — kulaklıklı, masada oyun oynayan kişi (yandan görünüm).
// NOT: canvas y-aşağıdır; zemin (0,0), her şey negatif y yönünde yukarı uzar.
export default {
  name: 'gamer',
  category: 'characters',
  desc: 'Kulaklıklı oyuncu; masada monitör başında oturur, active anında tıklar',
  tags: ['oyuncu', 'gamer', 'bilgisayar', 'kulaklık', 'masa', 'gaming', 'player', 'headphones', 'desk'],
  box: [-180, -292, 170, 12],
  bleed: 0,
  anchor: 'zemin (0,0); sahne merkezi',
  points: { screen: [50, -215], head: [-105, -256] },
  params: {
    color: { type: 'color', default: 'dim' },
    active: { type: 'time', default: null, desc: 'tıklama/tepki anı: eller basar, baş sallanır' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const deskC = k.rgba('panel2');
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

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

    // tepki anı: 0.25 sn'lik basma
    const d = p.active == null ? -1 : t - p.active;
    const press = d >= 0 && d < 0.25 ? Math.sin((d / 0.25) * Math.PI) : 0;
    const br = Math.sin(t * k.TAU / 2.4) * 1.5;

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(-10, -5, 165, 10, 0, 0, k.TAU); ctx.fill();

    // sandalye
    blob(-158, -196, 18, 104, 9, deskC);          // sırtlık
    blob(-156, -100, 74, 16, 8, deskC);           // oturak
    limb(-140, -88, -140, -8, 12, deskC);
    limb(-100, -88, -100, -8, 12, deskC);

    // masa
    blob(-150, -118, 300, 18, 6, deskC);          // tabla
    limb(-132, -100, -132, -8, 14, deskC);
    limb(132, -100, 132, -8, 14, deskC);

    // klavye + mouse
    blob(-122, -130, 92, 13, 6, k.rgba('panel'));
    disc(24, -124, 13, 9, k.rgba('panel'));

    // monitör
    blob(38, -118, 44, 10, 5, deskC);             // ayak
    blob(54, -172, 16, 56, 6, deskC);            // boyun
    blob(-16, -262, 148, 94, 10, k.rgba('panel')); // çerçeve
    // ekran içeriği: mini oyun (hareketli hedef + can barı)
    const sx = -8, sy = -254, sw = 132, sh = 78;
    ctx.fillStyle = k.rgba('bg', 0.85);
    ctx.beginPath(); k.rrect(sx, sy, sw, sh, 6); ctx.fill();
    const tx = sx + 20 + ((t * 60) % (sw - 44)), ty = sy + sh / 2 + Math.sin(t * 3) * 12;
    k.glow(tx, ty, 26, 'red', 0.35 + press * 0.4);
    ctx.fillStyle = k.rgba('red');
    ctx.beginPath(); ctx.arc(tx, ty, 9, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('green');
    ctx.beginPath(); k.rrect(sx + 8, sy + 6, (sw - 16) * (0.72 + press * 0.1), 8, 4); ctx.fill();
    // ekran parlaması (premium)
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath();
    ctx.moveTo(sx, sy + sh); ctx.lineTo(sx + 44, sy); ctx.lineTo(sx + 72, sy); ctx.lineTo(sx + 28, sy + sh);
    ctx.closePath(); ctx.fill();

    // oyuncu — oturur, sağa bakar
    const hipX = -115, hipY = -104;
    // bacak: uyluk + baldır + ayak
    limb(hipX, hipY, -62, -100, 20, body);
    limb(-62, -100, -58, -14, 18, body);
    blob(-70, -13, 26, 13, 6, body);
    // gövde
    blob(hipX - 30, -206 - br * 0.4, 60, 106, 26, body);
    // kollar: klavye ve mouse'a uzanır
    const shoX = -112, shoY = -186 - br * 0.4;
    const hLY = -128 + press * 7, hRY = -122 + press * 7;
    limb(shoX, shoY, -88, -152, 17, body);
    limb(-88, -152, -72, hLY, 15, body);
    disc(-70, hLY, 9, 9, body);
    limb(shoX + 8, shoY, -40, -148, 17, body);
    limb(-40, -148, 12, hRY, 15, body);
    disc(14, hRY, 9, 9, body);
    // baş
    const hx = -104, hy = -238 - br * 0.5 - press * 4;
    disc(hx, hy, 31, 30, body);
    // yüz (sağa bakar: gözler sağda)
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.ellipse(hx + 8, hy - 2, 4, 4 * (((t + 2) % 4.2) < 0.12 ? 0.2 : 1), 0, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hx + 20, hy - 2, 4, 4 * (((t + 2) % 4.2) < 0.12 ? 0.2 : 1), 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = inkC; ctx.lineWidth = 3.2;
    ctx.beginPath(); ctx.moveTo(hx + 12, hy + 12); ctx.lineTo(hx + 24, hy + 12); ctx.stroke();
    // kulaklık: bant + yastıklar (vurgu rengi)
    const acc = k.rgba('accent');
    ctx.strokeStyle = line; ctx.lineWidth = 12;
    ctx.beginPath(); ctx.arc(hx, hy - 4, 36, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
    ctx.strokeStyle = acc; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.arc(hx, hy - 4, 36, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
    blob(hx - 40, hy - 18, 15, 32, 7, acc);       // sol yastık
    blob(hx + 25, hy - 18, 15, 32, 7, acc);       // sağ yastık
    // baş parlaması (premium)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(hx - 11, hy - 10, 11, 8, -0.4, 0, k.TAU); ctx.fill();
    // tepki anında küçük "tık" çizgileri
    if (press > 0.3) {
      ctx.strokeStyle = k.rgba('yellow', press); ctx.lineWidth = 3;
      for (const [lx, ly] of [[-70, hLY - 18], [14, hRY - 18]]) {
        ctx.beginPath(); ctx.moveTo(lx - 6, ly); ctx.lineTo(lx + 6, ly); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(lx, ly - 6); ctx.lineTo(lx, ly + 6); ctx.stroke();
      }
    }
  },
};

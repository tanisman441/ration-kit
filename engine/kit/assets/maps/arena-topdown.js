// maps/arena-topdown — üstten görünüm FPS arenası; duvarlar, siper kasaları, iki takım doğuş bölgesi.
// NOT: canvas y-aşağıdır; (0,0) harita merkezidir.
export default {
  name: 'arena-topdown',
  category: 'maps',
  desc: 'Üstten görünüm simetrik FPS arenası; duvarlar, siper kasaları, kırmızı/mavi takım doğuş bölgeleri',
  tags: ['arena', 'harita', 'map', 'topdown', 'kuşbakışı', 'fps haritası', 'savaş arenası', 'game map', 'battle arena', 'spawn'],
  box: [-260, -200, 260, 200],
  bleed: 0,
  anchor: 'harita merkezi',
  points: { spawnA: [-190, -142], spawnB: [190, 142], mid: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'duvar ve siper rengi' },
    highlight: { type: 'enum', values: ['none', 'a', 'b', 'mid'], default: 'none', desc: 'vurgulanan bölge' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const wallC = k.rgba(p.color);
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.72))).join(',')})`;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const block = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const wall = (x, y, w, h) => block(x, y, w, h, 6, wallC);

    // zemin plakası
    block(-250, -190, 500, 380, 26, k.rgba('panel2'));

    // dış duvar halkası
    ctx.fillStyle = wallC;
    ctx.beginPath();
    k.rrect(-250, -190, 500, 380, 26);
    k.rrect(-234, -174, 468, 348, 18);
    ctx.fill('evenodd');
    ctx.strokeStyle = line; ctx.lineWidth = LW; ctx.stroke();

    // iç duvarlar (koridorlar)
    wall(-152, -80, 16, 130);   // sol dikey
    wall(136, -50, 16, 130);    // sağ dikey
    wall(20, -118, 180, 16);    // üst yatay
    wall(-200, 102, 180, 16);   // alt yatay
    wall(-8, -64, 16, 128);     // orta ayırıcı

    // siper kasaları (üstten kare)
    const crateAt = (cx, cy) => {
      block(cx - 17, cy - 17, 34, 34, 8, dark);
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(cx - 7, cy - 8, 9, 6, -0.4, 0, k.TAU); ctx.fill();
    };
    crateAt(-95, -55); crateAt(95, 55); crateAt(-185, 40); crateAt(185, -40);

    // doğuş bölgeleri
    const pulse = 0.5 + 0.5 * Math.sin(t * 2.4);
    const zone = (cx, cy, team, letter, on) => {
      const w = 100, h = 76, x = cx - w / 2, y = cy - h / 2;
      k.glow(cx, cy, 64, team, on ? 0.35 + 0.12 * pulse : 0.10 + 0.05 * pulse);
      ctx.fillStyle = k.rgba(team, 0.22);
      ctx.beginPath(); k.rrect(x, y, w, h, 14); ctx.fill();
      ctx.strokeStyle = k.rgba(team, on ? 1 : 0.7); ctx.lineWidth = 3;
      ctx.beginPath(); k.rrect(x, y, w, h, 14); ctx.stroke();
      ctx.fillStyle = k.rgba(team);
      ctx.beginPath(); ctx.arc(cx, cy, 15, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('bg', 0.9);
      ctx.font = '700 22px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(letter, cx, cy + 1);
    };
    zone(-190, -142, 'red', 'A', p.highlight === 'a');
    zone(190, 142, 'cyan', 'B', p.highlight === 'b');

    // orta işareti
    if (p.highlight === 'mid') k.glow(0, 0, 56, 'accent', 0.4);
    ctx.fillStyle = p.highlight === 'mid' ? k.rgba('accent') : k.rgba('ink', 0.5);
    ctx.beginPath();
    ctx.moveTo(0, -11); ctx.lineTo(11, 0); ctx.lineTo(0, 11); ctx.lineTo(-11, 0);
    ctx.closePath(); ctx.fill();

    // premium parlama (zemin sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-168, -118, 92, 54, -0.3, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};

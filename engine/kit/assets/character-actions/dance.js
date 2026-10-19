// character-actions/dance — dans eden insan figürü. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; ayaklar (0,0), gövde negatif y yönünde yukarı uzar.
export default {
  name: 'dance',
  category: 'character-actions',
  desc: 'Dans eden insan figürü; 4 vuruşluk ritmik kol-bacak hareketi ve süzülen notalar',
  tags: ['dans', 'dans etmek', 'ritim', 'eğlence', 'oynamak', 'dance', 'dancing', 'groove', 'party'],
  box: [-140, -400, 140, 24],
  bleed: 60,
  anchor: 'ayaklar (0,0); 4 vuruşluk döngü (vuruş başına 0.5 sn)',
  points: { head: [0, -276], hand: [70, -270], feet: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'happy' },
    beat: { type: 'time', default: null, desc: 'ritim başlangıç anı; null ise t=0\'dan başlar' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
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

    const P = 0.5; // vuruş süresi (sn)
    const d = t - (p.beat ?? 0);
    const beatT = ((d / P) % 1 + 1) % 1;                    // vuruş içi faz
    const beatN = Math.floor(((d / P) % 4 + 4) % 4);        // 0–3 vuruş sayacı
    const bounce = 10 * (0.5 - 0.5 * Math.cos(2 * Math.PI * beatT)); // her vuruşta çökme
    const sway = 14 * Math.sin(2 * Math.PI * (beatN + beatT) / 4);   // yana salınım

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(sway * 0.5, -6, 54, 10, 0, 0, k.TAU); ctx.fill();

    const hipY = -130 - bounce, shoY = -206 - bounce;

    // bacaklar: vuruşa göre dönüşümlü diz kaldırma
    for (const s of [-1, 1]) {
      const liftSide = (beatN % 2 === 0) === (s < 0);
      const lift = liftSide ? 34 * (0.5 - 0.5 * Math.cos(2 * Math.PI * beatT)) : 0;
      const fx = s * 13 + sway * 0.3, fy = -16 - lift;
      const kx = s * 13 + sway * 0.15 + (lift > 1 ? s * 10 : 0), ky = -72 - lift * 0.55;
      limb(s * 13, hipY, kx, ky, 20, body);
      limb(kx, ky, fx, fy - 6, 17, body);
      blob(fx - 12, fy - 13, 24, 13, 6, body);
    }

    // gövde (yana salınır)
    blob(-31 + sway, -240 - bounce, 62, 112, 28, body);
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(17 + sway, -152 - bounce, 12, 42, 0.1, 0, k.TAU); ctx.fill();

    // kollar: sağ 0–1. vuruşta yukarı, sol 2–3. vuruşta yukarı
    const armCycle = 2 * Math.PI * (beatN + beatT) / 2;
    for (const s of [-1, 1]) {
      const up = Math.max(0, Math.sin(armCycle + (s > 0 ? 0 : Math.PI)));
      const upS = up * up * (3 - 2 * up);
      const hx2 = s * (40 + 34 * upS) + sway * 0.6;
      const hy2 = shoY + 72 - (72 + 96) * upS;
      const ex = s * 29 + sway * 0.3 + s * 10 * upS, ey = shoY + (hy2 - shoY) * 0.5;
      limb(s * 29 + sway * 0.3, shoY, ex, ey, 18, body);
      limb(ex, ey, hx2, hy2, 15, body);
      disc(hx2, hy2, 10, 10, body);
    }

    // baş (vuruşta hafif sallanır)
    const hbx = sway, hby = -250 - bounce + 4 * Math.sin(2 * Math.PI * beatT + 1);
    disc(hbx, hby, 36, 34, body);

    // yüz
    const ey = hby - 2, ex = 10;
    const blink = (t % 4.2) < 0.12 ? 0.2 : 1;
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    for (const s of [-1, 1]) {
      if (p.mood === 'happy') {
        ctx.beginPath(); ctx.arc(s * ex + hbx, ey + 4, 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      } else {
        const r = p.mood === 'surprised' ? 5 : 4;
        ctx.beginPath(); ctx.ellipse(s * ex + hbx, ey, r, r * blink, 0, 0, k.TAU); ctx.fill();
      }
    }
    if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(hbx, hby + 14, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
    else if (p.mood === 'sad') { ctx.beginPath(); ctx.arc(hbx, hby + 20, 10, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    else if (p.mood === 'surprised') { ctx.beginPath(); ctx.ellipse(hbx, hby + 12, 6, 8, 0, 0, k.TAU); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(hbx - 8, hby + 12); ctx.lineTo(hbx + 8, hby + 12); ctx.stroke(); }

    // süzülen nota vurguları (tek vurgu rengi: yellow)
    for (let i = 0; i < 3; i++) {
      const age = ((d / 1.6 + i / 3) % 1 + 1) % 1;
      const nx = 62 + 26 * Math.sin(age * 6 + i * 2.1);
      const ny = -296 - age * 84;
      const na = 0.85 * (1 - age);
      ctx.fillStyle = k.rgba('yellow', na);
      ctx.strokeStyle = k.rgba('yellow', na); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.ellipse(nx, ny, 7, 5.5, -0.3, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(nx + 6, ny - 2); ctx.lineTo(nx + 6, ny - 26); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(nx + 6, ny - 26); ctx.lineTo(nx + 14, ny - 21); ctx.stroke();
    }

    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(hbx - 13, hby - 12, 13, 9, -0.4, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-15 + sway, -214 - bounce, 9, 24, 0.12, 0, k.TAU); ctx.fill();
  },
};

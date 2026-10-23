// spell-casting/fireball-cast — uçan ateş topu: kor küre + arkada alev dili
// kuyruk. Idle: alevler noise ile dalgalanır, küre hafif nabız atar, kor
// parçacıkları geriye sürüklenir. `at` anında: 0.15 sn beyaz flaş + küre geriye
// tepme (0.25 sn) + patlayan kıvılcımlar.
// NOT: canvas y-aşağıdır; (0,0) ateş topunun merkezidir, uçuş yönü +x'tir.
export default {
  name: 'fireball-cast', category: 'spell-casting',
  desc: 'Uçan ateş topu; at anında geri tepme + kıvılcım patlamasıyla fırlar, idle\'da alevleri dalgalanır',
  tags: ['ateş', 'alev', 'ateş topu', 'büyü', 'fırlatma', 'fireball', 'fire', 'flame', 'cast', 'spell'],
  box: [-150, -95, 150, 95],
  bleed: 55,
  anchor: 'ateş topunun merkezi (0,0); uçuş yönü +x',
  points: { launch: [0, 0], centre: [0, 0], tail: [-120, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'fırlatma anı (geri tepme 0.25 sn + kıvılcım patlaması)' },
    color: { type: 'color', default: 'red', desc: 'ateş rengi' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    const d = p.at == null ? -1 : t - p.at;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const cast = d >= 0 && d < 0.15;             // flaş penceresi
    const boost = cast ? 1 - d / 0.15 : 0;
    const recoil = d >= 0 && d < 0.25 ? (1 - d / 0.25) * -22 : 0; // geriye tepme (x'te)
    const ox = recoil;

    // Idle nabız: küre ±4 birim (1.6 sn periyot)
    const pulse = Math.sin(t * k.TAU / 1.6) * 3;
    const R = 34 + pulse;

    // Dış hale: kürenin arkasında
    k.glow(ox, 0, 95, acc, 0.28 + boost * 0.3);
    if (cast) k.glow(ox, 0, 130, 'yellow', 0.5 * boost);

    // Alev kuyruğu: -x yönünde 7 dil (noise ile dalgalanır), kuyruk geriye sönümlenir
    for (let i = 0; i < 7; i++) {
      const frac = i / 6;                            // 0 = küre dibi, 1 = kuyruk ucu
      const tx = ox - R * 0.7 - frac * 105;
      const wob = k.noise1(i * 31.7 + t * 7) * 16 * (0.4 + frac);
      const ty = k.noise1(i * 51.3 + t * 5 + 9) * 12;
      const w = (1 - frac) * 22 + 5;
      const hot = i % 2 === 0;
      ctx.fillStyle = hot ? k.rgba('yellow', 0.85 - frac * 0.55) : k.rgba(acc, 0.8 - frac * 0.5);
      ctx.beginPath();
      ctx.ellipse(tx, ty + wob, w, w * 0.55, wob * 0.02, 0, k.TAU);
      ctx.fill();
    }

    // Gölge: sağ alta %12 koyultma (küre formu)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(ox + 6, 6, R, R * 0.96, 0, 0, k.TAU); ctx.fill();

    // Ana kor küre: dış kırmızı → iç turuncu → çekirdek sarı
    ctx.fillStyle = k.rgba(acc, 1);
    ctx.beginPath(); ctx.arc(ox, 0, R, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5; ctx.stroke();
    ctx.fillStyle = k.rgba('yellow', 0.9);
    ctx.beginPath(); ctx.arc(ox, 0, R * 0.62, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.beginPath(); ctx.arc(ox + R * 0.08, -R * 0.08, R * 0.3, 0, k.TAU); ctx.fill();
    if (cast) { // flaş anında beyaz çekirdek
      ctx.fillStyle = 'rgba(255,255,255,' + (0.95 * boost).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(ox, 0, R * (0.8 + 0.3 * boost), 0, k.TAU); ctx.fill();
    }

    // Premium parlama: sol üst beyaz elips, alfa 0.10
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(ox - R * 0.34, -R * 0.42, R * 0.42, R * 0.24, -0.5, 0, k.TAU); ctx.fill();

    // Yüzey alev dilleri: küre etrafında 5 küçük dil, noise ile kıpırdar
    for (let i = 0; i < 5; i++) {
      const a = i / 5 * k.TAU + k.noise1(i * 11.1 + t * 4) * 0.5;
      const fl = R * (0.9 + k.noise1(i * 23.7 + t * 9) * 0.35);
      const fx = ox + Math.cos(a) * fl, fy = Math.sin(a) * fl;
      ctx.fillStyle = i % 2 ? k.rgba('yellow', 0.85) : k.rgba(acc, 0.85);
      ctx.beginPath(); ctx.ellipse(fx, fy, 9, 6, a, 0, k.TAU); ctx.fill();
    }

    // Sürüklenen kor parçacıkları (idle, her zaman): geriye akar, söner
    for (let i = 0; i < 6; i++) {
      const cyc = ((t * 0.5 + k.hash(i * 41.3)) % 1);          // 2 sn döngü
      const px = ox - R - cyc * 110;
      const py = (k.hash(i * 17.9) - 0.5) * 70 + k.noise1(i * 7.7 + t * 6) * 8;
      ctx.fillStyle = k.rgba('yellow', (1 - cyc) * 0.75);
      ctx.beginPath(); ctx.arc(px, py, 4 * (1 - cyc) + 1, 0, k.TAU); ctx.fill();
    }

    // at anı: geriye fışkıran kıvılcım patlaması (0.5 sn)
    if (d >= 0 && d < 0.5) {
      const pr = d / 0.5;
      for (let i = 0; i < 10; i++) {
        const h = k.hash(i * 63.7 + 5);
        const ang = Math.PI + (h - 0.5) * 1.6;                 // geriye dağıl
        const dist = pr * (40 + h * 70);
        const sx = ox + Math.cos(ang) * dist, sy = Math.sin(ang) * dist * 0.8;
        ctx.fillStyle = k.rgba('yellow', (1 - pr) * 0.95);
        ctx.beginPath(); ctx.arc(sx, sy, 5 * (1 - pr) + 1.5, 0, k.TAU); ctx.fill();
      }
      k.glow(ox - 30, 0, 50 * pr + 20, acc, (1 - pr) * 0.45);
    }

    ctx.restore();
  },
};

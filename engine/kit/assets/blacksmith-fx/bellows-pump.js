// blacksmith-fx/bellows-pump — demirci körüğü; döngüsel olarak açılıp kapanır, ağızdan hava akımı üflenir. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) körük gövdesinin merkezi, hava sağa doğru üflenir.
export default {
  name: 'bellows-pump', category: 'blacksmith-fx',
  desc: 'Ahşap demirci körüğü; düzenli aralıklarla açılıp kapanır, ağzından hava akımı ve kıvılcım tozları üflenir',
  tags: ['körük', 'demirci', 'hava', 'üfleme', 'pompalama', 'bellows', 'blacksmith', 'air', 'forge', 'pump'],
  box: [-130, -90, 130, 90],
  bleed: 45,
  anchor: 'körük gövdesi merkezi (0,0); hava akımı sağa',
  points: { nozzle: [118, 0], hinge: [-95, 0], handle: [-70, -52] },
  params: {
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    // pompalama döngüsü: 1.4 sn periyot; kapanışta hava üflenir
    const cyc = (t / 1.4) % 1;
    const open = 0.5 + 0.5 * Math.sin(cyc * k.TAU - Math.PI / 2); // 0 kapalı, 1 açık
    const blow = Math.max(0, Math.sin(cyc * k.TAU)); // kapanırken güçlü üfleme
    const gap = 8 + open * 26; // iki tahta arası açıklık

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // menteşe (sol uç)
    ctx.fillStyle = k.rgba('ink', 0.8);
    ctx.beginPath(); ctx.ellipse(-98, 0, 9, 9, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.ellipse(-98, 0, 4, 4, 0, 0, k.TAU); ctx.fill();

    // deri körük kısmı (açılıp kapanan katmanlar)
    ctx.save();
    ctx.translate(-88, 0);
    for (let i = 0; i < 3; i++) {
      const fx = i * 26;
      const fy = gap * (0.4 + i * 0.3);
      ctx.fillStyle = k.rgba('red', 0.55);
      ctx.beginPath(); ctx.moveTo(fx, -fy); ctx.lineTo(fx + 22, -fy * 0.6); ctx.lineTo(fx + 22, fy * 0.6); ctx.lineTo(fx, fy); ctx.closePath(); ctx.fill();
    }
    ctx.restore();

    // üst tahta (menteşe etrafında döner)
    ctx.save();
    ctx.translate(-96, 0);
    ctx.rotate(-0.10 - open * 0.16);
    blob(0, -52, 168, 30, 12, body);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(30, -44, 22, 6, 0, 0, k.TAU); ctx.fill();
    // tutamak
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(14, -52); ctx.lineTo(14, -72); ctx.stroke();
    ctx.restore();

    // alt tahta
    ctx.save();
    ctx.translate(-96, 0);
    ctx.rotate(0.10 + open * 0.16);
    blob(0, 22, 168, 30, 12, k.rgba('panel2'));
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(10, 46, 150, 6, 3); ctx.fill();
    ctx.restore();

    // ağızlık (nozzle) — tahta uçlarından başlayıp daralan koni, boşluk bırakmaz
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.moveTo(60, -20); ctx.lineTo(124, -11); ctx.lineTo(124, 11); ctx.lineTo(60, 20); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); ctx.moveTo(64, -16); ctx.lineTo(120, -8); ctx.lineTo(120, 8); ctx.lineTo(64, 16); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.4);
    ctx.beginPath(); ctx.ellipse(122, 0, 4, 9, 0, 0, k.TAU); ctx.fill();

    // hava akımı: üfleme güçlüyken belirgin çizgiler sağa akar
    if (blow > 0.05) {
      for (let i = 0; i < 4; i++) {
        const yOff = -18 + i * 12 + k.noise1(t * 3 + i * 7) * 4;
        const x0 = 124;
        const len = 16 + blow * 26 + k.hash(i + 20) * 8;
        const dash = (t * 260 + i * 34) % 30;
        ctx.strokeStyle = k.rgba('cyan', 0.75 * blow);
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(x0 + dash * 0.4, yOff); ctx.lineTo(x0 + len - dash * 0.4, yOff); ctx.stroke();
      }
      // kıvılcım tozları hava ile sürüklenir
      for (let i = 0; i < 5; i++) {
        const prog = (t * 0.9 + k.hash(i + 60)) % 1;
        const px = 124 + prog * (30 + k.hash(i + 70) * 12);
        const py = -14 + k.hash(i + 90) * 28 + Math.sin(prog * 9 + i) * 4;
        ctx.fillStyle = k.rgba('yellow', 0.9 * blow * (1 - prog));
        ctx.beginPath(); ctx.ellipse(px, py, 3.5, 3.5, 0, 0, k.TAU); ctx.fill();
      }
    }
  },
};

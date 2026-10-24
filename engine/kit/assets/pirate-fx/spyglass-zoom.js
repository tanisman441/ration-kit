// pirate-fx/spyglass-zoom — Pirinç dürbün: zoom 0–1 arttıkça iç borular uzar,
// mercek halkaları genişler, görüş dairesi büyür; mercek boşta hafifçe parlar.
// NOT: canvas y-aşağıdır; (0,0) dürbün gövde merkezidir.
export default {
  name: 'spyglass-zoom', category: 'pirate-fx',
  desc: 'Pirinç dürbün: zoom yükseldikçe boru uzar, mercek halkaları ve görüş dairesi genişler; mercek parlıyor',
  tags: ['dürbün', 'teleskop', 'korsan', 'zoom', 'mercek', 'gözlem', 'pirinç', 'spyglass', 'telescope', 'pirate', 'zoom', 'lens', 'brass'],
  box: [-145, -90, 200, 90],
  bleed: 30,
  anchor: 'dürbün gövde merkezi',
  points: { lens: [86, 0], eyepiece: [-128, 0] },
  params: {
    color: { type: 'color', default: 'yellow', desc: 'pirinç gövde rengi (tek vurgu)' },
    zoom: { type: 'number', default: 0.5, desc: 'büyütme 0–1: boru uzar, halkalar ve görüş dairesi büyür' },
  },
  draw(ctx, t, p, k) {
    const z = k.clamp(p.zoom ?? 0.5, 0, 1);
    const ext = z * 40;                       // iç boru uzaması
    const hx = 40 + ext;                      // objektif yuvası x
    const lensX = hx + 24;                    // mercek merkezi
    const bob = 2 * Math.sin(t * 1.7);        // boşta hafif salınım
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.translate(0, bob);

    // göz merceği (sol)
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-134 - LW / 2, -20 - LW / 2, 18 + LW, 40 + LW, 7); ctx.fill();
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); k.rrect(-134, -20, 18, 40, 7); ctx.fill();
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-119 - LW / 2, -16 - LW / 2, 38 + LW, 32 + LW, 8); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-119, -16, 38, 32, 8); ctx.fill();

    // ana boru (pirinç)
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-86 - LW / 2, -20 - LW / 2, 82 + LW, 40 + LW, 14); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-86, -20, 82, 40, 14); ctx.fill();
    // yiv çizgileri
    ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 3;
    for (const gx of [-64, -44]) {
      ctx.beginPath(); ctx.moveTo(gx, -16); ctx.lineTo(gx, 16); ctx.stroke();
    }
    // premium parlama: sol üst
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); k.rrect(-80, -15, 12, 26, 6); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(-24, -2, 18, 20, 8); ctx.fill();

    // iç boru: ana borudan objektif yuvasına uzanır (zoom ile gerilir)
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-14 - LW / 2, -17 - LW / 2, (hx + 20 + 14) + LW, 34 + LW, 10); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-14, -17, hx + 20 + 14, 34, 10); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); k.rrect(-9, -12, 11, 22, 5); ctx.fill();

    // objektif yuvası
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(hx - LW / 2, -24 - LW / 2, 38 + LW, 48 + LW, 12); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(hx, -24, 38, 48, 12); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); k.rrect(hx + 5, -18, 10, 32, 5); ctx.fill();

    // mercek (zoom ile büyür)
    const lr = 13 + z * 8;
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(lensX, 0, lr + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.arc(lensX, 0, lr, 0, k.TAU); ctx.fill();
    // mercek parlaması: boşta döngülü
    const cyc = t % 2.8;
    const glint = cyc < 0.25 ? (1 - cyc / 0.25) : 0;
    ctx.fillStyle = 'rgba(255,255,255,' + (0.25 + 0.6 * glint).toFixed(3) + ')';
    ctx.beginPath();
    ctx.ellipse(lensX - lr * 0.35, -lr * 0.35, lr * 0.34, lr * 0.2, -0.6, 0, k.TAU);
    ctx.fill();

    // genişleyen mercek halkaları
    for (let i = 0; i < 3; i++) {
      const r = 18 + i * 11 + z * 13;
      ctx.strokeStyle = k.rgba(p.color, 0.5 - i * 0.12);
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(lensX, 0, r, 0, k.TAU); ctx.stroke();
    }
    // görüş dairesi: en dış halka + nişangâh çizgileri
    const vr = 44 + z * 24;
    ctx.strokeStyle = k.rgba(p.color, 0.38);
    ctx.lineWidth = 3;
    ctx.setLineDash([9, 7]);
    ctx.beginPath(); ctx.arc(lensX, 0, vr, 0, k.TAU); ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = k.rgba('ink', 0.55); ctx.lineWidth = 3;
    for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
      ctx.beginPath();
      ctx.moveTo(lensX + dx * (vr - 12), dy * (vr - 12));
      ctx.lineTo(lensX + dx * (vr + 4), dy * (vr + 4));
      ctx.stroke();
    }
    ctx.restore();
  },
};

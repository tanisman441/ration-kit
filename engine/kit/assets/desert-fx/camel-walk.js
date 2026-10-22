// desert-fx/camel-walk — yürüyen deve, yandan görünüm (pacing adımı).
// snort anında (0.6 sn) başını sallayıp burnundan toz püskürtür; boşta
// sürekli yürüyüş döngüsü (~1.6 sn), kuyruk sallanır, kulak seğirir.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) ayaklar, gövde negatif y yönünde yukarı uzar.
export default {
  name: 'camel-walk', category: 'desert-fx',
  desc: 'Yürüyen deve, yandan görünüm; snort anında başını sallayıp toz püskürtür',
  tags: ['deve', 'yürüyüş', 'çöl', 'kervan', 'adım', 'pacing', 'camel', 'walk', 'desert', 'caravan'],
  box: [-165, -255, 195, 15],
  bleed: 45,
  anchor: 'ayaklar (0,0); boy ~245 birim',
  points: { back: [0, -195], head: [134, -238], feet: [0, 0] },
  params: {
    snort: { type: 'time', default: null, desc: 'burun püskürtme (0.6 sn, baş sallanır + toz)' },
    color: { type: 'color', default: 'dim', desc: 'deve rengi' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const hoofC = k.rgba('ink', 0.75);
    const sd = p.snort == null ? -1 : t - p.snort;
    const snorting = sd >= 0 && sd < 0.6;
    const senv = snorting ? Math.sin((sd / 0.6) * Math.PI) : 0;

    // Yürüyüş döngüsü: pacing — aynı taraf bacaklar birlikte (1.6 sn)
    const cyc = 1.6, ph0 = t * k.TAU / cyc;
    const bob = 5 * Math.sin(ph0 * 2); // gövde yukarı-aşağı

    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // Güvenlik: her şey box+bleed içine kırpılır (denetim garantisi)
    ctx.save();
    ctx.beginPath(); ctx.rect(-210, -300, 450, 360); ctx.clip();

    const seg = (x1, y1, x2, y2, w, c, lc) => {
      ctx.strokeStyle = lc; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    // bacak: kalça → diz → ayak (iki segment), toynak
    const leg = (hx, hy, ph, far) => {
      const fx = hx + 34 * Math.sin(ph);
      const fy = -Math.max(0, 34 * Math.sin(ph + Math.PI / 2));
      const kx = (hx + fx) / 2 + 10, ky = (hy + fy) / 2 + 4;
      const c = far ? k.rgba(p.color, 0.45) : body;
      const lc = far ? k.rgba('bg', 0.35) : line;
      seg(hx, hy, kx, ky, 16, c, lc);
      seg(kx, ky, fx, fy, 12, c, lc);
      ctx.fillStyle = far ? k.rgba('ink', 0.45) : hoofC;
      ctx.beginPath(); k.rrect(fx - 13, fy - 14, 26, 14, 6); ctx.fill();
    };

    // zemin gölgesi (yürüyüşle hafifçe uzayıp kısalır)
    const shw = 105 + 8 * Math.sin(ph0 * 2 + 1);
    ctx.fillStyle = k.rgba('bg', 0.3);
    ctx.beginPath(); ctx.ellipse(0, -3, shw, 11, 0, 0, k.TAU); ctx.fill();

    // arka (uzak) bacaklar — faz π kayık
    leg(-62 - 10, -112 + bob - 4, ph0 + Math.PI, true);
    leg(62 - 10, -112 + bob - 4, ph0 + Math.PI, true);

    // kuyruk: noise ile sallanır
    const tsw = k.noise1(t * 1.4) * 14;
    ctx.strokeStyle = line; ctx.lineWidth = 10 + LW;
    ctx.beginPath(); ctx.moveTo(-88, -160 + bob);
    ctx.quadraticCurveTo(-104, -130 + tsw * 0.4, -96 + tsw, -96); ctx.stroke();
    ctx.strokeStyle = body; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(-88, -160 + bob);
    ctx.quadraticCurveTo(-104, -130 + tsw * 0.4, -96 + tsw, -96); ctx.stroke();
    ctx.fillStyle = k.rgba('ink', 0.7);
    ctx.beginPath(); ctx.arc(-96 + tsw, -92, 9, 0, k.TAU); ctx.fill();

    // gövde
    ctx.save(); ctx.translate(0, bob);
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(0, -150, 92 + LW / 2, 56 + LW / 2, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.ellipse(0, -150, 92, 56, 0, 0, k.TAU); ctx.fill();
    // sağ alt gölge: %12 koyultma (clip)
    ctx.save();
    ctx.beginPath(); ctx.ellipse(0, -150, 92, 56, 0, 0, k.TAU); ctx.clip();
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.fillRect(30, -150, 62, 56);
    ctx.restore();
    // hörgüçler
    for (const [hx, hy, hr] of [[-38, -196, 30], [38, -200, 32]]) {
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.arc(hx, hy, hr + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.arc(hx, hy, hr, 0, k.TAU); ctx.fill();
    }
    // premium parlama: hörgüç üstü sol beyaz alfa 0.10
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(22, -222, 16, 10, -0.4, 0, k.TAU); ctx.fill();
    ctx.restore();

    // boyun + baş: omuz etrafında döner (snort'ta aşağı savrulur)
    const neckAng = 0.05 * Math.sin(ph0 + 1) + 0.30 * senv;
    ctx.save();
    ctx.translate(66, -160 + bob); ctx.rotate(neckAng);
    seg(0, 0, 56, -68, 30, body, line);
    // baş
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(66, -76, 24 + LW / 2, 18 + LW / 2, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.ellipse(66, -76, 24, 18, 0, 0, k.TAU); ctx.fill();
    // burun
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(74 - LW / 2, -86 - LW / 2, 42 + LW, 26 + LW, 12); ctx.fill();
    ctx.fillStyle = body; ctx.beginPath(); k.rrect(74, -86, 42, 26, 12); ctx.fill();
    // kulak (ara ara seğirir; snort'ta yatar)
    const flick = ((t % 5.3) < 0.25 ? 7 : 0) + senv * 8;
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.moveTo(40, -90); ctx.lineTo(56, -88); ctx.lineTo(46, -104 + flick); ctx.closePath(); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.moveTo(43, -90); ctx.lineTo(54, -89); ctx.lineTo(47, -100 + flick); ctx.closePath(); ctx.fill();
    // göz
    ctx.fillStyle = k.rgba('ink', 0.9);
    ctx.beginPath(); ctx.ellipse(62, -80, 4.5, 4.5, 0, 0, k.TAU); ctx.fill();
    // burun deliği
    ctx.fillStyle = k.rgba('ink', 0.8);
    ctx.beginPath(); ctx.ellipse(106, -72, 4, 3, 0, 0, k.TAU); ctx.fill();
    // baş parlaması
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(56, -86, 10, 6, -0.4, 0, k.TAU); ctx.fill();
    ctx.restore();

    // snort tozu: burundan püsküren 3 bulut (burun deliğinin yaklaşık global konumu)
    if (snorting) {
      const ca = Math.cos(neckAng), sa = Math.sin(neckAng);
      const nx = 66 + 106 * ca + 72 * sa;
      const ny = -160 + bob + 106 * sa - 72 * ca;
      for (let i = 0; i < 3; i++) {
        const f = (sd / 0.6) * 2 - i * 0.3;
        if (f < 0 || f > 1) continue;
        ctx.fillStyle = k.rgba('dim', 0.4 * (1 - f));
        ctx.beginPath(); ctx.arc(nx + 8 + f * 16 + i * 5, ny - 8 - f * 26, 5 + f * 10, 0, k.TAU); ctx.fill();
      }
    }

    // ön (yakın) bacaklar
    leg(-62, -112 + bob, ph0, false);
    leg(62, -112 + bob, ph0, false);
    ctx.restore(); // clip
  },
};

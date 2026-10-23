// retail-fx/bag-pack — alışveriş poşeti; `at` anında ürün üstten düşüp poşete girer, poşet esner.
// NOT: canvas y-aşağıdır. Idle: poşette hafif sallanma (~2.6 sn); at olayı ~1.2 sn sürer.
export default {
  name: 'bag-pack', category: 'retail-fx',
  desc: 'Açık alışveriş poşeti; düşen ürün poşete girince poşet esner ve toz çizgileri çıkar',
  tags: ['poşet', 'çanta', 'paketleme', 'kasa', 'alışveriş', 'market', 'bag', 'pack', 'shopping', 'checkout', 'paper bag'],
  box: [-130, -145, 130, 130],
  bleed: 70,
  anchor: 'poşetin merkezi (0,50); ağız üstte (0,-10)',
  points: { mouth: [0, -10], top: [0, -52] },
  params: {
    color: { type: 'color', default: 'green' },
    at: { type: 'time', default: null, desc: 'ürün poşete düşme anı: düşüş (0.35 sn) + poşet esnemesi (~1.2 sn)' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;

    // poşet esnemesi: ürün girince yassılaşıp toparlanır
    const squash = d >= 0.35 ? Math.exp(-5 * (d - 0.35)) * Math.cos(14 * (d - 0.35)) * 0.10 : 0;
    const sway = 0.03 * Math.sin(t * k.TAU / 2.6);

    // ürün: d<0 iken üstte süzülür; 0–0.35'te poşete düşer; sonra ağızdan ucu görünür
    const fallY = -132;
    const restY = -34; // ürünün üst kenarı (ağzın üstünde kalır)
    let py;
    let dropping = false;
    if (d < 0) {
      py = fallY + 6 * Math.sin(t * k.TAU / 1.8);
    } else if (d < 0.35) {
      dropping = true;
      py = k.lerp(fallY, restY, k.E.inCubic(k.prog(d, 0, 0.35)));
    } else {
      py = restY + 4 * Math.exp(-6 * (d - 0.35)) * Math.cos(16 * (d - 0.35));
    }
    const pw = 58, ph = 48;

    const drawProduct = () => {
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(-pw / 2, py, pw, ph, 8); ctx.fill();
      ctx.fillStyle = k.rgba(p.color);
      ctx.beginPath(); k.rrect(-pw / 2 + 5, py + 5, pw - 10, ph - 10, 6); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-pw / 2 + 16, py + 15, 9, 4, -0.3, 0, k.TAU); ctx.fill();
      // bant çizgisi
      ctx.fillStyle = k.rgba('ink', 0.55);
      ctx.fillRect(-8, py + 5, 16, ph - 10);
    };

    ctx.save();
    ctx.translate(0, 50); ctx.scale(1 + squash, 1 - squash); ctx.rotate(sway); ctx.translate(0, -50);

    // poşet arka duvarı
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-74, -18, 148, 132, 12); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-66, -12, 132, 118, 9); ctx.fill();

    drawProduct();

    // poşet ön duvarı (ürünün alt kısmını kapatır)
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(-74, -10); ctx.lineTo(74, -10); ctx.lineTo(58, 112); ctx.lineTo(-58, 112);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath();
    ctx.moveTo(-64, -2); ctx.lineTo(64, -2); ctx.lineTo(50, 104); ctx.lineTo(-50, 104);
    ctx.closePath(); ctx.fill();
    // sol üst parlama (ön duvarda)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-38, 34, 22, 9, -0.4, 0, k.TAU); ctx.fill();
    // sağ alt gölge tonu
    ctx.fillStyle = 'rgba(0,0,0,0.10)';
    ctx.beginPath();
    ctx.moveTo(20, 96); ctx.lineTo(50, 96); ctx.lineTo(44, 104); ctx.lineTo(14, 104);
    ctx.closePath(); ctx.fill();
    // ön cep logosu: vurgu şeridi
    ctx.fillStyle = k.rgba(p.color, 0.9);
    ctx.beginPath(); k.rrect(-34, 44, 68, 22, 8); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.65);
    ctx.fillRect(-24, 52, 48, 6);

    // kulplar (ağızdan yukarı iki yay)
    ctx.strokeStyle = line; ctx.lineWidth = 12;
    ctx.beginPath(); ctx.arc(-34, -10, 22, Math.PI, 0); ctx.stroke();
    ctx.beginPath(); ctx.arc(34, -10, 22, Math.PI, 0); ctx.stroke();
    ctx.strokeStyle = k.rgba('dim'); ctx.lineWidth = 7;
    ctx.beginPath(); ctx.arc(-34, -10, 22, Math.PI, 0); ctx.stroke();
    ctx.beginPath(); ctx.arc(34, -10, 22, Math.PI, 0); ctx.stroke();

    ctx.restore();

    // düşüş hareket çizgileri
    if (dropping) {
      ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 5;
      for (let i = 0; i < 3; i++) {
        const lx = -24 + i * 24;
        ctx.beginPath(); ctx.moveTo(lx, py - 34); ctx.lineTo(lx, py - 16); ctx.stroke();
      }
    }
    // poşete giriş "pof" çizgileri
    if (d >= 0.35 && d < 0.75) {
      const a = 1 - k.prog(d, 0.35, 0.75);
      ctx.strokeStyle = k.rgba('ink', 0.5 * a); ctx.lineWidth = 5;
      const dirs = [[-1, -0.4], [0, -0.6], [1, -0.4], [-0.7, 0.2], [0.7, 0.2]];
      for (const [dx, dy] of dirs) {
        const r0 = 66 + k.E.outCubic(k.prog(d, 0.35, 0.75)) * 34;
        ctx.beginPath();
        ctx.moveTo(dx * r0, -10 + dy * r0);
        ctx.lineTo(dx * (r0 + 14), -10 + dy * (r0 + 14));
        ctx.stroke();
      }
    }
  },
};

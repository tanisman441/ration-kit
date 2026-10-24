// wedding-fx/ring-exchange — yüzük takma anı: damadın eli gelinin parmağına altın yüzüğü takar.
// NOT: canvas y-aşağıdır; (0,0) ellerin merkezi, yüzük yukarıdan (negatif y) aşağı iner.
export default {
  name: 'ring-exchange', category: 'wedding-fx',
  desc: 'Yüzük takma anı: damadın eli gelinin parmağına altın yüzüğü takar, at anında ışıltı parlar',
  tags: ['yüzük', 'düğün', 'evlilik', 'takmak', 'nişan', 'ring', 'wedding', 'marriage', 'exchange'],
  box: [-180, -140, 180, 140],
  bleed: 40,
  anchor: 'ellerin merkezi (0,0); gelinin eli soldan, damadın eli sağ üstten gelir',
  points: { ring: [0, -8], hand: [-120, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'yüzüğün parmağa takıldığı an' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const skin = k.rgba(p.color);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };

    const d = p.at == null ? -1 : t - p.at;
    const bob = 3 * Math.sin(2 * Math.PI * t / 2.4); // nefes: eller hafifçe inip kalkar

    // yüzük konumu: at'tan önce parmağın üstünde bekler, at'ta 0.35 sn'de parmağa iner
    let ringY = -72 + bob;
    if (d >= 0) {
      const s = k.prog(d, 0, 0.35);
      ringY = k.lerp(-72 + bob, -8 + bob, s * s * (3 - 2 * s));
    }

    // gelinin eli (soldan): önkol + avuç + parmak sağa uzanır
    limb(-180, 26 + bob, -96, 8 + bob, 26, skin);
    disc(-78, 4 + bob, 26, 18, skin);
    limb(-58, 0 + bob, 14, -6 + bob, 13, skin); // yüzük parmağı
    limb(-58, 10 + bob, -6, 14 + bob, 11, skin); // diğer parmaklar (bükülü)
    // tırnak ucu
    disc(12, -6 + bob, 7, 6, k.rgba('panel2'));

    // damadın eli (sağ üstten): yüzüğü başparmak + işaret parmağıyla tutar
    limb(180, -118 + bob * 0.5, 62, -58 + bob * 0.5, 26, skin);
    disc(48, -50 + bob * 0.5, 24, 17, skin);
    // yüzüğü tutan iki parmak ucu (yüzük merkezine dokunur)
    limb(34, -44 + bob * 0.5, 8, ringY + 8, 11, skin);
    limb(58, -38 + bob * 0.5, 4, ringY + 10, 11, skin);

    // yüzük: altın halka + taş (tek vurgu rengi: yellow)
    ctx.save();
    ctx.translate(0, ringY);
    ctx.strokeStyle = line; ctx.lineWidth = 9 + LW;
    ctx.beginPath(); ctx.arc(0, 0, 13, 0, k.TAU); ctx.stroke();
    ctx.strokeStyle = k.rgba('yellow'); ctx.lineWidth = 9;
    ctx.beginPath(); ctx.arc(0, 0, 13, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = k.rgba('yellow');
    ctx.beginPath(); ctx.moveTo(0, -26); ctx.lineTo(7, -16); ctx.lineTo(-7, -16); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.beginPath(); ctx.moveTo(0, -24); ctx.lineTo(4, -17); ctx.lineTo(-4, -17); ctx.closePath(); ctx.fill();
    ctx.restore();

    // at anı: ışıltı patlaması + parlama (0.8 sn)
    if (d >= 0 && d < 0.8) {
      const f = 1 - d / 0.8;
      k.glow(0, ringY, 60 * f + 10, 'yellow', 0.5 * f);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * k.TAU + 0.4;
        const r1 = 16 + d * 90, r2 = r1 + 14 * f;
        ctx.strokeStyle = k.rgba('yellow', 0.9 * f);
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(0 + Math.cos(a) * r1, ringY + Math.sin(a) * r1);
        ctx.lineTo(0 + Math.cos(a) * r2, ringY + Math.sin(a) * r2);
        ctx.stroke();
      }
    }

    // boşta periyodik ışıltı: her 3 sn'de bir yüzük parlar
    const glint = (t % 3);
    if (glint < 0.25 && d < 0) {
      const f = 1 - glint / 0.25;
      ctx.strokeStyle = `rgba(255,255,255,${0.9 * f})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-8, ringY - 8); ctx.lineTo(8, ringY + 8);
      ctx.moveTo(8, ringY - 8); ctx.lineTo(-8, ringY + 8);
      ctx.stroke();
    }

    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-120, -2 + bob, 34, 10, -0.1, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(120, -96 + bob * 0.5, 34, 10, -0.5, 0, k.TAU); ctx.fill();
    // sağ alt gölge (%12 koyultma)
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(-40, 26 + bob, 60, 8, 0, 0, k.TAU); ctx.fill();
  },
};

// bakery-fx/mixer-whirl — stand mikser döner; çırpıcı hamuru girdap yapar. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) mikser başlığının alt kenarının merkezidir.
export default {
  name: 'mixer-whirl', category: 'bakery-fx',
  desc: 'Stand mikser çalışır; çırpıcı dönerken kasedeki hamur girdap yapar',
  tags: ['mikser', 'çırpıcı', 'hamur', 'girdap', 'mutfak', 'pastane', 'mixer', 'whisk', 'whirl', 'dough', 'kitchen', 'bakery'],
  box: [-140, -100, 140, 100],
  bleed: 20,
  anchor: 'mikser başlığının alt kenarının merkezi (0,0); kase altta, çırpıcı kasededir',
  points: { bowl: [25, 45], beater: [20, 5], head: [-20, -64] },
  params: {
    color: { type: 'color', default: 'dim' },
    speed: { type: 'number', default: 1, desc: 'çırpma hızı çarpanı (1 = ~1.1 sn bir tur)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const sp = p.speed || 1;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // taban
    blob(-120, 62, 240, 32, 10, k.rgba('panel2'));
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-92, 68, 28, 6, 0, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(66, 80, 48, 9, 5); ctx.fill();

    // gövde kolonu (sol)
    blob(-118, -52, 30, 114, 10, body);
    // başlık (üst yatay)
    blob(-118, -88, 200, 40, 14, body);
    // başlık parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-88, -80, 26, 6, 0, 0, k.TAU); ctx.fill();
    // hız düğmesi
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(-102, -68, 9, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('yellow'); ctx.beginPath(); ctx.arc(-102, -68, 6, 0, k.TAU); ctx.fill();

    // kase (dış)
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(-48, 14);
    ctx.quadraticCurveTo(-48, 76, 25, 76);
    ctx.quadraticCurveTo(98, 76, 98, 14);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath();
    ctx.moveTo(-43, 16);
    ctx.quadraticCurveTo(-43, 71, 25, 71);
    ctx.quadraticCurveTo(93, 71, 93, 16);
    ctx.closePath(); ctx.fill();
    // kase kenarı
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-52, 10, 154, 10, 5); ctx.fill();
    ctx.fillStyle = k.rgba('panel2'); ctx.beginPath(); k.rrect(-49, 12, 148, 6, 3); ctx.fill();

    // hamur (kase içi)
    ctx.fillStyle = k.rgba('yellow');
    ctx.beginPath(); ctx.ellipse(25, 46, 58, 22, 0, 0, k.TAU); ctx.fill();
    // girdap çizgileri: kase içinde döner
    ctx.save();
    ctx.beginPath(); ctx.ellipse(25, 46, 56, 20, 0, 0, k.TAU); ctx.clip();
    ctx.translate(25, 46); ctx.rotate(t * 0.9 * sp);
    ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 3;
    for (const r of [14, 28, 42]) {
      ctx.beginPath(); ctx.arc(0, 0, r, 0.3, k.TAU - 1.2); ctx.stroke();
    }
    ctx.restore();

    // çırpıcı mili (başlıktan kaseye)
    ctx.strokeStyle = line; ctx.lineWidth = 12;
    ctx.beginPath(); ctx.moveTo(20, -48); ctx.lineTo(20, 8); ctx.stroke();
    ctx.strokeStyle = k.rgba('dim'); ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(20, -48); ctx.lineTo(20, 8); ctx.stroke();

    // çırpıcı kolları: döner
    ctx.save(); ctx.translate(20, 14); ctx.rotate(t * k.TAU / 1.1 * sp);
    ctx.strokeStyle = line; ctx.lineWidth = 12;
    ctx.beginPath(); ctx.moveTo(-26, -18); ctx.lineTo(26, 18); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(26, -18); ctx.lineTo(-26, 18); ctx.stroke();
    ctx.strokeStyle = k.rgba('dim'); ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(-26, -18); ctx.lineTo(26, 18); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(26, -18); ctx.lineTo(-26, 18); ctx.stroke();
    ctx.restore();
    // çırpıcı göbeği
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(20, 14, 10, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('yellow'); ctx.beginPath(); ctx.arc(20, 14, 6, 0, k.TAU); ctx.fill();

    // hamur sıçrama damlaları (dönüşle savrulur)
    for (let i = 0; i < 3; i++) {
      const ang = t * 2.2 * sp + i * 2.1;
      const dx = 25 + Math.cos(ang) * 62;
      const dy = 30 + Math.sin(ang) * 10;
      ctx.fillStyle = k.rgba('yellow', 0.7);
      ctx.beginPath(); ctx.arc(dx, dy, 3, 0, k.TAU); ctx.fill();
    }
  },
};

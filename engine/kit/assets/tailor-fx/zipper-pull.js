// tailor-fx/zipper-pull — fermuar `pull` ile çekilir; sürgü aşağı indikçe dişler ayrılır, kumaş açılır. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) fermuar ortası, fermuar dikey uzanır (üst y -95, alt y 95).
export default {
  name: 'zipper-pull', category: 'tailor-fx',
  desc: 'Dikey fermuar; sürgü aşağı çekildikçe dişler ayrılır, iki kumaş parçası aralanır',
  tags: ['terzi', 'fermuar', 'çekmek', 'kumaş', 'giysi', 'tailor', 'zipper', 'zip', 'pull', 'fastener', 'cloth'],
  box: [-120, -110, 120, 110],
  bleed: 30,
  anchor: 'fermuar ortası (0,0); üst uç y -95, alt uç y 95',
  points: { top: [0, -95], slider: [0, 0], bottom: [0, 95] },
  params: {
    color: { type: 'color', default: 'ink' },
    pull: { type: 'number', default: 0.5, desc: 'fermuar çekişi 0–1: 0 kapalı, 1 tam açık' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const pull = k.clamp(p.pull == null ? 0.5 : p.pull, 0, 1);
    const sliderY = k.lerp(-82, 82, pull);
    const sway = k.noise1(t * 1.2) * 0.12;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // arka kumaş: tek parça giysi — fermuar açılınca aradan bu görünür
    blob(-108, -95, 216, 190, 10, k.rgba('panel2'));

    // kumaş panelleri: sürgünün altında aralanır
    const gap = pull * 26;
    const panel = (side) => {
      const x0 = side < 0 ? -108 : 0;
      const w = 108 - gap;
      ctx.save();
      ctx.translate(side < 0 ? -gap : gap, 0);
      blob(x0, -95, w, 190, 10, body);
      // kat izi
      ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(side < 0 ? -96 : 12, -60); ctx.lineTo(side < 0 ? -12 : 96, -60); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(side < 0 ? -96 : 12, 60); ctx.lineTo(side < 0 ? -12 : 96, 60); ctx.stroke();
      // premium parlama (sol üst) — sol panelde
      if (side < 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.10)';
        ctx.beginPath(); ctx.ellipse(-82, -86, 16, 5, 0, 0, k.TAU); ctx.fill();
      }
      ctx.restore();
    };
    panel(-1); panel(1);

    // fermuar bandı (sürgünün üstünde kapalı, altında açık aralık)
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); k.rrect(-14, -95, 28, sliderY + 95, 6); ctx.fill();
    // dişler: sürgünün üstünde birleşik, altında iki yana ayrık
    for (let i = 0; i < 15; i++) {
      const y = -90 + i * 12;
      if (y > 92) break;
      if (y < sliderY - 4) {
        // kapalı dişler: ortada tek sıra
        ctx.fillStyle = k.rgba('panel2');
        ctx.beginPath(); k.rrect(-5, y, 10, 7, 2); ctx.fill();
      } else if (y > sliderY + 8) {
        // açık dişler: iki yana ayrık
        const off = gap * 0.55 + 6;
        ctx.fillStyle = k.rgba('panel2');
        ctx.beginPath(); k.rrect(-off - 8, y, 8, 7, 2); ctx.fill();
        ctx.beginPath(); k.rrect(off, y, 8, 7, 2); ctx.fill();
      }
    }
    // açık aralık gölgesi (sürgünün altında)
    if (pull > 0.02) {
      ctx.fillStyle = k.rgba('bg', 0.4);
      ctx.beginPath();
      ctx.moveTo(-gap * 0.55, sliderY + 10); ctx.lineTo(gap * 0.55, sliderY + 10);
      ctx.lineTo(gap * 0.55 + 8, 92); ctx.lineTo(-gap * 0.55 - 8, 92);
      ctx.closePath(); ctx.fill();
    }

    // sürgü: yamuk gövde + sarkan çekme halkası (sallanır)
    ctx.save();
    ctx.translate(0, sliderY);
    ctx.scale(1.3, 1.3);
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.moveTo(-13, -12); ctx.lineTo(13, -12); ctx.lineTo(9, 12); ctx.lineTo(-9, 12); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('accent');
    ctx.beginPath(); ctx.moveTo(-10, -9); ctx.lineTo(10, -9); ctx.lineTo(7, 9); ctx.lineTo(-7, 9); ctx.closePath(); ctx.fill();
    // parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-4, -6, 5, 2.5, 0, 0, k.TAU); ctx.fill();
    // çekme halkası
    ctx.save();
    ctx.translate(0, 12);
    ctx.rotate(sway);
    ctx.strokeStyle = line; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 22); ctx.stroke();
    ctx.strokeStyle = k.rgba('panel2'); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 22); ctx.stroke();
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(0, 30, 10, 7, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('accent');
    ctx.beginPath(); ctx.ellipse(0, 30, 7, 4.5, 0, 0, k.TAU); ctx.fill();
    ctx.restore();
    ctx.restore();

    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(-96, 97, 192, 8, 4); ctx.fill();
  },
};

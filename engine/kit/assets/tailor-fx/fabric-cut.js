// tailor-fx/fabric-cut — makas kumaşı keser; `at` anında bıçaklar kapanır, kesik çizgisi belirir, kumaş ikiye ayrılır. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) kumaş üst kenarı ortası (kesim noktası), makas üstte.
export default {
  name: 'fabric-cut', category: 'tailor-fx',
  desc: 'Katlı kumaş parçası ve üstünde makas; kesim anında bıçaklar kapanır, kesik çizgisi belirir, kumaş iki yana ayrılır',
  tags: ['terzi', 'makas', 'kumaş', 'kesmek', 'kesim', 'kumaş kesimi', 'tailor', 'scissors', 'fabric', 'cut', 'cutting', 'cloth'],
  box: [-130, -110, 130, 110],
  bleed: 40,
  anchor: 'kumaş üst kenarı ortası / kesim noktası (0,0); kumaş tabanı y ~95',
  points: { cut: [0, 0], scissors: [0, -55], fabric: [0, 60] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'makas kumaşı keser — bıçaklar kapanır, kesik çizgisi belirir (0.9 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const cut = d >= 0;
    const cutProg = cut ? k.clamp(d / 0.6, 0, 1) : 0;
    const split = cut ? k.clamp((d - 0.15) / 0.6, 0, 1) * 9 : 0;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // kumaş: iki yarı; kesimden sonra yana ayrılır
    const half = (sx, flip) => {
      ctx.save();
      ctx.translate(sx, 0);
      ctx.fillStyle = k.rgba('bg', 0.32);
      ctx.beginPath(); k.rrect(flip ? 0 : -115, 0, 115, 95, 10); ctx.fill();
      blob(flip ? 0 : -115, 2, 115, 93, 10, body);
      // kat izi çizgileri
      ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(flip ? 12 : -103, 34); ctx.lineTo(flip ? 103 : -12, 34); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(flip ? 12 : -103, 64); ctx.lineTo(flip ? 103 : -12, 64); ctx.stroke();
      // premium parlama (sol üst) — sadece sol yarıda
      if (!flip) {
        ctx.fillStyle = 'rgba(255,255,255,0.10)';
        ctx.beginPath(); ctx.ellipse(-88, 10, 18, 5, 0, 0, k.TAU); ctx.fill();
      }
      ctx.restore();
    };
    half(-split, false);
    half(split, true);

    // kesik çizgisi: kesim anında üstten alta doğru belirir
    if (cut) {
      const len = cutProg * 93;
      ctx.strokeStyle = k.rgba('bg', 0.85); ctx.lineWidth = 3;
      ctx.setLineDash([7, 5]);
      ctx.beginPath(); ctx.moveTo(0, 2); ctx.lineTo(0, 2 + len); ctx.stroke();
      ctx.setLineDash([]);
      // kesim flaşı
      if (d < 0.3) {
        const env = 1 - d / 0.3;
        k.glow(0, 6, 22 + env * 14, 'accent', 0.45 * env);
      }
    }

    // sağ alt gölge (kumaş altına)
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(-100, 97, 200, 8, 4); ctx.fill();

    // makas: pivot (0,-48); bıçaklar kesim noktasına bakar, boştayken hafif açılıp kapanır
    const bob = Math.sin(t * k.TAU / 2.2) * 3;
    let open;
    if (cut && d < 0.25) {
      open = k.lerp(0.22, 0.02, d / 0.25); // kapanma
    } else if (cut && d < 0.6) {
      open = k.lerp(0.02, 0.22, (d - 0.25) / 0.35); // tekrar açılma
    } else {
      open = 0.16 + Math.sin(t * k.TAU / 1.8) * 0.07; // idle açılıp kapanma
    }
    ctx.save();
    ctx.translate(0, -48 + bob);
    // bıçaklar (pivotun altında, kesim noktasına uzanır)
    const blade = (side) => {
      ctx.save();
      ctx.rotate(side * open);
      ctx.strokeStyle = line; ctx.lineWidth = 12;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(side * 6, 52); ctx.stroke();
      ctx.strokeStyle = k.rgba('panel2'); ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(side * 6, 52); ctx.stroke();
      ctx.restore();
    };
    blade(-1); blade(1);
    // pivot vidası
    ctx.fillStyle = k.rgba('accent');
    ctx.beginPath(); ctx.arc(0, 0, 6, 0, k.TAU); ctx.fill();
    // saplar (pivotun üstünde, iki halka)
    const handle = (side) => {
      ctx.save();
      ctx.rotate(-side * open * 1.4);
      ctx.strokeStyle = line; ctx.lineWidth = 10;
      ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(side * 26, -34); ctx.stroke();
      ctx.strokeStyle = k.rgba(p.color); ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(side * 26, -34); ctx.stroke();
      ctx.strokeStyle = line; ctx.lineWidth = 9;
      ctx.beginPath(); ctx.arc(side * 30, -42, 11, 0, k.TAU); ctx.stroke();
      ctx.strokeStyle = k.rgba(p.color); ctx.lineWidth = 6;
      ctx.beginPath(); ctx.arc(side * 30, -42, 11, 0, k.TAU); ctx.stroke();
      ctx.restore();
    };
    handle(-1); handle(1);
    ctx.restore();
  },
};

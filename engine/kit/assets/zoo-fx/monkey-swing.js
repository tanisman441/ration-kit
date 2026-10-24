// zoo-fx/monkey-swing — daldan sarkan maymun, döngüsel olarak sallanır. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; dal üstte, maymun daldan aşağı sarkar (negatif y = yukarı).
export default {
  name: 'monkey-swing', category: 'zoo-fx',
  desc: 'Daldan iki eliyle sarkan maymun; sarkaç gibi döngüsel sallanır, kuyruğu kıvrılır',
  tags: ['maymun', 'salıncak', 'dal', 'sallanma', 'hayvanat bahçesi', 'monkey', 'swing', 'branch', 'jungle', 'zoo', 'ape'],
  box: [-185, -245, 185, 15],
  bleed: 30,
  anchor: 'dal hattı (y=-230); maymun daldan sarkar',
  points: { hands: [0, -230], head: [0, -128], tail: [52, -88] },
  params: {
    color: { type: 'color', default: 'dim' },
    speed: { type: 'number', default: 0.5, desc: 'sallanma hızı/genliği (0-1)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const faceC = k.rgba('panel2');
    const sp = k.clamp(p.speed, 0, 1);
    const ang = Math.sin(t * (1.4 + sp * 1.2)) * (0.18 + sp * 0.22); // döngüsel sarkaç
    const bob = Math.sin(t * (1.4 + sp * 1.2) * 2) * 2;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const rope = (x1, y1, cx, cy, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(cx, cy, x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(cx, cy, x2, y2); ctx.stroke();
    };

    // dal (serbest çizgi → ink)
    ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(-180, -230); ctx.lineTo(180, -230); ctx.stroke();
    // yapraklar
    disc(-140, -238, 20, 12, k.rgba('green'));
    disc(120, -240, 22, 13, k.rgba('green'));
    disc(160, -226, 14, 9, k.rgba('green'));

    // sallanan grup: pivot = tutuş noktası
    ctx.save();
    ctx.translate(0, -230);
    ctx.rotate(ang);

    // kollar: daldan omuzlara
    limb(-6, 0, -26, 62, 14, body);
    limb(6, 0, 26, 62, 14, body);
    // eller
    disc(-26, 64, 10, 10, body);
    disc(26, 64, 10, 10, body);

    // gövde
    blob(-34, 66 + bob * 0.3, 68, 78, 30, body);
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-16, 88, 12, 18, -0.2, 0, k.TAU); ctx.fill();
    // karın (açık iç alan)
    disc(0, 112, 20, 24, faceC);

    // bacaklar: kıvrık, ayaklar yukarı bakar
    limb(-20, 140, -34, 168, 13, body);
    limb(20, 140, 34, 168, 13, body);
    disc(-36, 170, 11, 8, body);
    disc(36, 170, 11, 8, body);

    // kuyruk: kıvrık, sallanmayla savrulur
    const tailSway = Math.sin(t * (1.4 + sp * 1.2) + 0.8) * 10;
    rope(34, 108, 66, 96 + tailSway, 58 + tailSway, 66, 11, body);

    // baş + kulaklar
    disc(-26, 52, 12, 12, body);
    disc(26, 52, 12, 12, body);
    disc(0, 52, 30, 28, body);
    // yüz (açık alan)
    disc(0, 56, 22, 19, faceC);
    // gözler
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.ellipse(-10, 52, 4.5, 4.5, 0, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(10, 52, 4.5, 4.5, 0, 0, k.TAU); ctx.fill();
    // ağız: gülümseme
    ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(0, 62, 9, 0.3, Math.PI - 0.3); ctx.stroke();
    ctx.restore();

    // (göz kırpma atlandı: baş sürekli sallanıyor, kırpma karesi tutarsız görünür)
  },
};

// history-fx/cave-fire — mağara duvarı önünde kamp ateşi; alev flicker'ı, duvarda oynayan gölge.
// NOT: canvas y-aşağıdır; (0,0) = mağara tabanı.
const LW = 5;
function R(ctx, k, x, y, w, h, r, fill) {
  ctx.fillStyle = k.rgba('bg', 0.55);
  ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
  ctx.fillStyle = fill;
  ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
}
export default {
  name: 'cave-fire', category: 'history-fx',
  desc: 'Mağara duvarı önünde kamp ateşi; alevler titrer, duvarda ateşin gölgesi oynar',
  tags: ['mağara', 'ateş', 'kamp', 'tarih', 'taş devri', 'gölge', 'ocak', 'cave', 'fire', 'campfire', 'prehistoric', 'shadow'],
  box: [-148, -188, 148, 24],
  bleed: 28,
  anchor: 'mağara tabanı (0,0)',
  points: { top: [0, -160], fire: [0, -45] },
  params: {
    intensity: { type: 'number', default: 0.7, desc: 'ateş yoğunluğu 0–1 (0 = sönük köz)' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    const inten = k.clamp(p.intensity, 0, 1);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // mağara duvarı
    R(ctx, k, -145, -185, 290, 209, 34, k.rgba('panel2', 1));
    // iç kemer (derinlik)
    ctx.fillStyle = k.rgba('ink', 0.32);
    ctx.beginPath();
    ctx.moveTo(-108, 24); ctx.lineTo(-108, -80);
    ctx.quadraticCurveTo(-108, -150, 0, -150);
    ctx.quadraticCurveTo(108, -150, 108, -80);
    ctx.lineTo(108, 24); ctx.closePath(); ctx.fill();
    // sarkıtlar
    ctx.fillStyle = k.rgba('dim', 1);
    for (const [sx, w, h] of [[-78, 16, 34], [-20, 20, 46], [48, 14, 30], [92, 12, 24]]) {
      ctx.beginPath(); ctx.moveTo(sx - w / 2, -150); ctx.lineTo(sx + w / 2, -150); ctx.lineTo(sx, -150 + h); ctx.closePath(); ctx.fill();
    }
    // sol üst parlama (premium finish)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-95, -140, 52, 20, -0.4, 0, k.TAU); ctx.fill();

    // duvardaki oynayan gölge (ateşin gölgesi — döngüsel idle)
    const shx = k.noise1(t * 0.9) * 30;
    const shr = 62 + k.noise1(t * 1.7 + 5) * 12;
    ctx.fillStyle = k.rgba('bg', 0.22);
    ctx.beginPath(); ctx.ellipse(shx, -58, shr, 52, 0.1, 0, k.TAU); ctx.fill();

    // ateş çemberi taşları
    const stone = (x, y, rx, ry) => {
      ctx.fillStyle = k.rgba('bg', 0.55);
      ctx.beginPath(); ctx.ellipse(x, y, rx + 2.5, ry + 2.5, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('dim', 1);
      ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    stone(-44, -6, 13, 9); stone(44, -6, 13, 9); stone(-30, -2, 11, 8); stone(30, -2, 11, 8);
    // kütükler
    const log = (x1, y1, x2, y2) => {
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 15;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 10;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    log(-30, -8, 30, -18); log(30, -8, -30, -18);

    // alev: 3 katman, noise titremeli
    if (inten > 0.01) {
      const H = 46 + 96 * inten, W = 30 + 26 * inten;
      k.glow(0, -H * 0.25, 56 + 44 * inten, 'red', 0.3);
      k.glow(0, -H * 0.3, 34 + 26 * inten, p.color, 0.4);
      const tongue = (wF, hF, col, alpha, seed) => {
        const w = W * wF, h = H * hF;
        const sway = k.noise1(t * 3.3 + seed) * 12 * wF;
        const sway2 = k.noise1(t * 5.9 + seed + 9) * 8 * wF;
        const tipX = sway * 1.6, tipY = -h + k.noise1(t * 4.5 + seed + 4) * 10 * hF;
        ctx.fillStyle = k.rgba(col, alpha);
        ctx.beginPath();
        ctx.moveTo(-w / 2, -6);
        ctx.bezierCurveTo(-w / 2 - sway2, -h * 0.35, -w * 0.26 + sway, -h * 0.72, tipX, tipY);
        ctx.bezierCurveTo(w * 0.26 + sway, -h * 0.72, w / 2 - sway2, -h * 0.35, w / 2, -6);
        ctx.quadraticCurveTo(0, h * 0.06, -w / 2, -6);
        ctx.fill();
      };
      tongue(1, 1, 'red', 0.85, 11);
      tongue(0.62, 0.72, p.color, 0.92, 12);
      tongue(0.34, 0.5, p.color, 0.95, 13);
    }
    // yükselen közler (döngüsel)
    const N = Math.round(3 + 7 * inten);
    for (let i = 0; i < N; i++) {
      const cyc = 1.9;
      const ph = ((t * (0.6 + k.hash(i * 3 + 21) * 0.7) + k.hash(i * 5 + 22) * cyc) % cyc) / cyc;
      const ex = (k.hash(i * 7 + 23) - 0.5) * 50 + k.noise1(i * 2 + t * 3) * 6;
      const ey = -10 - ph * 150;
      ctx.fillStyle = k.rgba(p.color, 0.7 * (1 - ph) * (0.25 + inten * 0.75));
      ctx.beginPath(); ctx.arc(ex, ey, 1.8 + (1 - ph) * 2.6, 0, k.TAU); ctx.fill();
    }
  },
};

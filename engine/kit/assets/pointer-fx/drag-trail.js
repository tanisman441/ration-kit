// pointer-fx/drag-trail — sürüklenen imleç noktası; drag anında yolda ışık izi bırakır.
// NOT: canvas y-aşağıdır; (0,0) izin başladığı nokta.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'drag-trail',
  category: 'pointer-fx',
  desc: 'Sürükleme: drag anında hafif eğri yolda ilerleyen nokta, arkasında sönen ışık izi',
  tags: ['sürükleme', 'sürükle', 'iz', 'kuyruk', 'fare', 'drag', 'trail', 'swipe', 'pointer', 'gesture'],
  box: [-180, -90, 180, 90],
  bleed: 30,
  anchor: 'izin başlangıç noktası (0,0)',
  points: { start: [0, 0], end: [150, 40] },
  params: {
    drag: { type: 'time', default: null, desc: 'sürükleme başlangıcı: nokta 0.9 sn yolda ilerler' },
    color: { type: 'color', default: 'accent' },
  },
  draw(ctx, t, p, k) {
    const d = p.drag == null ? -1 : t - p.drag;
    // iz yolu: hafif S eğrisi, başlangıç (0,0) → bitiş (150,40)
    const pathY = (x) => 40 * (x / 150) + 26 * Math.sin((x / 150) * Math.PI * 1.6);

    // nokta konumu: drag yoksa idle'da başlangıçta bekler
    const DUR = 0.9;
    let hx = 0, hy = 0;
    if (d >= 0 && d < DUR) {
      const e = k.E.outCubic(k.clamp(d / DUR, 0, 1));
      hx = e * 150;
      hy = pathY(hx);
    }
    // idle: nokta nefes alır
    const pulse = 1 + 0.1 * Math.sin((t * k.TAU) / 2.4);

    ctx.save();

    // iz çizgisi: başın gerisindeki anların konumları (0.4 sn geriye kadar), sönümlenir
    if (d >= 0 && d < DUR + 0.6) {
      for (let i = 0; i < 14; i++) {
        const lag = (i / 13) * 0.4;
        const tt = d - lag;
        if (tt < 0 || tt > DUR) continue;
        const e2 = k.E.outCubic(k.clamp(tt / DUR, 0, 1));
        const xx = e2 * 150, yy = pathY(xx);
        let fade = 1 - lag / 0.4; // yeni iz = parlak
        if (d > DUR) fade *= k.clamp(1 - (d - DUR) / 0.6, 0, 1); // drag bitince iz söner
        if (fade <= 0.02) continue;
        const rad = 3 + 9 * e2 * fade;
        k.glow(xx, yy, rad * 2.2, p.color, 0.22 * fade);
        ctx.fillStyle = k.rgba(p.color, 0.55 * fade);
        ctx.beginPath(); ctx.arc(xx, yy, rad, 0, k.TAU); ctx.fill();
      }
    }

    // baş nokta — dış hat + parlama
    ctx.fillStyle = k.rgba('bg', 0.6);
    ctx.beginPath(); ctx.arc(hx, hy, 13 * pulse + 2.5, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); ctx.arc(hx, hy, 13 * pulse, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(hx - 4, hy - 5, 6, 4, -0.6, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};

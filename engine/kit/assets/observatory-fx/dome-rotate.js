// observatory-fx/dome-rotate — `at` anında gözlemevi kubbesi döner (yarık kayar), kapak açılır ve içeriden ışık sızar. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) kubbe tabanının merkezi (zemin çizgisi y=30).
export default {
  name: 'dome-rotate', category: 'observatory-fx',
  desc: 'Gözlemevi kubbesi: at anında kubbe döner, yarık karşıya kayar, kapak yukarı açılır ve içeriden ışık sızar',
  tags: ['gözlemevi', 'kubbe', 'dönüş', 'rasathane', 'kapak', 'observatory', 'dome', 'rotate', 'telescope dome', 'shutter'],
  box: [-120, -100, 120, 100],
  bleed: 30,
  anchor: 'kubbe tabanının merkezi (0,30); zemin çizgisi',
  points: { dome: [0, -10], slit: [-28, -3], beacon: [0, -42] }, // slit: dönüş öncesi konumu (yarık -28'den +28'e kayar)
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'dönüş anı — kubbe döner, kapak açılır, ışık sızar (1.2 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    // dönüş: at ile at+1 arasında yarık -28'den +28'e kayar (kubbe dönüyormuş hissi)
    const rot = p.at == null ? 0 : k.E.inOutCubic(k.prog(t, p.at, p.at + 1));
    const slitX = k.lerp(-28, 28, rot);
    // kapak: at+0.2 ile at+1 arasında yukarı kayarak açılır
    const open = p.at == null ? 0 : k.prog(t, p.at + 0.2, p.at + 1);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // arka plan yıldızları: yanıp söner (idle)
    for (let i = 0; i < 8; i++) {
      const sx = -112 + k.hash(i * 3 + 1) * 224;
      const sy = -96 + k.hash(i * 3 + 2) * 60;
      const a = 0.25 + 0.6 * Math.abs(Math.sin(t * (0.6 + k.hash(i * 5)) + k.hash(i) * k.TAU));
      ctx.fillStyle = k.rgba('panel2', a);
      ctx.beginPath(); ctx.arc(sx, sy, 1.8 + k.hash(i * 7) * 2, 0, k.TAU); ctx.fill();
    }

    // zemin çizgisi (serbest çizgi = ink)
    ctx.strokeStyle = k.rgba('ink', 0.55); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-112, 96); ctx.lineTo(112, 96); ctx.stroke();

    // kaide binası
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); k.rrect(-82, 34, 164, 62, 12); ctx.fill();
    blob(-78, 30, 156, 62, 10, body);
    // premium parlama (sol üst, kaide)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-58, 42, 14, 7, -0.2, 0, k.TAU); ctx.fill();
    // kaide penceresi (yanıp sönen ışık, idle)
    const winA = 0.55 + 0.35 * Math.sin(t * 2.2);
    ctx.fillStyle = k.rgba('yellow', winA);
    ctx.beginPath(); k.rrect(38, 52, 22, 18, 4); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.7);
    ctx.beginPath(); k.rrect(-58, 52, 22, 18, 4); ctx.fill();

    // kubbe: yarım daire (gölge + kenarlık + gövde)
    ctx.save();
    ctx.beginPath(); ctx.arc(0, 30, 68, Math.PI, 0); ctx.closePath();
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.save(); ctx.translate(4, 5); ctx.fill(); ctx.restore();
    ctx.beginPath(); ctx.arc(0, 30, 68 + LW / 2, Math.PI, 0); ctx.closePath();
    ctx.fillStyle = line; ctx.fill();
    ctx.beginPath(); ctx.arc(0, 30, 68, Math.PI, 0); ctx.closePath();
    ctx.fillStyle = body; ctx.fill();
    // kubbe içi (kırpılır): parlama, panel çizgileri, yarık, kapak
    ctx.save();
    ctx.beginPath(); ctx.arc(0, 30, 68, Math.PI, 0); ctx.closePath(); ctx.clip();
    // premium parlama (sol üst, kubbe)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-32, -28, 16, 10, -0.6, 0, k.TAU); ctx.fill();
    // kubbe panel çizgileri
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 30, 46, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 30, 24, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke();

    // yarık: koyu dikey açıklık
    ctx.fillStyle = k.rgba('ink', 0.9);
    ctx.beginPath(); k.rrect(slitX - 11, -34, 22, 62, 10); ctx.fill();
    // kapak: yarığın üstünde, açıldıkça yukarı kayar
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(slitX - 13, -36 - open * 64, 26, 64, 10); ctx.fill();
    ctx.restore();
    ctx.restore();

    // içeriden sızan ışık: kapak açılınca yarıktan yukarı doğru hüzme
    if (open > 0.4) {
      const la = (open - 0.4) / 0.6;
      k.glow(slitX, -30, 34, 'cyan', la * 0.5);
      ctx.fillStyle = k.rgba('cyan', la * 0.25);
      ctx.beginPath();
      ctx.moveTo(slitX - 10, -32); ctx.lineTo(slitX + 10, -32);
      ctx.lineTo(slitX + 26, -78); ctx.lineTo(slitX - 26, -78); ctx.closePath(); ctx.fill();
    }

    // işaret ışığı: kubbe tepesinde kırmızı, yanıp söner (idle)
    const blink = 0.4 + 0.6 * Math.abs(Math.sin(t * 2.5));
    ctx.fillStyle = k.rgba('red', blink);
    ctx.beginPath(); ctx.arc(0, -42, 5, 0, k.TAU); ctx.fill();
    if (blink > 0.7) k.glow(0, -42, 16, 'red', 0.4);
  },
};

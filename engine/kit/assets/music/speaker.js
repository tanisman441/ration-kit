// music/speaker — hoparlör kabini: woofer + tweeter; bas nabzıyla koni
// ileri-geri hareket eder, vuruş anında toz kapağı parlar.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) kabinin merkezidir.
export default {
  name: 'speaker', category: 'music',
  desc: 'Hoparlör kabini; bas nabzıyla woofer konisi hareket eder',
  tags: ['hoparlör', 'speaker', 'kolon', 'bas', 'ses', 'sound', 'bass', 'müzik', 'music'],
  box: [-115, -125, 115, 125],
  bleed: 30,
  anchor: 'kabinin merkezi (0,0)',
  points: { cone: [0, 28], tweeter: [0, -72], port: [0, 96] },
  params: {
    color: { type: 'color', default: 'panel2' },
    beat: { type: 'number', default: 0.8, desc: 'bas nabzı şiddeti (0=kapalı)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55), acc = k.rgba('yellow', 0.95);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    ctx.save();

    // bas nabzı: 0.8 sn periyot, vuruşta dışa doğru genişler
    const amp = k.clamp(p.beat, 0, 1);
    const beat = amp * Math.pow(0.5 + 0.5 * Math.sin(t * k.TAU / 0.8), 1.6);
    const pump = 1 + beat * 0.09;

    // ---- kabin: gölge + kontur + gövde
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(-100 + 6, -115 + 6, 200, 230, 18); ctx.fill();
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-100 - LW / 2, -115 - LW / 2, 200 + LW, 230 + LW, 18); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); k.rrect(-100, -115, 200, 230, 14); ctx.fill();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-64, -92, 30, 16, -0.5, 0, k.TAU); ctx.fill();

    // ---- tweeter (üst küçük sürücü)
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(0, -72, 28, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.8); ctx.beginPath(); ctx.arc(0, -72, 24, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel'); ctx.beginPath(); ctx.arc(0, -72, 15, 0, k.TAU); ctx.fill();
    ctx.fillStyle = acc; ctx.beginPath(); ctx.arc(0, -72, 7, 0, k.TAU); ctx.fill();
    // tweeter kubbesi parlaması
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.beginPath(); ctx.ellipse(-5, -77, 5, 3.5, -0.4, 0, k.TAU); ctx.fill();

    // ---- woofer (büyük sürücü): nabızla büyüyüp küçülür
    const ring = (r, w, c) => {
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.arc(0, 28, r, 0, k.TAU); ctx.stroke();
    };
    ring(68, 11, line);                       // dış halka konturu
    ring(68, 7, k.rgba('ink', 0.8));          // halka
    // koni: nabız ölçeği
    ctx.save(); ctx.translate(0, 28); ctx.scale(pump, pump);
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(0, 0, 54, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color); ctx.beginPath(); ctx.arc(0, 0, 51, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.12); ctx.beginPath(); ctx.arc(0, 0, 51, 0, k.TAU); ctx.fill();
    // koni çevresi (surround) iç ayrım
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, 0, 40, 0, k.TAU); ctx.stroke();
    // toz kapağı (dust cap): vurgu rengi
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(0, 0, 19, 0, k.TAU); ctx.fill();
    ctx.fillStyle = acc; ctx.beginPath(); ctx.arc(0, 0, 16, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.beginPath(); ctx.ellipse(-6, -6, 6, 4, -0.4, 0, k.TAU); ctx.fill();
    ctx.restore();
    // vuruş zirvesinde toz kapağı parlar
    if (beat > 0.75) k.glow(0, 28, 34, 'yellow', 0.4 * (beat - 0.75) / 0.25);

    // ---- bas portu (alt yarık)
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-33, 89, 66, 16, 10); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.85); ctx.beginPath(); k.rrect(-29, 92, 58, 10, 7); ctx.fill();
    // porttan çıkan hava: nabızla beliren iki yay
    if (beat > 0.5) {
      const a = 0.35 * (beat - 0.5) / 0.5;
      ctx.strokeStyle = k.rgba('ink', a); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 97, 44 + beat * 8, 0.35, Math.PI - 0.35); ctx.stroke();
    }

    ctx.restore();
  },
};

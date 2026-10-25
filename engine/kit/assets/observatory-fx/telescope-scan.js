// observatory-fx/telescope-scan — tripod üstünde teleskop gökyüzünü döngüsel tarar, mercek parıltısı yanıp söner. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) teleskop kaidesinin merkezi (dönme ekseni).
export default {
  name: 'telescope-scan', category: 'observatory-fx',
  desc: 'Tripod üstünde teleskop; tüpü yavaşça sağa sola tarar, merceği parlar, arka planda yıldızlar yanıp söner',
  tags: ['teleskop', 'gözlemevi', 'tarama', 'gökyüzü', 'yıldız', 'mercek', 'telescope', 'observatory', 'scan', 'stargazing'],
  box: [-130, -100, 130, 100],
  bleed: 30,
  anchor: 'kaide merkezi (0,0); tüp kaidenin üstünde döner',
  points: { lens: [90, -12], eyepiece: [-63, 12], mount: [0, 0] }, // lens/eyepiece: tarama orta konumundaki yaklaşık yerleri (tüp döner)
  params: {
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // arka plan yıldızları: her biri kendi fazında yanıp söner (döngüsel idle)
    for (let i = 0; i < 12; i++) {
      const sx = -118 + k.hash(i * 3 + 1) * 236;
      const sy = -92 + k.hash(i * 3 + 2) * 110;
      const sp = 0.6 + k.hash(i * 3 + 5) * 1.6;
      const a = 0.25 + 0.65 * Math.abs(Math.sin(t * sp + k.hash(i) * k.TAU));
      const r = 1.6 + k.hash(i * 7) * 2.2;
      ctx.fillStyle = k.rgba('panel2', a);
      ctx.beginPath(); ctx.arc(sx, sy, r, 0, k.TAU); ctx.fill();
    }

    // tripod ayakları (serbest çizgi = ink)
    ctx.strokeStyle = k.rgba('ink', 0.65); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(-6, 34); ctx.lineTo(-52, 96); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(6, 34); ctx.lineTo(52, 96); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, 34); ctx.lineTo(0, 98); ctx.stroke();
    // ayak uçları
    ctx.fillStyle = inkC;
    for (const fx of [-52, 52, 0]) { ctx.beginPath(); ctx.arc(fx, 97, 4, 0, k.TAU); ctx.fill(); }

    // kaide gövdesi
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); k.rrect(-26, -4, 52, 44, 12); ctx.fill();
    blob(-22, 0, 44, 36, 10, body);
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-12, 8, 6, 10, 0.2, 0, k.TAU); ctx.fill();
    // kaide düğmesi
    ctx.fillStyle = k.rgba('cyan', 0.7 + 0.3 * Math.sin(t * 2));
    ctx.beginPath(); ctx.arc(0, 18, 4, 0, k.TAU); ctx.fill();

    // tarama: tüp -28° ile +28° arasında 6 sn periyotla salınır
    const sweep = -0.42 + 0.84 * (0.5 + 0.5 * Math.sin(t * k.TAU / 6));
    ctx.save();
    ctx.translate(0, 2);
    ctx.rotate(sweep - 0.12);
    // tüp gölgesi (sağ alt, %12 koyultma hissi)
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); k.rrect(-58, -8, 148, 34, 14); ctx.fill();
    // tüp gövdesi
    blob(-58, -12, 148, 28, 13, body);
    // premium parlama (sol üst, tüp üst kenarı)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-30, -6, 26, 5, 0, 0, k.TAU); ctx.fill();
    // tüp halkaları
    ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 3;
    for (const hx of [-20, 20, 55]) {
      ctx.beginPath(); ctx.moveTo(hx, -12); ctx.lineTo(hx, 16); ctx.stroke();
    }
    // mercek: parlak cam + halka
    ctx.fillStyle = k.rgba('cyan', 0.95);
    ctx.beginPath(); ctx.arc(92, 2, 11, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = LW;
    ctx.beginPath(); ctx.arc(92, 2, 11, 0, k.TAU); ctx.stroke();
    // mercek parıltısı: tarama ucunda güçlenir (döngüsel)
    const glint = 0.35 + 0.55 * Math.abs(Math.sin(t * k.TAU / 6 + Math.PI / 2));
    k.glow(92, 2, 26, 'cyan', glint * 0.5);
    ctx.fillStyle = k.rgba('panel2', glint);
    ctx.beginPath(); ctx.arc(88, -2, 4, 0, k.TAU); ctx.fill();
    // oküler (göz merceği)
    blob(-70, -8, 14, 20, 6, k.rgba('panel2'));
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); ctx.arc(-64, 2, 3.5, 0, k.TAU); ctx.fill();
    ctx.restore();
  },
};

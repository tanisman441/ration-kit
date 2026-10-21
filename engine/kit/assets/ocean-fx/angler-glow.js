// ocean-fx/angler-glow — karanlıkta başındaki feneri parlayan fenerbalığı
// (anglerfish): fener ışığı nabız gibi yanıp söner (idle, ~2 sn), lure anında
// (0.7 sn) ışık parlar ve balık hedefe hamle yapar. Balık yüz profili sağa bakar.
// NOT: canvas y-aşağıdır; (0,0) gövde merkezidir.
export default {
  name: 'angler-glow', category: 'ocean-fx',
  desc: 'Başındaki feneri nabız gibi parlayan fenerbalığı, lure anında ışığı patlayıp hamle yapar',
  tags: ['fenerbalığı', 'ışık', 'parlama', 'karanlık', 'hamle', 'anglerfish', 'glow', 'lure', 'deep sea', 'predator'],
  box: [-140, -90, 150, 90],
  bleed: 70,
  anchor: 'gövde merkezi (0,0)',
  points: { mouth: [95, 12], lure: [52, -58] },
  params: {
    lure: { type: 'time', default: null, desc: 'ışık patlaması + hamle anı (0.7 sn)' },
    color: { type: 'color', default: 'yellow', desc: 'fener ışığı rengi' },
    body: { type: 'color', default: 'ink', desc: 'gövde rengi' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color, body = p.body;
    ctx.save();

    // lure olayı: 0.7 sn, ışık patlar + balık ileri hamle yapar
    const ld = p.lure == null ? -1 : t - p.lure;
    let flash = 0, lunge = 0;
    if (ld >= 0 && ld < 0.7) {
      const pp = ld / 0.7;
      flash = Math.sin(pp * Math.PI);
      lunge = Math.sin(Math.min(1, pp * 2) * Math.PI) * 26; // ileri fırlama
    }
    // idle: fener nabzı ~2 sn + hafif yüzüş salınımı
    const idleGlow = 0.5 + 0.5 * Math.sin(t * k.TAU / 2);
    const swayY = Math.sin(t * k.TAU / 3.6) * 5;
    const wag = Math.sin(t * 7) * 5; // kuyruk çırpma

    ctx.translate(lunge, swayY);

    // Fener (ışık hüzmesi): kafa üstündeki sap + ışıklı top
    const lx = 52, ly = -58 + Math.sin(t * 1.4) * 3;
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(30, -38); ctx.quadraticCurveTo(44, -52, lx, ly); ctx.stroke();
    const gr = 9 + flash * 7 + idleGlow * 2;
    k.glow(lx, ly, 60 + flash * 70, acc, 0.22 + idleGlow * 0.12 + flash * 0.28);
    ctx.fillStyle = k.rgba(acc, 0.95);
    ctx.beginPath(); ctx.arc(lx, ly, gr, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(lx, ly, gr, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath(); ctx.arc(lx - gr * 0.3, ly - gr * 0.3, gr * 0.25, 0, k.TAU); ctx.fill();

    // Kuyruk (çırpınan)
    ctx.fillStyle = k.rgba(body, 0.95);
    ctx.beginPath();
    ctx.moveTo(-70, 0); ctx.lineTo(-102, -22 + wag); ctx.lineTo(-102, 22 + wag);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(-102, -22 + wag); ctx.lineTo(-70, 0); ctx.lineTo(-102, 22 + wag); ctx.stroke();

    // Gövde: kocaman ağızlı yuvarlak kafa-gövde
    ctx.fillStyle = k.rgba(body, 0.95);
    ctx.beginPath(); ctx.ellipse(0, 0, 80, 52, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.ellipse(0, 0, 80, 52, 0, 0, k.TAU); ctx.stroke();
    // premium finish: sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-32, -22, 30, 17, -0.4, 0, k.TAU); ctx.fill();

    // Ağız: açık çene + sivri dişler
    const jawOpen = 6 + flash * 8;
    ctx.fillStyle = k.rgba('bg', 0.75);
    ctx.beginPath();
    ctx.moveTo(52, -6); ctx.quadraticCurveTo(88, 4, 78, 12 + jawOpen);
    ctx.quadraticCurveTo(62, 10 + jawOpen, 52, 4);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.9);
    for (let i = 0; i < 5; i++) {
      const dx = 56 + i * 5.5;
      ctx.beginPath(); // üst dişler
      ctx.moveTo(dx, -2); ctx.lineTo(dx + 3, 6); ctx.lineTo(dx + 6, -2);
      ctx.closePath(); ctx.fill();
      ctx.beginPath(); // alt dişler
      ctx.moveTo(dx + 1, 12 + jawOpen); ctx.lineTo(dx + 4, 5 + jawOpen); ctx.lineTo(dx + 7, 12 + jawOpen);
      ctx.closePath(); ctx.fill();
    }

    // Göz: fener ışığına bakan büyük göz
    ctx.fillStyle = k.rgba(acc, 0.95);
    ctx.beginPath(); ctx.arc(38, -24, 9, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.95);
    ctx.beginPath(); ctx.arc(39, -25, 4, 0, k.TAU); ctx.fill();

    // Yüzgeç
    ctx.fillStyle = k.rgba(body, 0.95);
    ctx.beginPath();
    ctx.moveTo(-20, 30); ctx.quadraticCurveTo(-34, 52, -52, 46); ctx.quadraticCurveTo(-40, 30, -20, 30);
    ctx.closePath(); ctx.fill();

    ctx.restore();
  },
};

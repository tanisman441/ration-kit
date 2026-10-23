// health-fx-2/stethoscope-pulse — stetoskop; canlı idle: diyaframdan nabız halkaları yayılır, zar titrer.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'stethoscope-pulse', category: 'health-fx-2',
  desc: 'Stetoskop; diyaframdan döngülü nabız halkaları yayılır, zar hafif titrer',
  tags: ['stetoskop', 'nabız', 'kalp', 'doktor', 'muayene', 'stethoscope', 'pulse', 'doctor', 'heartbeat', 'medical'],
  box: [-100, -100, 100, 100],
  bleed: 20,
  anchor: 'göğüs parçası',
  points: { diaphragm: [0, 56], earpiece: [-50, -66] },
  params: {
    color: { type: 'color', default: 'red' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55);
    ctx.save();
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';

    // hortum (serbest çizgi — ink)
    ctx.strokeStyle = k.rgba('ink', 0.85); ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(0, 36);
    ctx.quadraticCurveTo(-6, 8, -32, -4);
    ctx.quadraticCurveTo(-46, 0, -44, -28);
    ctx.stroke();
    // Y çatallanma: iki metal kol
    ctx.strokeStyle = k.rgba('dim'); ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(-44, -28); ctx.lineTo(-58, -62); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-44, -28); ctx.lineTo(-30, -62); ctx.stroke();
    // kulaklık uçları
    ctx.fillStyle = k.rgba('panel2');
    ctx.strokeStyle = line; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(-58, -66, 8, 0, k.TAU); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(-30, -66, 8, 0, k.TAU); ctx.fill(); ctx.stroke();

    // nabız halkaları (diyaframdan yayılır — canlı idle, 1.33 sn döngü)
    for (let i = 0; i < 3; i++) {
      const ph = ((t * 0.75) + i / 3) % 1;
      const r = 28 + ph * 42;
      ctx.strokeStyle = k.rgba(p.color, 0.42 * (1 - ph)); ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(0, 56, r, 0, k.TAU); ctx.stroke();
    }

    // göğüs parçası + sağ alt gölge
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.arc(0 + 5, 56 + 5, 23, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.strokeStyle = line; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(0, 56, 23, 0, k.TAU); ctx.fill(); ctx.stroke();
    // premium: sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-9, 47, 11, 6, -0.5, 0, k.TAU); ctx.fill();
    // diyafram zarı (titrer)
    const dx = k.noise1(t * 9) * 1.5;
    ctx.fillStyle = k.rgba('ink', 0.85);
    ctx.beginPath(); ctx.arc(dx, 56, 13, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 0.55);
    ctx.beginPath(); ctx.arc(dx, 56, 6, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};

// arcade-fx/joystick-wiggle — arcade joystick: kol sürekli hafifçe sallanır
// (canlı idle wiggle, ~0.9 sn periyot, ±9°). Uçlarda hareket yayları belirir,
// tabandaki LED nabız atar.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; taban (0,0), kol yukarı uzar.
export default {
  name: 'joystick-wiggle', category: 'arcade-fx',
  desc: 'Sürekli hafifçe sallanan arcade joystick; topuz vurgu renkli',
  tags: ['joystick', 'kol', 'arcade', 'atari', 'oyun kolu', 'sallanma', 'joystick', 'arcade stick', 'wiggle', 'controller'],
  box: [-120, -235, 120, 10],
  bleed: 20,
  anchor: 'taban (0,0); kol yukarı uzar',
  points: { top: [0, -200], pivot: [0, -58] },
  params: {
    color: { type: 'color', default: 'red', desc: 'topuz rengi' },
  },
  draw(ctx, t, p, k) {
    const LW = 6, line = k.rgba('bg', 0.55);
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -2, 100, 10, 0, 0, k.TAU); ctx.fill();

    // taban plakası
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-88 - LW / 2, -58 - LW / 2, 176 + LW, 50 + LW, 12 + LW / 2); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-88, -58, 176, 50, 12); ctx.fill();
    // parlama + gölge
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-50, -48, 26, 8, -0.2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(20, -34, 62, 22, 8); ctx.fill();
    // LED: nabız
    const ledOn = k.hash(Math.floor(t * 2) + 9) > 0.35;
    ctx.fillStyle = k.rgba('cyan', ledOn ? 0.95 : 0.25);
    ctx.beginPath(); ctx.arc(64, -33, 7, 0, k.TAU); ctx.fill();
    if (ledOn) k.glow(64, -33, 18, 'cyan', 0.3);

    // === sallanma: ±9°, 0.9 sn periyot ===
    const a = Math.sin(t * k.TAU / 0.9) * 0.16;
    const wig = Math.abs(Math.sin(t * k.TAU / 0.9));

    // hareket yayları (uçlarda belirir)
    ctx.strokeStyle = k.rgba('dim', 0.25 + wig * 0.45); ctx.lineWidth = 4;
    for (const s of [-1, 1]) {
      for (let i = 0; i < 2; i++) {
        const r = 52 + i * 16;
        const spread = 0.35 + wig * 0.15;
        const mid = s > 0 ? 0 : Math.PI;
        ctx.beginPath(); ctx.arc(0, -58, r, mid - spread, mid + spread); ctx.stroke();
      }
    }

    // kol (pivot etrafında döner)
    ctx.save();
    ctx.translate(0, -58); ctx.rotate(a);
    // mil
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-11 - LW / 2, -126 - LW / 2, 22 + LW, 74 + LW, 10 + LW / 2); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-11, -126, 22, 74, 10); ctx.fill();
    // topuz
    const bx = 0, by = -148;
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(bx, by, 32 + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); ctx.arc(bx, by, 32, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(bx - 11, by - 12, 11, 7, -0.5, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.arc(bx + 10, by + 12, 14, 0, k.TAU); ctx.fill();
    // topuz altı halka
    ctx.strokeStyle = k.rgba('bg', 0.4); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(bx, by + 26, 12, 0.3, Math.PI - 0.3); ctx.stroke();
    ctx.restore();

    // pivot kapağı
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); ctx.arc(0, -58, 14, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, -58, 14, 0, k.TAU); ctx.stroke();

    ctx.restore();
  },
};

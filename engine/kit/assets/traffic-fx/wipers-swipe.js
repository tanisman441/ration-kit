// traffic-fx/wipers-swipe — silecek hareketi: ön camda periyodik salınan silecek kolu.
// ANIMASYON: canlı idle salınım (2.8 sn döngü: 0.5 sn sağa, 0.5 sn dönüş); `at` anında tek manuel silme (1 sn).
// Tek vurgu yok (gövde dim/panel2); hareket çizgisi ink.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'wipers-swipe',
  category: 'traffic-fx',
  desc: 'Ön camda periyodik salınan silecek; at anında tek manuel silme yapar',
  tags: ['silecek', 'cam', 'yağmur', 'ön cam', 'silme', 'wiper', 'windshield', 'rain', 'swipe', 'car', 'glass'],
  box: [-130, -90, 130, 90],
  bleed: 30,
  anchor: 'cam merkezi (0,0)',
  points: { pivot: [-75, 62], restTip: [-118, -11] },
  params: {
    at: { type: 'time', default: null, desc: 'manuel silme: 1 sn sağa-dönüş salınımı' },
    color: { type: 'color', default: 'dim', desc: 'cam çerçeve rengi' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const manual = d >= 0 && d < 1.0;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const PX = -75, PY = 62, L = 85;

    // salınım oranı 0 (sol) → 1 (sağ)
    let a;
    if (manual) {
      a = d < 0.5 ? k.prog(d, 0, 0.5) : 1 - k.prog(d, 0.5, 1.0);
    } else {
      const ph = t % 2.8;
      if (ph < 1.8) a = 0;
      else if (ph < 2.3) a = k.prog(ph, 1.8, 2.3);
      else a = 1 - k.prog(ph, 2.3, 2.8);
    }
    const ang = -2.1 + a * 1.6; // -120° → -28°
    const TX = PX + Math.cos(ang) * L;
    const TY = PY + Math.sin(ang) * L;

    // --- cam: çerçeve, cam, yansıma bandı ---
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-114, -74, 228, 154, 24); ctx.fill();
    ctx.fillStyle = k.rgba('panel');
    ctx.beginPath(); k.rrect(-120, -80, 240, 160, 24); ctx.fill();
    ctx.fillStyle = k.rgba('cyan', 0.12);
    ctx.beginPath(); k.rrect(-108, -68, 216, 136, 18); ctx.fill();
    // yansıma bandı (beyaz, bilgi taşımaz)
    ctx.fillStyle = k.rgba('#ffffff', 0.08);
    ctx.beginPath();
    ctx.moveTo(-60, -68); ctx.lineTo(-10, -68); ctx.lineTo(-70, 68); ctx.lineTo(-108, 68);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = k.rgba(p.color, 0.65);
    ctx.lineWidth = 6;
    ctx.beginPath(); k.rrect(-120, -80, 240, 160, 24); ctx.stroke();

    // --- salınım yolu: soluk yay ---
    ctx.strokeStyle = k.rgba('ink', 0.22);
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(PX, PY, L, -2.1, -0.5); ctx.stroke();

    // --- silecek kolu: pivot, kol, lastik ---
    ctx.fillStyle = k.rgba('ink', 0.75);
    ctx.beginPath(); ctx.arc(PX, PY, 8, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.75);
    ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(PX, PY); ctx.lineTo(TX, TY); ctx.stroke();
    // lastik: ucun %65'i, daha kalın
    const RX = PX + (TX - PX) * 0.35, RY = PY + (TY - PY) * 0.35;
    ctx.strokeStyle = k.rgba('bg', 0.7);
    ctx.lineWidth = 11;
    ctx.beginPath(); ctx.moveTo(RX, RY); ctx.lineTo(TX, TY); ctx.stroke();

    // --- hareket hissi: hareket yönünün tersine kısa hız çizgisi ---
    const dir = manual ? (d < 0.5 ? 1 : -1) : (a > 0 && a < 1 ? 1 : 0);
    if (dir !== 0 && a > 0.02 && a < 0.98) {
      const va = ang + (dir > 0 ? Math.PI / 2 : -Math.PI / 2); // ucun hız yönü
      ctx.strokeStyle = k.rgba('ink', 0.35);
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(TX - Math.cos(va) * 6, TY - Math.sin(va) * 6);
      ctx.lineTo(TX - Math.cos(va) * 30, TY - Math.sin(va) * 30);
      ctx.stroke();
    }
  },
};

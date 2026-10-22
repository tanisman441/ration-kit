// stage-fx/crowd-surf — kalabalık üstünde sörf yapan kişi.
// Boşta kalabalık zıplar, sörfçü üstlerinde salınır; at anında sörfçü 0.6 sn'de
// havaya kaldırılır. Karakter ailesi oranları: baş:gövde 1:2.6, kalın yuvarlak
// uzuvlar, nokta göz + yay ağız (mood paramı).
// NOT: canvas y-aşağıdır; (0,0) kalabalığın tabanıdır.
export default {
  name: 'crowd-surf', category: 'stage-fx',
  desc: 'Zıplayan kalabalığın elleri üstünde yatay sörf yapan kişi; at anında havaya kalkar',
  tags: ['kalabalık', 'konser', 'sörf', 'sahne', 'eğlence', 'crowd', 'surf', 'concert', 'stage', 'party'],
  box: [-220, -305, 220, 60],
  bleed: 25,
  anchor: 'kalabalığın tabanı (0,0)',
  points: { surfer: [0, -200], head: [-70, -200], crowd: [0, -60] },
  params: {
    at: { type: 'time', default: null, desc: 'sörfçünün havaya kaldırıldığı an (0.6 sn yükselme)' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'surprised'], default: 'happy', desc: 'sörfçü yüz ifadesi' },
    color: { type: 'color', default: 'accent', desc: 'sörfçü tişört rengi' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    const d = p.at == null ? -1 : t - p.at;
    const lift = d < 0 ? 0 : k.E.outExpo(k.prog(d, 0, 0.6));   // havaya kalkış

    // ---- zemin gölgesi ----
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(0, 8, 165, 12, 0, 0, k.TAU); ctx.fill();

    // ---- kalabalık (arkadan görünüm: baş + omuz + kalkan kollar) ----
    const N = 6;
    for (let i = 0; i < N; i++) {
      const x = -150 + i * 60;
      const bob = Math.sin(t * k.TAU / 1.6 + i * 1.1) * 7;   // zıplama
      const liftBoost = lift * (i === 2 || i === 3 ? 14 : 6); // kaldırırken uzanma
      // omuzlar
      ctx.fillStyle = k.rgba(i % 2 ? 'dim' : 'panel2', 0.95);
      k.rrect(x - 30, -52 + bob, 60, 56, 14); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
      k.rrect(x - 30, -52 + bob, 60, 56, 14); ctx.stroke();
      // baş (arka)
      ctx.fillStyle = k.rgba('panel2', 0.95);
      ctx.beginPath(); ctx.arc(x, -74 + bob, 22, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(x, -74 + bob, 22, 0, k.TAU); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(x - 8, -82 + bob, 7, 5, -0.5, 0, k.TAU); ctx.fill();
      // kalkan kollar (havada duran ince çizgiler DEĞİL: kalın uzuv → dim)
      const reach = 1 + lift * 0.35;
      ctx.strokeStyle = k.rgba('dim', 0.95); ctx.lineWidth = 12;
      const hL = -128 * reach + bob * 1.4 - liftBoost, hR = -118 * reach + bob * 1.4 - liftBoost;
      ctx.beginPath(); ctx.moveTo(x - 18, -40 + bob); ctx.lineTo(x - 30, hL); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + 18, -40 + bob); ctx.lineTo(x + 30, hR); ctx.stroke();
      // eller
      ctx.fillStyle = k.rgba('panel2', 0.95);
      ctx.beginPath(); ctx.arc(x - 30, hL, 8, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(x + 30, hR, 8, 0, k.TAU); ctx.fill();
    }

    // ---- sörfçü (yatay, üstte) ----
    const baseY = -150 - 65 * lift;              // at öncesi alçak, sonra yüksek
    const sy = baseY + Math.sin(t * k.TAU / 1.6 + 0.5) * 9;   // salınım
    const hx = -72;                              // baş merkezi x
    const hw = 40;                               // baş genişliği
    const limbW = Math.round(hw * 0.28);         // uzuv kalınlığı

    // destekleyen eller (sörfçünün altında)
    ctx.fillStyle = k.rgba('panel2', 0.95);
    for (const sx of [-30, 10, 46]) {
      ctx.beginPath(); ctx.arc(sx, sy + 26, 8, 0, k.TAU); ctx.fill();
    }

    // bacaklar (birleşik, hafif bükük)
    ctx.strokeStyle = k.rgba('dim', 0.95); ctx.lineWidth = limbW;
    ctx.beginPath(); ctx.moveTo(52, sy - 4); ctx.lineTo(108, sy - 14); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(52, sy + 10); ctx.lineTo(108, sy + 2); ctx.stroke();
    // ayaklar (kısa yatay rrect)
    ctx.fillStyle = k.rgba('ink', 0.85);
    k.rrect(104, -20 + sy, 22, 10, 4); ctx.fill();
    k.rrect(104, -4 + sy, 22, 10, 4); ctx.fill();

    // gövde (yatay rrect, baş:gövde 1:2.6)
    ctx.fillStyle = k.rgba(acc, 0.95);
    k.rrect(-52, sy - 20, 104, 40, 16); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    k.rrect(-52, sy - 20, 104, 40, 16); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';     // sol üst parlama
    ctx.beginPath(); ctx.ellipse(-30, sy - 8, 12, 7, -0.3, 0, k.TAU); ctx.fill();

    // kollar: biri havada (zafer), biri yana açık
    ctx.strokeStyle = k.rgba(acc, 0.95); ctx.lineWidth = limbW;
    ctx.beginPath(); ctx.moveTo(-24, sy - 12); ctx.lineTo(-38, sy - 66); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(16, sy + 8); ctx.lineTo(64, sy + 26); ctx.stroke();
    ctx.fillStyle = k.rgba('panel2', 0.95);       // eller
    ctx.beginPath(); ctx.arc(-38, sy - 66, 7, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(64, sy + 26, 7, 0, k.TAU); ctx.fill();

    // baş (hafif basık daire, öne dönük)
    ctx.fillStyle = k.rgba('panel2', 0.95);
    ctx.beginPath(); ctx.ellipse(hx, sy, hw * 0.46, hw * 0.5, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.ellipse(hx, sy, hw * 0.46, hw * 0.5, 0, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(hx - 7, sy - 7, 6, 4.5, -0.5, 0, k.TAU); ctx.fill();
    // yüz (aile dili)
    const er = hw * 0.055, esp = hw * 0.22;
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 3;
    const mood = p.mood || 'happy';
    if (mood === 'happy') {
      for (const s of [-1, 1]) {
        ctx.beginPath(); ctx.arc(hx + s * esp / 2, sy - 3, er + 1.5, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(hx, sy + 6, 7, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
    } else if (mood === 'surprised') {
      for (const s of [-1, 1]) {
        ctx.beginPath(); ctx.arc(hx + s * esp / 2, sy - 3, er + 1.5, 0, k.TAU); ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(hx, sy + 7, 4.5, 0, k.TAU); ctx.stroke();
    } else {
      for (const s of [-1, 1]) {
        ctx.beginPath(); ctx.arc(hx + s * esp / 2, sy - 3, er, 0, k.TAU); ctx.stroke();
      }
      ctx.beginPath(); ctx.moveTo(hx - 6, sy + 7); ctx.lineTo(hx + 6, sy + 7); ctx.stroke();
    }

    ctx.restore();
  },
};

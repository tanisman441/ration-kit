// school-fx-2/class-dismiss — ders bitişi: sınıf kapısından öğrenci akını:
// at öncesinde kapı hafif aralıktır (içeriden ışık sızar); at anında kapı
// 0.6 snde açılır ve karakter ailesi oranlarında 4 figür kapıdan dışarı akar.
// canvas y-aşağı; (0,0) kapı merkezi.
export default {
  name: 'class-dismiss', category: 'school-fx-2',
  desc: 'Ders bitişi: at anında kapı açılır, dört öğrenci figürü dışarı akar',
  tags: ['ders bitişi', 'teneffüs', 'kapı', 'öğrenci', 'çıkış', 'class', 'dismiss', 'door', 'students', 'okul', 'zil'],
  box: [-140, -130, 170, 70],
  bleed: 20,
  anchor: 'kapı merkezi',
  points: { door: [0, -30], exit: [160, 40] },
  params: {
    color: { type: 'color', default: 'accent', desc: 'kapı kanadı rengi' },
    at: { type: 'time', default: null, desc: 'kapının açılma anı (0.6 sn açılma + öğrenci akını)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.at == null ? -1 : t - p.at;

    // kapı açısı: 0 = kapalı; idle'da hafif aralık + gıcırtı
    let phi = 0.28 + 0.04 * Math.sin(t * 0.9);
    if (d >= 0) phi = d < 0.6 ? 0.28 + 0.97 * k.E.outCubic(k.prog(d, 0, 0.6)) : 1.25;
    const openFrac = phi / 1.25;
    const DP = (u, v) => [-38 + u * 76 * Math.cos(phi), -108 + v * 148 + u * 10 * Math.sin(phi)];

    // kasa direkleri
    for (const px of [-52, 38]) {
      ctx.fillStyle = k.rgba('bg', 0.55);
      ctx.beginPath(); k.rrect(px - 3, -115, 20, 158, 8); ctx.fill();
      ctx.fillStyle = k.rgba('dim', 1);
      ctx.beginPath(); k.rrect(px, -112, 14, 152, 8); ctx.fill();
    }
    // lento
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-62, -129, 124, 22, 8); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.beginPath(); k.rrect(-59, -126, 118, 18, 7); ctx.fill();

    // iç karanlık
    ctx.fillStyle = k.rgba('bg', 0.75);
    ctx.beginPath(); k.rrect(-38, -108, 76, 148, 4); ctx.fill();
    // aralıktan sızan ışık
    k.glow(24, -30, 85, 'yellow', 0.22 * openFrac);

    // öğrenciler (baş:gövde 1:2.6 — kapının arkasından belirir)
    const cols = ['dim', 'panel2', 'dim', 'panel2'];
    for (let i = 0; i < 4; i++) {
      const dd = d - (0.12 + i * 0.3);
      if (dd < 0) continue;
      const g = k.prog(dd, 0, 1.15);
      const x = k.lerp(-14, 158, g);
      const gy = 40 - 3.5 * Math.abs(Math.sin(dd * 9));   // yürüyüş sekmesi
      const ph = dd * 9, bc = cols[i];

      ctx.save();
      ctx.translate(x, gy); ctx.scale(0.8, 0.8);
      // bacaklar
      ctx.strokeStyle = k.rgba(bc, 1); ctx.lineWidth = 10; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-9, -34); ctx.lineTo(-9 + 13 * Math.sin(ph), -2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(9, -34); ctx.lineTo(9 - 13 * Math.sin(ph), -2); ctx.stroke();
      // ayaklar
      ctx.fillStyle = k.rgba(bc, 1);
      ctx.beginPath(); k.rrect(-9 + 13 * Math.sin(ph) - 8, -8, 18, 8, 4); ctx.fill();
      ctx.beginPath(); k.rrect(9 - 13 * Math.sin(ph) - 8, -8, 18, 8, 4); ctx.fill();
      // gövde
      ctx.fillStyle = k.rgba('bg', 0.55);
      ctx.beginPath(); k.rrect(-21, -131, 42, 100, 16); ctx.fill();
      ctx.fillStyle = k.rgba(bc, 1);
      ctx.beginPath(); k.rrect(-18, -128, 36, 94, 14); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-8, -112, 7, 16, 0.2, 0, k.TAU); ctx.fill();
      // kollar (bacaklara ters faz)
      ctx.strokeStyle = k.rgba(bc, 1); ctx.lineWidth = 10; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-17, -104); ctx.lineTo(-17 - 11 * Math.sin(ph), -70); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(17, -104); ctx.lineTo(17 + 11 * Math.sin(ph), -70); ctx.stroke();
      // baş (hafif basık daire)
      ctx.fillStyle = k.rgba('bg', 0.55);
      ctx.beginPath(); ctx.ellipse(2, -146, 18.5, 20, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('panel2', 1);
      ctx.beginPath(); ctx.ellipse(0, -148, 16.5, 18, 0, 0, k.TAU); ctx.fill();
      // yüz
      ctx.fillStyle = k.rgba('ink', 0.75);
      ctx.beginPath(); ctx.arc(-7.9, -150, 2, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(7.9, -150, 2, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 2.5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-5, -140); ctx.quadraticCurveTo(0, -137, 5, -140); ctx.stroke();
      ctx.restore();
    }

    // kapı kanadı (menteşe solda — öğrencilerin önünde, açılan kapı gibi)
    const q00 = DP(0, 0), q10 = DP(1, 0), q11 = DP(1, 1), q01 = DP(0, 1);
    ctx.beginPath();
    ctx.moveTo(q00[0], q00[1]); ctx.lineTo(q10[0], q10[1]);
    ctx.lineTo(q11[0], q11[1]); ctx.lineTo(q01[0], q01[1]);
    ctx.closePath();
    ctx.fillStyle = k.rgba(p.color, 1); ctx.fill();
    ctx.lineWidth = 5; ctx.strokeStyle = k.rgba('bg', 0.55); ctx.stroke();
    const dh = DP(0.2, 0.14);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(dh[0], dh[1], 8, 20, 0.15, 0, k.TAU); ctx.fill();
    const kh = DP(0.85, 0.55);
    ctx.fillStyle = k.rgba('ink', 1);
    ctx.beginPath(); ctx.arc(kh[0], kh[1], 6, 0, k.TAU); ctx.fill();
    ctx.restore();
  },
};

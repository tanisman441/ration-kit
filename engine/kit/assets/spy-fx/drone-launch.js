// spy-fx/drone-launch — casus dron: `at` anında yerden kalkıyor (y yükseliyor),
// pervaneler sürekli dönüyor, gövde havada hafif süzülüyor.
// NOT: canvas y-aşağıdır; (0,0) dron gövdesinin merkezidir (kalkış öncesi konum).
export default {
  name: 'drone-launch',
  category: 'spy-fx',
  desc: 'Küçük casus dron: pervaneler dönerek yerden kalkıyor, havada süzülüyor',
  tags: ['dron', 'uçuş', 'kalkış', 'ajan', 'gözetleme', 'pervane', 'drone', 'launch', 'spy', 'surveillance', 'uav'],
  box: [-150, -130, 150, 130],
  bleed: 60,
  anchor: 'dron gövde merkezi (0,0) — kalkış öncesi konum',
  points: { camera: [0, 6], pad: [0, 78], rotor_l: [-78, -34], rotor_r: [78, -34] },
  params: {
    at: { type: 'time', default: null, desc: 'kalkış anı: dron 0.8 snde yükselir, toz bulutu çıkar' },
    color: { type: 'color', default: 'dim', desc: 'dron gövde rengi' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    ctx.save();

    // kalkış eğrisi: 0.1–0.9 sn arası -90 birim yükselir (y-aşağı: negatif = yukarı)
    const lift = d < 0 ? 0 : k.clamp(k.prog(d, 0.1, 0.95), 0, 1);
    const yOff = -k.E.outCubic(lift) * 95;

    // iniş pisti — dron kalkınca soluklaşır
    const padA = 1 - lift * 0.55;
    ctx.fillStyle = k.rgba('panel2', 0.9 * padA);
    ctx.beginPath(); k.rrect(-72, 70, 144, 16, 8); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55 * padA); ctx.lineWidth = 4; ctx.stroke();
    ctx.strokeStyle = k.rgba('yellow', 0.7 * padA); ctx.lineWidth = 3;
    ctx.setLineDash([10, 8]);
    ctx.beginPath(); ctx.moveTo(-64, 78); ctx.lineTo(64, 78); ctx.stroke();
    ctx.setLineDash([]);

    // kalkış tozu — ilk 0.7 sn
    if (d >= 0 && d < 0.7) {
      const g = k.prog(d, 0, 0.7);
      for (let i = 0; i < 8; i++) {
        const h1 = k.hash(i * 19 + 21), h2 = k.hash(i * 37 + 2);
        const side = h1 > 0.5 ? 1 : -1;
        const x = side * (20 + h2 * 80 * k.E.outCubic(g));
        const y = 84 - g * (10 + h1 * 26);
        ctx.fillStyle = k.rgba('dim', 0.35 * (1 - g));
        ctx.beginPath(); ctx.arc(x, y, 6 + g * 12, 0, k.TAU); ctx.fill();
      }
    }

    // dron gövdesi
    ctx.save();
    ctx.translate(0, yOff);
    // havada süzülme: kalkıştan sonra hafif salınım + eğim
    const air = lift > 0.5 ? (lift - 0.5) * 2 : 0;
    ctx.translate(k.noise1(t * 1.4) * 4 * air, Math.sin(t * 2.3) * 3 * air);
    ctx.rotate(k.noise1(t * 1.1 + 9) * 0.05 * air);

    // kollar (4 kol: iki yanda, önde/arkada hissi için iki yükseklik)
    ctx.lineCap = 'round';
    for (const s of [-1, 1]) {
      for (const [ry, rw] of [[-22, 10], [-46, 8]]) {
        ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = rw + 4;
        ctx.beginPath(); ctx.moveTo(s * 30, -18); ctx.lineTo(s * 78, ry); ctx.stroke();
        ctx.strokeStyle = k.rgba(p.color); ctx.lineWidth = rw;
        ctx.beginPath(); ctx.moveTo(s * 30, -18); ctx.lineTo(s * 78, ry); ctx.stroke();
      }
    }

    // pervaneler — sürekli dönüyor (dönüş hızı kalkışla artar)
    const spin = t * (10 + lift * 26);
    for (const s of [-1, 1]) {
      for (const ry of [-22, -46]) {
        const px = s * 78;
        // pervane diski (bulanık daire)
        ctx.fillStyle = k.rgba('ink', 0.16);
        ctx.beginPath(); ctx.ellipse(px, ry, 34, 9, 0, 0, k.TAU); ctx.fill();
        // iki kanat
        ctx.save(); ctx.translate(px, ry); ctx.rotate(spin + (s < 0 ? 1.7 : 0));
        ctx.fillStyle = k.rgba('ink', 0.75);
        ctx.beginPath(); ctx.ellipse(17, 0, 17, 4.5, 0, 0, k.TAU); ctx.fill();
        ctx.beginPath(); ctx.ellipse(-17, 0, 17, 4.5, 0, 0, k.TAU); ctx.fill();
        ctx.restore();
        // motor göbeği
        ctx.fillStyle = k.rgba('panel2');
        ctx.beginPath(); ctx.arc(px, ry, 8, 0, k.TAU); ctx.fill();
        ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3; ctx.stroke();
      }
    }

    // gövde
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-46, -30, 92, 52, 20); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5; ctx.stroke();
    // premium finish: sol üst parlama + sağ alt gölge
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(-24, -16, 16, 12, -0.3, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(24, 12, 18, 10, -0.3, 0, k.TAU); ctx.fill();

    // kamera gözü + kayıt LED'i
    ctx.fillStyle = k.rgba('bg', 0.75);
    ctx.beginPath(); ctx.arc(0, 4, 13, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('cyan', 0.9);
    ctx.beginPath(); ctx.arc(0, 4, 7, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.arc(-2.5, 1.5, 2.5, 0, k.TAU); ctx.fill();
    const led = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 6.5));
    ctx.fillStyle = k.rgba('red', led);
    ctx.beginPath(); ctx.arc(24, -16, 4.5, 0, k.TAU); ctx.fill();
    k.glow(24, -16, 18, 'red', 0.4 * led);

    // iniş kızakları
    ctx.lineCap = 'round';
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 6;
    for (const s of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(s * 26, 20); ctx.lineTo(s * 30, 40); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s * 12, 40); ctx.lineTo(s * 48, 40); ctx.stroke();
    }
    ctx.restore();
    ctx.restore();
  },
};

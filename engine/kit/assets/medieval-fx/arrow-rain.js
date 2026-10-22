// medieval-fx/arrow-rain — ok yağmuru: at anında gökten oklar iner, yere saplanır.
// Boşta yere saplı 3 ok hafifçe titrer; olayda (1.6 sn) oklar gecikmeli iner,
// her saplanmada toz bulutu çıkar, saplanan oklar sönümlenerek sallanır.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) = zemin.
export default {
  name: 'arrow-rain', category: 'medieval-fx',
  desc: 'Ok yağmuru; at anında oklar gökten inip yere saplanır, toz bulutları çıkar',
  tags: ['ok', 'yağmur', 'savaş', 'saldırı', 'ortaçağ', 'arrow', 'rain', 'volley', 'medieval', 'war'],
  box: [-190, -280, 190, 20],
  bleed: 70,
  anchor: 'zemin (0,0)',
  points: { sky: [0, -270], ground: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'ok yağmuru anı (1.6 sn: iniş + saplanma + toz)' },
    count: { type: 'number', default: 12, desc: 'uçan ok sayısı (4–20)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const shaftC = k.rgba('dim', 1), headC = k.rgba('ink', 0.85), flC = k.rgba('red', 0.95);
    const d = p.at == null ? -1 : t - p.at;
    const raining = d >= 0 && d < 1.6;
    ctx.lineCap = 'round';

    ctx.save();
    ctx.beginPath(); ctx.rect(-260, -350, 520, 400); ctx.clip();

    // tek ok çizen yardımcı: (x,y)=uç noktası, ang=yön açısı, s=boy çarpanı
    const arrow = (x, y, ang, s) => {
      const L = 74 * s;
      const tx = x - Math.cos(ang) * L, ty = y - Math.sin(ang) * L;
      ctx.strokeStyle = line; ctx.lineWidth = 6 + LW;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(tx, ty); ctx.stroke();
      ctx.strokeStyle = shaftC; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(tx, ty); ctx.stroke();
      // uç
      ctx.fillStyle = line;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(ang) * 12, y + Math.sin(ang) * 12);
      ctx.lineTo(x - Math.cos(ang + 0.35) * 10, y - Math.sin(ang + 0.35) * 10);
      ctx.lineTo(x - Math.cos(ang - 0.35) * 10, y - Math.sin(ang - 0.35) * 10);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = headC;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(ang) * 10, y + Math.sin(ang) * 10);
      ctx.lineTo(x - Math.cos(ang + 0.35) * 8, y - Math.sin(ang + 0.35) * 8);
      ctx.lineTo(x - Math.cos(ang - 0.35) * 8, y - Math.sin(ang - 0.35) * 8);
      ctx.closePath(); ctx.fill();
      // tüyler (kırmızı vurgu)
      ctx.strokeStyle = flC; ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(tx, ty); ctx.lineTo(tx + Math.cos(ang + 0.5) * 14, ty + Math.sin(ang + 0.5) * 14); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(tx, ty); ctx.lineTo(tx + Math.cos(ang - 0.5) * 14, ty + Math.sin(ang - 0.5) * 14); ctx.stroke();
    };

    // zemin şeridi + çim tutamları (rüzgârda hafif sallanır)
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-260, -14, 520, 30, 8); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 1); ctx.beginPath(); k.rrect(-256, -16, 512, 26, 8); ctx.fill();
    for (let i = 0; i < 14; i++) {
      const gx = -180 + i * 28 + (k.hash(i * 3 + 2) - 0.5) * 14;
      const sw = k.noise1(t * 1.8 + i * 1.3) * 5;
      ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(gx, -14); ctx.quadraticCurveTo(gx + sw, -22, gx + sw * 1.6, -30 - k.hash(i + 9) * 8); ctx.stroke();
    }

    // yere saplı oklar: boşta 3 tane, olayda saplananlar eklenir
    const stuck = [];
    for (let i = 0; i < 3; i++) {
      const sx = -120 + i * 110 + (k.hash(i * 5 + 1) - 0.5) * 30;
      const ang = Math.PI / 2 + (k.hash(i * 7 + 3) - 0.5) * 0.35; // ucu aşağı gösterir
      const trem = k.noise1(t * 2.4 + i * 3.1) * 0.03;
      stuck.push({ x: sx, y: -12, ang: ang + trem, s: 0.9 + k.hash(i * 11 + 4) * 0.2 });
    }

    // yağmur olayı
    if (raining) {
      const n = Math.max(4, Math.min(20, Math.round(p.count)));
      for (let i = 0; i < n; i++) {
        const delay = k.hash(i * 13 + 5) * 0.6;      // gecikmeli iniş
        const landX = -170 + k.hash(i * 17 + 6) * 340;
        const landY = -12;
        const ang = Math.PI / 2 + (k.hash(i * 19 + 7) - 0.5) * 0.5; // dikine yakın
        const flight = 0.65;
        const ld = d - delay;                        // bu ok için yerel zaman
        if (ld < 0) continue;
        const g = Math.min(ld / flight, 1);
        const e = 1 - Math.pow(1 - g, 2.2);          // hızlanan iniş
        const tipY = -340 + (landY + 340) * e;
        const tipX = landX;
        if (g < 1) {
          // havada: hafif titreme
          const wob = k.noise1(t * 14 + i * 7) * 6;
          arrow(tipX + wob * 0.3, tipY, ang + wob * 0.004, 1);
        } else {
          // saplandı: sönümlü sallantı + toz
          const sd2 = ld - flight;
          const wob = Math.sin(sd2 * 22) * Math.exp(-sd2 * 5) * 0.16;
          stuck.push({ x: tipX, y: landY, ang: ang + wob, s: 1 });
          if (sd2 >= 0 && sd2 < 0.45) {
            const gg = k.prog(sd2, 0, 0.45), al = 1 - gg;
            for (let j = 0; j < 4; j++) {
              const px = tipX + (k.hash(i * 23 + j * 3 + 8) - 0.5) * (14 + gg * 46);
              ctx.fillStyle = k.rgba('dim', 0.5 * al);
              ctx.beginPath(); ctx.arc(px, -10 - gg * 20 * k.hash(j * 5 + i), 5 + gg * 8, 0, k.TAU); ctx.fill();
            }
          }
        }
      }
    }
    // saplı okları çiz (uç zemine gömülü)
    for (const s2 of stuck) arrow(s2.x, s2.y, s2.ang, s2.s);

    ctx.restore();
  },
};

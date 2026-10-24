// karaoke-fx/encore-bow — şarkıcı selam verir: at anında öne eğilir (0.3–1.0 sn),
// bekler, sonra doğrulur. Boşta nefes + hafif salınım. Karakter oranları STYLE.md'den.
// Contract: engine/kit/ASSETS.md — NOT: canvas y-aşağıdır; (0,0) ayaklar (zemin).
export default {
  name: 'encore-bow', category: 'karaoke-fx',
  desc: 'Şarkıcı selam verir; at anında öne eğilir, bekler, sonra doğrulur',
  tags: ['selam', 'bow', 'eğilme', 'encore', 'alkış', 'şarkıcı', 'sahne', 'teşekkür', 'singer', 'stage', 'applause'],
  box: [-120, -230, 120, 12],
  bleed: 35,
  anchor: 'ayaklar (0,0); zemin',
  points: { head: [0, -200], feet: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'kıyafet rengi' },
    at: { type: 'time', default: null, desc: 'selam anı: 0.3–1.0 sn eğilme, sonra doğrulma' },
  },
  draw(ctx, t, p, k) {
    const LW = 4;
    const d = p.at == null ? -1 : t - p.at;
    const line = k.rgba('bg', 0.55);
    const inkC = k.rgba('ink', 0.8);
    const body = k.rgba(p.color);
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // eğilme eğrisi: 0 → 1 (0.3 sn in), 1 tut (0.4 sn), 1 → 0 (0.5 sn out)
    let bow = 0;
    if (d >= 0) {
      if (d < 0.3) bow = 1 - Math.pow(1 - d / 0.3, 2);
      else if (d < 0.7) bow = 1;
      else if (d < 1.2) bow = 1 - k.prog(d, 0.7, 1.2);
      else bow = 0;
    }
    // boşta hafif salınım
    const sway = Math.sin(t * 1.3) * 0.03 * (1 - bow);
    const breathe = Math.sin(t * 1.6) * 2 * (1 - bow);

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.3);
    ctx.beginPath(); ctx.ellipse(0, 4, 34, 7, 0, 0, k.TAU); ctx.fill();

    // bacaklar (sabit)
    ctx.strokeStyle = line; ctx.lineWidth = 15 + LW;
    ctx.beginPath(); ctx.moveTo(-9, -72); ctx.lineTo(-9, -4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(9, -72); ctx.lineTo(9, -4); ctx.stroke();
    ctx.strokeStyle = body; ctx.lineWidth = 15;
    ctx.beginPath(); ctx.moveTo(-9, -72); ctx.lineTo(-9, -4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(9, -72); ctx.lineTo(9, -4); ctx.stroke();
    // ayaklar
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-20 - LW / 2, -8 - LW / 2, 22 + LW, 10 + LW, 4); ctx.fill();
    ctx.beginPath(); k.rrect(-2 - LW / 2, -8 - LW / 2, 22 + LW, 10 + LW, 4); ctx.fill();
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); k.rrect(-20, -8, 22, 10, 4); ctx.fill();
    ctx.beginPath(); k.rrect(-2, -8, 22, 10, 4); ctx.fill();

    // üst gövde: kalça pivotu (0,-95) etrafında öne eğilir
    ctx.save();
    ctx.translate(0, -95 + breathe * 0.4);
    ctx.rotate(sway + bow * 0.95);
    ctx.translate(0, 95 - breathe * 0.4);

    // gövde (rrect): kalça -95'ten omuz -150'ye
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-22 - LW / 2, -152 - LW / 2, 44 + LW, 62 + LW, 14); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); k.rrect(-22, -152, 44, 62, 14); ctx.fill();
    // sağ alt gölge + sol üst parlama
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(8, -118, 12, 26, 6); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); k.rrect(-17, -146, 8, 44, 4); ctx.fill();
    // yaka / papyon
    ctx.fillStyle = k.rgba('accent');
    ctx.beginPath(); ctx.moveTo(-8, -148); ctx.lineTo(0, -142); ctx.lineTo(8, -148); ctx.lineTo(0, -154); ctx.closePath(); ctx.fill();

    // kollar: eğilince öne sarkar, doğrulunca yana açılır (alkış karşılar gibi)
    const armSpread = bow * 0.5 + (1 - bow) * 0.15;
    const handY = -96 + bow * 26;
    ctx.strokeStyle = line; ctx.lineWidth = 13 + LW;
    ctx.beginPath(); ctx.moveTo(-21, -142); ctx.lineTo(-30 - armSpread * 20, handY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(21, -142); ctx.lineTo(30 + armSpread * 20, handY); ctx.stroke();
    ctx.strokeStyle = body; ctx.lineWidth = 13;
    ctx.beginPath(); ctx.moveTo(-21, -142); ctx.lineTo(-30 - armSpread * 20, handY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(21, -142); ctx.lineTo(30 + armSpread * 20, handY); ctx.stroke();

    // baş (STYLE.md: baş genişliğinin 0.92'si yükseklik)
    const hy = -172;
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(0, hy, 22 + LW / 2, 20 + LW / 2, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.ellipse(0, hy, 22, 20, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-8, hy - 7, 7, 5, -0.4, 0, k.TAU); ctx.fill();
    // gözler: eğilince kapalı yay (mutlu), dikken nokta
    if (bow > 0.5) {
      ctx.strokeStyle = inkC; ctx.lineWidth = 3.2;
      for (const sd of [-1, 1]) {
        ctx.beginPath(); ctx.arc(sd * 9, hy - 2, 4.5, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      }
    } else {
      ctx.fillStyle = inkC;
      ctx.beginPath(); ctx.arc(-9, hy - 2, 2.6, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(9, hy - 2, 2.6, 0, k.TAU); ctx.fill();
    }
    // ağız: gülümseme yayı
    ctx.strokeStyle = inkC; ctx.lineWidth = 3.2;
    ctx.beginPath(); ctx.arc(0, hy + 6, 7, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();

    // eldeki mikrofon (sağ el)
    const mx = 30 + armSpread * 20, my = handY;
    ctx.save();
    ctx.translate(mx, my); ctx.rotate(0.5 - bow * 0.4);
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-5 - LW / 2, -8 - LW / 2, 10 + LW, 26 + LW, 5); ctx.fill();
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); k.rrect(-5, -8, 10, 26, 5); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.arc(0, -12, 9, 0, k.TAU); ctx.fill();
    ctx.restore();

    ctx.restore();

    // selam anında alkış yıldızları (0.5–1.1 sn)
    if (d >= 0.5 && d < 1.1) {
      for (let i = 0; i < 6; i++) {
        const h1 = k.hash(i * 13 + 7), h2 = k.hash(i * 29 + 19);
        const dd = d - 0.5;
        const x = (h1 - 0.5) * 170;
        const y = -120 - dd * 90 - h2 * 40;
        const fade = 1 - k.prog(dd, 0.1, 0.6);
        if (fade <= 0) continue;
        ctx.fillStyle = k.rgba('yellow', 0.9 * fade);
        ctx.beginPath(); ctx.arc(x, y, 3 + h2 * 3, 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore();
  },
};

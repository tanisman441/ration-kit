// orchestra-fx/harp-pluck — arp tellerinden biri döngüsel olarak çekilir; çekilen tel titreşir, nota yükselir. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) arpın (ses tablası ortası) merkezidir.
export default {
  name: 'harp-pluck', category: 'orchestra-fx',
  desc: 'Üçgen gövdeli arpın tellerinden sırayla biri çekilir; çekilen tel titreşerek yana esner, ucundan bir nota yükselir',
  tags: ['arp', 'tel', 'çekme', 'titreşim', 'nota', 'orkestra', 'müzik', 'harp', 'pluck', 'strings', 'vibration', 'note', 'orchestra', 'music'],
  box: [-120, -115, 120, 115],
  bleed: 20,
  anchor: 'arpın gövde (ses tablası) merkezi (0,0); direk solda, tabla sağa eğik',
  points: { top: [-60, -95], pluck: [28, 8], base: [-78, 92] },
  params: {
    color: { type: 'color', default: 'dim' },
    speed: { type: 'number', default: 1, desc: 'çekme temposu çarpanı (1 = ~1.2 sn bir tel çekişi)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const sp = p.speed || 1;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.save();

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // arp gövdesi: sol direk (dikey), üst boyun (eğik), sağ ses tablası (eğik), alt taban
    // direk
    ctx.strokeStyle = line; ctx.lineWidth = 15;
    ctx.beginPath(); ctx.moveTo(-88, -96); ctx.lineTo(-88, 92); ctx.stroke();
    ctx.strokeStyle = body; ctx.lineWidth = 11;
    ctx.beginPath(); ctx.moveTo(-88, -96); ctx.lineTo(-88, 92); ctx.stroke();
    // premium parlama (direk sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-92, -70, 4, 22, 0.08, 0, k.TAU); ctx.fill();
    // boyun (üst eğik kiriş): direkten tablaya
    ctx.strokeStyle = line; ctx.lineWidth = 13;
    ctx.beginPath(); ctx.moveTo(-88, -96); ctx.lineTo(96, -30); ctx.stroke();
    ctx.strokeStyle = body; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(-88, -96); ctx.lineTo(96, -30); ctx.stroke();
    // ses tablası (sağ eğik): boyundan tabana
    ctx.strokeStyle = line; ctx.lineWidth = 15;
    ctx.beginPath(); ctx.moveTo(96, -30); ctx.lineTo(78, 96); ctx.stroke();
    ctx.strokeStyle = k.rgba('panel2'); ctx.lineWidth = 11;
    ctx.beginPath(); ctx.moveTo(96, -30); ctx.lineTo(78, 96); ctx.stroke();
    // taban
    blob(-96, 88, 178, 16, 8, k.rgba('panel2'));
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(30, 106, 44, 5, 0, 0, k.TAU); ctx.fill();
    // boyun üstü süs kıvrımı
    ctx.strokeStyle = line; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.arc(-88, -100, 9, 0, k.TAU); ctx.stroke();
    ctx.strokeStyle = k.rgba('accent', 0.9); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(-88, -100, 9, 0, k.TAU); ctx.stroke();

    // teller: boyundan ses tablasına 7 tel (ink, serbest çizgi kuralı)
    // tel i: üst nokta boyun üzerinde, alt nokta tabla üzerinde
    const strings = [];
    for (let i = 0; i < 7; i++) {
      const f = i / 6;
      const xTop = -88 + f * 184;
      const yTop = -96 + f * 66;
      const xBot = 96 - f * 18;
      const yBot = -30 + f * 126;
      strings.push([xTop, yTop, xBot, yBot]);
    }
    // çekme döngüsü: her ~1.2 sn bir tel; çekilen tel titreşir
    const cycle = 1.2 / sp;
    const ph = t % cycle;
    const idx = Math.floor(t / cycle) % 7;
    for (let i = 0; i < 7; i++) {
      const [x0, y0, x1, y1] = strings[i];
      const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
      let dx = 0;
      if (i === idx) dx = 13 * Math.exp(-ph * 2.6) * Math.sin(ph * k.TAU * 4.5);
      ctx.strokeStyle = k.rgba('ink', i === idx ? 0.95 : 0.7);
      ctx.lineWidth = i === idx ? 2.6 : 1.8;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(mx + dx, my);
      ctx.lineTo(x1, y1);
      ctx.stroke();
      // tel pimleri (üst + alt)
      ctx.fillStyle = k.rgba('ink', 0.6);
      ctx.beginPath(); ctx.arc(x0, y0, 2.2, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(x1, y1, 2.2, 0, k.TAU); ctx.fill();
    }

    // çekilen telden yükselen nota
    const [px0, py0, px1, py1] = strings[idx];
    const pmx = (px0 + px1) / 2, pmy = (py0 + py1) / 2;
    const rise = ph / cycle;
    const ny = pmy - 18 - rise * 34;
    const na = ph < 0.85 ? 0.9 * (1 - rise * 0.6) : 0;
    if (na > 0.02) {
      ctx.save(); ctx.translate(pmx + 14, ny); ctx.scale(0.85, 0.85); ctx.globalAlpha = na;
      ctx.fillStyle = k.rgba('accent');
      ctx.beginPath(); ctx.ellipse(0, 0, 6, 4.5, -0.3, 0, k.TAU); ctx.fill();
      ctx.fillRect(4.5, -16, 2.6, 16);
      ctx.beginPath(); ctx.moveTo(7, -16); ctx.quadraticCurveTo(15, -13, 13, -6); ctx.lineTo(7, -9); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    // çekme anında tel ortasında küçük parıltı
    if (ph < 0.25) {
      k.glow(pmx + 13 * Math.exp(-ph * 2.6) * Math.sin(ph * k.TAU * 4.5), pmy, 10, 'yellow', 0.4 * (1 - ph / 0.25));
    }

    ctx.restore();
  },
};

// birthday-fx/cake-slice — yuvarlak pasta ve bıçak; at anında bıçak iner, dilim ayrılıp kayar.
// NOT: canvas y-aşağıdır; (0,0) pasta tabanıdır, bıçak negatif y yönünde yukarıdadır.
export default {
  name: 'cake-slice', category: 'birthday-fx',
  desc: 'Yuvarlak doğum günü pastası; bıçak inip bir dilimi keser, dilim yana kayar',
  tags: ['pasta', 'dilim', 'bıçak', 'kesmek', 'doğum günü', 'servis', 'cake', 'slice', 'knife', 'cut', 'birthday', 'serve'],
  box: [-160, -170, 175, 30],
  bleed: 50,
  anchor: 'pasta tabanı (0,0)',
  points: { top: [0, -78], slice: [118, -25], knife: [70, -120] },
  params: {
    color: { type: 'color', default: 'accent', desc: 'pasta kreması rengi (tek vurgu rengi)' },
    at: { type: 'time', default: null, desc: 'kesme anı — 0.25 sn bıçak inişi, 0.7 sn dilim kayması' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const body = k.rgba('dim'), frost = k.rgba(p.color);
    const d = p.at == null ? -1 : t - p.at;
    const cut = d >= 0;
    const plunge = cut ? k.clamp(d / 0.25, 0, 1) : 0; // bıçak inişi
    const slide = cut ? k.clamp((d - 0.3) / 0.7, 0, 1) : 0; // dilim kayması
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };

    // tabak
    disc(0, 14, 140, 12, k.rgba('panel2'));

    // pasta gövdesi — kesilmeden önce tek parça; dilim ayrılınca ana gövde kesimde biter
    const mainW = slide > 0 ? 194 : 260; // -130 .. 64 veya -130 .. 130
    const topCx = slide > 0 ? -33 : 0, topRx = slide > 0 ? 99 : 130;
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); k.rrect(-124, -64, mainW, 84, 14); ctx.fill();
    blob(-130, -70, mainW, 84, 14, body);
    // üst krema
    ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(topCx, -70, topRx + 3, 26, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = frost; ctx.beginPath(); ctx.ellipse(topCx, -70, topRx, 23, 0, 0, k.TAU); ctx.fill();
    // krema damlaları (dilim ayrılınca sağdakiler dilimle gider)
    const drips = slide > 0 ? [-112, -72, -30, 8, 46] : [-112, -72, -30, 8, 46, 92, 118];
    for (const dx of drips) disc(dx, -52, 7, 10, frost);
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-88, -58, 28, 9, -0.25, 0, k.TAU); ctx.fill();
    // kiraz (sol üstte)
    disc(-40, -92, 11, 11, k.rgba('red'));
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-40, -102); ctx.quadraticCurveTo(-30, -112, -20, -108); ctx.stroke();

    // kesim çizgisi: bıçak indikten sonra belirir
    if (cut && plunge > 0.5) {
      ctx.strokeStyle = k.rgba('ink', 0.55 * plunge); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(64, -70); ctx.lineTo(64, 12); ctx.stroke();
    }

    // dilim ayrılınca: ana pastanın kesik yüzeyi + kayan dilim
    if (slide > 0) {
      // ana pasta kesik yüzeyi (iç katmanlar)
      ctx.fillStyle = k.rgba('panel');
      ctx.beginPath(); ctx.rect(54, -62, 10, 68); ctx.fill();
      ctx.fillStyle = frost;
      ctx.beginPath(); ctx.rect(54, -40, 10, 8); ctx.fill();
      ctx.beginPath(); ctx.rect(54, -12, 10, 8); ctx.fill();
      // dilim (sağ kısım): kesilince sağa kayar, hafif döner
      ctx.save();
      const sx = slide * 42, srot = slide * 0.12;
      ctx.translate(64 + sx, 0);
      ctx.rotate(srot);
      ctx.translate(-64, 0);
      ctx.fillStyle = k.rgba('bg', 0.32);
      ctx.beginPath(); k.rrect(70, -64, 66, 84, 14); ctx.fill();
      blob(64, -70, 66, 84, 14, body);
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(97, -70, 35, 23, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = frost; ctx.beginPath(); ctx.ellipse(97, -70, 32, 20, 0, 0, k.TAU); ctx.fill();
      disc(112, -52, 7, 10, frost);
      // dilim kesik yüzeyi (sol kenar, iç katmanlar)
      ctx.fillStyle = k.rgba('panel');
      ctx.beginPath(); ctx.rect(64, -62, 10, 68); ctx.fill();
      ctx.fillStyle = frost;
      ctx.beginPath(); ctx.rect(64, -40, 10, 8); ctx.fill();
      ctx.beginPath(); ctx.rect(64, -12, 10, 8); ctx.fill();
      ctx.restore();
    }

    // kırıntılar: kesim anında saçılır, 1 sn içinde söner
    if (cut && d < 1.0) {
      for (let i = 0; i < 6; i++) {
        const h1 = k.hash(i * 11 + 5), h2 = k.hash(i * 17 + 21);
        const u = k.clamp(d / 0.7, 0, 1);
        const x = 64 + (h1 - 0.2) * 60 * u + slide * 42 * u;
        const y = -30 + h2 * 40 * u + 30 * u * u;
        ctx.fillStyle = k.rgba('dim', 0.8 * (1 - u));
        ctx.beginPath(); ctx.arc(x, y, 2.5 + h2 * 2, 0, k.TAU); ctx.fill();
      }
    }

    // bıçak: kesimden önce hafif salınım (canlı idle), sonra iner
    const bob = cut ? 0 : Math.sin(t * k.TAU / 2.4) * 3;
    ctx.save();
    ctx.translate(70, -118 + bob + plunge * 46);
    ctx.rotate(0.28);
    // sap
    blob(-8, -34, 16, 40, 7, k.rgba('ink'));
    // bıçak ağzı
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.moveTo(-9, 6); ctx.lineTo(9, 6); ctx.lineTo(7, 52); ctx.lineTo(-9, 52); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.moveTo(-6, 8); ctx.lineTo(6, 8); ctx.lineTo(5, 50); ctx.lineTo(-6, 50); ctx.closePath(); ctx.fill();
    ctx.restore();
  },
};
